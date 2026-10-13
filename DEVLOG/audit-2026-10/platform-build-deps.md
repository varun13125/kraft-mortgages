# Platform, build, config, dependencies, repo hygiene, testing/CI: audit report

- **Area:** `platform`
- **Date:** 2026-10-12
- **Auditor:** platform agent (one of 7 parallel agents)
- **Scope:** root `package.json` / `pnpm-workspace.yaml` / `vercel.json` / `next.config.js` / `.gitignore` / `.env.example` / `README.md` / `CRUSH.md`; `apps/web` build config (`package.json`, `next.config.mjs`, `vercel.json`, `tsconfig.json`, `.eslintrc.json`, `tailwind.config.ts`, `postcss.config.js`, `.env.example`, `.npmrc`, `scripts/**`, `types/**`); `packages/**`; `infra/**`; root `scripts/**`; `mli-select-complete` build config; `.github/workflows/ci.yml`.

**Evidence used:**
- Read-only Vercel API calls: project settings, the latest production deployment `dpl_6LEczeczwo24yNDGHwaPYjc4wXBu` (commit `891d870`), and its full build log.
- Live `curl -I` against `kraftmortgages.ca` and `www.kraftmortgages.ca`.
- `npm audit --omit=dev` (read-only, against the root `package-lock.json`) and `npm view` registry queries.
- `next lint` and `tsc --noEmit` (both read-only).
- `git ls-files` with file sizes, plus greps across the codebase.

Nothing was installed, upgraded or deleted, and no lockfile was touched.

---

## 1. Build and deploy map

### 1.1 What Vercel actually runs (confirmed from the production build log)

| Item | Value | Source |
| --- | --- | --- |
| Vercel project | `kraft-mortgages` (`prj_6czOXZkuqKyVm02yyU4yBpbTLlwh`), team `team_0EUuetdSQbmqlyYnpDd6pRgw` | `.vercel/project.json` + API |
| Root Directory | **repo root** (build `entrypoint: "."`) | build log |
| Effective `vercel.json` | **root `/vercel.json`** | build log runs `npm install` / `npm run build`, which only the root file specifies |
| Install command | `npm install`. Resolved from the root **`package-lock.json`**, even though Vercel logged "Detected pnpm-lock.yaml version 9 … pnpm@9.1.0" | root `vercel.json` `installCommand` |
| Build command | `npm run build`, which runs `pnpm --filter mli-portal build && pnpm -r --filter '!mli-portal' build && pnpm --filter @kraft/web mli:export` | root `package.json` |
| Detected Next.js | **14.2.5**. That is the root `package.json` dependency, used only for detection and by `mli-portal` | build log |
| Next.js the site actually runs | **14.2.21** (`apps/web/node_modules/next`) | build log `apps/web build: ▲ Next.js 14.2.21` |
| Node | 22.x (project setting). No `engines` field anywhere | API |
| Output | `apps/web/.next`. With Root Directory at `.`, this almost certainly comes from an **Output Directory override in project settings** (not visible through the API). Confirm in Dashboard → Settings → Build & Development | inferred |
| Crons | `/api/orchestrate` at `5 9 * * *`, which is **09:05 UTC** (≈ 02:05 Vancouver PDT), not "9:05 AM Vancouver" as the README claimed | root `vercel.json` |
| Build time | ~2 min. About 27 s of that is the `mli-portal` static export. `mli:export` runs **twice** (once inside the `@kraft/web` build script, once from the root script) | build log |
| Preview protection | Vercel SSO on every deployment except custom domains | API |

### 1.2 Conflicts and dead config

1. **`apps/web/vercel.json` is ignored entirely.** Vercel only reads `vercel.json` from the Root Directory, so none of the following run:
   - the `X-Robots-Tag: all` header. Harmless: that is the default anyway.
   - the **apex → www `permanent` redirect**. The live apex currently answers **`307 Temporary Redirect`** → `https://www.kraftmortgages.ca/`. That comes from the Vercel Domains setting, not from code. For SEO it should be 308/301 (Dashboard → Domains → `kraftmortgages.ca` → Redirect → Permanent).
   - the `/crewapi/(.*)` → `https://kraft-crewapi.vercel.app/$1` rewrite. Verified dead: `GET https://www.kraftmortgages.ca/crewapi/health` returns 404.
   - the `/api/cron/daily` cron. That route is broken anyway: it `fetch`es the relative URL `/crewapi/run` from server code, which throws in Node.
2. **Two package managers and two lockfiles.**
   - Prod installs with **npm** from `package-lock.json`. Local dev and CI use **pnpm** from `pnpm-lock.yaml`.
   - `pnpm-lock.yaml` is in sync with every `package.json`. **`package-lock.json` has drifted**: it lacks `sharp` (root and web) and still lists the removed `lottie-react` and `react-tilt` for `apps/web`.
   - Because Vercel runs `npm install`, not `npm ci`, each deploy silently re-resolves ("added 21 packages, changed 6 packages"). Production dependency trees are **not reproducible** and can differ from what was tested locally.
   - `apps/web/.npmrc` is a no-op in both worlds. npm ignores workspace-level `.npmrc` (the tracked `build-log.txt` shows the "ignoring workspace config" warning), and pnpm only reads the workspace-root `.npmrc`.
3. **Root `next.config.js` is not used by any build.** `apps/web` and `mli-select-complete` each load their own config. Vercel's framework detection keys off the root `package.json` `next` dependency, not this file. Its `typedRoutes: true` contradicts `apps/web`'s `typedRoutes: false`, but it has no effect. Safe to delete once the Root Directory question is settled; not deleted here.
4. **Root `package.json` dependencies exist mostly for hoisting and detection:**
   - `next@14.2.5`, `react`, `react-dom`: Vercel detection plus `mli-portal`.
   - `firebase-admin@^13` is **unused**. `apps/web` resolves its own nested `firebase-admin@12.7.0`.
   - `@react-pdf/renderer` and `react-pdf` are **unused** (0 imports anywhere).
   - `html2canvas` and `@hubspot/api-client` **are used by `apps/web`** (`lib/reports/pdf-generator.ts`, `lib/crm/hubspot/client.ts`) but are declared only at the root. These are phantom dependencies that only resolve through parent-directory lookup.
   - `jspdf` is declared at both root and web.
5. **The MLI microsite ships twice.**
   - `mli-select-complete` (`mli-portal`, `output: 'export'`, `basePath: '/mli-select'`) is built and copied into `apps/web/public/mli-select/`. That makes it reachable at `/mli-select/index.html`, `/mli-select/overview/index.html` and so on, and again through the `app/mli-proxy/[...path]` route handler (`/mli-proxy/index.html` returns 200).
   - Meanwhile the real site serves `app/(site)/mli-select/**` at the same logical URLs. The result is duplicate content, plus ~27 s of build time and 3 MB of committed build output.
   - The `mli-proxy` route's header comment references "rewrites in next.config.mjs" that no longer exist.
6. **Build-time log noise.** `/api/criteria` and `/api/check-admin` log `DYNAMIC_SERVER_USAGE` errors during static generation because they lack `export const dynamic = 'force-dynamic'`. They still work. `needs-owner: backend`.
7. **Type errors fail production builds; lint errors do not.**
   - `next.config.mjs` sets `eslint.ignoreDuringBuilds: true`, which hides 172 lint errors (§3).
   - `typescript.ignoreBuildErrors` is **not** set, so `next build` type-checks. The last deployed commit (`891d870`) type-checked clean.
   - ⚠️ **If the current uncommitted `apps/web/data/canadianLendersData.ts` (65 known `isDormant` errors) is committed as-is, the next Vercel production build will fail.**

