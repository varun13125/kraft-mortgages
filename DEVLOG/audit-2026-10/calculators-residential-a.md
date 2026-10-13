# Audit: Residential Calculators, Group A (core purchase and qualification math)

- **Date:** 2026-10-12
- **Agent:** calculators-residential-a
- **Scope:** 15 calculators, the calculators index, `/qualify`, `lib/calc/{payment,affordability,cmhc}.ts`, `ValidatedInput`, `lib/validators.ts`, `lib/utils/validation.ts`
- **New files:** `lib/calc/landTransferTax.ts`, and a metadata `layout.tsx` for six calculators (details under F14)
- **Type check:** Full `tsc --noEmit -p .` gives 0 errors in my files. The 9 errors that remain are all in `app/(site)/construction/calculators/construction-draw/page.tsx`, which another agent owns and is still editing. No `isDormant` errors appeared in this run.
- **Verification scripts:** `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Documents-App-development-Kraft-Mortgages-Website\c08b2a6e-6cf7-4718-a778-3f74b27e3374\scratchpad\calc-a\` (described in §5)

## Sources used (all checked Oct 2026)

| Topic | Source |
|---|---|
| CMHC premium table and PST on premiums (ON/QC/SK, cannot be financed) | [CMHC: Mortgage loan insurance cost](https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/cmhc-mortgage-loan-insurance-cost) |
| $1.5M insured price cap; 30-year insured amortization for first-time buyers and new builds (Dec 15, 2024) | [Finance Canada: Boldest mortgage reforms](https://www.canada.ca/en/department-finance/news/2024/09/the-boldest-mortgage-reforms-in-decades.html) |
| 0.20% premium surcharge for amortizations over 25 years | Third-party sources only, e.g. [Finmo](https://help.finmo.ca/en/articles/13604594-how-the-cmhc-30-year-amortization-premium-surcharge-0-20-is-applied-in-finmo). Confirm with the insurers. |
| Stress test: greater of contract rate + 2% or 5.25%, unchanged in 2026 | [OSFI MQR page](https://www.osfi-bsif.gc.ca/Eng/fi-if/in-ai/Pages/mqr-nfo.aspx); 2026 reporting |
| Straight switches of uninsured mortgages exempt from the stress test since Nov 21, 2024 | [Ratehub](https://www.ratehub.ca/blog/breaking-news-osfi-drops-stress-test-requirement-for-mortgage-renewal-switches/), [MoneySense](https://www.moneysense.ca/spend/real-estate/stress-test-uninsured-mortgage-holders) |
| BC first-time buyer PTT exemption: $835k / $860k thresholds; exempt on first $500k only. Formula checked against the gov table ($852k → $2,560) | [gov.bc.ca first-time buyers](https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers), [current amounts](https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount) |
| BC SVT rates by tax year: 2019–25 2% / 0.5%; 2026 3% / 1%; 2027 4% / 1% | [gov.bc.ca SVT tax rates](https://www2.gov.bc.ca/gov/content/taxes/speculation-vacancy-tax/how-tax-works/tax-rates) |
| BC SVT taxable areas | [gov.bc.ca taxable areas](https://www2.gov.bc.ca/gov/content/taxes/speculation-vacancy-tax/how-tax-works/taxable-areas) |
| BC SVT principal-residence and tenancy exemptions | [gov.bc.ca exemptions for individuals](https://www2.gov.bc.ca/gov/content/taxes/speculation-vacancy-tax/exemptions-speculation-and-vacancy-tax/individuals) |
| Toronto MLTT: rates above $3M are 4.40/5.45/6.50/7.55/8.60% from Apr 1, 2026; first-time rebate max $4,475 | [toronto.ca MLTT rates](https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/), [MLTT rebates](https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rebate-opportunities/) |
| Alberta Land Titles fees: $50 + $5 per $5,000 for transfers and mortgages since Oct 20, 2024; mortgage-fee reduction repealed Jan 31, 2025 | [Bennett Jones](https://www.bennettjones.com/Blogs-Section/Open-Your-Wallets-Wider-Increases-to-Alberta-Land-Transfer-and-Mortgage-Registration-Fees-Coming), [Cassels](https://cassels.com/insights/increased-costs-for-registering-a-mortgage-at-the-alberta-land-titles-office-effective-january-31-2025/) |
| First-Time Home Buyers' GST rebate: full GST (max $50k) on new homes up to $1M, phased out to $1.5M, tops up the existing new housing rebate; Bill C-4 Royal Assent Mar 12, 2026 | [CRA FTHB GST/HST rebate](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/gst-hst-rebates/first-time-home-buyers-gst-hst-rebate), [UrbanToronto](https://urbantoronto.ca/news/2026/03/federal-gst-relief-first-time-buyers-comes-force-bill-c-4.60577) |

---

## 1. Scope & inventory

All pages are `"use client"` pages under `apps/web/app/(site)/calculators/<slug>/page.tsx`. "After" is the state once this audit's fixes were applied.

| Calculator | What it computes | Formula / helper (after) | State before |
|---|---|---|---|
| affordability | GDS/TDS at the qualifying rate for a given loan; new: estimated maximum mortgage | `lib/calc/payment` (`payment`, `principalFromPayment`), `lib/calc/affordability` | 100% of condo fees counted; no max-mortgage figure |
| payment | Monthly and accelerated bi-weekly payment, interest saved, years saved | `payment`, `biweeklySavings` | Correct compounding. Savings figure misleading; no nav header |
| amortization | Full monthly schedule with optional extra payment | `payment`, `periodicRate` | US monthly compounding |
| extra-payments | Original vs accelerated schedule (extra monthly + annual lump sum) | `payment`, `periodicRate` | US compounding; lump sum applied only once |
| stress-test | Qualifying rate, payment, income needed (GDS/TDS) | `payment`, `cmhc` | US compounding; TDS and condo unit errors; no premium |
| mortgage-qualifier | Pass/fail for a given home: stress test, premium, GDS/TDS, minimum down, LTT, cash to close, max price | `payment`, `cmhc`, `landTransferTax` | Stale $1M rule; wrong BC/ON/AB LTT; max price used TDS only |
| debt-service-ratio | GDS/TDS from a manual payment or a purchase; max mortgage | `payment`, `cmhc` | 32/40 pass thresholds vs 39/44 elsewhere; US compounding |
| required-income | Income needed for a purchase; max mortgage and price for an income | `payment`, `principalFromPayment`, `cmhc` | **Rate in % divided by 12 → nonsense output** |
| pre-approval | Max purchase price and loan from income, debts, down %, credit tier | `payment`, `principalFromPayment`, `cmhc`, `useLiveRates` | Premium on top of the qualifying max; stale hardcoded rates |
| down-payment | Minimum down payment, insurance premium, mortgage | `cmhc.minimumDownPayment` | Wrong >$1M rule; premium counted as cash |
| cmhc-insurance | Premium tier, payment impact, upfront vs financed | `cmhc.cmhcPremiumRate`, `payment` | US compounding; no 30-yr surcharge |
| first-time-home-buyer | FHSA tax savings, HBP, LTT relief, GST rebate, premium | `cmhc`, `landTransferTax` | Wrong BC exemption; missing 2026 FTHB GST rebate |
| closing-costs | Itemized closing costs and cash needed (BC/AB/ON) | `landTransferTax`, `cmhc` | Wrong BC exemption; ON refund missing; premium counted as cash |
| land-transfer-tax | BC PTT, ON LTT, Toronto MLTT, AB fees, first-time relief | `landTransferTax` | Several regulatory errors (F8) |
| bc-speculation-tax | Annual SVT by ownership, occupancy, region, tax year | Local rate table (`SVT_RATES`) | Stale rates; exemption logic wrong |
| `calculators/page.tsx` | Index of calculators | — | 7 existing calculators not listed |
| `qualify/page.tsx` | Multi-step lead form with a rate strip | `useLiveRates` | "UPDATED TODAY" shown even on fallback rates |

**Shared helpers after the audit**

- **`lib/calc/payment.ts`**
  - `periodicRate`: per-period rate with semi-annual compounding.
  - `payment`: 26 per year means accelerated bi-weekly (monthly ÷ 2).
  - `principalFromPayment`: inverse of `payment`.
  - `balanceAfter`: closed-form balance and interest after k months (added for group B's O17).
  - `biweeklySavings`: now also returns `totalInterestSaved`, `payoffYearsBiweekly` and `yearsSaved`.
- **`lib/calc/affordability.ts`:** `stressTestRate`, and `gdsTds`, which now returns Infinity when income ≤ 0.
- **`lib/calc/cmhc.ts`:**
  - Constants: `INSURED_PRICE_CAP`, `LONG_AMORTIZATION_SURCHARGE`, `PREMIUM_PST_RATES`.
  - Functions: `minimumDownPayment`, `isInsurable`, `cmhcPremiumRateByLtv` (full LTV table, including 4.50% for a non-traditional down payment), `cmhcPremiumRate(downPct, amortYears?)`, `cmhcPremium(price, down, amortYears?)`, `premiumPst`, `insuredMortgageAmount`.
  - Kept as before: `stressTestRate` and `QUALIFYING_RATIOS`.
- **`lib/calc/landTransferTax.ts` (new):** `bcPropertyTransferTax`, `bcFirstTimeBuyerExemption`, `ontarioLandTransferTax`, `torontoMunicipalLandTransferTax`, `albertaRegistrationFee`, and a combined `landTransferTax({price, province, firstTime, toronto, mortgageAmount})`.

---

## 2. Fixed

Severity is the impact of the original bug. "Verified" refers to the scripts in §5. Script 04 re-runs each page's post-fix formulas.

### Critical

**F1. required-income: interest rate in percent was divided by 12**
- **Where:** `required-income/page.tsx:26` (`monthlyPayment`), `:83` (limits), `:108-114` (max price)
- **Bug:** `r = annualRate / 12` was applied to a percent such as 6.79, which is a 56%-per-month rate.
- **Before/after on the defaults** ($700k, 20% down, 4.79%):

  | | Before | After |
  |---|---|---|
  | Stress payment | $316,866.67/mo | $3,849.99/mo |
  | Required income | ≈ $10,880,114 | $132,923 |

  The Max Mortgage tab was effectively $0.
- **Also wrong:**
  - Ratio limits were 32/40 (insured) and 35/42 (conventional). They are now 39/44 from `QUALIFYING_RATIOS`.
  - "Max home price" added the down payment for a *different* price and ignored the premium inside the max loan. It now strips the premium and grosses up by the down-payment %, and warns when that % is below the legal minimum at the resulting price.
  - Copy fixes: the stress-test payment difference was "$300-400"; it is ~$590/mo on $500k. A $400 car payment was said to be worth "$80k" of mortgage; it is ~$58k. The JSON-LD claimed "reverse mortgage qualification".
- **Verified:** script 01 shows the bug. Script 04 checks the $3,849.99 payment and round-trips income → max price → the input price, for both an insured and a conventional case.

**F2. down-payment: wrong minimum above $1M, and premium counted as cash**
- **Where:** `down-payment/page.tsx:20`, `:66`, breakdown block, FAQ and article; `down-payment/layout.tsx` description
- **Minimum down payment:** the code used 5% / 10% / "20% on the portion over $1M". That was never the law, and the $1M cap became $1.5M on Dec 15, 2024.
  - $1.2M home: was $115,000 (the article said $195,000); now $95,000.
  - $1.5M or more: now 20% of the full price.
- **Cash to close:** "Total Cash Needed to Close" added the insurance premium, but the premium is financed. At $700k with the minimum down: was $71,200, now $45,000. The page now labels this as the down payment and links to the Closing Costs calculator.
- **Display bug:** the breakdown rendered "$$500,000".
- **Also added:** a below-minimum warning for custom amounts.
- **Verified:** script 02 (`minimumDownPayment` tiers and $1.5M jump); script 05 (before/after).

**F3. BC first-time buyer exemption was applied to the whole tax (four calculators)**
- **Where:** `land-transfer-tax`, `closing-costs`, `first-time-home-buyer`, `mortgage-qualifier`
- **Bug:** every implementation zeroed the entire PTT up to $835k. The exemption only covers the first $500k (max $8,000) and phases out proportionally to $860k.

  | Price | Before | After |
  |---|---|---|
  | $650k (LTT page default) | $0 | $3,000 |
  | $750k | $0 | $5,000 |
  | $550k (FTHB page) | $9,000 "saved" | $8,000 |

- **Fix:** all four now call `bcFirstTimeBuyerExemption` in the new `lib/calc/landTransferTax.ts`.
- **Verified:** script 02 checks the gov.bc.ca table points ($852k → $2,560; $855k → $1,600; $859k → $320).

### High

**F4. stress-test: unit errors in TDS and condo fees, US compounding, no premium, reversed switch rule**
- **Where:** `stress-test/page.tsx:19`, `:64-78`, FAQ and article
- **TDS:** `(housing×12 + otherDebts)/0.44` added *monthly* debts as if annual. With $500/mo debts the TDS income was $117,953; it is now $129,545.
- **Condo fees:** monthly fees were divided by 12 again. $400/mo counted as $16.67 instead of $200.
- **Compounding:** used US monthly compounding.
- **Insurance:** with under 20% down, the premium was not added to the qualifying loan. It is now, including the 30-year surcharge, with minimum-down and 30-year eligibility warnings.
- **Copy:** the page claimed switches at renewal "must pass the stress test since June 2023". OSFI removed that requirement for straight switches on Nov 21, 2024. Also removed the "BoC benchmark" wording and fixed the "2018" history line.
- **Verified:** script 04 (`stress()` checks).

**F5. debt-service-ratio: thresholds, qualifying rate, compounding, premium table**
- **Where:** `debt-service-ratio/page.tsx:41-49`, `:76-84`, `:112-115`, `:364`, labels and copy
- **Inconsistent limits:** pass/fail used 32% / 40% labelled "CMHC limit". The max-mortgage math and the PDF used 39/44. Now 39/44 throughout; the old 35/42 box is relabelled "Stricter lender guidelines".
- **Wrong rate:** auto mode computed the payment at the *contract* rate. It now uses the qualifying rate.
- **Compounding:** US compounding replaced by the shared helper.
- **Hardcoded rate:** the text said "assuming 5.34% stress test rate"; it now shows the actual rate.
- **Premium table:** a local table with fabricated 1.5% and 4.2% tiers is replaced by the shared helper.
- **Copy:** FAQ and article claimed CMHC limits of 32/40 and a "Bank of Canada benchmark".

**F6. mortgage-qualifier: stale rules, wrong LTT, verdict and max-price errors**
- **Where:** `mortgage-qualifier/page.tsx:18-30`, `:60-106`, verdict and cash blocks
- **Minimum down:** used the old $1M rule ($1.2M needed $240k instead of $95k).
- **LTT errors:**
  - BC: whole-tax exemption (F3).
  - Ontario: refund used $4,475 instead of $4,000.
  - Alberta: invented a first-time exemption and a $500 cap, at $1 per $5k. Now $50 + $5 per $5k on the transfer plus the mortgage, with no first-time exemption.
- **Verdict:** said "You likely qualify!" even when the down payment was illegal.
- **Max purchase price:** used TDS only (ignored GDS) and an approximate premium. It now bisects for the largest price where:
  - the loan (including premium and 30-year surcharge) is within both 39% and 44% at the qualifying rate, and
  - the down payment is still legal.
- **Cash to close:** added the 8% Ontario PST on the premium.
- **Verified:** script 04.
  - Defaults: max price $670,229. At that price GDS is 39.00% and TDS is 43.00%.
  - $40k down, high income: price is capped at $650,000 by the minimum-down rule.

**F7. pre-approval: premium on top of the max, ratios at contract rate, stale rates**
- **Where:** `pre-approval/page.tsx:40-50`, `:56`, `:86-122`, display and PDF
- **Premium on top:** the premium was added *on top of* the qualifying maximum. Under the old logic the real TDS was 44.82% while the page said "qualifies".
- **Ratios:** computed at the contract rate, so they always passed. Ratios are now qualifying ratios at the stress rate.
- **Rates:** hardcoded 5.49–6.89%. The same credit-tier spreads now sit on the live `best5YrFixed`.
- **Other fixes:**
  - Condo fees counted at 100% (now 50%).
  - No minimum-down cap: 5% down could produce a $1M+ price. Now capped at $500k for 5%, at `25000/(0.10−d)` between 5% and 10%, and below $1.5M otherwise.
  - Prices displayed with float decimals.
  - The PDF "Down Payment" showed "$0".
  - Credit slider maximum was 850; now 900.
  - The PDF button had no gutter on mobile.
- **Verified:** script 04 (ratios ≤ 39/44 at the max; 5% and 7% caps).

**F8. land-transfer-tax: several regulatory errors**
- **Where:** `land-transfer-tax/page.tsx:20-30`, `:40-70`, copy at `:272-291`
- **BC over $3M:** the further 2% on the residential portion above $3M was missing. $4M was $98,000; it is now $118,000. The copy also wrongly said this tax applied only to foreign buyers and satellite families.
- **Ontario refund:** $4,475 replaced by $4,000.
- **Toronto MLTT:** simply mirrored the provincial tax.
  - Added the tiers above $3M (Apr 1, 2026 rates): $5M was $111,475, now $159,975.
  - Added the Toronto first-time rebate (max $4,475).
- **Alberta:** fee was $50 + $1 per $5k. Now $50 + $5 per $5k ($650k: $180 → $700). The page notes the mortgage fee is extra.
- **Copy:** "paid from the proceeds of your sale" was wrong for a buyer.
- **Verified:** script 02 (BC, ON, Toronto and AB tables).

**F9. closing-costs: wrong LTT relief, premium counted as cash**
- **Where:** `closing-costs/page.tsx:20`, `:84-130`, copy
- **LTT:** BC exemption (F3). The Ontario first-time refund was never applied ($700k: $10,475 → $6,475). Alberta returned $0 and now returns the transfer and mortgage fees.
- **Premium:** the insurance premium was counted in "Total Closing Costs" and "Total Cash Needed". It is now shown as financed and excluded. Ontario PST on the premium is now included because it is paid in cash.
- **Labels:** the premium note read "$10% down".
- **Property tax:** the adjustment was a full year of tax; it is now a ~6-month proration with a note.
- **Copy:** claimed "$0 LTT at $700k" and "save up to $14,700 / $13,000"; called Alberta "the only province without LTT"; referenced the defunct First-Time Home Buyer Incentive as current.
- **Mobile:** province buttons got smaller side padding.

**F10. bc-speculation-tax: stale rates, wrong exemptions, region ignored**
- **Where:** `bc-speculation-tax/page.tsx:21-45`, controls and copy
- **Rates:** citizens/PRs were taxed at 0.5% and others at 2%. For the 2026 tax year (today's year) the rates are 1% and 3%; 2027 is 4%. A 2025/2026/2027 tax-year selector now applies the gov.bc.ca table.
  - $1M vacant, Canadian owner: $5,000 → $10,000 (2026).
- **Satellite family:** the "untaxed worldwide earner / satellite family" status was not modelled; it now has a checkbox.
- **Principal residence exemption:** was granted to foreign owners. It now applies only to citizens/PRs who are BC tax residents and not untaxed worldwide earners.
- **Rentals:** "1yr+" was wrong; the requirement is at least 6 months of the year.
- **Region:** the selector did nothing. It now has an "Outside SVT areas" option, and the taxable-area list is updated.
- **Copy:** "no retroactive exemption" removed.

**F11. first-time-home-buyer: wrong LTT and GST math, stale copy**
- **Where:** `first-time-home-buyer/page.tsx:20-48`, `:58-110`, results, PDF and copy
- **GST rebate:** the 2026 First-Time Home Buyers' GST rebate was missing. A $800k new build showed $0 and now shows $40,000. The copy said the old rebate phased out at $800k (it phases out at $450k).
- **LTT:** BC exemption (F3); Ontario via the shared helper.
- **FHSA:** tax savings showed one year's deduction next to "$X contributed over N years". It now applies the marginal rate to the full contribution ($55k savings at 28%: $2,240 → $11,200).
- **Down payment:** the shared premium rate replaces the old `<5% → 0` behaviour, with a below-minimum warning.
- **PDF:** "Gap to Purchase" (mortgage − savings, meaningless) is replaced with the down-payment %.
- **Links:** "Stress Test Calculator" pointed to `/calculators/pre-approval`.
- **Copy:** BC $500k/$525k, Ontario $4,475, Alberta $1 per $5k. "Effective Down Payment" was relabelled to make clear the benefits are not all cash at closing.

**F12. cmhc-insurance: compounding, missing surcharge, wrong premium range**
- **Where:** `cmhc-insurance/page.tsx:18-34`, `:76-78`, results, PDF and FAQ
- **Compounding:** US compounding ($700k, 10% down, 4.79%: $3,718.04 → $3,700.43).
- **Surcharge:** no 0.20% for 30 years (10% down: $19,530 → $20,790).
- **Insurability:** no check for the minimum down payment or the $1.5M cap.
- **PDF:** said premiums "range from 4% to 15%".
- **FAQ:** said insurers are "required by law" to price alike, and stated a "20% on portion over $1M" rule.
- **Added:** an Ontario PST note.

**F13. lib/calc/cmhc.ts: rules the pages needed were missing or wrong**
- **Where:** `lib/calc/cmhc.ts:36-120`
- **Fabricated tier:** a 4.20% "<5%" tier. Below 5% now returns 4.00% for display only, and callers flag it.
- **Missing pieces:** no $1.5M cap or minimum-down helper, no LTV table, no 30-year surcharge, no PST helper. All added as optional parameters, so existing callers are unaffected.
- **Verified:** script 02 (tier boundaries, LTV table, surcharge, $19,530 example, PST).

**F14. Six calculators had no metadata layout and inherited the homepage canonical**
- **Where:** new `layout.tsx` in `affordability`, `payment`, `mortgage-qualifier`, `pre-approval`, `first-time-home-buyer`, `land-transfer-tax`
- **Bug:** these client pages inherited the root metadata: title "Kraft Mortgages Canada Inc. | Mortgage Broker Surrey" and **canonical `https://www.kraftmortgages.ca`**. Search engines could treat them as duplicates of the homepage.
- **Fix:** each folder now has a `layout.tsx` with its own title, description, canonical and Open Graph tags, following the existing `amortization/layout.tsx` pattern.

