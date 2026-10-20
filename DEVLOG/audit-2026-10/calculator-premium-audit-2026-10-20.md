# Kraft Mortgages: calculator and premium-experience audit

**20 October 2026 · Working copy based on `006c93a` · Fixes are uncommitted and have not been deployed.**

The site has strong breadth: 52 calculators covering residential, commercial, construction, equity, private lending and MLI Select. Its main weaknesses are inconsistent assumptions, a few materially misleading recommendations, and visual competition around the actual calculation. I recommend releasing the reviewed correctness fixes first, then introducing one restrained calculator design and integrated renewal/MLI journeys.

This audit repaired defects after the previous October audit. A complete redesign remains a recommendation; targeted validation, accessibility and spacing corrections were applied now.

**What was tested**

- All **52 calculator leaf routes**, discovered from the actual Next.js route tree, were opened and exercised in Chrome locally: 30 general/residential, 4 commercial, 5 construction, 3 equity, 9 MLI Select and 1 private-lending tool. Hubs are additional navigation pages.
- The initial sweep exercised **314 visible numeric/range controls**, **1,146 numeric/range scenarios** and **43 select-option scenarios**. Numeric fields received normal, blank, negative and excessive values. Ranges were taken to both ends. Follow-up runs checked changes, accessibility, toggles and selected complex interactions.
- **109 automated tests pass**, including **2,160 principal/rate/amortization/elapsed-month combinations** checked against an independent monthly ledger. Principals range from $1 to $1 billion; rates include zero, a tiny positive rate and severe stress cases. Separate tests cover refinance economics, eligibility, final payments, construction funding, MLI rules, tax boundaries, AI math parity, PDF generation and bounded simulations.
- Targeted browser regressions cover rate URL edits, invalid drafts, a payment benchmark, zero-income verdicts, insured amortization eligibility, Toronto tax, corrupt MLI storage, impossible unit counts, tier limits and draw add/remove.
- Desktop viewport: 1440×1000. Mobile: 390×844. Axe WCAG A/AA scans and selected screenshots supplement source/model review. The homepage, calculator hub and principal service/about/contact pages received a visual review.
- Stress work was local. Browser non-GET requests and external widgets were blocked. No real leads, emails, applications or calls were sent. This was not a production traffic/load test, penetration test, real CRM/voice certification or full accessibility certification. Development timings are not production Core Web Vitals.
- The owner's four modified files in `apps/web/data/` were preserved. A separate compatibility declaration fixes the refreshed lender attachment type mismatch.

Reproduction: `apps/web/scripts/audit-calculators.cjs` and `audit-calculator-regressions.cjs`. Run summaries and selected screenshots are in the adjacent `calculator-audit-evidence/` folder. Its `verification.md` records final checks and limitations. Hidden controls and possible input combinations are not claimed to be exhaustively enumerated.

Final checks: TypeScript and lint pass with zero errors; lint has zero warnings. The final production build generated 125 pages. The built app passed all 52 calculator-route smoke checks and six focused browser regressions. Final merged axe scans contain zero automated violations; all sampled mobile widths stayed within 390px. See the evidence verification file for exact scope.

**What was broken and repaired**

