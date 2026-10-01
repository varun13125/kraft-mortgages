/**
 * Vapi AI Outbound Voice Agent Helper
 * Triggers Julia's speed-to-lead qualification calls programmatically via Vapi REST API.
 */

export interface VapiCallPayload {
  name: string;
  phone: string;
  email?: string;
  mortgageType?: string;
  amount?: string;
}

export async function triggerVapiOutboundCall(contact: VapiCallPayload): Promise<boolean> {
  const apiKey = process.env.VAPI_API_KEY || "c9af458e-6935-41ac-a521-7fd4a68cd068";
  const assistantId = process.env.VAPI_ASSISTANT_ID || "8a5ab646-355b-4d2a-aab2-5fc5d08dacc6";
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID || "afd9510d-7e0c-4a56-9dea-c5405c0f0a14";

  if (!apiKey || !contact.phone) {
    console.warn("⚠️ Vapi: Missing API key or phone number.");
    return false;
  }

  try {
    let formattedPhone = contact.phone.replace(/[\s\-\(\)]/g, "");
    if (!formattedPhone.startsWith("+") && formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    }

    const payload = {
      phoneNumberId,
      assistantId,
      customer: {
        number: formattedPhone,
        name: contact.name || "Valued Client",
      },
      assistantOverrides: {
        variableValues: {
          clientName: contact.name || "there",
          mortgageType: contact.mortgageType || "mortgage",
          loanAmount: contact.amount || "unspecified",
        }
      }
    };

    console.log(`📞 Vapi API: Dispatching Julia outbound qualification call for ${contact.name} to ${formattedPhone}...`);

    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Vapi API call failed (${response.status}):`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Vapi API: Outbound call dispatched successfully. Call ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error("❌ Vapi API: Error triggering outbound qualification call:", error);
    return false;
  }
}
