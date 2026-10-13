# Audit — Residential Calculators, Group B (refinance, renewal, penalty, investment, self-employed, alternative lending)

Date: 2026-10-12 · Scope owner: calculators-residential-b · Status: fixes applied, not committed

Headline: 7 critical, 9 high, 7 medium and 9 low issues fixed across 15 calculators and 3 `lib/calc` helpers. 71/71 numeric checks pass. The checks run the **shipped** code, pulled out of the page/lib sources, against independently computed reference values. 23 issues are still open (see section 3).

> **Results users will see change with default inputs** (they were wrong before):
> - **Refinance Break-Even** used to say "Refinancing may not be beneficial". It now says it looks worthwhile: about $343/mo saved, a 30-month break-even and about $19.7K net saving over the 5-year term.
> - **Refinance vs HELOC vs 2nd** used to call the HELOC cheapest. It now finds the refinance cheapest. The old 5-year totals counted every payment on the whole mortgage for the refinance, but left the existing first mortgage out of the HELOC and second-mortgage totals.
> - **Rent vs Buy** used to give a break-even of "Year 1" for almost any input. With defaults it now shows renting slightly ahead for all 25 years. The old code invested the monthly difference for the renter in the wrong direction and used a break-even test that was trivially met.
> - **A vs Equity (BC)** used to say the A-lender is cheaper by $2.6K. It now says equity is cheaper by about $26.5K, because the BC default marginal rate was 20.5%, which is the federal bracket rate alone. It now matches the Self-Employed A vs B calculator (38.29%).
> - **Port vs Break** penalty went from $12,075 to $2,529. The IRD condition was inverted.
> - **Renewal**: the default penalty was $2,500 against a realistic IRD of about $20K, so it showed "Worth Breaking Early". It now shows "Consider waiting".

---

## 1. Scope & inventory

All Group B pages are `"use client"` pages under `apps/web/app/(site)/calculators/<slug>/page.tsx`. Each one before this audit used its own local, mostly US-style math. They now all use the Canadian fixed-rate convention: monthly rate = (1 + r/2)^(1/6) − 1. This is the same formula as `lib/calc/payment.ts`.

| Calculator | What it computes | Math / helper (after fix) |
|---|---|---|
| `rate-comparison` | Up to 4 rates: payment, interest over term & amortization, savings | local `monthlyRate`/`monthlyPayment`/`interestOverMonths` |
| `refinance-break-even` | New payment, monthly savings, break-even months, interest saved over the new term, net savings | local helpers (new payment keeps the remaining amortization) |
| `refinance-cashout` | Max cash-out at ≤80% LTV, new payment, LTV after | `lib/calc/payment` |
| `refinance-vs-heloc-vs-second` | 5-yr interest + fees for refinance / HELOC (interest-only) / private second (interest-only); LTV feasibility; recommendation | local helpers + `useLiveRates` (conventional 5-yr, alt 5-yr, HELOC, private 2nd) |
| `renewal` | Current vs market payment over remaining amortization, break-even on penalty, penalty guide | `lib/calc/payment` + `useLiveRates` |
| `port-vs-break` | Blended-rate port vs break: payments, penalty (3-mo / IRD), 5-yr interest + fees/penalty | `lib/calc/payment` + local `interestOver` (multi-rate segments) |
| `mortgage-penalty` | 3 months' interest, IRD with comparison rate (posted − original discount), break-even at a new rate | local `ThreeMonthsInterest`, `IRD` |
| `rent-vs-buy` | 25-yr monthly simulation: buyer equity after selling costs + invested savings vs renter portfolio; break-even year | local helpers + `lib/calc/cmhc.cmhcPremium`, local `minDownPayment` |
| `investment` | NOI, cap rate, DSCR, cash flow, cash-on-cash | `lib/calc/investment.cashflow` |
| `reverse-mortgage` | Illustrative max % of value by age, net cash after existing debt, equity projection | local `maxLtvForAge` (piecewise) |
| `self-employed` | Qualifying income from NOAs (line 15000) + add-backs | `lib/calc/selfEmployed.normalizedIncome` |
| `self-employed-a-vs-b` | A-lender interest + tax on extra declared income vs B-lender interest + fee; investment deductibility | local helpers |
| `a-vs-equity` | Same idea, A vs equity/private lender | local helpers |
| `b-vs-equity` | B vs equity cost over term; B qualification gate | local helpers |
| `construction-pro` | Interest-only cost on progressive draws over a construction period | `lib/calc/construction.interestOnlyCost` |

Layouts: 8 calculators already had a `layout.tsx` with metadata and a canonical URL. I **created** `layout.tsx` for the 7 that had none: refinance-cashout, renewal, port-vs-break, investment, reverse-mortgage, self-employed and construction-pro. Without one, those pages inherited the homepage title and had no canonical, which the root layout comment says every page must set.

