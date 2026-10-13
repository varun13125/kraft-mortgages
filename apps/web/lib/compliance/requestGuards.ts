/**
 * Lightweight abuse guards for public, unauthenticated form endpoints
 * (contact / lead / business-funding / calculator-report / compliance log).
 *
 * IMPORTANT: the rate limiter is in-memory and therefore per serverless
 * instance - it stops naive scripted floods and repeated submissions but is
 * NOT a global limit. For a hard guarantee put Vercel WAF rate-limiting rules
 * (or Upstash/Vercel KV) in front of /api/contact, /api/lead and
 * /api/business-funding.
 */
import { NextResponse } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (buckets.size > 10_000) {
    buckets.forEach((b, k) => {
      if (b.resetAt <= now) buckets.delete(k);
    });
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Client IP. On Vercel `x-forwarded-for` / `x-real-ip` are set by the edge (client values are overwritten). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
  );
}

/** Convenience: apply an IP-keyed limit for a named endpoint; returns a 429 response or null. */
export function limitByIp(req: Request, scope: string, limit: number, windowMs: number) {
  const r = rateLimit(`${scope}:${getClientIp(req)}`, limit, windowMs);
  return r.ok ? null : tooManyRequests(r.retryAfterSec);
}

// --- PII-safe logging helpers (PIPEDA: avoid writing full contact details to logs) ---

export function maskEmail(email?: string | null): string {
  if (!email) return '-';
  const [user, domain] = String(email).split('@');
  if (!domain) return '***';
  return `${user.slice(0, 1)}***@${domain}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return '-';
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 4 ? `***${digits.slice(-4)}` : '***';
}

/** Normalised digits-only phone, used as a dedupe key. */
export function phoneKey(phone?: string | null): string {
  return String(phone || '').replace(/\D/g, '').slice(-10);
}
