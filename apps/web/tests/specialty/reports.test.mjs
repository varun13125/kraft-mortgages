// PDF report generators under jsPDF 4 (built in Node, no browser). Run: cd apps/web && node --test tests/specialty/
import { test } from "node:test";
import assert from "node:assert/strict";
import { importApp } from "./helpers/register-ts-paths.mjs";

const generic = await importApp("components/calculator-report/generateGenericReport.ts");
const avsb = await importApp("components/calculator-report/generateAvsBReport.ts");

function assertValidPdf(doc, expectedPages) {
  const buf = Buffer.from(doc.output("arraybuffer"));
  const text = buf.toString("latin1");
  assert.equal(buf.subarray(0, 5).toString("latin1"), "%PDF-");
  assert.ok(text.trimEnd().endsWith("%%EOF"), "has %%EOF trailer");
  assert.ok(buf.length > 2000, `non-trivial size (${buf.length} bytes)`);
  const pageObjects = (text.match(/\/Type \/Page[^s]/g) || []).length;
  assert.equal(pageObjects, doc.getNumberOfPages());
  if (expectedPages !== undefined) assert.equal(doc.getNumberOfPages(), expectedPages);
}

test("pdfSafe maps/strips characters Helvetica (WinAnsi) can't draw", () => {
  assert.equal(generic.pdfSafe("GDS ≤ 39% and TDS ≥ 44% − ok → next"), "GDS <= 39% and TDS >= 44% - ok -> next");
  assert.equal(generic.pdfSafe("Café — “quotes” • 1½"), "Café — “quotes” • 1½", "WinAnsi characters are kept");
  assert.equal(generic.pdfSafe("Hi ✅ 名字"), "Hi ", "emoji / CJK dropped");
  assert.equal(generic.pdfSafe(undefined), "");
});

test("generic report builds a valid multi-page PDF; long labels wrap instead of overlapping", () => {
  const doc = generic.buildGenericReport({
    title: "Your MLI Select Scenario Comparison",
    calculatorName: "MLI Select Scenario Compare",
    userName: "Test User",
    sections: [
      {
        title: "Scenario A",
        rows: [
          { label: "Estimated premium savings versus the standard CMHC premium with no MLI Select discount, including the amortization surcharge", value: "$1,234,567", highlight: true },
          { label: "GDS ≤ 39%", value: "A long value that is wider than forty-five percent of the row and must wrap" },
        ],
      },
      { title: "Many rows", rows: Array.from({ length: 45 }, (_, i) => ({ label: `Row ${i + 1}`, value: `$${i}` })) },
    ],
    educationalContent: "Most lenders require GDS ≤ 39% and TDS ≤ 44%. ".repeat(20),
  });
  assertValidPdf(doc);
  assert.ok(doc.getNumberOfPages() >= 4, "cover + content overflow + contact");
});

test("report file names are sanitized", () => {
  assert.equal(
    generic.genericReportFileName({ calculatorName: "Commercial Cap Rate Calculator", userName: "Ann / O'Neil: test" }),
    "kraft-mortgages-commercial-cap-rate-calculator-ann-o-neil-test.pdf"
  );
  assert.equal(avsb.avsBReportFileName("名字"), "kraft-mortgages-report-self-employed-a-vs-b.pdf");
});

const results = {
  aMonthly: 2908.02, bMonthly: 3230.11, aInterest: 116000, bInterest: 140000,
  aTotalCost: 146000, bTotalCost: 145000, bFeeAmount: 5000, additionalTax: 30000,
  netSavings: 0, bWins: false, investmentTaxSavings: 56000, monthlyDiff: 322.09,
};
const inputs = {
  mortgageAmount: 500000, propertyValue: 800000, aRate: 5, bRate: 6.5, term: 5, amortization: 25,
  province: "BC", additionalIncome: 30000, effectiveTaxRate: 40, isInvestment: true, bFee: 1,
};

test("A-vs-B totals: optional aNetCost/bNetCost/taxYears are used when present (BUG-045)", () => {
  const withNet = avsb.avsBTotals({ ...results, aNetCost: 146000 - 46400, bNetCost: 145000 - 56000, taxYears: 2 }, inputs);
  assert.deepEqual(withNet, { aTotal: 99600, bTotal: 89000, aDeduction: 46400, bDeduction: 56000, taxYears: 2 });
});

test("A-vs-B totals: legacy callers (no optional fields) keep the old behaviour", () => {
  const legacy = avsb.avsBTotals(results, inputs);
  assert.deepEqual(legacy, { aTotal: 146000, bTotal: 89000, aDeduction: 0, bDeduction: 56000, taxYears: 5 });
  const notInvestment = avsb.avsBTotals(results, { ...inputs, isInvestment: false });
  assert.equal(notInvestment.bTotal, 145000);
});

test("A-vs-B report builds a valid 4-page PDF", () => {
  const doc = avsb.buildCalculatorReport({
    userName: "Test User",
    results: { ...results, aNetCost: 99600, bNetCost: 89000, taxYears: 2, netSavings: 10600, bWins: true },
    inputs,
  });
  assertValidPdf(doc, 4);
});
