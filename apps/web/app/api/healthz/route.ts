import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, verifyCronRequest } from '@/lib/auth';
import { firestore, getServiceAccountFromEnv } from '@/lib/firebaseAdmin';
import { crmConfigStatus } from '@/lib/crm/webhooks';
import { isPrismaEnabled } from '@/lib/db';

export const dynamic = 'force-dynamic';

const set = (name: string) => !!process.env[name]?.trim();

/** Firestore round trip: a single read of a document that normally doesn't exist. */
async function checkFirestore(): Promise<{ status: 'ok' | 'error' | 'not_configured'; latencyMs?: number }> {
  if (!getServiceAccountFromEnv()) return { status: 'not_configured' };
  const started = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const read = firestore().collection('_healthz').doc('ping').get();
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('timeout')), 5000);
    });
    await Promise.race([read, timeout]);
    return { status: 'ok', latencyMs: Date.now() - started };
  } catch (err) {
    console.error('[healthz] Firestore check failed:', err instanceof Error ? err.message.split('\n')[0] : err);
    return { status: 'error', latencyMs: Date.now() - started };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * GET /api/healthz          -> shallow liveness, public: { ok: true } (unchanged)
 * GET /api/healthz?deep=1   -> cron secret / CREWAPI_SECRET or an admin Firebase token:
 *   Firestore reachability + which integrations are configured. Booleans only -
 *   never env values (BUG-050).
 */
export async function GET(req: NextRequest) {
  const deep = req.nextUrl.searchParams.get('deep');
  if (!deep || deep === '0' || deep === 'false') {
    return NextResponse.json({ ok: true });
  }

  if (!verifyCronRequest(req).ok) {
    const admin = await requireAdmin(req);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const fs = await checkFirestore();
  let prismaEnabled = false;
  try {
    prismaEnabled = isPrismaEnabled();
  } catch {
    prismaEnabled = false;
  }

  const integrations = {
    firebaseAdmin: !!getServiceAccountFromEnv(),
    firebaseWebConfig:
      set('NEXT_PUBLIC_FIREBASE_API_KEY') &&
      set('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') &&
      set('NEXT_PUBLIC_FIREBASE_PROJECT_ID') &&
      set('NEXT_PUBLIC_FIREBASE_APP_ID'),
    databaseUrl: set('DATABASE_URL'),
    prismaEnabled,
    siteUrl: set('NEXT_PUBLIC_SITE_URL'),
    adminBasicAuth: set('ADMIN_BASIC_AUTH_USER') && set('ADMIN_BASIC_AUTH_PASSWORD'),
    cronSecret: set('CRON_SECRET'),
    crewapiSecret: set('CREWAPI_SECRET'),
    crewapiBaseUrl: set('CREWAPI_BASE_URL'),
    blogIngestToken: set('BLOG_INGEST_TOKEN') || set('CREWAPI_SECRET'),
    discordLeadWebhook: set('DISCORD_LEAD_WEBHOOK_URL'),
    ...crmConfigStatus(),
    facebookAppSecret: set('FACEBOOK_APP_SECRET'),
    facebookPageAccessToken: set('FACEBOOK_PAGE_ACCESS_TOKEN'),
    facebookVerifyToken: set('FACEBOOK_WEBHOOK_VERIFY_TOKEN'),
    twilioAuthToken: set('TWILIO_AUTH_TOKEN'),
    vapiApiKey: set('VAPI_API_KEY'),
    thinkrApiKey: set('THINKR_API_KEY'),
    thinkrWebhookSecret: set('THINKR_WEBHOOK_SECRET'),
    wordpress: set('WORDPRESS_BASE_URL') && set('WORDPRESS_USERNAME') && set('WORDPRESS_APP_PASSWORD'),
    aiAutoPublish: process.env.AI_AUTO_PUBLISH === 'true',
    openrouterApiKey: set('OPENROUTER_API_KEY') || set('OPEN_ROUTER_API_KEY'),
    googleApiKey: set('GOOGLE_API_KEY'),
    ratesFeedUrl: set('RATES_FEED_URL'),
    fastapiBaseUrl: set('FASTAPI_BASE_URL'),
  };

  const ok = fs.status !== 'error';
  return NextResponse.json(
    {
      ok,
      checkedAt: new Date().toISOString(),
      checks: { firestore: fs },
      integrations,
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
