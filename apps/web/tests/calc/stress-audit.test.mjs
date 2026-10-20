import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc } from "./_helpers/load.mjs";

const { payment, principalFromPayment, balanceAfter, biweeklySavings } = await loadCalc("payment");
const { compareRefinance } = await loadCalc("refinance");
const { purchaseEligibility } = await loadCalc("purchaseEligibility");
const { constructionFunding } = await loadCalc("construction");
const { maxQualifyingPayment } = await loadCalc("affordability");

// Independent month-end ledger; never calls the production balance formula.
function ledger(principal, rate, monthly, months) {
  const r = Math.pow(1 + rate / 200, 1 / 6) - 1;
  let balance = principal, interestPaid = 0;
  for (let m = 0; m < months && balance > 1e-7; m++) {
    const interest = balance * r;
    interestPaid += interest;
    balance = Math.max(0, balance + interest - monthly);
  }
  return { balance, interestPaid };
}
function near(a, b, tolerance = 0.01) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
}

test("audit: 2,160 payment/inverse/ledger combinations including zero and tiny rates", () => {
  let cases = 0;
  for (const principal of [1, 1000, 100000, 500000, 1500000, 1000000000])
    for (const rate of [0, 1e-10, 0.01, 1, 3, 5.25, 10, 30])
      for (const years of [1, 5, 25, 30, 50])
        for (const months of [0, 1, 6, 12, 59, 60, 120, 600, 601]) {
          const pmt = payment({ principal, annualRatePct: rate, amortYears: years });
          assert.ok(Number.isFinite(pmt) && pmt > 0);
          near(principalFromPayment({ monthlyPayment: pmt, annualRatePct: rate, amortYears: years }), principal, Math.max(0.01, principal * 1e-10));
          const actual = balanceAfter({ principal, annualRatePct: rate, amortYears: years, monthsElapsed: months });
          const expected = ledger(principal, rate, pmt, months);
          near(actual.balance, expected.balance, Math.max(0.01, principal * 1e-8));
          near(actual.interestPaid, expected.interestPaid, Math.max(0.01, principal * 1e-8));
          cases++;
        }
  assert.equal(cases, 2160);
});

test("audit: irregular final payment charges a full last month's interest, then stops", () => {
  for (const monthlyPayment of [100, 175, 999, 1050, 2000]) {
    const input = { principal: 1000, annualRatePct: 12, amortYears: 25, monthlyPayment, monthsElapsed: 300 };
    const actual = balanceAfter(input);
    const expected = ledger(1000, 12, monthlyPayment, 300);
    near(actual.balance, expected.balance);
    near(actual.interestPaid, expected.interestPaid, 1e-7);
  }
});

test("audit: non-finite payment inputs cannot leak NaN or Infinity", () => {
  for (const field of ["principal", "annualRatePct", "amortYears", "paymentsPerYear"])
    for (const bad of [NaN, Infinity, -Infinity]) {
      assert.equal(payment({ principal: 500000, annualRatePct: 5, amortYears: 25, paymentsPerYear: 12, [field]: bad }), 0);
    }
});

test("audit: extending amortization at the same rate reduces payments but costs more", () => {
  const result = compareRefinance({ principal: 500000, currentRate: 5, newRate: 5,
    currentAmortYears: 15, newAmortYears: 30, horizonMonths: 60, upfrontCosts: 3000 });
  assert.ok(result.monthlySavings > 1000);
  assert.ok(result.newBalance > result.currentBalance);
  assert.ok(result.netSavings < -3000);
  assert.equal(result.worthwhile, false);
  assert.equal(result.breakEvenMonths, Infinity);
});

