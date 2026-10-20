# Session Log

Newest first. Every agent or developer session that changes the repo adds an entry here before stopping.
Older history (2025-08 → 2026-10-04) lives in `/AI_CONTEXT_LOG.md`.

## Template

```markdown
## YYYY-MM-DD: <short title>
- **Who:** <agent/model or person>
- **Commit(s):** <hash(es) or "uncommitted">
- **Goal:** <what was asked>
- **Done:** <bullets; reference BUG-/FEAT- IDs>
- **Verified:** <tsc / lint / build / tests / manual checks and their results>
- **New items logged:** <BUG-/FEAT- IDs created>
- **Left in progress / handoff notes:** <what the next person must know>
```

---

## 2026-10-20: Communications repair, message-only Julia and verified owner notification

- **Who:** Codex. Owner explicitly authorized controlled tests, commits, push and live release.
- **Scope:** BUG-073..079, BUG-026 scraping removal, partial BUG-002 fallback removal and FEAT-002 shared receipt delivery. New BUG-080 Twilio token rotation required after plaintext diagnostic exposure; SMS/history/outbox limitations recorded in the communications audit.
- **Done:** Customer/operator WhatsApp routing; durable fast signed intake; website AI fallback for VPS 401; concise safely formatted dated/regional chat; shared rates loader; new Thinkrr inbound Julia agent 21437 and existing Twilio-number assignment; no transfer/booking, signed voicemail-only fallback, automated public-form callbacks disabled. Native /varun form and Twenty business funding replace retired GHL. Manpreet Principal Broker/info@ public contact corrected.
- **Verified:** Controlled phone call completed after asynchronous provisioning, correct message-only conversation in Thinkrr, 632-character transcript in Twenty and delivered owner WhatsApp notification. Signed WhatsApp acknowledgement/dedupe and delivered response. Signed SMS intake, SMTP accepted info@ test; mailbox arrival not claimed. 125 website tests, 3 receiver tests and 3 queue tests pass; isolated staged-tree type/lint/126-page build and 12/12 browser suite passed. Implementation 869edd7 deployed READY; three live inquiry types verified in Twenty. Production env still held the rejected embed; corrected it and cleared unverified Hindi. Final environment rebuild/control check follows. See communications-evidence/verification.md for final release state.
- **Preserved:** Four owner website data edits and CRM owner's pre-existing 34-line notification mirror remain separate. No client called. No credentials placed in new source/report.
- **Final live proof:** Both controlled phone and synthetic browser-audio voice sessions saved transcripts in Twenty and delivered owner WhatsApp notifications. Vercel public embed override corrected/rebuilt. Fresh WhatsApp answer delivered in50 words with dated/plain formatting. Three website inquiry types read back from Twenty with no-call consent. BUG-082 province synchronized; BUG-084 keyboard/quiet styling verified with a mocked SDK regression; final isolated build/lint clean and browser suite13/13. Credential rotation/auth/outbox limitations remain explicit.
- **Handoff:** [Communications audit](audit-2026-10/communications-audit-2026-10-20.md), mandatory DEVELOPER_GUIDE. Twilio/OpenRouter rotation, Thinkrr webhook authentication/event dedupe, full durable outbox, caller linking/summary/SMS history, mailbox and real Facebook delivery remain explicit follow-ups.

## 2026-10-20: Production release verified and handoff completed