---

## 2. Fixed

Line numbers refer to the files as they are now.

### Critical

1. **`refinance-break-even/page.tsx:82-93`: new payment amortized over the term instead of the amortization.**
   - **What was wrong:** `monthlyPayment(balance, newRate, newTermYears*12)` paid off $450K in 60 months. With defaults that gave a new payment of $8,387/mo, savings of **−$5,537/mo**, a verdict of "May not be beneficial" for every input, and "Interest Saved $180,761". "Interest saved" also compared full remaining-amortization interest on the current loan with term-only interest on the new one.
   - **What changed:** The new payment now uses the remaining amortization ($2,834.44). Interest on both paths is simulated over the same horizon (the new term). I set the default current payment to a consistent $3,177, and added a warning when the entered payment differs by more than 5% from what the balance, rate and amortization imply. I also softened a claim that lenders are "required by law" to provide a penalty quote within a few business days (`:323`), and fixed the PDF labels.
   - **Result:** $343/mo saved, 30-month break-even, $29,668 interest saved over 5 years, $19,668 net.
   - **Verified:** `verify.mjs` refi checks.
2. **`rate-comparison/page.tsx:87-95`: negative "Interest (term)".**
   - **What was wrong:** `payment × term months − full loan` gave −$325,519 for $500K at 5%.
   - **What changed:** Term interest is now `interestOverMonths(...)`: $117,019.03 at 5%. The term is clamped to the amortization.
   - **Verified:** `verify.mjs`.
3. **`self-employed-a-vs-b/page.tsx:100-110`: same negative-interest bug.**
   - **What was wrong:** "Total Interest (5yr)" showed −$324,798 (A) and −$315,953 (B), and "Total Cost Over Term" was negative.
   - **What changed:** Interest is now computed as interest actually paid: A $116,779, B $128,814. Net B advantage with defaults went from $101,025 to $97,835.
4. **`b-vs-equity/page.tsx:120-124`: same bug.**
   - **What was wrong:** Interest showed −$315,953 / −$288,922. The difference shown was really the payment difference ($27,031).
   - **What changed:** Real interest is $128,814 vs $164,135, a difference of $35,321. The "costs more" sentence now handles the case where equity costs less (`:369`).
5. **`refinance-vs-heloc-vs-second/page.tsx:99-163`: 5-year cost compared different debts.**
   - **What was wrong:** The refinance total counted 5 years of P+I on the whole $650K. The HELOC and second totals counted only the new money and left out the first mortgage entirely. Defaults gave refinance $236K, HELOC $39K, second $90K, so HELOC was always "cheapest".
   - **What changed:** Every option is now interest on all mortgage debt + fees/penalty. The HELOC and second totals include the existing first mortgage's interest. Defaults are now refinance $139,224, HELOC $147,295, second $174,845, so refinance is cheapest.
6. **`rent-vs-buy/page.tsx:75-148` (old) → `:75-145`: inverted renter savings and a trivial break-even.**
   - **What was wrong:**
     - The renter invested `max(0, rent − buyCost)`, the wrong direction. With defaults (buy $4,107/mo vs rent $2,500) the renter invested nothing.
     - The break-even test `buyOutflow − homeEquity ≤ rent` ignored the down payment, so it returned **Year 1** for essentially every input.
     - CMHC was added to the renter's starting cash, even though the premium is financed.
   - **What changed:** The page now runs a monthly simulation:
     - Renter invests the up-front cash (down payment + purchase closing costs) plus `max(0, buyCost − rent)` each month.
     - Buyer invests `max(0, rent − buyCost)`.
     - The mortgage stops at payoff; rent and ownership costs inflate; buyer net worth is after selling costs.
     - Break-even is the first year buyer net worth ≥ renter net worth.
   - **Result:** Year-10 net worth: buy $489,853 vs rent $501,888, matching an independent re-simulation.
7. **`port-vs-break/page.tsx:76-78`: IRD condition inverted.**
   - **What was wrong:** IRD was 0 when the contract rate was **higher** than the new rate (the only case where IRD applies) and positive when it was lower. Defaults (2.89% vs 5.19%) gave an IRD and penalty of **$12,075** instead of 3 months' interest of $2,529.
   - **What changed:** IRD = (contract − comparison)/100 × balance × months/12, only when the contract rate is higher, and 0 for variable. Example: 5.5% vs 4.0% gives $7,875 (old code: $0).

### High

