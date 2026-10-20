/**
 * MLI Select calculation helpers.
 *
 * Program criteria verified against CMHC's MLI Select at-a-glance sheet
 * (doc 66792 20251029-008A, ©2025) and the CMHC MLI Select page (published
 * 2026-09-21). Premium grid: CMHC multi-unit premiums effective 2025-07-14
 * (standard rental housing). CMHC changes these tables periodically — re-verify.
 */

/** Effective monthly rate for a nominal annual rate compounded semi-annually (Canadian convention). */
import { payment, periodicRate } from "../calc/payment";

/** Monthly payment, Canadian semi-annual compounding (matches lib/calc/payment.ts). */
export function pmt(rateAnnual: number, years: number, principal: number) {
  return payment({ annualRatePct: rateAnnual, amortYears: years, principal });
}

export function amortizationSchedule(rateAnnual: number, years: number, principal: number) {
  const r = periodicRate(rateAnnual);
  const n = Number.isFinite(years) && years > 0 && years <= 100 ? Math.round(years * 12) : 0;
  const pay = pmt(rateAnnual, years, principal);
  let bal = principal;
  const rows: { period: number; interest: number; principal: number; balance: number }[] = [];
  for (let i = 1; i <= n && bal > 0.005; i++) {
    const interest = r * bal;
    const princ = Math.min(bal, pay - interest);
    bal = Math.max(0, bal - princ);
    rows.push({ period: i, interest, principal: princ, balance: bal });
  }
  return { payment: pay, rows };
}

export function tierFromPoints(points: number) {
  if (points >= 100) return 100;
  if (points >= 70) return 70;
  if (points >= 50) return 50;
  return 0;
}

export function affordabilityPoints(isNew: boolean, pctAffordableUnits: number, years: number) {
  let base = 0;
  if (isNew) {
    if (pctAffordableUnits >= 25) base = 100;
    else if (pctAffordableUnits >= 15) base = 70;
    else if (pctAffordableUnits >= 10) base = 50;
  } else {
    if (pctAffordableUnits >= 80) base = 100;
    else if (pctAffordableUnits >= 60) base = 70;
    else if (pctAffordableUnits >= 40) base = 50;
  }
  // CMHC: affordability must be maintained for a minimum of 10 years; 20+ years earns +30 points.
  if (years < 10) return 0;
  const bonus = years >= 20 && base > 0 ? 30 : 0;
  return base + bonus;
}

/**
 * Energy efficiency points.
 * - New construction: % better than NECB Tier 1 — 25% → 20 pts, 50% → 35 pts, 60% → 50 pts
 *   (NBC Tier 1 equivalents are 20% / 40% / 70%).
 * - Existing: % decrease vs current baseline — 15% → 20 pts, 25% → 35 pts, 40% → 50 pts.
 */
export function energyPoints(improvementPct: number, isNew = false) {
  if (isNew) {
    if (improvementPct >= 60) return 50;
    if (improvementPct >= 50) return 35;
    if (improvementPct >= 25) return 20;
    return 0;
  }
  if (improvementPct >= 40) return 50;
  if (improvementPct >= 25) return 35;
  if (improvementPct >= 15) return 20;
  return 0;
}

export function accessibilityPoints({
  visitableAll,
  commonsBarrierFree,
  pctAccessible,
  pctUniversal,
  rhfScore
}: {
  visitableAll: boolean;
  commonsBarrierFree: boolean;
  pctAccessible: number;
  pctUniversal: number;
  rhfScore: number;
}) {
  if (!visitableAll || !commonsBarrierFree) return 0;
  const level2 =
    (pctAccessible >= 15 && pctUniversal >= 85) ||
    pctUniversal === 100 ||
    pctAccessible === 100 ||
    rhfScore >= 80;
  if (level2) return 30;
  const level1 = pctAccessible >= 15 || pctUniversal >= 15 || (rhfScore >= 60 && rhfScore < 80);
  return level1 ? 20 : 0;
}

export function totalPointsCalc(a: number, e: number, acc: number) {
  return Math.min(a + e + acc, 100); // CMHC caps total MLI Select points at 100
}