- **Who:** Codex.
- **Commits:** d42ea97337f54f193c3768251d1e846b3263c824 (audit + premium calculator implementation), followed by the release-receipt/CMHC reference correction commit. Both authorized by the owner; main → origin/main → Vercel production.
- **Released:** BUG-061…071; FEAT-019/060 and renewal/early-break scope of FEAT-062. FEAT-061 partly delivered in three shared-shell tools; FEAT-069/070 explicitly remain open. All new engineering/aesthetic rules are in mandatory DEVELOPER_GUIDE.md.
- **Production verified:** Vercel dpl_6yqURBnT5Km64v8GtqW3Nd1aPUj5 READY for exact implementation SHA, www.kraftmortgages.ca alias, no alias error. All 53 live calculator routes HTTP200 with correct canonical/H1; home/directory/rates/sitemap checked. Safe live browser suite 12/12 pass, including actual PDF downloads and 1440/390/320px layout/axe checks. Full local 119/119 tests, clean tsc/lint and isolated 126-page production build recorded in the prior entry. Live evidence: audit-2026-10/premium-release-evidence/live-release.md.
- **Release follow-up:** BUG-072 corrected a draft external CMHC premium link returning 404. UI/guide now point to the official premium PDF linked by the CMHC MLI Select page, HTTP200 verified. No calculator model/input/output changed. This receipt commit is itself deployed by the normal main-branch pipeline; confirm its final SHA via git/Vercel when continuing.
- **Preserved:** Four pre-existing apps/web/data changes remain unstaged, untouched and excluded from deployment. No real leads, calls, WhatsApp messages or paid integration requests were sent by the checks.
- **Next:** Maintain the design contract; future FEAT-069 body migrations and FEAT-070 financed-cost/cash-out expansion must preserve the verified models. Existing owner security/legal/env/real-voice checks remain open in STATUS; this release does not certify them.
## 2026-10-20: Premium calculator system, integrated decision tools and release preparation

- **Who:** Codex.
- **Commit(s):** Release commit pending; base main 006c93a. Owner explicitly authorized committing, pushing and going live. Four existing apps/web/data changes excluded, preserved and not deployed.
- **Goal:** Implement the approved restrained design, simpler mobile experience, one help control, integrated renewal offers and MLI sizing; leave durable aesthetic/engineering instructions.
- **Done:** FEAT-060: scoped premium theme across calculator routes, searchable complete 53-tool directory; shared ivory/ink CalculatorShell for Payment, Renewal and new MLI Deal Sizer; mobile result summary/anchor. One AdvisorHelpDock replaces three launchers; preserves voice stop/park lifecycle, disclosure and explicit start. Added chat close button, focus restoration, voice modal Tab containment and accessible control sizes. FEAT-062: at-renewal quote vs two offers, early-break mode with actual payout penalty, cash fees/retained cashback/clawbacks, shortest locked horizon, interest-based net costs and ending balances. FEAT-019: points → tier → amortization/leverage → premium-inclusive DCR sizing, cash required and rate/NOI sensitivity, standard rental only. Local ungated current-state PDFs in all three shared-shell tools. FEAT-061 partly complete for those tools; contract documented for future migrations. Developer guide is mandatory via AGENTS.md/README; PDF binary Git attributes protect xref offsets.
- **Numeric examples:** $450k/22y lender renewal quote 5.49% vs 4.49%, $1,800 fees/$1,000 retained cashback/$500 clawback, 60 months: payment $2,923.69 vs $2,675.50; true net saving $20,077.18; ending debt $388,939.44 vs $382,453.48. Same-rate amortization extension lowers payment but increases interest and debt, so cannot win on payment alone. New standard rental $20M eligible cost, $1.2M NOI, 100 units/25 affordable for 10 years, 25% NECB improvement, 15% accessible/all visitable/barrier-free commons, 4.5%/50y/1.10x: points capped at 100; base $19M, financed premium $1,097,250, total debt $20,097,250, cash $1,050,000, monthly debt service ~$83,714, DCR ~1.19x. Earlier separate tools did not combine these constraints; the new model includes financed premiums in DCR.
- **Sources:** Official CMHC MLI Select and multi-unit premiums; OSFI uninsured straight-switch guidance checked 2026-10-20. Links in guide/UI. No regulatory table was changed in this implementation phase.
- **Verified:** 119/119 automated tests (2,160 independent payment/inverse/ledger combinations + 75 MLI band/rate/NOI/tier cases); local tsc/lint clean. Isolated archive build with all four data files matching HEAD after Git normalization: 126/126 pages, 86 runtime source files matched to release. Built app 53/53 HTTP200/H1/unique matching canonicals, sitemap includes new tool. Final merged 53-route browser scan: no page errors/axe violations/mobile overflow; five contrast regressions corrected and rechecked. Original 24/24 checks; built-app premium 12/12 including search, economic comparisons, invalid/fractional unit counts, help open/close/focus and voice disclosure without starting a call, current-state PDF bytes/results, axe and 1440/390/320px layout. Additional 136 numeric drafts/bounds plus three toggle cases on the new tools: no non-finite output or browser error.
- **New items:** FEAT-069 (remaining 50 legacy bodies/full result contract), FEAT-070 (cash-out/capitalized transaction costs in integrated renewal). Existing FEAT-058 covers special MLI purposes/surcharges. FEAT-006 browser CI still open.
- **Handoff:** Shared styling applies to all calculators; only three bodies are fully migrated to CalculatorShell. Renewal assumes same principal and cash-paid costs; no cash-out. MLI supports standard rental/NECB unit-based commitments, not other-shelter/non-residential/RHFAC/NBC paths. Taxes on premiums, application fees, construction carry/reserves must be included separately. No real leads/calls/messages, production traffic stress, live backend certification or full manual accessibility certification. Local Firebase is unconfigured and uses existing mock blog fallback. Final live receipt will be added after Vercel confirms the pushed SHA.
## 2026-10-20: All-calculator audit, correctness fixes and premium design specification

