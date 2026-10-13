# Backend / API / Auth / Data / Integrations / Security audit — 2026-10-12

Scope: `apps/web/app/api/**` (except chat/ai/voice/lenders/criteria/webhooks/thinkr), `middleware.ts`, `(auth)`, `(site)/admin`, `dashboard`, `(site)/settings`, `mli-proxy`, the owned `lib/**` modules, `components/LeadCapture`, `PrefSync`, `store`, `packages/prisma` (read-only).

Verification: a scoped `tsc` over every file I changed plus their importers (61 project files, strict mode) passes with **0 errors**. The full-project `tsc` run is currently blocked by a **syntax error in another agent's file**: `app/(site)/calculators/amortization/page.tsx:56` (TS1005). Because tsc stops at syntax errors, it reports no semantic diagnostics until that is fixed. I also ran node logic tests on the transpiled modules (rate limiter, PII masking, calling-hours gate, rates honesty, Firestore helpers, mli-proxy traversal guard): all pass.

---

## 1. API route inventory

Legend for auth: **B** = before this audit, **A** = after. "FB-user" = any valid Firebase ID token. "Admin" = FB-user + doc in the `admins` collection (`isAdmin`). "Cron" = `verifyCronRequest` (see §2 Fix 1).

| Route | Methods | Purpose | Auth (B → A) | Validation (A) | Side effects | Used by |
|---|---|---|---|---|---|---|
| `/api/contact` | POST | Main lead form. Sends to Twenty CRM (n8n webhook), Discord, and a **Vapi outbound AI call** | public → public + IP rate limit (8/10 min) + 1 auto-dial per phone per 24h | zod (email, length caps), honeypot | Twenty webhook, Discord, paid Vapi call, Firestore backup if the CRM is down | `/contact`, `/qualify`, `PdfLeadModal` |
| `/api/lead` | POST | Homepage `LeadModal` lead. Saved to Prisma or Firestore `leads`, plus a Discord alert (new) | public → public + RL 5/10 min | zod `.strip()`, province enum | DB write, Discord | `components/home/LeadModal.tsx` |
| `/api/calculator-report` | POST | "Personalised report" request. Was a stub that claimed the email was sent | public → public + RL | zod, HTML-escaped | none (no email provider) | `LeadModal` |
| `/api/business-funding` | POST | Business-funding application. Writes to DB/Firestore, the GoHighLevel webhook and Discord | public → public + RL 3/10 min | zod `.strip()` | DB, GHL webhook, Discord | `/business-funding` |
| `/api/webhooks/facebook` | GET, POST | FB Lead Ads: verify handshake, then lead → Graph API → Twenty, Discord and a Thinkrr AI call | FB HMAC **fail-open** → HMAC enforced when the secret is set; unverified ⇒ no outbound call | numeric `leadgen_id` | Graph API, Twenty, Discord, Thinkrr call | Facebook |
| `/api/blog/ingest` | POST | External blog ingestion (CrewAPI/Marblism) into Firestore `posts` | Bearer `CREWAPI_SECRET`/`BLOG_INGEST_TOKEN` (now timing-safe) | slug/tags/date sanitised | Firestore write (live blog) | external crew service |
| `/api/orchestrate` | GET, POST | Cron/crew: create an auto content run and execute one stage | POST x-api-key ✓; **GET wide open** (bypass) → Cron + 20h dedupe | zod | Paid LLM/Tavily calls, Firestore | root `vercel.json` cron |
| `/api/orchestrate-all` | POST | Admin: run all stages of a run | Admin (unchanged) | runId sanitised | LLM, publish to blog | dashboard "Manual Orchestrate" |
| `/api/run` | POST | Admin: create a run, then trigger `/api/run/orchestrate` | Admin (unchanged; now forwards token) | zod | Firestore, LLM | dashboard |
| `/api/run/orchestrate` | POST | Loops all stages: LLM calls, then **publishes** | **none** → Admin or `CREWAPI_SECRET` | runId sanitised | LLM, blog publish | `/api/run` |
| `/api/runs/[runId]` | GET | Run JSON | FB-user → Admin | — | read | (unused) |
| `/api/runs/[runId]/stream` | GET | SSE run progress (`?token=`) | FB-user + `CORS *` → Admin, CORS removed | — | read/poll | dashboard |
| `/api/publish/republish` | POST | Admin: republish post to WordPress | Admin but **broken** (`admin.auth()` before init) → Admin via `requireAdmin` | zod | WordPress POST | dashboard (posts list is a placeholder, so unreachable) |
| `/api/strategy/weekly` | GET, POST | Admin: LLM SEO strategy saved to `strategy` | Admin but **broken** (same) → Admin | — | LLM, Firestore | dashboard |
| `/api/strategy/latest` | GET | Static sample strategy (now `sample:true`, dynamic) | public | — | none | dashboard |
| `/api/check-admin` | GET | Is the caller an admin? | FB-user, **returned all admin docs** → FB-user, caller-only | — | read | dashboard "Check Admin" |
| `/api/user/prefs` | GET, POST | Per-user preferences | GET optional, POST FB-user | bounded primitive map (new) | Firestore `users` | none (PrefSync no longer calls it) |
| `/api/documents` | POST | Multipart relay to FastAPI `/documents/upload` | **none** → FB-user; 503 if `FASTAPI_BASE_URL` unset; 15 MB cap | — | external upload | unused |
| `/api/compliance/log` | POST | Compliance event log (console only) | public → public + RL 30/min | zod event schema | console | unused |
| `/api/cron/daily` | GET | Start an external crew run via the `/crewapi/*` rewrite | **none** → Cron | — | external crew run | `apps/web/vercel.json` cron |
| `/api/cron/pull-rates` | POST (+GET new) | FastAPI lender aggregate → `rateSnapshots` | **none** → Cron or Admin | row sanity filter | DB writes | unscheduled |
| `/api/cron/reports/daily` | POST (+GET new) | Yesterday's lead KPIs → `kpiDaily` | **none** → Cron or Admin | — | DB write | unscheduled |
| `/api/automations/nurture` | POST | "Nurture" last 10 leads (console transport) | **none** → Cron or Admin | — | logs (now masked) | unused |
| `/api/rates` | GET, POST | Public rate benchmarks (remote feed → local file → embedded snapshot), ISR 300s | public | province enum | none | `useLiveRates` (calculators, ticker, qualify) |
| `/api/healthz` | GET | Liveness | public | — | none | monitoring |
| `/mli-proxy/[...path]` | GET | Static file server for `public/mli-select` | public, **path traversal** → traversal-safe | segment guard | fs read | not referenced by any rewrite (dead but reachable) |
| Pages `/admin`, `/admin/analytics`, `/admin/rates`, `/admin/blog/*` | — | Server-rendered leads, KPIs and rate snapshots; mock blog CMS | **none** → HTTP Basic Auth (middleware) | — | DB reads | not linked publicly (`components/Nav.tsx` links `/admin/analytics` but Nav is unused) |
| `/dashboard`, `/login`, `/settings` | — | Content-AI dashboard (client-side Firebase gate; APIs enforce admin), login, local preferences | client-gated | — | — | — |

