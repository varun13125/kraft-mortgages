import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCallingHoursStatus, isRecipientCallable } from "@/lib/businessHours";
import { limitByIp, maskEmail, maskPhone } from "@/lib/compliance/requestGuards";
import { firestore } from "@/lib/firebaseAdmin";
import { submitCrmLead } from "@/lib/crm/submitLead";
import { buildConsentRecord, consentInputShape, consentRecordToStrings, type ConsentRecord } from "@/lib/compliance/consentRecord";

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
    // CASL / CRTC consent (lib/compliance/consent.ts consentFields()). Only
    // consentToCall === true permits the automated AI call (BUG-005).
    ...consentInputShape,
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
  consentVersion?: string;
}

// Discord notification for real-time alerts
// Backup store so a lead is never lost when the CRM webhook is down.
async function persistLeadBackup(data: Record<string, string>, consent: ConsentRecord): Promise<boolean> {
  try {
    await firestore().collection("leads").add({
      province: "BC",
      intent: data.mortgageType || "CONTACT_FORM",
      details: data,
      consent, // CASL evidence (wording version, server time, IP)
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

  const dispatchStatus = "Message received — Kraft Mortgages team follow-up; no automated callback or transfer";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: isAfterHours ? "New Lead — Follow-up Requested" : "🆕 New Lead — Website Contact Form",
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
    // Office window (Pacific) AND the CRTC window in the recipient's own time zone.
    const isAfterHours = !callingStatus.isOpen || !isRecipientCallable(body.phone) || body.afterHours === true;
    const scheduledTime = body.preferredCallTime || callingStatus.nextAvailableTime;

    // BUG-005 (owner decision 2026-10-13): automated AI calls ONLY with express
    // consent - the call box was ticked (consentToCall === true). Missing/false = no call.
    const consent = buildConsentRecord(body, req, body.source || "website-contact");
    const callConsent = consent.consentToCall;

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
      // "none" = the person did NOT consent to an automated call: n8n must not
      // queue or place an AI call for this lead (BUG-005).
      dispatchMode: "none", // Website owns immediate calling; CRM receiver records only.
      callRequested: callConsent ? "true" : "false",
      _hp: "",
      // CASL evidence: consent flags, wording version, server time, client IP.
      ...consentRecordToStrings(consent),
    };

    // Send to Twenty CRM (lead creation — primary)
    const crmSuccess = await submitCrmLead(twentyData);

    // If the CRM is down, keep a copy in Firestore so the lead is not lost
    const backupSaved = crmSuccess ? false : await persistLeadBackup(twentyData, consent);

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

    // Owner's message-only workflow: save the inquiry for team follow-up.
    // Never invoke the legacy outbound qualification assistant from a public form.
    const callDispatched = false;

    console.log("Lead submitted:", {
      email: maskEmail(body.email),
      phone: maskPhone(body.phone),
      afterHours: isAfterHours,
      scheduledTime,
      crm: crmSuccess ? "✅" : "❌",
      voiceCall: !callConsent ? "call_skipped: no_consent" : callDispatched ? "📞 Dispatched" : isAfterHours ? "follow-up requested" : "⚠️ Skipped",
    });

    return NextResponse.json({
      success: true,
      crmRecorded: crmSuccess,
      backupSaved,
      teamNotified: discordSent,
      isAfterHours,
      scheduledTime,
      callDispatched,
      // false = no automated call will be placed (no consent), so the UI must not promise one
      callConsent,
      message: "Your message is saved for the Kraft Mortgages team. A team member will follow up; no automated call or appointment has been started.",
    });
  } catch (error) {
    console.error("Contact form error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