| Finding | Defect | Repair |
| --- | --- | --- |
| BUG-061 | Many raw inputs published invalid drafts. Shared parsing accepted non-finite numbers. Invalid drafts could disappear on blur. Labels often lacked programmatic names. | Shared finite-number validation; invalid drafts remain visible; results explicitly identify the last valid value; associated labels, error relationships and accessible control names. |
| BUG-062 | Commercial savings were payment reduction × months less fees. Longer amortization appeared to save money by repaying less principal. Recovery used payment relief; renewal also used a 12-month rule of thumb. | Shared engine compares interest plus cash-paid fees on the same debt and horizon. Payment reduction is separate. Residential/commercial refinance, renewal and corresponding AI math use that economic approach. |
| BUG-063 | A URL rate could be reapplied after editing. Renewal used insured pricing for an uninsured transaction. Rate provenance was ambiguous. | Apply finite, bounded URL rates once; preserve later edits; use conventional renewal/refinance pricing; distinguish illustrative/feed/user rates. |
| BUG-064 | Two refreshed lender records failed type checking because the generated interface omitted attachments. | Typed compatibility declaration outside owner-managed data. Upstream generation should eventually declare the same field. |
| BUG-065 | MLI target margin was a markup on costs. Impossible unit counts could earn tier benefits; amortization/loan terms could exceed tier limits. Purchase qualification omitted insured amortization eligibility. | True margin formula; invalid unit counts suppress benefits; tier warnings/caps; first-time/new-build status checks before positive purchase verdicts. |
| BUG-066 | Zero income could produce positive specialty verdicts. Home-equity and HELOC sizing omitted GDS. | Require income and an actual borrowing amount. Size home equity and HELOC against both 39% GDS and 44% TDS; separate HELOC housing costs from other debt. |
| BUG-067 | Tiny rates suffered numerical cancellation. Fractional payoff understated final scheduled-month interest. | Stable annuity formulas and a smaller final month-end payment, verified against independent ledgers. |
| BUG-068 | Corrupt/unavailable browser storage could crash MLI Save. | Useful recovery/export message; preserve unreadable existing data. |
| BUG-071 | B-vs-equity described equity lending as the best option whenever B-lender criteria failed, without establishing private eligibility. | Verdict now invites review of other options; no implied approval. |
| BUG-070 | Accelerated-payment simulation could loop for unbounded/non-finite horizons when called outside the form. | Reject non-finite inputs and amortization beyond the supported 100-year simulation ceiling; valid page ranges are unchanged. |
| BUG-069 | Cost-to-complete summary could show a negative remaining cost. | Floor remaining cost at zero and identify funding above budget separately from the undisbursed commitment. |
| BUG-038 / 057 | Low-contrast small text, unnamed switches, inaccessible scrolling content and redundant header margins impaired use. | Calculator contrast/link/control fixes, keyboard-accessible schedule and removal of redundant top margins. Manual assistive-technology review and site-wide redesign remain. |
| FEAT-021, part delivered | Closing Costs omitted Toronto municipal tax. | Toronto choice uses the existing shared municipal/provincial engine, including first-time refunds. Other tax extensions remain backlog. |

**Numeric examples**

| Reproducible scenario | Before | After |
| --- | --- | --- |
| Commercial refinance: $400k, 5.75%, 22 years remaining; new 4.79%, 25 years; $13,870 costs | Recovery 37 months; payment-based five-year figure about $8,863 | Same $378.89 monthly payment reduction, but interest-cost recovery **48 months** and five-year net saving **$3,167.70**. Costs are not recovered within the 36-month remaining term. |
| $500k, same 5% rate, extend 15 to 30 years, $3k fees | A payment-based comparison looks attractive | Lower payment is separate from higher remaining debt and extra interest; no economic saving. |
| MLI: $15M, 4.5%, 40 years, 100 units, $50k monthly OpEx, 3% vacancy, 15% target margin | About $1,388/unit/month, actually **13.04%** margin | About $1,419/unit/month, achieving **15%** before rounding. |
| Home equity: $120k income, $450 monthly tax/heat, no other debt, 4.69% contract, 25 years | TDS-only total mortgage capacity $579,703.75 | Both ratios constrain total capacity to **$506,323.53**. Existing debt/equity further constrain cash available. |
| Toronto $700k purchase, eligible first-time buyer | Closing tool included Ontario net tax $6,475 | Toronto selection includes **$12,475** combined net tax. Other closing costs are additional. |
| $1,000 at 12%, $175 monthly, through payoff | Fractional-time interest $33.9768 | Scheduled month-end interest **$34.0474**, then interest stops. |
| Insured $700k purchase, $70k down, 30 years, repeat buyer/resale | Ratios could produce a pass | Positive verdict requires first-time or eligible new-build status. |
| HELOC: $10k monthly income, $2,300 mortgage, $400 tax/heat, $200 other debt | TDS-only payment room $1,500/month | GDS binds at **$1,200/month**; supported credit is lower. |
| Zero income in specialty tools | Zero ratios could appear to pass | No positive qualification/borrowing verdict. |

