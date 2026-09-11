/**
 * Thinkrr AI Outbound Voice Agent Helper
 * Triggers speed-to-lead qualification calls programmatically via Thinkrr REST API.
 */

export interface ThinkrCallPayload {
  name: string;
  phone: string;
  email?: string;
  customGreeting?: string;
}

export async function triggerThinkrOutboundCall(contact: ThinkrCallPayload): Promise<boolean> {
  const apiKey = process.env.THINKR_API_KEY;
  const agentId = process.env.THINKR_AGENT_ID;
  const scenarioId = process.env.THINKR_OUTBOUND_SCENARIO_ID;
  const callerPhone = process.env.THINKR_CALLER_PHONE;

  // Gracefully handle missing configuration so lead capture is never blocked
  if (!apiKey) {
    console.warn("⚠️ Thinkrr API: THINKR_API_KEY is not configured. Skipping qualification call.");
    return false;
  }

  if (!contact.phone) {
    console.warn("⚠️ Thinkrr API: No phone number provided for lead call.");
    return false;
  }

  try {
    // E.164 phone formatting safeguard (remove spaces, parentheses, dashes; ensure + prefix if needed)
    let formattedPhone = contact.phone.replace(/[\s\-\(\)]/g, "");
    if (!formattedPhone.startsWith("+") && formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`; // Default to North American country code
    }

    const payload = {
      agent_id: agentId || undefined,
      scenario_id: scenarioId || undefined,
      caller_phone: callerPhone || undefined,
      recipient_phone: formattedPhone,
      recipient_name: contact.name,
      recipient_email: contact.email || "",
      custom_variables: {
        company_name: "Kraft Mortgages Canada",
        intro_greeting: contact.customGreeting || `Hi ${contact.name.split(" ")[0]}, thanks for contacting Kraft Mortgages!`
      }
    };

    console.log(`📞 Thinkrr API: Dispatching outbound qualification call for ${contact.name} to ${formattedPhone}...`);

    // Thinkrr REST API uses /v1/calls or /v1/outbound
    const response = await fetch("https://api.thinkrr.ai/v1/calls", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Thinkrr API: Call failed with status ${response.status}:`, errorText);
      return false;
    }

    console.log(`✅ Thinkrr API: Outbound call triggered successfully for ${contact.name}.`);
    return true;
  } catch (error) {
    console.error("❌ Thinkrr API: Failed to trigger outbound qualification call:", error);
    return false;
  }
}
