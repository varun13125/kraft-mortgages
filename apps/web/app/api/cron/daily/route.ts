export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getTrustedOrigin, verifyCronRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // SECURITY: previously unauthenticated - anyone could start a paid crew run.
  const cron = verifyCronRequest(request, { allowUnverifiedVercelUa: true });
  if (!cron.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // BUG-050: the external crew host has its own SERVER-ONLY variable now.
  // NEXT_PUBLIC_CREWAPI_BASE_URL is still honoured for compatibility, except when
  // it points at this site's own /api (that value was meant for the dashboard,
  // and /api/run would reject the x-api-key with 401).
  const legacyBase = process.env.NEXT_PUBLIC_CREWAPI_BASE_URL?.trim();
  const legacyIsDashboardBase = !!legacyBase && /^\/api(?:\/|$)/.test(legacyBase);
  const configuredBase =
    process.env.CREWAPI_BASE_URL?.trim() ||
    (legacyBase && !legacyIsDashboardBase ? legacyBase : "") ||
    "/crewapi";
  const secret = process.env.CREWAPI_SECRET;

  // Server-side fetch() cannot use a relative URL ("/crewapi/run" threw
  // "Failed to parse URL", so this cron always failed when the env var was
  // unset). Resolve it against the site origin (NEXT_PUBLIC_SITE_URL, else this
  // deployment) so the /crewapi/* rewrite in apps/web/vercel.json is used.
  let base: string;
  try {
    base = new URL(configuredBase, getTrustedOrigin(request)).toString().replace(/\/+$/, "");
  } catch {
    console.error("[cron/daily] Invalid CREWAPI_BASE_URL / NEXT_PUBLIC_CREWAPI_BASE_URL");
    return NextResponse.json({ ok: false, error: "Crew API base URL misconfigured" }, { status: 500 });
  }
  if (!secret) {
    console.error("[cron/daily] CREWAPI_SECRET is not set");
    return NextResponse.json({ ok: false, error: "Crew API not configured" }, { status: 500 });
  }

  try {
    // First, create a new run in auto mode
    const runResponse = await fetch(`${base}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret
      },
      body: JSON.stringify({
        mode: "auto",
        targetProvinces: ["BC", "AB", "ON"]
      })
    });

    if (!runResponse.ok) {
      throw new Error(`Failed to create run (HTTP ${runResponse.status})`);
    }

    const { runId } = await runResponse.json();

    // Then trigger orchestration
    const orchResponse = await fetch(`${base}/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret
      },
      body: JSON.stringify({ runId })
    });

    if (!orchResponse.ok) {
      throw new Error(`Failed to orchestrate (HTTP ${orchResponse.status})`);
    }

    return NextResponse.json({
      ok: true,
      runId,
      message: "Daily content run started"
    });
  } catch (error) {
    console.error("Cron job failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({
      ok: false,
      error: "Daily content run failed"
    }, { status: 500 });
  }
}
