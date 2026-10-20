import { submitCrmLead } from "@/lib/crm/submitLead";
import { consentRecordToStrings } from "@/lib/compliance/consentRecord";
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma, isPrismaEnabled } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { limitByIp, maskEmail, maskPhone } from "@/lib/compliance/requestGuards";
import { buildConsentRecord, consentInputShape } from "@/lib/compliance/consentRecord";

export const dynamic = "force-dynamic";

const optStr = (max: number) => z.string().trim().max(max).optional();
const optNum = z.union([z.number(), z.string().max(40)]).optional();

// Accepts both the legacy calculator payload (income/downPayment) and the
// homepage LeadModal payload (name/email/phone/loanAmount/message/calculatorType).
const LeadSchema = z
  .object({
    name: optStr(200),
    firstName: optStr(100),
    lastName: optStr(100),
    email: z.string().trim().email().max(254).optional(),
    phone: optStr(40),
    loanAmount: optNum,
    message: z.string().max(5000).optional(),
    calculatorType: optStr(80),
    intent: optStr(80),
    province: z.enum(["BC", "AB", "ON"]).optional(),
    income: optNum,
    downPayment: optNum,
    source: optStr(200),
    // CASL consent evidence (lib/compliance/consent.ts consentFields()); no calls are placed here.
    ...consentInputShape,
  })
  .strip(); // unknown fields are dropped (prevents arbitrary/oversized documents)

const toNumber = (v: unknown) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

async function notifyDiscord(details: Record<string, any>, score: number): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return false;
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "🆕 New Lead — Website Lead Form",
            color: 0xc8a962,
            fields: [
              { name: "Name", value: String(details.name || details.firstName || "Unknown").slice(0, 200), inline: true },
              { name: "Email", value: String(details.email || "—"), inline: true },
              { name: "Phone", value: String(details.phone || "—"), inline: true },
              { name: "Loan Amount", value: String(details.loanAmount || "—"), inline: true },
              { name: "Calculator", value: String(details.calculatorType || "—"), inline: true },
              { name: "Score", value: String(score), inline: true },
              { name: "Message", value: String(details.message || "—").slice(0, 500) },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(8_000),
    });
    return res.ok;
  } catch (error) {
    console.error("Lead Discord notification failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const limited = limitByIp(req, "lead", 5, 10 * 60 * 1000);
  if (limited) return limited;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid lead data" }, { status: 400 });
  }
  const body = parsed.data;
  if (!body.email && !body.phone) return Response.json({ error: "Email or phone is required" }, { status: 400 });

  // Handle both old format (with income/downPayment) and new format (with name/email/phone)
  let score;
  const province = body.province || "BC"; // default to BC
  const intent = body.intent || body.calculatorType || "GENERAL";

  if (body.income || body.downPayment) {
    // Old format - calculator-based scoring
    score = Math.min(100, Math.round(toNumber(body.income) / 1000 + toNumber(body.downPayment) / 10000));
  } else {
    // New format - lead form based scoring
    const loanAmount = toNumber(body.loanAmount);
    const hasPhone = !!body.phone;
    const hasMessage = !!body.message;

    // Score based on completeness and loan amount
    score = Math.min(100, Math.round(
      (loanAmount > 0 ? 40 : 0) +
      (hasPhone ? 30 : 0) +
      (hasMessage ? 20 : 0) +
      10 // base score for providing email/name
    ));
  }

  // CASL evidence stored with the lead: flags, wording version, server time, client IP (BUG-005).
  const consent = buildConsentRecord(body, req, body.source || "website-lead");

  const leadData = {
    province,
    intent,
    details: { ...body, consent },
    consent,
    score,
    status: (score >= 70 ? "QUALIFIED" : "NEW") as any,
    createdAt: new Date()
  };

  // Real-time alert so website leads don't sit unseen in the database
  // (previously this route only wrote to the DB and nobody was notified).
  const [notified, crmRecorded] = await Promise.all([notifyDiscord(body, score), submitCrmLead({
    firstName: body.firstName || body.name?.split(" ")[0] || "Website visitor",
    lastName: body.lastName || body.name?.split(" ").slice(1).join(" ") || "",
    email: body.email || "", phone: body.phone || "", mortgageType: intent,
    amount: String(body.loanAmount || ""), message: body.message || "",
    source: body.source || "website-lead", dispatchMode: "none", ...consentRecordToStrings(consent),
  })]);

  try {
    if (isPrismaEnabled()) {
      const lead = await prisma.lead.create({
        data: {
          province: leadData.province,
          intent: leadData.intent,
          details: leadData.details,
          score: leadData.score,
          status: leadData.status
        }
      });
      return Response.json({ id: lead.id, score: leadData.score, status: leadData.status, success: true, crmRecorded });
    }

    // Fallback to Firestore
    const db = firestore();
    const doc = await db.collection("leads").add(leadData);
    return Response.json({ id: doc.id, score: leadData.score, status: leadData.status, success: true, crmRecorded });

  } catch (error) {
    console.error("Error saving lead:", error instanceof Error ? error.message : error, {
      email: maskEmail(body.email),
      phone: maskPhone(body.phone),
      notified,
    });

    if (notified || crmRecorded) {
      // The team was alerted, so the lead is not lost even though the DB write failed.
      return Response.json({
        id: null,
        score: leadData.score,
        status: leadData.status,
        note: "Lead received", success: true, crmRecorded,
      });
    }

    // Previously this returned a fake success (`temp_<ts>`) and the lead was silently lost.
    return Response.json(
      { error: "We couldn't save your request right now. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
