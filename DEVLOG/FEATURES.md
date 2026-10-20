# Feature Backlog

New capabilities and enhancements, each with a permanent `FEAT-###` ID. Priority and effort scales are in [`README.md`](README.md).
**Builds on** names existing code to start from, so you don't rebuild what's already half there. **Ref** points at the audit report that proposed it (same prefixes as in [`FINDINGS.md`](FINDINGS.md)); `orch` = proposed in the orchestrator's synthesis.

Pick from the top. P0 items also close open `BUG`s, noted in the **Closes** column.

### Status changes (updated 2026-10-20 — supersede the Status column below)

| ID | Status | Note |
| --- | --- | --- |
| FEAT-001 | done for forms | Consent boxes + ledger fields on every site form; consent-gated AI calls. Chat consent form still to do. Wording pending legal review. |
| FEAT-004 | partly done | Secret files untracked/ignored. Gitleaks NOT added yet: it would fail on the keys still in history — add after the history purge (BUG-001). |
| FEAT-005 | done | pnpm-only Vercel install/build, single `vercel.json`. |
| FEAT-006 | partly done (2026-10-20) | 119 tests pass; 2,160 ledger stress combinations plus 75 integrated MLI sizing cases; reusable browser harnesses cover 53 calculators. Browser CI integration remains. |
| FEAT-021 | partly done (2026-10-20) | Toronto toggle and municipal rebates added to Closing Costs; remaining new-build/non-resident/mixed-owner extensions are open. |
| FEAT-060 | done (2026-10-20; production verified) | Scoped restrained theme across calculator routes, complete searchable directory, single help dock, mobile summaries and full shared shell for Payment/Renewal/MLI sizing. Mandatory design/developer guide. Remaining component migrations are FEAT-069. |
| FEAT-061 | partly done (2026-10-20) | Contract implemented in the three shared-shell tools and documented for future work; apply to remaining legacy tools through FEAT-069. |
| FEAT-019 | done (2026-10-20; production verified) | Standard rental MLI sizer connects points, leverage, DCR including financed premiums, cash and sensitivities; ungated scenario PDF. |
| FEAT-062 | done for renewal / early break (2026-10-20; production verified) | Three offers; common locked horizon; interest, cash fees, retained cashback/clawbacks, actual payout penalty, ending balances and PDF. Cash-out/capitalized fees extension is FEAT-070. |
| FEAT-007 | done | Live-rate defaults across calculators and landing pages. |
| FEAT-016 | partly done | Drafts by default + admin publish; run list/polling remain. |
| FEAT-018 | partly done | PDF report + lead capture added to 4 commercial, 5 MLI calculators and alt-income. Construction, equity and remaining MLI pages still to do. |
| FEAT-027 | partly done | One shared, cached `/api/rates` request per page (`useLiveRates` dedupe). |
| FEAT-028 | done | Blog images WebP + lazy loading. |

---

## P0: do next (foundations, compliance, and money already being lost)