### Medium

**F15. amortization: compounding and stale copy**
- **Where:** `amortization/page.tsx:26-41`, FAQ, article
- US compounding: $500k at 4.39% was $2,748.04/mo; correct is $2,736.87.
- FAQ said insured mortgages are capped at 25 years; 30 is allowed for first-time buyers and new builds.
- The 25- vs 30-year FAQ said "$50–80k / $300–400 more"; the correct figures are ~$88k and ~$240.
- The 20-year example figures were off.
- The switch-rule wording was wrong.

**F16. extra-payments: compounding, lump sum, display and copy**
- **Where:** `extra-payments/page.tsx:24-70`, `:224-232`, `:257`, copy
- US compounding.
- "Annual Lump Sum" was applied only once. It now applies every year from the start year, with help text on typical 10–20% limits.
- Payoff is now tracked inside one loop instead of a duplicate loop.
- "Time saved" was blank when there was no saving.
- The five "Year N" buttons overflowed at 375px (now a 5-column grid with smaller text on mobile).
- Copy: "$55k / 4 years" → ~$50k / ~3 years; "60% interest" → ~67%.
- **Verified:** script 04 (no extras gives 300 months and $0 saved; $200/mo saves $50,018 and 35 months).

**F17. affordability: condo fees, missing maximum, labels, validation**
- **Where:** `affordability/page.tsx:36-49`, inputs and results
- **Condo fees:** counted at 100% in GDS; now 50%.
- **Maximum mortgage:** the page promised "your qualifying mortgage amount" but only tested a typed principal. It now shows an estimated maximum mortgage.
- **PDF:** labelled the typed principal "Maximum Mortgage Amount".
- **Validation:** property tax below $1,000 and heat below $600 were rejected as invalid.
- **Other:** amortization was hardcoded at 25 years (now a slider with a 30-year eligibility note); rates printed as floats.

