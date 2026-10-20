import { payment, principalFromPayment } from "./payment";
import { affordabilityPoints, energyPoints, accessibilityPoints, totalPointsCalc, tierFromPoints,
  amortByTier, leverageFor, premiumDiscountFor, mliBasePremiumPct, mliAmortizationSurchargePct } from "../mli/calcs";

export interface MliDealInput {
  isNew: boolean; units: number; affordableUnits: number; affordabilityYears: number;
  energyImprovement: number; accessiblePct: number; universalPct: number;
  visitableAll: boolean; barrierFreeCommons: boolean;
  value: number; noi: number; rate: number; amortYears: number; minDcr: number;
  closingCosts: number; financePremium: boolean;
}

/** Standard rental only. NOI is annual stabilized lender-adjusted NOI, before debt service.
 * The premium is based on BASE loan/value. Financed premiums consume DCR capacity.
 * A bounded monotone search handles the discontinuous premium/LTV bands conservatively.
 */
export function sizeMliDeal(i: MliDealInput) {
  const errors: string[] = [];
  if (!Object.values(i).every(v => typeof v !== "number" || Number.isFinite(v))) errors.push("All inputs must be finite.");
  if (!Number.isInteger(i.units) || i.units < 5 || i.units > 100000 || !Number.isInteger(i.affordableUnits) || i.affordableUnits < 0 || i.affordableUnits > i.units) errors.push("Use at least 5 units and an affordable unit count no greater than total units.");
  if (i.value <= 0 || i.value > 1e9 || i.noi <= 0 || i.noi > 1e9 || i.rate < 0 || i.rate > 30 || i.amortYears < 1 || i.amortYears > 50 || i.minDcr < 1.10 || i.minDcr > 3 || i.closingCosts < 0 || i.closingCosts > 1e9 || i.affordabilityYears < 0 || i.affordabilityYears > 100 || [i.energyImprovement, i.accessiblePct, i.universalPct].some(v => v < 0 || v > 100)) errors.push("Review the project, rate, amortization and DCR inputs.");
  const affordable = errors.length ? 0 : affordabilityPoints(i.isNew, i.affordableUnits / i.units * 100, i.affordabilityYears);
  const energy = errors.length ? 0 : energyPoints(i.energyImprovement, i.isNew);
  const access = errors.length ? 0 : accessibilityPoints({ visitableAll: i.visitableAll, commonsBarrierFree: i.barrierFreeCommons, pctAccessible: i.accessiblePct, pctUniversal: i.universalPct, rhfScore: 0 });
  const points = totalPointsCalc(affordable, energy, access);
  const tier = tierFromPoints(points);
  if (!errors.length && !tier) errors.push("This scenario does not reach the 50-point MLI Select threshold. Explore standard MLI with an advisor.");
  const amort = Number.isFinite(i.amortYears) ? Math.max(0, Math.min(i.amortYears, amortByTier(tier))) : 0;
  const leverage = leverageFor(i.isNew, tier);
  const leverageCap = i.value * leverage;
  const debtCapacity = principalFromPayment({ monthlyPayment: i.noi / i.minDcr / 12, annualRatePct: i.rate, amortYears: amort });
  const premiumPct = (base: number) => (mliBasePremiumPct(base / i.value * 100, i.isNew ? "construction" : "other") + mliAmortizationSurchargePct(amort)) * (1 - premiumDiscountFor(tier));
  const grossDebt = (base: number) => base * (1 + (i.financePremium ? premiumPct(base) / 100 : 0));
  let low = 0, high = leverageCap;
  if (!errors.length) for (let n = 0; n < 100; n++) { const mid = (low + high) / 2; if (grossDebt(mid) <= debtCapacity) low = mid; else high = mid; }
  // Floor to cents to avoid exceeding a DCR or leverage boundary after rounding.
  const baseLoan = errors.length ? 0 : Math.floor(low * 100) / 100;
  const premiumRate = errors.length ? 0 : premiumPct(baseLoan);
  const premium = baseLoan * premiumRate / 100;
  const totalDebt = baseLoan + (i.financePremium ? premium : 0);
  const monthlyPayment = payment({ principal: totalDebt, annualRatePct: i.rate, amortYears: amort });
  const annualDebtService = monthlyPayment * 12;
  const cashRequired = errors.length ? 0 : i.value - baseLoan + i.closingCosts + (i.financePremium ? 0 : premium);
  return { eligible: !errors.length, errors, points, tier, affordable, energy, access, amort, leverage,
    leverageCap: errors.length ? 0 : leverageCap, debtCapacity: errors.length ? 0 : debtCapacity,
    baseLoan, premiumRate, premium, totalDebt, monthlyPayment, annualDebtService, cashRequired,
    dscr: annualDebtService > 0 ? i.noi / annualDebtService : 0,
    annualCashFlow: errors.length ? 0 : i.noi - annualDebtService,
    binding: !errors.length && grossDebt(leverageCap) <= debtCapacity ? "Leverage" : "Debt coverage" };
}