1. **US-style monthly compounding**: replaced with Canadian semi-annual compounding.
   - **Pages:** rate-comparison `:40`, refinance-break-even, refinance-vs-heloc-vs-second, rent-vs-buy `:48`, self-employed-a-vs-b, a-vs-equity `:24`, b-vs-equity. Reverse-mortgage growth (`:48`) also moved from annual to semi-annual compounding.
   - **Example:** $500K at 5% over 25 years was $2,922.95/mo and is now $2,908.02/mo.
2. **`mortgage-penalty/page.tsx:21-27, 88-106, 255-272`.**
   - **What was wrong:**
     - Break-even was `IRD ÷ ((contract − posted) × balance/12)`, which always equals the remaining term (24 → 24, 36 → 36).
     - There was no big-bank "posted minus original discount" comparison rate, so IRD was badly understated for bank mortgages.
     - IRD could display negative.
   - **What changed:**
     - Added an **Original Discount Received** slider; comparison rate = posted − discount.
     - Added a **New Rate Available** slider; break-even = penalty ÷ monthly interest saved, and it flags when that is longer than the remaining term.
     - IRD is clamped to ≥ 0.
     - Moved `CalculatorSchema` out of the toggle component (`:115`).
     - Added an estimate disclaimer and updated the IRD formula text.
   - **Example:** 1.5% discount → IRD $20,000 vs $8,000 without it.
3. **`port-vs-break/page.tsx:49-69`: "Blended Rate" input did nothing, and the 5-year cost counted principal.**
   - **What was wrong:** `blendMonthly` was computed but never used. The 5-year cost was `payment × 60`, which favours longer amortizations.
   - **What changed:**
     - The port option now uses the blended rate on the combined balance until the current term ends, then the new rate.
     - Cost = interest + fees, with the same 60-month window for both options.
     - The split structure is shown as a secondary line, plus a weighted-average rate hint.
     - Added a fixed/variable toggle (`:118`) and an assumptions disclaimer.
4. **`a-vs-equity/page.tsx:21, 96-100`.**
   - **What was wrong:** The investment toggle deducted interest only on the equity path. It is deductible on both, so the result was biased (old: equity ahead by $14,214; corrected at 38.29%: $37,530). The BC default marginal rate was 20.5% (federal-only), inconsistent with A-vs-B (38.29%) and with AB 30% / ON 43.4%.
   - **What changed:** The deduction now applies to both paths. Defaults are harmonised to 38.29 / 36.0 / 43.41 with an explanatory note. The detailed comparison and recommendation are sign-aware.
5. **`refinance-cashout/page.tsx:16, 64, 121`.**
   - **What was wrong:** It said "Insured refinances can reach 90% but require CMHC insurance", which is false; insured refinancing isn't available. The related link `equity-lending` resolved to `/calculators/equity-lending`, which is a 404.
   - **What changed:**
     - The text now explains the 80% cap and the federal secondary-suite program exception (up to 90% of as-improved value, effective Jan 15, 2025).
     - The link now goes to `a-vs-equity`.
     - The misleading "was $X" (which was actually computed at the new rate) is relabelled.
     - Added an estimate disclaimer.
6. **`lib/calc/selfEmployed.ts`: wrong qualifying-income rule.**
   - **What was wrong:** It used `min(avg, latest, prior)`, which equals the lower of the two years. With rising income (110K / 90K + 15K add-backs) that gave 105,000.
   - **What changed:** It now uses `min(latest, 2-yr average) + add-backs` = 115,000, the standard rule (average when stable or rising, latest when falling). It is also clamped to ≥ 0. The page labels now say NOA **line 15000** (`self-employed/page.tsx:124`) and rounding is fixed.
7. **`reverse-mortgage/page.tsx:9-31`: LTV curve jumped and overstated borrowing.**
   - **What was wrong:** The limit jumped from 16% at age 64 to the **55% maximum at 65**, so every borrower aged 65–69 was shown the cap. At age 70 on an $800K home it showed $440K.
   - **What changed:** A monotonic illustrative curve: 55 → 17.5%, 65 → 30%, 70 → 35%, 75 → 45%, 85 → 52.5%, 95 → 55%. Age 70 / $800K now shows about $280K.
   - Also added an **existing mortgage/HELOC** input (`:86`, must be repaid from proceeds), net cash, a "debt too high" warning, and a fees/illustrative disclaimer.
8. **`rent-vs-buy/page.tsx:41-46, 80-89`: minimum down payment and insurance rules missing.**
   - **What was wrong:** It allowed 5% down on a $700K home (legal minimum $45,000 = 6.43%) and insured homes of $1.5M+. The CMHC premium came from a local table, and the renter's starting cash included the premium.
   - **What changed:**
     - Applies the minimum down payment rule (5% / 10% / 20% at $1.5M+) with a warning.
     - Uses the shared `lib/calc/cmhc.cmhcPremium`.
     - Adds the +0.20% surcharge and a note for 30-year insured amortization.
     - Added purchase closing %, selling cost % and rent/cost increase inputs, plus an assumptions disclaimer.
     - The PDF "Mortgage Amount" showed the monthly payment; it now shows the loan.
