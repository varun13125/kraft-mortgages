/** Website -> VPS receiver -> Twenty CRM. The URL retains /webhook/contact-form,
 * but the running receiver is kraft-finmo-webhook (Node), not an n8n workflow.
 * TWENTY_WEBHOOK_URL overrides the endpoint. CRM_WEBHOOK_SECRET is optional.
 * Never route brokerage inquiries to the retired GoHighLevel integration.
 */
export const DEFAULT_TWENTY_WEBHOOK_URL = "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";
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

/** VPS contact receiver that records the complete inquiry in Twenty. */
export function twentyWebhookUrl(): string {
  return httpsUrlOr(process.env.TWENTY_WEBHOOK_URL, DEFAULT_TWENTY_WEBHOOK_URL, "TWENTY_WEBHOOK_URL");
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
    crmWebhookSecretSet: !!process.env.CRM_WEBHOOK_SECRET?.trim(),
  };
}
