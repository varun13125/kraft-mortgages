export function pmt(rateAnnual: number, years: number, principal: number) {
  const r = rateAnnual / 12 / 100;
  const n = years * 12;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function amortizationSchedule(rateAnnual: number, years: number, principal: number) {
  const r = rateAnnual / 12 / 100;
  const n = years * 12;
  const pay = pmt(rateAnnual, years, principal);
  let bal = principal;
  const rows: { period: number; interest: number; principal: number; balance: number }[] = [];
  for (let i = 1; i <= n; i++) {
    const interest = r * bal;
    const princ = pay - interest;
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
  const bonus = years >= 20 && base > 0 ? 30 : 0;
  return base + bonus;
}

export function energyPoints(improvementPct: number) {
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
  return a + e + acc;
}

export function amortByTier(tier: number) {
  if (tier >= 100) return 50;
  if (tier >= 70) return 45;
  if (tier >= 50) return 40;
  return 25;
}

export function leverageFor(isNew: boolean, tier: number) {
  if (isNew) return 0.95;
  return tier >= 70 ? 0.95 : tier >= 50 ? 0.85 : 0;
}

export function premiumDiscountFor(tier: number) {
  if (tier >= 100) return 0.30;
  if (tier >= 70) return 0.20;
  if (tier >= 50) return 0.10;
  return 0;
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
  const requiredMonthly = noi / minDcr / 12;
  return requiredMonthly / payPer1;
}

export function breakEvenRentPerUnit({
  monthlyDebtService,
  otherMonthlyOpex,
  units,
  targetMargin = 0
}: {
  monthlyDebtService: number;
  otherMonthlyOpex: number;
  units: number;
  targetMargin?: number;
}) {
  if (units <= 0) return 0;
  const needed = (monthlyDebtService + otherMonthlyOpex) * (1 + targetMargin);
  return needed / units;
}

export function rentCapFromMedian(medianAnnualIncome: number) {
  return (medianAnnualIncome * 0.30) / 12;
}