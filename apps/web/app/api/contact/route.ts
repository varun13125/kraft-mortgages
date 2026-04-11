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

// Forward to Twenty CRM webhook
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
      return { success: false };
    }

    const result = await response.json();
    return { success: result.success, personId: result.personId };
  } catch (error) {
    console.error("Twenty CRM fetch failed:", error);
    return { success: false };
  }
}

// Send email via Brevo
async function sendEmail(data: ContactFormData) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY not set — skipping email");
    return false;
  }

  const fullName = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`.trim()
    : data.name || "Unknown";

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Kraft Mortgages", email: "noreply@kraftmortgages.ca" },
        to: [{ email: "varun@kraftmortgages.ca", name: "Varun" }],
        subject: `New Lead: ${data.mortgageType || data.subject || "Contact"} — ${fullName}`,
        htmlContent: `
<h2>New Lead from Website</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${fullName}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${data.email}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${data.phone || "—"}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Type</td><td style="padding:8px;border:1px solid #ddd">${data.mortgageType || "—"}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Amount</td><td style="padding:8px;border:1px solid #ddd">${data.amount || "—"}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${data.message || "—"}</td></tr>
</table>`,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Brevo error:", error);
    return false;
  }
}

// Post to Discord for real-time notification
async function sendDiscordNotification(data: ContactFormData) {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("DISCORD_LEAD_WEBHOOK_URL not set — skipping Discord");
    return;
  }

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
            title: "🆕 New Lead from Website",
            color: 0xc8a962,
            fields: [
              { name: "Name", value: fullName, inline: true },
              { name: "Email", value: data.email, inline: true },
              { name: "Phone", value: data.phone || "—", inline: true },
              { name: "Type", value: data.mortgageType || "General", inline: true },
              { name: "Amount", value: data.amount || "—", inline: true },
              { name: "Message", value: data.message?.slice(0, 500) || "—" },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Discord notification error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    // Honeypot
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

    // Fire all three in parallel — don't block on any
    const [twentyResult, emailResult] = await Promise.all([
      sendToTwenty(twentyData),
      sendEmail(body),
    ]);

    // Discord is fire-and-forget (no await needed)
    sendDiscordNotification(body);

    const crmOk = twentyResult.success;
    const emailOk = emailResult;

    console.log("Contact form:", {
      name: twentyData.firstName + " " + twentyData.lastName,
      email: body.email,
      crm: crmOk ? "✅" : "❌",
      email: emailOk ? "✅" : "❌ (BREVO_API_KEY missing)",
    });

    return NextResponse.json({
      success: crmOk || emailOk,
      message: "Thank you! We'll be in touch within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
