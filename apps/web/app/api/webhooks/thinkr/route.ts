import { NextRequest, NextResponse } from "next/server";

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

async function sendToTwenty(data: Record<string, string>) {
  try {
    await fetch(TWENTY_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    });
  } catch (error) {
    console.error("Discord notification failed:", error);
  }
}

export async function POST(req: NextRequest) {
  // Verify webhook secret if configured
  if (THINKR_API_KEY) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${THINKR_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: ThinkrCallData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const crmData: Record<string, string> = {
    firstName: body.caller_name?.split(" ")[0] || "",
    lastName: body.caller_name?.split(" ").slice(1).join(" ") || "",
    email: body.caller_email || "",
    phone: body.caller_phone || "",
    source: "thinkr-voice-agent",
    message: [
      body.qualification
        ? `Qualification: ${JSON.stringify(body.qualification)}`
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

  console.log("Thinkr lead processed:", {
    name: body.caller_name,
    email: body.caller_email,
    call_id: body.call_id,
  });

  return NextResponse.json({ success: true });
}
