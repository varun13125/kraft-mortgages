import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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
  const webhookUrl = "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twenty CRM webhook error:", errorText);
      return { success: false, reason: `Twenty webhook error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, personId: result.personId };
  } catch (error) {
    console.error("Error sending to Twenty CRM:", error);
    return { success: false, reason: "Twenty CRM webhook failed" };
  }
}

// Send email notification using Brevo
async function sendEmailNotification(data: ContactFormData) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("BREVO_API_KEY not configured, skipping email notification");
    return { success: false, reason: "Email service not configured" };
  }

  const fullName = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`.trim()
    : data.name || "Unknown";

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Kraft Mortgages Website",
          email: "noreply@kraftmortgages.ca",
        },
        to: [{ email: "varun@kraftmortgages.ca", name: "Varun" }],
        subject: `New Contact Form: ${data.mortgageType || data.subject || "General Inquiry"}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 10px; border: 1px solid #ddd;">${fullName}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 10px; border: 1px solid #ddd;">${data.phone || "Not provided"}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Mortgage Type</td><td style="padding: 10px; border: 1px solid #ddd;">${data.mortgageType || "N/A"}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Amount</td><td style="padding: 10px; border: 1px solid #ddd;">${data.amount || "N/A"}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 10px; border: 1px solid #ddd;">${data.message || "No message"}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666;">Source: Kraft Mortgages website contact form</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API error:", errorText);
      return { success: false, reason: `Email API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, reason: "Email sending failed" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    // Honeypot check — bots fill hidden fields
    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    // Build data for Twenty CRM
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

    // Send to Twenty CRM (primary) and email (notification) in parallel
    const [twentyResult, emailResult] = await Promise.all([
      sendToTwenty(twentyData),
      sendEmailNotification(body),
    ]);

    console.log("Contact form submission:", {
      twenty: twentyResult,
      email: emailResult,
      email_address: body.email,
    });

    const success = twentyResult.success || emailResult.success;

    return NextResponse.json({
      success,
      message: success
        ? "Thank you! We'll be in touch within 24 hours."
        : "Something went wrong. Please call us at 604-593-1550.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
