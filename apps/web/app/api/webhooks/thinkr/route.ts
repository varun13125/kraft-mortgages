import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { maskPhone } from "@/lib/ai/request-guards";

const THINKR_API_KEY = process.env.THINKR_WEBHOOK_SECRET || "";
const TWENTY_WEBHOOK =
  process.env.TWENTY_WEBHOOK_URL ||
  "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";
const DISCORD_WEBHOOK = process.env.DISCORD_LEAD_WEBHOOK_URL || "";

interface ThinkrCallData {
  caller_name?: string;
  caller_email?: string;
  caller_phone?: string;
  call_id?: string;
  agent_id?: string;
  duration?: number;
  qualification?: Record<string, string>;
  sentiment?: string;
  transcript?: string;
  appointment_scheduled?: boolean;
  appointment_time?: string;
}

function bearerMatches(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header || "");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

const str = (v: unknown, max: number): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

async function sendToTwenty(data: Record<string, string>) {
  try {
    await fetch(TWENTY_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Twenty CRM forward failed:", error);
  }
}

async function sendDiscordNotification(data: ThinkrCallData) {
  if (!DISCORD_WEBHOOK) return;
  try {
    const durationStr = data.duration
      ? `${Math.floor(data.duration / 60)}m ${data.duration % 60}s`
      : "—";

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Caller-supplied text must never trigger @everyone / @here / role pings.
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "📞 Voice Agent Lead — Thinkr",
            color: 0x22c55e,
            fields: [
              { name: "Name", value: data.caller_name || "Unknown", inline: true },
              { name: "Email", value: data.caller_email || "—", inline: true },
              { name: "Phone", value: data.caller_phone || "—", inline: true },
              { name: "Duration", value: durationStr, inline: true },
              { name: "Sentiment", value: data.sentiment || "—", inline: true },
              {
                name: "Appointment",
                value: data.appointment_scheduled ? data.appointment_time || "Yes" : "No",
                inline: true,
              },
              {
                name: "Transcript",
                value: data.transcript?.slice(0, 500) || "—",
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Discord notification failed:", error instanceof Error ? error.message : error);
  }
}

export async function POST(req: NextRequest) {
  // Verify webhook secret if configured (constant-time comparison).
  if (THINKR_API_KEY) {
    if (!bearerMatches(req.headers.get("authorization"), THINKR_API_KEY)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Still accepted (to avoid silently dropping real leads), but anyone can forge these
    // until THINKR_WEBHOOK_SECRET is set in Vercel and in the Thinkrr webhook config.
    console.error("[thinkr-webhook] THINKR_WEBHOOK_SECRET is not set - webhook is unauthenticated");
  }

  let raw: any;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Normalise / bound untrusted fields before forwarding them to the CRM and Discord.
  const durationNum = Number(raw.duration);
  const body: ThinkrCallData = {
    caller_name: str(raw.caller_name, 120),
    caller_email: str(raw.caller_email, 254),
    caller_phone: str(raw.caller_phone, 32),
    call_id: str(raw.call_id, 100),
    agent_id: str(raw.agent_id, 100),
    duration: Number.isFinite(durationNum) && durationNum >= 0 ? Math.floor(durationNum) : undefined,
    qualification:
      raw.qualification && typeof raw.qualification === "object" && !Array.isArray(raw.qualification)
        ? raw.qualification
        : undefined,
    sentiment: str(raw.sentiment, 50),
    transcript: str(raw.transcript, 5000),
    appointment_scheduled: raw.appointment_scheduled === true,
    appointment_time: str(raw.appointment_time, 100),
  };

  const crmData: Record<string, string> = {
    firstName: body.caller_name?.split(" ")[0] || "",
    lastName: body.caller_name?.split(" ").slice(1).join(" ") || "",
    email: body.caller_email || "",
    phone: body.caller_phone || "",
    source: "thinkr-voice-agent",
    message: [
      body.qualification
        ? `Qualification: ${JSON.stringify(body.qualification).slice(0, 1000)}`
        : "",
      body.sentiment ? `Sentiment: ${body.sentiment}` : "",
      body.appointment_scheduled
        ? `Appointment: ${body.appointment_time || "scheduled"}`
        : "",
      body.transcript ? `Transcript: ${body.transcript.slice(0, 500)}` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };

  await sendToTwenty(crmData);
  await sendDiscordNotification(body);

  // No names/emails in logs (PII); a masked phone + call id is enough to correlate.
  console.log("Thinkr lead processed:", {
    call_id: body.call_id,
    phone: maskPhone(body.caller_phone),
    hasEmail: Boolean(body.caller_email),
  });

  return NextResponse.json({ success: true });
}
