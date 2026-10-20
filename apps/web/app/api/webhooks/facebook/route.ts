import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { AUTOMATED_CALLBACKS_ENABLED } from "@/lib/voice/workflow";
import { triggerThinkrOutboundCall } from "@/lib/voice/thinkr";
import { getCallingHoursStatus, isRecipientCallable } from "@/lib/businessHours";
import { maskEmail } from "@/lib/compliance/requestGuards";
import { submitCrmLead } from "@/lib/crm/submitLead";
import { firestore } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || "";
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "";

const DISCORD_WEBHOOK = process.env.DISCORD_LEAD_WEBHOOK_URL || "";

/**
 * BUG-024: Facebook retries deliveries (and can send the same lead twice), and
 * each delivery used to create another CRM lead, Discord alert and paid AI call.
 * Claim the leadgen_id with an atomic Firestore create() before any side effect:
 *  - "claimed"   -> first delivery, process it
 *  - "duplicate" -> already processed, skip (still ACK 200)
 *  - "unavailable" -> Firestore not reachable/configured: process anyway (log it),
 *                     because losing a lead is worse than a duplicate.
 * The marker holds no PII.
 */
type ClaimResult = "claimed" | "duplicate" | "unavailable";

const FB_LEADS_COLLECTION = "fbLeads";

function isAlreadyExists(err: unknown): boolean {
  const e = err as { code?: unknown; message?: unknown } | null;
  return e?.code === 6 || e?.code === "already-exists" || /ALREADY_EXISTS/i.test(String(e?.message || ""));
}

