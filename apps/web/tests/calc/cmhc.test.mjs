// Golden values for lib/calc/cmhc.ts: minimum down payment, insurability, premium tiers, LTV table,
// 0.20% long-amortization surcharge and sales tax on premiums. Rules verified against CMHC / Sagen /
// Canada Guaranty / Finance Canada on 2026-10-13 (see the source comment in lib/calc/cmhc.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const C = await loadCalc("cmhc");

test("minimum down payment: 5% to $500k, 10% above, 20% of the whole price at $1.5M+", () => {
  near(C.minimumDownPayment(400000), 20000);
  near(C.minimumDownPayment(500000), 25000);
  near(C.minimumDownPayment(750000), 50000);
  near(C.minimumDownPayment(1200000), 95000); // audit F2: was $115,000 under the old "$1M" rule
  near(C.minimumDownPayment(1499999), 124999.9);
  near(C.minimumDownPayment(1500000), 300000); // the $1.5M jump
  near(C.minimumDownPayment(2000000), 400000);
  assert.equal(C.minimumDownPayment(0), 0);
});

test("isInsurable: minimum down met and price under $1.5M", () => {
  assert.ok(C.isInsurable(700000, 45000));
  assert.ok(!C.isInsurable(700000, 44999));
  assert.ok(!C.isInsurable(1500000, 299999));
  assert.ok(!C.isInsurable(1500000, 1000000), "nothing is insurable at $1.5M+");
  assert.ok(C.isInsurable(1499999, 124999.9));
});

test("premium tiers by down payment %, boundaries included", () => {
  const r = (d) => C.cmhcPremiumRate(d);
  assert.equal(r(5), 0.04);
  assert.equal(r(9.99), 0.04);
  assert.equal(r(10), 0.031);
  assert.equal(r(14.99), 0.031);
  assert.equal(r(15), 0.028);
  assert.equal(r(19.99), 0.028);
  assert.equal(r(20), 0);
  assert.equal(r(14.999999999999), 0.028, "float noise stays in the 2.80% tier");
});

test("premium LTV table (incl. 4.50% non-traditional down payment)", () => {
  const r = C.cmhcPremiumRateByLtv;
  assert.equal(r(65), 0.006);
  assert.equal(r(65.01), 0.017);
  assert.equal(r(75), 0.017);
  assert.equal(r(80), 0.024);
  assert.equal(r(85), 0.028);
  assert.equal(r(90), 0.031);
  assert.equal(r(95), 0.04);
  assert.equal(r(95, { nonTraditionalDownPayment: true }), 0.045);
});

test("0.20% surcharge only for amortizations over 25 years, and only when insured", () => {
  assert.equal(C.LONG_AMORTIZATION_SURCHARGE, 0.002);
  near(C.cmhcPremiumRate(10, 30), 0.033, 1e-12);
  near(C.cmhcPremiumRate(5, 30), 0.042, 1e-12); // Canada Guaranty over-25-yr column: 4.20%
  near(C.cmhcPremiumRate(15, 30), 0.030, 1e-12); // ... 3.00%
  near(C.cmhcPremiumRate(10, 25), 0.031, 1e-12);
  assert.equal(C.cmhcPremiumRate(20, 30), 0);
});

test("premium dollars: $700k with 10% down = $19,530; 30-year = $20,790 (audit F12)", () => {
  near(C.cmhcPremium(700000, 70000), 19530, 0.01);
  near(C.cmhcPremium(700000, 70000, 30), 20790, 0.01);
  near(C.insuredMortgageAmount(700000, 70000), 649530, 0.01);
  assert.equal(C.cmhcPremium(700000, 140000), 0);
  const d = 650000 * 15 / 100;
  near(C.cmhcPremium(650000, d), (650000 - d) * 0.028, 0.001);
});

test("sales tax on the premium: ON 8%, SK 6%, QC 9% then 9.975% from 2027, none in BC/AB", () => {
  near(C.premiumPst(19530, "ON"), 1562.4, 0.001);
  assert.equal(C.premiumPst(19530, "BC"), 0);
  assert.equal(C.premiumPst(19530, "AB"), 0);
  near(C.premiumPst(10000, "SK"), 600, 1e-9);
  near(C.premiumPst(10000, "QC", new Date("2026-10-13T12:00:00Z")), 900, 1e-9);
  near(C.premiumPst(10000, "QC", new Date("2027-01-02T12:00:00Z")), 997.5, 1e-9);
  near(C.premiumPstRate("ON", new Date("2027-06-01T00:00:00Z")), 0.08, 1e-12);
});

test("insured price cap, stress test and ratio constants", () => {
  assert.equal(C.INSURED_PRICE_CAP, 1500000);
  assert.equal(C.stressTestRate(3.25), 5.25);
  near(C.stressTestRate(4.39), 6.39, 1e-12);
  assert.deepEqual({ ...C.QUALIFYING_RATIOS }, { GDS_MAX: 39, TDS_MAX: 44 });
});
