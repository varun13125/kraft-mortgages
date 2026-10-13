/**
 * Shared CMHC (mortgage default insurance) helper.
 *
 * SINGLE SOURCE OF TRUTH for CMHC premium / minimum down payment rules across
 * the residential calculators.
 *
 * Sources (verified Oct 2026):
 *  - CMHC premium table: cmhc-schl.gc.ca "Mortgage loan insurance cost"
 *    (≤65% 0.60%, ≤75% 1.70%, ≤80% 2.40%, ≤85% 2.80%, ≤90% 3.10%, ≤95% 4.00%,
 *    4.50% for 90.01–95% with a non-traditional down payment). PST applies in
 *    ON, QC and SK and cannot be added to the loan.
 *  - Dec 15, 2024 federal mortgage reforms (canada.ca, Dept. of Finance): insured
 *    price cap raised to $1.5M; 30-year insured amortization for all first-time
 *    buyers and buyers of new builds. Insurers apply a 0.20% premium surcharge
 *    for amortizations over 25 years.
 * Not financial advice.
 */

/** Purchase price at/above which mortgage default insurance is unavailable. */
export const INSURED_PRICE_CAP = 1_500_000;

/** Premium surcharge (decimal) added for insured amortizations longer than 25 years. */
export const LONG_AMORTIZATION_SURCHARGE = 0.002;

/** Provincial sales tax charged on the premium (payable in cash at closing). */
export const PREMIUM_PST_RATES: Record<string, number> = { ON: 0.08, QC: 0.09, SK: 0.06 };

// Small tolerance so e.g. 15% computed as 14.999999999 doesn't fall into the 10–15% tier.
const EPS = 1e-9;

/**
 * Minimum down payment for an owner-occupied purchase (rules since Dec 15, 2024):
 *   5% of the first $500,000 + 10% of the portion from $500,000 up to $1.5M;
 *   20% of the whole price when the price is $1.5M or more (insurance unavailable).
 */
export function minimumDownPayment(price: number): number {
  if (!(price > 0)) return 0;
  if (price >= INSURED_PRICE_CAP) return price * 0.2;
  if (price <= 500_000) return price * 0.05;
  return 25_000 + (price - 500_000) * 0.1;
}

/** True when a purchase with this down payment can be insured (and therefore financed with <20% down). */
export function isInsurable(price: number, downPayment: number): boolean {
  return price > 0 && price < INSURED_PRICE_CAP && downPayment + EPS >= minimumDownPayment(price);
}

/**
 * Premium rate from loan-to-value (percent, e.g. 90 for 90%).
 * @returns Premium rate as a decimal (e.g. 0.031 for 3.10%).
 */
export function cmhcPremiumRateByLtv(ltvPct: number, opts: { nonTraditionalDownPayment?: boolean } = {}): number {
  if (ltvPct <= 65 + EPS) return 0.006;
  if (ltvPct <= 75 + EPS) return 0.017;
  if (ltvPct <= 80 + EPS) return 0.024;
  if (ltvPct <= 85 + EPS) return 0.028;
  if (ltvPct <= 90 + EPS) return 0.031;
  return opts.nonTraditionalDownPayment ? 0.045 : 0.04;
}

/**
 * Premium rate for a PURCHASE based on down payment percentage.
 * With 20%+ down insurance isn't required, so this returns 0.
 *   15.00–19.99% → 2.80% | 10.00–14.99% → 3.10% | 5.00–9.99% → 4.00%
 * Below 5% the purchase is not insurable — 4.00% is returned for display only;
 * callers should flag it (see isInsurable / minimumDownPayment).
 *
 * @param downPaymentPct - Down payment as a percentage of purchase price (e.g., 10 for 10%)
 * @param amortYears - Optional amortization; > 25 years adds the 0.20% surcharge
 * @returns Premium rate as a decimal (e.g., 0.031 for 3.1%)
 */
export function cmhcPremiumRate(downPaymentPct: number, amortYears?: number): number {
  if (downPaymentPct + EPS >= 20) return 0;
  const base = cmhcPremiumRateByLtv(100 - downPaymentPct);
  return base + (amortYears !== undefined && amortYears > 25 ? LONG_AMORTIZATION_SURCHARGE : 0);
}

/**
 * Calculate CMHC premium amount (added to the mortgage).
 *
 * @param purchasePrice - Purchase price of the property
 * @param downPayment - Down payment amount
 * @param amortYears - Optional amortization; > 25 years adds the 0.20% surcharge
 * @returns Premium dollar amount
 */
export function cmhcPremium(purchasePrice: number, downPayment: number, amortYears?: number): number {
  if (!(purchasePrice > 0)) return 0;
  const downPct = (downPayment / purchasePrice) * 100;
  const rate = cmhcPremiumRate(downPct, amortYears);
  const loanAmount = Math.max(0, purchasePrice - downPayment);
  return loanAmount * rate;
}

/** PST on the premium for the given province code (ON 8%, QC 9%, SK 6%; 0 elsewhere). Paid in cash at closing. */
export function premiumPst(premium: number, provinceCode: string): number {
  return premium * (PREMIUM_PST_RATES[provinceCode] ?? 0);
}

/**
 * Calculate the insured mortgage amount (base loan + CMHC premium).
 *
 * @param purchasePrice - Purchase price of the property
 * @param downPayment - Down payment amount
 * @param amortYears - Optional amortization; > 25 years adds the 0.20% surcharge
 * @returns The total insured mortgage (what the borrower actually owes)
 */
export function insuredMortgageAmount(purchasePrice: number, downPayment: number, amortYears?: number): number {
  const base = Math.max(0, purchasePrice - downPayment);
  return base + cmhcPremium(purchasePrice, downPayment, amortYears);
}

/**
 * Canadian mortgage stress test qualifying rate.
 *
 * Per OSFI B-20 guideline (unchanged as of 2026):
 *   qualifying rate = max(contract rate + 2%, 5.25%)
 *
 * The 5.25% floor replaced the BoC 5-year benchmark in 2021.
 * Insured and uninsured mortgages both use this rule.
 *
 * @param contractRatePct - The contract/quoted interest rate as a percentage (e.g., 5.49)
 * @returns The qualifying stress-test rate as a percentage (e.g., 7.49)
 */
export function stressTestRate(contractRatePct: number): number {
  return Math.max(contractRatePct + 2, 5.25);
}

/**
 * Canadian GDS/TDS qualifying thresholds.
 *
 * CMHC's published qualifying maxima are 39% GDS / 44% TDS for insured mortgages.
 * Some lenders use the more conservative 32% / 40% traditional guideline.
 * This returns the standard (39/44) set used for qualification.
 */
export const QUALIFYING_RATIOS = {
  GDS_MAX: 39,  // Gross Debt Service ratio max (% of income)
  TDS_MAX: 44,  // Total Debt Service ratio max (% of income)
} as const;
