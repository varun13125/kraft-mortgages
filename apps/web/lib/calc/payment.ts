// Standard Canadian amortization formulas. Not financial advice.
//
// Canadian fixed-rate mortgages compound interest semi-annually, not in advance
// (Interest Act, s.6). The effective rate per payment period is therefore
//   (1 + r/2)^(2/paymentsPerYear) - 1
// e.g. $500,000 at 5% over 25 years → $2,908.02/month (US-style monthly
// compounding would give $2,922.95). Variable-rate products are often
// compounded monthly; these helpers always use the semi-annual convention.

/** Effective interest rate per payment period, Canadian semi-annual compounding. */
export function periodicRate(annualRatePct: number, paymentsPerYear = 12): number {
  return Math.pow(1 + annualRatePct / 200, 2 / paymentsPerYear) - 1;
}

/**
 * Level payment that fully amortizes `principal` over `amortYears`.
 * - paymentsPerYear 12 / 24 / 52 → regular payment for that frequency.
 * - paymentsPerYear 26 → ACCELERATED bi-weekly (monthly payment ÷ 2), which is
 *   what Canadian lenders quote as "accelerated bi-weekly".
 * Returns 0 for non-positive principal or amortization.
 */
export function payment({ principal, annualRatePct, amortYears, paymentsPerYear = 12 }: {
  principal: number; annualRatePct: number; amortYears: number; paymentsPerYear?: number;
}): number {
  if (!(principal > 0) || !(amortYears > 0)) return 0;

  if (paymentsPerYear === 26) {
    return payment({ principal, annualRatePct, amortYears, paymentsPerYear: 12 }) / 2;
  }

  const rate = periodicRate(annualRatePct, paymentsPerYear);
  const n = amortYears * paymentsPerYear;
  if (rate === 0) return principal / n;
  return principal * rate / (1 - Math.pow(1 + rate, -n));
}

/**
 * Inverse of payment(): the largest principal a given monthly payment can
 * amortize over `amortYears` (used for "maximum mortgage" calculations).
 */
export function principalFromPayment({ monthlyPayment, annualRatePct, amortYears }: {
  monthlyPayment: number; annualRatePct: number; amortYears: number;
}) {
  if (!(monthlyPayment > 0) || !(amortYears > 0)) return 0;
  const i = periodicRate(annualRatePct, 12);
  const n = amortYears * 12;
  if (i === 0) return monthlyPayment * n;
  return monthlyPayment * (1 - Math.pow(1 + i, -n)) / i;
}

/**
 * Outstanding balance after `monthsElapsed` regular monthly payments (closed form),
 * and the interest paid over those months. Payment defaults to the level payment
 * for the full amortization. Never returns a negative balance.
 */
export function balanceAfter({ principal, annualRatePct, amortYears, monthsElapsed, monthlyPayment }: {
  principal: number; annualRatePct: number; amortYears: number; monthsElapsed: number; monthlyPayment?: number;
}): { balance: number; interestPaid: number } {
  const pmt = monthlyPayment ?? payment({ principal, annualRatePct, amortYears });
  const i = periodicRate(annualRatePct, 12);
  // Stop counting once the loan is paid off (payoff month from the annuity formula)
  const payoffMonths = !(pmt > 0) ? Infinity
    : i === 0 ? principal / pmt
    : pmt > principal * i ? -Math.log(1 - (principal * i) / pmt) / Math.log(1 + i) : Infinity;
  const k = Math.min(Math.max(0, monthsElapsed), payoffMonths);
  const growth = Math.pow(1 + i, k);
  const raw = i === 0 ? principal - pmt * k : principal * growth - pmt * (growth - 1) / i;
  const balance = Math.max(0, raw);
  const interestPaid = Math.max(0, pmt * k - (principal - balance));
  return { balance, interestPaid };
}

export function biweeklySavings({ principal, annualRatePct, amortYears }: {
  principal: number; annualRatePct: number; amortYears: number;
}) {
  const monthly = payment({ principal, annualRatePct, amortYears, paymentsPerYear: 12 });
  const acceleratedBiweekly = monthly / 2;

  // Total interest on the regular monthly schedule
  const rMonthly = periodicRate(annualRatePct, 12);
  let balanceMonthly = principal;
  let totalInterestMonthly = 0;
  const numMonths = amortYears * 12;
  for (let i = 0; i < numMonths && balanceMonthly > 0.005; i++) {
    const interest = balanceMonthly * rMonthly;
    totalInterestMonthly += interest;
    balanceMonthly = balanceMonthly + interest - Math.min(monthly, balanceMonthly + interest);
  }

  // Total interest on the accelerated bi-weekly schedule (pays off early)
  const rBiweekly = periodicRate(annualRatePct, 26);
  let balanceBiweekly = principal;
  let totalInterestBiweekly = 0;
  let biweeklyPayments = 0;
  const maxBiweekly = amortYears * 26;
  for (let i = 0; i < maxBiweekly && balanceBiweekly > 0.005; i++) {
    const interest = balanceBiweekly * rBiweekly;
    totalInterestBiweekly += interest;
    balanceBiweekly = balanceBiweekly + interest - Math.min(acceleratedBiweekly, balanceBiweekly + interest);
    biweeklyPayments++;
  }

  const totalInterestSaved = Math.max(0, totalInterestMonthly - totalInterestBiweekly);
  // Average interest saved per year of the original amortization (kept for existing callers)
  const annualSavings = amortYears > 0 ? totalInterestSaved / amortYears : 0;
  const payoffYearsBiweekly = biweeklyPayments / 26;
  const yearsSaved = Math.max(0, amortYears - payoffYearsBiweekly);

  return { monthly, acceleratedBiweekly, annualSavings, totalInterestSaved, payoffYearsBiweekly, yearsSaved };
}
