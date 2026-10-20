# Project Status

**Last updated:** 2026-10-20 — communications repairs verified locally/VPS; authorized website release being finalized
**Branch:** `main`; communications implementation `869edd7` pushed/deployed; environment correction/final receipt follow-up in progress. Four owner data-file changes remain excluded and untouched.

## What this project is

Kraft Mortgages (kraftmortgages.ca) is the website of a licensed mortgage brokerage serving BC, Alberta and Ontario. It includes:
- 53 Canadian mortgage calculators (residential, commercial, construction, equity, private, CMHC MLI Select), with live product benchmarks where appropriate and explicit commercial quote assumptions
- an AI chat assistant with lender intelligence over a ~147-lender database
- voice AI (Thinkrr Julia message intake; automated public-form callbacks disabled; signed Twilio voicemail fallback)
- lead capture with CASL consent evidence → Twenty CRM via the VPS Node receiver and Discord
- a Firestore-backed blog with an AI content pipeline (drafts + admin publish)
- city landing pages and SEO infrastructure

Stack: Next.js 14.2.35 App Router, TypeScript strict, Tailwind, Firebase/Firestore, pnpm monorepo (`apps/web` is the site), Vercel (pnpm install, root `vercel.json`).

## Communications repair in progress (2026-10-20)

BUG-073…079 are claimed by Codex. Owner confirmed Twenty on VPS is the CRM (no GoHighLevel), and Julia must **only take messages for Varun, never transfer live calls to the office**. See DEVELOPER_GUIDE for the verified service map. Website implementation passed isolated staged-tree typecheck, lint, 125 tests, 126-page build and 12 browser regressions; release is being finalized. VPS contact receiver now accepts repeat emails, writes modern linked notes/consent, and has a verified successful website test. WhatsApp signed acknowledgements are fast/deduplicated; a real test reply was delivered after adding the website AI fallback for the VPS's rejected OpenRouter key. Thinkrr new inbound agent 21437 has a verified controlled phone transcript in Twenty and delivered owner WhatsApp notification. Published-domain web controls and release validation are being completed. See the communications audit.

## Current calculator release (2026-10-20)

- [Complete calculator/premium report](audit-2026-10/calculator-premium-audit-2026-10-20.md), [interactive design concept](audit-2026-10/premium-calculator-concept.html), [run evidence](audit-2026-10/calculator-audit-evidence/summary.json).
- BUG-061…071 repaired; Toronto Closing Costs portion of FEAT-021 delivered. FEAT-019/060/062 implemented; FEAT-061 contract applied to three shared-shell tools. Other roadmap items remain open. Required [developer/design guide](DEVELOPER_GUIDE.md).
- 53/53 routes returned 200 with unique matching canonicals; final merged axe scan zero violations, no page errors/390px overflow. 119/119 tests, 2,160 ledger combinations + 75 MLI sizing combinations; 136 additional numeric UI stress cases. Original 24/24 and new built-app 12/12 browser checks pass. [Premium release evidence](audit-2026-10/premium-release-evidence/verification.md).
- Restrained calculator theme and searchable 53-tool directory; single guidance launcher; Payment, Renewal and MLI Deal Sizer use the full ivory/ink shell, mobile result summaries and ungated scenario PDF. Remaining legacy body migrations: FEAT-069; cash-out/capitalized-fee renewal extension: FEAT-070. Vercel production deployment dpl_6yqURBnT5Km64v8GtqW3Nd1aPUj5 is READY for d42ea97337f54f193c3768251d1e846b3263c824 and owns www.kraftmortgages.ca. See the live receipt in the evidence folder. Real AI/CRM/voice integrations and field performance remain unverified.

## Health (local 2026-10-20)

