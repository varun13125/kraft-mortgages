// Golden values for lib/calc/investment.ts (rental cash flow, cap rate, DSCR, cash-on-cash) and its
// input guards. Ported from the Oct 2026 audit (calc-b verify.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const I = await loadCalc("investment");

/** Reference payment, semi-annual compounding. */
const refPmt = (p, r, n) => { const i = Math.pow(1 + r / 200, 1 / 6) - 1; return p * i / (1 - Math.pow(1 + i, -n)); };

test("defaults: $800k, $200k down, 5.45%, 25y, $4,200 rent, 3% vacancy, $1,200 expenses, $15k closing", () => {
  const r = I.cashflow({ price: 800000, downPayment: 200000, ratePct: 5.45, amortYears: 25, rentMonthly: 4200, vacancyPct: 3, expensesMonthly: 1200, closingCosts: 15000 });
  const pmt = refPmt(600000, 5.45, 300);
  near(r.loan, 600000, 1e-9);
  near(r.pmt, pmt, 0.01);
  near(r.effRent, 4074, 1e-9);
  near(r.noi, 2874, 0.01);
  near(r.capRate, 2874 * 12 / 800000 * 100, 1e-9); // 4.311%
  near(r.dscr, 2874 / pmt, 1e-6);
  near(r.cashInvested, 215000, 1e-9);
  near(r.cashOnCash, (2874 - pmt) * 12 / 215000 * 100, 1e-6);
  near(r.cf, 2874 - pmt, 1e-6);
});

test("guards: price 0, down payment above price, 0% rate, vacancy outside 0-100", () => {
  const z = I.cashflow({ price: 0, downPayment: 0, ratePct: 5, amortYears: 25, rentMonthly: 1000, vacancyPct: 0, expensesMonthly: 0 });
  assert.ok(Number.isFinite(z.capRate));
  assert.equal(z.capRate, 0);
  const allCash = I.cashflow({ price: 500000, downPayment: 600000, ratePct: 5, amortYears: 25, rentMonthly: 3000, vacancyPct: 0, expensesMonthly: 500 });
  assert.equal(allCash.loan, 0);
  assert.equal(allCash.pmt, 0); // no negative payment
  assert.equal(allCash.dscr, 0); // DSCR undefined for all-cash: 0 sentinel, the page shows N/A
  near(allCash.cashInvested, 500000, 1e-9);
  near(allCash.cashOnCash, 2500 * 12 / 500000 * 100, 1e-9);
  const zr = I.cashflow({ price: 500000, downPayment: 100000, ratePct: 0, amortYears: 25, rentMonthly: 3000, vacancyPct: 0, expensesMonthly: 0 });
  near(zr.pmt, 400000 / 300, 0.001);
  const v = I.cashflow({ price: 500000, downPayment: 100000, ratePct: 5, amortYears: 25, rentMonthly: 3000, vacancyPct: 150, expensesMonthly: 0 });
  assert.equal(v.effRent, 0);
  const neg = I.cashflow({ price: 500000, downPayment: 100000, ratePct: 5, amortYears: 25, rentMonthly: 3000, vacancyPct: -10, expensesMonthly: 0 });
  assert.equal(neg.effRent, 3000);
});

test("cash-on-cash is 0 (not Infinity) when nothing is invested", () => {
  const r = I.cashflow({ price: 500000, downPayment: 0, ratePct: 5, amortYears: 25, rentMonthly: 3000, vacancyPct: 0, expensesMonthly: 0 });
  assert.equal(r.cashOnCash, 0);
});
