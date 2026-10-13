/**
 * Shared request guards for the public AI / chat / voice API routes.
 *
 * - rateLimit(): best-effort, in-memory sliding-window limiter keyed by IP + bucket.
 *   NOTE: on serverless (Vercel) each warm instance keeps its own counters, so this
 *   only blunts naive abuse. A durable limiter (Vercel WAF rule, Upstash/KV) is still
 *   recommended for the paid-credit endpoints.
 * - requireAdmin(): Firebase ID token (Authorization: Bearer <token>) + Firestore admin
 *   check, mirroring the pattern used by /api/run and /api/check-admin. Firebase modules
 *   are imported lazily so route modules stay cheap to evaluate at build time.
 * - redactPII(): masks emails / phone numbers before text is written to logs or
 *   in-memory audit buffers.
 */
import { NextRequest, NextResponse } from "next/server";

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || (req as any).ip || "unknown";
}

/**
 * Returns { ok: true } when the request is within `limit` hits per `windowMs`
 * for the given bucket name, otherwise { ok: false, retryAfterSec }.
 */
export function rateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(req)}`;

  if (buckets.size > MAX_TRACKED_KEYS) {
    // Drop entries whose newest hit is outside any reasonable window.
    buckets.forEach((b, k) => {
      if (!b.hits.length || now - b.hits[b.hits.length - 1] > 60 * 60 * 1000) buckets.delete(k);
    });
    if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
  }

  const entry = buckets.get(key) || { hits: [] };
  entry.hits = entry.hits.filter((t) => now - t < windowMs);
  if (entry.hits.length >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - entry.hits[0])) / 1000));
    buckets.set(key, entry);
    return { ok: false, retryAfterSec };
  }
  entry.hits.push(now);
  buckets.set(key, entry);
  return { ok: true };
}

export function tooManyRequests(retryAfterSec: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment and try again.", ...extra },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

/**
 * Verifies `Authorization: Bearer <Firebase ID token>` belongs to an admin.
 * Returns null when authorised, or a 401/403/500 response to return directly.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }

  let uid: string;
  try {
    const { verifyFirebaseToken } = await import("@/lib/auth");
    const decoded = await verifyFirebaseToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid authentication token." }, { status: 401 });
  }

  try {
    const { isAdmin } = await import("@/lib/db/firestore");
    if (!(await isAdmin(uid))) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
  } catch (err) {
    console.error("[requireAdmin] Admin lookup failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to verify admin status." }, { status: 500 });
  }

  return null;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

export function redactPII(text: string): string {
  if (!text) return "";
  return text.replace(EMAIL_RE, "[email]").replace(PHONE_RE, "[phone]");
}

/** Masks all but the last 4 digits of a phone number for logging. */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length <= 4 ? "****" : `***${digits.slice(-4)}`;
}
