const META_GRAPH_URL = "https://graph.facebook.com/v19.0";

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface ConversionEvent {
  eventName: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fbp?: string;
  fbc?: string;
  value?: number;
  currency?: string;
  source?: string;
}

export async function sendConversion(event: ConversionEvent): Promise<boolean> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Meta Conversions API: missing pixel ID or access token");
    return false;
  }

  const userData: Record<string, string> = {};

  if (event.email) userData.em = await sha256(event.email);
  if (event.phone) userData.ph = await sha256(event.phone);
  if (event.firstName) userData.fn = await sha256(event.firstName);
  if (event.lastName) userData.ln = await sha256(event.lastName);
  if (event.fbp) userData.fbp = event.fbp;
  if (event.fbc) userData.fbc = event.fbc;

  const customData: Record<string, string | number> = {};
  if (event.value) customData.value = event.value;
  if (event.currency) customData.currency = event.currency;
  if (event.source) customData.lead_source = event.source;

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.kraftmortgages.ca",
        user_data: userData,
        custom_data: Object.keys(customData).length > 0 ? customData : undefined,
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(`${META_GRAPH_URL}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Meta Conversions API error:", response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Meta Conversions API fetch failed:", error);
    return false;
  }
}
