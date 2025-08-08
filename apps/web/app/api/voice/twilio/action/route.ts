import { NextRequest } from 'next/server';
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const digits = form.get('Digits')?.toString() || "";
  let say = "Thanks, goodbye.";
  if (digits === "1") say = "We will call you back shortly.";
  const body = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">${say}</Say></Response>`;
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } });
}