9. **`self-employed-a-vs-b/page.tsx:126-130, 245-300`: investment totals didn't reconcile.**
   - **What was wrong:** The A column total ignored A's interest deduction, while the B total and the headline included deductions, so the displayed totals didn't match "cheaper by X".
   - **What changed:**
     - Both columns and the bars now use net costs.
     - Added A's deduction row.
     - The PDF receives the netted A total (`:452`, workaround; see open issue O6).

### Medium

1. **`renewal/page.tsx`.**
   - **What was wrong:**
     - It showed "0 months" break-even when there were no savings.
     - The success message printed `save 374.9583 monthly` with no `$`.
     - The default penalty was $2,500 while 3 months' interest is $6,626 and the IRD about $20,250, so defaults showed "Worth Breaking Early".
   - **What changed:**
     - Break-even shows "N/A" when there are no savings, and the reason text is specific.
     - The `$` and rounding are fixed (`:296`).
     - The default penalty is now $20,000, and a live **penalty guide** (3-month and IRD estimates plus a link to the penalty calculator) is shown under the input (`:237`).
     - Inputs are clamped.
     - Added the OSFI Nov 21, 2024 straight-switch note (`:317`).
2. **`refinance-vs-heloc-vs-second`.**
   - **What was wrong:**
     - The A-lender refinance priced at the insured 5-yr rate; refinances are uninsured.
     - The equity/private refinance had a 0% fee.
     - A-lender HELOCs were charged 1.5%.
     - The $500 HELOC and $1,500 second-mortgage legal costs were in the totals but not displayed.
     - There was no LTV feasibility check.
     - The recommendation used the pre-cash LTV, and above 80% it suggested a HELOC, which isn't possible.
   - **What changed:**
     - Rates: live conventional 5-yr for A-lender, live `alt_5_year_fixed` for B-lender (fallback 6.04).
     - Fees: equity 2%; A-lender HELOC 0%.
     - Fee rows now show all fees.
     - Feasibility: refinance/HELOC ≤ 80% CLTV, HELOC portion ≤ 65% LTV (OSFI B-20), private ≤ ~85%. Badges are shown, and "cheapest" is chosen only among feasible options.
     - The recommendation uses the post-cash LTV; an "LTV After Cash" stat was added.
     - The private second is modelled as interest-only.
3. **`lib/calc/investment.ts` + `investment/page.tsx`.**
   - **What was wrong:**
     - Price 0 → cap rate NaN/Infinity.
     - Down payment > price → negative loan and negative payment.
     - Vacancy wasn't bounded.
     - All-cash showed DSCR 0 in orange, failing "good investment".
     - The note said vacancy was excluded, but it is an input.
     - There was no cash-on-cash return and no 20%-down warning for rentals.
   - **What changed:**
     - Inputs are guarded, and `cashOnCash`/`cashInvested` were added (the return shape stays backward-compatible for `lib/ai/tools/mortgage-tools.ts`).
     - DSCR shows "N/A" for all-cash.
     - Added a closing-costs input, a 20%-minimum warning and corrected notes.
4. **`lib/calc/construction.ts` + `construction-pro/page.tsx`.**
   - **What was wrong:** Draws in month 0, at fractional months or after month 60 were dropped from interest but still counted in the total. Negative amounts were accepted. The period was fixed at max(12, last draw). The "Hard Money Calculator" link pointed to the non-existent `/private-lending/calculators/hard-money`.
   - **What changed:**
     - Months are normalised to 1..60 and negative amounts are ignored; the defaults are backward-compatible.
     - Added an optional `periodMonths` and a **Construction Period** input.
     - Peak monthly interest is shown.
     - "Total Project Cost" is relabelled "Total Draws (Loan Advanced)".
     - The link now goes to `/construction/calculators/progressive-draw` (`:305`).
