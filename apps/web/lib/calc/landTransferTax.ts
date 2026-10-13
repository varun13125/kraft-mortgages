/**
 * Shared land transfer tax / registration fee helpers for BC, Alberta and Ontario.
 * SINGLE SOURCE OF TRUTH for the land-transfer-tax, closing-costs,
 * first-time-home-buyer and mortgage-qualifier calculators.
 *
 * Sources (verified Oct 2026):
 *  - BC Property Transfer Tax: 1% first $200k, 2% to $2M, 3% above $2M, plus a
 *    further 2% on the residential portion above $3M (gov.bc.ca).
 *  - BC First Time Home Buyers' exemption (from Apr 1, 2024): no PTT on the first
 *    $500,000 (max $8,000) when FMV ≤ $835,000; reduced proportionally to $0 at
 *    $860,000 — matches gov.bc.ca "current exemption amounts" table
 *    (e.g. $852,000 → $2,560 exemption).
 *  - Ontario LTT (1–2 single-family residences): 0.5% to $55k, 1% to $250k,
 *    1.5% to $400k, 2% to $2M, 2.5% above. First-time buyer refund max $4,000.
 *  - Toronto MLTT (toronto.ca, rates as of Apr 1, 2026): provincial brackets to
 *    $3M, then 4.40% / 5.45% / 6.50% / 7.55% / 8.60% at $3M/$4M/$5M/$10M/$20M.
 *    First-time purchaser rebate max $4,475.
 *  - Alberta: no land transfer tax. Land Titles fees since Oct 20, 2024:
 *    $50 + $5 per $5,000 (or part) of value, for both the transfer and the mortgage.
 * Not tax or legal advice.
 */

export interface TaxBracket {
  label: string;
  amount: number;
  /** marginal rate in percent */
  rate: number;
}

export interface TaxResult {
  brackets: TaxBracket[];
  total: number;
}

interface Tier { upTo: number; rate: number; label: string }

function progressive(price: number, tiers: Tier[]): TaxResult {
  const brackets: TaxBracket[] = [];
  let total = 0;
  let prev = 0;
  for (const t of tiers) {
    if (price <= prev) break;
    const slab = Math.min(price, t.upTo) - prev;
    const tax = slab * t.rate;
    if (slab > 0) brackets.push({ label: t.label, amount: tax, rate: Math.round(t.rate * 10000) / 100 });
    total += tax;
    prev = t.upTo;
  }
  return { brackets, total };
}

/* ── British Columbia ─────────────────────────────── */

export const BC_FTHB_FULL_EXEMPTION_FMV = 835_000;
export const BC_FTHB_PHASE_OUT_END_FMV = 860_000;
/** PTT on the first $500,000 = 1% × 200k + 2% × 300k */
export const BC_FTHB_MAX_EXEMPTION = 8_000;

const BC_TIERS: Tier[] = [
  { upTo: 200_000, rate: 0.01, label: "First $200,000" },
  { upTo: 2_000_000, rate: 0.02, label: "$200K – $2M" },
  { upTo: 3_000_000, rate: 0.03, label: "$2M – $3M" },
  // 3% general rate + further 2% on the residential portion above $3M
  { upTo: Infinity, rate: 0.05, label: "Over $3M (3% + 2% further tax, residential)" },
];

/** BC Property Transfer Tax on a residential purchase (before exemptions). */
export function bcPropertyTransferTax(price: number): TaxResult {
  return progressive(Math.max(0, price), BC_TIERS);
}

/** Dollar amount of the BC First Time Home Buyers' exemption for a fully-qualifying buyer. */
export function bcFirstTimeBuyerExemption(price: number): number {
  if (!(price > 0) || price >= BC_FTHB_PHASE_OUT_END_FMV) return 0;
  const taxOnFirst500k = bcPropertyTransferTax(Math.min(price, 500_000)).total;
  if (price <= BC_FTHB_FULL_EXEMPTION_FMV) return taxOnFirst500k;
  return BC_FTHB_MAX_EXEMPTION * (BC_FTHB_PHASE_OUT_END_FMV - price) / (BC_FTHB_PHASE_OUT_END_FMV - BC_FTHB_FULL_EXEMPTION_FMV);
}

/* ── Ontario ──────────────────────────────────────── */

