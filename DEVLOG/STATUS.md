# Project Status

**Last updated:** 2026-10-12, end of the October 2026 full audit session (orchestrator + 7 area agents)
**Branch:** `main` · **Base commit:** `891d870` · **All audit work is UNCOMMITTED** (see "Right now")

## What this project is

Kraft Mortgages (kraftmortgages.ca) is the website of a licensed mortgage brokerage serving BC, Alberta and Ontario. It includes:
- ~50 Canadian mortgage calculators (residential, commercial, construction, equity, private, CMHC MLI Select)
- an AI chat assistant with lender intelligence over a 147-lender database
- voice AI (Thinkrr WebRTC widget; Vapi and Thinkrr outbound calls on new leads; Twilio voicemail)
- lead capture → Twenty CRM (via n8n), GoHighLevel and Discord
- a Firestore-backed blog with an AI content pipeline
- city landing pages and SEO infrastructure

Stack: Next.js 14.2 App Router, TypeScript strict, Tailwind, Firebase/Firestore, pnpm monorepo (`apps/web` is the site), deployed on Vercel.

## Health (2026-10-12, after the audit)

| Check | Result |
| --- | --- |
| Type check: `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` | ✅ 0 errors |
| Lint: `cd apps/web && ./node_modules/.bin/next lint` | ✅ 0 errors, 2 warnings (BUG-052). Was 172 errors. |
| Production build: `cd apps/web && ./node_modules/.bin/next build` | ✅ succeeds, 135 static pages (only known noise: `/api/criteria` DYNAMIC_SERVER_USAGE log) |
| Calculator math verification | ✅ all pass: group A 29 helper groups + page checks; group B 71/71; specialty suite all pass (re-run against the final combined code) |
| Automated tests in repo | ❌ none yet (FEAT-006) |
| CI (`.github/workflows/ci.yml`) | typecheck (blocking), lint (blocking), build |
| Visual / browser verification | ⚠️ **not done.** No agent ran the site in a browser. Do a visual pass before deploying (see "Next up" #2). |

## Right now

- ~280 files are changed in the working tree: 242 modified + ~40 new, about 6.6k lines added and 3.8k removed outside `apps/web/data/`. Nothing is committed or deployed.
- The owner also has **their own uncommitted data refresh** in `apps/web/data/` (`canadianLendersData.ts`, `current_rates.json`, `current_rates_summary.md`, `underwriting_criteria_matrix.json`). The only audit change to those files is one added line: `isDormant?: boolean;` in the `LenderDetail` interface, which fixed 65 type errors. Read BUG-028 before committing the data.
- Suggested commit plan (owner's call): put the audit work on a branch (e.g. `audit/2026-10-fixes`), separate from the data refresh, then preview-deploy it on Vercel.

## Owner action list (top of FINDINGS.md §1)

1. **Rotate leaked keys**: BUG-001 (Google Cloud, ElevenLabs, MiniMax, n8n, Postiz) and BUG-002 (Vapi).
2. **Set Vercel env vars**: BUG-006. Without `ADMIN_BASIC_AUTH_USER` / `ADMIN_BASIC_AUTH_PASSWORD`, `/admin` returns 503 once this is deployed.
3. **Firestore rules**: BUG-004.
4. **Approve consent wording**: BUG-005 → unblocks FEAT-001.
5. Approve the Next.js 14.2.35 patch: BUG-003.
6. Decisions: marketing claims (BUG-014), privacy policy (BUG-015), business facts (BUG-036), lender data generator (BUG-028), MLI microsite retirement (BUG-032), stress-test URL (BUG-020), AI auto-publishing (BUG-018), dead-code deletion (BUG-047).

## Next up for agents (in order)

1. **Commit hygiene.** If the owner asks to commit, use a branch and keep the data refresh as a separate commit. Never commit `/API`, `.mcp.json` or `postiz-config.md` changes that include secrets.
2. **Visual QA pass** in a browser (`pnpm dev` → http://localhost:3000). Check:
   - the homepage, one city page, `/rates`, a blog post, and the LeadModal
   - `/calculators` and 5 calculators: payment, affordability, land-transfer-tax, refinance-break-even, rent-vs-buy
   - an MLI calculator and the commercial refinance page
   - the chat widget on a 375 px viewport
   - keyboard navigation through the header dropdowns

   New footers were added to ~70 pages, so check spacing. Record findings as new BUGs.
3. **FEAT-006 (tests)**: port the audit's verification assertions into `node --test` / Vitest so the calculator fixes are locked in.
4. **FEAT-007 (live-rate defaults)**: closes BUG-019.
5. **FEAT-003 (durable rate limiting)**, then **FEAT-002 (unified lead ingestion)**, then **FEAT-001** once consent wording is approved.
6. **FEAT-005 (pnpm-only deploy)**, then the dependency upgrade plan (platform report §2.4), starting with BUG-003.

## Behaviour changes users and the owner will notice after deploy

- **Calculators give different (correct) numbers.** Payments use Canadian semi-annual compounding everywhere, and many headline verdicts changed: refinance break-even, refi-vs-HELOC, rent-vs-buy, A-vs-equity, port-vs-break, renewal, HELOC, debt consolidation, MLI premium. Before/after numbers are in the calculator reports.
- `/admin` requires HTTP Basic Auth (503 in prod until the env vars are set).
- Cron/pipeline routes require `CRON_SECRET` or `CREWAPI_SECRET`. The daily `/api/orchestrate` cron now actually creates a run (it crashed before), at most one per 20h, stage 1 only.
- `/api/contact`, `/api/lead` and `/api/business-funding` are rate-limited and validated, and can return 429/500/502 instead of a fake success.
- AI outbound dialing is gated by server-side calling hours, at most 1 auto-dial per phone per 24h, and honours `consentToCall:false`. Facebook leads place no AI call unless the webhook signature is verified.
- The chat assistant introduces itself as an **AI Mortgage Assistant** with a disclosure line. Thinkrr voice shows an AI/recording notice. Twilio voicemail announces recording.
- Public chat/TTS endpoints are rate-limited. The Twilio outbound endpoint is admin-only. Twilio callbacks require a valid signature (`TWILIO_AUTH_TOKEN`).
- Draft blog posts are no longer public. Blog dates are correct.
- SEO: pages without their own canonical no longer claim the homepage as canonical; robots/sitemap/JSON-LD cleaned up; `/compliance` redirects to `/compliance-security`.
- Security headers on every response (nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy; microphone left allowed for voice).

## Where things live (quick map)

| Thing | Location |
| --- | --- |
| Live chat | `components/ChatWidget/ChatWidget.tsx` → `app/api/chat/route.ts` (OpenRouter deepseek → Gemini 2.5 Flash → NVIDIA → deterministic lender dossier) |
| Lender intelligence | `lib/ai/lenderIntelligence.ts` over `data/canadianLendersData.ts` |
| Calculator math (single source of truth) | `lib/calc/payment.ts` (`payment`, `periodicRate`, `principalFromPayment`, `balanceAfter`, `biweeklySavings`), `lib/calc/cmhc.ts`, `lib/calc/affordability.ts`, `lib/calc/landTransferTax.ts`, `lib/mli/calcs.ts` |
| Live rates | `app/api/rates` (remote feed → local file → snapshot) consumed via `lib/useLiveRates.ts` |
| Auth helpers | `lib/auth.ts` (`requireAdmin`, `verifyCronRequest`, `hasServiceSecret`, `safeEqual`, `getTrustedOrigin`) |
| Request guards | `lib/compliance/requestGuards.ts` (forms) and `lib/ai/request-guards.ts` (AI/voice). Duplicates; merge per FEAT-003 |
| Twilio signature check | `lib/voice/twilio-signature.ts` |
| SEO | `lib/seo/` (`business-config.ts` = NAP/licences source of truth, `og.ts` OG_DEFAULTS, `jsonld.ts`, `schema.ts`, `sitemap.ts`), `app/robots.ts` |
| Env var inventory | `apps/web/.env.example` (canonical, 72 vars), root `.env.example` (mirror) |
| Deploy reality | Vercel Root Directory = repo root, **root `vercel.json` is effective**, prod installs with npm (BUG-010) |

## Area ownership map (for parallel agents)

| Area | Owns |
| --- | --- |
| `calc-res-a` | `app/(site)/calculators/{affordability,payment,amortization,extra-payments,stress-test,mortgage-qualifier,debt-service-ratio,required-income,pre-approval,down-payment,cmhc-insurance,first-time-home-buyer,closing-costs,land-transfer-tax,bc-speculation-tax}`, `calculators/page.tsx` + `CalculatorsHub.tsx` + `layout.tsx`, `qualify/`, `lib/calc/{payment,affordability,cmhc,landTransferTax}.ts`, `components/ui/ValidatedInput.tsx`, `lib/validators.ts`, `lib/utils/validation.ts` |
| `calc-res-b` | `app/(site)/calculators/{rate-comparison,refinance-*,renewal,port-vs-break,mortgage-penalty,rent-vs-buy,investment,reverse-mortgage,self-employed*,a-vs-equity,b-vs-equity,construction-pro}`, `lib/calc/{investment,selfEmployed,construction}.ts` |
| `calc-specialty` | `app/(site)/{commercial,construction,equity-lending,private-lending,residential,mli-select,mli}/**`, `components/{mli,calculators,calculator-report,charts}/**`, `components/PdfLeadModal.tsx`, `lib/{mli,reports}/**`, `lib/calc/mli.ts`, math inside `lib/ai/tools/{calculator,mortgage}-tools.ts` |
| `ai-voice` | `lib/ai/**` (except that math), `app/api/{chat,ai,voice,lenders,criteria,webhooks/thinkr}/**`, `components/{ChatWidget,VoiceAgentWidget}/**`, `ChatAlex.tsx`, `ThinkrrVoiceWidget.tsx`, `VoiceButton.tsx`, `lib/voice/**` |
| `backend` | other `app/api/**`, `middleware.ts`, `app/(auth)`, `(site)/{admin,settings}`, `app/dashboard`, `app/mli-proxy`, `lib/{auth,rbac,db,firebase*,crm,email,pipeline,automations,compliance*,runlog,googleSheets,rates,useLiveRates,api,forecast,businessHours,data,types}`, `components/LeadCapture`, `PrefSync.tsx`, `store/`, `packages/prisma` |
| `frontend-seo` | `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/not-found.tsx`, `app/globals.css`, other `app/(site)/*` pages (about, contact, cities, legal, provinces, learn, rates, blog…), `app/blog/**`, `content/**`, `public/**`, the remaining `components/*`, `lib/{seo,meta,utm,analytics,utils.ts,utils/blog-content.ts}` |
| `platform` | root configs (`package.json`, `vercel.json`, `.gitignore`, `.env.example`, `README.md`, `CRUSH.md`), `apps/web` configs (`package.json`, `next.config.mjs`, `vercel.json`, `tsconfig.json`, `.eslintrc.json`, tailwind/postcss, `.env.example`, `scripts/`, `types/`), `.github/`, `packages/ui`, `infra/`, `mli-select-complete` build config |

## Conventions and gotchas (read before editing)

- **Calculator math.** Always use `lib/calc/payment.ts`. Rates are annual **percent** (5 = 5%). Fixed-rate = semi-annual compounding. Cost comparisons = interest + fees over the **same horizon and the same total debt**; interest over a term is simulated, never `payments − principal`.
  - Insurance: use `minimumDownPayment` / `isInsurable` / `cmhcPremiumRate(downPct, amortYears)`. The premium is **financed**: never add it to cash-to-close; only ON/QC/SK PST on it is cash.
  - Ratios: GDS/TDS 39/44 at the **qualifying** rate (max(contract + 2, 5.25)), with 50% of condo fees.
  - LTT: only `lib/calc/landTransferTax.ts`.
- **Every indexable page must set its own `alternates.canonical`** and `openGraph: { ...OG_DEFAULTS, … }`. The root layout no longer provides a canonical, and Next replaces (doesn't merge) `openGraph`. Don't add `metadata` to a section `layout.tsx` that has child routes (it cascades). Put it on the page or a leaf layout.
- `mortgage-broker-[city]` is **not** a dynamic route in Next 14. Add new cities as static folders and list them in `lib/seo/sitemap.ts`.
- **Firestore.** Never write `undefined` (`stripUndefined`), never write nested arrays (`encodeEmbeddings`), never update array elements by dot-index. Public post reads exclude drafts by default.
- **Line endings.** Many files are CRLF and some LF; `core.autocrlf=true`. Edit with tools that preserve the existing ending.
- **One syntax error makes `tsc` skip all semantic checks.** If you see suspiciously few errors, look for a TS1005.
- Don't "fix" retired AI model IDs in isolation (BUG-013).
