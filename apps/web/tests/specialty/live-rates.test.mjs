// Live-rate selectors used to seed calculator defaults (components/calculators/liveRateDefaults.ts).
// Run: cd apps/web && node --test tests/specialty/
import { test } from "node:test";
import assert from "node:assert/strict";
import { importApp } from "./helpers/register-ts-paths.mjs";

const live = await importApp("components/calculators/liveRateDefaults.ts");

// Shape of /api/rates on 2026-10-13 (remote feed), trimmed to what the selectors read
const feed = {
  prime_rate: 4.45,
  last_synced_utc: "2026-10-13T20:00:06.068392+00:00",
  benchmarks: {
    fixed_5yr: { insured: { lowest_rate: 4.29 }, conventional: { lowest_rate: 4.39 } },
    heloc: { lowest_rate: 4.85 },
    // The feed listed A-lender products (MCAP / RMG, Prime + 0.50%) as "Private 2nd"
    private_second: { lowest_rate: 4.95, top_offers: [{ rate: 4.95 }, { rate: 4.95 }, { rate: 7.99 }] },
  },
};

test("selectors return undefined until the feed answers (static fallbacks stay in place)", () => {
  for (const fn of ["liveConventional5yr", "liveInsured5yr", "liveHeloc", "livePrivateSecond", "livePrime"]) {
    assert.equal(live[fn](null), undefined, fn);
  }
  assert.equal(live.ratesAsOf(null), null);
});

test("refinance basis is the conventional (uninsured) 5-yr, not the insured best5YrFixed", () => {
  assert.equal(live.liveConventional5yr(feed), 4.39);
  assert.equal(live.liveInsured5yr(feed), 4.29);
  assert.equal(live.liveHeloc(feed), 4.85);
  assert.equal(live.livePrime(feed), 4.45);
});

test("private rate skips implausible rows below prime + 2% (mislabelled A-lender products)", () => {
  assert.equal(live.livePrivateSecond(feed), 7.99);
  assert.equal(
    live.livePrivateSecond({ prime_rate: 4.45, benchmarks: { private_second: { lowest_rate: 4.95, top_offers: [] } } }),
    undefined
  );
});

test("ratesAsOf formats the sync date in Pacific time", () => {
  assert.equal(live.ratesAsOf(feed), "Oct 13, 2026");
  assert.equal(live.ratesAsOf({ last_synced_utc: "not a date" }), null);
});