| Check | Result |
| --- | --- |
| Type check: `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` | ✅ 0 errors (delete `apps/web/.next` first if it has stale route types) |
| Lint: `cd apps/web && ./node_modules/.bin/next lint` | ✅ 0 errors, 0 warnings |
| Tests: `pnpm test` (→ `node --test "tests/**/*.test.mjs"`, Node ≥ 22.18) | ✅ 119/119 (includes integrated renewal/MLI, registry, stress, eligibility and input regressions) |
| Production build: `cd apps/web && ./node_modules/.bin/next build` | ✅ Final isolated build passed, 126/126 pages, committed data baseline; runtime source matched to release files |
| Local smoke test (`next start`) | ✅ Built app: 53/53 calculator routes 200, matching unique canonicals/H1s; 12/12 premium regressions. External integrations not exercised |
| Browser check | ✅ All 53 calculators; final merged axe 0 violations/page errors/390px overflow; 24 original + 12 built-app premium checks; 136 new numeric input cases. New tools also checked at 320px. No real calls/leads or full manual accessibility certification |
| CI (`.github/workflows/ci.yml`) | typecheck, lint, test, build — all blocking |

## Owner checklist (nothing below can be done by an agent)

1. **Revoke the Vercel token pasted into chat on 2026-10-14** (it was not used).
2. **Rotate Twilio token exposed by Thinkrr import UI (BUG-080), updating Thinkrr/VPS/all validators together. Rotate rejected VPS OpenRouter key.** Then **rotate leaked keys** (BUG-001, BUG-002): Google Cloud, ElevenLabs, MiniMax, n8n, Postiz, Vapi. Then purge history (`git filter-repo`, see platform report §5.4) and enable GitHub secret scanning.
3. **Vercel → Settings → Environment Variables** (Production + Preview):
   - `ADMIN_BASIC_AUTH_USER`, `ADMIN_BASIC_AUTH_PASSWORD` — choose them; **`/admin` is locked (503) until set**.
   - `CRON_SECRET` — any long random string.
   - `VAPI_*` legacy credentials must be rotated if retained; public-form outbound calling is disabled and does not need reactivation.
   - Confirm these already exist: `TWILIO_AUTH_TOKEN` (needed to verify Twilio callbacks), `FACEBOOK_APP_SECRET` (without it FB leads get no AI call), `THINKR_WEBHOOK_SECRET` (set the same value in Thinkrr), a Firebase Admin credential, `DISCORD_LEAD_WEBHOOK_URL`, `CREWAPI_SECRET` (not `CREWAI_SECRET`).
   - Optional: `CRM_WEBHOOK_SECRET` (then make the VPS receiver require header `X-Webhook-Secret`), `LENDERS_API_KEY` (if an external tool needs BDM contacts), `AI_AUTO_PUBLISH=true` (only if AI posts should skip review).
4. **Vercel → Domains:** set `kraftmortgages.ca` → `www` redirect to **Permanent (308)** (currently 307).
5. **Firestore rules:** `firebase deploy --only firestore:rules` (file at repo root).
6. **Facebook Lead Ads:** review contact/marketing consent and run a controlled signed lead test. Automated callbacks are disabled under the message-only policy.
7. **Legal review:** consent wording (`lib/compliance/consent.ts`) and the updated privacy policy.
8. **Test a real Thinkrr voice call** on the live site and confirm "End" hangs up.
9. **Decisions still open:** marketing claims (BUG-014), business facts (BUG-036), APR disclosure (BUG-037), A-vs-B tax-years default (BUG-043), Vapi vs Thinkrr (BUG-031), add `build_approved_directories.py` to the scheduled sync (BUG-028), fix CTBC + private-second rows upstream in the Hermes generator (BUG-027/055).

## Next up for agents (in order)

1. Read DEVELOPER_GUIDE.md and the latest session. The audit and approved premium phase are released. FEAT-069 (remaining body/result-contract migrations) and FEAT-070 (different balances/financed costs) are future extensions; keep them separate from delivered capability. Confirm the latest production SHA using the release guide before a new release.
2. **FEAT-003** durable rate limiting (Vercel WAF/Upstash) + merge the two guard helpers (BUG-007).
3. **FEAT-002** unified lead ingestion (`lib/leads/ingest.ts`).
4. **FEAT-009** tool calling in the live chat + chat consent form (BUG-026/041).
5. **FEAT-018** remaining PDF/lead-capture pages; **BUG-038** contrast on calculator pages; **BUG-057/058**.
6. Browser CI integration for the reusable local audit scripts (FEAT-006); remaining manual accessibility and production performance checks (FEAT-057); Next upgrade plan.