test("audit: refinance economic savings and recovery match independent monthly ledgers", () => {
  for (const newRate of [0, 3, 4.79, 5.75, 8]) {
    const input = { principal: 400000, currentRate: 5.75, newRate, currentAmortYears: 22,
      newAmortYears: 25, horizonMonths: 60, upfrontCosts: 13870 };
    const result = compareRefinance(input);
    let expectedRecovery = Infinity;
    for (let m = 1; m <= 60; m++) {
      const savings = ledger(400000, 5.75, result.currentPayment, m).interestPaid -
        ledger(400000, newRate, result.newPayment, m).interestPaid - 13870;
      if (savings >= 0 && expectedRecovery === Infinity) expectedRecovery = m;
      if (m === 60) near(result.netSavings, savings);
    }
    assert.equal(result.breakEvenMonths, expectedRecovery);
    assert.equal(result.worthwhile, result.netSavings > 0);
  }
});

test("audit: purchase eligibility at price, down-payment and insured amortization boundaries", () => {
  const check = (overrides) => purchaseEligibility({ price: 700000, down: 70000, amortYears: 25, ...overrides }).eligible;
  assert.equal(check({}), true);
  assert.equal(check({ down: 44999 }), false);
  assert.equal(check({ down: 45000 }), true);
  assert.equal(check({ down: 700001 }), false);
  assert.equal(check({ amortYears: 30 }), false);
  assert.equal(check({ amortYears: 30, firstTime: true }), true);
  assert.equal(check({ amortYears: 30, newBuild: true }), true);
  assert.equal(check({ amortYears: 31, firstTime: true }), false);
  assert.equal(check({ price: 1500000, down: 299999 }), false);
  assert.equal(check({ price: 1500000, down: 300000, amortYears: 30 }), true);
  assert.equal(check({ price: Infinity }), false);
});

test("audit: construction funding surplus is separate from remaining cost and commitment", () => {
  const r = constructionFunding({ totalCost: 500000, equityInvested: 250000, loanFunded: 300000, loanCommitment: 600000 });
  assert.equal(r.remainingCost, 0);
  assert.equal(r.budgetSurplus, 50000);
  assert.equal(r.undisbursedLoan, 300000);
  assert.equal(r.fundedPct, 100);
  const gap = constructionFunding({ totalCost: 1000000, equityInvested: 150000, loanFunded: 200000, loanCommitment: 600000 });
  assert.equal(gap.remainingCost, 650000);
  assert.equal(gap.fundingGap, 250000);
});

test("audit: HELOC room honours housing GDS independently of other debt TDS", () => {
  // $10k monthly income; $2,300 mortgage + $400 tax/heat, $200 other debt.
  // Old TDS-only room $1,500; GDS room $1,200 is binding.
  assert.equal(maxQualifyingPayment({ incomeAnnual: 120000, nonMortgageHousingMonthly: 2700, otherDebtsMonthly: 200 }), 1200);
  assert.equal(maxQualifyingPayment({ incomeAnnual: 120000, nonMortgageHousingMonthly: 2700, otherDebtsMonthly: 1500 }), 200);
});

test("audit: malformed refinance tool inputs never publish a non-finite saving", () => {
  const base = { principal: 400000, currentRate: 5.75, newRate: 4.79, currentAmortYears: 22,
    newAmortYears: 25, horizonMonths: 60, upfrontCosts: 13870, currentMonthlyPayment: 2657.72 };
  for (const key of Object.keys(base)) for (const value of [NaN, Infinity, -Infinity]) {
    const result = compareRefinance({ ...base, [key]: value });
    assert.equal(result.worthwhile, false);
    assert.equal(result.netSavings, 0);
    assert.ok(Object.entries(result).filter(([name]) => name !== 'breakEvenMonths')
      .every(([, item]) => typeof item !== 'number' || Number.isFinite(item)));
  }
});

test("audit: accelerated-payment simulation rejects non-finite and runaway horizons", () => {
  const valid = { principal: 500000, annualRatePct: 5, amortYears: 25 };
  for (const key of Object.keys(valid)) for (const bad of [NaN, Infinity, -Infinity]) {
    assert.ok(Object.values(biweeklySavings({ ...valid, [key]: bad })).every(value => value === 0));
  }
  assert.ok(Object.values(biweeklySavings({ ...valid, amortYears: 1e12 })).every(value => value === 0));
  assert.ok(Object.values(biweeklySavings({ ...valid, amortYears: 100 })).every(Number.isFinite));
});
