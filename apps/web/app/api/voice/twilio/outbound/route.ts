import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { to } = await req.json();
  if (!to) return new Response("Missing 'to'", { status: 400 });
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_CALLER_ID!;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`;
  const form = new URLSearchParams({ To: to, From: from, Url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/voice/twilio/entry` });
  const r = await fetch(url, { method: "POST", headers: { Authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
  const j = await r.json();
  return Response.json(j);
}
