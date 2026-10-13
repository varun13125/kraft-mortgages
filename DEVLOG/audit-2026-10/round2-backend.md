# Round 2: backend / API / data / security fixes (2026-10-13)

**Agent:** backend (Claude Code, Opus 5.5), one of 5 parallel round-2 agents. **Branch:** `audit/2026-10-fixes`. Nothing is committed.
**Shared DEVLOG files** (`FINDINGS.md`, `STATUS.md`, `SESSIONS.md`) were **not edited**, to avoid clobbering the other agents. The orchestrator should copy the statuses below into them.

## Verification summary

- **Type check:** full project `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` gives **0 errors** (run twice, the second after the last edit).
- **Lint:** `next lint --file …` over all 28 TS/TSX files I touched gives **0 warnings, 0 errors**.
- **Node tests.** These are throwaway scripts, kept in the session scratchpad and not in the repo. They transpile the real TS modules with the repo's `typescript`, stub only the integrations (fetch, Vapi/Thinkrr, Firestore), and make no network calls or prod writes. Results:
  - **sanitizer** (`lib/security/sanitizeHtml.ts`): **103/103** pass.
    - 35 XSS payloads are checked **after the blog page's own `processPostContent()`**, which is what the browser actually receives.
    - Expected-output checks.
    - All 17 seed posts: both the `getRecentPosts` copies (html + markdown) and the longer `getPost` bodies.
  - **Firestore layer** (`lib/db/firestore.ts` against a fake Firestore): **6/6** pass.
  - **routes:** contact / lead / business-funding / facebook / csp-report / healthz: **24/24** pass.
  - **misc:** `lib/db.ts` fallback, republish, pipeline draft default, cron/daily base URL: **9/9** pass.
- **Line endings:** preserved. CRLF files stayed CRLF (`ingest`, `publish.ts`, `republish`, `facebook`, `dashboard`, `login`, `api.ts`, `firebase*.ts`, `db.ts`, `healthz`, admin pages); LF files stayed LF. New files are LF.
- **`apps/web/data/`:** not touched. No secrets were printed.

---

## Per task

### 1. BUG-016: stored XSS in blog posts. Status: **fixed** (2 frontend follow-ups are listed under needs-owner)

**New file: `lib/security/sanitizeHtml.ts`.** It exports `sanitizeBlogHtml(input, {allowInlineStyles?})` and uses `sanitize-html` 2.18.

**Allowlist:**
- **Tags:** h1–h6, p, br, hr, div/span/article/section/figure/figcaption, ul/ol/li/dl/dt/dd, a, img, the table family, blockquote/q/cite, code/pre/kbd/samp, and inline emphasis.
- **Attributes:**
  - per tag only;
  - no `on*` handlers;
  - no `class` or `id` (Tailwind overlay and DOM clobbering risks).
- **URL schemes:**
  - links: http, https, mailto, tel, or relative;
  - images: http, https, or relative.
  - `javascript:`, `data:` and `vbscript:` are removed.
- **Links:** `target=_blank` always gets `rel="noopener noreferrer"`. Any other target is dropped.
- **Removed entirely, including content:** script, style, iframe, object, embed, svg, math, forms, meta, and base.

**Deviation from the brief (inline `style`).** I kept `style`, but filtered it through a property/value allowlist instead of stripping it.
- **Why:** the 17 seed posts (and the Marblism imports they came from) carry about 400 inline styles. Those styles are the callout boxes, comparison tables and CTA buttons, so a blanket strip would visibly break live posts.
- **Allowed:** colours, gradients, non-negative spacing, borders, font size/weight, text-align, and simple display/flex/grid.
- **Not allowed:** position, z-index, transforms, negative margins, `url()`, `expression()`, background images.
- **Effect on seed posts:** across all of them, the only declaration dropped is `space-y:0.5rem`, which isn't valid CSS anyway.
- **To strip all styles instead:** call `sanitizeBlogHtml(x, { allowInlineStyles: false })`.

**Hardening against the page's post-processing** (`lib/utils/blog-content.ts`, owned by frontend):
- **The problem:** `app/blog/[slug]/page.tsx` runs `processPostContent()` *after* our sanitizer. That function:
  - decodes `&quot;`, `&#8220;` → `"`;
  - deletes `[IMAGE:…]` markers;
  - rebuilds a markdown tail into `<a href="${url}">`.
