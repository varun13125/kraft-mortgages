import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const { validateNumericInput } = await import(pathToFileURL(resolve("lib/utils/validation.ts")));

test("numeric validation rejects empty, partial and non-finite values without publishing them", () => {
  for (const value of ["", " ", "12bad", "1e309", Infinity, -Infinity, NaN]) {
    assert.equal(validateNumericInput(value).isValid, false, String(value));
  }
  assert.equal(validateNumericInput("0", { min: 0 }).isValid, true);
  assert.equal(validateNumericInput("1.25", { min: 0, max: 5 }).value, 1.25);
  assert.equal(validateNumericInput("-1", { min: 0 }).isValid, false);
});
