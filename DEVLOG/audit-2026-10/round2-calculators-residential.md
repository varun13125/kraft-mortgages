# Round 2: Residential Calculators (live-rate defaults, stress test, small gaps, rule verification, tests)

- **Date:** 2026-10-13/14
- **Agent:** round-2 calculators-residential (one of 5 parallel agents)
- **Scope (owned):** `apps/web/app/(site)/calculators/**`, `lib/calc/{payment,affordability,cmhc,landTransferTax,investment,selfEmployed,construction}.ts`, `components/ui/ValidatedInput.tsx`, `lib/validators.ts`, `lib/utils/validation.ts`, new `tests/calc/**`
- **Items:** FEAT-007 / BUG-019 · BUG-020 (my part) · BUG-053 · BUG-044 · FEAT-006 (my part) · extra fixes
- **Status:** all done, uncommitted. DEVLOG `FINDINGS`/`FEATURES`/`STATUS`/`SESSIONS` were **not** edited (5 agents in parallel); the orchestrator should fold this report in.

## Verification (final run)

| Check | Result |
| --- | --- |
| `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` | **0 errors** (full project) |
| `./node_modules/.bin/next lint --dir "app/(site)/calculators" --dir lib/calc --dir components/ui` | **0 errors, 0 warnings** (the FTHB `exhaustive-deps` warning from BUG-052 is gone) |
| `node --test "tests/calc/**/*.test.mjs"` | **55/55 pass** (8 files) |
| Line endings | Calculator pages stay CRLF; `lib/calc/*.ts` stay LF; layouts kept their existing ending. All edits went through a CRLF-preserving helper (`scratchpad/r2/ed.py`) that refuses to write unless every snippet matches exactly once. |

> **Test command gotcha:** `node --test tests/calc/` (a bare directory) **fails on Node 24** with `Cannot find module …\tests\calc`. Use a quoted glob: `node --test "tests/calc/**/*.test.mjs"` (or `"tests/**/*.test.mjs"` to include the specialty suite). See needs-owner N3.

---

## 1. FEAT-007 / BUG-019: live-rate defaults

### New shared helper (in my folder, Next.js private `_lib` so it isn't routed)

- `app/(site)/calculators/_lib/liveRateDefaults.ts`
  - `liveRate(data, product)`: today's `lowest_rate` for a product from the `/api/rates` payload, or `undefined` (no data, `success:false`, or an implausible value outside 0.25–25%). Products: `fixed5Insured` (= `best5YrFixed`), `fixed5Insurable`, `fixed5Conventional`, `fixed3Insured/Conventional`, `variable5Insured/Conventional`, `prime`, `heloc`, `altHeloc`, `alt1/2/3/5Fixed`, `altBfs`, `privateSecond`. Alternative products are read from `raw_benchmarks.alt_*`.
  - `purchaseRateProduct(downPct, price, amortYears)`: < 20% down → insured; 20%+ down, < $1.5M and ≤ 25 yrs → insurable; otherwise conventional.
  - `useLiveDefault(fallback, live)`: returns `[value, setValue, source]`. Starts at the static fallback (no hydration mismatch; works if `/api/rates` fails), switches to the live value when it arrives, and stops following it the moment the visitor edits the field (`touched` ref). `source` = `fallback | live | user`.
  - `liveMedianRate`, `liveBenchmark` (lowest / median / typical fee / lender count from `raw_benchmarks`), `ratesAsOf` ("Oct 13, 2026", Vancouver time).
- `app/(site)/calculators/_lib/LiveRateNote.tsx`: one-line note under a rate input: "Default: today's lowest conventional (uninsured) 5-year fixed rate from our live rate feed (as of Oct 13, 2026). Use the rate you were actually offered, or see today's rates" (link to `/rates`). Says "Illustrative default rate" until the feed loads, and drops the claim once the user edits.
- Uses only the existing `useLiveRates()` return shape (`data`, `best5YrFixed`), so the frontend agent's request-dedupe change is compatible.