- **Who:** Codex.
- **Commit(s):** Uncommitted on main, base HEAD 006c93a. No push/deployment. Owner changes in four apps/web/data files preserved.
- **Goal:** Test every calculator, stress the math and inputs, fix demonstrated defects, and deliver complete premium design/product recommendations.
- **Done:** BUG-061…071 fixed; BUG-038/057 partly repaired for calculator pages; Toronto Closing Costs portion of FEAT-021 delivered. Shared finite input validation/accessibility, stable annuities/final payment, economic refinance recovery, user rate persistence, conventional renewal pricing, purchase/MLI eligibility, GDS/TDS sizing, safe scenario storage and construction surplus. Type augmentation leaves generated lender data intact. Added reusable browser audit scripts, a 52-route report, evidence and an interactive design concept using a compiled copy of the shared engine. Bounded accelerated-payment simulation to prevent non-UI runaway calls; softened an unjustified B-vs-equity best-option verdict.
- **Numeric before/after:** Commercial $400k at 5.75%/22y → 4.79%/25y, costs $13,870: recovery 37 → 48 months; five-year payment-based $8,863 → true net interest savings $3,167.70. MLI default 15% target margin: ~$1,388 rent/13.04% achieved → ~$1,419/15%. Home-equity example $120k income, $450 monthly housing costs, no debts, 4.69%/25y: capacity $579,703.75 → $506,323.53. HELOC monthly room $1,500 TDS-only → $1,200 with GDS ($10k income, $2,300 mortgage, $400 housing, $200 debt). Toronto first-time $700k: net LTT $6,475 provincial-only → $12,475 combined. Final-payment example $1k/12%/$175 monthly: interest $33.9768 → $34.0474. Construction $500k budget/$550k funding: remaining −$50k → $0 and separate $50k surplus.
- **Rule sources:** CMHC mortgage insurance and purchase/amortization guidance, CMHC MLI Select and premium grid; OSFI MQR; City of Toronto MLTT. Links and assumptions are in the report. No regulatory tax/premium table was changed in this pass.
- **Verified:** 109/109 tests, including 2,160 independent-ledger combinations; final 52/52 local routes HTTP 200, zero page errors, zero final axe violation nodes and no measured horizontal overflow at 390px; 24/24 targeted assertions/visual captures; lint 0 warnings/errors; final explicit type check 0 errors; final production build exit 0 (125 pages). Built-app smoke: 52/52 routes 200 with matching unique canonicals/H1s and 6/6 focused browser regressions.
- **New items logged:** BUG-061…071; FEAT-060…068. FEAT-006 now includes local scripts/stress coverage; browser CI is still open. Full report: audit-2026-10/calculator-premium-audit-2026-10-20.md.
- **Handoff:** Local fixes only; no production traffic stress or real submissions/calls. Remaining model limits and owner-dependent integrations/security/legal tasks are explicit in the report. Design system/new calculators are recommendations, not shipped capabilities. The initial sweep ran while fixes were under way; use final merged evidence for final accessibility status, not a percentage improvement against a pristine baseline.