5. **Missing metadata and canonical:** created 7 `layout.tsx` files (see section 1).
6. **Wrong numbers in articles, FAQs and PDF copy** (recomputed with `t_*.mjs`):
   - **rate-comparison:** "$67/mo, $20,000, $4,800" → $72/mo, $21,500, about $6,000. The PDF "~$7,500 over 5 years" → about $6,000. Article "$2,975 / $392,500 / $20,100" → $2,980 / $393,900 / $21,500.
   - **self-employed-a-vs-b:**
     - "B costs $37,500 more over 5 yrs" → about $12,000.
     - Investment example "$158,750 interest / $60,325" → $128,800 / $48,900, now noting A's deduction too.
     - Sarah example: payments "$3,514 / $4,087" → $3,486 / $4,015; interest "$110,840 / $145,220" → $140,100 / $183,600; "saves $73,620" → about $64,500.
   - **a-vs-equity:** BC example rewritten (about 32% average rate on income from $60K to $140K; A $103.5K vs equity $87K). The old text also contradicted itself ("A-lender saves $14,900" when its own totals differed by $2,800). Ontario example and investment paragraph corrected.
   - **b-vs-equity:** example "$3,358, $101,500, $5,900 diff" → $3,049, $128,800, $35,300. FAQ "$12,000" → about $11,000. "1–4% above bank rates" → about 0.5–2%.
7. **Inaccurate B-lender claims** (self-employed and self-employed-a-vs-b):
   - "No GDS/TDS limits" → more flexible limits (often up to about 50% TDS).
   - "No tax returns or NOAs required" → stated income supported by bank statements; NOA often still requested to confirm no CRA arrears.
   - "Beacon 500+" → typically 550–600+.
   - "insured mortgages (below 80% LTV)" → above 80%.
   - Added an LTV > 80% warning, an incorporated-owner tax caveat, and a **Years of Extra Declared Income** input (defaults to the term).

### Low

1. **`rate-comparison/page.tsx:22`:** a literal `&apos;` inside a JS string rendered as "Bank of Canada&apos;s". Fixed.
2. **`self-employed-a-vs-b/page.tsx:164`:** the H1 "A-Lender" gradient was missing `bg-clip-text text-transparent`, so it showed a blue box behind the text. Fixed.
3. **Term > amortization:** clamped in rate-comparison, self-employed-a-vs-b and b-vs-equity.
4. **Mobile:** `p-8` → `p-5 sm:p-8` on the construction-pro, investment, self-employed and renewal cards; tighter construction draw rows (`min-w-0`); smaller gap for the HELOC stats row; result grids switched to 2 columns on mobile.
5. **`refinance-break-even`:** PDF "Remaining Term" (which was actually amortization) is relabelled; "Interest Saved" now names its horizon.
6. **`rent-vs-buy`:** the PDF shows the actual down payment, rent increase and closing/selling assumptions.
7. **`self-employed`:** no more long decimals in displayed income.
8. **`mortgage-penalty`:** schema placement fixed and an estimate-only line added under the result.
9. **`reverse-mortgage`:** hero font is responsive (`text-4xl sm:text-5xl`); "monthly income" is labelled as spread over N years, before interest.

**How everything was verified:** `node verify.mjs` → **71 passed, 0 failed**. `node before_after.mjs` reproduces the old (git HEAD) versus new numbers quoted above.

**Type check:** the full project `tsc` run stops on a syntax error in `amortization/page.tsx:56`, which is another agent's file and looks mid-edit. A tsc pass scoped to my files plus their imports (`tsconfig.calcb.json`) shows **0 errors in my files**. The only error is in `lib/calc/payment.ts:22` (TS7023, owned by calculators-residential-a; see O3).

---

## 3. Open issues (not fixed)

