import { principalFromPayment } from "./payment";
import { cmhcPremium, isInsurable, QUALIFYING_RATIOS } from "./cmhc";

// OSFI minimum qualifying rate (B-20): greater of contract rate + 2% or 5.25%.
// Source: OSFI "Minimum qualifying rate for uninsured mortgages" (page modified 2026-01-29, checked
// 2026-10-13): https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages
// Insured mortgages use the same test (Finance Canada, in force since June 1, 2021).
export function stressTestRate(quotedAprPct: number, minQualPct = 5.25) {
  return Math.max(quotedAprPct + 2, minQualPct);
}

/**
 * GDS / TDS as percentages of gross income. GDS housing costs should be
 * P&I (at the qualifying rate) + property tax + heat + 50% of condo fees.
 * Returns Infinity for non-positive income so callers never "pass" on bad input.
 */
export function gdsTds({ incomeAnnual, housingCostsAnnual, totalDebtAnnual }:{incomeAnnual:number;housingCostsAnnual:number;totalDebtAnnual:number;}){
  if (!(incomeAnnual > 0)) return { gds: Infinity, tds: Infinity };
  const gds = (housingCostsAnnual / incomeAnnual) * 100;
  const tds = ((housingCostsAnnual + totalDebtAnnual) / incomeAnnual) * 100;
  return { gds, tds };
}

/**
 * Largest monthly mortgage payment (P&I at the qualifying rate) that keeps GDS ≤ gdsMax
 * and TDS ≤ tdsMax. `nonMortgageHousingMonthly` = property tax + heat + 50% of condo fees.
 */
export function maxQualifyingPayment({ incomeAnnual, otherDebtsMonthly, nonMortgageHousingMonthly,
  gdsMaxPct = QUALIFYING_RATIOS.GDS_MAX, tdsMaxPct = QUALIFYING_RATIOS.TDS_MAX }: {
  incomeAnnual: number; otherDebtsMonthly: number; nonMortgageHousingMonthly: number; gdsMaxPct?: number; tdsMaxPct?: number;
}): number {
  if (!(incomeAnnual > 0)) return 0;
  const monthly = incomeAnnual / 12;
  return Math.max(0, Math.min(
    monthly * gdsMaxPct / 100 - nonMortgageHousingMonthly,
    monthly * tdsMaxPct / 100 - Math.max(0, otherDebtsMonthly) - nonMortgageHousingMonthly,
  ));
}

/** Largest loan (incl. any insurance premium) that payment can carry at the qualifying rate. */
export function maxQualifyingLoan(args: {
  incomeAnnual: number; otherDebtsMonthly: number; nonMortgageHousingMonthly: number; contractRatePct: number; amortYears: number;
}): number {
  const monthlyPayment = maxQualifyingPayment(args);
  return principalFromPayment({ monthlyPayment, annualRatePct: stressTestRate(args.contractRatePct), amortYears: args.amortYears });
}

/** Loan needed to buy `price` with `down` dollars down; with < 20% down the premium is financed into it. */
export function loanForPurchase(price: number, down: number, amortYears?: number): number {
  const base = Math.max(0, price - down);
  return down < price * 0.2 ? base + cmhcPremium(price, down, amortYears) : base;
}

export interface MaxPriceResult {
  /** Maximum purchase price (0 when nothing is affordable or the down payment is 0). */
  price: number;
  /** Loan at that price, including any financed insurance premium. */
  loan: number;
  /** Which rule stops a higher price: the income/ratio limit or the minimum down payment rules. */
  limitedBy: "income" | "downPayment" | "none";
}

/**
 * Highest price whose loan (incl. premium, with the >25-yr surcharge) fits within `maxLoan` AND for
 * which `down` is still a legal down payment (minimum-down tiers; 20% at $1.5M+). Both conditions are
 * monotonic in price, so a bisection between `down` and `down + maxLoan` finds the boundary.
 */
export function maxPurchasePrice({ down, maxLoan, amortYears }: { down: number; maxLoan: number; amortYears: number }): MaxPriceResult {
  const feasible = (p: number) => loanForPurchase(p, down, amortYears) <= maxLoan && (down >= p * 0.2 || isInsurable(p, down));
  if (!(maxLoan > 0) || !(down > 0) || !feasible(down)) return { price: 0, loan: 0, limitedBy: "none" };
  let lo = down, hi = down + maxLoan;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (feasible(mid)) lo = mid; else hi = mid;
  }
  const loan = loanForPurchase(lo, down, amortYears);
  // Just above the boundary: if the loan still fits, the down-payment rules are what bind
  const nudge = lo + Math.max(1, lo * 1e-6);
  const limitedBy = loanForPurchase(nudge, down, amortYears) <= maxLoan ? "downPayment" : "income";
  return { price: lo, loan, limitedBy };
}
