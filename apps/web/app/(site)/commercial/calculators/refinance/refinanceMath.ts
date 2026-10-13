import { payment } from "@/lib/calc/payment";

/**
 * Commercial refinance break-even math (shared by the /commercial/calculators/refinance page and
 * its tests; the AI `calculate_refinance_breakeven` tool uses the same rules, see tests/specialty).
 */
export type PenaltyType = "3month" | "ird" | "both";

export interface RefinanceInputs {
  currentBalance: number;
  /** Annual % */
  currentRate: number;
  /** Months left in the current TERM (drives the penalty) */
  remainingTermMonths: number;
  /** Years left to pay off the loan (drives the current payment) */
  remainingAmortizationYears: number;
  /** Annual % */
  newRate: number;
  newAmortizationYears: number;
  penaltyType?: PenaltyType;
  legalFees?: number;
  appraisalFee?: number;
  dischargeFee?: number;
}

export const DEFAULT_REFI_FEES = { legalFees: 1500, appraisalFee: 500, dischargeFee: 350 } as const;

export function refinanceBreakEven(i: RefinanceInputs) {
  const balance = Math.max(0, i.currentBalance || 0);
  const currentRate = Math.max(0, i.currentRate || 0);
  const newRate = Math.max(0, i.newRate || 0);
  const termMonths = Math.max(0, i.remainingTermMonths || 0);
  const legalFees = Math.max(0, i.legalFees ?? DEFAULT_REFI_FEES.legalFees);
  const appraisalFee = Math.max(0, i.appraisalFee ?? DEFAULT_REFI_FEES.appraisalFee);
  const dischargeFee = Math.max(0, i.dischargeFee ?? DEFAULT_REFI_FEES.dischargeFee);

  // 3 months' interest
  const threeMonthPenalty = balance * (currentRate / 100 / 12) * 3;
  // IRD approximation: uses the new rate as the lender's comparison rate (lenders use their own
  // posted/comparison rate for the remaining term, which often produces a higher penalty).
  const irdPenalty = balance * (Math.max(0, currentRate - newRate) / 100 / 12) * termMonths;
  const higherPenalty = Math.max(threeMonthPenalty, irdPenalty);
  const penaltyType = i.penaltyType ?? "both";
  const penalty = penaltyType === "3month" ? threeMonthPenalty : penaltyType === "ird" ? irdPenalty : higherPenalty;

  const fees = legalFees + appraisalFee + dischargeFee;
  const totalCosts = penalty + fees;

  // Canadian semi-annual compounding. The current payment amortizes over the REMAINING AMORTIZATION
  // (not the remaining term, which would overstate savings).
  const currentMonthlyPayment = balance > 0
    ? payment({ principal: balance, annualRatePct: currentRate, amortYears: Math.max(1, i.remainingAmortizationYears || 1), paymentsPerYear: 12 })
    : 0;
  const newMonthlyPayment = balance > 0
    ? payment({ principal: balance, annualRatePct: newRate, amortYears: Math.max(1, i.newAmortizationYears || 1), paymentsPerYear: 12 })
    : 0;

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : Infinity;
  const fiveYearSavings = monthlySavings * 60 - totalCosts;
  const isWorthRefinancing = monthlySavings > 0 && breakEvenMonths < termMonths;

  return {
    threeMonthPenalty,
    irdPenalty,
    penalty,
    fees,
    totalCosts,
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    breakEvenMonths,
    fiveYearSavings,
    isWorthRefinancing,
  };
}
