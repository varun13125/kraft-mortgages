// Golden values for lib/calc/selfEmployed.ts: A-lender qualifying income from NOAs (line 15000).
// Rule: stable/rising income -> 2-year average; falling -> the lower, most recent year; plus add-backs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const S = await loadCalc("selfEmployed");

test("rising income uses the 2-year average (old code gave the lower year: $105,000)", () => {
  const r = S.normalizedIncome({ noa1: 110000, noa2: 90000, noa3: 80000, addbacks: 15000 });
  assert.equal(r.qualifyingIncome, 115000);
  near(r.threeYearAvg, 280000 / 3 + 15000, 1e-9);
});

test("falling income uses the latest year", () => {
  assert.equal(S.normalizedIncome({ noa1: 80000, noa2: 110000, noa3: 90000, addbacks: 0 }).qualifyingIncome, 80000);
});

test("stable income = that income; add-backs default to 0", () => {
  assert.equal(S.normalizedIncome({ noa1: 95000, noa2: 95000, noa3: 95000 }).qualifyingIncome, 95000);
});

test("negative results clamp to 0", () => {
  assert.equal(S.normalizedIncome({ noa1: -50000, noa2: 10000, noa3: 0, addbacks: 0 }).qualifyingIncome, 0);
});