- **Proof it is exploitable:** a control test shows that stock `sanitize-html` followed by this pipeline still yields `onmouseover` / `onerror` attributes (via `quoteEntityInAttr` and `imagePlaceholderSpan`).
- **What the sanitizer now does about it:**
  - attribute values never contain `"` (URLs become `%22`; other attributes get a typographic quote);
  - `&amp;#` is emitted as `&amp;&#x23;`;
  - `[IMAGE: …]` markers are removed up front, and any leftover `[IMAGE:` becomes `[IMAGE&#58;`;
  - the ingest "Related Resources" / CTA markdown tail is converted to HTML here, with a strict URL check;
  - the output always ends with an empty `<span></span>`, so the page's own tail conversion never runs.

**Where it is applied:**
- **(a) On write:**
  - `app/api/blog/ingest/route.ts:227-228` sanitizes html and markdown. It also caps the categories and author fields.
  - `lib/pipeline/stages/publish.ts:55` sanitizes the LLM HTML before both WordPress and Firestore.
  - `lib/db/firestore.ts` `savePost` (`:358`) is the chokepoint that also covers `scripts/`.
- **(b) On read:** `lib/db/firestore.ts` `sanitizePostData()` (`:339`) is used by:
  - `getPost` (`:414`);
  - `getRecentPosts` (`:3255`);
  - `listFirestorePosts`.
- **What `sanitizePostData()` does:**
  - **HTML fields** (`html`, `markdown`, `content`) go through `sanitizeBlogHtml`.
  - **Every other string field** (title, metaDescription, seo\*, author, keywords, categories…) has markup stripped and stray `<` and `>` replaced with `‹` and `›`. These fields end up inside the page's JSON-LD `<script>`, where `</script>` in a title would break out.
  - **Results are cached** with a SHA-1-keyed memo (cost is about 0.2 ms/KB, and `/blog` reads every post per request).
  - **Seed posts are not touched:** the hard-coded ones are source code and stay unchanged.

**Extra fix:** `getPost` used `data.publishedAt?.toDate()`. A string or Date value threw, and the catch block then 404'd a valid post. It now uses `toDateSafe` (`firestore.ts:417`).

**Verification:**
- 35 payloads covered: `<img onerror>`, `<script>`, `javascript:` (mixed case, entity, leading space), `data:`, `vbscript:`, svg/math/iframe/object/form/details, CSS overlay/`url()`/`expression`/negative margin, `class`/`id`, meta refresh, base, noscript and comment mutation tricks, plus the 9 post-processing attacks above. All have **0 policy violations** when the final HTML is re-parsed after `processPostContent()`.
- All 17 seed posts keep an identical tag sequence, attributes (except the added `rel`) and text.

### 2. BUG-022: hard-coded CRM webhooks. Status: **fixed** (with an owner rollout order)

- **New file: `lib/crm/webhooks.ts`.** It provides `twentyWebhookUrl()` (`TWENTY_WEBHOOK_URL`), `ghlWebhookUrl()` (`GHL_WEBHOOK_URL`) and `crmWebhookHeaders()`.
  - The defaults are exactly the previously hard-coded URLs.
  - An override must be a valid `https:` URL, otherwise the default is used and an error is logged.
  - When `CRM_WEBHOOK_SECRET` is set, it is sent as the `X-Webhook-Secret` header.
- **Routes using it:**
  - `app/api/contact/route.ts:61`
  - `app/api/webhooks/facebook/route.ts:152`
  - `app/api/business-funding/route.ts:61`
- **Other changes in the same calls:**
  - 15 s timeout (contact falls back to the Firestore backup and Discord);
  - error bodies truncated to 200 characters;
  - no full error objects in logs.
- **Behaviour change:** `/api/contact` now honours `TWENTY_WEBHOOK_URL`. Before, only the Facebook route did. If that var is set in Vercel to anything other than the contact-form webhook, contact leads go there too.
- **Verified by tests:**
  - default URL used;
  - override used;
  - non-https override rejected;
  - header present only when the secret is set.

### 3. BUG-024: duplicate Facebook leads. Status: **fixed**

