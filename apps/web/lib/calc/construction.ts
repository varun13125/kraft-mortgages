export type Draw = { month: number; amount: number };

export function interestOnlyCost({ draws, annualRatePct }: { draws: Draw[]; annualRatePct: number }) {
  const r = annualRatePct / 100 / 12;
  let bal = 0;
  const timeline: { month: number; draw: number; balance: number; interest: number }[] = [];
  for (let m = 1; m <= Math.max(12, ...draws.map(d=>d.month)); m++) {
    const added = draws.filter(d=>d.month === m).reduce((a,b)=>a+b.amount,0);
    bal += added;
    const interest = bal * r;
    timeline.push({ month: m, draw: added, balance: bal, interest });
  }
  const totalInterest = timeline.reduce((a,b)=>a+b.interest,0);
  return { timeline, totalInterest };
}