Routes owned by the AI agent were not audited in depth: `/api/chat`, `/api/chat/v2`, `/api/ai/*`, `/api/voice/*`, `/api/lenders`, `/api/criteria`, `/api/webhooks/thinkr`. Two critical items I saw in passing are listed in §3.

### Which cron is effective?
- Root `vercel.json` schedules `GET /api/orchestrate` at `5 9 * * *`. It uses `npm` commands, while the repo uses pnpm (`packageManager: pnpm@9.1.0`).
- `apps/web/vercel.json` schedules `GET /api/cron/daily` at the same time. It also holds the live `kraftmortgages.ca → www` redirect and the `/crewapi/*` rewrite.
- Vercel only reads the `vercel.json` in the project's **Root Directory**. `.vercel/project.json` sits at the repo root, but the Root Directory setting isn't stored in the repo. The domain redirect and pnpm usage suggest **`apps/web/vercel.json` is the effective one, so `/api/cron/daily` runs**. To confirm, check Vercel → Project → Settings → General → Root Directory. (`needs-owner: platform`: delete the stale file.)
- Before this audit neither cron could work. `/api/cron/daily` crashed on a relative fetch URL whenever `NEXT_PUBLIC_CREWAPI_BASE_URL` was unset. `/api/orchestrate` GET threw in `createRun` because Firestore rejects `undefined` (`manualQuery`). Both are fixed and both now require cron auth.

### Env vars (names only)

