import { NextRequest, NextResponse } from "next/server";

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
async function sendDiscordNotification(data: ContactFormData) {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fullName = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`.trim()
    : data.name || "Unknown";

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "🆕 New Lead — Website Contact Form",
            color: 0xc8a962,
            fields: [
              { name: "Name", value: fullName, inline: true },
              { name: "Email", value: data.email, inline: true },
              { name: "Phone", value: data.phone || "—", inline: true },
              { name: "Mortgage Type", value: data.mortgageType || "General", inline: true },
              { name: "Loan Amount", value: data.amount || "—", inline: true },
              { name: "Message", value: data.message?.slice(0, 500) || "—" },
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
    const body: ContactFormData = await req.json();

    // Honeypot — bots fill hidden fields
    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    // Validate
    if (!body.email || (!body.firstName && !body.name)) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const twentyData: Record<string, string> = {
      firstName: body.firstName || body.name?.split(" ")[0] || "",
      lastName: body.lastName || body.name?.split(" ").slice(1).join(" ") || "",
      email: body.email,
      phone: body.phone || "",
      mortgageType: body.mortgageType || "",
      amount: body.amount || "",
      message: body.message || "",
      source: body.source || "website-contact",
      _hp: "",
    };

    // Send to Twenty CRM (lead creation — primary)
    const crmSuccess = await sendToTwenty(twentyData);

    // Discord notification (real-time alert)
    await sendDiscordNotification(body);

    console.log("Lead submitted:", {
      name: twentyData.firstName + " " + twentyData.lastName,
      email: body.email,
      crm: crmSuccess ? "✅" : "❌",
    });

    return NextResponse.json({
      success: crmSuccess,
      message: crmSuccess
        ? "Thank you! We'll be in touch within 24 hours."
        : "Something went wrong. Please call us at 604-593-1550.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
