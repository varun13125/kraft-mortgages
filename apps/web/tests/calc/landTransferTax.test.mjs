// Golden values for lib/calc/landTransferTax.ts: BC PTT (incl. the further 2% above $3M) and first-time
// buyer exemption (gov.bc.ca table points), Ontario LTT + $4,000 refund, Toronto MLTT incl. the Apr 1, 2026
// luxury tiers + $4,475 rebate, Alberta Land Titles fees ("$5 for each $5,000 or portion thereof").
// All rules re-verified against primary sources on 2026-10-13 (see the header of lib/calc/landTransferTax.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCalc, near } from "./_helpers/load.mjs";

const L = await loadCalc("landTransferTax");
const bc = (p) => L.bcPropertyTransferTax(p).total;
const on = (p) => L.ontarioLandTransferTax(p).total;
const to = (p) => L.torontoMunicipalLandTransferTax(p).total;

test("BC property transfer tax brackets, incl. the further 2% above $3M", () => {
  near(bc(200000), 2000);
  near(bc(500000), 8000);
  near(bc(700000), 12000);
  near(bc(850000), 15000);
  near(bc(2000000), 38000);
  near(bc(3000000), 68000);
  near(bc(4000000), 118000); // audit F8: was $98,000 without the >$3M residential tax
  assert.equal(bc(0), 0);
});

test("BC first-time buyer exemption matches the gov.bc.ca table", () => {
  near(L.bcFirstTimeBuyerExemption(400000), 6000);
  near(L.bcFirstTimeBuyerExemption(700000), 8000);
  near(L.bcFirstTimeBuyerExemption(835000), 8000);
  near(L.bcFirstTimeBuyerExemption(850000), 3200);
  near(L.bcFirstTimeBuyerExemption(852000), 2560); // gov table: $15,040 tax, $2,560 exemption
  near(L.bcFirstTimeBuyerExemption(855000), 1600);
  near(L.bcFirstTimeBuyerExemption(859000), 320);
  assert.equal(L.bcFirstTimeBuyerExemption(860000), 0);
  const t852 = L.landTransferTax({ price: 852000, province: "BC", firstTime: true });
  near(t852.provincialTax, 15040);
  near(t852.total, 12480); // gov table: $12,480 payable
});

test("BC net PTT for first-time buyers only exempts the first $500k (audit F3)", () => {
  near(L.landTransferTax({ price: 650000, province: "BC", firstTime: true }).total, 3000); // was $0
  near(L.landTransferTax({ price: 750000, province: "BC", firstTime: true }).total, 5000); // was $0
  near(L.landTransferTax({ price: 700000, province: "BC" }).total, 12000);
});

test("Ontario land transfer tax brackets", () => {
  near(on(55000), 275);
  near(on(250000), 2225);
  near(on(400000), 4475);
  near(on(500000), 6475);
  near(on(2000000), 36475);
  near(on(2500000), 48975);
});

test("Ontario first-time buyer refund is capped at $4,000 (not $4,475)", () => {
  near(L.landTransferTax({ price: 500000, province: "ON", firstTime: true }).total, 2475);
  near(L.landTransferTax({ price: 700000, province: "ON", firstTime: true }).total, 6475); // audit F9: was $10,475
  near(on(368333.33), 4000, 0.01); // the price at which the refund covers the whole tax
  near(L.landTransferTax({ price: 300000, province: "ON", firstTime: true }).total, 0);
});

test("Toronto MLTT mirrors Ontario to $3M, then the Apr 1, 2026 luxury tiers", () => {
  near(to(1000000), on(1000000));
  near(to(3000000), 61475);
  near(to(3500000), 61475 + 22000);
  near(to(5000000), 159975); // audit F8: was $111,475 (mirrored the provincial tax)
  near(to(25000000), 61475 + 44000 + 54500 + 325000 + 755000 + 430000);
});

test("Toronto first-time buyer: $4,000 provincial refund + $4,475 municipal rebate", () => {
  const r = L.landTransferTax({ price: 600000, province: "ON", firstTime: true, toronto: true });
  near(r.provincialTax, 8475);
  near(r.provincialRelief, 4000);
  near(r.municipalTax, 8475);
  near(r.municipalRelief, 4475);
  near(r.total, 4475 + 4000);
});

test("Alberta Land Titles fees: $50 + $5 per $5,000 or portion thereof, transfer + mortgage", () => {
  near(L.albertaRegistrationFee(500000), 550);
  near(L.albertaRegistrationFee(500001), 555); // "or portion thereof" rounds up
  near(L.albertaRegistrationFee(650000), 700); // audit F8: was $180 at $1 per $5k
  near(L.albertaRegistrationFee(1000000), 1050);
  assert.equal(L.albertaRegistrationFee(0), 0);
  const ab = L.landTransferTax({ price: 500000, province: "AB", mortgageAmount: 400000 });
  near(ab.registrationFees, 550 + 450);
  near(ab.total, 1000);
  assert.equal(ab.provincialTax, 0);
});