### 1.3 Security headers (live, before this audit)

`curl -I https://www.kraftmortgages.ca/` returned only `Strict-Transport-Security: max-age=63072000`, which Vercel adds by default. There was no `X-Content-Type-Options`, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy` or CSP. (`X-Powered-By` did not show up on the cached pages I checked; Next would send it on uncached dynamic responses unless disabled.) Fixed in `next.config.mjs` (§6). A CSP is proposed in Report-Only form in §7, item P-H5.

### 1.4 Recommended target layout (needs a preview-deploy test; not changed here)

Option A is cleanest:
- Set Vercel **Root Directory = `apps/web`** and turn on "Include source files outside of the Root Directory".
- Install with `pnpm install --frozen-lockfile` (auto-detected from `packageManager`).
- Build command: `cd ../.. && pnpm --filter mli-portal build && pnpm --filter @kraft/web build`, or drop the microsite (see 1.2 #5).
- Merge the cron from the root `vercel.json` into `apps/web/vercel.json`, decide whether `/api/cron/daily` and `/crewapi` should exist at all, then delete the root `vercel.json`, root `next.config.js`, the root `next`/`react` dependencies and `package-lock.json`.

Option B is minimal:
- Keep the Root Directory at `.`.
- In the root `vercel.json`, set `"installCommand": "pnpm install --frozen-lockfile"` and `"buildCommand": "pnpm run build"`.
- Delete `package-lock.json` and `apps/web/vercel.json`.

Either way, test on a preview deployment before promoting.

---

## 2. Dependency report

### 2.1 `npm audit --omit=dev` (root `package-lock.json`, i.e. what production installs)

**43 vulnerable packages: 4 critical, 20 high, 17 moderate, 2 low.** The Vercel build log reported 50 including dev dependencies. Key items:

| Package (installed) | Severity | What matters for this app | Fix |
| --- | --- | --- | --- |
| **next 14.2.21** (site) / 14.2.5 (mli + root) | critical | Fixed by **14.2.35** (last 14.x; npm marks 14.2.21 *deprecated* and links to the 2025-12-11 security post): middleware authorization bypass CVE-2025-29927 / GHSA-f82v-jwr5-mffw (<14.2.25) — **low practical impact here** because `middleware.ts` only does a host redirect, no auth; RSC DoS GHSA-mwv6-3258-q52c + incomplete-fix GHSA-5j59-xgg2-r9c4 (<14.2.34/35); middleware redirect SSRF GHSA-4342-x723-ch2f (<14.2.32); image-optimizer cache-key confusion / content injection (<14.2.31); cache-poisoning race (<14.2.24). **Only fixed in ≥15.5.x** (no 14.x backport): Server Actions DoS (GHSA-m99w-x7hq-7vfj), RSC DoS (GHSA-q4gf…, GHSA-8h8q…), rewrites request smuggling / SSRF (GHSA-ggv3…, GHSA-p9j2…), RSC cache poisoning, CSP-nonce XSS, plus two criticals that are self-hosting specific (AVIF image-optimizer RCE GHSA-2xp9-vwfh-vxw4, Windows-host RCE). Vercel runs image optimisation on its own infrastructure and Linux hosts, so verify per advisory, but the RSC/Server-Action DoS class does apply. | 14.2.35 now → 15.5.x (`backport` tag 15.5.27) → 16.x (`latest` 16.4.0) |
| **jspdf 3.0.1** (root + web) | critical | Used **client-side only** (calculator PDF reports, `components/calculator-report/*`, `lib/reports/pdf-generator.ts`), so the Node-only LFI is not reachable. The remaining issues are HTML/PDF-JS injection and DoS from crafted input. Treat as **high**. | 4.2.1 (major; re-test every report) |
| protobufjs ≤7.6.4 | critical | Transitive via firebase-admin / google-gax / @grpc | refresh lockfile; firebase-admin 14 |
| websocket-driver ≤0.7.4 | critical | Transitive via `firebase` (faye-websocket) | refresh lockfile |
| jws, node-forge, @grpc/grpc-js, @fastify/busboy, form-data, lodash, nanoid, glob/minimatch/brace-expansion, picomatch, fast-xml-builder, source-map-js, browserslist | high | All transitive (firebase-admin, googleapis, build tooling) | in-range refresh fixes most; the firebase-admin chain needs 14.x |
| postcss 8.4.39, tailwindcss 3.4.7 (+ chokidar/braces/micromatch/fast-glob) | high | **Build-time only**, so not reachable at runtime | postcss 8.5.x; tailwind latest 3.4.x |
| firebase-admin 12.7 / 13.7 → @google-cloud/firestore, google-gax, uuid, teeny-request, retry-request | moderate | Transitive | firebase-admin 14.5 (major) |
| dompurify, mdast-util-to-hast, qs, yaml, fflate, fast-xml-parser | moderate | Transitive | refresh lockfile |

`pnpm-lock.yaml` (local/CI) resolves different versions in places. After switching prod to pnpm, run `pnpm audit --prod` as the source of truth.

### 2.2 Outdated or deprecated direct dependencies (`apps/web` unless noted)

| Package | Declared | Latest | Notes |
| --- | --- | --- | --- |
| next / eslint-config-next / @next/mdx | 14.2.21 | 14.2.35 · 15.5.27 · 16.4.0 | see 2.1. Keep all three in lock-step |
| next (root, mli-portal) | 14.2.5 | ″ | bump with the site |
| @anthropic-ai/sdk | ^0.18.0 | 0.133.0 | very old. `needs-owner: ai-voice` (lib/ai/llm.ts, providers/anthropic.ts) |
| @google/generative-ai | ^0.4.0 | 0.24.1 (legacy) | Google has replaced it with **`@google/genai` 2.28.0**. Used only in `lib/ai/llm.ts` |
| openai | ^4.104.0 | 7.32.0 | two majors behind |
| firebase-admin | ^12.5.0 (root ^13.7.0) | 14.5.0 | consolidate on one version; root copy unused |
| firebase (client) | ^12.1.0 | 13.0.0 | |
| googleapis | ^155.0.1 | 185.0.0 | only `google.sheets` is used. `@googleapis/sheets` is far smaller |
| jspdf | ^3.0.1 | 4.2.1 | security (2.1) |
| @prisma/client / prisma | 5.16.2 | 7.10.0 | optional path. `prisma generate` never runs in the Vercel build, so setting `DATABASE_URL` would break at `require('@prisma/client')` |
| recharts | 2.12.7 | 3.10.1 | stay on 2.x (2.15.x) unless redesigning charts |
| zod | 3.23.8 | 4.6.6 | 3.25.x is a safe minor |
| eslint | 8.57.0 | — | ESLint 8 is EOL. `next lint` is deprecated in Next 15.5 and removed in 16, so move to ESLint 9 flat config with the Next upgrade |
| @types/node | 20.12.12 | — | match runtime: 22 |
| tailwindcss / postcss / autoprefixer | 3.4.7 / 8.4.39 / 10.4.19 | 3.4.x / 8.5.x | build-time |
| **tavily** | ^1.0.2 | — | npm description reads "Deprecated: Use @tavily/core instead". Legitimate (official tavily-ai repo) but **unused**: `lib/ai/tools.ts` calls `api.tavily.com` with `fetch` |
| **react-use-gesture** | ^9.1.3 | — | deprecated, replaced by `@use-gesture/react`. **Unused** |

### 2.3 Unused dependencies (0 imports in `apps/web`, verified by grep; confirm with `npx knip` before removing)

- `apps/web`: `tavily`, `react-use-gesture`, `react-countup`, `react-intersection-observer`, `react-markdown`, `@radix-ui/react-dialog`, `-dropdown-menu`, `-label`, `-select`, `-separator`, `-slider`, `-switch`, `-tabs`, `-toast`. Only `@radix-ui/react-slot` is used.
- Root: `@react-pdf/renderer`, `react-pdf`, `firebase-admin@^13`. Also `jspdf` is a duplicate.
- **Keep, even though not imported directly:** `@mdx-js/loader` and `@mdx-js/react` (peers of `@next/mdx`), `farmhash-modern` (referenced in `next.config.mjs` for firebase-admin), `tailwindcss-animate` (tailwind config), `sharp` (used by `scripts/make-og-image.mjs`).
- **Move into `apps/web/package.json`:** `html2canvas` and `@hubspot/api-client` (used there, declared only at the root).

### 2.4 Upgrade plan (safe order; each step = one PR + preview deploy)

0. **Today, no code needed:** rotate the leaked credentials (§5, item P-C1).
1. **Pick one package manager** (§1.4), so the lockfile you test is the lockfile you ship. Do this first: every later step is unreliable while prod re-resolves from a drifted npm lockfile.
2. **Patch-level security** (low risk):
   - `next`, `eslint-config-next`, `@next/mdx` → 14.2.35 in `apps/web`. Root and `mli-portal` `next` → 14.2.35.
   - `pnpm update` within ranges to pull patched transitives: protobufjs, websocket-driver, jws, node-forge, grpc, lodash, form-data, etc.
   - Re-run `pnpm audit --prod`.
3. **jsPDF 4.x** (major): test every calculator's "download PDF" path and the ReportModal flow.
4. **Remove unused deps** (2.3). Move `html2canvas` and `@hubspot/api-client` into `apps/web`. Drop the root `firebase-admin`, `react-pdf` and `@react-pdf/renderer`.
5. **Server SDK majors** (`ai-voice` / `backend` owners):
   - `@anthropic-ai/sdk` → current.
   - `@google/generative-ai` → `@google/genai`.
   - `openai` 4 → current.
   - `firebase-admin` 12 → 14: one version, and confirm the modular imports in `lib/firebaseAdmin.ts`, `lib/db/firestore.ts` and `lib/auth.ts`.
   - `firebase` 12 → 13.
   - `googleapis` → `@googleapis/sheets`.
6. **Framework:** Next 14 → 15.5.x. React 19 is required for the App Router there. Use the `@next/codemod` for async `params`, `cookies()` and `headers()`. Replace `next lint` with the ESLint 9 CLI. Then evaluate 16.x. This closes the advisories that have no 14.x fix.
7. **Tooling:** latest tailwind 3.4.x, postcss 8.5.x, TypeScript 5.9, `@types/node` 22. Run `npx update-browserslist-db@latest` (caniuse-lite is 14 months old).

---

## 3. Lint summary (`next lint`, run 2026-10-12)

This is a snapshot taken while other agents were editing app files. **177 problems: 172 errors, 5 warnings.** All errors come from a single rule. Builds don't see them because of `eslint.ignoreDuringBuilds: true`.

| Rule | Count | Owner area | Files |
| --- | --- | --- | --- |
| `react/no-unescaped-entities` (raw `'` / `"` in JSX text) | 159 | `frontend-seo` | 19 city pages `app/(site)/mortgage-broker-*` (138; richmond 14, red-deer 12, victoria 11, windsor 10, ottawa 10, …), `varun` (12), `about` (3), `equity-lending` (2), `private-lending`, `mli-select`, `mli-select/overview`, `app/blog/page.tsx` (1 each) |
| `react/no-unescaped-entities` | 5 | `calc-*` | `calculators/stress-test`, `renewal`, `mortgage-penalty`, `a-vs-equity`, `private-lending/calculators/alternative-income` |
| `react/no-unescaped-entities` | 4 | `ai-voice` | `components/ChatWidget/CleanVoiceControls.tsx` (2), `SimpleVoiceControls.tsx` (2) |
| `react/no-unescaped-entities` | 4 | `backend` (lead capture/reports) | `components/LeadCapture/PhoneVerification.tsx` (2), `ReportModal.tsx` (1), `lib/reports/templates/payment-report.tsx` (1) |
| `react-hooks/exhaustive-deps` (*unnecessary* dependency in `useMemo`) | 3 | `calc-*` | `calculators/first-time-home-buyer:127` (`annualIncome`), `refinance-break-even:74` (`currentRate`), `refinance-vs-heloc-vs-second:129` (`homeValue`). Worth a look: a listed dependency that the memo body doesn't read often means the calculation reads a different, stale variable |
| `react-hooks/exhaustive-deps` | 2 | `ai-voice` | `CleanVoiceControls.tsx:66` (missing `processWithAI`), `VoiceAgentWidget/EmbeddedVoiceAgent.tsx:101` (ref read in cleanup) |

The unescaped-entities errors are mechanical (`'` → `&apos;` or `{"'"}`). Once they're fixed, delete `continue-on-error: true` from the CI lint job and consider removing `ignoreDuringBuilds`.

---

## 4. Environment variable inventory

**72 variables are read by `apps/web`.** That's 71 from the grep plus `CRON_SECRET`, which the backend agent added during this audit; agents may still be adding more. `mli-select-complete` and the root scripts read none.

Before this audit, **21 of them were documented in neither `.env.example`**. Several documented names were wrong:
- root documented `CREWAI_SECRET`, but the code reads `CREWAPI_SECRET`;
- root documented `NEXT_PUBLIC_META_PIXEL_ID`, but the code reads `META_PIXEL_ID`;
- only `OPENROUTER_API_KEY` was documented, but half the AI code reads `OPEN_ROUTER_API_KEY`.

Both `.env.example` files now list everything (§6).

Column key:
- **Doc before:** R = root `.env.example`, W = `apps/web/.env.example`, — = undocumented.
- **Req:** req = feature breaks without it; opt = has a fallback or only enables an add-on.

| Variable | Scope | Read in | Req | Doc before | Notes |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | public | lib/seo/sitemap.ts, lib/meta/conversions.ts, lib/ai/providers/openrouter.ts | opt | R,W | default `https://www.kraftmortgages.ca` |
| NEXTAUTH_URL | server | app/api/voice/twilio/outbound | opt* | — | misnamed (no NextAuth). Defaults to `http://localhost:3000`, so the Twilio callback is broken in prod unless set |
| NODE_ENV | server | lib/db.ts | — | — | set by Next |
| NEXT_PUBLIC_FIREBASE_API_KEY / _AUTH_DOMAIN / _PROJECT_ID / _APP_ID | public | lib/firebase.ts, lib/firebase.client.ts | req (admin/CMS) | R,W | dummy fallbacks hide misconfiguration |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET / _MESSAGING_SENDER_ID / _MEASUREMENT_ID | public | lib/firebase.ts | opt | — | |
| FIREBASE_SERVICE_ACCOUNT_JSON | server | lib/auth.ts, lib/db/firestore.ts, lib/googleSheets.ts (+ lib/firebaseAdmin.ts) | req (one form) | — | preferred form. Previously documented only in `setup-vercel-env.md` |
| FIREBASE_SERVICE_ACCOUNT | server | lib/firebaseAdmin.ts | alt | — | legacy name for the same JSON |
| FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY | server | lib/auth.ts, lib/db/firestore.ts, lib/googleSheets.ts | alt | R | split form |
| DATABASE_URL | server | lib/db.ts + 9 routes/pages (admin, lead, business-funding, cron/*, nurture, twilio/recording) | opt | — | Prisma path. Falls back to Firestore. `prisma generate` is not in the build |
| OPENROUTER_API_KEY | server | app/api/chat | opt | R,W | |
| OPEN_ROUTER_API_KEY | server | app/api/chat, lib/ai/llm.ts, lib/ai/providers/openrouter.ts | opt | — | **naming split.** llm.ts and openrouter.ts read only this one. `needs-owner: ai-voice` |
| ANTHROPIC_API_KEY | server | lib/ai/llm.ts, lib/ai/providers/anthropic.ts | opt | R | |
| OPENAI_API_KEY | server | lib/ai/llm.ts, lib/ai/providers.ts, lib/ai/tools.ts, app/api/voice/twilio/recording | opt | R | |
| GOOGLE_API_KEY | server | app/api/chat, lib/ai/llm.ts, lib/ai/tools.ts, lib/ai/tools/web-search-tools.ts, lib/googleSheets.ts | opt | R,W | one key serves Gemini, Custom Search and Sheets |
| NVIDIA_API_KEY | server | app/api/chat | opt | W | |
| GOOGLE_SEARCH_ENGINE_ID | server | lib/ai/tools/web-search-tools.ts | opt | — | |
| TAVILY_API_KEY | server | lib/ai/tools.ts | opt | R | |
| AI_MODE | server | lib/pipeline/stages/publish.ts | opt | R | `firestore` skips WordPress |
| RATES_FEED_URL | server | app/api/rates | opt | — | default `https://blog.kraftmortgages.ca/current_rates.json` |
| CRITERIA_MATRIX_URL | server | app/api/criteria | opt | — | default on blog.kraftmortgages.ca |
| RATES_DATA_PATH | server | lib/rates.ts | opt | — | |
| GOOGLE_SHEET_ID | server | lib/googleSheets.ts | opt | — | built-in default |
| FASTAPI_BASE_URL | server | app/api/cron/pull-rates, app/api/documents | opt* | — | defaults to `http://localhost:8000`, so broken in prod unless set |
| NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY / _HINDI_WIDGET_KEY | public | components/ThinkrrVoiceWidget.tsx | opt | W | hard-coded fallback key |
| THINKR_API_KEY / _AGENT_ID / _CALLER_PHONE / _OUTBOUND_SCENARIO_ID | server | lib/voice/thinkr.ts | opt | R | |
| THINKR_WEBHOOK_SECRET | server | app/api/webhooks/thinkr | req (webhook) | R | |
| NEXT_PUBLIC_VOICE_AGENT_DOMAIN / _SCRIPT_URL / _WIDGET_ID | public | components/VoiceAgentWidget/{EmbeddedVoiceAgent,VoiceAgentWidget}.tsx | opt | R | the two components fall back to *different* domains |
| ELEVENLABS_API_KEY | server | app/api/voice/generate, lib/voice/elevenlabs-speech.ts | opt | R | |
| MINIMAX_API_KEY / MINIMAX_JWT_TOKEN | server | app/api/voice/minimax | opt | R / — | either name |
| VAPI_API_KEY / VAPI_ASSISTANT_ID / VAPI_PHONE_NUMBER_ID | server | lib/voice/vapi.ts | opt | — | **hard-coded fallback values in source, including the API key.** See P-H4 |
| TWILIO_ACCOUNT_SID / _AUTH_TOKEN / _CALLER_ID | server | app/api/voice/twilio/outbound | req (feature) | R | non-null-asserted (`!`) |
| DISCORD_LEAD_WEBHOOK_URL | server | app/api/{contact,business-funding,chat,webhooks/facebook,webhooks/thinkr} | opt | R,W | |
| TWENTY_WEBHOOK_URL | server | app/api/chat, webhooks/facebook, webhooks/thinkr | opt | W | falls back to the n8n contact-form webhook |
| TWENTY_API_URL / TWENTY_API_KEY | — | *(not read)* | unused | W | |
| WHATSAPP_PHONE | — | *(not read; number hard-coded in components/icons/WhatsAppIcon.tsx)* | unused | W | |
| HUBSPOT_ACCESS_TOKEN / HUBSPOT_API_KEY | server | lib/crm/hubspot/client.ts | opt | R | HubSpot retired legacy API keys, so use the access token |
| BREVO_API_KEY | server | lib/email/brevo-client.ts | opt | R | |
| META_PIXEL_ID | server | lib/meta/conversions.ts | opt | — (R had the `NEXT_PUBLIC_` name) | |
| META_CONVERSIONS_ACCESS_TOKEN | server | lib/meta/conversions.ts | opt | R | |
| NEXT_PUBLIC_META_PIXEL_ID | — | *(not read)* | unused | R | |
| FACEBOOK_APP_SECRET / _PAGE_ACCESS_TOKEN / _WEBHOOK_VERIFY_TOKEN | server | app/api/webhooks/facebook | req (webhook) | R | |
| NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_SEGMENT_WRITE_KEY | public | components/Analytics.tsx | opt | R | |
| NEXT_PUBLIC_PWA_ENABLED | public | components/PWA.tsx | opt | R | any non-empty string, including `"false"`, enables it |
| CREWAPI_SECRET | server | app/api/orchestrate, app/api/cron/daily, app/api/blog/ingest | req (cron/ingest) | W (R had `CREWAI_SECRET`) | |
| BLOG_INGEST_TOKEN | server | app/api/blog/ingest | alt | — | |
| CRON_SECRET | server | lib/auth.ts (cron helper, added by backend agent this audit) | **strongly rec.** | — | Vercel sends `Authorization: Bearer $CRON_SECRET` to crons once it's set |
| NEXT_PUBLIC_CREWAPI_BASE_URL | public | app/dashboard/page.tsx, lib/api.ts, app/api/cron/daily | opt | W (`/crewapi`) | the `/crewapi` value relied on the dead rewrite |
| WORDPRESS_BASE_URL / _USERNAME / _APP_PASSWORD | server | app/api/publish/republish, lib/pipeline/stages/publish.ts | opt | R (commented) | |
| GSC_CLIENT_EMAIL / GSC_PRIVATE_KEY / GSC_SITE_URL | server | app/api/strategy/weekly | opt | R (commented) | |

**Action for the owner:** check that the Vercel project's env var names match this table. In particular, set `CREWAPI_SECRET` (not `CREWAI_SECRET`), both OpenRouter spellings or one consolidated name, `META_PIXEL_ID`, `CRON_SECRET`, and `NEXTAUTH_URL`/`FASTAPI_BASE_URL` if those features are used.

---

## 5. Repo hygiene

There are 762 tracked files and a 40 MB pack. Findings below. **Nothing was deleted.** Safe `.gitignore` entries were added (§6).

### 5.1 Committed secrets (critical; see P-C1)

Values are deliberately not reproduced here.
- **`/API`** (root, 968 B, tracked): a Google Cloud API key, an ElevenLabs API key, a MiniMax JWT and an Azure Cognitive Services endpoint.
- **`/.mcp.json`** (tracked): an `N8N_API_KEY` JWT for the self-hosted n8n instance, plus Azure client/tenant IDs.
- **`/postiz-config.md`** (tracked): the Postiz API key, also embedded in its MCP endpoint URL, plus social channel IDs and a Google Sheet ID.
- `apps/web/lib/voice/vapi.ts`: a hard-coded fallback `VAPI_API_KEY` in source (`needs-owner: ai-voice`).

I checked the history of `.env.example`/`README.md` for `PRIVATE KEY`: only `\n...\n` placeholders, no real keys.

### 5.2 Binaries and large files in git

| Path | Size | Note |
| --- | --- | --- |
| `apps/web/data/canadianLendersData.ts` | **9.96 MB, 186,438 lines** | User data (not touched). Compiles into a **7.36 MB server chunk** (`.next/server/chunks/9329.js`) shared by `/api/chat` and `/api/lenders`. No client-bundle impact: imported only by server modules, and the largest client chunk is 365 KB. Costs: cold-start parse time, tsc memory and time, and huge git diffs on every data refresh. See FEAT P-F4 |
| `social-graphics/*.png` (21 files) | **27 MB** | marketing assets. Move to Drive or Git LFS |
| `apps/web/public/images/blog-*.png` | 0.7–1.6 MB each | unoptimised PNGs served as blog hero images. Convert to WebP/AVIF and serve via `next/image` |
| `apps/web/public/mli-select/**` (139 files) | 3.1 MB | **generated build output**, rewritten on every build. Accumulates stale chunk hashes (e.g. two `framework-*.js`) |
| `apps/public/mli-select/**` (78 files) | 1.7 MB | stray old copy at a path nothing serves |
| `kraft-mortgages-full-aug2025-polish.zip` | 49 KB | old snapshot archive |
| `Kraft Mortgages white.png`, `Kraft Mortgages white - fevicon K.PNG` (root) | 27 KB / 38 KB | source logos at repo root |
| `package-lock.json` | 525 KB | drifted second lockfile (§1.2) |
| `apps/web/data/approvedDirectoriesData.ts` | 372 KB | data |

### 5.3 Stray or duplicate files

- `gitignore.txt`: an unused Next template `.gitignore`. Its useful entries (`*.tsbuildinfo`, `*.pem`, `.env*.local`, `/coverage`, `.pnp*`, `.wrangler/`) are now merged into `.gitignore`, so the file can be deleted.
- `tailwind.config.ts.txt`: a shadcn template with `./src/**` paths. Unused.
- `blog-post-beyond-big-banks.md`, `blog-post-firestore-data.json`, `blog-post-html-format.html`, `first-blog-post-content.md`, `first-blog-post-firestore.json`, `first-blog-post-html.html`: blog drafts at the root. Move to `apps/web/content/` or `docs/drafts/`, or delete.
- `test-api.ps1`: targets `/api/debug-run`, which was deleted in `52159b8`.
- `apps/web/build-log.txt`: UTF-16 PowerShell output of an old local build. Tracked; now gitignored.
- `apps/web/tsconfig.tsbuildinfo`: **not** tracked (ignored), good. Now also covered by `*.tsbuildinfo`.
- `.vercel/project.json`: tracked despite `.vercel` being in `.gitignore`. It holds non-secret IDs; untrack it.
- `.claude/settings.local.json`: tracked. A personal permission allow-list that includes `git push`, `rm`, `git reset`. Untrack it.
- `next.config.js` (root): unused (§1.2 #3).
- `apps/web/vercel.json`: ignored by Vercel (§1.2 #1).
- `apps/web/.npmrc`: no-op (§1.2 #2).
- `packages/ui`: an empty package (only `package.json`).
- `infra/docker-compose.yml`: Postgres, Redis and `localstack:latest` (unpinned). The app uses none of them. Postgres is only the optional `DATABASE_URL` path, and there is no Redis/S3 code.
- Root `seed` script and `packages/prisma` `seed` script use a wrong path (`./packages/prisma/seed.ts` relative to the package dir).
- `PRD`, `API` (extensionless), `MARBLISM-PROMPT-BIBLE.md`, `design-reference/`: docs and notes at the root. Consider `docs/`.

### 5.4 Suggested cleanup commands (for the owner; **run only after rotating keys**)

```bash
git rm --cached API postiz-config.md .mcp.json .claude/settings.local.json .vercel/project.json apps/web/build-log.txt
git rm -r --cached apps/public apps/web/public/mli-select    # then add both paths to .gitignore
git rm gitignore.txt tailwind.config.ts.txt test-api.ps1 kraft-mortgages-full-aug2025-polish.zip
# History purge for the leaked keys (rewrites history; coordinate before force-pushing):
#   git filter-repo --path API --path postiz-config.md --path .mcp.json --invert-paths
```

---

## 6. Fixed

| # | File:line | What was wrong | What changed | How verified |
| --- | --- | --- | --- | --- |
| F1 | `apps/web/next.config.mjs:4-44` | No security headers at all (live check: only Vercel's default HSTS). `X-Powered-By` was not disabled | Added a `securityHeaders` array and an `async headers()` for `/:path*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), geolocation=(), payment=(), usb=(), browsing-topics=()`, `Strict-Transport-Security: max-age=63072000` (same as Vercel's default, now explicit). Added `poweredByHeader: false` (defence in depth). **Microphone is deliberately left at the browser default** (self, plus iframes with `allow="microphone"`) because Thinkrr, SalesCloser and ChatWidget voice need it. **No CSP** (proposal in P-H5). `includeSubDomains`/`preload` withheld until every subdomain is confirmed HTTPS-only. The `ignoreDuringBuilds` comment now notes the 172 outstanding errors | Imported the config with Node and printed `headers()`: 1 rule, 5 headers. `redirects()` still returns 29 entries. Checked against `<iframe>`/embed usage: the only iframe is LeadConnector on `/varun`, and no site page is framed by another site in the repo. No camera, geolocation or payment API usage in `app/` or `components/`. The `.mjs` is outside the tsconfig `include`, so there is no TS impact |
| F2 | `apps/web/.env.example` (rewritten) | Listed 21 of 72 variables. Had real-looking default values (`/crewapi` base URL that depends on a dead rewrite) | Full commented inventory of every `process.env.*` read by `apps/web`, grouped by feature, with req/opt/unused markers, alternate names, defaults and the known pitfalls (OpenRouter naming split, `META_PIXEL_ID`, `NEXT_PUBLIC_PWA_ENABLED` semantics, localhost defaults, CRON_SECRET). All values empty except `NEXT_PUBLIC_SITE_URL`, `AI_MODE=firestore`, `GSC_SITE_URL`. Did **not** open any `.env`/`.env.local` | Diffed the variable names against a fresh grep of the code: every code var is present except `NODE_ENV`. The extra names are the 4 documented-but-unused ones, explicitly marked `[unused]` |
| F3 | `/.env.example` (rewritten) | Out of date. Wrong names (`CREWAI_SECRET`, `NEXT_PUBLIC_META_PIXEL_ID` only). Missing 21+ vars | Mirror of F2 with a header explaining that Next only reads env files from `apps/web/` | `diff` shows only the 2 header lines differ |
| F4 | `/.gitignore:50-73` | Missing standard ignores. Credential files and build logs were committable | Appended `.env*.local`, `*.tsbuildinfo`, `build-log.txt`, `*.pem`, `/coverage`, `.pnp`, `.pnp.js`, `.yarn/install-state.gz`, `.wrangler/`, `playwright-report/`, `test-results/`, `.mcp.json`, `.claude/settings.local.json`, `/API`, `/postiz-config.md`, with a comment that ignoring does not untrack | `git check-ignore -v` confirms the new patterns match and `.env.example` is **not** ignored. Tracked files are unaffected (no files removed) |
| F5 | `/package.json:9-11` | `start: pnpm -r start` also ran `next start` in `mli-portal`, which uses `output: 'export'` and errors. No root typecheck/lint entry points | `start` → `pnpm --filter @kraft/web start`. Added `typecheck` and `lint` that delegate to `@kraft/web`. `build` is untouched (production uses it) | JSON parses. `pnpm run --filter @kraft/web` lists the scripts. Vercel only calls `build` |
| F6 | `apps/web/package.json:11` | No typecheck script, so CI had nothing to call | Added `"typecheck": "tsc --noEmit --incremental false -p ."` | `pnpm --filter @kraft/web exec tsc --version` → 5.5.4. Same command as the documented DEVLOG check |
| F7 | `.github/workflows/ci.yml` (rewritten) | The "Typecheck & Lint" step ran `build --dry-run \|\| true` and `lint \|\| true`, so it never type-checked and could never fail. Node 20 vs Vercel's 22.x | Three jobs. **typecheck** (blocking: `pnpm --filter @kraft/web run typecheck`). **lint** (`continue-on-error: true` until the 172 errors are fixed). **build** (same command as before, `needs: typecheck`). Node 22, `pnpm install --frozen-lockfile`, a concurrency group. Uses only already-installed tooling | YAML parsed with the repo's `yaml@2.8.1`: jobs `[typecheck, lint, build]`. pnpm-lock is in sync with all package.json files, so `--frozen-lockfile` won't fail. Typecheck goes green once the in-progress `amortization/page.tsx` syntax error is fixed, and stays green as long as the 65 `isDormant` errors are not committed |
| F8 | `README.md:5-15` + 6 lines further down | Said `npm install`, `.env.local` at the root, and cron "9:05 AM Vancouver". Didn't explain the monorepo or deploy reality | Added a "Developer quick reference (updated 2026-10)" section: workspace layout, pnpm commands, env file location, effective Vercel config, two-lockfile caveat, UTC cron, CI. Fixed the stale install/dev/cron/env lines. CRLF line endings preserved | Re-grepped for `npm install`, `9:05`, `.env.local`. The remaining mentions are correct |
| F9 | `CRUSH.md:35-41` | Listed `npm run test`, which doesn't exist | Replaced with the real pnpm commands, plus a note that no test runner exists yet | Read back |

**Type-check result:** I ran `tsc --noEmit --incremental false -p .` once (71 s). It reported **3 errors, all TS1005 syntax errors in `app/(site)/calculators/amortization/page.tsx:56`**: an unescaped `"straight switch"` inside a double-quoted string, from a concurrent edit by a calculators agent. Because tsc stops at syntax errors, the semantic pass (including the 65 known `isDormant` errors) did not run in this snapshot. **None of my edits touch a file in the TypeScript program**, since `.mjs`, JSON, YAML and markdown are outside `include`, so I introduced no TS errors.

---

## 7. Open issues (not fixed)

Severity uses the DEVLOG scale.

### Critical

- **P-C1 · Live credentials committed to git.**
  - Location: `/API`, `/.mcp.json`, `/postiz-config.md` (§5.1).
  - What leaked: Google Cloud API key, ElevenLabs key, MiniMax JWT, n8n API key and Postiz API key. Anyone with repo access, any CI log, or any AI tool that reads the repo has them. If the GitHub repo `varun13125/kraft-mortgages` is or was ever public, assume they have been scraped.
  - Fix:
    1. **Rotate all five now.**
    2. Move them to a password manager or Vercel env.
    3. `git rm --cached` (or delete) the files. In `.mcp.json`, use `${N8N_API_KEY}` env expansion instead.
    4. Purge history with `git filter-repo`.
    5. Turn on GitHub secret scanning and push protection.
    6. Add a gitleaks step to CI.
  - `needs-owner: platform` (the user).
  - Not fixed because it needs file deletion, history rewriting and key rotation, which only the owner can do.
- **P-C2 · Next.js 14.2.21 in production with known advisories** (§2.1).
  - npm marks this exact version deprecated for security. The worst 14.x item (middleware bypass) has limited impact here because the middleware has no auth role. The RSC/Server-Action DoS advisories do apply.
  - Fix: bump `next`, `eslint-config-next` and `@next/mdx` to **14.2.35** now (patch). Plan Next 15.5.x for the advisories that have no 14.x fix.
  - `needs-owner: platform`.
  - Not fixed: dependency upgrades are forbidden for this pass.

### High

- **P-H1 · Production install is non-reproducible and uses a different package manager from dev/CI** (§1.2 #2).
  - Fix: §1.4 Option A or B. Prod should install with `pnpm install --frozen-lockfile`, and `package-lock.json` should be deleted.
  - `needs-owner: platform`.
  - Not fixed: changing the production install/build pipeline needs a preview-deploy test and the owner's go-ahead.
- **P-H2 · `apps/web/vercel.json` is dead config, and the apex redirect is temporary (307)** (§1.2 #1).
  - Fix: consolidate into a single `vercel.json` (per §1.4) and set the apex domain redirect to permanent in Vercel Domains. Decide whether the `/crewapi` rewrite and the `/api/cron/daily` cron are still wanted. The route is broken (relative server-side fetch), so probably delete it. Note that moving `apps/web/vercel.json`'s `/api/cron/daily` into effect would schedule a broken job.
  - `needs-owner: platform` (config) + `backend` (route).
  - Not fixed: production routing change.
- **P-H3 · `/api/orchestrate` GET auth can be bypassed.**
  - Location: `app/api/orchestrate/route.ts` GET at the time of reading. `request.nextUrl.pathname === '/api/orchestrate'` is always true, so anyone can start AI pipeline runs (cost and abuse risk). The user-agent check is also spoofable.
  - The working tree shows the backend agent adding a `CRON_SECRET`-based helper in `lib/auth.ts`, so this may already be in progress. Verify.
  - Fix: require `Authorization: Bearer ${CRON_SECRET}` or `x-api-key`, then set `CRON_SECRET` in Vercel.
  - `needs-owner: backend`.
- **P-H4 · Hard-coded Vapi API key fallback.**
  - Location: `lib/voice/vapi.ts:15-17`.
  - Fix: remove the fallbacks (throw if unset) and rotate the key.
  - `needs-owner: ai-voice`.
- **P-H5 · No Content-Security-Policy.**
  - Fix: ship it as **Report-Only** first via a `headers()` entry in `next.config.mjs`, collect violations for 1–2 weeks (Thinkrr's runtime origins are unknown), then enforce. Proposed starting policy:

    ```
    Content-Security-Policy-Report-Only:
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.segment.com
                 https://vercel.live https://d2cqc7yqzf8c8f.cloudfront.net https://app.salescloser.ai
                 https://link.msgsndr.com https://connect.facebook.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' data: https://fonts.gstatic.com;
      img-src 'self' data: blob: https:;
      media-src 'self' data: blob: https:;
      connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com
                  https://*.google-analytics.com https://api.segment.io https://cdn.segment.com
                  https://vercel.live wss://*.pusher.com https://*.cloudfront.net https://app.salescloser.ai wss:;
      frame-src 'self' https://app.salescloser.ai https://api.leadconnectorhq.com https://vercel.live;
      worker-src 'self' blob:;
      frame-ancestors 'self'; base-uri 'self'; object-src 'none';
      form-action 'self' https://api.leadconnectorhq.com;
      upgrade-insecure-requests;
      report-uri /api/csp-report
    ```

    Vercel Analytics loads from same-origin `/_vercel/insights/*`, so it is covered by `'self'`. `'unsafe-inline'` is needed for the GA/Segment snippets and Next's inline bootstrap until nonces are added through middleware. The `/api/csp-report` endpoint doesn't exist yet: either add a tiny route that logs and returns 204 (`backend`), or use a reporting service.
  - `needs-owner: platform` + `backend` (report endpoint).
  - Not fixed: the brief said to prefer non-CSP headers, and an untested CSP risks breaking the voice widgets.
- **P-H6 · jsPDF 3.0.1 advisories.**
  - Client-side use only, so this is high rather than critical.
  - Fix: upgrade to 4.2.1 and re-test every PDF export.
  - `needs-owner: platform` + `calc-*` for testing.
- **P-H7 · Typecheck is currently blocked by a syntax error in a concurrently-edited file.**
  - Location: `app/(site)/calculators/amortization/page.tsx:56`.
  - This would fail `next build`.
  - `needs-owner: calc-*`.
- **P-H8 · Committing the current lender data would break the production build.**
  - Location: `apps/web/data/canadianLendersData.ts`, which has 65 `isDormant` type errors in the uncommitted copy.
  - Fix: resolve the type errors before committing. A temporary `typescript.ignoreBuildErrors` is **not** recommended.
  - `needs-owner:` user (data file; off-limits for this audit).

### Medium

- **P-M1 · OpenRouter env naming split.**
  - `OPENROUTER_API_KEY` vs `OPEN_ROUTER_API_KEY`: `lib/ai/llm.ts` and `lib/ai/providers/openrouter.ts` read only the latter.
  - Fix: read both, or standardise on one.
  - `needs-owner: ai-voice`.
- **P-M2 · Localhost defaults in production code paths.**
  - `NEXTAUTH_URL` → `http://localhost:3000` for the Twilio callback (`app/api/voice/twilio/outbound`).
  - `FASTAPI_BASE_URL` → `http://localhost:8000` (`app/api/cron/pull-rates`, `app/api/documents`).
  - Fix: derive the base URL from `NEXT_PUBLIC_SITE_URL`/`VERCEL_URL`, and return 503 when FastAPI isn't configured.
  - `needs-owner: backend`.
- **P-M3 · The `mli-proxy` route reads files outside its folder.**
  - Location: `app/mli-proxy/[...path]/route.ts`.
  - It joins raw path segments onto `process.cwd()/public/mli-select` without normalising or checking that the result stays inside that folder (potential path traversal through encoded `..`; not probed against prod).
  - On error it recursively calls itself with `['index.html']`, which can loop.
  - It duplicates content already served from `public/`.
  - Fix: delete the route if the static microsite is retired (P-M5). Otherwise add `path.resolve` plus a prefix check and a recursion guard.
  - `needs-owner: backend`.
- **P-M4 · 172 lint errors hidden by `ignoreDuringBuilds`** (§3).
  - `needs-owner: frontend-seo` (159), `calc-*` (5 errors + 3 hook warnings), `ai-voice` (4 + 2), `backend` (4).
- **P-M5 · Duplicate MLI microsite** (§1.2 #5).
  - Fix: decide whether `mli-select-complete` is still needed. If not, remove it from the build and workspace, untrack `apps/web/public/mli-select` and `apps/public`, and delete `mli-proxy`. That saves ~27 s per deploy and removes duplicate URLs. If it stays, at least `git rm --cached` the generated output and add it to `.gitignore`.
  - `needs-owner: platform` + `frontend-seo` (SEO duplicate/canonical).
- **P-M6 · 10 MB lender data module** (§5.2).
  - Fix: convert to JSON loaded lazily (`await import()` or `fs.readFile` in the two routes), or move it to Vercel Blob / Edge Config / Firestore. That cuts cold starts and type-check cost.
  - `needs-owner: backend` + user.
- **P-M7 · Unused and deprecated dependencies** (§2.3), including deprecated `tavily` and `react-use-gesture`.
  - `needs-owner: platform`.
  - Not fixed: no dependency removals allowed.
- **P-M8 · Phantom dependencies.**
  - `html2canvas` and `@hubspot/api-client` are used in `apps/web` but declared only at the root.
  - `needs-owner: platform`.
- **P-M9 · Build-time `DYNAMIC_SERVER_USAGE` errors.**
  - Location: `/api/criteria`, `/api/check-admin`.
  - Fix: add `export const dynamic = 'force-dynamic'`.
  - `needs-owner: backend`.
- **P-M10 · Env var names in Vercel may not match the code.**
  - Specifically `CREWAI_SECRET` vs `CREWAPI_SECRET`, and `NEXT_PUBLIC_META_PIXEL_ID` vs `META_PIXEL_ID`, which the old root example had wrong.
  - Fix: owner checks Vercel → Environment Variables against §4.
  - `needs-owner: platform` (user).
- **P-M11 · Prisma client is never generated in the build.**
  - Setting `DATABASE_URL` would crash every route that `require`s it.
  - Fix: either add `prisma generate` to the build or drop the Prisma path. The seed script paths are also wrong.
  - `needs-owner: backend`.

### Low

- **P-L1** · Root `next.config.js` unused. Root `next@14.2.5` only drives Vercel's "Detected Next.js version". Clean up with §1.4. `platform`.
- **P-L2** · `mli:export` runs twice per build. Drop the trailing `&& pnpm --filter @kraft/web mli:export` from the root `build` script once the deploy pipeline is being touched anyway. `platform`.
- **P-L3** · `apps/web/.npmrc` is a no-op. Delete it, or move the pnpm settings to the root `.npmrc`. `platform`.
- **P-L4** · Stray files (§5.3). `platform`.
- **P-L5** · No `engines.node`. Add `"engines": { "node": "22.x" }` to the root `package.json` when changing the deploy config (it matches the current Vercel setting). Local dev runs Node 24. `platform`.
- **P-L6** · `infra/docker-compose.yml` is unused and uses unpinned `localstack:latest`. `platform`.
- **P-L7** · Cron runs at 09:05 UTC. Confirm the intended local time. `backend`.
- **P-L8** · Outdated caniuse-lite (build warning). `platform`.
- **P-L9** · `HUBSPOT_API_KEY` legacy auth. HubSpot retired API keys, so use a private-app token only. `backend`.
- **P-L10** · 27 MB of social graphics and 1–1.6 MB blog PNGs in git. Move them to LFS/Drive and convert to WebP/AVIF. `frontend-seo`.

---

## 8. Testing and CI proposal

### 8.1 Minimal test stack (no deps added in this pass)

- **Unit: Vitest** (`vitest`, `@vitest/coverage-v8`) in `apps/web`, `environment: 'node'`. Uses the same `@/*` alias as `tsconfig` (`vite-tsconfig-paths` or `resolve.alias`). Targets, in priority order:
  1. `lib/calc/*.ts`: `payment`, `affordability`, `cmhc`, `landTransferTax`, `mli`, `investment`, `construction`, `selfEmployed`. Golden-value tests with **Canadian semi-annual compounding**, CMHC premium tiers, the OSFI stress-test floor (max(contract + 2%, 5.25%)), BC/ON land transfer tax brackets and first-time-buyer exemptions. Cite the rule source in each test name.
  2. `mli-select-complete/src/lib/calcs.ts`, either via its own small Vitest config or by importing it from `apps/web` tests.
  3. Validation and formatting utilities (`components/ui/ValidatedInput.tsx` helpers, currency formatters).
  4. Pure helpers in `lib/ai/tools/*` (calculator tool wrappers return the same numbers as `lib/calc`, which guards against drift between the chat assistant and the calculators).
- **E2E smoke: Playwright** (`@playwright/test`), Chromium only, ~10 tests:
  - `/` renders, and nav and footer are present.
  - Every `/calculators/*` route returns 200, renders the result panel, and typing one input changes the output.
  - `/sitemap.xml` and `/robots.txt` return 200.
  - Security headers from F1 are present.
  - The chat widget opens and sends a message (with the AI route mocked through `page.route`).
  - Lead form client-side validation (no submit).
  - Run against `pnpm build && pnpm start` in CI, or against the Vercel preview URL on the `deployment_status` event.
- **Scripts:** `"test": "vitest run"`, `"test:watch": "vitest"`, `"e2e": "playwright test"`.
- **Gitignore:** `playwright-report/`, `test-results/` and `/coverage` are already added (F4).

### 8.2 CI (current, after F7)

`.github/workflows/ci.yml` runs `typecheck` (blocking), `lint` (non-blocking for now) and `build` (after typecheck). Next steps:
1. Fix the lint errors, then remove `continue-on-error`.
2. Add a `test` job (`pnpm --filter @kraft/web test`) once Vitest lands.
3. Add an `e2e` job on `deployment_status` (preview URL), with Vercel deployment protection bypass via `VERCEL_AUTOMATION_BYPASS_SECRET`.
4. Add a `gitleaks/gitleaks-action` secret scan.
5. Add `pnpm audit --prod --audit-level=high` (non-blocking at first).
6. Add Dependabot or Renovate for weekly grouped updates (`next` + `eslint-config-next` + `@next/mdx` as one group).
7. If the `build` job fails in CI for lack of env vars, provide a dummy `.env` in CI or gate the job on `secrets`.

---

## 9. Feature opportunities (platform)

| ID | Opportunity | Why | Priority / effort |
| --- | --- | --- | --- |
| P-F1 | **Error tracking + observability:** Sentry `@sentry/nextjs` (or Vercel Observability + a log drain), structured logging for API routes, alerting on `/api/chat`, lead and webhook failures | Errors are currently only `console.error`. Lead-loss bugs are invisible | P1 / S–M |
| P-F2 | **Uptime and cron monitoring:** ping `/api/healthz` (exists) from Better Stack / Checkly; check-in monitors for the cron | Cron failures and outages go unnoticed | P1 / S |
| P-F3 | **Rates caching / ISR:** wrap the `/api/rates` and `/api/criteria` remote fetches in `unstable_cache`/`fetch(..., { next: { revalidate, tags } })`, with on-demand `revalidateTag` from a rates-update hook | Faster pages, fewer origin hits on blog.kraftmortgages.ca, consistent rates across chat and pages | P1 / S |
| P-F4 | **Move lender data out of the bundle** (Blob / Edge Config / Firestore, or a lazily-loaded JSON) | 10 MB TS module → 7 MB server chunk. Cold starts, tsc time, git diffs | P2 / M |
| P-F5 | **Rate limiting and bot protection** for `/api/chat`, `/api/voice/*`, `/api/lead`, `/api/contact` (Vercel WAF rate-limit rules or Upstash Ratelimit; Vercel BotID on lead forms) | AI and voice endpoints cost money per call. Lead spam | P1 / S–M |
| P-F6 | **Feature flags** (Vercel Flags SDK / Edge Config) for voice widgets, AI provider routing and experimental calculators | Toggle a broken third-party widget without a redeploy | P2 / S |
| P-F7 | **Image optimisation:** convert `public/images/blog-*.png` to WebP/AVIF and render blog heroes with `next/image` | 0.7–1.6 MB hero images hurt LCP | P1 / S |
| P-F8 | **Vercel Speed Insights** (`@vercel/speed-insights`) next to the existing `@vercel/analytics` | Real-user Core Web Vitals per route | P2 / S |
| P-F9 | **Preview environments with env parity:** make sure the Preview env vars exist (Firebase, AI keys with low quotas), run Playwright against each preview | Catch breakage before production | P2 / S |
| P-F10 | **Secret management:** move every key to Vercel env (or a vault), use `${VAR}` expansion in `.mcp.json`, add gitleaks to CI and a pre-commit hook | Prevent a repeat of P-C1 | P0 / S |
| P-F11 | **Single deploy config + pnpm-only pipeline** (§1.4) | Reproducible builds; removes dead config | P0 / S |
| P-F12 | **Bundle analysis** (`@next/bundle-analyzer`) on demand | Watch client bundle growth (framer-motion in 89 files, recharts) | P3 / S |

---

## 10. Notes for the next agent

- **Ground truth for deploy questions is the Vercel build log, not the config files.** Use the Vercel MCP: `list_deployment_events` on the latest production deployment. Root Directory is `.`, the root `vercel.json` is the one in effect, prod installs with **npm**, and `apps/web/vercel.json` does nothing.
- **Don't trust `package-lock.json`.** It has drifted. `pnpm-lock.yaml` is the maintained lockfile, and it matched every `package.json` on 2026-10-12.
- **Committed secrets (P-C1) are the top item.** Don't quote the values anywhere: logs, DEVLOG or commits.
- The security headers live in `apps/web/next.config.mjs` (`securityHeaders`). If a third-party embed breaks:
  - `X-Frame-Options` only stops *others* framing our pages, so it is the likely culprit only if some external site (e.g. a GoHighLevel funnel or the WordPress blog) iframes kraftmortgages.ca pages.
  - Mic access was intentionally not restricted.
- `next build` type-checks, so a type error anywhere fails the production deploy. Lint does not.
- The type-check snapshot in this report was taken while other agents were mid-edit. Re-run `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` after all agents finish. Expect the 65 `isDormant` errors in the user's uncommitted data file, plus whatever `amortization/page.tsx:56` looks like by then.
- Both `.env.example` files are now the full inventory. `apps/web/.env.example` is canonical and the root copy is a mirror. When adding a `process.env.X`, add it to both. A quick check:

  ```bash
  cd apps/web && grep -rhoE "process\.env\.[A-Z0-9_]+" --include=*.ts --include=*.tsx --exclude-dir=node_modules --exclude-dir=.next . | sed 's/process\.env\.//' | sort -u
  ```

- The upgrade order in §2.4 matters. Do step 1 (one package manager) before any version bumps. Otherwise Vercel will keep resolving its own tree from the stale npm lockfile.
