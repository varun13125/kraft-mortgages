# Round 2: specialty calculators, reports, PdfLeadModal, tests

Agent: calc-specialty (round 2) · Date: 2026-10-13/14 · Branch: `audit/2026-10-fixes` (uncommitted)
Scratch scripts: `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Documents-App-development-Kraft-Mortgages-Website\c08b2a6e-6cf7-4718-a778-3f74b27e3374\scratchpad\round2-specialty\`
(`before-after.mjs` = numeric before/after below; `gen-pdfs.mjs` = sample PDFs in `pdfs/`; `patch_*.py` = the edits).

**Verification (end of session)**
- `cd apps/web && node --test tests/specialty/` → **35/35 pass** (also `node --test tests/specialty/*.test.mjs`). A deliberately failing copy exits 1.
- `./node_modules/.bin/tsc --noEmit --incremental false -p .` → **0 errors** (whole project, run after my last edit).
- `next lint --file …` on all 30 files I touched → **0 warnings, 0 errors**.
- All touched files were LF and are still LF (checked for `\r`).
- Sample PDFs from every generator are valid under jsPDF 4.2.1 (task 5).
- Not run in a browser (no `next dev` per rules). The new UI (PDF buttons, consent boxes, rate notes) needs the visual QA pass.

---

## Task 1: FEAT-007 / BUG-019, live-rate defaults

**Shared helpers (new, `components/calculators/`)**
- `liveRateDefaults.ts`
  - Selectors `liveConventional5yr`, `liveInsured5yr`, `liveHeloc`, `livePrivateSecond`, `livePrime` and `ratesAsOf` ("Oct 13, 2026", Pacific time).
  - Each selector returns `undefined` until `/api/rates` has answered. That way a page keeps its **static fallback** when the feed is down, instead of silently using `useLiveRates()`' built-in snapshot numbers.
  - `useLiveDefault(fallback, live)` gives `{value, set, reset, touched, isLive}`. The value is seeded from the live rate only while the user hasn't edited it (the `touched` guard).
- `LiveRateNote.tsx`: a one-line note under a rate input. It reads "Pre-filled from today's lowest X: 4.39% (as of Oct 13, 2026). All rates", or "Your rate … Use live rate" once edited, or "Example rate — live rates unavailable".
- The selectors use `useLiveRates()`' return shape unchanged (the frontend agent's dedupe is compatible).

**Live feed data problem found (see New findings N1).** On 2026-10-13 the production feed (`blog.kraftmortgages.ca/current_rates.json`) lists `private_second.lowest_rate = 4.95` ("MCAP / RMG Mortgages, Prime + 0.50%"). Those are A-lender products. `livePrivateSecond` therefore ignores rows below prime + 2% and takes the lowest plausible offer: 7.99% (Sequence Capital) today, and 7.99% in the local file.

| Page | Change | Before → after (defaults) |
|---|---|---|
| `private-lending/calculators/alternative-income/page.tsx` | New **"Starting Private Rate (%)"** input, seeded from `livePrivateSecond` with a touched guard; static fallback 8.50%. The existing credit/LTV/documentation adjustments and the 7.5% floor are kept. Also: NaN guard on down-payment %, PDF report (task 7). | Base 8.50 → 7.99 (live). Rate **9.25% → 8.74%**. IO payment **$5,241.67 → $4,952.67/mo**. Effective first-year cost 12.25% → 11.74%. GDS 30.5% → 28.9%. TDS 39.3% → 37.6%. *(Without the plausibility guard the 4.95% row would have produced 7.50% (floor), $4,250/mo.)* |
| `construction/calculators/builder-program/page.tsx` | Program rates are now **prime + an illustrative spread** (2.30 / 2.80 / 4.05 / 2.55) using the live prime (fallback 4.45). Card shows "Prime + x%". Disclaimer states which prime was used and its date. Also: NaN guards for $0 cost, "Loan-to-Value" relabelled **Loan-to-Cost**, dead `monthlyRate` removed. | At today's prime 4.45: unchanged (6.75 / 7.25 / 8.50 / 7.00%). If prime moves to 4.20: 6.50 / 7.00 / 8.25 / 6.75%, and Prime Builder interest on $600k, 12 mo (50% avg) goes $20,250 → $19,500. |
| `commercial/calculators/cash-flow`, `commercial/calculators/refinance` | **My call: keep static defaults, labelled "Example rate".** The feed has no commercial benchmark. Commercial loans price off GoC yields (fixed) or prime (floating) plus a deal-specific spread. A fixed spread over the *residential* conventional 5-yr would look precise but has no source. Labels now say pricing is quoted per deal and ask for the user's quoted rate. | No numeric change (6.25% / 4.79%). |
| `equity-lending/calculators/heloc/page.tsx` | Already live (prime + credit spread). **Verified.** Added a provenance line: "Prime 4.45% as of Oct 13, 2026 + 0.75% est. credit spread" (or "example — live rates unavailable"). | No numeric change. |
| `equity-lending/calculators/home-equity/page.tsx` | **Bug:** it priced off `best5YrFixed`, which is the *insured* rate. Refinances can't be insured. Now uses `liveConventional5yr` (fallback 4.39) plus the same credit spreads. The rate tile shows the basis and the as-of date. Footnote corrected. | Live feed (insured 4.29 / conventional 4.39), defaults: rate **4.59% → 4.69%** (qualifying 6.59 → 6.69%). Income limit $273,786 → $267,760. Available to borrow unchanged at $240,000 (LTV room binds). Payment on new money $1,340.37 → $1,353.80. |
| `equity-lending/calculators/debt-consolidation/page.tsx` | Same insured → conventional fix and provenance line. | Rate **4.89% → 4.99%**. Monthly savings $2,710.94 → $2,706.12. Interest if consolidated $61,717 → $63,164 (plus $3,000 costs) vs $18,944 if kept. Lifetime −$45,773 → −$47,220 (verdict unchanged: not a good candidate on total cost). |
| `residential/calculators/stress-test/page.tsx` | Contract rate seeded from the live **conventional** 5-yr with a touched guard (fallback 5.35). I chose conventional because the page doesn't know whether the mortgage is insured, and a higher rate is the conservative choice for a qualification test. Plus a `LiveRateNote`. Condo fees counted at **50%** in GDS (was 100%; the page has no condo input, so 0 by default). | $650k / $120k / $6k debts: qualifying **7.35% → 6.39%**, P&I $4,694.02 → $4,310.60, GDS 50.4% → 46.6%, TDS 55.4% → 51.6% (still fails). Condo example $400/mo: $400 → $200 counted. |

**Landing pages (marketing rates)**
All four are client components, so the server HTML now shows non-numeric copy and the numbers appear only after the feed answers. No stale numbers end up in the SEO HTML.

| Page | Before | After |
|---|---|---|
| `equity-lending/page.tsx` | "Starting from Prime + 0.50%", cards "Starting from 4.99%", "4.99% – 7.95%", "5.25% – 7.95%", "5.50% – 7.95%", table "4.99% – 7.95%" vs "8% – 15%+" | Hero: "HELOCs from 4.85% • Refinances from 4.39%" plus "Lowest advertised rates as of {date}…", with a link to `/rates`. Cards: "From {HELOC}%" / "From {conventional 5-yr}%". Table: "From 4.39%" vs "From 7.99% + fees". Before the feed answers: "See today's rates" / "Institutional rates". |
| `commercial/page.tsx` | "From Prime + 1.25%", cards "Prime + 1.50%+", "Prime + 1.25%+" | "Rates quoted per deal" plus "Floating commercial loans are priced at prime plus a deal-specific spread. Prime today: 4.45% (as of {date})" and a link to `/rates`. Cards: "Priced per deal". |
| `private-lending/page.tsx` | Hero "8-15%+ rates", cards "8%–12%", "9%–15%", "10%–14%", "8%–13%", spectrum "3.5%–6.5%", "Prime + 0.50–2.00%", "8%–15%+" | Hero: "Private rates from 7.99% + lender fees" plus "as of" line. Cards: "Priced per deal". Spectrum: "From {insured 5-yr}%", "HELOC from {heloc}%", "From {private}% + fees", with a date footnote and a link to `/rates`. **The "95%+ approval" claims were left untouched** (BUG-014, owner decision). |
| `construction/page.tsx` (same bug class, also in my area) | "Starting from Prime + 1.00%" | "Priced at prime + a project-specific spread" plus "Prime today: 4.45% (as of {date})" and a link to `/rates`. Card: "Prime + spread". |

## Task 2: BUG-020, stress-test links
- `residential/page.tsx`: the calculator card now links to **`/calculators/stress-test`**.
- No other file I own linked to `/residential/calculators/stress-test`.
- The residential stress-test page file was left in place, as instructed.
- **needs-owner (orchestrator):** `next.config.mjs:124` still has `destination: '/residential/calculators/stress-test'`. `lib/seo/sitemap.ts` comments and `lib/utils/blog-content.ts:58` are already being handled by other agents.

## Task 3: BUG-025, PdfLeadModal lead loss, plus BUG-005 consent (added by orchestrator)
File: `components/PdfLeadModal.tsx`

**Lead submission (BUG-025)**
- `sendLead()` never throws. It returns success **only on 2xx**. Non-2xx (400/429/500/502), a network error, or a 20 s timeout all count as failure.
- **The PDF is still downloaded** after a failure.
- The done screen shows an inline alert: "We couldn't send your details to our team. To talk to an advisor, call us at **604-593-1550** (`BUSINESS.telephoneDisplay`) or WhatsApp **+1 (604) 359-5993**". It offers **one** "Try sending again" button plus a Call button. After the retry is used, the button disappears.
- A success message ("We've received your details…") is shown **only** when the POST succeeded.
- **Also fixed**
  - The done screen used to say "Your report has been sent to your email!". That was false: nothing emails reports (FEAT-015). It now says "Your PDF has been downloaded".
  - A PDF-generation error used to leave the modal spinning forever, because the error message only rendered on the form step. It now shows "We couldn't create your PDF" with a retry. The lead is never re-sent (`leadSentRef`).
  - The modal is now scrollable (`max-h-[90vh] overflow-y-auto`), has dialog ARIA, and the inputs have `autoComplete`.

**Consent (BUG-005 work)**
- Two **optional, unticked** native checkboxes, labelled exactly `CONSENT_TEXT.call` and `CONSENT_TEXT.marketing`. Each has its own `<label htmlFor>` with ids from `useId()`. They are keyboard operable (Space) and have a visible focus ring.
- `CONSENT_TEXT.notice` is shown in `text-gray-400` with a **Privacy Policy** link to `/privacy`. It replaces the old "We'll only use it to send your report…" line.
- The POST body spreads `...consentFields(callChecked, marketingChecked)` (adds `consentToContact`, `consentToCall`, `consentToMarketing`, `consentVersion`).
- **No call is promised.** The success copy only says "Our AI assistant is calling you now" when the box was ticked **and** the server responded `callDispatched: true`. Otherwise it says "A Kraft Mortgages advisor will follow up with you."
- This applies to all ~26 residential calculator pages and the new specialty/MLI report buttons, because they share this component.

## Task 4: BUG-045, A-vs-B report and generic report labels
**`components/calculator-report/generateAvsBReport.ts`**
- `Results` is now the exported `AvsBReportResults`, with optional **`aNetCost`, `bNetCost`, `taxYears`**. It is backward compatible.
- A new pure helper, `avsBTotals()`, decides what the report shows:
  - A total = `aNetCost ?? aTotalCost`. This now includes A's investment deduction.
  - B total = `bNetCost ??` the old netting.
  - The investment-deduction row shows **both** sides (it used to show "N/A" for A).
  - The extra-tax row reads "Extra Tax on Declared Income ({taxYears} yrs)". The inputs box adds "Years of Extra Income Taxed".
- Example ($500k, investment, 40% tax, 2 years of declared income):

  | Totals | A | B | Extra-tax label |
  |---|---|---|---|
  | Before (legacy call shape) | $146,000 | $89,000 | "Extra Tax on Declared Income" |
  | After (new fields passed) | $99,600 | $89,000 | "(2 yrs)" |

  The A deduction of −$46,400 now appears. The legacy call shape still produces the old totals (tested).
- **Orchestrator wiring.** In `calculators/self-employed-a-vs-b/page.tsx`, replace `results: { ...results, aTotalCost: results.aNetCost }` with `results: { ...results, taxYears: effectiveTaxYears }`. `results` already carries `aNetCost`/`bNetCost`. The current page call still renders correct totals until then.
- Also in this file:
  - `buildCalculatorReport()` (build only) and `generateCalculatorReport()` (build + save) are now separate.
  - The filename is sanitized: `/`, `:` and non-Latin characters used to pass straight into the download name.
  - The B-lender checklist line "No GDS/TDS limits" was wrong; it now reads "Higher GDS/TDS limits (often up to ~50%)".

**`components/calculator-report/generateGenericReport.ts`**
- **Label wrapping.** Each row measures its value with `getTextWidth`. Values wider than 45% of the row wrap, right-aligned. The label wraps with `splitTextToSize` into the remaining width, and the row height grows to fit. Section and page breaks use the real heights. Verified visually: a 130-character label wraps to two lines beside "$1,234,567" with no overlap.
- **New `pdfSafe()`, and the bug it fixes for every report.** jsPDF's built-in Helvetica only covers WinAnsi. A single character such as `≤`, `≥`, `−` or `→` makes jsPDF re-encode the **whole string** as 2-byte, which prints as spaced-out garbage.
  - This was live: `/calculators/affordability` passes "GDS ≤ 39% and TDS ≤ 44%" in its educational text, so that paragraph line was garbled.
  - All text now goes through `pdfSafe`. It maps ≤ to <=, ≥ to >=, − to -, → to ->, ≈ to ~, and drops emoji/CJK/Gurmukhi, which the core fonts can't draw. WinAnsi characters such as — • " " … and é are kept.
- Also in this file:
  - Long cover titles shrink to fit (22 down to 14 pt minimum), and a leading "Your" is dropped because the line above already reads "Your Personalized".
  - `buildGenericReport()` and `genericReportFileName()` are exported; `generateGenericReport()` keeps its old signature.

## Task 5: jsPDF 3.0.1 → 4.2.1 migration check
**Release notes (github.com/parallax/jsPDF/releases)**
- **v4.0.0**: the only breaking change is *file-system access in the Node build is restricted by default* (path-traversal fix; re-enable with `jsPDF.allowFsRead` or Node `--permission`).
- v4.1.0, v4.2.0, v4.2.1: security fixes (AcroForm JS execution, XMP/addJS injection, BMP/GIF DoS, HTML injection in output methods, free-text annotation colour). None are breaking.
- v3.0.4: "pages no longer added dynamically unless `autoPaging`" (affects `html()` only).

**Our usage.** We use `text`, `rect`, `roundedRect`, `circle`, `line`, `splitTextToSize`, `getTextWidth`, `setPage`, `save`, and `output('blob'|'arraybuffer')`. `addImage` is used only in the dead `generateFromHTML`. We don't use `html()`, `loadFile`, `addFont`, AcroForm or `addJS`. **Nothing in the app is affected by the breaking changes.** `html2canvas` (1.4.1) is only used by the dead `lib/reports/pdf-generator.ts` `generateFromHTML`.

**What I changed.** `import jsPDF from "jspdf"` is now `import { jsPDF } from "jspdf"` in the 3 generator files.
- Under webpack the default import works, but under plain Node ESM it resolves to the CJS module object and fails with "jsPDF is not a constructor".
- The named export is jsPDF's documented import and works in both builds.
- `lib/reports/pdf-generator.ts` also got `import type { ReportData }` (the old import was a value import of an interface from a `.tsx` file).

**Sample PDFs generated in Node** (`gen-pdfs.mjs`, output in `round2-specialty\pdfs\`):

| PDF | Bytes | Pages |
|---|---|---|
| `generic-report.pdf` | 43,749 | 4 |
| `avsb-report.pdf` | 43,126 | 4 |
| `legacy-affordability` / `-payment` / `-mli` / `-investment.pdf` | ~4.2 KB each | — |

All have a `%PDF-` header, a `%%EOF` trailer, and a page-object count equal to `getNumberOfPages()`. I rendered pages with PyMuPDF and inspected them: layout is correct, em dashes and bullets render, and labels wrap. `tests/specialty/reports.test.mjs` repeats the build checks on every run.

## Task 6: FEAT-006 tests (my part)
New folder `apps/web/tests/specialty/`. It uses only Node built-ins (`node:test`, `node:assert`) and adds **no dependencies**.

**Files**
- `mli-calcs.test.mjs` (15 tests):
  - pmt 2,908.02, zero-rate and zero-amortization guards, schedule payoff
  - tiers and the 100-point cap; amortByTier 40/45/50
  - `leverageFor` new/existing per tier
  - energy points on the NECB (new) vs existing scale, including the old regression
  - affordability 10-year minimum and +30 bonus; accessibility levels
  - premium grid and amortization surcharge/discount; **CMLS example 6.75%**; premium page default 7.40% → 5.18% = $777,000
  - **`dscrMaxLoan` round trip, DCR exactly 1.10**, against an independent present-value formula at 50/70/100 points
  - break-even rent with vacancy; rent cap
- `ai-tool-math.test.mjs` (11 tests):
  - `calculatePayment` = **$2,908.02**
  - affordability against independent PV at 6.39%; **5.25% floor** (a 2.5% contract qualifies at 5.25%)
  - minimum-down cap of $750k and premium-inclusive price
  - default penalty = max(3-month, IRD) = $11,520
  - **refinance break-even parity, AI tool vs the commercial refinance page helper**, across 3 cases (savings, break-even and 5-year savings identical)
  - page defaults $2,657.72 → $2,278.83, 37 months
  - cap rate / NOI zero guards
  - MortgageTools payment and bi-weekly; GDS/TDS binding and 50% condo
  - construction total = `interestOnlyCost` = $28,275, average over 12 months
- `reports.test.mjs` (6 tests): `pdfSafe`, generic multi-page PDF, filename sanitizing, the A-vs-B optional fields and legacy shape, A-vs-B 4-page PDF.
- `live-rates.test.mjs` (4 tests): selectors stay undefined before the feed answers; conventional vs insured; private-rate plausibility guard; `ratesAsOf`.

**How the `@/` alias is handled without a loader package**
- `helpers/register-ts-paths.mjs` (~70 lines) registers an in-process **synchronous resolve hook** (`node:module.registerHooks`, built in, no flags).
- It maps `@/x` to `apps/web/x.ts` and extensionless relative imports in `.ts` files to `.ts`. Node's native type stripping runs the TypeScript.
- Test files import modules **dynamically** after the hook is registered.

**Other test plumbing**
- `tests/specialty/index.js` makes `node --test tests/specialty/` work. Node 24 treats a directory argument as a module path, and this file loads every `*.test.mjs`.
- To make the AI tools importable, `lib/ai/tools/calculator-tools.ts:6` is now `import type { MortgageTool }`. This is type-only with zero runtime change. It sits outside the "math" lines of the AI agent's file, so the AI agent should know.
- The page's refinance math was moved into `commercial/calculators/refinance/refinanceMath.ts` so the test exercises the real page code. The numbers are unchanged (the test asserts the defaults).

**Requirements.** Node ≥ 22.15 (`registerHooks`) and ≥ 22.18 / 23.6 (type stripping on by default). CI's `node-version: 22` resolves to the latest 22.x, which is fine. **needs-owner (orchestrator/platform):** add `cd apps/web && node --test tests/specialty/` to CI.

## Task 7: FEAT-018 (started), PDF report + lead capture
New `components/calculator-report/CalculatorPdfButton.tsx` packages the residential pattern:
- the same gold "Download Your Free Report (PDF)" button and `PdfLeadModal`
- `generateGenericReport` loaded on demand
- `getSections()` evaluated at download time, so the PDF reflects the current inputs

`reportFormat.ts` provides the `money`, `pct` and `num` formatters, which print N/A for non-finite values.

Added to:

| Area | Calculators |
|---|---|
| Commercial | **cap-rate, noi-analysis, cash-flow, refinance** |
| MLI Select | **points, max-loan, dscr, premium, scenario-compare** |
| Private (extra, same pattern) | **alternative-income** |

Each report has an Inputs and a Results section, highlighted key rows, and educational text. The MLI text carries the CMHC criteria and grid date. CRM `source` tags are `calculator-pdf-commercial-*`, `calculator-pdf-mli-*` and `calculator-pdf-private-alternative-income`; `mortgageType` is "Commercial", "Commercial Refinance", "MLI Select (Multi-Unit)" or "Private / Alternative". The points page's old "Print / PDF" button (`window.print`) is renamed "Print" to avoid two PDF buttons.

**Not done (rest of FEAT-018):** construction calculators, equity (HELOC, home-equity, debt-consolidation), MLI amortization, break-even and rent-cap. Each is a one-component drop-in now.

## Task 8: other fixes made while in these files
- **`mli-select/calculators/scenario-compare`**: new scenario ids were `length + 1`, so after a removal they collided. Example: remove "1" from ["1","2"], then add, and the new card is also "2". That gave duplicate React keys, and an edit or remove hit two cards. Ids are now a monotonic counter.
- **`mli-select/calculators/max-loan`**: the leverage bar said "Loan-to-Value" and "% of project value" for new construction. It now shows **Loan-to-Cost / project cost** for new construction and LTV / property value for existing properties.
- **`mli-select/calculators/dscr`**: added an estimates/example-rate disclaimer (there was none), including the 1.10 / 1.20 / 1.40 DCR by shelter type and the leverage cap.
- **`mli-select/calculators/points`**: the quick illustration now says "example rate; semi-annual compounding".
- **`commercial/calculators/cap-rate`**:
  - A cap rate of 3–4% or 8–10% used to show a **green** box with a warning icon; it now shows a neutral box and icon.
  - "Value Gap" used to say "overvalued" when the value exactly matched the target; it now says "(at target)".
- **`commercial/calculators/refinance`**: legal, appraisal and discharge fees were fixed state with no inputs (open issue from round 1). They now have inputs.

---

## New findings (please assign IDs)
- **N1 (high): the live rate feed mislabels A-lender products as "Private 2nd" and has broken dates.** On 2026-10-13 `blog.kraftmortgages.ca/current_rates.json` has `private_second.lowest_rate: 4.95` (MCAP / RMG, "Prime +0.50%"). `useLiveRates().bestPrivateSecond` passes this straight through to:
  - `/calculators/refinance-vs-heloc-vs-second` (`secondRate = bestPrivateSecond`), which prices a private 2nd at 4.95%, *cheaper than the 4.85% HELOC + fees*
  - `/calculators/payment`
  - `/qualify`
  - `components/rates/RatesTicker` ("From 4.95%") and `TodaysRates`

  Also, `effective_date` values are Excel serial numbers ("46301"). The local `data/current_rates.json` shows 7.99%, so dev and prod differ.
  - My pages are guarded (`livePrivateSecond`).
  - **needs-owner:** owner/data pipeline to fix the generator (BUG-028 family). Backend should add plausibility checks in `lib/rates.ts` `normalizeBenchmark` (private rows below prime + 2%; convert Excel serial dates). Alternatively, frontend can reuse `livePrivateSecond` in `useLiveRates`.
- **N2 (medium, fixed centrally):** non-WinAnsi characters garbled whole lines in every generic PDF report (see task 4). Other agents' pages benefit automatically; nothing for them to do.
- **N3 (medium, needs-decision BUG-014/036):** both PDF covers say "23 Years Experience · $2 Billion+ Funded" and cite BCFSA only. `lib/seo/business-config.ts` says "18+ Years Combined Experience" and lists RECA/FSRA licences, but BUG-036 says those licence numbers need confirming. I did not change business facts.
- **N4 (low):** `components/calculators/MortgageCalculator.tsx` (unused, BUG-047) shows `bestPrivateSecond` without a guard. It's dead code, so I left it.

## needs-owner
| Item | Owner |
|---|---|
| N1 feed data + `lib/rates.ts` validation; `/calculators/refinance-vs-heloc-vs-second` uses `bestPrivateSecond` for math | owner (data), backend, calc-res-b |
| `next.config.mjs:124` still redirects to `/residential/calculators/stress-test` (BUG-020) | orchestrator |
| Wire `taxYears` into the A-vs-B page call (one-line change above) | orchestrator / calc-res-b |
| Add `node --test tests/specialty/` to CI (`.github/workflows/ci.yml`) | orchestrator / platform |
| `lib/ai/tools/calculator-tools.ts:6` is now `import type` (FYI, no behaviour change) | ai-voice |
| Consent wording is a draft pending legal review (`lib/compliance/consent.ts`) | owner (BUG-005) |
| DEVLOG `FINDINGS.md` / `FEATURES.md` / `STATUS.md` / `SESSIONS.md` not edited by me, to avoid conflicts with the 4 parallel agents | orchestrator |

Suggested statuses:
- **BUG-019:** fixed for the specialty area (residential pages remain with calc-res-a/b).
- **BUG-025:** fixed for PdfLeadModal (LeadModal and `/qualify` belong to others).
- **BUG-045:** fixed in the generator; page wiring pending.
- **FEAT-006:** specialty part done.
- **FEAT-007:** specialty part done.
- **FEAT-018:** in progress (10 of ~20 pages).
- **BUG-005:** PdfLeadModal part done.

## Notes for next agent
- **Live defaults:** use `useLiveDefault(fallback, liveSelector(data))` plus `<LiveRateNote/>` from `components/calculators/`.
  - Never seed refinances from `best5YrFixed`; it is the **insured** rate. Use `liveConventional5yr`.
  - Selectors are `undefined` until the feed answers, which is deliberate.
- **PDF capture on a new calculator:** `<CalculatorPdfButton source title calculatorName mortgageType amount getSections educationalContent />`. Wrap any user-visible PDF text you build yourself with `pdfSafe`.
- **Testing a report in Node:** use `buildGenericReport` / `buildCalculatorReport`, which return the jsPDF doc without downloading.
- **Tests:** `node --test tests/specialty/`. To add a suite, drop a `*.test.mjs` in that folder. `import { importApp } from "./helpers/register-ts-paths.mjs"`, then `await importApp("lib/...ts")`; dynamic import is required. Any `.ts` module imported this way must use `import type` for type-only imports, because Node's type stripping doesn't elide value imports of interfaces.
- **Commercial rates are intentionally "example" defaults.** If the owner wants a commercial benchmark, add it to the rate feed and seed with `useLiveDefault`.
- **Files touched:**
  - **Calculator pages:**
    - `app/(site)/commercial/{page,calculators/cap-rate/page,calculators/cash-flow/page,calculators/noi-analysis/page,calculators/refinance/page}.tsx`, `commercial/calculators/refinance/refinanceMath.ts` (new)
    - `app/(site)/construction/{page,calculators/builder-program/page}.tsx`
    - `app/(site)/equity-lending/{page,calculators/heloc/page,calculators/home-equity/page,calculators/debt-consolidation/page}.tsx`
    - `app/(site)/private-lending/{page,calculators/alternative-income/page}.tsx`
    - `app/(site)/residential/{page,calculators/stress-test/page}.tsx`
    - `app/(site)/mli-select/calculators/{points,max-loan,dscr,premium,scenario-compare}/page.tsx`
  - **Components:**
    - `components/PdfLeadModal.tsx`
    - `components/calculator-report/{generateGenericReport,generateAvsBReport}.ts`, `{CalculatorPdfButton.tsx,reportFormat.ts}` (new)
    - `components/calculators/{liveRateDefaults.ts,LiveRateNote.tsx}` (new)
  - **Libraries:** `lib/reports/pdf-generator.ts`, `lib/ai/tools/calculator-tools.ts` (import type only)
  - **Tests (new):** `tests/specialty/{index.js,mli-calcs.test.mjs,ai-tool-math.test.mjs,reports.test.mjs,live-rates.test.mjs,helpers/register-ts-paths.mjs,helpers/assert-close.mjs}`
