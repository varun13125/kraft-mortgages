// MLI Select math (lib/mli/calcs.ts). Run: cd apps/web && node --test tests/specialty/
// Rule sources: CMHC MLI Select at-a-glance sheet (doc 66792 20251029-008A) and MLI Select page
// (2026-09-21); CMHC multi-unit premium grid effective 2025-07-14 (CMLS / RENX summaries).
import { test } from "node:test";
import assert from "node:assert/strict";
import { importApp } from "./helpers/register-ts-paths.mjs";
import { close, pmtSemiAnnual } from "./helpers/assert-close.mjs";

const mli = await importApp("lib/mli/calcs.ts");

test("pmt uses Canadian semi-annual compounding ($500k / 5% / 25y = $2,908.02)", () => {
  close(mli.pmt(5, 25, 500000), 2908.02, 0.005);
  close(mli.pmt(5, 25, 500000), pmtSemiAnnual(500000, 5, 25), 1e-9);
  close(mli.pmt(0, 25, 300000), 1000, 1e-9, "0% rate");
  assert.equal(mli.pmt(5, 0, 300000), 0, "zero amortization");
});

test("amortizationSchedule pays the loan off and matches pmt", () => {
  const { payment, rows } = mli.amortizationSchedule(4.5, 40, 10_000_000);
  close(payment, mli.pmt(4.5, 40, 10_000_000), 1e-9);
  assert.equal(rows.length, 480);
  close(rows.at(-1).balance, 0, 0.01, "final balance");
});

test("tierFromPoints / totalPointsCalc cap at 100", () => {
  assert.equal(mli.tierFromPoints(49), 0);
  assert.equal(mli.tierFromPoints(50), 50);
  assert.equal(mli.tierFromPoints(69), 50);
  assert.equal(mli.tierFromPoints(70), 70);
  assert.equal(mli.tierFromPoints(100), 100);
  assert.equal(mli.totalPointsCalc(130, 50, 30), 100);
});

test("amortByTier: 50 → 40 yrs, 70 → 45 yrs, 100 → 50 yrs (below 50: 25-yr baseline)", () => {
  assert.equal(mli.amortByTier(0), 25);
  assert.equal(mli.amortByTier(50), 40);
  assert.equal(mli.amortByTier(70), 45);
  assert.equal(mli.amortByTier(100), 50);
});

test("leverageFor: new 95% LTC at 50/70/100; existing 85% LTV at 50, 95% at 70/100", () => {
  assert.equal(mli.leverageFor(true, 50), 0.95);
  assert.equal(mli.leverageFor(true, 70), 0.95);
  assert.equal(mli.leverageFor(true, 100), 0.95);
  assert.equal(mli.leverageFor(false, 50), 0.85);
  assert.equal(mli.leverageFor(false, 70), 0.95);
  assert.equal(mli.leverageFor(false, 100), 0.95);
  assert.equal(mli.leverageFor(true, 0), 0.8, "baseline below 50 pts");
  assert.equal(mli.maxLoanFromValueOrCost(false, 50, 20_000_000), 17_000_000);
});

test("energyPoints: new construction uses the NECB scale (25/50/60%), existing the 15/25/40% scale", () => {
  // new construction: % better than NECB Tier 1
  assert.equal(mli.energyPoints(24, true), 0);
  assert.equal(mli.energyPoints(25, true), 20);
  assert.equal(mli.energyPoints(50, true), 35);
  assert.equal(mli.energyPoints(60, true), 50);
  // existing: % reduction vs baseline
  assert.equal(mli.energyPoints(15, false), 20);
  assert.equal(mli.energyPoints(25, false), 35);
  assert.equal(mli.energyPoints(40, false), 50);
  // regression: 25% on a NEW building used to score 35 (existing scale)
  assert.notEqual(mli.energyPoints(25, true), mli.energyPoints(25, false));
});

test("affordabilityPoints: 10-year minimum commitment, +30 for 20+ years", () => {
  assert.equal(mli.affordabilityPoints(true, 30, 9), 0, "under 10 years scores nothing");
  assert.equal(mli.affordabilityPoints(true, 10, 10), 50);
  assert.equal(mli.affordabilityPoints(true, 15, 10), 70);
  assert.equal(mli.affordabilityPoints(true, 25, 10), 100);
  assert.equal(mli.affordabilityPoints(true, 25, 20), 130);
  assert.equal(mli.affordabilityPoints(false, 40, 10), 50);
  assert.equal(mli.affordabilityPoints(false, 60, 10), 70);
  assert.equal(mli.affordabilityPoints(false, 80, 10), 100);
  assert.equal(mli.affordabilityPoints(false, 39, 25), 0, "no base → no bonus");
});