| ID | Feature | Value | Builds on | Effort | Closes | Ref | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FEAT-001 | **Consented lead capture everywhere + consent ledger.** Consent checkboxes (contact me / automated AI call / marketing) on `/contact`, `/qualify`, LeadModal, PdfLeadModal, `/business-funding` and the chat. Store the wording version, timestamp and IP per lead. Only auto-dial when `consentToCall === true`. Unsubscribe link. | CASL/CRTC defensibility for the AI speed-to-lead calls; better lead quality than regex scraping in chat | `/api/contact` already records and honours consent flags; `components/LeadCapture/*` (dead, but has consent UI); `/api/compliance/log` | M | BUG-005, BUG-026 | be, ai F-5, fe M10 | blocked (owner wording) |
| FEAT-002 | **Unified lead ingestion service** (`lib/leads/ingest.ts`): validate → persist to Firestore as the system of record (with consent + UTM) → fan out to Twenty/Discord with retry → dedupe by email/phone (and by `leadgen_id` for Facebook). One path for contact, lead, business-funding, Facebook and chat. | Ends lost and duplicate leads; one place to add CRM changes | the 4 lead routes, `lib/compliance/requestGuards.ts`, `lib/firebaseAdmin.ts`, existing Twenty/Discord senders | M | BUG-022, BUG-024, BUG-025 | be | open |
| FEAT-003 | **Durable rate limiting + bot protection**: Vercel WAF rules (or Upstash Ratelimit) on `/api/chat*`, `/api/voice/*`, `/api/contact`, `/api/lead`, `/api/business-funding`. Cloudflare Turnstile / Vercel BotID on forms. Merge the two guard helpers into one. | Paid AI/TTS/telephony endpoints and auto-dial forms are abusable today | `lib/ai/request-guards.ts`, `lib/compliance/requestGuards.ts` (same interface: swap the store) | S–M | BUG-007 | ai O4, be, plat P-F5 | open |
| FEAT-004 | **Secret hygiene**: gitleaks in CI + pre-commit, GitHub push protection, `${VAR}` expansion in `.mcp.json`, all keys in Vercel env | Prevents a repeat of BUG-001/002 | `.github/workflows/ci.yml` | S | — | plat P-F10 | open |
| FEAT-005 | **Single deploy config + pnpm-only pipeline** (Option A or B in the platform report §1.4) | Reproducible production builds; removes dead config | `/vercel.json`, `apps/web/vercel.json`, `pnpm-lock.yaml` | S | BUG-010 | plat P-F11 | open |
| FEAT-006 | **Automated tests**: `node --test` or Vitest for `lib/calc/*`, `lib/mli/calcs.ts` and the AI calculator tools (golden values: $500k/5%/25y = $2,908.02, CMHC tiers, BC/ON/Toronto/AB tax tables, stress-test floor, DCR round-trip), then ~10 Playwright smoke tests (every calculator renders and reacts, sitemap/robots, headers, chat with a mocked API). Add a `test` job to CI. | Locks in ~100 calculator fixes; stops regressions like the 6 negative-interest and US-compounding bugs found here | The verification scripts from the audit (see the `calc-a` §5, `calc-b` §5 and `calc-sp` notes). They are throwaway session files, so port the assertions into the repo. `lib/calc/*.ts` import cleanly under Node 24. | S → M | BUG-044 (safety net) | plat §8, calc-a, calc-b F8, calc-sp 5 | open |
| FEAT-007 | **Live-rate defaults everywhere**: seed every calculator's default rate from `useLiveRates()` (conventional / insured / alt / prime / HELOC / private-second as appropriate), and drive landing-page "from x%" copy from the same feed with a date stamp | Results start from today's market; removes 18-month-old lender figures | `useLiveRates()` (`data.benchmarks.*`, `data.raw_benchmarks.alt_*`, `prime_rate`); `renewal` page already does this. Note: `best5YrFixed` is the *insured* rate, so don't use it for refinances. | S | BUG-019 | calc-b F1, calc-sp 7 | open |
| FEAT-008 | **Observability**: Sentry (or Vercel Observability + log drain) on API routes, alerting on chat/lead/webhook failures; uptime + cron check-in monitors | Lead-loss and outage bugs are currently invisible (`console.error` only) | `/api/healthz` exists | S–M | — | plat P-F1/P-F2 | open |

## P1: this quarter (conversion, AI, operations)

