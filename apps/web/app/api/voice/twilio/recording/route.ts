import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { isValidTwilioRequest, formDataToParams } from "@/lib/voice/twilio-signature";

// Twilio <Record> action callback. Must only be callable by Twilio: unsigned requests could
// previously (a) make the server fetch an arbitrary URL (SSRF), (b) spend OpenAI Whisper
// credits, and (c) inject fake score-80 leads.

/** Only Twilio-hosted recording URLs are fetched. */
function isTwilioRecordingUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" && (u.hostname === "api.twilio.com" || u.hostname.endsWith(".twilio.com"));
  } catch {
    return false;
  }
}

async function transcribeOpenAI(url: string) {
  // Downloads audio and sends to OpenAI Whisper — simplistic implementation
  try {
    if (!process.env.OPENAI_API_KEY) return "";
    // Twilio recording media requires account auth when "enforce HTTP auth on media URLs" is on.
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const audioRes = await fetch(url, sid && token ? { headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}` } } : undefined);
    if (!audioRes.ok) return "";
    const audioBuffer = await audioRes.arrayBuffer();
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const form = new FormData();
    form.append("file", blob, "call.mp3");
    form.append("model", "whisper-1");
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form
    });
    const j = await r.json();
    return j.text || "";
  } catch (e) {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();

  if (!isValidTwilioRequest(req, formDataToParams(form))) {
    console.warn("[twilio/recording] Rejected request with missing/invalid X-Twilio-Signature (or TWILIO_AUTH_TOKEN unset)");
    return new Response("Forbidden", { status: 403 });
  }

  const from = (form.get("From") || "").toString();
  const recUrl = (form.get("RecordingUrl") || "").toString();
  const text = recUrl && isTwilioRecordingUrl(recUrl) ? await transcribeOpenAI(recUrl + ".mp3") : "";

  if (text) {
    // NOTE: province is hard-coded to "AB" here (pre-existing behaviour) - see audit report.
    if (process.env.DATABASE_URL) {
      await prisma.lead.create({ data: { province: "AB", intent: "voice_inquiry", details: { from, text }, score: 80 } });
    } else {
      const db = firestore();
      await (await db.collection("leads")).add({ province: "AB", intent: "voice_inquiry", details: { from, text }, score: 80, status: "NEW", createdAt: new Date() });
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thank you. We have your message.</Say>
  <Say>A licensed advisor will follow up shortly.</Say>
  <Hangup/>
</Response>`;
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}