## Behaviour changes now live (rounds 1 + 2)

- **Calculators give different (correct) numbers** and start from live rates (until the visitor edits a field). Many verdicts changed — see the calculator reports for before/after.
- **Message-only workflow (owner decision 2026-10-20):** public forms/Facebook save inquiries without automated calls. Julia takes incoming messages for Varun; no transfer/booking. Older consent/calling-hours code remains for historical campaigns and is not authorization to reactivate them.
- `/admin` requires HTTP Basic Auth. Cron/pipeline routes require `CRON_SECRET`/`CREWAPI_SECRET`. AI blog posts are saved as drafts; publish from the dashboard.
- Lead APIs are validated + rate-limited and can return 429/500/502 instead of a fake success; consent evidence is stored with every lead.
- Chat: "AI Mortgage Assistant" disclosure, Clear-chat button, 30-day history expiry, timeouts. Voice: AI/recording notices.
- Security headers on every response, CSP in **Report-Only** (violations → `/api/csp-report`). Blog HTML sanitized.
- SEO: every indexable page has its own canonical/OG; sitemap = 96 real URLs; `/residential/calculators/stress-test` → `/calculators/stress-test`; deleted pages 404 (old-design, `[city]`).
- The old static MLI microsite is gone (only `/mli-select/guide.pdf` kept).

## Where things live (quick map)

