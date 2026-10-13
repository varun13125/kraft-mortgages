import { NextRequest } from "next/server";
import { prisma, isPrismaEnabled } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { isValidTwilioRequest, formDataToParams } from "@/lib/voice/twilio-signature";
import { maskPhone } from "@/lib/ai/request-guards";

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

type ServedProvince = "BC" | "AB" | "ON";

// Area codes (NPAs) for the provinces we serve, per the CRTC/CNA overlay decisions, including the
// newest overlays: BC 672 (2019) and 257 (2025); AB 368 (2022); ON 742 (2021), 753 and 683 (2022),
// 382 (2023) and 942 (2025). Reserved-but-unassigned relief codes are not listed.
const AREA_CODE_PROVINCE: Record<string, ServedProvince> = {
  "236": "BC", "250": "BC", "257": "BC", "604": "BC", "672": "BC", "778": "BC",
  "368": "AB", "403": "AB", "587": "AB", "780": "AB", "825": "AB",
  "226": "ON", "249": "ON", "289": "ON", "343": "ON", "365": "ON", "382": "ON", "416": "ON",
  "437": "ON", "519": "ON", "548": "ON", "613": "ON", "647": "ON", "683": "ON", "705": "ON",
  "742": "ON", "753": "ON", "807": "ON", "905": "ON", "942": "ON",
};

/** NANP area code of an E.164 / 10-digit number, or null. */
function areaCodeOf(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1, 4);
  if (digits.length === 10) return digits.slice(0, 3);
  return null;
}

/** Province inferred from the caller's area code; null when unknown or outside BC/AB/ON. */
function provinceFromPhone(phone: string): ServedProvince | null {
  const npa = areaCodeOf(phone);
  return npa ? AREA_CODE_PROVINCE[npa] ?? null : null;
}

// Twilio waits ~15 s for this callback's TwiML, so the inline transcription is time-boxed.
const RECORDING_FETCH_TIMEOUT_MS = 5_000;
const TRANSCRIBE_TIMEOUT_MS = 8_000;

async function transcribeOpenAI(url: string) {
  // Downloads audio and sends to OpenAI Whisper — simplistic implementation
  try {
    if (!process.env.OPENAI_API_KEY) return "";
    // Twilio recording media requires account auth when "enforce HTTP auth on media URLs" is on.
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const audioRes = await fetch(url, {
      ...(sid && token ? { headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}` } } : {}),
      signal: AbortSignal.timeout(RECORDING_FETCH_TIMEOUT_MS),
    });
    if (!audioRes.ok) return "";
    const audioBuffer = await audioRes.arrayBuffer();
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const form = new FormData();
    form.append("file", blob, "call.mp3");
    form.append("model", "whisper-1");
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
      signal: AbortSignal.timeout(TRANSCRIBE_TIMEOUT_MS),
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
    // BUG-030: province comes from the caller's area code (null when unknown), and the lead is left
    // unscored for triage instead of being given an invented score of 80.
    const areaCode = areaCodeOf(from);
    const province = provinceFromPhone(from);
    const details = {
      from,
      text,
      areaCode,
      provinceSource: province ? "caller-area-code" : "unknown",
      scoreStatus: "unscored",
    };
    try {
      if (isPrismaEnabled()) {
        // Prisma's Lead.province is a required BC/AB/ON enum and score defaults to 0, so an unknown
        // province is stored as the head-office province and labelled in details.provinceSource.
        await prisma.lead.create({
          data: {
            province: province ?? "BC",
            intent: "voice_inquiry",
            details: province ? details : { ...details, provinceSource: "unknown-defaulted-to-BC" },
          },
        });
      } else {
        const db = firestore();
        await (await db.collection("leads")).add({ province, intent: "voice_inquiry", details, score: null, status: "NEW", createdAt: new Date() });
      }
    } catch (err) {
      // Still answer Twilio with TwiML; a 500 here would make the caller hear an application error.
      console.error("[twilio/recording] Failed to store voicemail lead from", maskPhone(from), err instanceof Error ? err.message : err);
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
