import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { createHash, timingSafeEqual } from 'crypto';
import { getServiceAccountFromEnv } from '@/lib/firebaseAdmin';
import { isAdmin } from '@/lib/db/firestore';

function ensureFirebaseAdmin() {
  if (getApps().length) {
    return;
  }

  // Shared credential parsing (FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT,
  // or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY)
  const serviceAccount = getServiceAccountFromEnv();

  // Only initialize if we have credentials to avoid build-time errors
  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
    } catch (err) {
      if (!getApps().length) {
        console.error('Firebase Admin initialization error:', err);
      }
    }
  } else {
    console.warn('Firebase Admin credentials missing or incomplete. Authentication features may fail at runtime.');
  }
}

export async function verifyFirebaseToken(token: string) {
  try {
    ensureFirebaseAdmin();
    if (!getApps().length) {
      throw new Error('Firebase Admin not initialized - missing credentials');
    }
    const authInstance = getAuth();
    const decodedToken = await authInstance.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error instanceof Error ? error.message : error);
    throw new Error('Invalid token');
  }
}

export const auth = {
  verifyIdToken: async (token: string) => {
    ensureFirebaseAdmin();
    if (!getApps().length) {
      throw new Error('Firebase Admin not initialized');
    }
    return getAuth().verifyIdToken(token);
  }
} as any;

// ---------------------------------------------------------------------------
// Request auth helpers for API routes
// ---------------------------------------------------------------------------

/** Constant-time string comparison (hash first so lengths always match). */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

export type AdminCheck =
  | { ok: true; uid: string; email?: string }
  | { ok: false; status: 401 | 403 | 500; error: string };

/**
 * Verifies `Authorization: Bearer <Firebase ID token>` belongs to an admin
 * (document in the `admins` Firestore collection - see isAdmin()).
 * Never throws; returns a status/error suitable for the response.
 */
export async function requireAdmin(req: Request, tokenOverride?: string | null): Promise<AdminCheck> {
  const token = tokenOverride ?? getBearerToken(req);
  if (!token) return { ok: false, status: 401, error: 'Missing or invalid Authorization header' };
  let decoded;
  try {
    decoded = await verifyFirebaseToken(token);
  } catch {
    return { ok: false, status: 401, error: 'Invalid authentication token' };
  }
  try {
    if (!(await isAdmin(decoded.uid))) {
      return { ok: false, status: 403, error: 'Admin access required' };
    }
  } catch (err) {
    console.error('Admin lookup failed:', err instanceof Error ? err.message : err);
    return { ok: false, status: 500, error: 'Failed to verify admin status' };
  }
  return { ok: true, uid: decoded.uid, email: decoded.email };
}

/** True when the request carries the shared CREWAPI_SECRET (x-api-key or Bearer). */
export function hasServiceSecret(req: Request): boolean {
  const secret = process.env.CREWAPI_SECRET;
  if (!secret) return false;
  return safeEqual(req.headers.get('x-api-key'), secret) || safeEqual(getBearerToken(req), secret);
}

export type CronCheck = { ok: true; via: 'cron_secret' | 'service_secret' | 'vercel_cron_ua_unverified' } | { ok: false };

/**
 * Authorises scheduled (cron) invocations.
 *
 * - `Authorization: Bearer <CRON_SECRET>` (Vercel sends this automatically when
 *   the CRON_SECRET env var is set on the project) - preferred.
 * - `x-api-key` / Bearer `<CREWAPI_SECRET>` - for the external crew service / manual runs.
 * - TRANSITIONAL: when CRON_SECRET is NOT configured and `allowUnverifiedVercelUa`
 *   is true, a `vercel-cron/*` user-agent is accepted so the existing daily cron
 *   keeps working. User-agents are spoofable - set CRON_SECRET to close this.
 */
export function verifyCronRequest(req: Request, opts: { allowUnverifiedVercelUa?: boolean } = {}): CronCheck {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && safeEqual(getBearerToken(req), cronSecret)) return { ok: true, via: 'cron_secret' };
  if (hasServiceSecret(req)) return { ok: true, via: 'service_secret' };
  if (!cronSecret && opts.allowUnverifiedVercelUa) {
    const ua = req.headers.get('user-agent') || '';
    if (ua.startsWith('vercel-cron/')) {
      console.warn('[cron] CRON_SECRET is not set - accepting request on user-agent only (spoofable). Set CRON_SECRET in Vercel to secure cron endpoints.');
      return { ok: true, via: 'vercel_cron_ua_unverified' };
    }
  }
  return { ok: false };
}

/**
 * Origin to use for server-to-self fetches. Prefers the configured site URL so a
 * forged Host / X-Forwarded-Host header can never redirect a request carrying
 * secrets or tokens to another server.
 */
export function getTrustedOrigin(req: { nextUrl: URL }): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // fall through
    }
  }
  return req.nextUrl.origin;
}