| Thing | Location |
| --- | --- |
| Live chat | `components/ChatWidget/ChatWidget.tsx` → `app/api/chat/route.ts` (OpenRouter deepseek → Gemini → NVIDIA → lender dossier; 50 s budget) |
| Lender intelligence | `lib/ai/lenderIntelligence.ts` (+ `CHANNEL_CORRECTIONS`) over `data/canadianLendersData.ts` (generated by `Hermes Agent` scripts — don't hand-edit) |
| Content pipeline LLMs | `lib/ai/llm.ts` (fetch-based; `LLM_*_MODEL` overrides), stages in `lib/pipeline/stages/*`, JSON parsing via `lib/pipeline/json.ts` |
| Calculator math | `lib/calc/{payment,cmhc,affordability,landTransferTax,investment,selfEmployed,construction,refinance,purchaseEligibility}.ts`, `lib/mli/calcs.ts`; live-rate defaults helper in `app/(site)/calculators/_lib/` |
| Live rates | `app/api/rates` → `lib/rates.ts` (feed sanity: private-second floor, serial dates) → `lib/useLiveRates.ts` (deduped, 5-min cache) |
| Consent | `lib/compliance/consent.ts` (text + version) — every lead form uses it |
| Calling hours | `lib/businessHours.ts` (`getCallingHoursStatus` office window + `isRecipientCallable` CRTC window) |
| CRM webhooks | `lib/crm/webhooks.ts` (URLs + `X-Webhook-Secret`) |
| HTML sanitizer | `lib/security/sanitizeHtml.ts` |
| Auth helpers | `lib/auth.ts` (`requireAdmin`, `verifyCronRequest`, `hasServiceSecret`, `safeEqual`, `getTrustedOrigin`); `/admin` Basic Auth in `middleware.ts` |
| Request guards | `lib/compliance/requestGuards.ts` (forms), `lib/ai/request-guards.ts` (AI/voice) — merge per FEAT-003 |
| Tests | `apps/web/tests/{calc,specialty,backend}/*.test.mjs` (`tests/specialty/helpers/register-ts-paths.mjs` resolves `@/` imports) |
| SEO | `lib/seo/` (`business-config.ts` NAP/licences, `og.ts` OG_DEFAULTS, `jsonld.ts`, `schema.ts`, `sitemap.ts`), `app/robots.ts` |
| Env var inventory | `apps/web/.env.example` (canonical), root `.env.example` (mirror) |
| Deploy | Vercel Root Directory = repo root; root `vercel.json` (`pnpm install --frozen-lockfile`, `pnpm run build`, cron `/api/orchestrate` 09:05 UTC); output `apps/web/.next` |

## Area ownership map (for parallel agents)

| Area | Owns |
| --- | --- |
| `calc-res` | `app/(site)/calculators/**`, `lib/calc/*.ts`, `components/ui/ValidatedInput.tsx`, `lib/validators.ts`, `lib/utils/validation.ts`, `tests/calc/**` |
| `calc-specialty` | `app/(site)/{commercial,construction,equity-lending,private-lending,residential,mli-select}/**`, `components/{mli,calculators,calculator-report,charts}/**`, `components/PdfLeadModal.tsx`, `lib/mli/**`, math in `lib/ai/tools/{calculator,mortgage}-tools.ts`, `tests/specialty/**` |
| `ai-voice` | `lib/ai/**` (except that math), `app/api/{chat,ai,voice,lenders,criteria,webhooks/thinkr}/**`, `components/ChatWidget/**`, `ThinkrrVoiceWidget.tsx`, `lib/voice/**` |
| `backend` | other `app/api/**`, `middleware.ts`, `app/(auth)`, `(site)/{admin,settings}`, `app/dashboard`, `lib/{auth,db,firebase.client,firebaseAdmin,crm,email,pipeline,automations,compliance*,security,runlog,rates,api,forecast,businessHours,data,types}`, `PrefSync.tsx`, `store/`, `packages/prisma`, `firestore.rules`, `tests/backend/**` |
| `frontend-seo` | `app/layout.tsx`, `app/robots.ts`, `app/not-found.tsx`, `app/globals.css`, other `app/(site)/*` pages (home, about, contact, cities, legal, provinces, learn, rates, qualify, mli, business-funding, varun), `app/blog/**`, `content/**`, `public/**`, remaining `components/*`, `lib/{seo,utm,utils.ts,utils/blog-content.ts,useLiveRates.ts}` |
| `platform` | root configs (`package.json`, `pnpm-workspace.yaml`, `vercel.json`, `.gitignore`, `.env.example`, `README.md`, `CRUSH.md`), `apps/web` configs (`package.json`, `next.config.mjs`, `tsconfig.json`, `.eslintrc.json`, tailwind/postcss, `.env.example`, `scripts/`, `types/`), `.github/` |

## Conventions and gotchas (read before editing)

- **Calculator math.** Always use `lib/calc/*`. Rates are annual **percent** (5 = 5%). Fixed-rate = semi-annual compounding. Cost comparisons = interest + fees over the **same horizon and the same total debt**; interest over a term is simulated, never `payments − principal`.
  - Insurance: `minimumDownPayment` / `isInsurable` / `cmhcPremiumRate(downPct, amortYears)`. The premium is **financed**: never add it to cash-to-close; only ON/QC/SK PST on it is cash.
  - Ratios: GDS/TDS 39/44 at the **qualifying** rate (max(contract + 2, 5.25)), 50% of condo fees.
  - Live-rate defaults: refinances/rentals use **conventional** rates (`best5YrFixed` is insured).
  - Add a test in `tests/` for any math change.
- **Metadata.** Every indexable page sets its own `alternates.canonical` and `openGraph: { ...OG_DEFAULTS, … }`. The service-hub layouts (`residential`, `commercial`, `construction`, `equity-lending`, `private-lending`) carry the hub's metadata, so **every child page needs its own leaf `layout.tsx`** or it inherits the hub canonical. `calculators/layout.tsx` deliberately has no metadata.
- **Leads.** Every form spreads `consentFields()` from `lib/compliance/consent.ts`; bump `CONSENT_VERSION` when wording changes. Never auto-dial without `consentToCall === true` and `isRecipientCallable()`.
- **Data files** in `apps/web/data/` are regenerated by the owner's Hermes Agent scheduled sync — fix data problems upstream (or with a code-side correction), and run `tsc` after a refresh.
- **Firestore.** Never write `undefined` (`stripUndefined`), never nested arrays (`encodeEmbeddings`), never update array elements by dot-index. Public post reads exclude drafts.
- **Line endings.** Mixed CRLF/LF; `core.autocrlf=true`. Preserve each file's ending.
- **One syntax error makes `tsc` skip all semantic checks.** Suspiciously few errors → look for a TS1005.
- **Tests on Node:** use the quoted glob (`node --test "tests/**/*.test.mjs"`); a bare directory argument fails on Node 24. Type-only imports must use `import type` (Node strips types but can't elide value imports of types).
