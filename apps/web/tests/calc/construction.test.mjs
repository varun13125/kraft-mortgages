// Golden values for lib/calc/construction.ts: interest-only cost of progressive draws
// (simple monthly interest on the drawn balance, full month in the draw month).
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const K = await loadCalc("construction");

test("defaults: draws of $200k/$250k/$300k in months 1/4/7 at 7.25% over a 12-month period", () => {
  const r = K.interestOnlyCost({ draws: [{ month: 1, amount: 200000 }, { month: 4, amount: 250000 }, { month: 7, amount: 300000 }], annualRatePct: 7.25 });
  const m = 0.0725 / 12;
  near(r.totalInterest, (200000 * 12 + 250000 * 9 + 300000 * 6) * m, 0.01); // $38,968.75 = 6,450,000 dollar-months x 0.0725 / 12
  near(r.totalInterest, 38968.75, 0.005);
  assert.equal(r.constructionPeriodMonths, 12);
  assert.equal(r.timeline.length, 12);
  assert.equal(r.timeline[11].balance, 750000);
});

test("a month-0 draw is counted (old code: $0 interest)", () => {
  near(K.interestOnlyCost({ draws: [{ month: 0, amount: 100000 }], annualRatePct: 6 }).totalInterest, 100000 * 0.005 * 12, 0.01);
});

test("custom period, fractional months rounded, negative amounts ignored", () => {
  near(K.interestOnlyCost({ draws: [{ month: 1, amount: 100000 }], annualRatePct: 6, periodMonths: 18 }).totalInterest, 100000 * 0.005 * 18, 0.01);
  const f = K.interestOnlyCost({ draws: [{ month: 2.6, amount: 100000 }], annualRatePct: 6 }); // -> month 3
  near(f.totalInterest, 100000 * 0.005 * 10, 0.01);
  const n = K.interestOnlyCost({ draws: [{ month: 1, amount: 100000 }, { month: 2, amount: -50000 }], annualRatePct: 6 });
  near(n.totalInterest, 100000 * 0.005 * 12, 0.01);
});

test("period never shorter than the last draw and clamped to 60 months; 0% costs nothing", () => {
  const late = K.interestOnlyCost({ draws: [{ month: 15, amount: 100000 }], annualRatePct: 6 });
  assert.equal(late.constructionPeriodMonths, 15);
  near(late.totalInterest, 100000 * 0.005, 0.01);
  const capped = K.interestOnlyCost({ draws: [{ month: 90, amount: 100000 }], annualRatePct: 6, periodMonths: 120 });
  assert.equal(capped.constructionPeriodMonths, 60);
  assert.equal(K.interestOnlyCost({ draws: [{ month: 1, amount: 100000 }], annualRatePct: 0 }).totalInterest, 0);
});