- **Dedupe:** `app/api/webhooks/facebook/route.ts:36` `claimLead()` does an atomic `firestore().collection('fbLeads').doc(leadgen_id).create()`. It runs after the Graph fetch succeeds and **before** any CRM write, Discord alert or call.
- **Outcomes:**
  - **duplicate** (`ALREADY_EXISTS`, code 6): skipped, and the response is still **200** with `{duplicates:n}`;
  - **Firestore unavailable, or the 5 s timeout hit:** the lead is processed anyway and the failure is logged.
- **Marker document:** `{formId, pageId, signatureVerified, receivedAt}`, with no PII. After processing, `markLeadProcessed()` adds `{crmForwarded, discordSent, callTriggered, callConsent, processedAt}`.
- **Other changes:** `sendToTwenty` and `sendDiscordNotification` now return booleans, and `callTriggered` uses Thinkrr's real return value.
- **Verified by tests:**
  - a second delivery of the same id makes no second CRM write and no second call;
  - with the dedupe store down the lead is still forwarded;
  - a bad signature returns 401 with nothing forwarded.

### 4. BUG-018: AI posts published with no human review. Status: **fixed** (default changed to draft)

- **Flag:** `lib/pipeline/stages/publish.ts:21` `aiAutoPublishEnabled()` is true only when `AI_AUTO_PUBLISH === 'true'`.
- **Firestore:** posts are saved with `status: 'draft'` by default (`:108`). Drafts are already hidden from the public blog.
- **WordPress:** gets `status: 'draft'` unless the flag is set (`:86`).
- **Logging:** `PublishData.status` is returned, and the run log says "Saved as DRAFT … for human review".
- **Approval path** (so drafts don't dead-end):
  - **New route `GET /api/posts`** (`app/api/posts/route.ts`): admin-only. It lists Firestore posts including drafts, via `listFirestorePosts`.
  - **Dashboard Posts tab:** now loads that list and shows **Publish** for drafts.
  - **`POST /api/publish/republish`** (see task 5) marks the Firestore post `published`, setting `publishedAt` to the approval time for drafts.
  - **Active-run card:** says "Draft saved for review".
- **Verified by tests:** default is draft; `AI_AUTO_PUBLISH=true` gives published; the WordPress status is draft or publish accordingly; the HTML is sanitized.

### 5. BUG-023 (partial): dashboard dead buttons and republish duplicates. Status: **partially fixed**

**`app/dashboard/page.tsx`:**
- Removed the **Make Admin** button and its function (called `/api/make-admin`), and the **Debug Run** button (called `/api/test-run-creation`). Neither route exists.
- Kept Check Admin and Manual Orchestrate.
- The SSE URL is always same-origin `/api/runs/{id}/stream` (`:144`, see BUG-050).
- The strategy tab now reads `GET /api/strategy/weekly`, the real saved strategy (`:93`). Before, it showed the static `/strategy/latest` sample as if it were live.
- It handles Firebase being unconfigured (`:257`).

**`app/api/publish/republish/route.ts`** (rewritten):
- `findWordPressPostId()` (`:31`) runs `GET /wp-json/wp/v2/posts?slug=…&status=any&context=edit` with Basic auth.
- If found, it `POST`s to `/posts/{id}` (an update). If not found, it `POST`s to `/posts` (a create).
- **If the lookup itself fails, it throws, so no duplicate is created.** The route then falls back to "firestore".
- The content is re-sanitized before it leaves our domain.
- It persists `updatePostMeta(slug, {status:'published', publishedAt (drafts only), republishedAt, republishedBy, republishMethod, wpPostId, wpUrl})` (`:139`).
- **New `lib/db/firestore.ts` `updatePostMeta()`** (`:373`) uses `.update()` on an existing document only. Creating a stub document would shadow a hard-coded seed post with the same slug.

**Still open (BUG-023 remainder):**
- `/api/run`'s fire-and-forget `fetch` (may not run on Vercel);
- cron executes stage 1 only;
- the SSE stream polls for 10 min and puts the ID token in the query string;
- the runs list is still a placeholder.

**Verified by tests:**
- an existing WP post is updated (no POST to `/posts`);
- a missing post is created;
- a lookup failure makes no create;
- with no WP config, a Firestore-only approval happens;
- the metadata patch is persisted.

### 6. BUG-034: Prisma crash when `DATABASE_URL` is set. Status: **fixed** (one AI-owned caller left)

- **`lib/db.ts` (rewritten):**
  - `loadPrismaClient()` builds a `PrismaClient` only if `DATABASE_URL` is set, and catches any require or constructor failure. The real failure is "did not initialize yet – run prisma generate", confirmed locally.
  - On failure it logs **once** and falls back to Firestore.
  - The result is cached on `global`.
  - **New `isPrismaEnabled()`.**
  - `prisma` is now a lazy Proxy: Prisma when enabled, Firestore otherwise. Importing the module no longer initialises any DB client.
- **Callers switched** from `process.env.DATABASE_URL` to `isPrismaEnabled()`:
  - `(site)/admin/page.tsx`, `admin/analytics/page.tsx`, `admin/rates/page.tsx`
  - `api/automations/nurture`, `api/cron/pull-rates`, `api/cron/reports/daily`
  - `api/lead`, `api/business-funding`
- **Verified by tests:** with `DATABASE_URL` set and the client not generated, there is no crash, exactly one log line, and Firestore is used.
- **Not switched:** `app/api/voice/twilio/recording/route.ts` (AI-owned). See needs-owner.

### 7. BUG-050: config hygiene. Status: **fixed** for (a)–(d)

- **(a) Crew host vs dashboard API base:**
  - **`lib/api.ts:8`:** the base is hard-coded same-origin `/api`. The dashboard SSE URL is the same.
  - **Why:** both carry the admin's Firebase ID token, so they must never use the external crew host.
  - **`app/api/cron/daily/route.ts:13-22`:** uses a new **server-only `CREWAPI_BASE_URL`**. Fallback order:
    1. `CREWAPI_BASE_URL`;
    2. the legacy `NEXT_PUBLIC_CREWAPI_BASE_URL`, unless it points at `/api` (that value was for the dashboard, and `/api/run` rejects x-api-key);
    3. `/crewapi`.
  - That cron sends only `x-api-key: CREWAPI_SECRET`.
  - **Verified by tests:** all 4 resolution cases.
- **(b) Dummy Firebase config removed:**
  - **`lib/firebase.client.ts`:**
    - the `dummy-project` fallback is gone;
    - it exports `firebaseConfigured` and `app: FirebaseApp | null`;
    - it logs one `console.error` when the config is missing;
    - **it no longer initialises the Firestore client SDK.** No browser code reads Firestore, which also matches the deny-all rules.
  - **`lib/firebase.ts`** (unused file): same pattern, with nullable exports.
  - **`app/(auth)/login/page.tsx`:** shows "Sign-in is unavailable…".
  - **dashboard:** shows "Dashboard unavailable…".
  - **`lib/api.ts`:** sends no auth when the app is null.
  - Pages that don't need Firebase are unaffected.
- **(c) Developer paths removed:** `lib/rates.ts:147` dropped the Windows `C:\Users\…\Hermes Agent` path, the three `../Hermes Agent` relatives and `/root/kraft-ops`. It keeps `RATES_DATA_PATH`, `data/current_rates.json` and `apps/web/data/current_rates.json`.
  - **Local-dev impact:** to read the Hermes Agent output directly, set `RATES_DATA_PATH`.
- **(d) Deep health check:** `app/api/healthz/route.ts`.
  - **Shallow `{ok:true}`** is unchanged and public. The route is now `force-dynamic`.
  - **`?deep=1`** requires `verifyCronRequest`, without the user-agent fallback, or an admin token. Without auth it returns 401.
  - It checks Firestore with a 5 s single read of `_healthz/ping`: `ok`, `error` (returns 503) or `not_configured`.
  - It returns about 30 **booleans only** for configured integrations.
  - **Verified by tests:** 401 without auth; with auth there are no env values in the body and every integration value is a boolean.

### 8. BUG-011 (part): CSP report endpoint. Status: **done** (the orchestrator adds the Report-Only header)

- **New file: `app/api/csp-report/route.ts`.**
- **Accepts:**
  - `application/csp-report` (`{"csp-report":{…}}`);
  - `application/reports+json` (an array of `{type:"csp-violation", body}`);
  - plain `application/json`.
- **Body cap:** 16 KB, enforced by both content-length and a streamed read. Over the cap returns **413**.
- **Rate limit:** 60 per minute per IP via `requestGuards.rateLimit`, otherwise **429**.
- **Logging:** at most 10 reports per request, each as one line: `[csp] <disposition> directive=<d> blocked=<origin | keyword> doc=<path>`.
  - Control characters are stripped and values capped.
  - No query strings, fragments or other PII.
- **Response:** always **204** otherwise.
- **Header config for the orchestrator:** `report-uri /api/csp-report` (plus `report-to` if a `Reporting-Endpoints` header is added).
- **Verified by tests:** both formats; query-string stripping; 413; junk input; newline-injection attempt; 429.

### 9. BUG-004: Firestore security rules. Status: **ready to deploy** (owner)

- **New root `firestore.rules`:** `match /{document=**} { allow read, write: if false; }`, with an explanatory header.
- **New root `firebase.json`:** `{"firestore":{"rules":"firestore.rules"}}`.
- **Client usage audit:**
  - The only client-side Firebase code is `/login` and `/dashboard` (via `lib/firebase.client.ts`), and they use **Auth only**.
  - Nothing imported the client `db` export, which is now removed.
  - All other `firestore()` users are server-side Admin SDK code, which bypasses rules: routes, server components, `lib/db/firestore.ts`, and `lib/ai/tools/rate-tools.ts`.
  - **So deny-all breaks nothing in this repo.**
- **Collections in use:** leads, posts, runs, admins, strategy, users, rateSnapshots, kpiDaily, fbLeads, \_healthz.
- **Breakage risk:** only for *external* tools (n8n, Hermes, crew) that might use the public web API key instead of a service account.

### 10. BUG-005: consent capture and AI-call gating. Status: **backend done** (orchestrator add-on, owner decision 2026-10-13)

**New file: `lib/compliance/consentRecord.ts`.** It is server-only and kept separate from the client-imported `consent.ts`, whose exports are unchanged.
- **`consentInputShape`** (zod): optional `consentToContact`, `consentToCall`, `consentToMarketing` and `consentVersion` (≤40 characters, `[A-Za-z0-9._:-]`).
  - A malformed value becomes `false` or `''`. **It never rejects the lead** and never produces `undefined`, which Firestore would reject.
- **`buildConsentRecord(input, req, source)`** returns `{consentToContact, consentToCall (true only if === true), consentToMarketing, consentVersion|null, consentCapturedAt (server ISO time), consentIp (getClientIp), consentSource}`.
- **`consentRecordToStrings()`** produces the same record as strings for webhook payloads.

**`/api/contact`:**
- **Vapi dials only when `consentToCall === true`** (`:242`). The per-phone dial rate limit is not consumed otherwise.
- **Twenty payload:** carries the consent strings and `dispatchMode: "none"` for no-consent leads (`:207`). Consented leads keep `queue` / `live_dial`.
- **Firestore backup:** stores a `consent` object.
- **Discord:** shows "No AI-call consent — manual follow-up".
- **Response:** includes `callConsent`. The message never mentions Julia or a call without consent.
- **Logs:** `call_skipped: no_consent`.

**`/api/lead`** and **`/api/business-funding`:**
- They accept the same fields and store the record:
  - lead: top-level `consent` plus `details.consent`;
  - business funding: `details.consent`, plus the consent strings in the GHL payload.
- No calls are placed there.
- **Confirmed:** `components/home/LeadModal.tsx` → `/api/lead` and `(site)/business-funding/page.tsx` → `/api/business-funding` both send `consentFields()`, and both routes now persist them (covered by tests).

**`/api/webhooks/facebook`:**
- **Consent detection:** `detectCallConsent()` (`:90`) treats any `field_data` entry whose **name contains "consent", "call" or "agree"** (case-insensitive) with an answer matching `^(yes|true|i agree)\b` as consent.
  - It also accepts a **custom-disclaimer checkbox** whose key contains "call" and is ticked. The Graph fetch now requests `fields=id,created_time,field_data,custom_disclaimer_responses`, retrying with the default fields on a 400 so the lead is never lost.
  - **A call is placed only if** the payload is signature-verified, consent was given, **and the server-side calling-hours gate is open.** That gate is the same `getCallingHoursStatus()` as `/api/contact` (`:244`) and fails closed.
- **Otherwise** the lead is forwarded to the CRM and Discord and logged as `call_skipped: no_consent | after_hours | unverified_payload | no_phone`.
- **CRM payload:** gets `consentToContact/consentToCall/consentEvidence/consentCapturedAt/consentSource`. No-consent leads also get `dispatchMode:"none"`. Consented leads keep the old payload shape, so n8n doesn't place a second call.
- **Verified by tests:**
  - "Yes" places the call;
  - no question means no call, with the log line;
  - "No" and an unrelated "best_time_to_call: Morning" place no call;
  - "I agree" places the call;
  - consent outside calling hours means no call, `after_hours` logged, lead still forwarded.

---

## New env vars

| Name | Purpose | Default when unset |
| --- | --- | --- |
| `GHL_WEBHOOK_URL` | GoHighLevel inbound webhook for `/api/business-funding` (https only) | the previously hard-coded MPower GHL hook |
| `CRM_WEBHOOK_SECRET` | Shared secret sent as `X-Webhook-Secret` to the Twenty/n8n and GHL webhooks | unset, so no header is sent (behaviour unchanged) |
| `AI_AUTO_PUBLISH` | `"true"` = the AI pipeline publishes live (Firestore `published`, WP `publish`) | **drafts** (Firestore `draft`, WP `draft`) |
| `CREWAPI_BASE_URL` | Server-only external crew host for `/api/cron/daily` | the legacy `NEXT_PUBLIC_CREWAPI_BASE_URL`, unless it points at `/api`; else `/crewapi` (rewrite) |

**Changed meaning of existing vars:**
- `TWENTY_WEBHOOK_URL` is now also used by `/api/contact` (https only).
- `NEXT_PUBLIC_CREWAPI_BASE_URL` is **no longer used by the dashboard or `lib/api.ts`**, which always use `/api`. It is kept only as a cron fallback.
- `RATES_DATA_PATH` is now the only way to read a rates file outside the repo.

`.env.example` is owned by the orchestrator: please add the 4 vars above.

## Owner actions

1. **Deploy Firestore rules (BUG-004):** `firebase deploy --only firestore:rules --project <id>`.
   - First confirm that no external tool (n8n, Hermes, crew service) uses the Firebase *web* API key / client SDK. Service accounts are unaffected.
   - Also disable public email/password sign-up in Firebase Auth.
2. **Webhook secret rollout (BUG-022).** Order matters:
   1. Make the AI-owned `app/api/chat/route.ts` and `app/api/webhooks/thinkr/route.ts` also send the header (see needs-owner).
   2. Set `CRM_WEBHOOK_SECRET` in Vercel and deploy.
   3. **Only then** enable Header Auth (`X-Webhook-Secret`) on the n8n contact-form Webhook node and add a filter in the GHL workflow.
   - The reverse order sends leads to the Firestore/Discord fallbacks.
3. **Facebook Lead Ads (BUG-005):** to keep speed-to-lead AI calls, **add a consent question to every Lead Ad form.** Either:
   - a custom question whose field key contains `consent`, `call` or `agree` (e.g. `consent_to_ai_call`) with a "Yes" answer option; or
   - a custom-disclaimer checkbox whose key contains `call`.
   - **Without it, Facebook leads are forwarded but never called.**
4. **n8n (BUG-005):** make sure the contact-form workflow **does not queue or place an AI call** when `dispatchMode` is `"none"` or `consentToCall` is `"false"`.
5. **AI publishing (BUG-018):** decide whether to leave `AI_AUTO_PUBLISH` unset (recommended). Review drafts in `/dashboard` → Posts → **Publish**.
6. If the external crew service is used, set `CREWAPI_BASE_URL` (server-only).
7. After deploy, run: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.kraftmortgages.ca/api/healthz?deep=1"`.

## needs-owner (other areas)

- **frontend** (`app/blog/[slug]/page.tsx`, `lib/utils/blog-content.ts`):
  - (1) call `sanitizeBlogHtml()` (from `@/lib/security/sanitizeHtml`) **last**, after `processPostContent()`. That makes the sanitizer's post-processing hardening unnecessary.
  - (2) the JSON-LD `<script>` blocks use bare `JSON.stringify(...)`. Escape `<` (`.replace(/</g,'\\u003c')`) in a shared JSON-LD serializer site-wide. Firestore text fields are now stripped of `<`, but hard-coded or other sources aren't.
- **frontend:** `/api/contact` now returns `callConsent`. Qualify/contact UIs should show the "calling you now" state only when `callConsent && callDispatched`, and the after-hours copy only when `callConsent` (BUG-025 overlap).
- **ai-voice:**
  - `app/api/chat/route.ts:50` and `app/api/webhooks/thinkr/route.ts:8` still hard-code the Twenty/n8n URL with no secret header. Switch them to `twentyWebhookUrl()` + `crmWebhookHeaders()` from `@/lib/crm/webhooks` **before** n8n header auth is enabled.
  - `app/api/voice/twilio/recording/route.ts` still branches on `process.env.DATABASE_URL`. Use `isPrismaEnabled()` from `@/lib/db`, otherwise a set-but-ungenerated Prisma makes `prisma.lead` undefined there.
- **platform/orchestrator:**
  - add the 4 env vars to both `.env.example` files;
  - `sanitize-html` must be in the pnpm lockfile used by the `pnpm install --frozen-lockfile` deploy;
  - add the CSP `report-uri /api/csp-report`.
- **legal/owner (new finding):** the calling-hours gate (`lib/businessHours.ts`) uses **Pacific time only**: Mon–Fri 9:00–19:30 and Sat 10:00–16:30 PT.
  - For Ontario numbers that is up to 22:30 ET on weekdays and 19:30 ET on Saturdays.
  - The CRTC telemarketing windows (9:00–21:30 weekdays, 10:00–18:00 weekends) are in the **recipient's** local time.
  - **Suggested fix:** an area-code-aware gate (intersect the PT window with the recipient's local window). Not changed here because it alters the live dialling window and needs a legal sign-off.

## Notes for the next agent

- **Sanitizer:** `sanitizeBlogHtml()` is idempotent and returns `''` for empty input, which keeps the page's `post.html || post.markdown` fallback working. Any new place that renders post HTML must use it.
- **Plain text from Firestore:** strings are safe to put in JSON-LD only because `sanitizePostData()` strips `<` and `>`.
- **Firestore helpers added:** `sanitizePostData`, `updatePostMeta` (never creates documents), `listFirestorePosts`.
- **Lead routes:** use `consentInputShape` / `buildConsentRecord` from `lib/compliance/consentRecord.ts`. Auto-dial only on `consent.consentToCall === true` **and** `getCallingHoursStatus().isOpen`.
- **CRM webhooks:** go through `lib/crm/webhooks.ts`. Don't reintroduce literal URLs.
- **DB branching:** use `isPrismaEnabled()`, never `process.env.DATABASE_URL`.
- **Facebook webhook:**
  - it still returns 200 when the Graph fetch fails, so that lead is lost (pre-existing);
  - now that dedupe exists, returning 5xx so Facebook retries would be safe, but it changes the ACK contract, so that's left for a decision;
  - after-hours *consented* Facebook leads are not queued for a callback: manual follow-up via Discord. Decide whether n8n should queue them.
- **Blog ingest (`/api/blog/ingest`):** still publishes immediately unless the caller sends `status:'draft'`. CrewAPI and Marblism content is AI-written too, so BUG-018 arguably applies. That's an owner decision; `AI_AUTO_PUBLISH` currently gates only the internal pipeline.
- **Still open in my area:**
  - BUG-021 (hard-coded admin UID bypass in `isAdmin`);
  - the BUG-023 remainder (see task 5);
  - BUG-007 (rate limits are in-memory; `/api/csp-report` uses the same limiter).
- **Test scripts** were throwaway (session scratchpad, not committed). They use a ~40-line `require` hook that transpiles TS with the repo's `typescript` and maps `@/`. Port them into FEAT-006 (Vitest) when that lands, especially the 35 XSS payloads re-checked after `processPostContent()`.
