// Rate-feed normalization (lib/rates.ts) against a snapshot of the public production feed
// (https://blog.kraftmortgages.ca/current_rates.json, 2026-10-13), which contains both known defects:
// spreadsheet-serial dates ("46301") and A-lender products mislabelled "Private 2nd" at Prime + 0.50%.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { importApp } from "../specialty/helpers/register-ts-paths.mjs";

const feed = JSON.parse(readFileSync(new URL("./fixtures/rates-feed-2026-10-13.json", import.meta.url), "utf8"));
const rates = await importApp("lib/rates.ts");

test("spreadsheet serial dates become ISO dates", () => {
  assert.equal(rates.normalizeEffectiveDate("46301"), "2026-10-06");
  assert.equal(rates.normalizeEffectiveDate("2026-10-02"), "2026-10-02");
  assert.equal(rates.normalizeEffectiveDate(""), "");
  assert.equal(rates.normalizeEffectiveDate(undefined), "");
});

test("private second ignores sub-(prime + 2%) offers mislabelled as private", () => {
  const out = rates.formatLiveRatesData(feed, "https://blog.kraftmortgages.ca/current_rates.json");
  const ps = out.benchmarks.private_second;
  assert.ok(feed.rate_benchmarks.private_second.lowest_rate < feed.prime_rate_benchmark + 2, "fixture still has the defect");
  assert.ok(ps.lowest_rate >= feed.prime_rate_benchmark + 2, `got ${ps.lowest_rate}`);
  assert.equal(ps.lowest_rate, 7.99);
  for (const o of ps.top_offers ?? []) assert.ok(o.rate >= feed.prime_rate_benchmark + 2);
});

test("no serial dates leak into benchmarks or raw_benchmarks", () => {
  const out = rates.formatLiveRatesData(feed, "https://blog.kraftmortgages.ca/current_rates.json");
  const all = [...Object.values(out.benchmarks), ...Object.values(out.raw_benchmarks ?? {})];
  const dates = JSON.stringify(all).match(/"effective_date":"[^"]*"/g) ?? [];
  for (const d of dates) assert.doesNotMatch(d, /"effective_date":"\d{5}"/, d);
});

test("median and lender-count fields survive normalization", () => {
  const out = rates.formatLiveRatesData(feed, "https://blog.kraftmortgages.ca/current_rates.json");
  assert.equal(out.benchmarks.fixed_5yr.conventional.median_rate, feed.rate_benchmarks["5_year_fixed_conventional"].median_rate);
});
