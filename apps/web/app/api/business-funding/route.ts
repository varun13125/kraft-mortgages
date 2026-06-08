import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";

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
}

// Forward to GoHighLevel (LeadConnector) Webhook
async function sendToGoHighLevel(data: BusinessFundingData) {
  const ghlWebhookUrl = "https://services.leadconnectorhq.com/hooks/H8IiiebU1Da0epvedovb/webhook-trigger/faa24cae-1c75-43c4-b2e1-409f775d9d32";
  
  try {
    const response = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("GHL Webhook error:", response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("GHL Webhook fetch failed:", error);
    return false;
  }
}

// Discord notification for real-time alerts
async function sendDiscordNotification(data: BusinessFundingData) {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fullName = `${data.first_name} ${data.last_name}`.trim();

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "💼 New Lead — Business Funding (Forwarded to MPower)",
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
              { name: "Integration Status", value: "Forwarded to MPower GHL", inline: true },
              { name: "Notes", value: data.notes?.slice(0, 500) || "—" },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Discord error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: BusinessFundingData = await req.json();

    // Basic Validation
    if (!body.email || !body.first_name || !body.last_name || !body.business_name || !body.phone) {
      return NextResponse.json(
        { error: "Required fields are missing: first_name, last_name, email, phone, and business_name are required." },
        { status: 400 }
      );
    }

    // Save lead to local database / firestore for redundancy
    const leadData = {
      province: "BC" as const, // Default to BC for Prisma enum compatibility
      intent: "BUSINESS_LOAN",
      details: body as any,
      score: 100, // Pre-qualified complete application
      status: "NEW" as const,
      createdAt: new Date(),
    };

    try {
      if (process.env.DATABASE_URL) {
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
    } catch (dbError) {
      console.error("Redundant DB logging failed, continuing with integrations:", dbError);
    }

    // Submit to GoHighLevel (LeadConnector Webhook)
    const ghlSuccess = await sendToGoHighLevel(body);

    // Send Discord Real-Time Alert
    await sendDiscordNotification(body);

    return NextResponse.json({
      success: ghlSuccess,
      message: ghlSuccess
        ? "Thank you! Your business funding application has been submitted successfully."
        : "Application received. Our team will contact you shortly.",
    });

  } catch (error) {
    console.error("Business funding API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
