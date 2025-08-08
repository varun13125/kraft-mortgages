export type Province = "BC"|"AB"|"ON";
export type Feature = "CHATBOT"|"VOICE"|"CALC_CONSTRUCTION"|"CALC_MLI"|"LEAD_FORM";
export type RuleResult = { allowed: boolean; disclaimers: string[] };

const disclaimers: Record<Province, string[]> = {
  BC: ["BCFSA: General guidance only. Confirm with lender for binding terms."],
  AB: ["RECA: Educational use; not financial advice. Verify penalties & fees."],
  ON: ["FSRAO: Rates/programs subject to change. Review lender disclosures."]
};

export function evaluate(province: Province, feature: Feature): RuleResult {
  const deny: RuleResult = { allowed: false, disclaimers: disclaimers[province] || [] };
  // Example denials could be added here.
  switch (feature) {
    case "CHATBOT":
    case "VOICE":
    case "CALC_CONSTRUCTION":
    case "CALC_MLI":
    case "LEAD_FORM":
      return { allowed: true, disclaimers: disclaimers[province] || [] };
    default:
      return deny;
  }
}
