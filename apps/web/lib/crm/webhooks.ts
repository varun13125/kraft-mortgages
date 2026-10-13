/**
 * Outbound CRM webhook endpoints (BUG-022).
 *
 * The Twenty CRM (via n8n) and GoHighLevel webhook URLs used to be hard-coded
 * in three routes. They are now configurable; the defaults are the URLs that
 * were live before, so nothing changes until the env vars are set.
 *
 *   TWENTY_WEBHOOK_URL  - n8n "contact-form" webhook that creates the Twenty lead
 *                         (/api/contact and /api/webhooks/facebook)
 *   GHL_WEBHOOK_URL     - GoHighLevel / LeadConnector inbound webhook
 *                         (/api/business-funding)
 *   CRM_WEBHOOK_SECRET  - optional shared secret, sent as `X-Webhook-Secret` on
 *                         both. Set it in Vercel FIRST, deploy, then make n8n
 *                         (Webhook node -> Header Auth) / the GHL workflow
 *                         require it; the other order drops leads into the
 *                         Firestore/Discord fallbacks until the env var is live.
 */

export const DEFAULT_TWENTY_WEBHOOK_URL = "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";
export const DEFAULT_GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/H8IiiebU1Da0epvedovb/webhook-trigger/faa24cae-1c75-43c4-b2e1-409f775d9d32";

function httpsUrlOr(value: string | undefined, fallback: string, name: string): string {
  const v = (value || "").trim();
  if (!v) return fallback;
  try {
    const u = new URL(v);
    if (u.protocol === "https:") return u.toString();
  } catch {
    // fall through
  }
  console.error(`[crm] ${name} is not a valid https URL - using the built-in default`);
  return fallback;
}

/** n8n webhook that creates the lead in Twenty CRM. */
export function twentyWebhookUrl(): string {
  return httpsUrlOr(process.env.TWENTY_WEBHOOK_URL, DEFAULT_TWENTY_WEBHOOK_URL, "TWENTY_WEBHOOK_URL");
}

/** GoHighLevel (LeadConnector) inbound webhook for business-funding applications. */
export function ghlWebhookUrl(): string {
  return httpsUrlOr(process.env.GHL_WEBHOOK_URL, DEFAULT_GHL_WEBHOOK_URL, "GHL_WEBHOOK_URL");
}

/** JSON headers for CRM webhooks, plus `X-Webhook-Secret` when CRM_WEBHOOK_SECRET is set. */
export function crmWebhookHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  if (secret) headers["X-Webhook-Secret"] = secret;
  return headers;
}

/** For health checks: which CRM settings are configured (booleans only, never values). */
export function crmConfigStatus() {
  return {
    twentyWebhookUrlSet: !!process.env.TWENTY_WEBHOOK_URL?.trim(),
    ghlWebhookUrlSet: !!process.env.GHL_WEBHOOK_URL?.trim(),
    crmWebhookSecretSet: !!process.env.CRM_WEBHOOK_SECRET?.trim(),
  };
}
