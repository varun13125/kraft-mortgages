import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // The caller is told the message is recorded and transcribed, and why, before <Record>
  // starts (PIPEDA notice-of-purpose for call recording).
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling Kraft Mortgages Canada.</Say>
  <Say>Your message will be recorded and transcribed so a licensed advisor can follow up on your inquiry.</Say>
  <Say>After the tone, please briefly describe your mortgage question. Press pound when finished.</Say>
  <Record maxLength="60" finishOnKey="#" action="/api/voice/twilio/recording" playBeep="true" />
</Response>`;
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}
