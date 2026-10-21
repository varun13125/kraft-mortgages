# Kraft Mortgages — development & design contract

Last reviewed: 2026-10-21. This is the durable implementation guide. `STATUS.md` describes the current release; `SESSIONS.md` records what changed. Read this after those documents, before changing UI, calculator logic or integrations. The DEVLOG takes precedence over stale root history.

## Start here when continuing

1. Read `DEVLOG/README.md` → `STATUS.md` → `FINDINGS.md` → `FEATURES.md` → newest `SESSIONS.md` entry → this guide.
2. Run `git status --short` and `git log -8 --oneline`. Identify pre-existing owner changes. Never edit, stage or revert unrelated data updates. Generated lenders, rates and underwriting matrices in `apps/web/data/` often belong to an independent refresh workflow.
3. Claim the relevant `BUG-###` / `FEAT-###`. Keep IDs permanent. Do not reimplement a completed fix without first reading its tests and recorded reasoning.
4. State the intended behavior, complete it, verify it and update the log. Do not stop after only proposing a plan. A new agent must be able to distinguish working code, recommendations and production verification.
5. Commit/push/deploy only when the owner authorizes it. The owner authorized the 2026-10-20 audit and premium calculator release; this is not blanket authorization for future unrelated releases.

## Product direction

Kraft should feel like a calm, capable mortgage advisory firm. Premium means clear hierarchy, careful typography, generous but purposeful spacing, accurate numbers and transparent assumptions. It does not mean adding ornament or making a visitor wait for an animation. Keep existing business identity and verified business facts.

Every calculator should answer a concrete decision in this order: what to enter → what the result means → what limits it → what the next step is. Avoid approval promises, unexplained verdicts, invented urgency, unverified testimonials and unsupported lending claims.

## Aesthetic rules

The reference implementation is `components/calculators/CalculatorShell.tsx`; styling is `app/calculator-experience.css`. The main directory is `CalculatorDirectory.tsx`. `CalculatorExperience.tsx` scopes the restrained treatment to calculator routes, leaving service pages independently styled.

| Role | Token / rule |
| --- | --- |
| Main background | Ink `#111820` |
| Results / secondary surface | `#18212b` |
| Form surface | Warm ivory `#f4f0e8` |
| Form text | `#18222d` |
| Primary accent | Muted gold `#c3a477`; dark text on filled buttons |
| Body text on ink | `#eff1f3`; secondary `#bac3ce` |
| Display type | Georgia / Times serif, regular weight; restrained negative tracking |
| Interface type | Existing system sans; numeric results use tabular figures |
| Shapes | 7px inputs/buttons; 9–16px cards; thin quiet borders |
| Interaction | Visible keyboard focus; at least 44px main targets; no pulse/glow/rotation on calculator CTAs |

- Use one dominant result and one clear primary action. PDF download is secondary, after results.
- Use gold sparingly: headings/selected states/primary action. Keep green/red for meaningful outcomes, with accompanying words.
- No rainbow borders, gold glows, bouncing cards, animated counters, decorative dashboard grids or giant calculator heroes. Do not add stock luxury imagery to a calculation workflow.
- Desktop uses an ivory input panel beside an ink results panel. Content dictates height; do not use a fixed viewport-height form.
- Mobile stacks panels, uses 16px input text and compact spacing, and shows the main result summary before long inputs. Provide an anchor to full results. Advanced commitments and details may collapse; required inputs and errors must remain discoverable.
- Preserve the accessible contrast of both themes. An existing dark-theme utility class can become unreadable inside an ivory panel. Test the rendered result, not just a class name.
- Do not apply broad global color overrides to charts: legends and data series must continue to agree. Scope legacy refinements to `.calculator-experience`.
- The legacy calculators receive scoped typography, spacing, control and decoration improvements. Payment, renewal and MLI deal sizing use the full shared shell. Future migrations should use this shell and preserve the old tool’s supported behavior. A shell rollout is not permission to silently change the financial model.

## Calculator architecture