## 2026-10-13/14: Round 2 — fix everything fixable, clean-up, ship to production

- **Who:** Claude Code (Opus 5.5) as orchestrator + 5 parallel agents (ai-voice, backend, frontend-seo, calc-res, calc-specialty).
- **Commit(s):** `a2030ab` (round-1 checkpoint), then the round-2 commit and data-refresh commit on branch `audit/2026-10-fixes`, fast-forwarded to `main` and pushed (production deploy). See `git log`.
- **Owner decisions this session:** ship straight to production; AI auto-call ONLY when the person ticks the consent box; delete unused code, retire the MLI microsite, untrack secret files. The owner offered a Vercel token in chat — it was **not used** (credentials pasted into chat aren't used; owner told to revoke it). The Vercel connector lacks env-var permission (403), so env vars remain an owner task.
- **Done:** see FINDINGS §0 (statuses for BUG-001…060) and FEATURES status table. Highlights:
  - Dependencies: Next 14.2.35, jsPDF 4.2.1, sanitize-html; removed 13 unused deps + 3 old AI SDKs; pnpm-only deploy; `package-lock.json` removed.
  - Compliance: consent boxes on all forms, consent-gated AI calls with stored evidence, recipient-local CRTC calling window, privacy policy disclosures (legal review pending).
  - Security: blog HTML sanitized end-to-end, BDM contacts redacted, CSP Report-Only, CRM webhook secret header, Facebook dedupe, Firestore rules file.
  - Data: live feed fixes (mislabelled private seconds, serial dates); found the root cause of the `isDormant` build break in `Hermes Agent/enrich_appraisal_legal_all_lenders.py` and fixed its template (backup kept).
  - Calculators: live-rate defaults everywhere, BUG-053 gaps, constants verified against primary sources, PDF/lead capture on commercial + MLI tools.
  - SEO: 13 hub calculators + MLI pages get their own canonicals; sitemap complete; WebP blog images.
  - Clean-up: ~60 dead files deleted (import-graph verified), microsite retired, strays removed/moved.
- **Verified:** `tsc` 0 errors; `next lint` 0 errors / 0 warnings; `pnpm test` 98/98; `next build` OK (125 pages); local `next start` smoke test of 31 routes (all expected codes: 200s, 308 redirects, 404 for removed pages, `/admin` 503 until its env vars are set); browser check of homepage, payment calculator (correct $3,793/mo on $700k @ 4.29% / 25y), footer licences. Production deploy `dpl_3FZQxeb6DyPsUXmz2fLjUFtTEbYo` (commit `6fa4639`) live ~150 s after push and verified on www.kraftmortgages.ca (routes, headers, rates API). Apex redirect still 307 (owner, Vercel Domains).
- **New items logged:** BUG-054…060; FEATURES status table.
- **Left in progress / handoff notes:**
  - Owner checklist in STATUS.md (env vars, key rotation, Firestore rules, FB consent question, apex redirect, legal review).
  - Test a real Thinkrr call (close button relies on Thinkrr internals).
  - Next engineering: FEAT-003 (durable rate limits), FEAT-002 (unified lead ingestion), FEAT-009 (tool calling), FEAT-018 remainder, BUG-038 remainder, Playwright smoke tests.

## 2026-10-12: Full codebase audit, fixes, and developer log

- **Who:** Claude Code (Opus 5.5), acting as orchestrator, plus 7 parallel area agents: calc-res-a, calc-res-b, calc-specialty, ai-voice, backend, frontend-seo, platform.
- **Commit(s):** uncommitted (base `891d870`). The owner's data refresh in `apps/web/data/` was already uncommitted before the session.
- **Goal:** The owner asked for:
  - an audit of the entire codebase
  - a list of new features to add
  - a find-and-fix pass on all flaws and mistakes, "including the calculators"
  - a developer log that lets any future agent pick up where this one left off
- **Done:**
  - Created `DEVLOG/` (README protocol, STATUS, FINDINGS, FEATURES, SESSIONS) and 7 detailed audit reports in `DEVLOG/audit-2026-10/`.
  - About **200 fixes**, summarised in FINDINGS.md §3:
    - ~93 calculator fixes. Major ones: required-income % ÷ 12; down payment and CMHC rules; BC first-time PTT exemption; refinance break-even; negative interest in 3 calculators; refi-vs-HELOC; rent-vs-buy; port-vs-break IRD; commercial refinance; MLI Select tiers and premium grid; HELOC; debt consolidation; alternative income; construction draws; Canadian semi-annual compounding everywhere; new `lib/calc/landTransferTax.ts`. The AI chat calculators now match the web calculators.
    - Security:
      - Twilio toll-fraud endpoint.
      - Unsigned Twilio callback (SSRF).
      - Unauthenticated pipeline/cron/admin routes.
      - `mli-proxy` path traversal.
      - Public `/admin` lead data.
      - Admin list leak.
      - Contact-form abuse.
      - Facebook webhook fail-open.
      - Rate limits on paid AI endpoints.
      - Security headers.
    - Reliability: silent lead loss; three conflicting Firebase initialisers; the AI content pipeline could never complete; chat lender resolver hijacking ordinary questions.
    - SEO/compliance: homepage canonical inherited by ~25 pages; robots/sitemap/JSON-LD fixes; licence footer on ~100 pages; AI disclosure and recording notices; unsubstantiated "lowest rate / guarantee" wording; stale $1M down-payment rule in city FAQs.
    - Platform: complete `.env.example` (72 vars), CI that actually type-checks, lint 172 errors → 0 (CI lint now blocking).
  - Orchestrator integration pass:
    - `isDormant` added to the interface (approved by the owner mid-session).
    - Fixed a `rate-tools.ts` compareRates crash plus compounding.
    - Dead links in the AI navigation tool and the blog ingest pillar map.
    - Metadata for `/calculators` (server page + `CalculatorsHub.tsx` client component), `/qualify`, `/mli` and all MLI pages.
    - Removed duplicate nav on 5 MLI pages.
    - Footer on all calculators, MLI pages and service hubs.
    - Service-hub JSON-LD and og:image fixes.
    - Escaped 171 JSX entities.
  - Feature backlog: 59 items (FEAT-001…059) prioritised P0–P2.
- **Verified:**
  - `tsc` 0 errors.
  - `next lint` 0 errors (2 warnings).
  - `next build` succeeded (135 static pages).
  - All calculator verification suites re-run against the final combined code and passing. They are throwaway scripts in the session scratchpad, not in the repo; FEAT-006 ports them.
  - **No browser/visual verification was done.**
- **New items logged:**
  - BUG-001…053 (open items; IDs 001–006, 014, 015, 027, 028 and 036 need the owner).
  - FEAT-001…059.
- **Left in progress / handoff notes:**
  - Nothing is committed. Keep the audit work and the owner's data refresh in separate commits. Read BUG-028 before committing the data file.
  - **Deploying will change behaviour** (see STATUS.md "Behaviour changes"). In particular, `/admin` returns 503 until `ADMIN_BASIC_AUTH_*` is set, and the Twilio callbacks need `TWILIO_AUTH_TOKEN`.
  - The most urgent owner items are key rotation (BUG-001/002) and env vars (BUG-006).
  - The most valuable next engineering steps are a visual QA pass, then FEAT-006 (tests), FEAT-007 (live-rate defaults), FEAT-003 (durable rate limits) and FEAT-002 (unified lead ingestion).
  - `CLAUDE.md`'s status sections are stale. A pointer to this DEVLOG was added at its top; `AGENTS.md` was created for non-Claude agents.