| # | Sev | Location | Issue | Suggested fix | Owner / why not fixed |
|---|---|---|---|---|---|
| O1 | high | `self-employed-a-vs-b` (`taxYears` default), `a-vs-equity` (`additionalTax = … × term`) | The "tax trap" assumes the extra income must be declared every year of the term. A-lenders usually average the 2 most recent NOAs, and there's no income re-check at renewal with the same lender, so the A-lender cost is overstated. I added an input (defaulting to the term), a caveat and a corrected article, but kept the default. | Default "years of extra declared income" to 2 and add the same input to a-vs-equity. | Product/marketing decision: it changes the page's headline claim. |
| O2 | high | `refinance-vs-heloc-vs-second` "Current Rates by Option" table (~line 540-575); `b-vs-equity` `bLenderData`/`equityLenderData` (lines 25-44) and "as of April 2025"; `a-vs-equity` article lender rates (Capital Direct 4.89%, Antrim 6.95%, etc.) | Hardcoded lender rates and fees from April 2025, now 18 months stale. Specific named-lender figures could mislead. | Source them from `/api/lenders` / `canadianLendersData`, or remove the specific numbers and point to the Rates page. | I can't verify current lender pricing, and the data files are the user's uncommitted work. |
| O3 | medium | `lib/calc/payment.ts:22` | TS7023: `payment()` calls itself for the 26-per-year case with no explicit return type. This appeared during calc-A's in-progress edit. | Add `: number` to the signature. | needs-owner: calculators-residential-a |
| O4 | medium | `lib/ai/tools/calculator-tools.ts:231-243`, `rate-tools.ts:193`, `mortgage-tools.ts:318`, `mortgage-tools.ts:280-291` | The AI refinance tool defaults the penalty to 3 months' interest even for fixed mortgages, and uses the interest-only difference as "monthly savings". The rate and max-principal tools use US monthly compounding. The construction tool's `monthlyAverage` divides by the last draw month instead of `result.constructionPeriodMonths`. Answers disagree with the calculators. | Reuse `lib/calc/payment` / `periodicRate`; take the IRD for fixed mortgages; use `constructionPeriodMonths`. | needs-owner: ai-voice |
| O5 | medium | `components/calculators/RelatedCalculators.tsx` `CALCULATOR_MAP` | Missing names for `refinance-cashout`, `port-vs-break`, `reverse-mortgage` (and `mortgage-qualifier`), so the raw slug is shown as link text. | Add the entries. | needs-owner: frontend-seo (shared component) |
| O6 | medium | `components/calculator-report/generateAvsBReport.ts:234-276` | The PDF's A-lender total ignores A's investment deduction, and it doesn't show the years of declared income. I pass a netted `aTotalCost` from the page as a workaround. | Add `aNetCost`/`bNetCost`/`taxYears` to the report `Results` and use them. | needs-owner: frontend (report generator) |
| O7 | medium | Defaults in port-vs-break (5.19), refinance-cashout (5.19), refinance-break-even (4.49), mortgage-penalty (4.49/4.39), rate-comparison (4.79–5.49), investment (5.45), construction-pro (7.25; prime is 4.45), reverse-mortgage (7.74), self-employed-a-vs-b (4.99/5.49), a-vs-equity (4.49/6.95), b-vs-equity (5.49/6.95), refi-vs-HELOC B-lender HELOC (8.49) and equity refi (6.95) | Static default rates; several are far from the live feed (for example 5.19 vs a live 5-yr conventional low of 4.39). | Seed defaults from `useLiveRates` (`benchmarks.fixed_5yr.conventional`, `raw_benchmarks.alt_5_year_fixed`, `prime_rate`, …) the way renewal does. | Scope; it's a UX/data decision. Listed as feature F1. |
| O8 | medium | All Group B pages | Variable-rate and HELOC products usually compound monthly, but all pages use the fixed-rate semi-annual convention (now stated in the notes). The difference is small (about 0.07% effective at 7%). | Add a compounding option where a variable rate is selected (penalty, port and renewal toggles). | Low impact. |
| O9 | low | `b-vs-equity` (`canQualifyB`, LTV); `a-vs-equity` (`loanPosition`) | "2nd mortgage" mode computes LTV from the second's amount only, not the combined LTV. The B-lender credit gate is 500+ while the table lists 550–680+. Equity loans are modelled as amortizing, though many are interest-only on 1–2 year terms (this is now disclosed). | Add a first-mortgage balance for 2nd position, an interest-only toggle and a configurable credit floor. | Larger UX change. |
| O10 | low | `renewal/page.tsx:44` | "Worth breaking early" needs break-even ≤ 12 months (an arbitrary rule of thumb) and uses the payment difference rather than interest saved over the months left. | Use net interest savings over the remaining term minus the penalty, as in refinance-break-even. | Defensible as conservative; left as is. |
| O11 | low | `rent-vs-buy` | One inflation rate for rent and ownership costs. Property tax isn't tied to home value. No provincial land transfer tax (it's a % input). Ontario PST on the CMHC premium and the 25-year horizon cap aren't modelled. | Import the group-A land transfer tax helper; separate cost-inflation input; optional chart. | Scope (feature F5). |
| O12 | low | `mortgage-penalty` | IRD is simplified (no present-value discounting, no prepayment-privilege reduction). 3 months' interest uses simple interest. Remaining term goes up to 120 months but there's no posted-rate guidance beyond 5 years. | Optional "prepay X% first" input, lender presets (F2). | Estimate disclaimer is present. |
| O13 | low | rate-comparison ("30+ lenders"), refinance-break-even / renewal PDF / A-vs-B report ("40+ lenders"), data has 144 lenders | Inconsistent marketing claims about lender count. | Settle on one figure site-wide. | Copy owner decision. |
| O14 | low | `reverse-mortgage` age curve | Mid-range figures from a broker site, not a lender schedule. The 7.74% default rate is unverified. Minimum home value and property type aren't modelled. | Replace with a lender table if HomeEquity Bank or Equitable publishes one; seed the rate from data. | No primary age table found (HomeEquity Bank states only "up to 55%"). |
| O15 | low | `investment` | No rental-income qualification view (50% add-back vs rental offset) and no GDS/TDS. | F4. | Scope. |
| O16 | low | `construction-pro` | Full-month interest in the draw month (conservative), simple monthly interest, no conversion to the permanent mortgage. | F12. | Disclosed. |
| O17 | low | Pages in this area | Each page has its own copy of `monthlyRate`/`interestOverMonths`. They're consistent now, but duplicated. | Add `interestOverMonths`/`balanceAfter` to a shared lib (calc-A has added `periodicRate` to payment.ts) and import it. | needs-owner: calculators-residential-a (lib/calc/payment.ts) |
| O18 | low | `port-vs-break` | "Additional Mortgage Needed" sits under "New Mortgage (If Breaking)" but applies to both options. `newHomePrice` state is unused. | Move the field; drop the unused state or add an LTV check. | Cosmetic. |
| O19 | low | `refinance-cashout` | Only maximum cash-out; no "amount I need" input; ignores penalty and fees (now disclosed). | F7. | Scope. |
| O20 | low | `refinance-vs-heloc-vs-second` | HELOC and second-mortgage qualification (stress test, income) isn't modelled. The private second is assumed to stay 5 years with no renewal fees (now disclosed). | Add annual renewal fee input. | Scope. |
| O21 | low | `self-employed-a-vs-b` defaults | The B−A spread of 0.50% is below the live alt median spread (about 0.9%; alt 5-yr median 6.09 vs conventional 5.20). | Seed from live data (F1). | Data decision. |
| O22 | low | `refinance-vs-heloc-vs-second` / `a-vs-equity` / `b-vs-equity` | Each page embeds its own `WebApplication` JSON-LD with a hardcoded address; other pages use `CalculatorSchema`. | Standardise on `CalculatorSchema`. | needs-owner: frontend-seo |
| O23 | low | `self-employed-a-vs-b` marginal rates (2025 brackets) | Fine as estimates, but the 2026 federal first-bracket rate is 14% and thresholds are indexed. | Refresh yearly or derive from income. | Low impact. |

