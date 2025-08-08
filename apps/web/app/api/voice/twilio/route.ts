import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling Kraft Mortgages Canada. An advisor will text you shortly with rates and next steps.</Say>
  <Pause length="1"/>
  <Say>If you’d like a callback, press 1 now.</Say>
  <Gather numDigits="1" timeout="5" action="/api/voice/twilio/action" method="POST"/>
</Response>`;
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}
