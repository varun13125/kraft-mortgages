import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/compliance/requestGuards';

/**
 * CSP violation report sink (BUG-011). The Content-Security-Policy-Report-Only
 * header (next.config.mjs) points `report-uri` / `report-to` here.
 *
 * Accepts both formats:
 *  - `application/csp-report`   (report-uri):  { "csp-report": { ... } }
 *  - `application/reports+json` (Reporting API / report-to): [{ type: "csp-violation", body: { ... } }]
 *
 * Public by necessity (browsers send these unauthenticated), so: body capped at
 * 16 KB, per-IP rate limit, and only a compact one-line summary is logged
 * (directive, blocked-URI origin, document path - no query strings, no PII).
 * Always answers 204 (429 when rate limited).
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16 * 1024;
const MAX_REPORTS_LOGGED = 10;

const noContent = () => new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

/** Read at most `max` bytes; returns null when the body is larger. */
async function readCappedText(req: NextRequest, max: number): Promise<string | null> {
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > max) return null;
  if (!req.body) return '';
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(buf);
}

/** Keep log lines single-line and short (no control chars, no log injection). */
const clean = (v: unknown, max = 80) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);

/** Origin of a blocked URL, or the CSP keyword ("inline", "eval", "data", ...). */
function blockedOrigin(raw: unknown): string {
  const v = clean(raw, 300);
  if (!v) return '-';
  try {
    const u = new URL(v);
    if (u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'wss:' || u.protocol === 'ws:') return u.origin;
    return u.protocol.replace(/:$/, ''); // data:, blob:, chrome-extension:, ...
  } catch {
    return clean(v.split(/[?#\s]/)[0], 40); // keywords like "inline", "eval", "self"
  }
}

/** Path of the page that triggered the report, without query string or fragment. */
function documentPath(raw: unknown): string {
  const v = clean(raw, 500);
  if (!v) return '-';
  try {
    return clean(new URL(v).pathname, 120);
  } catch {
    return '-';
  }
}

type Summary = { directive: string; blocked: string; doc: string; disposition: string };

function summarize(body: Record<string, unknown>, legacy: boolean): Summary {
  const get = (legacyKey: string, modernKey: string) => (legacy ? body[legacyKey] : body[modernKey]);
  return {
    directive: clean(get('effective-directive', 'effectiveDirective') || get('violated-directive', 'violatedDirective'), 60) || '-',
    blocked: blockedOrigin(get('blocked-uri', 'blockedURL')),
    doc: documentPath(get('document-uri', 'documentURL')),
    disposition: clean(get('disposition', 'disposition'), 10) || '-',
  };
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`csp-report:${getClientIp(req)}`, 60, 60 * 1000);
  if (!limit.ok) {
    return new NextResponse(null, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } });
  }

  const contentType = (req.headers.get('content-type') || '').toLowerCase();
  if (!/application\/(csp-report|reports\+json|json)/.test(contentType)) {
    return noContent();
  }

  let text: string | null;
  try {
    text = await readCappedText(req, MAX_BODY_BYTES);
  } catch {
    return noContent();
  }
  if (text === null) {
    return new NextResponse(null, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return noContent();
  }

  const summaries: Summary[] = [];
  if (Array.isArray(payload)) {
    // Reporting API: [{ type: "csp-violation", url, body: {...} }, ...]
    for (const report of payload.slice(0, MAX_REPORTS_LOGGED)) {
      const r = report as { type?: unknown; body?: unknown };
      if (r?.type === 'csp-violation' && r.body && typeof r.body === 'object') {
        summaries.push(summarize(r.body as Record<string, unknown>, false));
      }
    }
  } else if (payload && typeof payload === 'object' && (payload as any)['csp-report'] && typeof (payload as any)['csp-report'] === 'object') {
    summaries.push(summarize((payload as any)['csp-report'], true));
  }

  for (const s of summaries) {
    console.warn(`[csp] ${s.disposition} directive=${s.directive} blocked=${s.blocked} doc=${s.doc}`);
  }
  return noContent();
}
