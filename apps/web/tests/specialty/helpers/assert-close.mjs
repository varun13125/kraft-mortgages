import assert from "node:assert/strict";

/** assert |actual - expected| <= tol, with a readable message. */
export function close(actual, expected, tol = 0.005, label = "") {
  assert.ok(
    Number.isFinite(actual) && Math.abs(actual - expected) <= tol,
    `${label ? label + ": " : ""}expected ${expected} ± ${tol}, got ${actual}`
  );
}

/**
 * Independent Canadian mortgage math (fixed rate, semi-annual compounding) used as the oracle.
 * Deliberately NOT imported from the app so a regression in lib/calc/payment.ts is caught.
 */
export function monthlyRateSemiAnnual(annualPct) {
  return Math.pow(1 + annualPct / 200, 1 / 6) - 1;
}

export function pmtSemiAnnual(principal, annualPct, years) {
  const i = monthlyRateSemiAnnual(annualPct);
  const n = years * 12;
  return i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));
}

export function pvSemiAnnual(monthlyPayment, annualPct, years) {
  const i = monthlyRateSemiAnnual(annualPct);
  const n = years * 12;
  return i === 0 ? monthlyPayment * n : (monthlyPayment * (1 - Math.pow(1 + i, -n))) / i;
}
