# Audit 2026-10 — Specialty calculators, shared calculator components, AI tool math, reports

Agent: calculators-specialty · Date: 2026-10-12 · Scope owner files only (see brief).
Verification scripts: `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Documents-App-development-Kraft-Mortgages-Website\c08b2a6e-6cf7-4718-a778-3f74b27e3374\scratchpad\calc-specialty\`
(`before.mjs` reproduces the original formulas; `verify.ts` imports the real post-fix modules — **ALL CHECKS PASSED**).
Type-check: `tsc --noEmit` clean apart from the known `isDormant` errors in `data/canadianLendersData.ts`.

Sources used for program rules (cited where relevant below):
- CMHC MLI Select at-a-glance sheet, doc 66792 20251029-008A (©2025) — https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf
- CMHC MLI Select page (published 2026-09-21) — https://www.cmhc-schl.gc.ca/en/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect
- CMHC Standard Rental Housing page — https://www.cmhc-schl.gc.ca/en/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/standard-rental-housing
- CMHC multi-unit premium grid effective 2025-07-14 (CMLS summary) — https://www.cmls.ca/cmhc-multi-unit-update ; REIC — https://www.reic.ca/article-sept5-25.html ; RENX — https://renx.ca/cmhc-updates-rental-achievement-holdbacks-for-mli-standard-premium-increases-for-all-mli-products
- OSFI B-20 (HELOC ≤65% LTV revolving, ≤80% combined; stress test max(contract+2%, 5.25%)).

Verified MLI Select facts (CMHC sheet + page): points from affordability (new 10/15/25% of units → 50/70/100; existing 40/60/80% → 50/70/100; rents ≤30% of median renter income; **min 10-year commitment**, 20+ yrs = +30 pts), energy (new: 25/50/60% better than NECB Tier 1, or 20/40/70% vs NBC → 20/35/50; existing: 15/25/40% reduction → 20/35/50), accessibility (20/30, requires 100% visitable + barrier-free commons). Flexibilities: new construction 95% LTC at 50/70/100 pts; existing **85% LTV at 50 pts**, 95% at 70/100; amortization **40/45/50 yrs**; limited recourse at 100 pts; min DCR 1.10 standard rental / 1.20 other shelter / 1.40 non-res. Premium: base grid by LTV × purpose (construction vs other), +0.25% per 5 yrs of amortization beyond 25, MLI Select discount 10/20/30% at 50/70/100 pts applied to base + surcharges.

---

## 1. Scope & inventory

| Area | Page / module | What it computes | Formula / helper (after fixes) |
|---|---|---|---|
| Commercial | `commercial/calculators/cap-rate` | Cap rate, implied value at target cap, required NOI | NOI ÷ value; local math |
| | `commercial/calculators/noi-analysis` | GPI, vacancy, EGI, NOI, cap rate, expense ratio, GRM | local math |
| | `commercial/calculators/cash-flow` | Debt service, NOI, BTCF, DSCR, cap rate, CoC, LTV | `lib/calc/payment.payment()` (semi-annual) |
| | `commercial/calculators/refinance` | 3-month / IRD penalty, costs, payment savings, break-even | `payment()` with remaining amortization |
| Construction | `construction/calculators/budget` | Land + hard/soft + contingency, LTC loan, equity, interest (50% avg), profit | local |
| | `.../progressive-draw` | Interest on progressive draws | `lib/calc/construction.interestOnlyCost()` (same as AI tool) |
| | `.../construction-draw` | Construction-to-perm loan, incremental + cumulative draw schedule, interest, fees | local (land advance + 50% avg on construction portion) |
| | `.../cost-to-complete` | Budget, contingency, cost to complete vs undisbursed loan → funding gap | local |
| | `.../builder-program` | Illustrative builder programs, eligibility, interest | local (50% avg) |
| Equity | `equity-lending/calculators/heloc` | HELOC limit (B-20), est. rate (live prime + spread), TDS qualification | `payment()`, `stressTestRate()`, `useLiveRates` |
| | `.../home-equity` | Refinance equity room, income limit (stress test/TDS), payment | same helpers |
| | `.../debt-consolidation` | Payment savings (partial consolidation aware), total-cost vs fees | `payment()`, `useLiveRates` |
| Private | `private-lending/calculators/alternative-income` | Qualifying income, IO payment, GDS/TDS (private limits), fees, effective cost | local |
| Residential | `residential/calculators/stress-test` | Qualifying rate, P&I, GDS/TDS | `payment()` |
| MLI Select | `mli-select/calculators/points` (+ unrouted `enhanced-page.tsx`) | Points, tier, amortization, leverage | `lib/mli/calcs` |
| | `rent-cap` | 30% of median renter income ÷ 12 | `rentCapFromMedian` |
| | `max-loan` | Leverage cap × value/cost | `leverageFor` |
| | `dscr` | Max loan at 1.10 DCR, debt service | `dscrMaxLoan`, `pmt` |
| | `amortization` | Payments 25/40/50 yrs, balance chart | `pmt`, `amortizationSchedule` |
| | `premium` | Base premium (CMHC grid) + amort surcharge − tier discount | `mliBasePremiumPct`, `mliAmortizationSurchargePct`, `premiumDiscountFor` |
| | `break-even` | Break-even rent/unit incl. vacancy & target margin | `breakEvenRentPerUnit`, `pmt` |
| | `eligibility-checklist`, `scenario-compare` | Checklist; side-by-side points/tier/leverage/premium | `lib/mli/calcs` |
| | info pages: overview, benefits, scoring, faq, eligibility, compare-programs, application-process; `/mli` | Program copy | — |
| Shared | `components/calculators/RelatedCalculators.tsx` | Related-calculator links (30 pages use it) | slug → href map |
| | `MliSelectCalculator.tsx`, `MortgageCalculator.tsx` | **Unused** components | — |
| | `components/calculator-report/generateGenericReport.ts`, `generateAvsBReport.ts`, `components/PdfLeadModal.tsx` | jsPDF reports + lead capture used by 26 residential calculator pages | renders caller-supplied values |
| | `lib/reports/pdf-generator.ts` + `templates/*` | Only reachable via `components/LeadCapture/ReportModal.tsx`, which **nothing imports** | — |
| | `components/charts/TimeSeries.tsx` | Generic recharts line | — |
| AI math | `lib/ai/tools/calculator-tools.ts` | cap rate, NOI, payment, affordability, refinance break-even | `payment`, `principalFromPayment`, `stressTestRate`, `cmhc` helpers |
| | `lib/ai/tools/mortgage-tools.ts` | affordability, payment + bi-weekly, investment, construction | same + `biweeklySavings`, `interestOnlyCost`, `cashflow` |
| Read-only | `mli-select-complete/src/lib/calcs.ts` etc. | Separate exported MLI app | see Open issues |

---

## 2. Fixed

All numeric before/after values below come from `before.mjs` / `verify.ts` (defaults of each page unless stated).

### Critical
1. **`app/(site)/commercial/calculators/refinance/page.tsx:46`** — current payment amortized the balance over the *remaining term* (36 months) instead of the remaining amortization, so "monthly savings" compared a 3-year payoff with a 25-year loan. Before: current $12,123.52/mo vs new $2,289.68 → **savings $9,833.83/mo, break-even 2 months**. Added "Remaining Amortization (years)" input (default 22), semi-annual `payment()` for both loans. After: current $2,657.72, new $2,278.83, savings $378.89/mo, break-even 37 months. Removed unused `originalTerm`; IRD approximation documented; disclaimer added; CTA/penalty buttons wrap on mobile. Verified in `verify.ts`.

### High
2. **`lib/mli/calcs.ts:109` `amortByTier`** — 70 pts → 35 yrs and 50 pts → 30 yrs; CMHC: 45 and 40. DSCR max loan at 70 pts, NOI $1.2M, 4.5%: before $19,209,255 → after $21,165,683. Verified (`amortByTier` checks).
3. **`lib/mli/calcs.ts:119` `leverageFor`** — 70 pts new 92.5% / existing 90%, 50 pts new 90%; CMHC: 95/95 and 95 (new) / 85 (existing). Max-loan hero tiles (`max-loan/page.tsx:118`) were separately hard-coded (85/90/95 new, 85 for all existing); now derived from `leverageFor`, labelled LTC vs LTV, plus note that loan = lesser of leverage cap and DCR loan.
4. **`lib/mli/calcs.ts:68` `energyPoints`** — used the *existing-building* scale for new construction. 25% better than NECB scored 35 pts (should be 20). Added `isNew` parameter with NECB thresholds (25/50/60 → 20/35/50); updated callers `points/page.tsx:34`, `points/enhanced-page.tsx:50`, `scenario-compare/page.tsx`; input labels now say "% better than NECB Tier 1" vs "% reduction vs baseline".
5. **`mli-select/calculators/premium/page.tsx:20`** — fixed 3.85% base premium (pre-July-2025 level) with discount applied only to base. Default $15M at 95% LTV, 50-yr, 100 pts: before 2.695% = **$404,250**; after base 6.15% + 1.25% amortization surcharge = 7.40% × 0.70 = 5.18% = **$777,000** (matches CMLS/RENX worked example logic: 90% construction, 40 yrs, 50 pts → 6.75% payable, verified). New inputs: LTV/LTC, loan purpose, amortization; base rate from `mliBasePremiumPct` (`lib/mli/calcs.ts:144`) with manual override + reset; surcharge `mliAmortizationSurchargePct` (`:161`); NaN-safe bars; "50/70/100+ points" labels; disclaimer with grid date.
6. **`mli-select/calculators/scenario-compare/page.tsx:98`** — premium savings were computed on the *project value* using a hidden 3.85% base, and max loan / premium were computed but never displayed. Before $231,000 (on $20M value); after savings on the $19M insured loan using the grid (construction, 95% + 50-yr surcharge = 8.25%) = $470,250. Added Max Loan / premium rate / savings rows and a grid disclaimer.
7. **`equity-lending/calculators/heloc/page.tsx:16`** — limit was 65% × value − mortgage (understates; B-20 is min(65% × value, 80% × value − mortgage)); rates hard-coded 6.95–10.45% (≈2.5 pts above market); qualification was an invented "payment ≤ 5% of income" rule that zeroed the result. Defaults before: limit $120,000, rate 7.45%, **HELOC shown $0**. After: limit $240,000, rate = live prime (4.45%) + credit spread = 5.20%, TDS-44% test at stress rate on full limit amortized 25 yrs using new inputs (current mortgage payment, tax/heat/other debts) → $210,436 supported. Corrected info box (combined 80%, Canadian HELOCs are interest-only/revolving — not US-style draw/repay periods).
8. **`equity-lending/calculators/debt-consolidation/page.tsx:49,66`** — headline "Monthly Savings" assumed *all* debt payments disappear even when only part of the debt could be consolidated (the "After" panel showed otherwise). Partial case (V $600k, M $420k, debts $85k, $3,200/mo): before $3,020.23/mo, after $955.10/mo. Added total-cost comparison (interest if kept vs interest over 25-yr mortgage + refinance costs) with new inputs (average debt rate, refinance costs); "good candidate" now requires lifetime savings > 0. Default case: keep-paying interest $18,944 (33 months) vs $63,164 + $3,000 if added to the mortgage — page now says so. Payments now semi-annual; rate from live best 5-yr + spread; DTI includes remaining debts.
9. **`private-lending/calculators/alternative-income/page.tsx:65,68,57`** — debt *balances* were divided by 12 as if annual payments: $50k balances → $4,166.67/mo (now 3% of balance = $1,500/mo, standard Canadian lender practice). Private payment was 25-yr amortizing at monthly compounding ($5,823.40); private loans are interest-only ($5,241.67). TDS went 61.8% (false "fails") → 39.3%. Term shown 2 yrs → 1 yr renewable. Self-employed haircut (85%) replaced by documentation-based treatment (15% gross-up with tax returns, as declared otherwise). Added cost-of-borrowing panel (2% lender + 1% broker fee, effective first-year cost 12.25%). Inputs relabelled as balances.
10. **`lib/ai/tools/calculator-tools.ts:130` `calculatePayment`** — monthly compounding: $500k/5%/25y = **$2,922.95** vs Canadian **$2,908.02** (web payment calculator). Now uses `payment()`. Verified.
11. **`lib/ai/tools/calculator-tools.ts:185` `calculateAffordability`** (the tool actually registered as `calculate_affordability` — see Open issues) — monthly compounding, stress rate rate+2 without 5.25% floor, 39% of income all allocated to P&I (no tax/heat), max price = mortgage + down (ignoring min-down rules and CMHC premium). Example ($120k income, $100k down, $500/mo debts, 4.39%): before max mortgage $583,527 / price $683,527 → after $535,308 / $620,728. Now: `stressTestRate()` floor, tax $3,000 + heat $1,200 defaults (same as web affordability page, overridable via optional params), `principalFromPayment()`, and `maxPriceFor()` (`:17`) bisection honouring `minimumDownPayment()` and adding `cmhcPremiumRate()` to the loan. Verified: $50k down caps price at $750,000; 2.5% contract qualifies at 5.25%.
12. **`construction/calculators/construction-draw/page.tsx:39`** — "Draw Amount" column showed *cumulative* % × loan per stage (column summed to **$2,377,500 on a $450,000 loan**) and the land row contradicted later rows. Now: land advanced first at the same LTC, construction portion advanced by incremental % completion, separate "Total Advanced" column (sums to the loan, verified); interest reflects land outstanding all period: $16,312.50 → $20,390.63; "LTV" relabelled loan-to-cost; duplicate "Total Project Cost" renamed "All-in Cost"; rounded currency.
13. **`construction/calculators/progressive-draw/page.tsx:43`** — web and AI construction tool disagreed on the same draw schedule ($24,650 vs $28,275: web stopped accruing at the start of month 12). Page now calls the shared `interestOnlyCost()` (same helper the AI tool uses) → both $28,275; average monthly uses the actual period; holdback disclaimer (BC Builders Lien Act / ON Construction Act / AB PPCLA 10%); mobile CTA.

### Medium
14. **`equity-lending/calculators/home-equity/page.tsx:40`** — "debt-to-income" ignored the new borrowing (default 24% → "Likely qualifies"). Now refinance qualification: whole new mortgage at stress-test rate, TDS ≤ 44% incl. new property tax & heat input; "Available to Borrow" = lesser of LTV room and income limit; payment on new money amortized (was interest-only); rate from live best 5-yr + spread (was hard-coded 4.99–7.95%); private rate "12–18%" aligned with site's own "8–15%+"; defaults changed (income $150k, debts $500) so the demo isn't $0.
15. **`construction/calculators/cost-to-complete/page.tsx:33,44`** — contingency applied to land ($75,000 → $55,000; total $825,000 → $805,000) and no comparison to the undisbursed loan (headline said "Additional funding required" for the whole remaining budget). Added "Total Loan Approved" input; headline is now funding gap = cost to complete − undisbursed loan ("Loan In Balance"/"Equity Still Required"); NaN guard; disclaimer; mobile CTA.
16. **`commercial/calculators/cash-flow/page.tsx:28`** — monthly compounding ($12,368.80 → $12,276.41; DSCR 0.970 → 0.977), NaN/Infinity on 0% rate, 0 down or 0 price; raw 3-decimal currency; review message ignored cap rate. Now `payment()`, guards, rounding, compounding disclosure.
17. **`residential/calculators/stress-test/page.tsx:23`** — monthly compounding; now `payment()` (consistent with `/calculators/affordability`); income-0 guards.
18. **`mli-select/calculators/dscr/page.tsx:22` + `lib/mli/calcs.ts:16`** — loan sized with monthly-compounding `pmt` but debt service shown with semi-annual → displayed coverage 1.108, not 1.10. `pmt`/`amortizationSchedule` now semi-annual (Canadian convention, matches `lib/calc/payment`), page reuses `pmt`; coverage exactly 1.10 (verified); `dscrMaxLoan` guards (`:182`); monthly payment now formatted with separators (was `toFixed(0).toLocaleString()` on a string).
19. **`mli-select/calculators/break-even/page.tsx:23` + `lib/mli/calcs.ts:187`** — no vacancy allowance (break-even rent understated), margin tile showed input markup (15%) while other tiles were % of income (didn't sum), raw decimals. Added vacancy input (default 3%; $1,345.89 → $1,387.51/unit), effective-income basis, rounding; removed unused 15%-down CoC calc.
20. **MLI info pages** (`overview/page.tsx:72`, `benefits/page.tsx:61`, `scoring/page.tsx`, `faq/page.tsx:36`, `mli/page.tsx:47`) — stated affordability "up to 50 pts", energy "up to 30", accessibility "up to 20"; discounts "5–10% / 15–20% / up to 25%"; amortization "up to 40 years" for every tier; "priority processing / expedited approval" for higher tiers (not a CMHC feature); `/mli` "Up to 50% Savings". Replaced with CMHC-sourced figures (50/70/100 + 30 bonus; 20/35/50; 20/30; 10/20/30%; 40/45/50 yrs; LTC/LTV by tier; limited recourse at 100).
21. **`mli-select/calculators/eligibility-checklist/page.tsx:16`** — affordability items marked *required* (it's optional — energy + accessibility can reach 50+), "tenant income limits" (MLI Select tests rents, not tenant incomes), "median household income" (should be median renter income); missing 50-point, non-residential ≤30%, 5-yr experience/property manager and 25%-of-loan (min $100k) net-worth requirements; construction docs required for existing properties. Rewritten from the CMHC sheet.
22. **`lib/mli/calcs.ts:57` `affordabilityPoints`** — commitments under 10 years scored points; CMHC minimum is 10 years. Now 0 below 10 years; label "min. 10".
23. **`lib/ai/tools/calculator-tools.ts:236` `calculateRefinanceBreakEven`** — default penalty was 3 months' interest only (web uses higher of 3-month/IRD); default closing costs $2,500 vs web $2,350; savings always interest-differential. Now: penalty default max(3-month, IRD), closing costs $2,350, optional `remainingAmortizationYears`/`newAmortizationYears` → payment-difference savings identical to the web page (37-month break-even both, verified). Penalty row added to output.
24. **`lib/ai/tools/mortgage-tools.ts:86,101,330`** (legacy `calculateAffordability`, reachable via `/api/ai/tools`) — max price used GDS only (ignored debts), monthly compounding in the inverse, 100% condo fees. Now binding of GDS 39% / TDS 44%, `principalFromPayment()` (semi-annual), 50% condo fees (CMHC), output labels clarified. Verified GDS- and TDS-binding cases.
25. **`lib/ai/tools/mortgage-tools.ts:290`** — construction "average monthly interest" divided the 12-month interest total by the last draw month (11). Now uses `constructionPeriodMonths` (verified $2,356.25 = total/12); empty-draws guard; `percentOfProject` guard.
26. **Dead/misleading links** — `components/calculators/RelatedCalculators.tsx:42`: slug `equity-lending` rendered `/calculators/equity-lending` (404, used by `/calculators/refinance-cashout`); added href overrides + names (`refinance-cashout`, `reverse-mortgage`, `heloc`, etc.). Landing cards: equity-lending "Cash-Out Refinance" → `/calculators/refinance-cashout`, "Investment Opportunity" (redirected to home-equity) → HELOC calculator (previously unlinked) (`equity-lending/page.tsx:71`); private-lending "Asset-Based / Bridge / Quick Approval" all 301-redirected to the alternative-income page → replaced with real tools (home-equity, self-employed, pre-approval) (`private-lending/page.tsx:64`); construction-draw calculator added to `/construction` (`construction/page.tsx:85`).
27. **`construction/calculators/builder-program/page.tsx:28`** — "No builder insurance required" contradicts mandatory new-home warranty/licensing (BC Housing, Tarion, AB New Home Buyer Protection). Replaced; added "illustrative programs" disclaimer.
28. **`equity-lending/page.tsx:25`** — "Access up to 80% of your home's equity" (it's 80% of *value*, less the mortgage). Reworded.

### Low
29. `commercial/calculators/noi-analysis/page.tsx:34`, `cap-rate/page.tsx:14`, `calculator-tools.ts:55,91` — divide-by-zero → Infinity/NaN (expense ratio, GRM, cap rate, implied value); raw 3-decimal currency. Guards + rounding + NOI definition disclaimers.
30. Mobile overflow — two-button CTA rows (`py-4 px-8`, no wrap) ≈450px wide at 375px on cap-rate, noi-analysis, refinance, progressive-draw, cost-to-complete, builder-program → `flex-col sm:flex-row`; refinance penalty toggle `flex-wrap`.
31. `mli-select/calculators/rent-cap/page.tsx:32` — "Median Annual Income" → "Median Renter Household Income" with CMHC guidance.
32. `construction/calculators/budget/page.tsx:210` — "Loan-to-Value" was loan-to-cost; NaN guards; rounding; profit disclosure (selling costs, GST/HST, 50% avg advance).
33. `mli-select/calculators/amortization/page.tsx:263` — "{n} Year Term" → "{n}-Year Amortization".
34. `lib/reports/pdf-generator.ts:196` — footer had no "estimates / not advice" disclaimer; added. `generateGenericReport.ts:303` — filename built from raw user name (`/`, `:` etc. broke the download name); sanitized.
35. `mli-select/compare-programs/page.tsx`, `mli-select/eligibility/page.tsx` — placeholder one-liners (compare page referenced discontinued MLI Flex); added short CMHC-sourced content.
36. `lib/calc/mli.ts` — unused module with a fabricated premium table; marked `@deprecated` (not deleted per rules).
37. `mortgage-tools.ts:189` — bi-weekly "time saved" was a linear estimate (2.1 yrs); now simulated (3.5 yrs, $60,436 interest saved on $500k/5%/25y) via `biweeklySavings()`; output says "Total Interest Saved" instead of misleading "Annual Savings".

**Count fixed: 1 critical, 12 high, 15 medium, 9 low (37).**

---

## 3. Open issues (not fixed)

| Sev | Location | Issue | Suggested fix | Owner / why not fixed |
|---|---|---|---|---|
| High | `mli-select/faq/page.tsx` ("98% approval rate"), `mli/page.tsx:62` ("100+ successful applications with 95% approval rate"), `private-lending/page.tsx:109,117,171` ("95%+ approval rates"), FAQ "dozens of applications" | Unverifiable and mutually inconsistent performance claims (Competition Act / regulator advertising risk). | Substantiate or remove. | needs-owner: business/compliance — I cannot verify facts about the brokerage. |
| Medium | `components/calculator-report/generateGenericReport.ts` contact page, `generateAvsBReport.ts:525` | Reports state licensing by BCFSA only, while the site markets in AB and ON (RECA / FSRA licensing). | Add AB/ON licence statements & numbers. | needs-owner: compliance (licence details unknown). |
| Medium | `mli-select-complete/src/lib/calcs.ts` (read-only) | Same bugs I fixed in `lib/mli/calcs`: `amortByTier` 30/35 (should 40/45); `leverageFor` gives 95% to existing at 50 pts (should 85%); `energyPoints` ignores NECB scale for new; monthly-compounding `pmt`; no 10-yr minimum; `src/lib/constants.ts` has the correct DEFAULTS but is unused; premium page default 6.0% base not grid-based; `data/medianIncome.ts` labelled "placeholder examples". `apps/web/app/mli-proxy/[...path]/route.ts` comment refers to next.config rewrites that no longer exist. | Port `apps/web/lib/mli/calcs.ts` or retire the exported app. | needs-owner: platform (read-only for me). |
| Medium | `app/(site)/calculators/construction-pro/page.tsx:284` | Links `/private-lending/calculators/hard-money` — no page, no redirect → 404. | Point to `/private-lending/calculators/alternative-income` or `/private-lending`. | needs-owner: calculators-residential. |
| Medium | `next.config.mjs` redirect `/calculators/stress-test` → `/residential/calculators/stress-test` | `app/(site)/calculators/stress-test/page.tsx` (other agent, with PDF/FAQ) is unreachable; two divergent stress-test implementations. | Pick one; remove redirect or the duplicate. | needs-owner: platform + calculators-residential. |
| Medium | `app/(site)/calculators/affordability/page.tsx:37` | Counts 100% of condo fees in GDS (CMHC: 50%). AI legacy tool now uses 50%. | Use `condoFees * 0.5`. | needs-owner: calculators-residential-a. |
| Medium | `lib/ai/tools/tool-executor.ts:54-95` | `calculate_affordability` registered twice; `calculatorTools` silently overrides the legacy `mortgageTools` version (Map insertion order). All calculator tools have `parameters: null` → no input validation (negative/NaN/strings reach the math). | Rename one tool; add zod schemas. | needs-owner: AI plumbing (brief: don't touch registration). |
| Medium | AI vs web parity | AI `calculate_affordability` returns a *max price*; web `/calculators/affordability` checks ratios for a user-entered principal — not directly comparable. No AI tools exist for MLI Select, commercial cash-flow/DSCR, HELOC, debt consolidation. | Add tools that call `lib/mli/calcs` and shared page helpers (see Opportunities). | needs-owner: AI. |
| Medium | `components/PdfLeadModal.tsx` | No express-consent checkbox for follow-up (CASL); failed `/api/contact` POST is only `console.error`ed, so leads are lost silently while the PDF still downloads. | Optional consent checkbox + `consent` field; surface/queue failed submissions. | needs-owner: backend (API contract). |
| Medium | `equity-lending/page.tsx:28-49,108`, `commercial/page.tsx:28,49,171`, `private-lending/page.tsx:28-49,87-105` | Hard-coded marketing rates ("Starting from 4.99%", "Prime + 1.25%+", "8%–12%") not tied to `useLiveRates`; drift vs calculators. | Drive from `useLiveRates` or date-stamp. | Copy decision for owner; not math. |
| Low | `lib/reports/pdf-generator.ts`, `lib/reports/templates/*`, `components/LeadCapture/ReportModal.tsx` | Dead path (ReportModal has no importers). The "MLI Select" template actually describes homeowner CMHC insurance (5% down) — mislabelled; generator content functions call `.toFixed` on fields that may be undefined; ReportModal downloads `new Blob([reportUrl])` (a URL string) as a PDF. | Delete or rebuild on `generateGenericReport`. | Deleting not allowed; ReportModal not mine. |
| Low | `components/calculators/MliSelectCalculator.tsx`, `MortgageCalculator.tsx`, `mli-select/calculators/points/enhanced-page.tsx` | Unused/unrouted. MliSelectCalculator scoring is wrong (affordability 20% → 30 pts, accessibility 10% → 15 pts, 92.5/90% LTV). | Delete, or re-implement on `lib/mli/calcs`. | Deleting not allowed; unused so low impact. |
| Low | `lib/mli/calcs.ts` `leverageFor`/`amortByTier` below 50 pts | Baseline is 80% / 25 yrs (conventional); CMHC standard rental allows 85% LTV and 40 yrs (existing). Comparisons labelled "without MLI Select" understate standard MLI. | Add a "Standard MLI" baseline option. | Design choice; documented in code. |
| Low | `mli-select/calculators/premium`, `scenario-compare` | Other-shelter-model grid (student/seniors/SRO), EGI-not-met (+0.25%), non-residential (+1%), second-mortgage surcharges not modelled; amortization surcharge rounds partial 5-yr steps up (verify with CMHC). | Add toggles. | Scope. |
| Low | `mli-select/calculators/dscr`, `max-loan` | DSCR loan isn't capped by LTV/LTC and max-loan doesn't apply DCR (note added). | Combined sizer (Opportunity 1). | Feature. |
| Low | `construction/calculators/budget/page.tsx` | 50% average-advance interest ignores land advanced up front (construction-draw now models it); unused `constructionTerm`/`takeOutRate` state. | Reuse construction-draw approach; remove dead state. | Kept minimal. |
| Low | `construction/calculators/builder-program` | Fictional programs with fixed rates (now disclosed as illustrative). | Replace with real criteria from `underwriting_criteria_matrix.json` (read-only to us). | Data owner. |
| Low | `commercial/calculators/cap-rate` | Benchmarks undated, no Ontario markets (brokerage serves ON); 3–4%/8–10% bands show green box with warning icon. | Add dated ON benchmarks; align colours. | Needs sourced data. |
| Low | `commercial/calculators/refinance` | Legal/appraisal/discharge fees are fixed state without inputs; IRD uses new rate as comparison rate (disclosed). | Add inputs / lender posted-rate IRD. | Scope. |
| Low | `equity-lending/calculators/heloc` | $500k cap retained as "illustrative"; credit spreads are estimates. | Make cap/spreads configurable. | Policy varies by lender. |
| Low | `private-lending/calculators/alternative-income` | GDS/TDS exclude property tax/heat (labelled "P&I only"); base rate 8.5% not linked to `useLiveRates().bestPrivateSecond`; fees fixed 2%+1%. | Add inputs; live rate. | Scope. |
| Low | `generateGenericReport.ts` rows | Long labels can overlap right-aligned values (no maxWidth/wrap). | Wrap label column. | Cosmetic. |

---

## 4. Feature opportunities

1. **MLI Select deal sizer** — user value: one screen answering "how much can I borrow and what will CMHC charge?" (points → tier → LTC/LTV cap, 1.10 DCR loan, insured loan = lesser of the two, grid premium financed, payment, cash flow). Builds on `lib/mli/calcs` (`leverageFor`, `dscrMaxLoan`, `mliBasePremiumPct`, `mliAmortizationSurchargePct`, `pmt`). Effort M.
2. **CMHC median renter income lookup** for rent-cap/affordability scoring (CMHC publishes an XLSX by market; `mli-select-complete/src/lib/data/medianIncome.ts` has the shape). Value: correct affordable-rent caps per market without manual lookup. Effort M.
3. **PDF reports + lead capture on specialty calculators** (commercial, MLI, construction, equity) using existing `generateGenericReport` + `PdfLeadModal` (already on 26 residential pages). High-value commercial/MLI leads currently have no capture on these pages. Effort S per page.
4. **AI parity tools** — expose MLI points/premium/DSCR, commercial cash-flow/DSCR, HELOC limit and debt-consolidation total-cost to the chat, calling the same helpers as the pages so answers match. Effort M (AI agent registers; math exists).
5. **Unit tests** — turn `scratchpad/calc-specialty/verify.ts` into vitest specs for `lib/mli/calcs` and both AI tool files (benchmark $2,908.02, CMLS premium example, DCR=1.10 round-trip). Effort S.
6. **Editable draw schedule + holdback/interest reserve** in progressive-draw (the `draws` state exists but has no editor; model 10% statutory holdback and interest reserve). Effort M.
7. **Live-rate wiring everywhere** — alt-income (`bestPrivateSecond`), builder-program, equity/commercial landing copy. Effort S.
8. **Debt-consolidation "accelerated payoff" scenario** — compute payoff date/interest if the borrower keeps paying the old total after consolidating (tip text exists). Effort S.
9. **Ontario/Alberta cap-rate benchmarks** with source/date. Effort S.

---

## 5. Notes for the next agent

- Shared helpers changed in parallel by calculators-residential-a during this audit: `lib/calc/payment.ts` (`payment()` returns 0 for non-positive principal; new `principalFromPayment`, `periodicRate`; `biweeklySavings` now returns `totalInterestSaved`, `yearsSaved`), `lib/calc/construction.ts` (`interestOnlyCost` accepts `periodMonths`, normalises months), `lib/calc/cmhc.ts` (`minimumDownPayment`, `isInsurable`, `INSURED_PRICE_CAP`, premium by LTV). My code depends on these exports.
- `lib/mli/calcs.ts` `pmt` is now Canadian semi-annual compounding (was monthly). All MLI pages using `pmt`/`amortizationSchedule` (DSCR, amortization, break-even, points example) shift by ~0.3–1%. `energyPoints(pct, isNew)` has a new optional arg — pass `projectType === "new"`.
- Commercial pages now assume semi-annual compounding (disclosed). If the business prefers monthly for commercial, change in one place per page (`payment()` call) and update the AI tools to match.
- Line endings in the repo are mixed (some files LF, some CRLF). My patch helper (`scratchpad/calc-specialty/patchlib.py`) preserves each file's ending; avoid `sed` that appends `\r`.
- The Bash tool mangles some heredocs containing JSX quotes — write patch scripts with the Write tool, then run them.
- Not runtime-tested in a browser (no `next dev` per rules); verification is numeric (`verify.ts`) + `tsc`.