---

## 4. Feature opportunities

| # | Title | User value | Builds on | Effort |
|---|---|---|---|---|
| F1 | Live-rate defaults everywhere | Results start from today's market, not 2025 numbers | `useLiveRates()` (`data.raw_benchmarks.alt_*`, conventional/insured, prime); renewal already does this | S |
| F2 | Lender-specific penalty presets | "Big bank (posted − discount)" vs "monoline (contract-based)" IRD; lump-sum prepayment before breaking | `mortgage-penalty` discount input; prepayment policies in `canadianLendersData` / `/api/lenders` | M |
| F3 | Blend-and-extend option | A third option beside port/break and renew/break that is often cheaper | `port-vs-break` `interestOver` segments | M |
| F4 | Rental-income qualification | Shows whether an investor qualifies (50% add-back vs rental offset, GDS/TDS at stress rate) | `lib/calc/investment`, `lib/calc/cmhc` `QUALIFYING_RATIOS`, `stressTestRate` | M |
| F5 | Rent vs buy v2 | Provincial land transfer tax + first-time-buyer rebates, net-worth chart, separate inflation inputs | group-A land transfer tax / closing-cost helpers, the new monthly simulation | M |
| F6 | Reverse mortgage vs HELOC vs downsizing | The real choice seniors face | reverse-mortgage page + refi-vs-HELOC math | M |
| F7 | Cash-out "amount I need" + debt consolidation savings | Converts the cash-out page into a consolidation pitch (card debt payments vs mortgage) | refinance-cashout + the article example already on refi-vs-HELOC | S |
| F8 | Shared amortization helper module | One source of truth; fewer bugs like the six negative-interest/compounding bugs found here | `lib/calc/payment.ts` `periodicRate` (calc-A) + `verify.mjs` checks | S |
| F9 | PDF lead capture on cash-out, port-vs-break and reverse-mortgage pages | These pages have no lead capture today | `PdfLeadModal` + `generateGenericReport` | S |
| F10 | Stated-income (B-lender) estimator | Bank-statement deposits × expense factor → stated income → max mortgage at B-lender GDS/TDS | self-employed page, `lib/calc/selfEmployed` | M |
| F11 | Shareable scenario links (non-personal numbers only in query string) | Brokers can send a client a pre-filled scenario | all Group B pages are client components with plain `useState` | M |
| F12 | Construction → permanent mortgage | Payment after completion, draw/inspection fees, holdbacks | `interestOnlyCost` timeline + `payment` | S |
| F13 | Fixed vs variable path comparison | Rate-path scenarios (flat / −1% / +1%) over the term | rate-comparison helpers | M |

---

