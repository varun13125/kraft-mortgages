import { randomUUID } from "node:crypto";
import { crmWebhookHeaders, twentyWebhookUrl } from "./webhooks";

/** A 200 alone is not proof that a lead reached the CRM. */
export async function submitCrmLead(data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(twentyWebhookUrl(), {
      method: "POST", headers: crmWebhookHeaders(), body: JSON.stringify({ submissionId: randomUUID(), ...data }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return false;
    const receipt = await response.json();
    return receipt.success === true && typeof receipt.personId === "string" && !!receipt.personId;
  } catch {
    console.error("[crm] Lead delivery failed; using the application backup/alert path");
    return false;
  }
}