**F18. payment page: header, savings figure, labels**
- **Where:** `payment/page.tsx:7-8`, `:51-58`, results
- **Header:** the page had no `<Navigation />`.
- **Savings:** "save $X annually" showed 3 raw decimals and was really total savings ÷ amortization. It now shows lifetime interest saved and years saved.
- **Labels:** "% APR" was a mislabel; there is now a note that payments assume semi-annual compounding.

**F19. payment.ts: bi-weekly rounding, zero-rate and negative-principal cases**
- **Where:** `lib/calc/payment.ts:22-35`, `biweeklySavings`
- **Bi-weekly rounding:** the monthly payment was rounded to the dollar before halving ($1,454.00 instead of $1,454.01).
- **0%:** the 26-per-year branch returned NaN at 0%.
- **Negative principal:** returned a negative payment; now returns 0.
- **TS7023:** recursion with no return type (group B's O3).
- **Verified:** script 02 (2,908.02, 1,454.01, 0% cases, inverse).

**F20. qualify: "UPDATED TODAY" claim**
- **Where:** `qualify/page.tsx:731`
- The banner claimed "CURRENT VERIFIED MORTGAGE RATES • UPDATED TODAY" even when the page showed fallback rates. It now says that only when `isToday` is true, and "indicative" otherwise.

**F21. calculators index: missing calculators**
- **Where:** `calculators/page.tsx:136-148`, list end
- Seven existing calculators were not listed: mortgage-qualifier, pre-approval, renewal, port-vs-break, refinance-cashout, reverse-mortgage, construction-pro. All routes were checked to exist.

### Low

**F22. lib/utils/validation.ts: NaN/Infinity display and credit score range**
- **Where:** `lib/utils/validation.ts:75,88,96,136`
- `formatCurrency`, `formatPercentage` and `formatNumber` rendered "$NaN" and "Infinity%"; they now return "—".
- Credit score maximum was 850; it is 900 for Canadian bureaus.

**F23. affordability.ts: zero income**
- **Where:** `lib/calc/affordability.ts:12`
- `gdsTds` returned NaN or Infinity for income ≤ 0 and could "pass". It now returns Infinity, which always fails.

**F24. ValidatedInput: stale values not disclosed**
- **Where:** `ValidatedInput.tsx:122-129`
- Invalid entries are never passed to `onChange`, so results silently used the last valid value. A hint now names the value in use.

**Counts:** 24 fix entries (3 critical, 11 high, 7 medium, 3 low). F3 alone touched four pages.

---

## 3. Open issues (not fixed)

| # | Sev | Where | Description | Suggested fix | Owner | Why not fixed |
|---|---|---|---|---|---|---|
| O1 | high | `qualify/page.tsx:~600-714` | The form triggers an automated AI outbound call ("Julia"). It only shows a disclaimer: no explicit consent checkbox and no consent flag in the payload. CRTC ADAD / CASL risk. Overlaps ai-chat-voice O17. | Add a required consent checkbox with exact wording and send `consent: {text, timestamp}`. The backend should refuse to dial without it. | needs-owner: backend/compliance (contact API) | Legal wording and API contract decision |
| O2 | high | `app/(site)/calculators/page.tsx` (index) | Client page with no metadata. It inherits the homepage title and canonical. | Add metadata for `/calculators`, e.g. move the page body to a client component and export `metadata` from a server `page.tsx`. A `calculators/layout.tsx` would cascade to every child route. | needs-owner: frontend-seo | A layout at that level affects other owners' routes |
| O3 | medium | `lib/ai/tools/mortgage-tools.ts:65-110` | AI affordability tool: 100% of condo fees in GDS; max principal from GDS only; assumes 20% down. Answers disagree with the calculators. | Reuse `principalFromPayment`, apply 50% condo, take min(GDS, TDS). | needs-owner: ai-voice | Not my file |
| O4 | medium | `components/calculators/RelatedCalculators.tsx` | `CALCULATOR_MAP` lacks `mortgage-qualifier`, so the raw slug shows (also group B O5). | Add the entry. | needs-owner: frontend-seo | Shared component |
| O5 | medium | `pre-approval/page.tsx:40-45` | Credit-tier spreads (+0.20 / +0.40 / +0.70 / +1.40) are illustrative, not market data. Now anchored to the live rate but still invented. | Drive tiers from the rates feed or lender data, or let the user edit the rate. | product | Needs a data source |
| O6 | medium | `land-transfer-tax`, `closing-costs` | Not modelled: BC newly-built home exemption (≤ $1.1M, phase-out to $1.15M); BC 20% foreign buyer tax; Ontario 25% NRST; Toronto toggle on closing costs. | Extend `lib/calc/landTransferTax.ts` and add toggles. | me / next agent | Scope; feature-sized |
| O7 | medium | `first-time-home-buyer/page.tsx` | Ontario's HST rebate for first-time buyers of new homes (up to $80k) is mentioned in copy but not computed. GST-rebate eligibility (agreement and construction dates) is assumed. The `annualIncome` input is unused. | Add the ON rebate once the parameters are verified; add an eligibility question; use income for an affordability check. | me / next agent | Ontario phase-out parameters not verified |
| O8 | medium | `required-income` Max Mortgage tab | Uses the down % from the Income tab; there is no "savings available" input. | Add a down-payment-dollars input and bisect as in mortgage-qualifier. | me / next agent | Feature-sized |
| O9 | low | `payment/page.tsx` quick picks | Variable and HELOC rates are amortized with semi-annual compounding. HELOCs are interest-only. | Monthly compounding for variable; drop or relabel HELOC. | me | Product choice |
| O10 | low | `stress-test/page.tsx:~273`, `down-payment`, `required-income`, `cmhc-insurance` copy | Marketing claims "40+ lenders" (the data has 144), "18+ years", "$2 billion funded". | Verify and standardise. | needs-owner: content/marketing | Not math; facts unknown |
| O11 | low | `qualify/page.tsx:9` | `export const dynamic = "force-dynamic"` in a `"use client"` page is ignored. | Remove, or move to a server layout. | needs-owner: platform | Build-config change |
| O12 | low | `lib/calc/landTransferTax.ts` `albertaRegistrationFee` | Assumes "$5 per $5,000 **or part thereof**" (rounds up). | Confirm with the Alberta Land Titles fee calculator. | me | Not verified on alberta.ca |
| O13 | low | `bc-speculation-tax` | SVT tax credits for BC residents and detailed tenancy rules (tenancy length, arm's length) are not modelled. | Add a credits section and rule details. | me | Not verified |
| O14 | low | `debt-service-ratio` manual mode | Users may enter the contract-rate payment, which understates ratios. Help text added. | Offer "calculate at qualifying rate" from balance and rate. | me | UX redesign |
| O15 | low | `down-payment` (`downPaymentOverride`), FTHB (`annualIncome`), `mortgage-qualifier` (`BUSINESS` import) | Dead state and imports. | Remove. | me | Cosmetic |
| O16 | low | `pre-approval` | Hardcoded 25-year amortization. | Add an amortization selector with the surcharge. | me | Scope |
| O17 | low | `closing-costs` | Legal, inspection and title costs are fixed and not province-specific; property tax uses a 0.4–0.5% heuristic. | Province defaults and editable rows. | me | Scope |
| O18 | low | `cmhc-insurance` | No province selector for premium PST (text note only). | Add a province toggle using `premiumPst`. | me | Scope |

**Counts:** 18 open (2 high, 6 medium, 10 low). Six are `needs-owner` outside my files: O1, O2, O3, O4, O10, O11.

---

## 4. Feature opportunities

| Title | User value | Builds on | Effort |
|---|---|---|---|
| Unit tests with `node --test` (no new deps) | Locks in the Canadian math; stops another round of US-compounding or stale-rule bugs | Scripts 02/04 in the scratch folder. `lib/calc/*.ts` have no path aliases, so Node 24 can import them directly. | S |
| One "purchase scenario" across calculators (price, down, rate, province, first-time) carried via URL params or Zustand | Users stop retyping; smoother path from qualifier to closing costs to lead form | Zustand is already a dependency; the payment page already reads `?rate=` | M |
| Payment-frequency selector (monthly, semi-monthly, bi-weekly, accelerated weekly) | Matches what lenders actually offer | `payment(..., paymentsPerYear)`, `biweeklySavings` | S |
| Term-end balance and renewal preview on the amortization page | "What will I owe at renewal?" is a top broker question and a lead hook | `balanceAfter` (new) | S |
| CSV export of the amortization schedule | Power users and realtors | `buildSchedule` | S |
| Province-complete closing costs: Toronto MLTT toggle, BC new-build exemption, foreign-buyer taxes, Alberta mortgage fee | Accurate cash-to-close for all three provinces | `lib/calc/landTransferTax.ts` | S–M |
| Max price from savings and income (combined qualifier) | Answers "what can I buy?" in one step | Bisection in `mortgage-qualifier`, `isInsurable`, `minimumDownPayment` | S |
| Lender-tier pricing from real data | Realistic pre-approval rates by credit band | Rates feed (`useLiveRates`), `data/canadianLendersData.ts` (read-only) | M |
| Pass/fail on stress-test using actual income | The page says "see if you qualify" but only shows income needed | Stress-test page state plus `gdsTds` | S |
| BC SVT credit estimator | Accurate bills for BC residents with partial exemptions | SVT page and the gov rate table | S |

---

## 5. Notes for the next agent

**Conventions**
- **Always use `lib/calc/payment.ts`.** Don't write a local `monthlyPayment`.
  - `periodicRate(r, 12) = (1 + r/200)^(1/6) − 1`.
  - `payment({paymentsPerYear: 26})` returns **accelerated** bi-weekly (monthly ÷ 2). Other frequencies return the true periodic payment.
  - `payment` returns 0 for non-positive principal or amortization.
- **Rate units:** every helper takes the annual rate in **percent** (5 for 5%). The cmhc-insurance page's local wrapper takes a decimal and multiplies by 100. Watch for this; F1 was exactly this bug.
- **Insurance rules:** use `minimumDownPayment` and `isInsurable` from `lib/calc/cmhc.ts`. At $1.5M or more insurance is unavailable and 20% of the full price is required. `cmhcPremiumRate(downPct, amortYears?)` adds 0.20% when amortization is over 25 years.
- **The premium is financed.** Never add it to cash-to-close. Only Ontario, Quebec and Saskatchewan PST on the premium is cash (`premiumPst`).
- **Ratios:** GDS/TDS limits are 39/44 (`QUALIFYING_RATIOS`). GDS uses the payment at the **qualifying** rate plus tax, heat and **50% of condo fees**. Watch monthly vs annual units: F4 had two unit bugs.
- **LTT / registration fees:** use only `lib/calc/landTransferTax.ts`. It covers BC (incl. 5% marginal above $3M), the BC first-time exemption (max $8k), Ontario (first-time refund $4k), Toronto (Apr 2026 luxury tiers, rebate $4,475) and Alberta fees.
- **Time-sensitive rules to re-check:**
  - SVT rates by tax year: the table is in the page (`SVT_RATES`) and needs a 2028 entry when announced.
  - Toronto MLTT tiers.
  - First-time GST rebate dates.

**Gotchas**
- Pages are CRLF. The Edit tool handles that; Bash/Node rewrites must keep `\r\n` (`land-transfer-tax` was rewritten that way). The Git Bash `sed -i` I used on `down-payment/layout.tsx` left it LF; `core.autocrlf=true` normalises it.
- JSX/TS string gotcha: a double-quoted string inside a double-quoted FAQ answer broke tsc (`amortization/page.tsx:56`). One syntax error makes tsc skip **all** semantic checks, which is why other agents saw only 3 errors earlier.
- `ValidatedInput` never calls `onChange` with invalid values. Results keep the last valid value; there is now a hint saying so.
- `lib/calc/payment.ts` is also used by group B pages, `lib/calc/investment.ts` and `lib/ai/tools/mortgage-tools.ts`. Every change was kept backward compatible (new fields and optional parameters only).

**Verification scripts** (in the scratch folder from the header; run with Node 24, e.g. `node 02-helpers.test.mjs`)

| Script | What it does |
|---|---|
| `01-before.mjs` | Reproduces the original bugs: US vs Canadian compounding (2,922.95 vs 2,908.02), required-income ≈ $10.9M, stress-test TDS |
| `02-helpers.test.mjs` | 30 assertion groups over `payment`, `principalFromPayment`, `balanceAfter`, `biweeklySavings`, `gdsTds`, CMHC tiers/LTV/surcharge/PST, min down, BC/ON/Toronto/AB tables (including the gov.bc.ca exemption table points) |
| `03-copy-numbers.mjs` | Numbers used in educational copy: 15/20/25/30-year totals at 5%, $200/mo extra savings, first-5-year interest share, stress-test deltas, premium interest |
| `04-pages.test.mjs` | Post-fix page formulas: extra-payments, stress-test, required-income round trips, qualifier bisection (ratios ≤ 39/44 at the max; min-down cap), pre-approval caps, and the old pre-approval TDS 44.82% bug |
| `05-before-after.mjs` | Before/after figures quoted in §2 |