export const ON_FTHB_MAX_REFUND = 4_000;
export const TORONTO_FTHB_MAX_REBATE = 4_475;

const ON_TIERS: Tier[] = [
  { upTo: 55_000, rate: 0.005, label: "First $55,000" },
  { upTo: 250_000, rate: 0.01, label: "$55K – $250K" },
  { upTo: 400_000, rate: 0.015, label: "$250K – $400K" },
  { upTo: 2_000_000, rate: 0.02, label: "$400K – $2M" },
  { upTo: Infinity, rate: 0.025, label: "Over $2M" },
];

const TORONTO_TIERS: Tier[] = [
  { upTo: 55_000, rate: 0.005, label: "First $55,000" },
  { upTo: 250_000, rate: 0.01, label: "$55K – $250K" },
  { upTo: 400_000, rate: 0.015, label: "$250K – $400K" },
  { upTo: 2_000_000, rate: 0.02, label: "$400K – $2M" },
  { upTo: 3_000_000, rate: 0.025, label: "$2M – $3M" },
  { upTo: 4_000_000, rate: 0.044, label: "$3M – $4M" },
  { upTo: 5_000_000, rate: 0.0545, label: "$4M – $5M" },
  { upTo: 10_000_000, rate: 0.065, label: "$5M – $10M" },
  { upTo: 20_000_000, rate: 0.0755, label: "$10M – $20M" },
  { upTo: Infinity, rate: 0.086, label: "Over $20M" },
];

/** Ontario provincial Land Transfer Tax (residential, 1–2 single-family residences). */
export function ontarioLandTransferTax(price: number): TaxResult {
  return progressive(Math.max(0, price), ON_TIERS);
}

/** City of Toronto Municipal Land Transfer Tax (residential, rates as of Apr 1, 2026). */
export function torontoMunicipalLandTransferTax(price: number): TaxResult {
  return progressive(Math.max(0, price), TORONTO_TIERS);
}

/* ── Alberta ──────────────────────────────────────── */

/** Alberta Land Titles registration fee for a transfer or a mortgage of the given value. */
export function albertaRegistrationFee(value: number): number {
  if (!(value > 0)) return 0;
  return 50 + 5 * Math.ceil(value / 5_000);
}

/* ── Combined ─────────────────────────────────────── */

export type LttProvince = "BC" | "AB" | "ON";

export interface LandTransferTaxSummary {
  /** Provincial tax before first-time buyer relief (0 in Alberta) */
  provincialTax: number;
  /** Provincial first-time buyer exemption / refund */
  provincialRelief: number;
  /** Toronto MLTT before rebate (0 unless toronto) */
  municipalTax: number;
  municipalRelief: number;
  /** Alberta land titles fees (transfer + mortgage registration) */
  registrationFees: number;
  /** Net amount payable */
  total: number;
}

export function landTransferTax({ price, province, firstTime = false, toronto = false, mortgageAmount = 0 }: {
  price: number; province: LttProvince; firstTime?: boolean; toronto?: boolean; mortgageAmount?: number;
}): LandTransferTaxSummary {
  if (province === "AB") {
    const registrationFees = albertaRegistrationFee(price) + albertaRegistrationFee(mortgageAmount);
    return { provincialTax: 0, provincialRelief: 0, municipalTax: 0, municipalRelief: 0, registrationFees, total: registrationFees };
  }
  if (province === "BC") {
    const provincialTax = bcPropertyTransferTax(price).total;
    const provincialRelief = firstTime ? Math.min(provincialTax, bcFirstTimeBuyerExemption(price)) : 0;
    return { provincialTax, provincialRelief, municipalTax: 0, municipalRelief: 0, registrationFees: 0, total: provincialTax - provincialRelief };
  }
  const provincialTax = ontarioLandTransferTax(price).total;
  const provincialRelief = firstTime ? Math.min(provincialTax, ON_FTHB_MAX_REFUND) : 0;
  const municipalTax = toronto ? torontoMunicipalLandTransferTax(price).total : 0;
  const municipalRelief = toronto && firstTime ? Math.min(municipalTax, TORONTO_FTHB_MAX_REBATE) : 0;
  return {
    provincialTax, provincialRelief, municipalTax, municipalRelief, registrationFees: 0,
    total: provincialTax - provincialRelief + municipalTax - municipalRelief,
  };
}
