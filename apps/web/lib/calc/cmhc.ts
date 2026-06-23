/**
 * Shared CMHC (mortgage default insurance) helper.
 *
 * SINGLE SOURCE OF TRUTH for CMHC premium calculations across all calculators.
 * Replaces the three divergent implementations that existed before (down-payment-%
 * tiers on cmhc-insurance page, fabricated LTV-based rates on required-income/
 * closing-costs, and a <5%-returns-0 bug on first-time-home-buyer).
 *
 * Rates source: CMHC/Sagen/Canada Guaranty 2025 standard owner-occupied schedule.
 * Not financial advice.
 */

/**
 * Calculate CMHC premium rate based on down payment percentage.
 *
 * CMHC 2025 standard premium schedule (owner-occupied, purchase < $1M):
 *   ≥ 20% down → 0%       (conventional, no insurance required)
 *   15.0–19.99% → 2.80%
 *   10.0–14.99% → 3.10%
 *   5.0–9.99%  → 4.00%
 *   < 5%        → 4.20%   (technically doesn't qualify for insurance, but shown for completeness)
 *
 * @param downPaymentPct - Down payment as a percentage of purchase price (e.g., 10 for 10%)
 * @returns Premium rate as a decimal (e.g., 0.031 for 3.1%)
 */
export function cmhcPremiumRate(downPaymentPct: number): number {
  if (downPaymentPct >= 20) return 0;
  if (downPaymentPct >= 15) return 0.028;
  if (downPaymentPct >= 10) return 0.031;
  if (downPaymentPct >= 5) return 0.04;
  return 0.042; // Under 5% — technically uninsurable, but return the rate for display
}

/**
 * Calculate CMHC premium amount.
 *
 * @param purchasePrice - Purchase price of the property
 * @param downPayment - Down payment amount
 * @returns Premium dollar amount
 */
export function cmhcPremium(purchasePrice: number, downPayment: number): number {
  const downPct = (downPayment / purchasePrice) * 100;
  const rate = cmhcPremiumRate(downPct);
  const loanAmount = purchasePrice - downPayment;
  return loanAmount * rate;
}

/**
 * Calculate the insured mortgage amount (base loan + CMHC premium).
 *
 * @param purchasePrice - Purchase price of the property
 * @param downPayment - Down payment amount
 * @returns The total insured mortgage (what the borrower actually owes)
 */
export function insuredMortgageAmount(purchasePrice: number, downPayment: number): number {
  const base = purchasePrice - downPayment;
  return base + cmhcPremium(purchasePrice, downPayment);
}

/**
 * Canadian mortgage stress test qualifying rate.
 *
 * Per OSFI B-20 guideline:
 *   qualifying rate = max(contract rate + 2%, 5.25%)
 *
 * The 5.25% floor was set when the BoC 5-year benchmark was discontinued (2021).
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
 * Many lenders use the more conservative 32% / 40% traditional guideline.
 * This returns the standard (39/44) set used for qualification.
 */
export const QUALIFYING_RATIOS = {
  GDS_MAX: 39,  // Gross Debt Service ratio max (% of income)
  TDS_MAX: 44,  // Total Debt Service ratio max (% of income)
} as const;
