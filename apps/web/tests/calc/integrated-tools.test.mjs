import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCalc, near } from './_helpers/load.mjs';
const { compareRenewal } = await loadCalc('renewal');
const { sizeMliDeal } = await loadCalc('mliDeal');
const offer = (rate = 5, amortYears = 25, overrides = {}) => ({ name: 'Quote', rate, amortYears, termMonths: 60, fees: 0, cashback: 0, clawback: 0, ...overrides });
// Independent amortization ledger, not the app's closed form.
function ledger(principal, rate, years, months) {
  const i = (1 + rate / 200) ** (1 / 6) - 1;
  const pmt = i ? principal * i / (1 - (1 + i) ** (-years * 12)) : principal / (years * 12);
  let balance = principal, interest = 0;
  for (let m = 0; m < months && balance > .000001; m++) { const cost = balance * i; interest += cost; balance = Math.max(0, balance + cost - pmt); }
  return { balance, interest, pmt };
}
test('renewal compares independently reconciled interest, fees, incentives and ending debt', () => {
  const r = compareRenewal({ principal: 450000, baseline: offer(5.49, 22), offers: [offer(4.49, 22, { fees: 1800, cashback: 1000, clawback: 500 })], horizonMonths: 60 });
  const b = ledger(450000, 5.49, 22, 60), n = ledger(450000, 4.49, 22, 60);
  near(r.results[1].balance, n.balance); near(r.results[1].interestPaid, n.interest);
  near(r.results[1].netCost, n.interest + 1300); near(r.results[1].savings, b.interest - n.interest - 1300);
  assert.equal(r.winnerIndex, 1);
});
test('same-rate amortization extension reduces payment but increases cost and remaining debt', () => {
  const r = compareRenewal({ principal: 500000, baseline: offer(5, 20), offers: [offer(5, 30)], horizonMonths: 60 });
  assert.ok(r.results[1].monthlyPayment < r.results[0].monthlyPayment);
  assert.ok(r.results[1].balance > r.results[0].balance);
  assert.ok(r.results[1].savings < 0); assert.equal(r.winnerIndex, 0); assert.equal(r.results[1].straightSwitchShape, false);
});
test('early break includes actual penalty and caps horizon to remaining term', () => {
  const r = compareRenewal({ principal: 450000, baseline: offer(5, 22, { termMonths: 18 }), offers: [offer(4, 22)], horizonMonths: 60, earlyBreak: true, penalty: 20000 });
  assert.equal(r.months, 18); assert.equal(r.capped, true); assert.equal(r.results[1].cashCosts, 20000); assert.equal(r.results[1].recoveryMonths, null);
});
test('cash incentives can produce immediate cost recovery; invalid inputs rejected', () => {
  const r = compareRenewal({ principal: 200000, baseline: offer(), offers: [offer(5, 25, { cashback: 1000 })], horizonMonths: 60 });
  assert.equal(r.results[1].recoveryMonths, 0);
  for (const principal of [NaN, Infinity, 0, -1]) assert.throws(() => compareRenewal({ principal, baseline: offer(), offers: [offer()], horizonMonths: 60 }), RangeError);
});
const mli = { isNew: true, units: 100, affordableUnits: 25, affordabilityYears: 10, energyImprovement: 25, accessiblePct: 15, universalPct: 0, visitableAll: true, barrierFreeCommons: true, value: 20000000, noi: 1200000, rate: 4.5, amortYears: 50, minDcr: 1.1, closingCosts: 50000, financePremium: true };
test('MLI sizes financed premium inside independently derived DCR capacity', () => {
  const r = sizeMliDeal(mli);
  assert.equal(r.eligible, true); assert.equal(r.tier, 100); assert.equal(r.amort, 50);
  const monthlyPerDollar = ledger(1, 4.5, 50, 0).pmt;
  near(r.debtCapacity, 1200000 / 1.1 / 12 / monthlyPerDollar);
  near(r.totalDebt, r.baseLoan + r.premium); near(r.monthlyPayment, r.totalDebt * monthlyPerDollar);
  assert.ok(r.dscr >= 1.1 - 1e-10); assert.ok(r.baseLoan <= 19000000); assert.ok(r.totalDebt <= r.debtCapacity + .001);
  near(r.cashRequired, 20000000 - r.baseLoan + 50000);
});
test('paying premium in cash increases base proceeds but requires premium cash', () => {
  const financed = sizeMliDeal({ ...mli, noi: 800000 }), cash = sizeMliDeal({ ...mli, noi: 800000, financePremium: false });
  assert.ok(cash.baseLoan > financed.baseLoan); near(cash.totalDebt, cash.baseLoan);
  near(cash.cashRequired, mli.value - cash.baseLoan + cash.premium + mli.closingCosts);
});
test('tier caps differ for existing/new 50 points; requested amortization is capped', () => {
  const common = { ...mli, energyImprovement: 0, accessiblePct: 0, universalPct: 0, noi: 5000000 };
  const existing = sizeMliDeal({ ...common, isNew: false, affordableUnits: 40 });
  const build = sizeMliDeal({ ...common, affordableUnits: 10 });
  assert.equal(existing.tier, 50); assert.equal(existing.leverage, .85); assert.equal(existing.amort, 40);
  assert.equal(build.tier, 50); assert.equal(build.leverage, .95); assert.equal(build.binding, 'Leverage');
  near(existing.baseLoan, 17000000, .02);
});
test('ineligible units, missing points and non-finite inputs suppress loan results', () => {
  for (const patch of [{ units: 4 }, { units: 5.5 }, { affordableUnits: 101 }, { rate: NaN }, { noi: Infinity }, { amortYears: NaN }, { amortYears: Infinity }, { minDcr: 1 }, { affordableUnits: 0, energyImprovement: 0, accessiblePct: 0 }]) {
    const r = sizeMliDeal({ ...mli, ...patch }); assert.equal(r.eligible, false); assert.equal(r.baseLoan, 0); assert.equal(r.totalDebt, 0);
    assert.ok(Object.values(r).every(v => typeof v !== 'number' || Number.isFinite(v)));
  }
});
test('MLI premium band search remains feasible across rate/NOI/tier and zero-rate boundaries', () => {
  for (const rate of [0, 1, 4.5, 9, 30]) for (const noi of [1000, 400000, 800000, 1400000, 5000000]) for (const affordableUnits of [10, 15, 25]) {
    const r = sizeMliDeal({ ...mli, rate, noi, affordableUnits, energyImprovement: 0, accessiblePct: 0 });
    assert.ok(r.eligible); assert.ok(Number.isFinite(r.cashRequired)); assert.ok(r.totalDebt <= r.debtCapacity + .02); assert.ok(r.baseLoan <= r.leverageCap + .02);
    assert.ok(r.dscr >= 1.1 - 1e-8); assert.ok(r.cashRequired >= 0);
  }
});
