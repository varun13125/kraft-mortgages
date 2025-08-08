import { payment } from "./payment";

export function cashflow({ price, downPayment, ratePct, amortYears, rentMonthly, vacancyPct, expensesMonthly }:{
  price:number; downPayment:number; ratePct:number; amortYears:number; rentMonthly:number; vacancyPct:number; expensesMonthly:number;
}){
  const loan = price - downPayment;
  const pmt = payment({ principal: loan, annualRatePct: ratePct, amortYears, paymentsPerYear: 12 });
  const effRent = rentMonthly * (1 - vacancyPct/100);
  const noi = effRent - expensesMonthly;
  const cf = noi - pmt;
  const capRate = (noi * 12) / price * 100;
  const dscr = pmt ? (noi / pmt) : 0;
  return { loan, pmt, effRent, noi, cf, capRate, dscr };
}
