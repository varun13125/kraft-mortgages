import { balanceAfter, payment } from "./payment";

export interface RefinanceComparison {
  principal: number;
  currentRate: number;
  newRate: number;
  currentAmortYears: number;
  newAmortYears: number;
  horizonMonths: number;
  upfrontCosts: number;
  currentMonthlyPayment?: number;
}

/** Compare interest + upfront costs on the same debt and over the same horizon.
 * Payment relief is reported separately: repaying principal more slowly is not a saving.
 * Rates are assumed constant for the selected horizon; fees are paid in cash.
 */
export function compareRefinance(i: RefinanceComparison) {
  const numbers = [i.principal, i.currentRate, i.newRate, i.currentAmortYears, i.newAmortYears,
    i.horizonMonths, i.upfrontCosts, i.currentMonthlyPayment ?? 0];
  if (!numbers.every(Number.isFinite) || i.principal <= 0 || i.currentRate < 0 || i.newRate < 0 ||
      i.currentAmortYears <= 0 || i.newAmortYears <= 0 || i.horizonMonths < 0 || i.upfrontCosts < 0 ||
      (i.currentMonthlyPayment ?? 0) < 0) {
    return { currentPayment: 0, newPayment: 0, monthlySavings: 0, currentBalance: 0, newBalance: 0,
      interestSaved: 0, netSavings: 0, breakEvenMonths: Infinity, horizonMonths: 0, worthwhile: false };
  }
  const horizonMonths = Math.min(1200, Math.max(0, Math.floor(i.horizonMonths)));
  const costs = Math.max(0, i.upfrontCosts);
  const currentPayment = i.currentMonthlyPayment ?? payment({
    principal: i.principal, annualRatePct: i.currentRate, amortYears: i.currentAmortYears,
  });
  const newPayment = payment({
    principal: i.principal, annualRatePct: i.newRate, amortYears: i.newAmortYears,
  });
  const currentAt = (months: number) => balanceAfter({
    principal: i.principal, annualRatePct: i.currentRate, amortYears: i.currentAmortYears,
    monthlyPayment: currentPayment, monthsElapsed: months,
  });
  const nextAt = (months: number) => balanceAfter({
    principal: i.principal, annualRatePct: i.newRate, amortYears: i.newAmortYears,
    monthlyPayment: newPayment, monthsElapsed: months,
  });
  const current = currentAt(horizonMonths);
  const next = nextAt(horizonMonths);
  const interestSaved = current.interestPaid - next.interestPaid;
  const netSavings = interestSaved - costs;
  let breakEvenMonths = Infinity;
  for (let month = 1; month <= horizonMonths; month++) {
    if (currentAt(month).interestPaid - nextAt(month).interestPaid >= costs) {
      breakEvenMonths = month;
      break;
    }
  }
  return {
    currentPayment, newPayment, monthlySavings: currentPayment - newPayment,
    currentBalance: current.balance, newBalance: next.balance,
    interestSaved, netSavings, breakEvenMonths, horizonMonths,
    worthwhile: i.principal > 0 && horizonMonths > 0 && netSavings > 0,
  };
}
