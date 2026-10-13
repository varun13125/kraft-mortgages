import { payment } from "./payment";

// Rental property cash-flow metrics. Monthly figures unless noted. Not financial advice.
// cap rate = annual NOI / price; DSCR = NOI / debt service; cash-on-cash = annual pre-tax cash flow / cash invested.
export function cashflow({ price, downPayment, ratePct, amortYears, rentMonthly, vacancyPct, expensesMonthly, closingCosts = 0 }:{
  price:number; downPayment:number; ratePct:number; amortYears:number; rentMonthly:number; vacancyPct:number; expensesMonthly:number; closingCosts?:number;
}){
  // Guard against empty/negative inputs (down payment larger than price, negative vacancy, etc.)
  const safePrice = Math.max(0, price || 0);
  const safeDown = Math.min(safePrice, Math.max(0, downPayment || 0));
  const loan = safePrice - safeDown;
  const pmt = loan > 0 && amortYears > 0
    ? payment({ principal: loan, annualRatePct: Math.max(0, ratePct || 0), amortYears, paymentsPerYear: 12 })
    : 0;
  const vacancy = Math.min(100, Math.max(0, vacancyPct || 0));
  const effRent = Math.max(0, rentMonthly || 0) * (1 - vacancy / 100);
  const noi = effRent - Math.max(0, expensesMonthly || 0);
  const cf = noi - pmt;
  const capRate = safePrice > 0 ? (noi * 12) / safePrice * 100 : 0;
  // 0 when there is no mortgage payment (DSCR is undefined for an all-cash purchase)
  const dscr = pmt > 0 ? (noi / pmt) : 0;
  const cashInvested = safeDown + Math.max(0, closingCosts || 0);
  const cashOnCash = cashInvested > 0 ? (cf * 12) / cashInvested * 100 : 0;
  return { loan, pmt, effRent, noi, cf, capRate, dscr, cashOnCash, cashInvested };
}
