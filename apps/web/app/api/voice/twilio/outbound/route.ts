import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, maskPhone } from "@/lib/ai/request-guards";

// Places a real (billable) outbound phone call through Twilio. Previously this was callable
// by anyone with any destination number (toll-fraud / harassment vector); it is now restricted
// to authenticated admins and to North American numbers.
const NANP_E164 = /^\+1[2-9]\d{2}[2-9]\d{6}$/;

function normalizeNanp(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  const candidate = digits.startsWith("+") ? digits : digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : digits;
  return NANP_E164.test(candidate) ? candidate : null;
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const to = typeof body?.to === "string" ? normalizeNanp(body.to) : null;
  if (!to) return NextResponse.json({ error: "A valid North American 'to' number is required" }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_CALLER_ID;
  if (!sid || !token || !from) {
    return NextResponse.json({ error: "Twilio is not configured" }, { status: 503 });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin).replace(/\/+$/, "");
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`;
  const form = new URLSearchParams({ To: to, From: from, Url: `${baseUrl}/api/voice/twilio/entry` });

  try {
    const r = await fetch(url, { method: "POST", headers: { Authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("[twilio/outbound] Call failed:", r.status, j?.code, j?.message);
      return NextResponse.json({ error: "Call could not be placed", code: j?.code }, { status: 502 });
    }
    console.log("[twilio/outbound] Call queued to", maskPhone(to), j?.sid);
    // Return only what the caller needs (not the full Twilio account/call resource).
    return NextResponse.json({ success: true, sid: j?.sid, status: j?.status });
  } catch (err) {
    console.error("[twilio/outbound] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Call could not be placed" }, { status: 502 });
  }
}
