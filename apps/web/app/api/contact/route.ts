import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCallingHoursStatus } from "@/lib/businessHours";
import { triggerVapiOutboundCall } from "@/lib/voice/vapi";
import { limitByIp, rateLimit, maskEmail, maskPhone, phoneKey } from "@/lib/compliance/requestGuards";
import { firestore } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const optStr = (max: number) => z.string().trim().max(max).optional();

// Accepts the payloads sent by /contact, /qualify and PdfLeadModal (+ UTM params).
const ContactSchema = z
  .object({
    firstName: optStr(100),
    lastName: optStr(100),
    name: optStr(200),
    email: z.string().trim().email().max(254),
    phone: optStr(40),
    subject: optStr(200),
    mortgageType: optStr(120),
    amount: optStr(60),
    message: z.string().max(5000).optional().default(""),
    source: optStr(200),
    _hp: z.string().optional(),
    afterHours: z.boolean().optional(),
    preferredCallTime: optStr(120),
    // CASL / CRTC consent flags (optional until the forms send them)
    consentToContact: z.boolean().optional(),
    consentToCall: z.boolean().optional(), // express consent to an automated (AI) call
    consentToMarketing: z.boolean().optional(),
  })
  .passthrough();

interface ContactFormData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  mortgageType?: string;
  amount?: string;
  message: string;
  source?: string;
  _hp?: string;
  afterHours?: boolean;
  preferredCallTime?: string;
  consentToContact?: boolean;
  consentToCall?: boolean;
  consentToMarketing?: boolean;
}

// Forward to Twenty CRM webhook — single source of truth for leads
async function sendToTwenty(data: Record<string, string>) {
  try {
    const response = await fetch(
      "https://webhook.srv848694.hstgr.cloud/webhook/contact-form",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Twenty CRM error:", response.status, text);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Twenty CRM fetch failed:", error);
    return false;
  }
}