Minimum down payments and the $1.5M boundary are grounded in [CMHC guidance](https://www.cmhc-schl.gc.ca/observer/2025/cmhc-mortgage-loan-insurance-explained). Insured amortization beyond 25 years, to 30, requires first-time or eligible new-build status: [CMHC mortgage calculator guidance](https://www.cmhc-schl.gc.ca/consumers/home-buying/calculators/mortgage-calculator?fromBlog=1).

The current stress rate is the greater of contract + 2% and 5.25%. An eligible straight uninsured switch at renewal, without increasing balance or amortization, has different treatment; a renewal workflow should distinguish it from early breaking/refinancing. [OSFI MQR guidance](https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages). Toronto municipal tax is additional to provincial tax: [City rates and fees](https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/).

**Every calculator: findings and next improvement**

All routes below received browser render/interaction/boundary checks and source/model review. “Reviewed” means no additional arithmetic defect was demonstrated in sampled cases; it does not certify every lender policy or combination. Shared validation/readability fixes apply across the inventory.

| Route | Finding / next improvement |
| --- | --- |
| `/calculators/a-vs-equity` | Reviewed cost/interest comparison. Accountant-reviewed tax assumptions, current secured debt and a realistic exit plan would improve it. Never imply earned income may be left unreported. |
| `/calculators/affordability` | Reviewed stress/ratio/insurance sizing. Add actual living expenses, reserves and a comfortable-budget range alongside the underwriting maximum. |
| `/calculators/amortization` | Reviewed payment/balance schedule. Add regular vs accelerated frequencies, term-end balance and CSV export. Preserve cents internally. |
| `/calculators/b-vs-equity` | Reviewed common-horizon costs. Ask for the first mortgage for second-charge comparisons; expose exit/renewal fees and lender limits. |
| `/calculators/bc-speculation-tax` | Reviewed current residency/rate model. Add tax year, BC tax-residency credit and ownership share. Make exemption assumptions explicit; avoid a universal tax verdict. |
| `/calculators/closing-costs` | Fixed Toronto omission; added financing eligibility warning. Make estimated fees/prorated tax editable; add new-build, foreign-buyer and mixed-owner cases. |
| `/calculators/cmhc-insurance` | Reviewed premium bands, financed premium and cash sales tax. Add pay-premium-in-cash and applicable non-traditional down-payment options; place eligibility next to results. |
| `/calculators/construction-pro` | Reviewed progressive draw interest/horizon. Named inputs/remove actions; aligned draw bounds with the 60-month engine. Add holdback, interest reserve and repayment events. |
| `/calculators/debt-service-ratio` | Reviewed 39/44 ratios/stress payment. Added minimum-down/insured-price gating. Separate ratio compliance from complete loan eligibility. |
| `/calculators/down-payment` | Reviewed tiered minimum and financed premium. Prevented negative mortgage after reducing price below a custom down payment. Add savings timeline/closing reserve. |
| `/calculators/extra-payments` | Reviewed payoff and savings; shared final-payment correction applies. Added keyboard access to schedule. Add actual prepayment privileges/anniversary limits. |
| `/calculators/first-time-home-buyer` | Reviewed benefits vs savings distinction. Add a two-buyer FHSA/HBP plan with individual eligibility, room, timing and repayments; separate cash from later credits. |
| `/calculators/investment` | Reviewed rent/vacancy/expense/cash-on-cash model. Add detailed operating/capital reserves, interest-only option, tax/exit costs and sensitivities. |
| `/calculators/land-transfer-tax` | Reviewed BC/ON/Toronto/AB engine and boundary tests. Add ownership percentages, mixed first-time status, new-build and non-resident taxes. |
| `/calculators/mortgage-penalty` | Reviewed three-month/IRD comparison. Add sourced lender presets and prepayment-before-break. A written lender payout quote remains decisive. |
| `/calculators/mortgage-qualifier` | Fixed insured amortization/status and zero-income verdict gating. Add Toronto/ownership choices and carry the scenario into Closing Costs. |
| `/calculators/payment` | Fixed URL edits, provenance and controls. Add product eligibility, full payment frequencies, term interest and remaining balance. Default insured pricing is not a quote for every borrower. |
| `/calculators/port-vs-break` | Reviewed equal-debt/horizon penalty segments. Add port expiry, lender approval constraints, bridge costs and blend-and-extend. |
| `/calculators/pre-approval` | Reviewed income/ratio sizing. Replace illustrative credit-tier spreads with sourced product eligibility or clear estimates; do not imply an issued approval. |
| `/calculators/rate-comparison` | Reviewed equal-period payments/interest. Add fees, cashback clawbacks, restrictions, balances and fixed/variable paths. |
| `/calculators/refinance-break-even` | Fixed interest-cost recovery and consolidated math. Show both balances, actual payout quote and holding period; distinguish term from amortization. |
| `/calculators/refinance-cashout` | Reviewed conventional equity limit/costs. Add reverse sizing from desired cash, qualification and financed-cost treatment. |
| `/calculators/refinance-vs-heloc-vs-second` | Reviewed same-total-debt comparison. Add quoted break penalty, HELOC rate paths/daily interest and second-mortgage exit costs. |
| `/calculators/renewal` | Fixed conventional default and economic recommendation. Add competing written offers, fees/cashback, maturity-date workflow and straight-switch eligibility. |
| `/calculators/rent-vs-buy` | Reviewed owner/renter cash-flow direction. Add separate rent/home/expense inflation, provincial taxes/rebates, sale costs and uncertainty bands. |
| `/calculators/required-income` | Reviewed inverse qualification/round trips. Add two-buyer allocation, Toronto cash requirements and saved scenario handoff. |
| `/calculators/reverse-mortgage` | Reviewed current age/LTV illustration. Add sourced product quotes, staged draws, fees, home appreciation and HELOC/downsizing comparison. |
| `/calculators/self-employed` | Reviewed rising average/declining latest-year/add-backs. Add documented lender rules; NOA income does not establish lender acceptance. |
| `/calculators/self-employed-a-vs-b` | Reviewed after-tax/borrowing-cost illustration. Keep the tax-years decision visible; accountant-reviewed salary/dividend timing and documentation would improve it. |
| `/calculators/stress-test` | Reviewed floor/buffer and debt limits. Distinguish new borrowing from eligible straight switches; show payment shock/cash-buffer impact. |
| `/commercial/calculators/cap-rate` | Reviewed NOI/value and zero guards. Separate observed cap rate from valuation assumptions; date/source local benchmarks. |
| `/commercial/calculators/cash-flow` | Reviewed payment/vacancy/cash flow. Add DSCR, loan sizing, capital reserves, tenant concentration and rate/rent/vacancy shocks. |
| `/commercial/calculators/noi-analysis` | Reviewed income minus OpEx. Add normalization, recoveries, management/replacement reserves; keep financing/depreciation outside NOI. |
| `/commercial/calculators/refinance` | Fixed amortization-extension savings/recovery. Add cash vs financed costs, realistic term-rate scenarios and commercial payout methodology. |
| `/construction/calculators/budget` | Reviewed costs/contingency/LTC and approximate draw interest. Replace 50%-average advance with actual schedule; remove unused state; add selling/tax/financing reserves. |
| `/construction/calculators/builder-program` | Reviewed stated illustration. Add dated program eligibility/fee sources and full project cash flow; separate assumptions from approvals. |
| `/construction/calculators/construction-draw` | Reviewed draw/interest illustration. Add inspection milestones, holdback, lender fees and equity-before-advance requirements. |
| `/construction/calculators/cost-to-complete` | Fixed negative remaining-budget summary. Funded percentage is not physical completion. Add paid costs, committed invoices, contingency and overrun scenarios. |
| `/construction/calculators/progressive-draw` | Reviewed timeline balance/interest. Expose editable schedule, holdback, interest reserve and permanent-financing conversion. |
| `/equity-lending/calculators/debt-consolidation` | Fixed zero-income verdict. Separate payment relief, net interest and secured-debt risk; add keep-the-old-payment accelerated payoff. |
| `/equity-lending/calculators/heloc` | Fixed zero-income/zero-limit verdict and separated housing/debt costs for GDS/TDS. Add actual product compounding, prime sensitivity and repayment plan. |
| `/equity-lending/calculators/home-equity` | Fixed omitted GDS/zero income. Show equity cap vs income cap and identify illustrative credit spreads/costs. |
| `/mli-select/calculators/amortization` | Reviewed Canadian payment/schedule. Add financed premium, annual summaries, CSV and term-end assumptions. |
| `/mli-select/calculators/break-even` | Fixed true target margin. Add rent roll, non-residential income, tax/insurance/reserves and market-rent comparison. |
| `/mli-select/calculators/dscr` | Reviewed 1.10 DCR inverse round trip; capped amortization by tier. Add purpose/property DCR choices and combined leverage constraint. |
| `/mli-select/calculators/eligibility-checklist` | Functional checklist, not an underwriting decision. Add evidence/document links, save/resume and an incomplete-state summary. |
| `/mli-select/calculators/max-loan` | Reviewed leverage cap; existing note correctly says DCR may bind. Combine debt-coverage and leverage sizing on one screen. |
| `/mli-select/calculators/points` | Fixed impossible unit benefits and resilient Save. Add sourced median-income lookup/evidence requirements. Local Save is not an account-backed vault. |
| `/mli-select/calculators/premium` | Reviewed grid/discount; added tier-term warning. Add standard-MLI baseline, specialised surcharges and premium financing. Hypothetical terms must not resemble eligible quotes. |
| `/mli-select/calculators/rent-cap` | Reviewed 30%-income monthly conversion. Add CMHC market/year lookup and applicable utility/bedroom methodology. Manual median income is an assumption. |
| `/mli-select/calculators/scenario-compare` | Reviewed points/tier/premium. Fixed invalid unit benefits/names. Compare DCR-limited debt, equity and after-premium cash flow; add persistence. |
| `/private-lending/calculators/alternative-income` | Fixed zero-income verdict. Replace estimated balance-based debt payments with actual payments; add first/second position, fees, term and exit plan. Haircuts/ratios vary by lender. |

MLI criteria should be maintained against [CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect) and its [multi-unit premium notice](https://www.cmhc-schl.gc.ca/media-newsroom/notices/2025/cmhc-to-update-multi-unit-mortgage-loan-insurance-premiums). Current tools use standard rental assumptions; specialised purpose exceptions need explicit inputs before marketing them as comprehensive underwriting.

**How I would make the site feel premium**

The visual language is currently closer to a busy finance dashboard than a high-end advisory firm. Orange/gold, green, cyan, blue and purple compete for emphasis. Glowing cards, animated badges, repeated introductions and several contact widgets distract from the numbers. On mobile, floating controls compete for space with the calculator. The redesign should establish one clear hierarchy and a quieter, more confident presentation.

Apply one design system first to the calculator hub, Mortgage Qualifier, Payment, Renewal and the combined MLI deal sizer; extend it after those journeys are validated.

| Element | Recommendation | Acceptance criterion |
| --- | --- | --- |
| Colour | Ink `#111820`, warm ivory `#F4F0E8`, muted metallic accent `#C3A477`, slate `#68717B`. Reserve green/red for meaning. Test actual colour pairs. | One primary accent. AA text/control contrast. Status never conveyed only by colour. |
| Typography | One editorial display serif for selected headings and one highly readable sans for body/controls. Tabular money figures. Confirm font licences. | 16px mobile inputs, 14px supporting labels, 16–18px body; avoid uppercase paragraphs. |
| Heading | Breadcrumb, concise title, one-sentence purpose and a quiet assumptions link. | First useful input and compact result appear without a large decorative hero at 390×844. |
| Layout | Inputs left/results right on desktop; compact sticky result strip on mobile, respecting safe areas and keyboard. | No obscured controls at 200% zoom or with keyboard open. |
| Results | One primary number, 2–4 supporting figures, then interpretation/assumptions. | Payment, interest, principal, fees and available cash have distinct labels. |
| Surfaces | Mostly flat surfaces, subtle border, 12–16px radius, consistent 8px spacing scale. | Remove repeated glass/blur/glow and nested decorative cards. |
| Motion | Brief 120–180ms feedback; remove looping dots/floating badges around results. | Reduced motion works; essential text is readable before JavaScript finishes. |
| Help | One “Speak with an advisor” control revealing call/WhatsApp/optional AI. | Replace competing floaters; label AI and preserve explicit call consent. |
| Photography | Commission a small set of broker/team and relevant architectural images. | Authentic people/properties; no invented awards, client counts or financed projects. |
| Trust | Real portraits, verified licences/provinces, dated data, clear process and consented case studies. | Every quantitative claim has an evidence owner and review date. |
| Export | Quiet Save/Compare near results; PDF secondary to a useful calculation. | Basic calculation stays available without a lead form. Page/PDF assumptions, date and numbers match. |

Suggested page order: short introduction → working calculator/results → explanation → assumptions/sensitivity → optional advisor/PDF action → related tools → concise FAQs. Service pages should tell a clear client story before listing every product. The adjacent `premium-calculator-concept.html` illustrates the proposed direction; it is a local review artifact, not a deployed redesign.

**Other product improvements**

1. **Job-based calculator discovery.** Start with Buying, Renewing, Accessing equity, Investing and Building. Add search; retain the specialist directory for experienced users.
2. **One scenario across tools** (FEAT-017). Carry property, price, down payment, location, product, rate, amortization and buyer status into related calculators. Keep personal financial details out of public URLs; use opaque expiring links for stored cases.
3. **One result contract** (FEAT-061). Every output needs units, source/date, purpose, eligibility, horizon and cash-vs-financed costs. Exports should carry the engine/rules version.
4. **Explain the binding constraint.** Show whether income, down payment, leverage, DCR or eligibility limits the answer. Offer the next useful adjustment instead of a generic verdict.
5. **Show uncertainty.** Rate ±1%, vacancy/expense shocks and income reduction should show monthly dollars and cash-buffer impact.
6. **Consistent, honest export/delivery** (FEAT-015/018). Some pages download, some print, some gate a report and some lack export. Verify actual email and CRM receipt before promising delivery; separate marketing consent from document access.
7. **One help interaction.** Respect mobile safe areas/keyboard space; keep a clear human route.
8. **Publish methodology.** Explain compounding, stress rates, CMHC/tax assumptions, penalty estimates and limitations in plain language. Date rules and assign maintenance ownership.
9. **Measure useful outcomes.** Calculator started → valid result → saved/compared → appointment → qualified file. Do not send income/debt values or free-text scenarios to general analytics.
10. **Improve application handoff** (FEAT-031/053). Explain required information, documents and next steps; provide secure authenticated uploads instead of emailing financial records.
11. **Manual accessibility review.** Test 320px width, 200% zoom, keyboard, screen reader, dialog focus/error recovery, large text and reduced motion. Automated scans cover only part of [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
12. **Measure production performance** (FEAT-057). Use real mobile LCP/INP/CLS; aim for the good thresholds at the 75th percentile: 2.5s, 200ms, 0.1. Prioritise fonts/images, hydration/animation cost and deferred widgets. [Core Web Vitals guidance](https://web.dev/articles/vitals).

**New calculators and integrated tools**

| Priority | Tool / backlog ID | Why it is useful | Minimum useful scope |
| --- | --- | --- | --- |
| P1 | Renewal offer / switch / refinance decision — FEAT-062 | A recurring decision where rate alone is inadequate. | Same balance/horizon; written offers, fees/cashback/clawbacks, payout quote, ending balances, straight-switch eligibility and rate paths. |
| P1 | Combined MLI Select deal sizer — FEAT-019 | Strongest specialist opportunity; joins nine disconnected tools. | Valid commitments/points → tier → leverage and DCR caps → lesser loan → premium/financing → equity, debt service, cash flow, comparison/export. |
| P1 | Comfortable home budget/payment shock — FEAT-063 | Underwriting maximum is different from household comfort. | After-tax living costs, childcare/debt, reserves, closing cash and rate/income shocks; distinct comfort and qualification results. |
| P1 | FHSA/HBP/down-payment timeline — FEAT-068 | Useful two-person first-home planning. | Individual room/eligibility, withdrawal dates, repayments, liquid savings vs later refunds and closing reserve. Validate current rules before release. |
| P1 | Move-up/buy-before-sell/bridge — FEAT-064 | Connects porting, selling and purchase cash timing. | Net sale proceeds, selling/penalty costs, deposits, bridge days/rate/fees, overlap costs and new purchase cash requirement. |
| P1 | Rental-income qualification — FEAT-034 | Links returns with financing eligibility. | Documented lender offset/add-back methods, vacancy, other properties and ratio/DCR impact. |
| P2 | Consolidate and keep the old payment — FEAT-037 | Shows actual repayment improvement beyond a smaller minimum payment. | Costs, equal-horizon interest, payoff dates and acceleration. |
| P2 | Suite/laneway/renovation investment — FEAT-065 | Fits equity and owner-builder audiences. | Costs/contingency/draw interest, rent/vacancy/reserves, takeout, break-even and sensitivity; no assumed permits/grants. |
| P2 | Variable-payment/trigger-rate — FEAT-066 | Explains product behaviour missing from static comparison. | Actual product terms, prime/spread paths, trigger point, negative amortization and renewal shock. |
| P2 | Rental portfolio risk dashboard — FEAT-067 | Valuable to repeat investors. | Property-level maturities, cash flow, DCR/LTV, shocks and reserves. Secure persistence before storing client data. |
| P2 | Reverse mortgage vs HELOC vs downsizing — FEAT-036 | Supports the real senior-borrower decision. | Real quotes, staged draws/accrual, costs and remaining equity over time. |
| P2 | Construction funding runway — FEAT-039 | Unifies budget/draw/cost-to-complete. | Paid and committed costs, remaining commitment, holdback, reserve, delay/overrun shocks and takeout. |

Build shared scenario, assumptions and result components before adding further isolated forms. The existing engines already provide much of the foundation.

**Delivery order**

| Phase | Deliverable | Release criteria |
| --- | --- | --- |
| 1 | Review correctness patch; controlled integration validation | Tests/type/lint/build pass; browser evidence retained; no unexpected data changes; rules/lender assumptions reviewed. |
| 2 | Premium shell, design tokens, unified help and calculator hub | Mobile, keyboard, zoom and screen-reader journeys pass; useful result visible sooner; no overlapping controls. |
| 3 | Scenario handoff; renewal offer comparator; MLI sizer; first-home cash plan | Same case gives consistent page/PDF outputs with dates/sources; unavailable-data/error states work. |
| 4 | Renewal reminders, consented alerts, partner sharing, specialist tools | Delivery, attribution and broker handoff measured; privacy/security match stored data. |

Measure valid-result completion, mobile abandonment, qualified appointments and time from scenario to broker review. Feature-register effort categories are planning estimates, not delivery promises.

**Remaining limits and owner-dependent work**

The existing DEVLOG records owner-dependent key rotation, production environment setup, Firestore rule deployment and legal/content approvals. Their historical status was not re-certified by this calculator pass. Real consented voice calls, PDF email and CRM delivery need controlled integration recipients. No deployment occurred.

The per-calculator table identifies remaining model limits. Variable/HELOC compounding, lender penalties, private underwriting, mixed-owner/new-build/non-resident taxes and specialised MLI surcharges should be explicit assumptions. Illustrative credit/age curves require product-specific sources before presenting them as firm capacity. Production performance and full assistive-technology behaviour require their own measurements.

## Approved implementation addendum — 2026-10-20

The owner approved the restrained calculator direction, mobile simplification, unified help control and the integrated renewal/MLI tools, and authorized commit/push/live release. The recommendations above are the historical audit; the implemented scope and release checks are now documented in [premium release verification](premium-release-evidence/verification.md) and the latest [session](../SESSIONS.md).

Delivered: shared calculator theme, searchable complete 53-tool directory, one help launcher, and full ivory/ink shared shells for Payment, Renewal Offer Comparison and the new MLI Deal Sizer, including mobile result summaries and local scenario PDFs. The new tools have tested shared engines, explicit assumptions and sources. [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) is required reading for future agents and defines aesthetic, calculation, testing and release rules.

Remaining extensions are explicitly tracked: FEAT-069 migrates the remaining legacy bodies/full result contracts; FEAT-070 adds cash-out/capitalized-fee renewal reconciliation; FEAT-058 covers additional MLI purposes/surcharges. These are not represented as delivered functionality.
