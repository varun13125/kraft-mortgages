// Golden values for lib/calc/affordability.ts: OSFI stress-test floor, GDS/TDS, maximum qualifying
// payment/loan and the max-purchase-price bisection shared by the Mortgage Qualifier, Required Income
// (Max Mortgage tab) and First-Time Home Buyer calculators.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const A = await loadCalc("affordability");
const P = await loadCalc("payment");
const C = await loadCalc("cmhc");

test("stress test: greater of contract + 2% or the 5.25% floor", () => {
  near(A.stressTestRate(4.39), 6.39, 1e-12);
  assert.equal(A.stressTestRate(3), 5.25);
  assert.equal(A.stressTestRate(3.25), 5.25);
  near(A.stressTestRate(3.26), 5.26, 1e-12);
});

test("gdsTds: percentages of gross income; non-positive income always fails", () => {
  const r = A.gdsTds({ incomeAnnual: 100000, housingCostsAnnual: 30000, totalDebtAnnual: 6000 });
  near(r.gds, 30, 1e-12);
  near(r.tds, 36, 1e-12);
  const z = A.gdsTds({ incomeAnnual: 0, housingCostsAnnual: 1, totalDebtAnnual: 0 });
  assert.equal(z.gds, Infinity);
  assert.ok(!(z.gds <= 39));
});

test("maxQualifyingPayment = min(39% GDS room, 44% TDS room) after taxes/heat/condo", () => {
  // $120k income, $400 debts, $450 tax + heat: min(3,900 - 450, 4,400 - 400 - 450) = 3,450
  near(A.maxQualifyingPayment({ incomeAnnual: 120000, otherDebtsMonthly: 400, nonMortgageHousingMonthly: 450 }), 3450, 1e-9);
  // heavy debts make TDS bind
  near(A.maxQualifyingPayment({ incomeAnnual: 120000, otherDebtsMonthly: 1000, nonMortgageHousingMonthly: 450 }), 2950, 1e-9);
  assert.equal(A.maxQualifyingPayment({ incomeAnnual: 50000, otherDebtsMonthly: 5000, nonMortgageHousingMonthly: 450 }), 0);
  assert.equal(A.maxQualifyingPayment({ incomeAnnual: 0, otherDebtsMonthly: 0, nonMortgageHousingMonthly: 0 }), 0);
});

test("maxQualifyingLoan amortizes that payment at the stress-test rate", () => {
  const loan = A.maxQualifyingLoan({ incomeAnnual: 120000, otherDebtsMonthly: 400, nonMortgageHousingMonthly: 450, contractRatePct: 4.39, amortYears: 25 });
  near(P.payment({ principal: loan, annualRatePct: 6.39, amortYears: 25 }), 3450, 1e-6);
});

test("loanForPurchase finances the premium (incl. 30-yr surcharge) only below 20% down", () => {
  near(A.loanForPurchase(700000, 70000), 649530, 0.01);
  near(A.loanForPurchase(700000, 70000, 30), 630000 * 1.033, 0.01);
  near(A.loanForPurchase(700000, 140000), 560000, 1e-9);
});

test("Mortgage Qualifier defaults: max price $670,229, binding at GDS 39% / TDS 43% (audit F6)", () => {
  const maxLoan = A.maxQualifyingLoan({ incomeAnnual: 120000, otherDebtsMonthly: 400, nonMortgageHousingMonthly: 450, contractRatePct: 4.39, amortYears: 25 });
  const r = A.maxPurchasePrice({ down: 150000, maxLoan, amortYears: 25 });
  near(r.price, 670228.81, 1);
  assert.equal(r.limitedBy, "income");
  near(r.loan, maxLoan, 2);
  const pay = P.payment({ principal: r.loan, annualRatePct: 6.39, amortYears: 25 });
  const gds = (pay + 450) * 12 / 120000 * 100;
  const tds = (pay + 450 + 400) * 12 / 120000 * 100;
  assert.ok(gds <= 39.0001 && tds <= 44.0001, `gds ${gds} tds ${tds}`);
  near(gds, 39, 0.01);
});

test("$40k down on a high income is capped by the minimum down payment at $650,000", () => {
  const maxLoan = A.maxQualifyingLoan({ incomeAnnual: 400000, otherDebtsMonthly: 0, nonMortgageHousingMonthly: 450, contractRatePct: 4.39, amortYears: 25 });
  const r = A.maxPurchasePrice({ down: 40000, maxLoan, amortYears: 25 });
  near(r.price, 650000, 1); // 25,000 + 10% x (P - 500,000) = 40,000
  assert.equal(r.limitedBy, "downPayment");
  assert.ok(C.isInsurable(650000, 40000));
});

test("$300k down tops out at exactly $1.5M (20% required at $1.5M+, no insurance)", () => {
  const r = A.maxPurchasePrice({ down: 300000, maxLoan: 5000000, amortYears: 25 });
  near(r.price, 1500000, 1);
  assert.equal(r.limitedBy, "downPayment");
  near(r.loan, 1200000, 1);
});

test("maxPurchasePrice edge cases: no down payment or no borrowing room", () => {
  assert.deepEqual(A.maxPurchasePrice({ down: 0, maxLoan: 500000, amortYears: 25 }), { price: 0, loan: 0, limitedBy: "none" });
  assert.deepEqual(A.maxPurchasePrice({ down: 50000, maxLoan: 0, amortYears: 25 }), { price: 0, loan: 0, limitedBy: "none" });
});

test("Required Income round trip: income needed for $700k / 20% down buys back $700k", () => {
  // Income tab defaults (audit F1): $700k, 20% down, 4.79%, 25 yrs, tax $350 + heat $120 /mo, $400 debts
  const loan = 560000;
  const qp = P.payment({ principal: loan, annualRatePct: A.stressTestRate(4.79), amortYears: 25 });
  near(qp, 3849.99, 0.005);
  const housing = qp + 350 + 120;
  const required = Math.max(housing * 12 / 0.39, (housing + 400) * 12 / 0.44);
  near(required, 132923, 1); // audit F1: was ~$10.9M when a % rate was divided by 12
  // Max Mortgage tab: same income and $140,000 down available -> back to $700,000
  const maxLoan = A.maxQualifyingLoan({ incomeAnnual: required, otherDebtsMonthly: 400, nonMortgageHousingMonthly: 470, contractRatePct: 4.79, amortYears: 25 });
  const r = A.maxPurchasePrice({ down: 140000, maxLoan, amortYears: 25 });
  near(r.price, 700000, 1);
});

test("insured round trip: 10% down on $600k", () => {
  const down = 60000;
  const loan = A.loanForPurchase(600000, down, 25); // 540,000 x 1.031
  const qp = P.payment({ principal: loan, annualRatePct: 6.79, amortYears: 25 });
  const required = Math.max((qp + 470) * 12 / 0.39, (qp + 470 + 400) * 12 / 0.44);
  const maxLoan = A.maxQualifyingLoan({ incomeAnnual: required, otherDebtsMonthly: 400, nonMortgageHousingMonthly: 470, contractRatePct: 4.79, amortYears: 25 });
  near(A.maxPurchasePrice({ down, maxLoan, amortYears: 25 }).price, 600000, 1);
});
