import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Send email notification using Brevo/Sendinblue API directly
async function sendEmailNotification(data: ContactFormData) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.warn("BREVO_API_KEY not configured, skipping email notification");
        return { success: false, reason: "Email service not configured" };
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: "Kraft Mortgages Website",
                    email: "noreply@kraftmortgages.ca",
                },
                to: [{ email: "varun@kraftmortgages.ca", name: "Varun" }],
                subject: `New Contact Form Submission: ${data.subject}`,
                htmlContent: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 10px; border: 1px solid #ddd;">${data.phone || "Not provided"}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td><td style="padding: 10px; border: 1px solid #ddd;">${data.subject}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666;">This message was sent from the Kraft Mortgages website contact form.</p>
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

// Send lead to GoHighLevel webhook
async function sendToGHL(data: ContactFormData) {
    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("GHL_WEBHOOK_URL not configured, skipping GHL integration");
        return { success: false, reason: "GHL webhook not configured" };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // GHL standard fields
                first_name: data.name.split(" ")[0],
                last_name: data.name.split(" ").slice(1).join(" ") || "",
                full_name: data.name,
                email: data.email,
                phone: data.phone || "",
                source: "Website Contact Form",
                tags: ["website-contact", data.subject],
                custom_fields: {
                    subject: data.subject,
                    message: data.message,
                    form_source: "kraftmortgages.ca/contact",
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GHL webhook error:", errorText);
            return { success: false, reason: `GHL webhook error: ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error("Error sending to GHL:", error);
        return { success: false, reason: "GHL webhook failed" };
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: ContactFormData = await req.json();

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send to both services in parallel
        const [emailResult, ghlResult] = await Promise.all([
            sendEmailNotification(body),
            sendToGHL(body),
        ]);

        // Log results
        console.log("Contact form submission:", {
            email: emailResult,
            ghl: ghlResult,
            data: { name: body.name, email: body.email, subject: body.subject },
        });

        // Return success even if one service fails - we don't want to leave user hanging
        const success = emailResult.success || ghlResult.success;

        return NextResponse.json({
            success,
            message: success
                ? "Thank you! Your message has been received."
                : "Message received. We'll be in touch soon.",
            details: {
                email: emailResult.success ? "sent" : "pending",
                crm: ghlResult.success ? "sent" : "pending",
            },
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to process contact form" },
            { status: 500 }
        );
    }
}
