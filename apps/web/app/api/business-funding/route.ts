import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, isPrismaEnabled } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { limitByIp } from "@/lib/compliance/requestGuards";
import { submitCrmLead } from "@/lib/crm/submitLead";
import { buildConsentRecord, consentInputShape, consentRecordToStrings } from "@/lib/compliance/consentRecord";

export const dynamic = "force-dynamic";

const s = (max: number) => z.string().trim().max(max);
const BusinessFundingSchema = z
  .object({
    first_name: s(100).min(1),
    last_name: s(100).min(1),
    email: z.string().trim().email().max(254),
    phone: s(40).min(7),
    business_name: s(200).min(1),
    company_website: s(300).optional().default(""),
    business_owner_with_linkedin: s(40).optional().default(""),
    business_type: s(100).optional().default(""),
    how_long_in_business: s(100).optional().default(""),
    average_monthly_revenue: s(100).optional().default(""),
    funding_amount: s(60).optional().default(""),
    purpose_of_funding: s(120).optional().default(""),
    other_purpose: s(300).optional(),
    when_are_funds_needed: s(100).optional().default(""),
    notes: s(5000).optional(),
    // CASL consent evidence (lib/compliance/consent.ts consentFields()); no calls are placed here.
    ...consentInputShape,
  })
  .strip();

interface BusinessFundingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  company_website: string;
  business_owner_with_linkedin: string;
  business_type: string;
  how_long_in_business: string;
  average_monthly_revenue: string;
  funding_amount: string;
  purpose_of_funding: string;
  other_purpose?: string;
  when_are_funds_needed: string;
  notes?: string;
  consentToContact?: boolean;
  consentToCall?: boolean;
  consentToMarketing?: boolean;
  consentVersion?: string;
}

// Discord notification for real-time alerts
async function sendDiscordNotification(data: BusinessFundingData): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const fullName = `${data.first_name} ${data.last_name}`.trim();

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "New Lead — Business Funding",
            color: 0xc8a962,
            fields: [
              { name: "Name", value: fullName, inline: true },
              { name: "Email", value: data.email, inline: true },
              { name: "Phone", value: data.phone || "—", inline: true },
              { name: "Business Name", value: data.business_name || "—", inline: true },
              { name: "Website", value: data.company_website || "—", inline: true },
              { name: "LinkedIn Owner?", value: data.business_owner_with_linkedin || "—", inline: true },
              { name: "Business Type", value: data.business_type || "—", inline: true },
              { name: "Years in Business", value: data.how_long_in_business || "—", inline: true },
              { name: "Monthly Revenue", value: data.average_monthly_revenue || "—", inline: true },
              { name: "Requested Amount", value: data.funding_amount ? `$${data.funding_amount}` : "—", inline: true },
              { name: "Purpose", value: data.purpose_of_funding === "Other" ? `Other: ${data.other_purpose || ""}` : data.purpose_of_funding || "—", inline: true },
              { name: "Timeline", value: data.when_are_funds_needed || "—", inline: true },
              { name: "Integration Status", value: "Application received; CRM receipt is tracked separately", inline: true },
              { name: "Notes", value: data.notes?.slice(0, 500) || "—" },
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
    const limited = limitByIp(req, "business-funding", 3, 10 * 60 * 1000);
    if (limited) return limited;

    const parsed = BusinessFundingSchema.safeParse(await req.json().catch(() => null));

    // Basic Validation
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid: first_name, last_name, a valid email, phone, and business_name are required." },
        { status: 400 }
      );
    }
    const body: BusinessFundingData = parsed.data;

    // CASL evidence stored with the lead: flags, wording version, server time, client IP (BUG-005).
    const consent = buildConsentRecord(body, req, "website-business-funding");

    // Save lead to local database / firestore for redundancy
    const leadData = {
      province: "BC" as const, // Default to BC for Prisma enum compatibility
      intent: "BUSINESS_LOAN",
      details: { ...body, consent } as any,
      score: 100, // Completeness score only; this is not a qualification decision
      status: "NEW" as const,
      createdAt: new Date(),
    };

    let dbSaved = false;
    try {
      if (isPrismaEnabled()) {
        await prisma.lead.create({
          data: {
            province: leadData.province,
            intent: leadData.intent,
            details: leadData.details,
            score: leadData.score,
            status: leadData.status,
          }
        });
      } else {
        // Fallback to Firestore
        const db = firestore();
        await db.collection("leads").add(leadData);
      }
      dbSaved = true;
    } catch (dbError) {
      console.error("Redundant DB logging failed, continuing with integrations:", dbError instanceof Error ? dbError.message : dbError);
    }

    // Twenty on the VPS is the brokerage's CRM (owner confirmed 2026-10-20).
    const crmRecorded = await submitCrmLead({
      firstName: body.first_name, lastName: body.last_name, email: body.email,
      phone: body.phone, mortgageType: "Business Funding", amount: body.funding_amount,
      source: "website-business-funding", dispatchMode: "none",
      message: Object.entries(body).filter(([key]) => !["first_name", "last_name", "email", "phone"].includes(key)).map(([key, value]) => `${key}: ${value ?? ""}`).join("\n"),
      ...consentRecordToStrings(consent),
    });

    // Send Discord Real-Time Alert
    const discordSent = await sendDiscordNotification(body);

    if (!crmRecorded && !dbSaved && !discordSent) {
      return NextResponse.json({ success: false, error: "We could not save your application. Please retry or call us." }, { status: 502 });
    }

    // The application counts as received if ANY sink recorded it; previously a GHL
    // outage returned success:false and the page told the user to resubmit (duplicates).
    return NextResponse.json({
      success: crmRecorded || dbSaved || discordSent,
      message: crmRecorded
        ? "Thank you! Your business funding application has been submitted successfully."
        : "Application received. Our team will contact you shortly.",
    });

  } catch (error) {
    console.error("Business funding API error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
