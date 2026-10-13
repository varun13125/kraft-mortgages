// AI calculator tool math (lib/ai/tools/calculator-tools.ts, lib/ai/tools/mortgage-tools.ts) and
// parity with the web calculators. Run: cd apps/web && node --test tests/specialty/
import { test } from "node:test";
import assert from "node:assert/strict";
import { importApp } from "./helpers/register-ts-paths.mjs";
import { close, pmtSemiAnnual, pvSemiAnnual } from "./helpers/assert-close.mjs";

const { CalculatorTools } = await importApp("lib/ai/tools/calculator-tools.ts");
const { MortgageTools } = await importApp("lib/ai/tools/mortgage-tools.ts");
const { refinanceBreakEven } = await importApp("app/(site)/commercial/calculators/refinance/refinanceMath.ts");
const { interestOnlyCost } = await importApp("lib/calc/construction.ts");

const ct = CalculatorTools.getInstance();
const mt = MortgageTools.getInstance();

test("calculatePayment: $500k / 5% / 25y = $2,908.02 (semi-annual, not US-style $2,922.95)", () => {
  const r = ct.calculatePayment({ principal: 500000, rate: 5, amortizationYears: 25 });
  assert.equal(r.monthlyPayment, 2908.02);
  close(r.totalInterest, pmtSemiAnnual(500000, 5, 25) * 300 - 500000, 1);
});

test("calculateAffordability: stress test at max(rate + 2%, 5.25%), GDS 39 / TDS 44 incl. tax + heat", () => {
  // $120k income, $100k down, $500/mo debts, 4.39% → qualifying 6.39%.
  // GDS room 3,900 − 350 (tax+heat) = 3,550; TDS room 4,400 − 350 − 500 = 3,550.
  const r = ct.calculateAffordability({ annualIncome: 120000, downPayment: 100000, monthlyDebts: 500, rate: 4.39 });
  close(r.maxMortgage, pvSemiAnnual(3550, 6.39, 25), 1, "max mortgage");
  assert.ok(r.formatted.includes("6.39%"));
});

test("calculateAffordability: 5.25% floor applies to low contract rates", () => {
  const r = ct.calculateAffordability({ annualIncome: 120000, downPayment: 100000, rate: 2.5 });
  close(r.maxMortgage, pvSemiAnnual(3550, 5.25, 25), 1, "qualifies at 5.25%, not 4.50%");
  assert.ok(r.formatted.includes("5.25%"));
});

test("calculateAffordability: price honours minimum down payment and adds the CMHC premium", () => {
  // $50k down: 5% of the first $500k + 10% above → max price $750,000 however high the income
  const capped = ct.calculateAffordability({ annualIncome: 400000, downPayment: 50000, rate: 4.39 });
  close(capped.maxPurchasePrice, 750000, 1);
  // $100k down on ~$600k+ is < 20% → premium added to the loan must not exceed the qualifying mortgage
  const r = ct.calculateAffordability({ annualIncome: 120000, downPayment: 100000, monthlyDebts: 500, rate: 4.39 });
  const downPct = (100000 / r.maxPurchasePrice) * 100;
  assert.ok(downPct >= 10 && downPct < 20, `down ${downPct.toFixed(1)}% should be in the 10-15/15-20% bands`);
  const premium = downPct >= 15 ? 0.028 : 0.031;
  close((r.maxPurchasePrice - 100000) * (1 + premium), r.maxMortgage, 50, "loan incl. premium = max mortgage");
});

test("calculateRefinanceBreakEven: default penalty = higher of 3-month interest and IRD", () => {
  // $400k at 5.75% → 4.79% with 36 months left: IRD 400,000 × 0.96% / 12 × 36 = $11,520 > 3-month $5,750
  const r = ct.calculateRefinanceBreakEven({ currentBalance: 400000, currentRate: 5.75, newRate: 4.79, remainingTermMonths: 36 });
  assert.match(r.formatted, /Penalty[^|]*\| \$11,520/);
});