| Concern | Source |
| --- | --- |
| Shared Canadian annuities, inverse, balance, acceleration | `lib/calc/payment.ts` |
| GDS/TDS, stress test, maximum purchase | Existing modules in `lib/calc/*` |
| Purchase eligibility | `lib/calc/purchaseEligibility.ts` |
| Refinance cost/recovery | `lib/calc/refinance.ts` |
| Renewal offer comparison | `lib/calc/renewal.ts` |
| Integrated standard rental sizing | `lib/calc/mliDeal.ts` |
| MLI criteria/premium grid | `lib/mli/calcs.ts`, consumed by `lib/calc/mliDeal.ts` |
| Numeric drafts and finite validation | `components/ui/CalculatorNumberInput.tsx`, `lib/utils/validation.ts` |
| Rate selection / edit preservation | `app/(site)/calculators/_lib/liveRateDefaults.ts`, `lib/useLiveRates.ts` |
| Complete calculator registry | `lib/calculators/catalog.ts`; route-coverage test prevents omissions |
| Scenario PDF | Shared `ScenarioDownload`, dynamically imports existing generic PDF renderer |

Keep financial calculations in `lib/calc/*`. UI components should collect inputs and format engine outputs. Reuse MLI tables rather than copying constants. Do not create a second annuity formula in JSX, API handlers, PDFs or AI tools. Tests may use independent formulas or monthly ledgers to detect shared-engine errors.

### Non-negotiable math conventions

- Fixed Canadian mortgages use semi-annual compounding: effective monthly rate `(1 + nominalPct / 200)^(1/6) - 1`. Variable and HELOC products may use different conventions; do not imply this model prices them accurately.
- `payment(...paymentsPerYear:26)` means **accelerated** biweekly: monthly payment / 2, 26 times annually. Do not label it regular biweekly.
- Separate term from remaining amortization. Stop at payoff, charge the final scheduled month correctly, cap simulation work and guard non-finite inputs. Keep rounding at display boundaries except conservative proceeds flooring.
- Invalid/blank drafts remain visible and retain the last valid result, with an explicit message. Never silently turn an invalid field into zero or an approval verdict. Associate labels, descriptions and errors programmatically.
- Lower payment is not automatically a saving. Refinance/renewal compares interest plus cash costs over a common horizon and shows ending balances. Fees, retained cashback, clawbacks, penalty and whether costs are financed must be explicit.
- Renewal-at-maturity uses the **new lender renewal quote** as baseline. Early break uses the current contract and actual payout penalty. Cap comparisons at the shortest known term; do not assume an unknown renewal rate. The integrated renewal tool uses the same opening balance and cash-paid fees; cash-out/capitalized-fee modelling remains a separate scope.
- The straight-switch indicator describes unchanged balance/amortization only; it is not eligibility or underwriting approval. OSFI exemption depends on the transaction and lenders. Cite the official rule.
- MLI Select deal sizer supports **standard residential rental, at least 5 units**. Invalid counts or fewer than 50 points suppress proceeds. Tier caps differ by project and points. Financed insurance premiums consume DCR capacity; solve across premium-band discontinuities conservatively. Show base loan and gross insured debt separately.
- MLI cash required = accepted cost/value − base proceeds + entered closing/reserve costs + cash-paid premium. Taxes on premium and special surcharges are not silently included. Clearly state omissions. Never use retail residential rate feeds as commercial MLI quotes.
- A target profit margin is profit / revenue, not a markup on cost. GDS and TDS are independent limits; zero income cannot support a positive qualification verdict.

### Result and disclosure contract

For every new calculator, show CAD/period/units, scenario purpose, rate source/date or “illustrative”, the actual comparison horizon, eligibility limits, cash versus financed costs, ending balance where relevant, and material exclusions. Link rule sources near expandable assumptions and date their review. Explain the binding constraint and useful sensitivity when applicable. Export the inputs and matching outputs from the current engine state; do not independently recalculate in the PDF.

Official sources checked 2026-10-20:

- [CMHC MLI Select](https://www.cmhc-schl.gc.ca/MLISelect)
- [CMHC multi-unit premiums and fees](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf?rev=477fd129-abf9-4027-a71a-52bf53e2ee32)
- [OSFI uninsured straight switches](https://www.osfi-bsif.gc.ca/en/news/backgrounder-minimum-qualifying-rate-mqr)

Re-check official sources before changing regulatory tables. The audit report has links for residential insurance, provincial/municipal taxes and qualifying rules. A date in a comment is not proof that a rule is still current.

## Help, leads and privacy

### Owner-confirmed communications architecture (updated 2026-10-21)

- **Twenty CRM on the Hostinger VPS is the only brokerage CRM.** The default `TWENTY_WEBHOOK_URL` ends in `/webhook/contact-form`, but nginx proxies it to the Node `kraft-finmo-webhook` service on port 8081; it is not an n8n workflow. Do not restore retired GoHighLevel business-funding forwarding or the `/varun` GHL iframe. A disconnected GHL notice in Thinkrr is stale configuration, not a reason to reconnect it.
- **Julia takes messages for the Kraft Mortgages team. No live call transfer to the office, no round-robin handoff, no autonomous booking.** This October21 instruction supersedes earlier Varun-only wording. Say: “I can take a message, and a member of our team will get back to you.” Collect the message first, then optional name/contact/callback preference with permission; acknowledge it and save it in Twenty through existing owner-controlled notifications. The owner can delegate follow-up to an authorized team member. Do not promise a named person, assignment or response deadline, or expose internal staffing/location/time-zone details. Do not change notification recipients or start automatic callbacks. Staff can introduce themselves: “Hello, this is [first name] calling from Kraft Mortgages about the message you left with us.” Website chat may explain general mortgage concepts; voice is message intake.
- Authentication follow-ups: BUG-083 covers the actual VPS Thinkrr hook; BUG-085 covers direct website receiver access. Optional sender headers/old Next secrets alone do not enforce authentication at either VPS endpoint. Coordinate all legitimate senders before enforcement.
- Existing Thinkrr account-level completion webhook: `https://crm.srv848694.hstgr.cloud/thinkrr-hook`. Existing receiver mirrors to the configured owner WhatsApp number and the Discord bridge (`#whatsapp-alerts`), not Telegram. Verify delivery receipts and channel permissions before claiming the notification reached Varun.
- Thinkrr web agent **21437, Julia — Kraft Website**, was created during this repair; public embed identifier lives in `lib/voice/thinkrr-widget.ts`. The previous website fallback and production NEXT_PUBLIC override were rejected with HTTP 403. Public embed environment overrides require a rebuild; inspect the actual published request, not source defaults alone. Unsupported Hindi embed was cleared until a verified message-intake agent exists. A widget is only ready when its controls render; opening the modal is not a connected call.
- Controlled phone AND synthetic browser-audio tests verified Julia message intake, Twenty transcripts and delivered owner WhatsApp notifications. Hardware microphone permission/device behavior and email inbox arrival are separate checks. Voice controls receive scoped muted-gold/no-glow styles and keyboard semantics; the regression uses a stub SDK, never a real call. Exact release receipts are in the communications audit.


- `AdvisorHelpProvider` owns the active help panel. `AdvisorHelpDock` is the single launcher for brokerage phone, WhatsApp, text AI and voice AI. Do not reintroduce competing floating buttons.
- Selecting voice opens disclosures/language selection. Never start a call from opening help or loading a page. Preserve `ThinkrrVoiceWidget`’s stop-and-park lifecycle: removing its DOM does **not** hang up a call. Closing/Escape must call the existing end-session logic.
- Keep AI disclosures and contact consent. Automated callback controls are hidden while `AUTOMATED_CALLBACKS_ENABLED` is false; do not restore campaigns without an owner decision. Do not change lead ingestion or claim delivery success without checking API responses.
- New integrated scenario PDFs are local and ungated. Existing calculators with lead-gated reports retain their established consent flow until deliberately migrated.
- Default automated checks use mocks/stubs or blocked requests. Real messages/calls require explicit owner authorization and controlled contacts. The owner authorized the 2026-10-20 communications tests using the existing business line and info@kraftmortgages.ca. Label tests, never contact clients and record receipts.
- Business names, licensing, phone, addresses and operating hours come from `lib/seo/business-config.ts`. Do not duplicate them in components.

## SEO and routing

Next.js 14 App Router, strict TypeScript. The web app is `apps/web` in a pnpm workspace. Calculator leaf pages need an H1 and unique canonical/OG URL; parent metadata can otherwise leak into children. Add each public tool to `lib/calculators/catalog.ts`, its relevant hub/navigation and `lib/seo/sitemap.ts`. MLI routes inherit Navigation/Footer from their section layout; general calculator pages render Navigation and inherit Footer. Do not duplicate those wrappers.

## Verification and evidence

Run from `apps/web` on Windows (Node 22.18+; local tools, no `npx tsc`):

```powershell
node node_modules/typescript/bin/tsc --noEmit --incremental false -p .
node node_modules/next/dist/bin/next lint
node --test "tests/**/*.test.mjs"
node node_modules/next/dist/bin/next build
```

Typecheck/lint must have zero errors; lint should have zero warnings. Do not run dev and production build against the same `.next` concurrently. Stop the server first. Stale generated route types can require clearing **only the resolved `apps/web/.next` within this workspace**, after checking the absolute path. Never delete unrelated folders.

Browser harnesses are in `scripts/audit-calculators.cjs`, `audit-calculator-regressions.cjs` and `audit-premium-release.cjs`. Set `AUDIT_TOOLS` to an external installation containing Playwright and `@axe-core/playwright`, `AUDIT_OUTPUT` to an evidence directory, and optionally `AUDIT_BASE_URL` (defaults to localhost:3100). `AUDIT_QUICK=1` scans route health, accessibility, toggles and mobile overflow; full mode also stresses numeric/select controls. Use installed Chrome. No browser dependency is added to production dependencies.

Required for calculator changes: independent expected numbers, zero/tiny/high rates, invalid/non-finite inputs, relevant eligibility/band boundaries, no NaN/Infinity, and a before/after example in SESSIONS. Check desktop and 390px mobile, keyboard navigation, labels/errors, help open/close, current-state PDF and unique canonical. Automated axe is a useful gate, not full accessibility certification. Traffic load testing and real integration tests require their own controlled plan.

## Release and rollback

1. Confirm current branch/remote and authorization. Fetch origin and inspect divergence; never force-push. Review staged diff and `git diff --check`. Stage explicit paths excluding unrelated owner data and secrets.
2. Finish type/lint/tests/browser/build first. If the working tree contains unrelated data changes, validate the **staged Git tree** separately so the committed data baseline is tested too. Never deploy the dirty directory by accident.
3. Push the reviewed commit to the configured production branch (`main`). Vercel project: `kraft-mortgages`, `prj_6czOXZkuqKyVm02yyU4yBpbTLlwh`, team `team_0EUuetdSQbmqlyYnpDd6pRgw`. Use the authenticated connector; never use a pasted token or print `.env*` values.
4. Verify a READY production deployment for the exact pushed SHA, and verify `https://www.kraftmortgages.ca` serves the changed routes. Check links/canonicals/rates and a safe read-only browser flow. A successful push or build is not proof that the custom domain is live.
5. Record release metadata/evidence in the DEVLOG. If the release fails, inspect deployment logs; do not claim success. Rollback requires choosing a previously verified production deployment/commit, never an arbitrary preview or a dirty upload.

## Finish with a usable handoff

Update every touched ID; distinguish “done”, “partly done”, untested production dependencies and recommendations. Prepend SESSIONS with scope, files, numeric examples, tests, release state and next step. Refresh STATUS. Preserve owner security/legal/credential tasks; do not mark them fixed by a visual redesign. Link the report, guide and evidence so the next agent can continue without reconstructing a long chat.