// Discord notification for real-time alerts
// Backup store so a lead is never lost when the CRM webhook is down.
async function persistLeadBackup(data: Record<string, string>): Promise<boolean> {
  try {
    await firestore().collection("leads").add({
      province: "BC",
      intent: data.mortgageType || "CONTACT_FORM",
      details: data,
      score: data.phone ? 60 : 30,
      status: "NEW",
      crmForwarded: false,
      source: data.source || "website-contact",
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Lead backup write failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

async function sendDiscordNotification(data: ContactFormData, isAfterHours: boolean, scheduledTime: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const fullName = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`.trim()
    : data.name || "Unknown";

  const dispatchStatus = isAfterHours
    ? `🌙 After-Hours Queue (${scheduledTime})`
    : "⚡ Live Dial (Julia +1 604-359-5993)";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: isAfterHours ? "🌙 New Lead (After-Hours Queued)" : "🆕 New Lead — Website Contact Form",
            color: isAfterHours ? 0x38bdf8 : 0xc8a962,
            fields: [
              { name: "Name", value: fullName, inline: true },
              { name: "Email", value: data.email, inline: true },
              { name: "Phone", value: data.phone || "—", inline: true },
              { name: "Mortgage Type", value: data.mortgageType || "General", inline: true },
              { name: "Loan Amount", value: data.amount || "—", inline: true },
              { name: "Calling Dispatch", value: dispatchStatus, inline: true },
              { name: "Message", value: data.message?.slice(0, 500) || "—" },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Discord error:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Spam / abuse guard: every accepted submission can trigger a paid outbound AI call.
    const limited = limitByIp(req, "contact", 8, 10 * 60 * 1000);
    if (limited) return limited;

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Honeypot — bots fill hidden fields
    if (raw && typeof raw === "object" && (raw as any)._hp) {
      return NextResponse.json({ success: true });
    }

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "A valid name and email are required" },
        { status: 400 }
      );
    }
    const body = parsed.data as ContactFormData;

    // Validate
    if (!body.email || (!body.firstName && !body.name)) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Calling-hours gate is server-authoritative (CRTC): the client may only make
    // it MORE conservative (afterHours: true), never force a live dial outside hours.
    const callingStatus = getCallingHoursStatus();
    const isAfterHours = !callingStatus.isOpen || body.afterHours === true;
    const scheduledTime = body.preferredCallTime || callingStatus.nextAvailableTime;

    const twentyData: Record<string, string> = {
      firstName: body.firstName || body.name?.split(" ")[0] || "",
      lastName: body.lastName || body.name?.split(" ").slice(1).join(" ") || "",
      email: body.email,
      phone: body.phone || "",
      mortgageType: body.mortgageType || "",
      amount: body.amount || "",
      message: body.message || "",
      source: body.source || "website-contact",
      isAfterHours: isAfterHours ? "true" : "false",
      scheduledCallback: scheduledTime,
      dispatchMode: isAfterHours ? "queue" : "live_dial",
      _hp: "",
    };

    // Record consent evidence when the form provides it (CASL requires proof of consent).
    const consentFlags = {
      consentToContact: body.consentToContact,
      consentToCall: body.consentToCall,
      consentToMarketing: body.consentToMarketing,
    };
    let consentRecorded = false;
    for (const [key, value] of Object.entries(consentFlags)) {
      if (typeof value === "boolean") {
        twentyData[key] = value ? "true" : "false";
        consentRecorded = true;
      }
    }
    if (consentRecorded) {
      twentyData.consentCapturedAt = new Date().toISOString();
    }

    // Send to Twenty CRM (lead creation — primary)
    const crmSuccess = await sendToTwenty(twentyData);

    // If the CRM is down, keep a copy in Firestore so the lead is not lost
    const backupSaved = crmSuccess ? false : await persistLeadBackup(twentyData);

    // Discord notification (real-time alert)
    const discordSent = await sendDiscordNotification(body, isAfterHours, scheduledTime);

    if (!crmSuccess && !backupSaved && !discordSent) {
      // Nothing recorded the lead anywhere — tell the client so the user can retry/call.
      console.error("Lead NOT recorded (CRM, backup and Discord all failed)", {
        email: maskEmail(body.email),
        phone: maskPhone(body.phone),
      });
      return NextResponse.json(
        { error: "We couldn't submit your request right now. Please try again or call us." },
        { status: 502 }
      );
    }

    // Speed-to-lead outbound qualification call via Julia (Vapi Voice AI)
    // Never auto-dial the same number more than once per 24h (per instance) —
    // prevents the form being used to repeatedly call a victim's phone.
    let callDispatched = false;
    const canDialNumber =
      !!body.phone && phoneKey(body.phone).length >= 10 &&
      rateLimit(`contact-dial:${phoneKey(body.phone)}`, 1, 24 * 60 * 60 * 1000).ok;
    // Respect an explicit opt-out of automated calls (field absent = legacy forms).
    const callConsentDenied = body.consentToCall === false;
    if (!isAfterHours && body.phone && canDialNumber && !callConsentDenied) {
      callDispatched = await triggerVapiOutboundCall({
        name: `${twentyData.firstName} ${twentyData.lastName}`.trim() || "Valued Client",
        phone: body.phone,
        email: body.email,
        mortgageType: body.mortgageType,
        amount: body.amount,
      });
    }

    console.log("Lead submitted:", {
      email: maskEmail(body.email),
      phone: maskPhone(body.phone),
      afterHours: isAfterHours,
      scheduledTime,
      crm: crmSuccess ? "✅" : "❌",
      voiceCall: callDispatched ? "📞 Dispatched" : isAfterHours ? "🌙 Queued" : "⚠️ Skipped",
    });

    return NextResponse.json({
      success: crmSuccess,
      isAfterHours,
      scheduledTime,
      callDispatched,
      message: isAfterHours
        ? `Priority rate locked! Julia is scheduled to place your priority call ${scheduledTime}.`
        : callDispatched
          ? "Thank you! Julia is dialing your number right now."
          : "Thank you! A mortgage specialist will contact you shortly.",
    });
  } catch (error) {
    console.error("Contact form error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

