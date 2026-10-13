import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { triggerThinkrOutboundCall } from "@/lib/voice/thinkr";
import { maskEmail } from "@/lib/compliance/requestGuards";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || "";
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "";

const TWENTY_WEBHOOK =
  process.env.TWENTY_WEBHOOK_URL ||
  "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";

const DISCORD_WEBHOOK = process.env.DISCORD_LEAD_WEBHOOK_URL || "";

function verifySignature(payload: string, signature: string): boolean {
  if (!APP_SECRET) return false;
  const expected = Buffer.from(
    `sha256=${createHmac("sha256", APP_SECRET).update(payload).digest("hex")}`
  );
  const given = Buffer.from(signature || "");
  // constant-time compare
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function fetchLeadData(leadgenId: string): Promise<Record<string, string> | null> {
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
    const url = `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN)}`;
    const res = await fetch(url);
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
    return fields;
  } catch (error) {
    console.error("Failed to fetch lead data:", error);
    return null;
  }
}

async function sendToTwenty(data: Record<string, string>) {
  try {
    await fetch(TWENTY_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: "facebook-lead-ad",
      }),
    });
  } catch (error) {
    console.error("Twenty CRM forward failed:", error);
  }
}

async function sendDiscordNotification(data: Record<string, string>) {
  if (!DISCORD_WEBHOOK) return;
  try {
    await fetch(DISCORD_WEBHOOK, {
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
  } catch (error) {
    console.error("Discord notification failed:", error);
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

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.value?.leadgen_id) {
        const leadData = await fetchLeadData(change.value.leadgen_id);
        if (leadData) {
          const crmData: Record<string, string> = {
            firstName: leadData.full_name?.split(" ")[0] || leadData.first_name || "",
            lastName:
              leadData.full_name?.split(" ").slice(1).join(" ") ||
              leadData.last_name || "",
            email: leadData.email || "",
            phone: leadData.phone_number || leadData.phone || "",
            source: "facebook-lead-ad",
          };

          await sendToTwenty(crmData);
          await sendDiscordNotification(leadData);

          // Real-time speed-to-lead qualification call via Thinkrr AI
          // (only for signature-verified payloads)
          if (crmData.phone && signatureVerified) {
            await triggerThinkrOutboundCall({
              name: `${crmData.firstName} ${crmData.lastName}`.trim() || "Facebook Lead",
              phone: crmData.phone,
              email: crmData.email,
              customGreeting: `Hi ${crmData.firstName || "there"}, thank you for requesting mortgage options on our Facebook ad. Kraft Mortgages is ready to assist you!`
            });
          }

          console.log("Facebook lead processed:", {
            email: maskEmail(crmData.email),
            verified: signatureVerified,
          });
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