async function claimLead(leadgenId: string, meta: Record<string, string | boolean>): Promise<ClaimResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const create = firestore()
      .collection(FB_LEADS_COLLECTION)
      .doc(leadgenId)
      .create({ ...meta, receivedAt: new Date() });
    // Never let a hanging credential lookup block the webhook for long.
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("fbLeads claim timed out")), 5000);
    });
    await Promise.race([create, timeout]);
    return "claimed";
  } catch (err) {
    if (isAlreadyExists(err)) return "duplicate";
    console.error(
      "[facebook] Dedupe store unavailable - processing lead without dedupe:",
      err instanceof Error ? err.message.split("\n")[0] : err
    );
    return "unavailable";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function markLeadProcessed(leadgenId: string, result: Record<string, boolean>) {
  try {
    await firestore().collection(FB_LEADS_COLLECTION).doc(leadgenId).update({ ...result, processedAt: new Date() });
  } catch {
    // best effort only
  }
}

function verifySignature(payload: string, signature: string): boolean {
  if (!APP_SECRET) return false;
  const expected = Buffer.from(
    `sha256=${createHmac("sha256", APP_SECRET).update(payload).digest("hex")}`
  );
  const given = Buffer.from(signature || "");
  // constant-time compare
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * BUG-005 (owner decision 2026-10-13): an automated AI call needs express consent.
 * Facebook leads have no site checkbox, so consent must come from the Lead Ad form:
 *  - a custom question whose field name contains "consent", "call" or "agree"
 *    (case-insensitive) answered yes / true / "I agree"; or
 *  - a custom-disclaimer checkbox whose key contains "call", ticked.
 * Anything else = no call (the lead is still forwarded to the CRM and Discord).
 */
const CONSENT_FIELD_NAME = /consent|call|agree/i;
const AFFIRMATIVE_ANSWER = /^(?:yes|true|i agree)\b/i;

function detectCallConsent(fieldData: unknown, disclaimers: unknown): { callConsent: boolean; evidence: string } {
  for (const field of Array.isArray(fieldData) ? fieldData : []) {
    const name = String((field as any)?.name || "");
    if (!CONSENT_FIELD_NAME.test(name)) continue;
    const raw = (field as any)?.values;
    const values: unknown[] = Array.isArray(raw) ? raw : [raw];
    if (values.some((v) => AFFIRMATIVE_ANSWER.test(String(v ?? "").trim()))) {
      return { callConsent: true, evidence: `field:${name.slice(0, 80)}` };
    }
  }
  for (const d of Array.isArray(disclaimers) ? disclaimers : []) {
    const key = String((d as any)?.checkbox_key || "");
    const checked = (d as any)?.is_checked;
    if (/call/i.test(key) && (checked === true || checked === 1 || checked === "1" || checked === "true")) {
      return { callConsent: true, evidence: `disclaimer:${key.slice(0, 80)}` };
    }
  }
  return { callConsent: false, evidence: "" };
}

type FacebookLead = { fields: Record<string, string>; callConsent: boolean; consentEvidence: string };

async function fetchLeadData(leadgenId: string): Promise<FacebookLead | null> {
  // leadgen IDs are numeric; reject anything else so a forged payload cannot
  // inject extra Graph API path/query segments into a page-token request.
  if (!/^\d{1,32}$/.test(String(leadgenId))) {
    console.warn("Rejected non-numeric leadgen_id");
    return null;
  }
  if (!PAGE_ACCESS_TOKEN) {
    console.error("FACEBOOK_PAGE_ACCESS_TOKEN is not set; cannot fetch lead data");
    return null;
  }
  try {
    const base = `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN)}`;
    // Ask for the custom-disclaimer (checkbox) answers too; if Graph rejects the
    // field list for any reason, fall back to the default fields so the lead is not lost.
    let res = await fetch(`${base}&fields=id,created_time,field_data,custom_disclaimer_responses`);
    if (res.status === 400) res = await fetch(base);
    if (!res.ok) {
      console.error("Graph API error:", res.status);
      return null;
    }
    const data = await res.json();
    const fields: Record<string, string> = {};
    for (const field of data.field_data || []) {
      fields[field.name] = Array.isArray(field.values)
        ? field.values.join(", ")
        : String(field.values);
    }
    const { callConsent, evidence } = detectCallConsent(data.field_data, data.custom_disclaimer_responses);
    return { fields, callConsent, consentEvidence: evidence };
  } catch (error) {
    console.error("Failed to fetch lead data:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Twenty on the VPS is the brokerage CRM; require its complete receipt.
async function sendToTwenty(data: Record<string, string>): Promise<boolean> {
  return submitCrmLead({ ...data, source: "facebook-lead-ad", dispatchMode: "none" });
}

async function sendDiscordNotification(data: Record<string, string>): Promise<boolean> {
  if (!DISCORD_WEBHOOK) return false;
  try {
    const res = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "🆕 New Lead — Facebook Lead Ad",
            color: 0x1877f2,
            fields: [
              { name: "Name", value: data.full_name || data.firstName || "Unknown", inline: true },
              { name: "Email", value: data.email || "—", inline: true },
              { name: "Phone", value: data.phone_number || data.phone || "—", inline: true },
              { name: "Ad Source", value: "Facebook Lead Ad", inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Discord notification failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

// Webhook verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // An unset verify token must never match an empty hub.verify_token
  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    console.log("Facebook webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// Lead data ingestion (POST)
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  // Signature verification. When FACEBOOK_APP_SECRET is configured, unsigned or
  // mis-signed requests are rejected. If it is NOT configured we cannot verify the
  // sender, so leads are still forwarded to the CRM/Discord (no data loss) but the
  // outbound AI call is suppressed - otherwise anyone could make us phone arbitrary
  // numbers. Set FACEBOOK_APP_SECRET in production.
  const signatureVerified = APP_SECRET ? verifySignature(rawBody, signature) : false;
  if (APP_SECRET && !signatureVerified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!APP_SECRET) {
    console.warn("FACEBOOK_APP_SECRET not set - webhook payload is unverified; outbound calls disabled");
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.object !== "page") {
    return NextResponse.json({ error: "Invalid object" }, { status: 400 });
  }

  // CRTC calling-hours gate (lib/businessHours.ts, fails closed), evaluated once per delivery.
  const callingStatus = getCallingHoursStatus();

  let duplicates = 0;
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.value?.leadgen_id) {
        const leadgenId = String(change.value.leadgen_id);
        const lead = await fetchLeadData(leadgenId); // validates the id is numeric
        if (lead) {
          const leadData = lead.fields;
          // BUG-024: dedupe BEFORE any CRM write / Discord alert / outbound call.
          const numericOrEmpty = (v: unknown) => (/^\d{1,32}$/.test(String(v ?? "")) ? String(v) : "");
          const claim = await claimLead(leadgenId, {
            formId: numericOrEmpty(change.value.form_id),
            pageId: numericOrEmpty(change.value.page_id),
            signatureVerified,
          });
          if (claim === "duplicate") {
            duplicates++;
            console.log("Facebook lead already processed - skipping duplicate delivery");
            continue;
          }

          const crmData: Record<string, string> = {
            firstName: leadData.full_name?.split(" ")[0] || leadData.first_name || "",
            lastName:
              leadData.full_name?.split(" ").slice(1).join(" ") ||
              leadData.last_name || "",
            email: leadData.email || "",
            phone: leadData.phone_number || leadData.phone || "",
            source: "facebook-lead-ad",
            // CASL/CRTC evidence (BUG-005): what the Lead Ad form recorded.
            consentToContact: "true", // the person submitted the lead form
            consentToCall: lead.callConsent ? "true" : "false",
            consentEvidence: lead.consentEvidence,
            consentCapturedAt: new Date().toISOString(),
            consentSource: "facebook-lead-form",
          };
          // "none" tells n8n not to queue an AI call for this lead. (Consented leads
          // keep the previous payload shape - this route places the Thinkrr call itself.)
          if (!lead.callConsent) crmData.dispatchMode = "none";

          const crmForwarded = await sendToTwenty(crmData);
          const discordSent = await sendDiscordNotification(leadData);

          // Real-time speed-to-lead qualification call via Thinkrr AI - only for
          // signature-verified payloads, an affirmative consent answer in the form
          // (BUG-005) AND inside the server-side calling-hours window (same
          // fail-closed gate as /api/contact). Otherwise the lead is only forwarded.
          let callTriggered = false;
          const callSkip = !crmData.phone
            ? "no_phone"
            : !signatureVerified
              ? "unverified_payload"
              : !lead.callConsent
                ? "no_consent"
                : !callingStatus.isOpen || !isRecipientCallable(crmData.phone)
                  ? "after_hours"
                  : null;
          if (callSkip) {
            console.log(`Facebook lead: call_skipped: ${callSkip}`);
          } else {
            callTriggered = AUTOMATED_CALLBACKS_ENABLED && await triggerThinkrOutboundCall({
              name: `${crmData.firstName} ${crmData.lastName}`.trim() || "Facebook Lead",
              phone: crmData.phone,
              email: crmData.email,
              customGreeting: `Hi ${crmData.firstName || "there"}, thank you for requesting mortgage options on our Facebook ad. Kraft Mortgages is ready to assist you!`
            });
          }

          if (claim === "claimed") {
            await markLeadProcessed(leadgenId, { crmForwarded, discordSent, callTriggered, callConsent: lead.callConsent });
          }

          console.log("Facebook lead processed:", {
            email: maskEmail(crmData.email),
            verified: signatureVerified,
            crm: crmForwarded,
            dedupe: claim,
            call: callTriggered ? "dispatched" : callSkip ? `call_skipped: ${callSkip}` : "not_placed",
          });
        }
      }
    }
  }

  // Always ACK duplicates with 200 so Facebook stops retrying them.
  return NextResponse.json({ success: true, ...(duplicates ? { duplicates } : {}) });
}
