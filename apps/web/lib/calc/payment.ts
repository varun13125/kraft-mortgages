// Standard amortization formula. Not financial advice.
export function payment({ principal, annualRatePct, amortYears, paymentsPerYear = 12 }: {
  principal: number; annualRatePct: number; amortYears: number; paymentsPerYear?: number;
}) {
  const r = (annualRatePct / 100) / paymentsPerYear;
  const n = amortYears * paymentsPerYear;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function biweeklySavings({ principal, annualRatePct, amortYears }: {
  principal: number; annualRatePct: number; amortYears: number;
}) {
  const monthly = payment({ principal, annualRatePct, amortYears, paymentsPerYear: 12 });
  const acceleratedBiweekly = payment({ principal, annualRatePct, amortYears, paymentsPerYear: 26 });
  const monthlyAnnual = monthly * 12;
  const biweeklyAnnual = acceleratedBiweekly * 26;
  return { monthly, acceleratedBiweekly, annualSavings: monthlyAnnual - biweeklyAnnual };
}