**Required for core functionality**
- Firebase Admin. Any one of: `FIREBASE_SERVICE_ACCOUNT_JSON` · `FIREBASE_SERVICE_ACCOUNT` · (`FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`). Needed for lead storage, the blog store, runs and admin checks. All initialisers now accept all three forms.
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`: dashboard login.
- **NEW** `ADMIN_BASIC_AUTH_USER`, `ADMIN_BASIC_AUTH_PASSWORD`: without them `/admin/*` returns 503 in production.
- `CREWAPI_SECRET`: `/api/orchestrate` POST, `/api/cron/daily`, `/api/blog/ingest` (or `BLOG_INGEST_TOKEN`), service auth for `/api/run/orchestrate`. Note that the root `.env.example` misspells it as `CREWAI_SECRET`.
- `DISCORD_LEAD_WEBHOOK_URL`: strongly recommended. It is now the safety net that keeps leads from being lost.

**Strongly recommended**
- **NEW** `CRON_SECRET`: Vercel sends it automatically as `Authorization: Bearer …`. Until it is set, cron routes accept a spoofable `vercel-cron/*` user-agent.
- `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_WEBHOOK_VERIFY_TOKEN`: without `FACEBOOK_APP_SECRET`, Facebook leads are still forwarded but **no AI call is placed**.
- `NEXT_PUBLIC_SITE_URL`: trusted origin for server-to-self fetches.

**Optional / feature-specific**
- `DATABASE_URL` (switches lead/KPI storage to Prisma)
- `FASTAPI_BASE_URL` (pull-rates, documents)
- `RATES_FEED_URL`, `RATES_DATA_PATH`
- `NEXT_PUBLIC_CREWAPI_BASE_URL`
- `WORDPRESS_BASE_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APP_PASSWORD`, `AI_MODE`
- `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`, `GSC_SITE_URL`
- `TWENTY_WEBHOOK_URL` (Facebook route only)
- `VAPI_*`, `THINKR_*` (AI-owned)

**Dead code paths:** `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_API_KEY`, `BREVO_API_KEY`, `GOOGLE_SHEET_ID`, `GOOGLE_API_KEY` (googleSheets).

**`NEXT_PUBLIC_*` review:** all are public by design (Firebase web config, GA, Segment write key, Thinkrr/SalesCloser widget IDs, site URL). No secrets are exposed through `NEXT_PUBLIC_`.

---

## 2. Fixed

Each entry gives location, what was wrong, the change, how it was verified, and any config needed. All entries passed the scoped tsc run.

1. **CRITICAL: unauthenticated content pipeline trigger.** `app/api/orchestrate/route.ts:76`
   - **Wrong:** the GET "cron" check accepted any request whose pathname was `/api/orchestrate`, which is always true. Anyone could start paid LLM/Tavily runs that publish to the live blog.
   - **Changed:** new `verifyCronRequest()` in `lib/auth.ts`. It accepts `Bearer CRON_SECRET`, or `x-api-key`/Bearer `CREWAPI_SECRET`. Only when `CRON_SECRET` is unset does it also accept a `vercel-cron/*` user-agent, as a transitional measure. Added a 20h dedupe (at most one cron-created run per day unless `?force=1` with a secret). Error messages no longer leak. POST uses a timing-safe compare.
   - **Config:** set `CRON_SECRET` in Vercel to close the user-agent fallback.

2. **CRITICAL: `/api/run/orchestrate` had no auth** and runs every stage, including publishing. `app/api/run/orchestrate/route.ts:13`
   - **Changed:** requires an admin Firebase token or `CREWAPI_SECRET`. `/api/run` now forwards the admin's Bearer token (`app/api/run/route.ts:137-150`) to a trusted origin (`getTrustedOrigin`: `NEXT_PUBLIC_SITE_URL`, else request origin). Also fixed the catch block, which re-read an already-consumed body and threw again. `details` no longer leak.

3. **CRITICAL: path traversal / arbitrary file read.** `app/mli-proxy/[...path]/route.ts:14`
   - **Wrong:** catch-all params are URL-decoded, so `..%2F..%2Fpackage.json` reached `join(cwd,'public','mli-select',…)` and escaped the folder.
   - **Changed:** `resolveSafe()` rejects `..`, NUL and backslash segments and enforces that the resolved path stays under the root. Removed verbose path logging. Guarded the index.html fallback recursion.
   - **Verified:** node test of `../..`, `%2F`-decoded, absolute and drive segments.

4. **HIGH: `/admin`, `/admin/analytics` and `/admin/rates` exposed lead and KPI data with no auth.** These are Server Components; Firebase client auth is invisible to the server. `middleware.ts:23`
   - **Changed:** HTTP Basic Auth (constant-time compare) for `/admin` and `/admin/*`. If the credentials are unset, the area **fails closed (503) in production** and stays open in dev.
   - **Config:** set `ADMIN_BASIC_AUTH_USER` and `ADMIN_BASIC_AUTH_PASSWORD`.

5. **HIGH: `/api/check-admin` leaked every `admins` document** (other admins' UIDs and emails) plus token internals and error details to any signed-in Firebase user. `app/api/check-admin/route.ts:36`
   - **Changed:** returns only `{isAdmin, uid, email}` for the caller. The dashboard still works because it only reads those fields.

6. **HIGH: other cron and automation routes were unauthenticated.** `app/api/cron/daily/route.ts:8`, `cron/pull-rates/route.ts:16`, `cron/reports/daily/route.ts:16`, `automations/nurture/route.ts:12`
   - **Changed:** `cron/daily` now requires cron auth. The other three require cron auth or an admin token. Added try/catch with generic errors. `pull-rates` returns 503 instead of calling `http://localhost:8000` when `FASTAPI_BASE_URL` is unset, validates rows and respects the Firestore batch cap. GET aliases were added so these can be scheduled.
   - `cron/daily`: the relative `"/crewapi"` base made server-side `fetch` throw, so the cron always failed. It now resolves against the trusted origin, which makes the `/crewapi/*` rewrite apply.

7. **HIGH: `/api/contact` abuse and CRTC risk.** `app/api/contact/route.ts:146,181,241`
   - **Wrong:**
     - no validation or rate limit;
     - the client-supplied `afterHours:false` could **force a live AI dial outside permitted calling hours**;
     - unlimited auto-dials to arbitrary numbers (harassment and cost);
     - full name and email went to logs;
     - when Twenty failed, the lead existed nowhere but the console.
   - **Changed:**
     - zod schema;
     - IP rate limit;
     - server-authoritative calling-hours gate (the client can only make it more conservative);
     - 1 auto-dial per phone per 24h;
     - honours `consentToCall:false`;
     - records `consentToContact`/`consentToCall`/`consentToMarketing` with `consentCapturedAt` in the CRM payload when the form sends them;
     - Firestore backup when the CRM fails;
     - 502 if the lead could not be recorded anywhere;
     - masked logs;
     - the response message no longer claims "Julia is dialing" when no call was placed.

8. **HIGH: Facebook webhook.** `app/api/webhooks/facebook/route.ts:128`
   - **Wrong:**
     - signature check was skipped entirely when `FACEBOOK_APP_SECRET` was unset, yet unverified payloads still triggered AI calls;
     - non-constant-time compare;
     - an unset verify token matched an empty `hub.verify_token`;
     - `leadgen_id` was interpolated into the Graph URL;
     - PII in logs.
   - **Changed:** timing-safe HMAC; signature enforced when the secret is configured; unverified payloads are forwarded but **no outbound call**; verify token must be non-empty; numeric `leadgen_id` only; masked logs.
   - **Config:** `FACEBOOK_APP_SECRET`.

9. **HIGH: leads silently lost.**
   - **(a)** `app/api/lead/route.ts:124,165`: on a DB failure it returned a fake `temp_<ts>` success, and nobody was ever notified of these leads. Now it sends a Discord alert, validates with zod, rate-limits, returns 500 only if the lead was neither saved nor notified, and masks logs.
   - **(b)** `lib/firebaseAdmin.ts:58`: Firebase Admin was initialised in three places with **different env var names** (`FIREBASE_SERVICE_ACCOUNT` vs `FIREBASE_SERVICE_ACCOUNT_JSON` vs split vars), and whichever ran first won. `lib/firebaseAdmin.ts` could initialise the default app without credentials. That broke lead writes and token verification, and made `lib/db/firestore.ts` fall back to its **mock store** (blog, runs and admins silently empty).
     - **Changed:** `getServiceAccountFromEnv()` is the single parser, used by `firebaseAdmin.ts`, `auth.ts` and `db/firestore.ts`. `firestore.ts` now reuses an already-initialised app instead of falling back to the mock.

10. **HIGH: AI content pipeline could never complete.** `lib/db/firestore.ts:192-262`, `lib/pipeline/orchestrator.ts:116`
    - **Wrong:**
      - `updateRunStep` wrote `steps.N`, which turns the Firestore array into a map and drops `agent`, so `getRun()` threw (`steps.map is not a function`) on the next step;
      - stage output was saved as `topicscout`/`writer`/`editor`/`publish`, but stages read `scout`/`draft`/`final`, so the brief stage always failed;
      - `createRun` sent `undefined` (Firestore rejects it), which broke the cron path;
      - gate `embeddings: number[][]` cannot be stored because Firestore has no nested arrays.
    - **Changed:**
      - transactional read-modify-write of the `steps` array;
      - `normalizeSteps` also repairs map-shaped legacy runs;
      - `STAGE_OUTPUT_FIELD` mapping;
      - `stripUndefined` in create/update;
      - embeddings encoded as `[{v:[…]}]` and decoded on read (`encodeEmbeddings`/`decodeEmbeddings`, also in `savePost`, `getPost` and `getRecentPosts`);
      - `getRecentRuns()` helper.
    - **Verified:** node test of `stripUndefined` and encode/decode.

11. **HIGH: `/api/documents`** was an unauthenticated upload relay for sensitive documents. `app/api/documents/route.ts:11`
    - **Changed:** requires a Firebase user, 15 MB cap, 503 if `FASTAPI_BASE_URL` is unset (no localhost default), errors handled.

12. **HIGH: run data readable by any Firebase user, with wildcard CORS on the SSE stream.** `app/api/runs/[runId]/route.ts:15`, `stream/route.ts:16`
    - **Changed:** both are admin-only; `Access-Control-Allow-Origin: *` removed.

13. **MEDIUM: republish and weekly strategy always failed auth.** They called `admin.auth()` before any Firebase app existed, which caught into a 500. `app/api/publish/republish/route.ts:54`, `app/api/strategy/weekly/route.ts:12`
    - **Changed:** both use `requireAdmin()`; zod-validated slug; the WP error body is truncated.
    - Strategy: the "GSC data" was **hard-coded fabricated numbers flagged `available:true`** that fed the LLM. It now honestly returns `available:false` (`:31`).

14. **MEDIUM: draft posts were public.** `/blog` and `/blog/[slug]` showed Firestore posts with `status:'draft'`. `lib/db/firestore.ts:302`, plus `getRecentPosts`
    - **Changed:** both exclude drafts unless `{includeDrafts:true}` (republish passes it). A Firestore draft still suppresses a hard-coded post with the same slug. The sitemap already filtered drafts.

15. **MEDIUM: `/api/calculator-report` was misleading.** `app/api/calculator-report/route.ts:155`
    - **Wrong:** it returned "Report generated and sent successfully" but no email exists. It logged the recipient email and full report, and interpolated the raw name into HTML.
    - **Changed:** returns `{success:true, emailed:false}` with an honest message; zod; rate limit; HTML escaping; masked log. The UI copy still promises an email (§3 M9).

16. **MEDIUM: `/api/business-funding`.** `:173`
    - **Changed:** zod `.strip()` schema and rate limit.
    - Previously, when GHL was down the route returned `success:false` even though the DB and Discord had the lead, so the page told the user to resubmit (creating duplicates). Now `success` = any sink recorded it.

17. **MEDIUM: PII in logs.** The contact, Facebook, calculator-report, lead and business-funding error paths, and the nurture console transport (`lib/automations.ts:11`), now log masked email and phone (`lib/compliance/requestGuards.ts`).

18. **MEDIUM: calling-hours gate failed open.** `lib/businessHours.ts:87`: on a time-zone error it returned `isOpen:true`. It now fails closed and queues the callback.

19. **MEDIUM: error responses leaked internals.** `err.message`/`details` were removed from `/api/orchestrate`, `/api/run`, `/api/orchestrate-all`, `/api/check-admin`, `/api/blog/ingest`, `/api/rates` and `/api/cron/daily`.

20. **LOW: `/api/compliance/log`** was an unvalidated public log sink. It now has a zod event schema, meta caps and a rate limit (`:19`).

21. **LOW: `/api/user/prefs`** stored arbitrary, unbounded objects. It now accepts a bounded primitive map and returns 401 (not 500) on a bad token (`:75`).

22. **LOW: `/api/blog/ingest`** (`:166`):
    - token compare is now timing-safe;
    - unsafe slugs (`/`, `..`) are normalised, so they can no longer address Firestore sub-paths;
    - malformed `tags` JSON no longer 500s (comma-split fallback), with caps;
    - an invalid `publishedAt` falls back to now (`savePost` guards this too).

23. **LOW: rates honesty.**
    - `lib/rates.ts:241,431`: the public `source` exposed the server filesystem path and is now `local_rates_file`. `last_updated_human` was always "Updated Today" and is now the actual date when stale. A feed with no timestamp is no longer treated as today.
    - `lib/useLiveRates.ts:88`: `isToday` defaulted to `true` when the fetch failed and now defaults to `false`.
    - `/api/rates` POST validates `province`.
    - **Verified:** node test.

24. **LOW: admin pages.** `app/(site)/admin/page.tsx:6`, `rates/page.tsx`, `analytics/page.tsx`
    - Firestore Timestamps rendered as "Invalid Date"; `rateAPR.toFixed` crashed on a missing value; any DB error 500'd the page. Fixed with `toDate` helpers and try/catch.

25. **LOW: missing route config.** `/api/orchestrate-all` had no `maxDuration` (`:4`, now 300) and crashed on a bad token or body. `/api/strategy/latest` was statically rendered at build time (frozen `weekId`) and is now `force-dynamic` with `sample:true`. `force-dynamic` was also added to the form and cron routes.

**New shared helpers:**
- `lib/auth.ts`: `requireAdmin`, `verifyCronRequest`, `hasServiceSecret`, `safeEqual`, `getBearerToken`, `getTrustedOrigin`
- `lib/compliance/requestGuards.ts` (new file): in-memory `rateLimit`/`limitByIp`, `getClientIp`, `maskEmail`/`maskPhone`/`phoneKey`

---

## 3. Open issues (not fixed)

| Sev | Location | Issue | Suggested fix | Owner / why not fixed |
|---|---|---|---|---|
| **Critical** | `lib/voice/vapi.ts:15-17` | A **Vapi private API key**, plus assistant and phone-number IDs, is hard-coded as a fallback and committed. It is used by `/api/contact` to place calls. | **Rotate the key in Vapi now**, move it to `VAPI_API_KEY`, delete the fallbacks, and purge it from git history if the repo has ever been public. | needs-owner: AI/voice (not my file) |
| **Critical** | `app/api/chat/route.ts:288-309` | `GET /api/chat?admin=true`: the "admin auth" is just a query param. It returns the chat training-log buffer (user conversations, possibly contact info) to anyone. | Gate it with `requireAdmin()` from `lib/auth.ts`, or remove it. | needs-owner: AI |
| High | live forms (`(site)/contact`, `(site)/qualify`, `components/PdfLeadModal.tsx`, `components/home/LeadModal.tsx`, `(site)/business-funding`) | **No CASL/CRTC consent capture**, yet `/api/contact` immediately places an automated AI call. Automated-call (ADAD) solicitation needs express consent; CASL needs consent evidence. | Add consent checkboxes ("contact me", "automated call", "marketing") and send `consentToContact`/`consentToCall`/`consentToMarketing`; the backend already records them and honours `consentToCall:false`. After a frontend rollout, consider requiring `consentToCall===true` before auto-dialling. Get legal sign-off. | needs-owner: frontend (+ legal). Not forcing it server-side because that would silently disable speed-to-lead today. |
| High | `lib/compliance/requestGuards.ts` | The rate limiter is **per serverless instance** and in-memory, so it is not a global limit. | Vercel WAF rate-limit rules on `/api/contact`, `/api/lead`, `/api/business-funding` (or Upstash/KV), plus Cloudflare Turnstile on the forms. | needs-owner: platform; no new deps allowed |
| High | config | `CRON_SECRET` is probably unset, so cron routes accept a spoofable `vercel-cron/` user-agent (capped at 1 run/20h for `/api/orchestrate`). | Set `CRON_SECRET` in Vercel. | user config; the fallback is deliberate to avoid locking out the live cron |
| High | `vercel.json` (root) vs `apps/web/vercel.json` | Two conflicting cron definitions; only the Root-Directory one applies. | Confirm the Root Directory and delete the stale file. | needs-owner: platform |
| High | Firestore security rules | No `firestore.rules` in the repo. The browser initialises the Firebase client SDK with the public config, so if rules are open, anyone can read `leads`/`admins`/`runs` directly and bypass every API check. | Deploy rules that deny all client reads and writes (all data access is server-side via the Admin SDK). Disable public email/password sign-up in Firebase Auth if only admins log in, since "FB-user" checks on `/api/documents` and `/api/user/prefs` assume it is restricted. | user/Firebase console |
| Medium | `lib/db/firestore.ts:265-269` | `isAdmin()` grants admin to a **hard-coded UID** ("temporary bypass"). | Add that UID to the `admins` collection, then delete the bypass. | Not removed, to avoid locking the owner out |
| Medium | `app/api/contact/route.ts:58`, `app/api/webhooks/facebook/route.ts:14`, `app/api/business-funding/route.ts:50` | Twenty/n8n and GoHighLevel webhook URLs are hard-coded and unauthenticated. Anyone with the URL can inject CRM leads or trigger n8n flows (possibly calls). | Move them to env vars and add a shared-secret header checked in n8n/GHL. | Rule: don't change integration URLs |
| Medium | `app/api/run/route.ts:142` | Fire-and-forget `fetch` to `/api/run/orchestrate` after responding. On Vercel the function may be frozen first, so manual runs may never start. | `waitUntil` (`@vercel/functions`, a new dep), or have the dashboard call `/api/orchestrate-all` itself after `/api/run` returns. | New dep / behaviour change |
| Medium | `app/api/orchestrate/route.ts` (GET) | The cron only executes **stage 1** (scout) and nothing advances the run, so daily runs stall. | Decide the product behaviour: loop all stages, or stop at a draft for review (recommended, see next row). | Product decision |
| Medium | `lib/pipeline/stages/publish.ts` | AI-written posts are **published live with no human review**. Mortgage advertising is regulated (BCFSA/FSRA/RECA). | Publish as `status:'draft'` (drafts are now hidden publicly), and approve in the dashboard. | Behaviour change; needs owner decision |
| Medium | `app/api/runs/[runId]/stream/route.ts` | SSE polls for up to 10 minutes inside a serverless function (exceeds default timeouts). The ID token travels in the query string. | Poll `/api/runs/[runId]` from the client every 2–3s instead. | Dashboard redesign |
| Medium | `app/dashboard/page.tsx:98,313` | The dashboard calls the non-existent `/api/make-admin` and `/api/test-run-creation`. `loadRuns`/`loadPosts` are placeholders. The strategy tab reads the static `/strategy/latest` instead of `GET /strategy/weekly`. | Remove the debug buttons, add `/api/runs` and `/api/posts` list endpoints, and point the strategy tab at `/strategy/weekly`. | UI feature work |
| Medium | `app/api/publish/republish/route.ts` | Always POSTs a **new** WordPress post (duplicates) and never persists `republishedAt`. | Look up the WP post by slug, then PUT; save the metadata on the Firestore post. | Feature work |
| Medium | `app/api/webhooks/facebook/route.ts` | Leads are processed sequentially (including the outbound call) before the 200, so Facebook retries can cause duplicate CRM entries and calls. | ACK immediately and dedupe on `leadgen_id` (Firestore doc id). | Needs a durable queue |
| Medium | `components/home/LeadModal.tsx:37`, `(site)/qualify/page.tsx:186` | Copy promises "Check your email for your personalized report" (no email exists). Qualify shows a "calling" state from client time, not the server's `callDispatched`. | Update the copy; use `isAfterHours`/`callDispatched` from the response. | needs-owner: frontend |
| Medium | `lib/api.ts:4`, `app/dashboard/page.tsx:150`, `app/api/cron/daily` | `NEXT_PUBLIC_CREWAPI_BASE_URL` serves two purposes: the dashboard API base (should be `/api`) and the external crew base. Pointing it at the crew host sends admin Firebase tokens there; leaving it at `/api` makes `cron/daily` hit `/api/run` (401). | Split into `NEXT_PUBLIC_API_BASE` and a server-only `CREWAPI_BASE_URL`. | Env/config contract change |
| Low | root `.env.example` | Names `CREWAI_SECRET`; the code uses `CREWAPI_SECRET`. | Fix the name. | needs-owner: platform |
| Low | `lib/firebase.ts`, `lib/firebase.client.ts` | Dummy fallback Firebase config (`dummy-project`) hides misconfiguration. `lib/firebase.ts` (with Analytics) is unused. | Fail loudly when env is missing; delete the unused file. | Cosmetic; deleting files not allowed |
| Low | `lib/rates.ts:142-151` | Rate-file candidates include a developer Windows path and `/root/kraft-ops/...`. | Keep only `RATES_DATA_PATH` and repo paths. | Harmless |
| Low | Vapi vs Thinkrr | The context log says Thinkrr replaced Vapi, but `/api/contact` still dials via Vapi while Facebook uses Thinkrr. | Confirm the paid provider and unify. | needs-owner: AI/voice |
| Low | `/api/healthz` | Doesn't check Firestore or CRM reachability. | Add a deep-health variant behind cron auth. | Nice-to-have |

**CSRF:** not applicable. Authenticated APIs use Bearer tokens, not cookies. Public form endpoints are unauthenticated by nature, so the rate limit and validation are the mitigations. `/admin` Basic-Auth pages are read-only.

**Open redirects:** none found in owned code. The `/apply` and `/consult` redirects in `next.config.mjs` are fixed external URLs.

---

## 4. Half-built features: real status

- **Phase 6, HubSpot CRM (CLAUDE.md says 30%): actually 0% wired.**
  - `lib/crm/hubspot/client.ts` and `contacts.ts` implement create, update, search, upsert, notes and bulk calls with rate-limit retry, but **nothing imports them**.
  - `@hubspot/api-client` is only in the root `package.json`, not `apps/web`.
  - The CRMs actually in use are **Twenty CRM via an n8n webhook** (contact form, Facebook leads) and **GoHighLevel** (business funding).
  - "Lead scoring 50–100" is really a 10–100 completeness heuristic in `/api/lead`. There is no deduplication anywhere.
- **Phase 7, SendGrid/Twilio (0%): accurate.**
  - No SendGrid.
  - `lib/email/brevo-client.ts`: the `@getbrevo/brevo` import is commented out, so every method is inert.
  - `lib/email/templates.ts` has 6 unused HTML templates.
  - `/api/automations/nurture` uses a console transport (now masked, and it reports `delivered:false`).
  - Twilio is used only for AI voice telephony (AI-owned routes). SMS verification doesn't exist: `components/LeadCapture/ReportModal.tsx` calls `/api/sms/send-verification`, `/api/reports/email` and `/api/crm/lead`, which **do not exist**, and that component is imported nowhere.
- **Phase 8, Google Calendar (0%): accurate.**
  - Booking is a static Google Calendar appointment link embedded in blog HTML.
  - The AI appointment tool uses mock slots (`lib/ai/tools/appointment-tools.ts`, AI-owned).
- **Phase 4, Lead capture "multi-step with phone verification": dead code.**
  - `components/LeadCapture/*` is unused; its consent checkboxes never reach the live forms.
  - The live lead paths are `/api/contact`, `/api/lead` and `/api/business-funding`.
- **Phase 10, Blog CMS (claimed 100%).**
  - Public blog = Firestore `posts` + 17 hard-coded posts in `lib/db/firestore.ts`.
  - Ingestion API works (`/api/blog/ingest`).
  - **The admin CMS (`/admin/blog`, `/admin/blog/new`) is entirely mock**: hard-coded list, and save is a `console.log` TODO.
- **AI content pipeline (dashboard).**
  - Implemented, but was **non-functional end-to-end** (Fix 10).
  - Not production-validated after the fix; needs one supervised run.
  - Dashboard run/post lists are placeholders.
- **Rates infrastructure.** Two disconnected systems:
  1. `/api/rates` (remote JSON feed → local file → embedded snapshot) powers every calculator and ticker and works.
  2. `/api/cron/pull-rates` → `rateSnapshots` depends on a FastAPI service that isn't in this repo, is unscheduled, and only feeds `/admin/rates`.
- **KPI reporting.** `/api/cron/reports/daily` computes `kpiDaily`, but nothing schedules it and nothing reads `kpiDaily`. `/admin/analytics` recomputes from raw leads.
- **Documents and compliance.** The `/api/documents` relay targets a FastAPI service that isn't present. `logCompliance` is console-only. `lib/compliance/rules.ts` allows everything; it only attaches disclaimers.
- **Dead/unused:** `lib/googleSheets.ts`, `lib/rbac.ts`, `lib/firebase.ts`, `components/Nav.tsx` (frontend), `/mli-proxy`, `/api/runs/[runId]`, `/api/user/prefs` (no caller).

---

## 5. Feature opportunities

| Title | Value | Builds on | Effort |
|---|---|---|---|
| Unified lead ingestion service (`lib/leads/ingest.ts`) | One path for contact, lead, business-funding and Facebook: validate → persist to Firestore as system of record (with consent evidence and UTM) → fan out to Twenty/GHL/Discord with retry → dedupe by email/phone. Ends lost and duplicate leads. | The 4 routes, `requestGuards`, `firebaseAdmin`, Twenty/GHL/Discord senders | M |
| CASL consent ledger + unsubscribe | Legal defensibility; proof of consent per lead (wording version, timestamp, IP) | Contact route already records the flags; `/api/compliance/log` → Firestore | S |
| Admin lead inbox | Lead detail view, status changes, notes, CSV export, "call dispatched?" column. Replaces the read-only table. | `/admin` (now Basic-Auth protected), `leads` collection | M |
| Scheduled KPI digest | Daily Discord/email summary: new leads, qualified, calls placed, CRM failures | `/api/cron/reports/daily` (now cron-auth'd, GET-enabled), `DISCORD_LEAD_WEBHOOK_URL`; add to `vercel.json` crons | S |
| Transactional email (Brevo) | Actually deliver calculator reports and lead confirmations; nurture sequences | `lib/email/brevo-client.ts`, `lib/email/templates.ts`, `lib/automations.ts` Transport interface | M (one dep) |
| Rate-drop alerts | Lead re-engagement: subscribers notified when the 5-yr fixed falls below a target | `/api/rates` feed, AI rate-alert logic in `lib/ai/tools/rate-tools.ts`, cron | M |
| Human-in-the-loop AI publishing | Compliance and quality: the pipeline writes drafts; an admin approves or republishes | Fixed pipeline, draft filtering, dashboard, republish route | M |
| Speed-to-lead SLA tracking | Measure time-to-first-call and outcome per lead | Contact `callDispatched`, Thinkrr webhook (AI-owned), `leads` collection | S |
| Durable rate limiting + Turnstile | Real spam/toll-fraud protection on the auto-dial form | `requestGuards` interface (swap the store) | S |
| Decide the CRM and delete the rest | Less dead code. If Twenty stays, delete the HubSpot module; if HubSpot is wanted, plug `hubspotContacts.upsertContact` into the unified ingest | `lib/crm/hubspot/*` | S |
| Google Calendar booking API | Real slot availability and confirmations | AI appointment tool (mock), email templates | L |

---

## 6. Notes for the next agent

- **Set in Vercel:**
  - `ADMIN_BASIC_AUTH_USER` and `ADMIN_BASIC_AUTH_PASSWORD` (otherwise `/admin` returns 503 in prod)
  - `CRON_SECRET`
  - `FACEBOOK_APP_SECRET`
  - `DISCORD_LEAD_WEBHOOK_URL`
  - `NEXT_PUBLIC_SITE_URL`
  - a Firebase Admin credential (any of the three forms)
  - Also rotate the Vapi key (§3).
- **Full `tsc` is blocked** by `app/(site)/calculators/amortization/page.tsx:56` (calculator agent's file). Re-run after that is fixed; my files type-check cleanly in isolation.
- **Auth helpers to reuse** (all in `lib/auth.ts`): `requireAdmin(req)` returns `{ok, uid}` or `{ok:false,status,error}` and never throws. `verifyCronRequest(req, {allowUnverifiedVercelUa})` handles cron auth. `hasServiceSecret(req)` checks `CREWAPI_SECRET`. Public forms should use `limitByIp()` and the masking helpers in `lib/compliance/requestGuards.ts`.
- **Firestore conventions now enforced in `lib/db/firestore.ts`:**
  - never write `undefined` (use `stripUndefined`);
  - never write nested arrays (use `encodeEmbeddings`);
  - never update array elements by dot-index (`updateRunStep` is transactional);
  - public post reads exclude drafts by default.
- **Behaviour changes to be aware of:**
  - `/api/contact` can now return 429, or 502 (nothing recorded the lead). The contact and qualify pages treat any non-OK as an error state.
  - `/api/lead` can return 500 instead of a fake success.
  - `/api/business-funding` returns `success:true` if any sink captured the lead.
  - The cron GET on `/api/orchestrate` will now actually create runs (it previously crashed), at most one per 20h.
  - Facebook leads without `FACEBOOK_APP_SECRET` no longer trigger AI calls.
- **Quick manual checks** (local `next dev`, no prod writes):
  - `curl -i localhost:3000/api/orchestrate` → 401
  - `curl -i "localhost:3000/mli-proxy/..%2F..%2Fpackage.json"` → 404
  - `curl -i localhost:3000/api/run/orchestrate -XPOST -d '{"runId":"x"}'` → 401
  - In production, `/admin` without credentials → 503 or 401.
- **Out-of-scope items flagged to owners:** Vapi key and chat admin log (AI); consent UI and misleading copy (frontend); cron file, `.env.example` typo and WAF (platform).
