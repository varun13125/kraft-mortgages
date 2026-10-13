/**
 * Shared CMHC (mortgage default insurance) helper.
 *
 * SINGLE SOURCE OF TRUTH for CMHC premium / minimum down payment rules across
 * the residential calculators.
 *
 * Sources (re-verified 2026-10-13 against primary sources, BUG-044):
 *  - Premium table (≤65% 0.60%, ≤75% 1.70%, ≤80% 2.40%, ≤85% 2.80%, ≤90% 3.10%, ≤95% 4.00%,
 *    4.50% for 90.01–95% with a non-traditional down payment): CMHC "Premium information for
 *    homeowner and small rental loans" https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/premium-information-for-homeowner-and-small-rental-loans
 *    and Sagen https://www.sagen.ca/mortgage-insurance/premium-rates/ (same table).
 *  - 0.20% surcharge for amortizations over 25 years: CMHC notice 2024-06-05 ("premium surcharge of
 *    20 basis points", effective 2024-08-01) https://www.cmhc-schl.gc.ca/media-newsroom/notices/2024/cmhc-revises-homeowner-mortgage-loan-insurance-premiums ;
 *    Sagen ("an additional premium of 0.20% will apply"); Canada Guaranty over-25-yr columns
 *    3.00/3.30/4.20% (updated 03/2026) https://www.canadaguaranty.ca/portable-advantage/ .
 *    Insured 30-year purchases exist only above 80% LTV, which is the only case cmhcPremiumRate()
 *    charges a premium, so the surcharge never applies with 20%+ down.
 *  - Dec 15, 2024 federal reforms (still current Oct 2026): insured price cap $1.5M; 30-year insured
 *    amortization for all first-time buyers and buyers of new builds
 *    https://www.canada.ca/en/department-finance/news/2024/12/boldest-mortgage-reforms-in-decades-come-into-force-today.html ;
 *    minimum down payment tiers: FCAC https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
 *  - Sales tax on the premium (cash at closing, can't be financed): ON 8% RST (ontario.ca "Retail sales
 *    tax: insurance and benefits plans", updated 2026-09-18); SK 6% (PST bulletin PST-73); QC 9%, rising
 *    to 9.975% for premiums paid after 2026-12-31 (Revenu Québec tax news 2026-04-09).
 * Not financial advice.
 */

/** Purchase price at/above which mortgage default insurance is unavailable (Finance Canada, Dec 15, 2024). */
export const INSURED_PRICE_CAP = 1_500_000;

/** Premium surcharge (decimal) added for insured amortizations longer than 25 years (CMHC 2024-08-01; verified 2026-10-13). */
export const LONG_AMORTIZATION_SURCHARGE = 0.002;

/** Provincial sales tax charged on the premium (payable in cash at closing). Verified 2026-10-13. */
export const PREMIUM_PST_RATES: Record<string, number> = { ON: 0.08, QC: 0.09, SK: 0.06 };

/** Quebec's tax on insurance premiums is harmonised with the QST (9.975%) for premiums paid after 2026-12-31. */
export const QC_PREMIUM_TAX_FROM_2027 = 0.09975;
const QC_PREMIUM_TAX_CHANGE = Date.parse("2027-01-01T05:00:00Z"); // midnight Jan 1, 2027 Eastern

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

/** Sales-tax rate on the premium for a province code, as of `asOf` (default: now). 0 where none applies. */
export function premiumPstRate(provinceCode: string, asOf: Date = new Date()): number {
  if (provinceCode === "QC" && asOf.getTime() >= QC_PREMIUM_TAX_CHANGE) return QC_PREMIUM_TAX_FROM_2027;
  return PREMIUM_PST_RATES[provinceCode] ?? 0;
}

/** PST on the premium for the given province code (ON 8%, QC 9% → 9.975% from 2027, SK 6%; 0 elsewhere). Paid in cash at closing. */
export function premiumPst(premium: number, provinceCode: string, asOf?: Date): number {
  return premium * premiumPstRate(provinceCode, asOf);
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
 * Per OSFI B-20 guideline (unchanged as of 2026; OSFI MQR page modified 2026-01-29, checked 2026-10-13):
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
