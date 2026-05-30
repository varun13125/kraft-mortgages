// Standard Canadian amortization formula. Not financial advice.
export function payment({ principal, annualRatePct, amortYears, paymentsPerYear = 12 }: {
  principal: number; annualRatePct: number; amortYears: number; paymentsPerYear?: number;
}) {
  const rDecimal = annualRatePct / 100;
  
  // Canadian legal compound interest conversion:
  // effective monthly rate = (1 + rDecimal / 2)^(2/12) - 1
  const effectiveMonthlyRate = Math.pow(1 + rDecimal / 2, 2 / 12) - 1;
  
  let rate = effectiveMonthlyRate;
  let n = amortYears * 12;

  if (paymentsPerYear === 26) {
    const monthlyRate = Math.pow(1 + rDecimal / 2, 2 / 12) - 1;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, amortYears * 12)) / (Math.pow(1 + monthlyRate, amortYears * 12) - 1);
    return Math.round(monthlyPayment) / 2;
  }
  
  if (paymentsPerYear !== 12) {
    rate = Math.pow(1 + rDecimal / 2, 2 / paymentsPerYear) - 1;
    n = amortYears * paymentsPerYear;
  }

  if (rate === 0) return principal / n;
  return principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
}

export function biweeklySavings({ principal, annualRatePct, amortYears }: {
  principal: number; annualRatePct: number; amortYears: number;
}) {
  const monthly = payment({ principal, annualRatePct, amortYears, paymentsPerYear: 12 });
  const acceleratedBiweekly = Math.round(monthly) / 2;
  
  // Calculate total interest for monthly payment
  const rDecimal = annualRatePct / 100;
  const rMonthly = Math.pow(1 + rDecimal / 2, 2 / 12) - 1;
  
  let balanceMonthly = principal;
  let totalInterestMonthly = 0;
  const numMonths = amortYears * 12;
  for (let i = 0; i < numMonths; i++) {
    const interest = balanceMonthly * rMonthly;
    totalInterestMonthly += interest;
    balanceMonthly = balanceMonthly + interest - monthly;
    if (balanceMonthly <= 0) break;
  }
  
  // Calculate total interest for accelerated bi-weekly payment
  const rBiweekly = Math.pow(1 + rDecimal / 2, 2 / 26) - 1;
  let balanceBiweekly = principal;
  let totalInterestBiweekly = 0;
  const maxBiweekly = amortYears * 26;
  for (let i = 0; i < maxBiweekly; i++) {
    const interest = balanceBiweekly * rBiweekly;
    totalInterestBiweekly += interest;
    balanceBiweekly = balanceBiweekly + interest - acceleratedBiweekly;
    if (balanceBiweekly <= 0) break;
  }
  
  const totalSaved = Math.max(0, totalInterestMonthly - totalInterestBiweekly);
  const annualSavings = totalSaved / amortYears;
  
  return { monthly, acceleratedBiweekly, annualSavings };
}
