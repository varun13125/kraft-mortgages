export type Draw = { month: number; amount: number };

/** Budget coverage, not physical completion. Loan commitments are not cash already advanced. */
export function constructionFunding({ totalCost, equityInvested, loanFunded, loanCommitment }: {
  totalCost: number; equityInvested: number; loanFunded: number; loanCommitment: number;
}) {
  const funded = Math.max(0, equityInvested) + Math.max(0, loanFunded);
  const remainingCost = Math.max(0, totalCost - funded);
  const budgetSurplus = Math.max(0, funded - totalCost);
  const undisbursedLoan = Math.max(0, loanCommitment - loanFunded);
  return { remainingCost, budgetSurplus, undisbursedLoan,
    fundedPct: totalCost > 0 ? Math.min(100, funded / totalCost * 100) : 0,
    fundingGap: remainingCost - undisbursedLoan };
}

// Interest-only cost of a progressive-draw construction loan (simple monthly interest on drawn balance).
// Not financial advice.
export function interestOnlyCost({ draws, annualRatePct, periodMonths }: { draws: Draw[]; annualRatePct: number; periodMonths?: number }) {
  const r = Math.max(0, annualRatePct || 0) / 100 / 12;
  // Normalise draws: whole months clamped to 1..60 (5 years) so a month of 0, a negative or a
  // fractional month is not silently dropped from the interest calc; negative amounts ignored.
  const norm = draws.map((d) => ({
    month: Math.min(60, Math.max(1, Math.round(Number(d.month) || 1))),
    amount: Math.max(0, Number(d.amount) || 0),
  }));
  const lastDrawMonth = Math.max(1, ...norm.map((d) => d.month));
  // Interest runs to the end of the construction period: the given period (if any), otherwise at
  // least 12 months, and never shorter than the last draw. Clamped to 60 months to prevent runaway loops.
  const requested = periodMonths && periodMonths > 0 ? Math.round(periodMonths) : 12;
  const maxMonth = Math.min(60, Math.max(requested, lastDrawMonth));
  let bal = 0;
  const timeline: { month: number; draw: number; balance: number; interest: number }[] = [];
  for (let m = 1; m <= maxMonth; m++) {
    const added = norm.filter((d) => d.month === m).reduce((a, b) => a + b.amount, 0);
    bal += added;
    const interest = bal * r;
    timeline.push({ month: m, draw: added, balance: bal, interest });
  }
  const totalInterest = timeline.reduce((a, b) => a + b.interest, 0);
  return { timeline, totalInterest, constructionPeriodMonths: maxMonth };
}