## 5. Notes for the next agent

- **Line endings:** all calculator `page.tsx` files are **CRLF**; `lib/calc/*.ts` are LF. Exact multi-line `Edit`s against CRLF files can fail, so I used a small helper that normalises, replaces and restores CRLF: `…/scratchpad/calc-b/edit.cjs <file> <replacements.cjs>`. It refuses to write unless every snippet matches exactly once.
- **Math conventions used everywhere in Group B now:**
  - Monthly rate = `Math.pow(1 + r/100/2, 1/6) - 1`, identical to `lib/calc/payment.ts` `periodicRate(r, 12)`.
  - Interest over a term is **simulated** (`interestOverMonths`), never `payments − principal`.
  - Cost comparisons = interest + fees/penalty over the **same horizon and the same total debt**.
- **Live rates:** `useLiveRates()` exposes `data` (`RatesApiResponse`), including `data.benchmarks.fixed_5yr.conventional` and `data.raw_benchmarks.alt_5_year_fixed | alt_bfs_stated_income | alt_heloc | private_second`. The convenience `best5YrFixed` is the **insured** lowest, so don't use it for refinances (uninsured).
- **`lib/calc/payment.ts` is changing** (calc-A rewrote it during this session: returns 0 for non-positive principal or amortization; 26/yr = monthly ÷ 2, unrounded). Group B only calls it with 12 per year.
- **`cashflow()` return shape:** I added only fields (`cashOnCash`, `cashInvested`, optional `closingCosts` param), because `lib/ai/tools/mortgage-tools.ts` imports it. `interestOnlyCost()` gained an optional `periodMonths`; default behaviour is unchanged.
- **Verification scripts** in `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Documents-App-development-Kraft-Mortgages-Website\c08b2a6e-6cf7-4718-a778-3f74b27e3374\scratchpad\calc-b\`:
  - `verify.mjs`: 71 assertions. It extracts functions and `useMemo` bodies from the **live** page/lib sources with Node 24's `module.stripTypeScriptTypes` (`extract.mjs`) and compares them with `ref.mjs` reference math. Run with `node verify.mjs`.
  - `before_after.mjs`: runs git-HEAD copies (`head/*.tsx`) against the current code for the before/after figures.
  - `t_*.mjs`: one-off reference calculations used for the article and FAQ copy.
  - `tsconfig.calcb.json`: tsc config scoped to my files (`./node_modules/.bin/tsc --noEmit -p <path>` from `apps/web`).
- **Type check:** the full-project `tsc` currently fails early on a syntax error in `amortization/page.tsx:56` (another agent's file, possibly mid-edit). Re-run the full check once that's resolved.
- **Sources used:**
  - OSFI straight-switch change, effective Nov 21, 2024: [Canadian Mortgage Trends](https://www.canadianmortgagetrends.com/2024/09/osfi-to-end-stress-test-requirement-for-uninsured-mortgage-switches/), [Ratehub](https://www.ratehub.ca/blog/breaking-news-osfi-drops-stress-test-requirement-for-mortgage-renewal-switches/)
  - Insured secondary-suite refinance (90% LTV, as-improved value under $2M, effective Jan 15, 2025): [Department of Finance](https://www.canada.ca/en/department-finance/news/2024/10/mortgage-insurance-rule-changes-to-enable-homeowners-to-add-secondary-suites.html)
  - HELOC ≤ 65% LTV, legal maximum 80% for uninsured: [OSFI B-20 clarification](https://www.osfi-bsif.gc.ca/en/node/467)
  - Dec 15, 2024 insured changes ($1.5M cap, 5%/10% tiers, 30-year amortization for first-time buyers and new builds): [Ratehub](https://ratehub.ca/blog/breaking-news-30-year-amortizations-for-all-first-time-home-buyers-insured-mortgages-up-to-1-5-million)
  - Prepayment penalties (greater of 3 months' interest or IRD, posted vs discounted comparison rate): [FCAC briefing](https://www.canada.ca/en/financial-consumer-agency/corporate/transparency/briefing-packages-parliamentary-committee-appearances/standing-committee-finance-july-7-2020/prepayment-penalties.html)
  - Self-employed 2-year average / lower-of rule and line 15000: [nesto](https://www.nesto.ca/mortgage-basics/self-employed-mortgage-options-qualifications-in-canada/), [rates.ca](https://rates.ca/guides/mortgage/self-employed)
  - Reverse mortgage up to 55%, age 55+: [HomeEquity Bank CHIP](https://www.homeequitybank.ca/chip-reverse-mortgage/); age illustration: [wealthnorth.ca](https://wealthnorth.ca/mortgages/mortgage-types/reverse-mortgage-canada/) (secondary source)
