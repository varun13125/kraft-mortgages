import { balanceAfter, payment } from "./payment";

export interface RenewalOffer {
  name: string;
  rate: number;
  amortYears: number;
  termMonths: number;
  fees: number;
  cashback: number;
  clawback: number;
}

/** Same principal, monthly Canadian fixed payments, cash-paid transaction costs.
 * Cashback must be the amount retained at the comparison horizon after any clawback.
 * Never extrapolates beyond the shortest quoted term. No cash-out or capitalized fees.
 */
export function compareRenewal({ principal, baseline, offers, horizonMonths, earlyBreak = false, penalty = 0 }: {
  principal: number; baseline: RenewalOffer; offers: RenewalOffer[];
  horizonMonths: number; earlyBreak?: boolean; penalty?: number;
}) {
  const all = [baseline, ...offers];
  if (!Number.isFinite(principal) || principal <= 0 || principal > 1e9 ||
      !Number.isInteger(horizonMonths) || horizonMonths < 1 || horizonMonths > 120 ||
      !Number.isFinite(penalty) || penalty < 0 || penalty > 1e9 || offers.length < 1 || offers.length > 5 ||
      all.some(o => ![o.rate, o.amortYears, o.termMonths, o.fees, o.cashback, o.clawback].every(Number.isFinite) ||
        o.rate < 0 || o.rate > 30 || o.amortYears < 1 || o.amortYears > 50 ||
        !Number.isInteger(o.termMonths) || o.termMonths < 1 || o.termMonths > 120 ||
        [o.fees, o.cashback, o.clawback].some(n => n < 0 || n > 1e9))) {
    throw new RangeError("Enter valid balances, rates, terms and cash costs.");
  }
  const months = Math.min(horizonMonths, ...all.map(o => o.termMonths));
  const base = balanceAfter({ principal, annualRatePct: baseline.rate, amortYears: baseline.amortYears, monthsElapsed: months });
  const cost = (o: RenewalOffer, switching: boolean) => o.fees + o.clawback - o.cashback + (switching && earlyBreak ? penalty : 0);
  const baseCost = base.interestPaid + cost(baseline, false);
  const results = all.map((o, index) => {
    const ledger = balanceAfter({ principal, annualRatePct: o.rate, amortYears: o.amortYears, monthsElapsed: months });
    const cashCosts = cost(o, index > 0);
    const netCost = ledger.interestPaid + cashCosts;
    let recoveryMonths: number | null = index === 0 ? 0 : null;
    if (index > 0) {
      for (let m = 0; m <= months; m++) {
        const b = balanceAfter({ principal, annualRatePct: baseline.rate, amortYears: baseline.amortYears, monthsElapsed: m });
        const n = balanceAfter({ principal, annualRatePct: o.rate, amortYears: o.amortYears, monthsElapsed: m });
        if (b.interestPaid + cost(baseline, false) - n.interestPaid - cashCosts >= -0.005) { recoveryMonths = m; break; }
      }
    }
    if (baseCost - netCost < -0.005) recoveryMonths = null;
    return { ...o, ...ledger, monthlyPayment: payment({ principal, annualRatePct: o.rate, amortYears: o.amortYears }),
      cashCosts, netCost, savings: baseCost - netCost, recoveryMonths,
      straightSwitchShape: !earlyBreak && o.amortYears <= baseline.amortYears };
  });
  const winnerIndex = results.reduce((best, o, i) => o.netCost < results[best].netCost - 0.005 ? i : best, 0);
  return { months, capped: months < horizonMonths, results, winnerIndex };
}