### Per calculator (before → after)

"Snapshot" = the feed currently in `apps/web/data/current_rates.json` (synced 2026-10-13): insured 4.29, insurable 4.44, conventional 4.39, insured median 4.89, conventional median 5.20, alt 5-yr 5.04, alt HELOC 5.74, private 2nd 7.99, prime 4.45. Production serves the remote feed first, so live numbers may differ slightly.

| Calculator | Field | Before | Benchmark now | Effect with defaults (static → snapshot) |
| --- | --- | --- | --- | --- |
| refinance-cashout | new rate | 5.19 | conventional 5-yr (refi is uninsured) | 5.19 → 4.39: new payment on $720k $4,265.77 → $3,941.09; cash-out payment increase $2,606.86 → $2,408.45 |
| port-vs-break | new rate (if breaking) | 5.19 | conventional 5-yr | see blend row |
| port-vs-break | blended rate | 4.25 | **default = weighted average** of current and new rate until edited | (5.19, 4.25) → (4.39, 3.58): port 5-yr cost $149,145 → $125,523; break $160,593 → $135,637; verdict unchanged ("porting cheaper" by $11,449 → $10,114) |
| refinance-break-even | new rate | 4.49 | conventional 5-yr | 4.49 → 4.39: saves $342.56 → $366.29/mo; break-even 30 → 28 months; net 5-yr $19,668 → $21,772 |
| mortgage-penalty | new rate (break-even) | 4.39 | conventional 5-yr | snapshot value is also 4.39 → no change today; posted rate (4.49) stays illustrative (lender-specific, not in the feed) |
| rate-comparison | rates 1–4 | 4.79 / 4.99 / 5.29 / 5.49 | lowest insured / **median** insured / lowest conventional / **median** conventional 5-yr | $500k payments $2,848.54 / $2,905.18 / $2,991.12 / $3,049.05 → $2,709.29 / $2,876.79 / $2,736.87 / $2,965.21. A note explains each default. |
| investment | rate | 5.45 | conventional 5-yr (rental = uninsured; note says rental pricing is often slightly higher) | 5.45 → 4.39: payment $3,644.90 → $3,284.25; cash flow −$770.90 → −$410.25/mo; DSCR 0.79 → 0.88; cash-on-cash −4.30% → −2.29% |
| construction-pro | rate | 7.25 | **prime + 2.80%** (spread chosen so today's default is unchanged; now moves with prime) | 7.25 → 7.25 today; interest on default draws stays $38,968.75 |
| reverse-mortgage | rate | 7.74 | none (no benchmark; HomeEquity Bank rate page returned 403) | unchanged; labelled "Illustrative rate…ask us for a quote" (was "CHIP typical rate") |
| self-employed-a-vs-b | A / B rate | 4.99 / 5.49 | conventional 5-yr / alt 5-yr | B-lender net advantage $97,835 → $94,280 (A interest $116,779 → $102,391; B $128,814 → $117,980) |
| a-vs-equity | A rate | 4.49 | conventional 5-yr | equity cheaper by $26,526 → $25,358 |
| a-vs-equity | equity rate | 6.95 | 1st position: illustrative 6.95 (no private-first benchmark); 2nd position: live private 2nd | 2nd position: 6.95 → 7.99 |
| b-vs-equity | B rate | 5.49 | alt fixed for the chosen term (1/2/3/5-yr) | term 5: 5.49 → 5.04; equity costs $35,321 → $46,154 more over 5 yrs |
| b-vs-equity | equity rate | 6.95 | same rule as a-vs-equity | — |
| refi-vs-HELOC-vs-2nd | B-lender HELOC | 8.49 | alt HELOC (fallback 8.49) | B-lender first: HELOC 5-yr cost $176,845 → $156,220; interest $1,061.25 → $717.50/mo |
| refi-vs-HELOC-vs-2nd | equity refi | 6.95 | stays illustrative (no benchmark); disclosed | — |
| stress-test | contract rate | 4.79 | purchase product (20% down, 25 yrs → insurable) | 4.79 → 4.44: stress rate 6.79 → 6.44; payment $3,849.99 → $3,730.67; income needed $130,769 → $127,097 |
| required-income | rate | 4.79 | purchase product | 4.79 → 4.44: required income $132,923 → $129,251 |
| cmhc-insurance | rate | 4.79 | purchase product (10% down → insured) | 4.79 → 4.29: payment incl. premium $3,700.43 → $3,519.53 |
| debt-service-ratio | rate | 5.00 | purchase product | auto mode: 5.00 → 4.44: qualifying payment $3,922.33 → $3,730.67; GDS 43.72% → 41.81% |
| extra-payments | rate | 5.00 | insured 5-yr (same as amortization) | base payment $2,908.02 → $2,709.29 |
| rent-vs-buy | rate | 5.00 | purchase product | payment on $560k $3,256.99 → $3,080.80 |
| mortgage-qualifier | rate | best5YrFixed (always insured) | purchase product (default 20% down → insurable) | 4.29 → 4.44: max price $674,998 → $667,870 |
| pre-approval | tier base rate | best5YrFixed (always insured) | insured < 20% down; insurable (25 yr) / conventional (30 yr) with 20%+ | default 10% down unchanged |
| amortization | rate | best5YrFixed via an effect that **never recorded user edits** (a value typed before the feed loaded was overwritten) | insured 5-yr via `useLiveDefault` | race fixed |
| affordability, payment, renewal | — | already followed `best5YrFixed` with an edit flag | unchanged (purchase/renewal) | — |

### Stale April-2025 named-lender tables and copy (removed)

- **b-vs-equity:** deleted `bLenderData` (6 lenders) / `equityLenderData` (9 lenders) and the "Rates current as of April 2025" table. It's replaced by **"Today's B-Lender & Private Rate Benchmarks"**: lowest + median + lender count for B-lender 1/2/3/5-yr fixed, stated income, B HELOC and private 2nd, from `raw_benchmarks`, with an "as of {date}" stamp ("Equity-lender 1st mortgage: quote-based"). Also removed the Antrim/LCM/Secure Capital rates from the "Equity Lending Recommendation" box, two FAQs and the 1st-vs-2nd article paragraph, and the "4.89–11%" / "7%–14%" ranges. The hero, JSON-LD and layout description said "real Canadian lender rates"; they now say "live Canadian rate benchmarks".
- **refinance-vs-heloc-vs-second:** "Current Rates by Option" (A 3.74–5.09%, B 5.25–8.14%, Home Trust HELOC 7.49–14.49%, Capital Direct/Antrim seconds, "as of April 2025") is replaced by live lowest/median benchmarks (conventional and B 5-yr, A and B HELOC, prime, private 2nd) with an as-of stamp and a `/rates` link. The "8.95–10.95%+ with equity lenders" article claim now quotes the live private-2nd floor.
- **a-vs-equity:** the "Top Equity Lenders in Canada: Antrim, VWR Capital, First Circle" section (7 named lenders with rates and fees) is replaced by "Choosing an Equity Lender: What Drives the Rate and Fees" (LTV, position, location, fee structure, term and exit). Also removed: the FAQ with Capital Direct/Antrim rates, "Marathon/Neo… currently 3.74%–5.99%" (now the live conventional 5-yr with a date), "Capital Direct 4.89% / Neighbourhood 6.60% / VWR $750–$5,750", and the VWR note in the estimates box.
- Named lenders that remain are mentioned **without figures** (e.g. "Bridgewater Bank, Home Trust, Equitable Bank" as examples of B-lenders; credit-bureau reporting FAQ).

---

## 2. BUG-020: `/calculators/stress-test` as the canonical URL (my part)

- `stress-test/layout.tsx`: canonical was already `https://www.kraftmortgages.ca/calculators/stress-test`. Added `...OG_DEFAULTS` (og:image), "Canada 2025" → "2026" in the titles, and an accurate description: "qualifying rate (contract rate + 2% or 5.25%), the stress-tested payment and the income you need to pass the 39% GDS / 44% TDS limits." (The old one said "Calculate whether you pass", but the page computes income needed.)
- Links: **no file I own links to `/residential/calculators/stress-test`.** The hub and the related-calculator links already use `/calculators/stress-test`; all internal `href`s in `calculators/**` were scripted-checked against existing routes (0 missing). The remaining link is in `app/(site)/residential/page.tsx:64` (not mine, N1).
- The page now also seeds its contract rate live (section 1).

---

## 3. BUG-053: small gaps (all done)

| Item | File | Change | Numbers |
| --- | --- | --- | --- |
| Dead state | `down-payment/page.tsx` | removed unused `downPaymentOverride` | — |
| Unused input + lint warning | `first-time-home-buyer/page.tsx` | `annualIncome` now drives an "estimated max purchase price" hint under the income field: `maxQualifyingLoan` + `maxPurchasePrice` at 39/44, insured 5-yr live rate, 25 yrs, stated assumptions ($300 tax, $150 heat, no debts). The `react-hooks/exhaustive-deps` warning (BUG-052) is gone (`hintRate` added to deps). | $120k income, $55k savings, 4.29% → ~$559,806 (income-limited) |
| Dead import | `mortgage-qualifier/page.tsx` | removed unused `BUSINESS`, `principalFromPayment`, `useEffect` and the local `loanForPrice`/bisection (moved to `lib/calc/affordability.ts`, now tested) | defaults unchanged at the same rate: $670,228.81, GDS 39.00% / TDS 43.00% |
| Amortization selector | `pre-approval/page.tsx` | 25/30-yr buttons; the premium uses `cmhcPremiumRate(down%, amort)` (+0.20% over 25 yrs); notes on 30-yr eligibility (first-time buyers or new builds when < 20% down; conventional pricing with 20%+); PDF and assumptions text show the amortization. Base rate now follows the purchase product. | $85k, $800 debts, 10% down, 720 score: 25 yr → premium 3.10%, max $300,606; 30 yr → 3.30%, max $320,858 |
| Province / PST | `cmhc-insurance/page.tsx` | BC/AB/ON selector; PST line from `premiumPst()` / `premiumPstRate()`, plus a PDF row | $700k, 10% down: ON PST $1,562.40 cash at closing; BC/AB $0 (was a fixed ON-only sentence) |
| Down payment available | `required-income/page.tsx` (Max Mortgage tab) | new **"Down Payment Available ($)"** input (default $140,000) replaces the price and down-% inputs on that tab. Max price is now a bisection (`maxPurchasePrice`, same rule as the qualifier): loan incl. premium ≤ qualifying max **and** the down payment is legal at that price. Says whether income or down-payment rules bind. | $100k income, $400 debts, 4.79%: before $505,455 (gross-up at the Income tab's 20%); after $544,364 with $140k down (income-limited). $30k down → $418,812 (old logic could show prices that needed a larger legal down payment) |
| Manual-mode helper | `debt-service-ratio/page.tsx` | "Work out the qualifying payment" box (balance, contract rate, amortization) shows the payment at max(rate + 2, 5.25) and a **"Use this payment"** button | $500k at 4.44% → 6.44% qualifying → $3,330.95/mo |

---

## 4. BUG-044: rule constants verified against primary sources (2026-10-13)

Research done with WebSearch/WebFetch; every constant now has a dated source comment next to it.

| Constant (file) | Value in code | Verdict | Source | Change |
| --- | --- | --- | --- | --- |
| 0.20% surcharge > 25-yr amortization (`cmhc.ts` `LONG_AMORTIZATION_SURCHARGE`) | +0.20% | **MATCH**. CMHC notice 2024-06-05 ("premium surcharge of 20 basis points", effective 2024-08-01); Sagen ("an additional premium of 0.20% will apply"); Canada Guaranty over-25-yr columns 3.00/3.30/4.20% (03/2026). Applies only above 80% LTV, which is the only case `cmhcPremiumRate` charges. | cmhc-schl.gc.ca/media-newsroom/notices/2024/cmhc-revises-homeowner-mortgage-loan-insurance-premiums · sagen.ca/mortgage-insurance/premium-rates/ · canadaguaranty.ca/portable-advantage/ | comment |
| CMHC premium table | 0.60/1.70/2.40/2.80/3.10/4.00%, 4.50% NTDP | **MATCH** | CMHC "Premium information for homeowner and small rental loans" | comment |
| Sales tax on premium (`PREMIUM_PST_RATES`) | ON 8%, QC 9%, SK 6% | **MATCH today; QC changes**: 9.975% for premiums paid after 2026-12-31 (Revenu Québec 2026-04-09) | ontario.ca RST insurance (2026-09-18); SK PST-73; revenuquebec.ca tax news 2026-04-09 | **added** `premiumPstRate(code, asOf)` and `QC_PREMIUM_TAX_FROM_2027`; `premiumPst(premium, code, asOf?)` is date-aware (QC $10,000 premium: $900 in 2026 → $997.50 from Jan 1, 2027). Backward-compatible. |
| Alberta Land Titles fee rounding (`albertaRegistrationFee`) | $50 + $5 per $5,000 **or portion** (rounds up) | **MATCH**. Land Titles Act s.64.1(2) / s.102.1(2): "$50 plus $5 for each $5000 or portion thereof"; mortgage fee on the principal secured; s.102.1(3) land-value option repealed (2024 c15 s9). Fee schedule effective 2026-10-01. | kings-printer.alberta.ca/documents/Acts/L04.pdf · alberta.ca fee schedule PDF | comment (closes calc-a O12) |
| Toronto MLTT tiers above $3M + rebate | 4.40/5.45/6.50/7.55/8.60% at $3M/$4M/$5M/$10M/$20M; rebate $4,475 | **MATCH** ("take effect on April 1, 2026", 1–2 single-family residences) | toronto.ca MLTT rates & fees (2026-04-07), rebates (2025-12-18) | comment |
| Ontario LTT + refund | 0.5/1/1.5/2/2.5%; $4,000 | **MATCH** | ontario.ca (2026-04-22) | comment |
| BC PTT incl. further 2% > $3M; FTHB $835k/$860k | as coded | **MATCH** (gov table: $852k → $15,040 tax, $2,560 exemption, $12,480 payable; now a test) | gov.bc.ca PTT (2025-12-03), current-amount table | comment |
| BC SVT rates (`bc-speculation-tax` `SVT_RATES`) | 2025 2/0.5; 2026 3/1; 2027 4/1 | **MATCH**; no 2028 rate announced (page updated 2026-07-03). gov.bc.ca now says "untaxed worldwide earner", not "satellite family". | gov.bc.ca SVT tax rates | comment; copy now says "Untaxed worldwide earner (formerly 'satellite family')"; FAQ grammar fixed |
| FTHB GST rebate (`first-time-home-buyer`) | $50k, full to $1M, linear to $1.5M; Royal Assent Mar 12, 2026 | Amounts and phase-out **MATCH**. Copy said agreements "signed from 2025" / "2025–2030": **the law covers agreements on or after Mar 20, 2025 and before 2031** (CRA GST/HST News No. 122). | canada.ca Finance 2025-05-27; CRA news122; LEGISinfo C-4 | copy + dated comment |
| Old GST new-housing rebate | 36%, max $6,300, $350k–$450k phase-out | **MATCH** (RC4028) | canada.ca RC4028 | — |
| 2026 marginal-rate defaults (A-vs-B, A-vs-equity) | BC 38.29 / AB 36.00 / ON 43.41 | **MATCH for 2026** (fed 26% band $117,045–$181,440; BC 12.29% to $140,430; AB 10% to $154,259; ON 11.16% × 1.56 surtax to $150,000). The comments said "2025 brackets, $115K–$137K". | CRA 2026 rates page; gov.bc.ca tax rates (2026-04-17); TaxTips ON (secondary) | comments + help text: "2026 combined marginal rates for about $117K–$140K" |
| Stress test (`stressTestRate`) | max(contract + 2, 5.25) | **MATCH**, still in force (OSFI page modified 2026-01-29); portfolio LTI limits don't replace it; straight-switch exemption since Nov 21, 2024; insured uses the same test | osfi-bsif.gc.ca MQR page | comment |
| Insured rules | $1.5M cap; 5%/10%/20%; 30-yr insured for FTHB + new builds | **MATCH**, current | canada.ca Finance 2024-12-15; FCAC down-payment page (2025-10-15) | comment |

---

## 5. FEAT-006 (my part): Node built-in tests, no new deps

`apps/web/tests/calc/` contains 8 test files with **55 tests**, plus `_helpers/load.mjs`:

| File | Covers |
| --- | --- |
| `payment.test.mjs` (12) | $500k/5%/25y = **$2,908.02**; accelerated bi-weekly **$1,454.01**; `periodicRate`; 0% rate; non-positive inputs → 0; 30-yr closed form; $500k @ 4.39% = $2,736.87; $560k @ 6.79% = $3,849.99; weekly sanity; `principalFromPayment` round trips (4 cases) and edge cases; `balanceAfter` vs simulation, payoff, 0%, interest cap; `biweeklySavings` |
| `cmhc.test.mjs` (8) | min-down tiers incl. **$1.5M jump**; `isInsurable`; premium tier boundaries; full LTV table + 4.50% NTDP; **0.20% surcharge** (3.30/4.20/3.00%); $19,530 / $20,790 examples; **PST** ON/SK/BC/AB + QC 2027 change; constants |
| `landTransferTax.test.mjs` (8) | BC PTT incl. **> $3M** ($4M = $118,000); **FTHB gov.bc.ca table** ($852k → $2,560, payable $12,480; $855k → $1,600; $859k → $320; $860k → 0); BC net $650k/$750k; ON brackets; **$4,000 refund**; **Toronto MLTT luxury tiers** ($5M = $159,975; $25M) + **$4,475 rebate**; **AB fees** incl. $500,001 → $555 |
| `affordability.test.mjs` (11) | `stressTestRate` floor; `gdsTds`; `maxQualifyingPayment` / `maxQualifyingLoan`; `loanForPurchase`; qualifier golden **$670,228.81 at GDS 39 / TDS 43**; $40k down → **$650,000** (down-payment bound); $300k down → exactly **$1.5M**; required-income round trips (conventional $700k and insured $600k; required income **$132,923**) |
| `investment.test.mjs` (3) | defaults (NOI $2,874, cap rate 4.311%, DSCR, cash-on-cash), guards (price 0, down > price, 0%, vacancy outside 0–100), cash-on-cash with nothing invested |
| `selfEmployed.test.mjs` (4) | rising income → 2-yr average ($115,000), falling → latest, stable, clamp ≥ 0 |
| `construction.test.mjs` (4) | default draws **$38,968.75**, month-0 draw, custom period, fractional/negative draws, period ≥ last draw, 60-month clamp, 0% |
| `liveRateDefaults.test.mjs` (5) | FEAT-007 benchmark selection on a `/api/rates`-shaped fixture (insured ≠ conventional; alt from `raw_benchmarks`; missing/failed data → `undefined`; implausible values ignored; `purchaseRateProduct`; `ratesAsOf`) |

- **Ported** from yesterday's scripts: all of `calc-a/02-helpers.test.mjs`, the library-level checks in `calc-a/04-pages.test.mjs` (qualifier, required-income, min-down cap), and the `lib/calc` checks in `calc-b/verify.mjs`.
- **Not ported:** page-body extraction checks (calc-b `extract.mjs` evals page source; it breaks on the new `useLiveDefault` hook calls). Those formulas live inside pages; FEAT-006's Playwright phase or extracting them into `lib/calc` would cover them.
- **No `@/` alias imports** in the code under test: `lib/calc/*.ts` use only relative imports, and `liveRateDefaults.ts` has only an `import type` from `@/types/rates`, which type stripping erases. `_helpers/load.mjs` registers a `node:module registerHooks` resolve hook that retries extensionless relative specifiers from `.ts` files with `.ts` (`investment.ts → ./payment`, `affordability.ts → ./payment, ./cmhc`). It also sets `format: "module-typescript"` so there's no `MODULE_TYPELESS_PACKAGE_JSON` warning.
- ⚠️ Yesterday's throwaway `calc-a/02-helpers.test.mjs` now fails to import `affordability.ts` (no hook). That's expected; use the in-repo tests.

---

## 6. Other fixes found while in these files

| # | Sev | Where | Bug | Fix |
| --- | --- | --- | --- | --- |
| X1 | medium (SEO) | **all 30** `calculators/*/layout.tsx` | `openGraph` objects without `...OG_DEFAULTS`. Next replaces (doesn't merge) `openGraph`, so **every calculator lost og:image, site name and locale** (convention in STATUS). | added `import { OG_DEFAULTS }` + `...OG_DEFAULTS` to each and dropped the redundant `type` |
| X2 | low | stress-test, bc-speculation-tax, cmhc-insurance layouts and cmhc/down-payment copy | Titles/headings said "2025" (e.g. "Stress Test Calculator Canada 2025", "2025 Premium Rates", "Down Payment Rules (2024–2025)") | "2026", "current" / "since December 15, 2024" |
| X3 | medium | `amortization/page.tsx` | live-rate effect never recorded user edits → a typed rate could be overwritten when the feed loaded | `useLiveDefault` |
| X4 | low | `port-vs-break/page.tsx` | dead `newHomePrice` state; unused icons; "Additional Mortgage Needed" sat under "If Breaking" though it applies to both options; "Monthly Difference" showed no minus sign | moved to a "Your Move" section with help text; label "Port payment vs break payment" with ± sign |
| X5 | low | `refinance-cashout/page.tsx` | unused lucide imports | removed |
| X6 | low | `rate-comparison/page.tsx` | toggle switches had no accessible name | `aria-label` + `aria-pressed` |
| X7 | low | `construction-pro/page.tsx` | label "% APR" (it's a nominal annual rate; the calc is simple monthly interest); negative input accepted | "annual %", clamp ≥ 0 |
| X8 | low | `rent-vs-buy`, `debt-service-ratio` | rate sliders stepped 0.1 and displayed raw floats | step 0.01, `toFixed(2)` |
| X9 | low | `self-employed-a-vs-b` copy | "HomeTrust" | "Home Trust", "ICICI Bank Canada" |

---

## needs-owner (cross-area)

| # | Owner | Item |
| --- | --- | --- |
| N1 | calc-specialty (residential hub) | `app/(site)/residential/page.tsx:64` still links `href: "/residential/calculators/stress-test"`. Point it at `/calculators/stress-test` (BUG-020). |
| N2 | orchestrator | `next.config.mjs` still has `source: '/calculators/stress-test' → destination: '/residential/calculators/stress-test'` (lines ~123-124 when I looked). The sitemap comment says it's removed, so make sure the redirect actually goes (or is reversed) before deploy, or the canonical page stays unreachable. |
| N3 | orchestrator / platform | `pnpm test` / CI: **`node --test tests/calc/` doesn't work on Node 24** (it treats the directory as a module). Use `node --test "tests/calc/**/*.test.mjs"` (quote the glob; Node expands it), or `"tests/**/*.test.mjs"` for calc + specialty. Needs Node ≥ 22.18 (type stripping + `registerHooks`); CI should pin Node 24. |
| N4 | backend (`lib/rates.ts`) | `normalizeBenchmark()` drops `median_rate`, `lender_count` and `typical_lender_fee_pct`. I read them from `raw_benchmarks` instead; exposing them on `benchmarks.*` would be cleaner. Also `benchmarks.alt_5yr_fixed` is missing (only `raw_benchmarks.alt_5_year_fixed`). |
| N5 | data owner (relates to BUG-027) | The lowest `alt_*` rates include near-prime credit-union products (`alt_1_year_fixed` leader "DUCA (Near Prime)"; CTBC under `alt_variable`; `alt_5_year_fixed` lowest dated 2026-06-30). B-lender defaults may therefore look low; the benchmark table shows the median next to the lowest for that reason. |
| N6 | frontend (`useLiveRates`) | Keep `data` in the return shape: `_lib/liveRateDefaults.ts` reads `data.benchmarks` / `data.raw_benchmarks` / `data.prime_rate` / `data.last_synced_utc`. |
| N7 | calc-specialty | `equity-lending`, `commercial`, `private-lending` pages still carry April-2025 rates (BUG-019's other half). The `_lib/liveRateDefaults.ts` helper is reusable (it's under `calculators/`, so copy it or move it to `lib/` with platform's OK). |
| N8 | ai-voice (optional) | `lib/ai/tools/mortgage-tools.ts` affordability could reuse the new tested `maxQualifyingLoan` / `maxPurchasePrice` from `lib/calc/affordability.ts` (calc-a O3). |
| N9 | product | Still open from round 1: BUG-043 (tax-years default); pre-approval credit-tier spreads (+0.20/0.40/0.70/1.40) are illustrative (calc-a O5); reverse-mortgage rate and age curve unsourced (calc-b O14). HomeEquity Bank's rate page returned 403. |

## Notes for the next agent

- **Live defaults:** use `useLiveDefault(staticFallback, liveRate(data, product))` plus `<LiveRateNote …/>` from `app/(site)/calculators/_lib/`. Pick the product carefully: `best5YrFixed` / `fixed5Insured` is the **insured** rate. Refinances, rentals and cash-out → `fixed5Conventional`; purchases → `purchaseRateProduct(down%, price, amort)`; B-lender → `alt*`; seconds → `privateSecond`. Values are the feed's `lowest_rate`; the comparison pages show medians too.
- **Max price:** `lib/calc/affordability.ts` now has `maxQualifyingPayment`, `maxQualifyingLoan`, `loanForPurchase`, `maxPurchasePrice` (bisection, returns `limitedBy`). The qualifier, required-income and FTHB use them; don't write another bisection.
- **`premiumPst(premium, province, asOf?)`** is date-aware (QC 9% → 9.975% from 2027-01-01). Pass `asOf` in tests.
- **`lib/calc/affordability.ts` now has relative imports** (`./payment`, `./cmhc`). Raw `node file.mjs` scripts need the `tests/calc/_helpers/load.mjs` hook to import it.
- **Yearly rules review (January):** SVT 2028 rate; tax-bracket defaults in A-vs-B / A-vs-equity (comment lists the 2026 bands); Toronto MLTT; QC premium tax is already scheduled. The source URLs are in the comments next to each constant.
- **Scratch files:** before/after script `scratchpad/r2/before_after.mjs` (prints every number in section 1/3); edit specs `scratchpad/r2/s_*.py`; CRLF-safe editor `scratchpad/r2/ed.py <file> <spec.py>`.
- The bare Bash heredoc tool choked on long heredocs containing many apostrophes. Write spec files with the Write tool instead.
