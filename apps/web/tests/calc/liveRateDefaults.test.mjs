// FEAT-007: benchmark selection for live-rate calculator defaults
// (app/(site)/calculators/_lib/liveRateDefaults.ts). Uses a fixture shaped like /api/rates.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./_helpers/load.mjs";

const L = await loadApp("app/(site)/calculators/_lib/liveRateDefaults.ts");

const bm = (lowest_rate) => ({ lowest_rate, lowest_spread: "Fixed", leading_lender: "X", product_family: "Y", effective_date: "2026-10-01" });
const FEED = {
  success: true,
  source: "fixture",
  last_synced_utc: "2026-10-13T13:31:00Z",
  last_updated_human: "Updated Oct 13, 2026",
  is_today: false,
  prime_rate: 4.45,
  benchmarks: {
    fixed_5yr: { insured: bm(4.29), insurable: bm(4.44), conventional: bm(4.39), lowest: 4.29 },
    fixed_3yr: { insured: bm(4.29), insurable: bm(4.54), conventional: bm(4.39), lowest: 4.29 },
    variable_5yr: { insured: bm(3.44), insurable: bm(3.55), conventional: bm(3.7), lowest: 3.44 },
    heloc: bm(4.85),
    private_second: bm(7.99),
  },
  featured_rates: [],
  all_rates: [],
  raw_benchmarks: {
    "5_year_fixed_insured": { lowest_rate: 4.29, median_rate: 4.89 },
    "5_year_fixed_conventional": { lowest_rate: 4.39, median_rate: 5.2 },
    alt_1_year_fixed: { lowest_rate: 4.19, median_rate: 5.64 },
    alt_5_year_fixed: { lowest_rate: 5.04, median_rate: 6.09, typical_lender_fee_pct: 1, lender_count: 14 },
    alt_heloc: { lowest_rate: 5.74, median_rate: 9.74 },
    private_second: { lowest_rate: 7.99, median_rate: 9.24, typical_lender_fee_pct: null },
    broken: { lowest_rate: 99 },
  },
};

test("insured vs conventional: best5YrFixed (insured) is NOT used for refinances", () => {
  assert.equal(L.liveRate(FEED, "fixed5Insured"), 4.29);
  assert.equal(L.liveRate(FEED, "fixed5Insurable"), 4.44);
  assert.equal(L.liveRate(FEED, "fixed5Conventional"), 4.39);
  assert.equal(L.liveRate(FEED, "variable5Insured"), 3.44);
  assert.equal(L.liveRate(FEED, "prime"), 4.45);
  assert.equal(L.liveRate(FEED, "heloc"), 4.85);
  assert.equal(L.liveRate(FEED, "privateSecond"), 7.99);
});

test("alternative-lender products come from raw_benchmarks.alt_*", () => {
  assert.equal(L.liveRate(FEED, "alt5Fixed"), 5.04);
  assert.equal(L.liveRate(FEED, "alt1Fixed"), 4.19);
  assert.equal(L.liveRate(FEED, "altHeloc"), 5.74);
  assert.equal(L.liveRate(FEED, "alt3Fixed"), undefined); // missing in the fixture -> keep the static default
  assert.equal(L.liveMedianRate(FEED, "5_year_fixed_insured"), 4.89);
  assert.deepEqual(L.liveBenchmark(FEED, "alt_5_year_fixed"), { lowest: 5.04, median: 6.09, feePct: 1, lenderCount: 14 });
  assert.deepEqual(L.liveBenchmark(FEED, "private_second"), { lowest: 7.99, median: 9.24, feePct: undefined, lenderCount: undefined });
  assert.equal(L.liveBenchmark(FEED, "broken"), undefined); // implausible values are ignored
});

test("no data / failed fetch -> undefined so the page keeps its static fallback", () => {
  assert.equal(L.liveRate(null, "fixed5Insured"), undefined);
  assert.equal(L.liveRate({ ...FEED, success: false }, "fixed5Insured"), undefined);
  assert.equal(L.liveMedianRate(undefined, "5_year_fixed_insured"), undefined);
  assert.equal(L.ratesAsOf(null), null);
});

test("purchaseRateProduct: insured < 20% down; insurable to 25 yrs under $1.5M; else conventional", () => {
  assert.equal(L.purchaseRateProduct(10, 700000, 25), "fixed5Insured");
  assert.equal(L.purchaseRateProduct(10, 700000, 30), "fixed5Insured");
  assert.equal(L.purchaseRateProduct(20, 700000, 25), "fixed5Insurable");
  assert.equal(L.purchaseRateProduct(20, 700000, 30), "fixed5Conventional");
  assert.equal(L.purchaseRateProduct(25, 1600000, 25), "fixed5Conventional");
});

test("ratesAsOf formats the sync date in Vancouver time", () => {
  assert.match(L.ratesAsOf(FEED), /Oct\.? 13, 2026/);
});
