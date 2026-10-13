/**
 * Shared land transfer tax / registration fee helpers for BC, Alberta and Ontario.
 * SINGLE SOURCE OF TRUTH for the land-transfer-tax, closing-costs,
 * first-time-home-buyer and mortgage-qualifier calculators.
 *
 * Sources (all re-verified against primary sources on 2026-10-13, BUG-044):
 *  - BC Property Transfer Tax: 1% first $200k, 2% to $2M, 3% above $2M, plus a
 *    further 2% on the residential portion above $3M. gov.bc.ca (updated 2025-12-03)
 *    https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax
 *  - BC First Time Home Buyers' exemption (from Apr 1, 2024): no PTT on the first
 *    $500,000 (max $8,000) when FMV ≤ $835,000; reduced proportionally to $0 at
 *    $860,000. gov.bc.ca "current exemption amounts" table: $852,000 → $15,040 tax,
 *    $2,560 exemption, $12,480 payable (updated 2025-12-03)
 *    https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount
 *  - Ontario LTT (1–2 single-family residences): 0.5% to $55k, 1% to $250k,
 *    1.5% to $400k, 2% to $2M, 2.5% above (ontario.ca, updated 2026-04-22)
 *    https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax
 *    First-time buyer refund max $4,000 (conveyances from Jan 1, 2017)
 *    https://www.ontario.ca/document/land-transfer-tax/land-transfer-tax-refunds-first-time-homebuyers
 *  - Toronto MLTT: provincial brackets to $3M, then 4.40% / 5.45% / 6.50% / 7.55% / 8.60%
 *    at $3M/$4M/$5M/$10M/$20M for properties with 1–2 single-family residences, "take effect
 *    on April 1, 2026" (toronto.ca, modified 2026-04-07)
 *    https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees
 *    First-time purchaser rebate "up to $4,475.00" (modified 2025-12-18).
 *  - Alberta: no land transfer tax. Land Titles Act s.64.1(2) (transfers) and s.102.1(2)
 *    (mortgages, on the principal amount secured): "$50 plus $5 for each $5000 or portion
 *    thereof" → rounds UP ($500,001 → $555). Levy in force Oct 20, 2024 (OIC 2024/266);
 *    the mortgage land-value option s.102.1(3) is repealed (2024 c15 s9).
 *    Act (current as of 2026-09-01): https://kings-printer.alberta.ca/documents/Acts/L04.pdf
 *    Fee schedule (effective 2026-10-01): https://www.alberta.ca/system/files/sartr-land-titles-and-surveys-common-documents-fee-schedule.pdf
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

// gov.bc.ca first-time home buyers exemption, effective Apr 1, 2024 (verified 2026-10-13)
export const BC_FTHB_FULL_EXEMPTION_FMV = 835_000;
export const BC_FTHB_PHASE_OUT_END_FMV = 860_000;
/** PTT on the first $500,000 = 1% × 200k + 2% × 300k */
export const BC_FTHB_MAX_EXEMPTION = 8_000;

// gov.bc.ca Property Transfer Tax rates (verified 2026-10-13)
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

// ontario.ca first-time homebuyer refund; toronto.ca MLTT rebate (both verified 2026-10-13)
export const ON_FTHB_MAX_REFUND = 4_000;
export const TORONTO_FTHB_MAX_REBATE = 4_475;

const ON_TIERS: Tier[] = [
  { upTo: 55_000, rate: 0.005, label: "First $55,000" },
  { upTo: 250_000, rate: 0.01, label: "$55K – $250K" },
  { upTo: 400_000, rate: 0.015, label: "$250K – $400K" },
  { upTo: 2_000_000, rate: 0.02, label: "$400K – $2M" },
  { upTo: Infinity, rate: 0.025, label: "Over $2M" },
];

// toronto.ca MLTT residential rates in effect from Apr 1, 2026 (verified 2026-10-13)
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

/**
 * Alberta Land Titles registration fee for a transfer (value of land) or a mortgage (principal secured):
 * $50 + $5 for each $5,000 "or portion thereof" — Land Titles Act s.64.1(2) / s.102.1(2), verified 2026-10-13.
 */
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
