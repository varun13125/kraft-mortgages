// Golden values for lib/calc/payment.ts (Canadian semi-annual compounding, Interest Act s.6).
// Ported from the Oct 2026 audit verification scripts (calc-a 02/04). Run: node --test tests/calc/
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const P = await loadCalc("payment");

/** Independent month-by-month simulation of a level-payment loan. */
function simulate(principal, ratePct, amortYears, months) {
  const i = Math.pow(1 + ratePct / 200, 1 / 6) - 1;
  const n = amortYears * 12;
  const pmt = principal * i / (1 - Math.pow(1 + i, -n));
  let bal = principal, interest = 0;
  for (let k = 0; k < months; k++) { const it = bal * i; interest += it; bal = bal + it - pmt; }
  return { bal, interest, pmt };
}

test("$500k at 5% over 25 years = $2,908.02/month (US monthly compounding would give $2,922.95)", () => {
  near(P.payment({ principal: 500000, annualRatePct: 5, amortYears: 25 }), 2908.02, 0.005);
});

test("periodicRate is (1 + r/2)^(1/6) - 1 for monthly payments", () => {
  near(P.periodicRate(5, 12), Math.pow(1.025, 1 / 6) - 1, 1e-15);
  near(P.periodicRate(5, 2), 0.025, 1e-15);
});

test("accelerated bi-weekly = monthly / 2, unrounded ($1,454.01)", () => {
  near(P.payment({ principal: 500000, annualRatePct: 5, amortYears: 25, paymentsPerYear: 26 }), 1454.01, 0.005);
});

test("0% rate: straight-line principal for monthly and accelerated bi-weekly", () => {
  near(P.payment({ principal: 300000, annualRatePct: 0, amortYears: 25 }), 1000, 1e-9);
  near(P.payment({ principal: 300000, annualRatePct: 0, amortYears: 25, paymentsPerYear: 26 }), 500, 1e-9);
});

test("zero/negative principal or amortization returns 0 (never a negative payment)", () => {
  assert.equal(P.payment({ principal: 0, annualRatePct: 5, amortYears: 25 }), 0);
  assert.equal(P.payment({ principal: -5, annualRatePct: 5, amortYears: 25 }), 0);
  assert.equal(P.payment({ principal: 500000, annualRatePct: 5, amortYears: 0 }), 0);
});

test("30-year and other golden payments", () => {
  near(P.payment({ principal: 500000, annualRatePct: 5, amortYears: 30 }), simulate(500000, 5, 30, 0).pmt, 1e-6);
  // amortization page example (audit F15): $500k at 4.39% -> $2,736.87 (US compounding gave $2,748.04)
  near(P.payment({ principal: 500000, annualRatePct: 4.39, amortYears: 25 }), 2736.87, 0.005);
  // required-income default (audit F1): $560k at the 6.79% stress rate -> $3,849.99
  near(P.payment({ principal: 560000, annualRatePct: 6.79, amortYears: 25 }), 3849.99, 0.005);
});

test("weekly (non-accelerated) payment is just under monthly x 12 / 52", () => {
  const w = P.payment({ principal: 500000, annualRatePct: 5, amortYears: 25, paymentsPerYear: 52 });
  assert.ok(w > 2908.02 * 12 / 52 - 2 && w < 2908.02 * 12 / 52, `weekly ${w}`);
});

test("principalFromPayment inverts payment (round trip)", () => {
  near(P.principalFromPayment({ monthlyPayment: 2908.0219, annualRatePct: 5, amortYears: 25 }), 500000, 1);
  for (const [p, r, y] of [[350000, 3.89, 30], [1200000, 6.5, 20], [80000, 9.99, 10]]) {
    const m = P.payment({ principal: p, annualRatePct: r, amortYears: y });
    near(P.principalFromPayment({ monthlyPayment: m, annualRatePct: r, amortYears: y }), p, 1e-6);
  }
});

test("principalFromPayment edge cases: 0% and non-positive inputs", () => {
  near(P.principalFromPayment({ monthlyPayment: 1000, annualRatePct: 0, amortYears: 25 }), 300000, 1e-9);
  assert.equal(P.principalFromPayment({ monthlyPayment: -1, annualRatePct: 5, amortYears: 25 }), 0);
  assert.equal(P.principalFromPayment({ monthlyPayment: 1000, annualRatePct: 5, amortYears: 0 }), 0);
});

test("balanceAfter matches a month-by-month simulation", () => {
  const sim = simulate(500000, 5, 25, 60);
  const c = P.balanceAfter({ principal: 500000, annualRatePct: 5, amortYears: 25, monthsElapsed: 60 });
  near(c.balance, sim.bal, 0.01, "balance after 60 months");
  near(c.interestPaid, sim.interest, 0.01, "interest over 60 months");
});

test("balanceAfter: paid off at full amortization, 0% rate, interest capped at payoff", () => {
  near(P.balanceAfter({ principal: 500000, annualRatePct: 5, amortYears: 25, monthsElapsed: 300 }).balance, 0, 0.01);
  const z = P.balanceAfter({ principal: 300000, annualRatePct: 0, amortYears: 25, monthsElapsed: 120 });
  near(z.balance, 180000, 1e-6);
  near(z.interestPaid, 0, 1e-6);
  const o = P.balanceAfter({ principal: 500000, annualRatePct: 5, amortYears: 25, monthsElapsed: 400 });
  near(o.balance, 0, 0.01);
  near(o.interestPaid, 2908.0219 * 300 - 500000, 5, "interest stops at payoff");
});

test("biweeklySavings at 5%: about $60k interest and about 3 years saved; nothing at 0%", () => {
  const b = P.biweeklySavings({ principal: 500000, annualRatePct: 5, amortYears: 25 });
  near(b.monthly, 2908.02, 0.005);
  near(b.acceleratedBiweekly, 1454.01, 0.005);
  assert.ok(b.totalInterestSaved > 59000 && b.totalInterestSaved < 61500, `saved ${b.totalInterestSaved}`);
  assert.ok(b.yearsSaved > 2.5 && b.yearsSaved < 4, `years saved ${b.yearsSaved}`);
  const z = P.biweeklySavings({ principal: 300000, annualRatePct: 0, amortYears: 25 });
  assert.equal(z.totalInterestSaved, 0);
  assert.ok(Number.isFinite(z.yearsSaved));
});