| ID | Feature | Value | Builds on | Effort | Ref | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FEAT-009 | **Tool calling in the live chat**: affordability, payment, current rates, lender lookup, plus parity tools for MLI points/premium/DSCR, commercial cash flow, HELOC limit and debt consolidation, all calling the same helpers as the web calculators. zod-validated params. Render results as cards. | Accurate numbers instead of LLM arithmetic; chat answers match the calculators | `lib/ai/tools/tool-executor.ts` (dormant), `calculator-tools.ts` / `mortgage-tools.ts` (math now fixed), `ChatWidget/ToolResults.tsx`, OpenRouter function calling | M | ai F-1, calc-sp 4 | open |
| FEAT-010 | **Chat UX upgrade**: SSE streaming, Markdown rendering (no raw HTML), action chips (Book a call / Apply / WhatsApp with conversation summary), "Clear chat" + TTL, rates-freshness badge | Faster perceived response, higher conversion, privacy | ChatWidget stream branch, fixed SSE iterator, `react-markdown` (already a dependency), `WHATSAPP_LINK`, booking link | S–M | ai F-3/F-6/F-11, O10/O23 | open |
| FEAT-011 | **One chat router + model registry with health checks**; retire `/api/chat/v2`, `router*.ts`, `providers/*`; optional Claude tier (`claude-haiku-5-5` / `claude-sonnet-5-5`) behind FEAT-003 | Ends silent model rot; one place to tune cost | `/api/chat` provider chain; OpenRouter public `/models` list; admin-only `/api/ai/models` | M | ai F-4, O2/O3 | open |
| FEAT-012 | **Server-side page context for chat**: answers tailored to the calculator or page being viewed | Relevance; doesn't trust client-supplied text | `lib/ai/page-context.ts` (call `getPageContext(currentPage)` on the server) | S | ai F-2 | open |
| FEAT-013 | **Admin lead inbox**: lead detail, status, notes, CSV export, "call dispatched?", time-to-first-call (speed-to-lead SLA) | Run the pipeline from the site instead of Discord | `/admin` (now Basic-Auth protected), `leads` collection, contact `callDispatched` | M | be | open |
| FEAT-014 | **Daily KPI digest** to Discord/email: new leads, qualified, calls placed, CRM failures | Visibility with zero UI work | `/api/cron/reports/daily` (now cron-auth'd, GET-enabled); add to the `vercel.json` crons | S | be | open |
| FEAT-015 | **Transactional email (Brevo)**: actually deliver calculator PDF reports and lead confirmations; nurture sequences | The UI already promises emailed reports; follow-up automation | `lib/email/brevo-client.ts` (import commented out), 6 templates in `lib/email/templates.ts`, `lib/automations.ts` transport interface | M | be | open |
| FEAT-016 | **Human-in-the-loop AI publishing + working content dashboard**: the pipeline writes drafts, an admin reviews/approves/republishes; run/post list endpoints; client polling instead of 10-min SSE; WP update-not-duplicate | Compliance for regulated advertising; makes the (now working) pipeline usable | fixed `lib/pipeline/*`, draft filtering, `app/dashboard`, `/api/publish/republish` | M | be §3, §4 | open |
| FEAT-017 | **One purchase scenario across calculators** (price, down, rate, province, first-time) carried via Zustand + URL params; shareable scenario links (no personal data in the URL) | No retyping; smooth path from qualifier → closing costs → lead form; brokers can send pre-filled scenarios | Zustand store (`store/useAppStore.ts`), payment page already reads `?rate=` | M | calc-a, calc-b F11 | open |
| FEAT-018 | **PDF report + lead capture on the remaining calculators**: commercial, MLI, construction, equity, cash-out, port-vs-break, reverse mortgage | High-value commercial/MLI visitors currently have no capture | `generateGenericReport` + `PdfLeadModal` (on 26 residential pages already) | S each | calc-sp 3, calc-b F9 | open |
| FEAT-019 | **MLI Select deal sizer**: points → tier → LTC/LTV cap, 1.10 DCR loan, insured loan = lesser of the two, grid premium financed, payment, cash flow | One screen answers "how much can I borrow and what will CMHC charge?" | `lib/mli/calcs.ts` (`leverageFor`, `dscrMaxLoan`, `mliBasePremiumPct`, `mliAmortizationSurchargePct`, `pmt`) | M | calc-sp 1 | done (2026-10-20; standard rental) |
| FEAT-020 | **CMHC median renter income lookup** for rent-cap and affordability scoring | Correct affordable-rent caps per market without manual lookup | CMHC XLSX by market; shape in `mli-select-complete/src/lib/data/medianIncome.ts` | M | calc-sp 2 | open |
| FEAT-021 | **Province-complete closing costs**: BC newly-built exemption (≤ $1.1M, phase-out to $1.15M), BC 20% foreign buyer tax, ON 25% NRST, Toronto toggle on closing costs, AB mortgage registration fee, ON new-home HST rebate for first-time buyers | Accurate cash-to-close across all three provinces | `lib/calc/landTransferTax.ts` | S–M | calc-a O6/O7 | open |
| FEAT-022 | **Rate-drop alerts**: subscribers are notified when the 5-yr fixed falls below their target | Re-engagement and lead nurturing | `/api/rates` feed, rate-alert logic in `lib/ai/tools/rate-tools.ts`, cron, FEAT-015 | M | be | open |
| FEAT-023 | **Mortgage renewal reminder programme**: capture the renewal date (renewal calculator, lead forms, chat) and send automated outreach 120/90/60 days before maturity with a pre-filled renewal comparison | Renewals are a broker's highest-ROI repeat business | `calculators/renewal` (live rates + penalty guide), FEAT-015, FEAT-013 | M | orch | open |
| FEAT-024 | **UTM / source attribution on every lead** | Know which city page, ad or calculator converts | `lib/utm.ts` exists but `captureUTM()` is never called; pass into the lead routes / FEAT-002 | S | fe | open |
| FEAT-025 | **City pages from one data file** (+ new cities such as Kitchener, Hamilton, Saskatoon), with BreadcrumbList + FAQPage JSON-LD | Removes 19 near-duplicate files; consistent licence/FAQ/CTA blocks | `CITY_METADATA` in the dead `mortgage-broker-[city]` route; `breadcrumbJsonLd` / `faqJsonLd` in `lib/seo/jsonld.ts` (unused) | M | fe | open |
| FEAT-026 | **Real reviews**: Google Business Profile reviews replace the unsourced homepage testimonials; one defensible client count | Trust + legitimate review stars (and closes a compliance risk) | `lib/seo/business-config.ts` | M | fe H3 | open |
| FEAT-027 | **Rates infrastructure**: `unstable_cache`/tagged revalidation for `/api/rates` and `/api/criteria`; rate-history and "rates in {city}" pages; one shared rates context (the homepage fetches twice) | Faster pages, consistent rates everywhere, high-intent SEO pages | `/api/rates`, `TodaysRates`, `last_synced_utc` | M | plat P-F3, fe | open |
| FEAT-028 | **Image pipeline**: re-encode blog images to WebP/AVIF, render through `next/image` | LCP/bandwidth (0.7–1.6 MB hero PNGs today) | `sharp` already in devDependencies | S–M | plat P-F7, fe | open |
| FEAT-029 | **Sticky mobile CTA** (Call / WhatsApp / Apply) | Phone conversion | `/varun` already has a sticky bar pattern; `WHATSAPP_LINK` | S | fe | open |
| FEAT-030 | **Thinkrr post-call pipeline**: transcript → LLM summary + qualification → structured CRM note | Uses prepaid Thinkrr minutes; no manual call notes | `/api/webhooks/thinkr`, `/api/chat` provider chain | M | ai F-9 | open |
| FEAT-031 | **Secure document upload portal**: authenticated client upload (Firebase Storage) against a checklist generated per mortgage type, with status tracking for the broker | Replaces emailing pay stubs/NOAs; faster files | `/api/documents` (relay to an absent FastAPI service), `lib/ai/tools/document-tools.ts` (checklists), Firebase Auth | M–L | orch | open |

## P2: later (calculator depth, admin tooling, platform)

| ID | Feature | Value | Builds on | Effort | Ref | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FEAT-032 | Lender-specific penalty presets (big bank posted-minus-discount vs monoline) + lump-sum prepayment before breaking | Far more accurate penalty quotes | `calculators/mortgage-penalty` discount input; prepayment data in the lender DB | M | calc-b F2 | open |
| FEAT-033 | Blend-and-extend option next to port/break and renew/break | Often the cheapest real option | `port-vs-break` `interestOver` segments | M | calc-b F3 | open |
| FEAT-034 | Rental-income qualification calculator (50% add-back vs rental offset, GDS/TDS at the stress rate) | Investors see whether they qualify | `lib/calc/investment`, `QUALIFYING_RATIOS`, `stressTestRate` | M | calc-b F4 | open |
| FEAT-035 | Rent-vs-buy v2: provincial LTT + rebates, net-worth chart, separate inflation inputs | Credible long-horizon comparison | `lib/calc/landTransferTax.ts`, new monthly simulation | M | calc-b F5 | open |
| FEAT-036 | Reverse mortgage vs HELOC vs downsizing comparator | The real decision seniors face | reverse-mortgage + refi-vs-HELOC math | M | calc-b F6 | open |
| FEAT-037 | Cash-out "amount I need" + debt-consolidation pitch; accelerated-payoff scenario after consolidating | Converts cash-out traffic into consolidation leads | `refinance-cashout`, `equity-lending/calculators/debt-consolidation` | S | calc-b F7, calc-sp 8 | open |
| FEAT-038 | Stated-income (B-lender) estimator: bank-statement deposits × expense factor → stated income → max mortgage at B-lender ratios | Self-employed lead magnet | `calculators/self-employed`, `lib/calc/selfEmployed` | M | calc-b F10 | open |
| FEAT-039 | Construction: editable draw schedule, holdback + interest reserve, conversion to the permanent mortgage | Builder/owner-builder tool parity | `lib/calc/construction.interestOnlyCost`, progressive-draw `draws` state | S–M | calc-b F12, calc-sp 6 | open |
| FEAT-040 | Fixed vs variable rate-path comparison (flat / −1% / +1%) | Common client question | `rate-comparison` helpers | M | calc-b F13 | open |
| FEAT-041 | Calculator conveniences: payment-frequency selector, term-end balance/renewal preview, CSV export of amortization schedules | Power users and realtors | `payment()`, `balanceAfter()`, `buildSchedule` | S | calc-a | open |
| FEAT-042 | Combined "what can I buy?" qualifier (savings + income); stress-test pass/fail with actual income | Answers the top question in one step | `mortgage-qualifier` bisection, `isInsurable`, `minimumDownPayment` | S | calc-a | open |
| FEAT-043 | Lender-tier pricing from real data in pre-approval | Realistic rates by credit band | rates feed, lender DB | M | calc-a O5 | open |
| FEAT-044 | BC SVT credit estimator | Accurate bills for BC residents with partial exemptions | `calculators/bc-speculation-tax` | S | calc-a | open |
| FEAT-045 | **Broker-side lender matcher (admin)**: filter 147 lenders by province, beacon, LTV, income type and property | Faster deal placement | `CANADIAN_LENDERS`, `lenderIntelligence.ts`, `requireAdmin` | M | ai F-8 | open |
| FEAT-046 | Durable, redacted conversation analytics (top questions, unresolved intents → lead scoring) | Product insight + better scoring | `redactPII`, Firestore, `lib/crm/hubspot` scoring | M | ai F-7 | open |
| FEAT-047 | Regression evals for lender resolution + prompt grounding (~30 queries in CI) | Prevents a repeat of the "wrong lender injected" bug | the audit's node harness approach (see ai §5) | S | ai F-10 | open |
| FEAT-048 | Move lender data out of the bundle (Vercel Blob / Edge Config / Firestore, or lazily-loaded JSON) | Cold starts, tsc time, sane git diffs | the two consuming routes + `lenderIntelligence.ts` | M | plat P-F4 | open |
| FEAT-049 | Learn hub built from the blog (topical clusters) + blog search and category pages | SEO topical authority; usability | blog categories already derived; `lib/seo/internalLinks.ts` | M | fe | open |
| FEAT-050 | Province hubs (BC/AB/ON) rebuilt with regulator-specific disclosures; province selector in the main nav | Ranks for province queries; correct disclaimers per province | `/provinces/*` (now noindexed stubs), `BUSINESS.licenses`, `ComplianceBanner`, `ProvinceSelect` | M | fe, BUG-039 | open |
| FEAT-051 | **Multilingual site** (Punjabi, Hindi, Chinese first): translated key pages + calculators, `hreflang` | Matches the Surrey/Lower Mainland audience; the voice AI already speaks these languages | voice language detection (`lib/voice/*`), Thinkrr Hindi agent | L | orch | open |
| FEAT-052 | **Realtor / referral-partner portal**: co-branded calculator links and scenario shares with referral tracking, plus a partner dashboard | Referral channel growth | FEAT-017 scenario links, FEAT-024 UTM, FEAT-013 inbox | M–L | orch | open |
| FEAT-053 | Online secure mortgage application (multi-step, saves progress, exports to the broker's LOS) | Moves qualified leads straight to a file | `/qualify` multi-step form, FEAT-031 documents, FEAT-001 consent | L | orch | open |
| FEAT-054 | Google Calendar booking API (real availability, confirmations, reminders) | Replaces the static appointment link and the mock AI slots | `lib/ai/tools/appointment-tools.ts` (mock), email templates | L | be | open |
| FEAT-055 | Owner confirmed Twenty on VPS (2026-10-20); remove dormant `lib/crm/hubspot` in a separate cleanup | Less dead code, one source of truth | `lib/crm/hubspot/*` (complete, unused) | S | be | open (CRM decision resolved) |
| FEAT-056 | Feature flags (Vercel Flags / Edge Config) for voice widgets, AI provider routing, experimental calculators | Switch off a broken third-party widget without a redeploy | — | S | plat P-F6 | open |
| FEAT-057 | Speed Insights, preview-environment parity (+ Playwright on every preview), on-demand bundle analysis | Real-user CWV; catch breakage before prod | `@vercel/analytics` already installed | S | plat P-F8/F9/F12 | open |
| FEAT-058 | MLI tools: "Standard MLI" baseline option and other-shelter/surcharge toggles in premium & scenario tools | Fair comparisons; covers student/seniors/SRO | `lib/mli/calcs.ts` | S–M | calc-sp §3 | open |
| FEAT-059 | Ontario/Alberta cap-rate benchmarks with dated sources | Commercial tool credibility in all served provinces | `commercial/calculators/cap-rate` | S | calc-sp 9 | open |


## 2026-10-20 audit additions

| ID | Feature | Priority | Effort | Status |
| --- | --- | --- | --- | --- |
| FEAT-060 | Premium design system and common calculator shell; one help control; job-based searchable hub. Visual concept and acceptance criteria in the calculator premium audit. | P1 | M–L | done (2026-10-20; FEAT-069 tracks remaining body migrations) |
| FEAT-061 | Common result/assumptions contract: units, sources/dates, purpose, horizon, eligibility, cash/financed fees and rules version; explain binding constraint and sensitivity. | P1 | M | partly done (three tools; FEAT-069 remaining) |
| FEAT-062 | Integrated renewal offer / straight switch / refinance comparator with fees, cashback/clawbacks, actual payout quote and ending balances. | P1 | M | done for renewal / early break (FEAT-070 extension open) |
| FEAT-063 | Comfortable household budget and payment/income shock tool, separate from underwriting capacity. | P1 | M | open |
| FEAT-064 | Move-up / buy-before-sell / bridge planner: net proceeds, deposit timing, bridge/overlap costs and new purchase cash. | P1 | M | open |
| FEAT-065 | Suite/laneway/renovation investment planner: draw costs, reserves, rent and takeout sensitivity. | P2 | M | open |
| FEAT-066 | Variable-payment / trigger-rate model using actual product terms, prime paths, negative amortization and renewal shock. | P2 | M | open |
| FEAT-067 | Secure rental portfolio cash-flow, maturity, DCR/LTV and reserve-risk dashboard. | P2 | L | open |
| FEAT-068 | Per-person FHSA/HBP/down-payment timeline with room, dates, repayments, liquid cash vs later refunds and closing reserve. | P1 | M | open |
| FEAT-069 | Migrate the remaining 50 legacy calculator bodies to CalculatorShell and the complete shared result/assumptions contract, preserving each existing model and controls. All already receive the scoped restrained theme. | P2 | L | open |
| FEAT-070 | Extend the renewal decision workflow to different opening balances, cash-out and financed transaction costs with explicit use-of-funds reconciliation; retain the same-horizon economic comparison. | P2 | M | open |