export function amortByTier(tier: number) {
  // CMHC MLI Select max amortization (new & existing): 50 pts → 40 yrs, 70 → 45, 100 → 50.
  // Below 50 points: 25-year conventional baseline used for comparison
  // (standard CMHC MLI rental allows up to 40 years on existing properties).
  if (tier >= 100) return 50;
  if (tier >= 70) return 45;
  if (tier >= 50) return 40;
  return 25;
}

export function leverageFor(isNew: boolean, tier: number) {
  // CMHC MLI Select max LTC (new construction) / LTV (existing), residential component:
  //   ≥100 pts: 95% / 95%
  //   ≥70 pts:  95% / 95%
  //   ≥50 pts:  95% / 85%
  // Below threshold: 80% (conventional baseline; standard CMHC MLI rental allows up to 85%).
  if (tier >= 70) return 0.95;
  if (tier >= 50) return isNew ? 0.95 : 0.85;
  return 0.80;
}

export function premiumDiscountFor(tier: number) {
  // MLI Select discount, applied to base premium + surcharges (CMHC, effective 2025-07-14).
  if (tier >= 100) return 0.30;
  if (tier >= 70) return 0.20;
  if (tier >= 50) return 0.10;
  return 0;
}

export type MliLoanPurpose = "construction" | "other";

/**
 * CMHC multi-unit base premium (% of loan), standard rental housing,
 * effective 2025-07-14. Bands above 85% LTV are MLI Select only.
 */
export function mliBasePremiumPct(ltvPct: number, purpose: MliLoanPurpose) {
  const grid: [number, number, number][] = [
    // [max LTV %, construction, all other purposes]
    [65, 3.25, 2.60],
    [70, 3.75, 2.85],
    [75, 4.25, 3.35],
    [80, 5.00, 4.35],
    [85, 6.00, 5.35],
    [90, 6.75, 5.90],
  ];
  for (const [max, cons, other] of grid) {
    if (ltvPct <= max) return purpose === "construction" ? cons : other;
  }
  return purpose === "construction" ? 7.00 : 6.15;
}

/** CMHC amortization surcharge: +0.25% per 5-year increment beyond 25 years. */
export function mliAmortizationSurchargePct(years: number) {
  if (years <= 25) return 0;
  return Math.ceil((years - 25) / 5) * 0.25;
}

export function maxLoanFromValueOrCost(isNew: boolean, tier: number, valueOrCost: number) {
  return valueOrCost * leverageFor(isNew, tier);
}

export function dscrMaxLoan({
  noi,
  rateAnnual,
  years,
  minDcr
}: {
  noi: number;
  rateAnnual: number;
  years: number;
  minDcr: number;
}) {
  const payPer1 = pmt(rateAnnual, years, 1);
  if (!(payPer1 > 0) || !(minDcr > 0) || !(noi > 0)) return 0;
  const requiredMonthly = noi / minDcr / 12;
  return requiredMonthly / payPer1;
}

export function breakEvenRentPerUnit({
  monthlyDebtService,
  otherMonthlyOpex,
  units,
  targetMargin = 0,
  vacancyRate = 0
}: {
  monthlyDebtService: number;
  otherMonthlyOpex: number;
  units: number;
  targetMargin?: number;
  /** Decimal vacancy/credit-loss allowance, e.g. 0.03. Rent is grossed up so collected rent covers costs. */
  vacancyRate?: number;
}) {
  if (![units, vacancyRate, targetMargin, monthlyDebtService, otherMonthlyOpex].every(Number.isFinite) ||
      units <= 0 || vacancyRate < 0 || vacancyRate >= 1 || targetMargin < 0 || targetMargin >= 1) return 0;
  const occupancy = 1 - vacancyRate;
  // Margin = profit / revenue, not profit / costs (markup).
  const needed = (monthlyDebtService + otherMonthlyOpex) / (1 - targetMargin);
  return needed / (units * occupancy);
}

/** CMHC affordability threshold: monthly rent ≤ 30% of the market's median renter household income. */
export function rentCapFromMedian(medianAnnualIncome: number) {
  return (medianAnnualIncome * 0.30) / 12;
}
