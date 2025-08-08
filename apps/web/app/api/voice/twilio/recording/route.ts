import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

async function transcribeOpenAI(url: string) {
  // Downloads audio and sends to OpenAI Whisper — simplistic implementation
  try {
    const audioRes = await fetch(url);
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
  const from = (form.get("From") || "").toString();
  const recUrl = (form.get("RecordingUrl") || "").toString();
  const text = recUrl ? await transcribeOpenAI(recUrl + ".mp3") : "";

  if (text) {
    await prisma.lead.create({ data: { province: "AB", intent: "voice_inquiry", details: { from, text }, score: 80 } });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thank you. We have your message.</Say>
  <Say>A licensed advisor will follow up shortly.</Say>
  <Hangup/>
</Response>`;
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}