test("refinance break-even parity: AI tool == /commercial/calculators/refinance page helper", () => {
  const cases = [
    { currentBalance: 400000, currentRate: 5.75, newRate: 4.79, remainingTermMonths: 36, remainingAmortizationYears: 22, newAmortizationYears: 25 },
    { currentBalance: 750000, currentRate: 6.1, newRate: 4.6, remainingTermMonths: 24, remainingAmortizationYears: 20, newAmortizationYears: 20 },
    { currentBalance: 300000, currentRate: 4.2, newRate: 4.6, remainingTermMonths: 48, remainingAmortizationYears: 18, newAmortizationYears: 25 },
  ];
  for (const c of cases) {
    const ai = ct.calculateRefinanceBreakEven(c);
    const web = refinanceBreakEven({ ...c, penaltyType: "both" });
    assert.equal(ai.monthlySavings, Math.round(web.monthlySavings), "monthly savings");
    assert.equal(ai.breakEvenMonths, web.breakEvenMonths === Infinity ? -1 : web.breakEvenMonths, "break-even months");
    assert.equal(ai.fiveYearSavings, Math.round(web.fiveYearSavings), "5-year savings");
  }
});

test("commercial refinance page defaults: $2,657.72 → $2,278.83, break-even 37 months", () => {
  const web = refinanceBreakEven({
    currentBalance: 400000, currentRate: 5.75, remainingTermMonths: 36, remainingAmortizationYears: 22,
    newRate: 4.79, newAmortizationYears: 25,
  });
  close(web.currentMonthlyPayment, 2657.72, 0.005);
  close(web.newMonthlyPayment, 2278.83, 0.005);
  close(web.monthlySavings, 378.89, 0.01);
  close(web.penalty, 11520, 0.01);
  close(web.totalCosts, 11520 + 2350, 0.01);
  assert.equal(web.breakEvenMonths, 37);
  assert.equal(web.isWorthRefinancing, false, "37 months > 36 left in the term");
});

test("cap rate / NOI guards: no Infinity or NaN on zero inputs", () => {
  assert.equal(ct.calculateCapRate({ noi: 100, marketValue: 0 }).capRate, 0);
  assert.equal(ct.calculateNOI({ grossRent: 0, expenses: 100 }).expenseRatio, 0);
  assert.equal(ct.calculateCapRate({ noi: 150000, marketValue: 2500000 }).capRate, 6);
});

test("MortgageTools.calculatePayment matches the benchmark and simulates bi-weekly savings", async () => {
  const r = await mt.calculatePayment({ principal: 500000, rate: 5, amortization: 25 });
  assert.equal(r.success, true);
  close(r.data.monthlyPayment, 2908.02, 0.005);
  assert.ok(r.data.biweekly.timeSaved > 3 && r.data.biweekly.timeSaved < 4, `time saved ${r.data.biweekly.timeSaved}`);
});

test("MortgageTools.calculateAffordability: binding of GDS 39% / TDS 44%, semi-annual inverse", async () => {
  // debts are ANNUAL in this tool: $6,000/yr → TDS room 4,400 − 350 − 500 = 3,550 = GDS room
  const gds = await mt.calculateAffordability({ income: 120000, debts: 6000, downPayment: 100000, rate: 4.39 });
  close(gds.data.qualification.maxAffordablePrice, pvSemiAnnual(3550, 6.39, 25) + 100000, 1);
  // $24,000/yr debts → TDS binds: 4,400 − 350 − 2,000 = 2,050
  const tds = await mt.calculateAffordability({ income: 120000, debts: 24000, downPayment: 100000, rate: 4.39 });
  close(tds.data.qualification.maxAffordablePrice, pvSemiAnnual(2050, 6.39, 25) + 100000, 1);
  // 50% of condo fees count
  const condo = await mt.calculateAffordability({ income: 120000, debts: 6000, downPayment: 100000, rate: 4.39, condoFees: 400 });
  close(condo.data.qualification.maxAffordablePrice, pvSemiAnnual(3550 - 200, 6.39, 25) + 100000, 1);
});

test("MortgageTools.calculateConstructionCost = shared interestOnlyCost (same as the progressive-draw page)", async () => {
  const draws = [[1, 15], [3, 25], [5, 20], [7, 20], [9, 15], [11, 5]].map(([month, p]) => ({ month, amount: (p / 100) * 600000 }));
  const r = await mt.calculateConstructionCost({ rate: 7.25, draws });
  const io = interestOnlyCost({ draws, annualRatePct: 7.25 });
  close(r.data.financing.totalInterest, io.totalInterest, 1e-9);
  close(r.data.financing.totalInterest, 28275, 0.01);
  close(r.data.financing.monthlyAverage, 28275 / 12, 0.01, "average over the 12-month period, not /11");
  const empty = await mt.calculateConstructionCost({ rate: 7.25, draws: [] });
  assert.equal(empty.success, false);
});