test("accessibilityPoints: requires visitable units + barrier-free commons; 20 / 30 levels", () => {
  const base = { visitableAll: true, commonsBarrierFree: true, pctAccessible: 0, pctUniversal: 0, rhfScore: 0 };
  assert.equal(mli.accessibilityPoints({ ...base, pctAccessible: 15 }), 20);
  assert.equal(mli.accessibilityPoints({ ...base, pctAccessible: 15, pctUniversal: 85 }), 30);
  assert.equal(mli.accessibilityPoints({ ...base, rhfScore: 80 }), 30);
  assert.equal(mli.accessibilityPoints({ ...base, pctAccessible: 15, visitableAll: false }), 0);
});

test("premium grid (2025-07-14), amortization surcharge and MLI Select discount", () => {
  assert.equal(mli.mliBasePremiumPct(65, "other"), 2.6);
  assert.equal(mli.mliBasePremiumPct(80, "construction"), 5.0);
  assert.equal(mli.mliBasePremiumPct(85, "other"), 5.35);
  assert.equal(mli.mliBasePremiumPct(90, "construction"), 6.75);
  assert.equal(mli.mliBasePremiumPct(95, "other"), 6.15);
  assert.equal(mli.mliBasePremiumPct(95, "construction"), 7.0);
  assert.equal(mli.mliAmortizationSurchargePct(25), 0);
  assert.equal(mli.mliAmortizationSurchargePct(40), 0.75);
  assert.equal(mli.mliAmortizationSurchargePct(45), 1.0);
  assert.equal(mli.mliAmortizationSurchargePct(50), 1.25);
  assert.equal(mli.premiumDiscountFor(0), 0);
  assert.equal(mli.premiumDiscountFor(50), 0.1);
  assert.equal(mli.premiumDiscountFor(70), 0.2);
  assert.equal(mli.premiumDiscountFor(100), 0.3);
});

test("CMLS worked example: construction, 90% LTC, 40 yrs, 50 pts → 6.75% payable", () => {
  const payable =
    (mli.mliBasePremiumPct(90, "construction") + mli.mliAmortizationSurchargePct(40)) * (1 - mli.premiumDiscountFor(50));
  close(payable, 6.75, 1e-9);
});

test("premium page default: $15M, 95% LTV purchase/refi, 50 yrs, 100 pts → 5.18% = $777,000", () => {
  const before = mli.mliBasePremiumPct(95, "other") + mli.mliAmortizationSurchargePct(50); // 7.40
  const after = before * (1 - mli.premiumDiscountFor(100));
  close(before, 7.4, 1e-9);
  close(after, 5.18, 1e-9);
  close((15_000_000 * after) / 100, 777_000, 0.01);
});

test("dscrMaxLoan round-trip: debt coverage is exactly 1.10 and matches an independent PV", () => {
  for (const [noi, rate, points] of [[1_200_000, 4.5, 100], [1_200_000, 4.5, 70], [450_000, 5.25, 50]]) {
    const years = mli.amortByTier(points);
    const loan = mli.dscrMaxLoan({ noi, rateAnnual: rate, years, minDcr: 1.1 });
    const annualDebtService = mli.pmt(rate, years, loan) * 12;
    close(noi / annualDebtService, 1.1, 1e-9, `DCR @ ${points} pts`);
    const independent = noi / 1.1 / 12 / pmtSemiAnnual(1, rate, years);
    close(loan, independent, 0.01, `loan @ ${points} pts`);
  }
  assert.equal(mli.dscrMaxLoan({ noi: 0, rateAnnual: 4.5, years: 40, minDcr: 1.1 }), 0);
  assert.equal(mli.dscrMaxLoan({ noi: 100000, rateAnnual: 4.5, years: 40, minDcr: 0 }), 0);
});

test("breakEvenRentPerUnit grosses rent up for vacancy and target margin", () => {
  const debt = mli.pmt(4.5, 40, 15_000_000);
  const none = mli.breakEvenRentPerUnit({ monthlyDebtService: debt, otherMonthlyOpex: 50_000, units: 100, targetMargin: 0.15 });
  const vac3 = mli.breakEvenRentPerUnit({ monthlyDebtService: debt, otherMonthlyOpex: 50_000, units: 100, targetMargin: 0.15, vacancyRate: 0.03 });
  close(none, ((debt + 50_000) / 0.85) / 100, 1e-9);
  close(vac3, none / 0.97, 1e-9);
  const collected = vac3 * 100 * 0.97;
  close((collected - debt - 50_000) / collected, 0.15, 1e-12);
  assert.equal(mli.breakEvenRentPerUnit({ monthlyDebtService: 1, otherMonthlyOpex: 1, units: 10, targetMargin: 1 }), 0);
  assert.equal(mli.breakEvenRentPerUnit({ monthlyDebtService: 1, otherMonthlyOpex: 1, units: 0 }), 0);
});

test("rentCapFromMedian = 30% of median renter income / 12", () => {
  close(mli.rentCapFromMedian(60_000), 1500, 1e-9);
});
