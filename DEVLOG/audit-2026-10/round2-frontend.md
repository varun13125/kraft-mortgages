# Round 2 — frontend-seo agent report (2026-10-13/14)

Scope: tasks assigned by the orchestrator (BUG-017, 046, 039, 040, 051, 038, 015, plus BUG-005 consent UI added mid-session) in the frontend-seo file set, with `/qualify` and `/mli` reassigned to this agent.
Nothing was committed. `apps/web/data/`, package.json, next.config and vercel.json were not touched. No files were deleted.

**Verification (end of session, 2026-10-14 ~00:15):**
- Full `tsc --noEmit --incremental false -p .`: **0 errors**. It covered the whole project, including other agents' in-progress files at that moment.
- `next lint` on every file I touched: **0 errors, 0 warnings**. That covers all 19 city folders, the blog, qualify, mli, contact, privacy, business-funding, about, rates, terms, varun, old-design, compliance-security, learn, provinces, not-found, Navigation, ProvinceSelect, ConsentCheckboxes, LeadModal, TodaysRates, sitemap, blog-content, useLiveRates and robots.
- Throwaway Node harnesses (kept in the session scratchpad, not in the repo):
  - `useLiveRates` dedupe/cache test: see BUG-051.
  - `processPostContent` unit run: see BUG-040.
  - Sitemap crawler (route exists, own canonical, not noindex, not redirected): see BUG-046.
- **No `next build` / `next dev` and no browser check.** See "Browser QA checklist" at the end.

Line endings: I preserved CRLF/LF per file. One gotcha: Git Bash `sed -i` silently converts CRLF to LF (use `sed -b -i`). It hit `Navigation.tsx` once, and I restored it to CRLF.

---

## BUG-017 · Footer on /qualify and /mli: fixed
- `app/(site)/qualify/page.tsx`: `<Footer />` now renders after `</main>`, below the whole funnel (form panel + rate cards + licence line). It is outside the multi-step panel, so the steps aren't affected.
- `app/(site)/mli/page.tsx`: this page had **no Navigation and no Footer** (a dead end with no licence numbers). Both are added, and the content is wrapped in `<main id="main-content">`. I also removed the pointless `export const dynamic = "force-dynamic"` (the page is fully static) and switched internal `<a>` to `<Link>`.
- `/old-design` and `/varun` (also listed in BUG-017) were not in this round's task. Both are noindex.
- Verified: tsc and lint.

## BUG-046 · Sitemap: fixed
`lib/seo/sitemap.ts`:
- **Added** the 7 MLI info pages: `/mli-select/{overview,benefits,scoring,eligibility,application-process,compare-programs,faq}`. I confirmed each one sets its own canonical.
- **Added** `/qualify` (canonical in `qualify/layout.tsx`).
- `/mli-select/calculators` and its 9 tools were already listed. Each now has its own canonical (confirmed).
- **Added** `/calculators/stress-test` as the canonical stress-test URL.
- **Removed** `/residential/calculators/stress-test`. `RESIDENTIAL_CALCULATORS` is now an empty typed array, with a comment explaining why.
- `/mli` is not listed (it canonicalises to `/mli-select`).
- Marked the unused `generateRobotsTxt()` `@deprecated` and dropped its `Disallow: /_next/*` line, which would block CSS/JS if anyone ever wired it up.
- Nothing I own links to `/residential/calculators/stress-test`. `lib/utils/blog-content.ts` now also remaps that URL to `/calculators/stress-test` when it appears in blog HTML.
- Verified with a sitemap crawler: 96 URLs, every route exists, and the sitemap includes stress-test, qualify and the MLI pages but not `/mli` or the residential stress-test URL. The crawler also exposed a **new high-severity issue** (needs-owner #1 below).
- At the time of writing, `next.config.mjs` still 308-redirects `/calculators/stress-test`. The orchestrator is removing that.

## BUG-039 · Province selection: fixed
- `components/ProvinceSelect.tsx`: rewritten to subscribe to just the store slices it needs. It takes optional `id`, `className` and `label` props, has visible focus styling, and uses `aria-label` "Select your province". The unused `Nav.tsx` still works with it.
- `components/Navigation.tsx`:
  - The compact selector sits in the desktop CTA group, before Apply Now (≥ lg).
  - The mobile drawer opens with a "Your province" row, using a real `<label for="mobile-province">`.
- New `components/SetProvince.tsx`: a client component that renders nothing and calls `setProvince(p)` on mount. All 19 `mortgage-broker-*/layout.tsx` files render `<SetProvince province="BC|AB|ON" />` next to `CityServiceJsonLd` (BC ×11, AB ×5, ON ×3). The city pages stay Server Components.
- Effect order: PrefSync (root layout) restores the saved province first, then the city's province wins. `setProvince` also persists the value to localStorage, so the visitor's next calculator shows that province's ComplianceBanner.
- Verified: tsc and lint. The ordering argument is React effect order (earlier sibling before later subtree). It has **not** been checked in a browser.

## BUG-040 · Blog images + ISR: fixed
- New `apps/web/scripts/optimize-blog-images.mjs` (uses sharp; no package.json change):
  - Default run converts new or changed `public/images/blog-*.{png,jpg,jpeg}` to `.webp` (quality 80, max width 1600, EXIF-rotated). Originals are kept.
  - `--force` re-encodes everything.
  - `--check` verifies that the code list matches the files on disk.
- Ran it on all 13 images: **10,584 KB → 1,014 KB (−90%)**. All sources are ≤1024 px wide, so nothing was resized. The 13 `.webp` files are new and untracked in `public/images/`.
- `lib/utils/blog-content.ts`:
  - Adds a static `BLOG_WEBP_AVAILABLE` set.
  - Adds `toWebpBlogImages()`, called from `normalizePostHtml()` after the `//images/` fix. It rewrites `<img src>` pointing at `/images/blog-*.png|jpg` (root-relative or own-domain absolute) to `.webp`, only for files in the set. Unknown files and other hosts are untouched.
  - `--check` reports: "OK: BLOG_WEBP_AVAILABLE matches public/images."
- Same file, intent-matched link remaps (BUG-020 alignment):
  - `/refinance-calculator` and `/calculators/refinance-calculator` → `/calculators/refinance-break-even`
  - `/calculators/debt-consolidation` → `/equity-lending/calculators/debt-consolidation`
  - `/residential/calculators/stress-test` → `/calculators/stress-test`
- Unit run (sample HTML), all correct:
  - the 3 image forms became `.webp`;
  - the unknown blog image and the off-domain image were left alone;
  - h1 was demoted to h2;
  - lazy-loading was added;
  - the 3 links were remapped.
- `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`: `force-dynamic` is now `export const revalidate = 300`. This is safe because:
  - `getRecentPosts`/`getPost` read no request data, catch Firestore errors and fall back to the built-in posts;
  - there is no `generateStaticParams`, and `dynamicParams` keeps its default (true), so any slug renders on demand and is then cached;
  - `getPost()` excludes drafts by default (404), and the noindex branch is kept as a second safety net.
  - Effect: new or edited posts can take up to 5 minutes to appear (needs-owner #6).
- Also fixed in the blog:
  - **Featured posts after the first two disappeared** (excluded from both lists). They now flow into "Latest Articles".
  - Post OG was missing `og:url`, `site_name` and `locale`. Added, plus `modifiedTime`.
  - `<main id="main-content">` on both blog routes.

## BUG-051 · a11y + perf: fixed
- **Skip link.**
  - New `components/SkipToContent.tsx` is the first element in `<body>` (`app/layout.tsx`). It is `sr-only` until focused, then shows as a gold pill top-left.
  - On activation it focuses `#main-content`, falling back to the first `<main>`, then the first `<h1>` (with `tabindex=-1`). That fallback covers the pages other agents own.
  - `globals.css` adds `scroll-margin-top: 5rem` (clears the fixed header) and removes the outline on the programmatically focused target.
  - `id="main-content"` was added on: homepage (new `<main>` wrapping hero→CTA, footer outside), 19 city pages, rates, about, contact, business-funding, compliance-security, terms, privacy, varun, old-design, not-found, learn ×2 (div→main), provinces (layout wrapper div), blog ×2, qualify, mli.
- **Mobile menu** (`Navigation.tsx`):
  - focus moves into the menu on open;
  - Tab and Shift+Tab are trapped within [toggle + menu];
  - Escape closes it and returns focus to the toggle;
  - body scroll is locked while it's open, and the previous overflow is restored;
  - it auto-closes if the viewport reaches the lg (desktop) breakpoint, which would otherwise leave the page scroll-locked behind an invisible menu.
  - The menu content is now `<nav aria-label="Mobile">`, and the header is `<nav aria-label="Main">`.
- **Dropdowns**: Escape closes the open dropdown and returns focus to its button. A shared `dropdownKeyDown()` helper is used by all 4 dropdowns.
- **`lib/useLiveRates.ts`**:
  - A module-level in-flight promise means concurrent mounts share **one** `/api/rates` request.
  - Successful responses are cached for 5 minutes, which also covers client-side navigation. Errors are not cached.
  - A subscriber set keeps every mounted instance in sync after `refresh()`.
  - The first render is still `null`, so hydration is safe.
  - The return shape is identical (same 13 keys). `refresh()` now ignores arguments, so passing it straight to `onClick` no longer passes the event in.
  - Harness results:
    - 2 concurrent mounts → 1 fetch;
    - a 3rd mount within the TTL → 0 new fetches, with data immediately;
    - `refresh()` → 1 new fetch;
    - an error keeps the last data and sets `error`.
- Removed the ignored `export const dynamic` from client pages `contact/page.tsx` and `qualify/page.tsx`, and from the static server page `mli/page.tsx`.

## BUG-038 · Contrast: fixed in my files
**31 text replacements** of gray-500/slate-500 → gray-400/slate-400, all small text on dark backgrounds:

| File | Replacements |
| --- | --- |
| `components/Navigation.tsx` | 16 (dropdown descriptions) |
| `components/rates/TodaysRates.tsx` | 3 |
| `app/(site)/about/page.tsx` | 3 |
| `app/(site)/mortgage-broker-[city]/page.tsx` (dead route) | 3 |
| `app/blog/page.tsx` | 2 |
| `app/blog/[slug]/page.tsx` | 2 |
| `app/(site)/page.tsx` | 1 |
| `app/(site)/contact/page.tsx` | 1 |

Plus one decorative Tag icon set to gray-400 with `aria-hidden`.

Left on purpose:
- `disabled:text-slate-500` on 2 qualify buttons (WCAG exempts disabled controls).
- RatesTicker's decorative "•".
- The compliance-security chevron icon (non-text, passes 3:1).
- The compliance-security `text-gray-600`, which sits on light (#F8F9FA/white) sections.

## BUG-015 · Privacy policy: content updated. ⚠️ LEGAL REVIEW REQUIRED
`app/(site)/privacy/page.tsx`. Same 10-section structure. **Last Updated: October 13, 2026**, rendered with `<time dateTime="2026-10-13">`.
- **New `SERVICE_PROVIDERS` list** (§4, `#service-providers`). Each entry says what the provider does and what data it receives; the list is built from the code:
  - Vercel (hosting + Vercel Analytics)
  - Google Firebase/Firestore
  - Twenty CRM + n8n (on a Hostinger VPS, `webhook.srv848694.hstgr.cloud`)
  - Discord (lead alerts with PII)
  - HighLevel/LeadConnector (business funding + the `/varun` form)
  - Finmo
  - OpenRouter (forwards to third-party models)
  - Google Gemini + NVIDIA (chat fallbacks)
  - ElevenLabs (TTS)
  - Thinkrr (web voice widget + AI calls on Facebook/Instagram leads)
  - Vapi (AI call after contact/qualify)
  - Twilio (line + voicemail recording)
  - OpenAI Whisper (voicemail transcription)
  - Meta Lead Ads
  - Google Analytics/Segment (only when enabled)
  - A sentence that OpenAI/Anthropic drafting tools (`lib/pipeline`, `strategy/weekly`) are not given enquiry, chat or call data. I checked: only `lib/pipeline/*` and `api/strategy/weekly` import them.
- **New "Processing Outside Canada"** (§4, `#cross-border`): US-based providers, OpenRouter models possibly elsewhere, foreign-law access, and an offline alternative (call/email).
- §1 scope now covers forms, chat, voice and automated calls.
- §2 adds "7. Information you give us through this website, chat and calls" and "8. Technical information" (IP for abuse protection, device, pages, UTM).
- §3 adds website-enquiry handling, assistants, and security/analytics purposes.
- §5 describes the two optional consent checkboxes and marketing opt-out (BUG-005).
- §9 rewritten in plain language:
  - Vercel Analytics, plus GA/Segment only if enabled;
  - localStorage: chat history auto-deleted 30 days after the last message (matches the AI agent's `HISTORY_TTL_MS`), a "Clear chat" button, province/language preferences and a random browser id (`km_uid`);
  - chat → OpenRouter/Gemini/NVIDIA; contact details typed in chat → CRM + team alert; a temporary in-memory chat-question log with email/phone redacted (`trainingLogsBuffer`, max 100, cleared on restart); don't enter SIN/banking;
  - voice: ElevenLabs, browser speech recognition (Chrome sends audio to Google) and Thinkrr recording notice;
  - automated calls: Vapi **only if the call box is ticked**, held until calling hours; Thinkrr for ad leads; may be recorded; ask us to stop;
  - Twilio voicemail recording + Whisper.

**Items legal and the owner must confirm before relying on this text:**
- Hostinger and Firestore regions.
- Thinkrr and Vapi company details and locations.
- Whether Vapi and Thinkrr calls are recorded and whether summaries go to the CRM. The text says "may".
- The existing unverified security claims: "End-to-end TLS 1.3", "AES-256 … MFA", "cryptographic erasure", the "PIPEDA & BC PIPA Compliance" badge, and the 7-year retention statement.
- The Head Office vs Dealing Office conflict (M2).
- The `privacy@` mailbox exists.
- Whether the in-memory chat log is ever persisted or used for training. If so, §9 must change.

## BUG-005 · Consent UI on lead forms (orchestrator add-on): done in my forms
- New `components/ConsentCheckboxes.tsx`:
  - a `<fieldset>` with a sr-only legend;
  - native checkboxes, **unticked by default**, each with a real `<label htmlFor>`;
  - labels are exactly `CONSENT_TEXT.call` / `CONSENT_TEXT.marketing` from `lib/compliance/consent.ts`;
  - `CONSENT_TEXT.notice` in `text-xs text-gray-400` underneath, with optional trailing children (Privacy link);
  - `focus-visible` ring and `accent-color` gold.
  - The call box renders only when a `call` prop is passed.

| Form | Posts to | Boxes | Body | Result state |
| --- | --- | --- | --- | --- |
| `/contact` (`contact/page.tsx`) | `/api/contact` (auto-dials) | call + marketing | `...consentFields(call, marketing)` | Server-driven. `callDispatched` → "Our AI assistant is calling you now at …". Call ticked + `isAfterHours` → "We'll be in touch shortly… we'll call you {scheduledTime}". Otherwise → "We'll be in touch shortly." Phone becomes required only when the call box is ticked. |
| `/qualify` step 5 | `/api/contact` | call + marketing | `...consentFields(...)`; the CRM note includes "Automated AI Call Consent: YES/NO" | `calling` **only if** `callDispatched === true`. Call ticked + after hours → `completed` (queued). Otherwise → `received` ("Your details have been received. We'll be in touch shortly."). The Julia copy, LIVE DIAL banner, after-hours text, callback hint and submit label ("SUBMIT MY DETAILS →" / "SUBMIT & CALL ME NOW →" / "SUBMIT & QUEUE CALLBACK →") all depend on the box. All qualify inputs now have `id` + `<label htmlFor>` and autocomplete. |
| `components/home/LeadModal.tsx` | `/api/lead` (no calls) | marketing only | `...consentFields(false, marketing)` | Also fixed the false "Check your email for your personalized report" (no email provider is wired, per `api/calculator-report`). |
| `/business-funding` | `/api/business-funding` (no calls) | marketing only | `{...form, ...consentFields(false, marketing)}` | (unchanged) |

- Existing Privacy Policy notes are kept on all four forms.
- **Not mine:** `components/PdfLeadModal.tsx` also posts to `/api/contact` and needs the same treatment (needs-owner #3).
- `/api/lead` and `/api/business-funding` use zod `.strip()`. `consentVersion` (and `consentToCall` on business-funding) is dropped unless backend adds those fields to the schemas (needs-owner #4).

## Other fixes (task 8)
1. **Calculator quick-nav bar showed MLI links on every calculator** (`Navigation.tsx`). On e.g. `/calculators/payment`, "All Calculators" went to the MLI suite, and the "Compare"/"Checklist" actions were MLI tools. MLI calculators now keep the MLI breadcrumb and actions. Other calculators show "[Hub ›] All Calculators" (→ `/calculators`) with "Today's Rates" and "Talk to a Broker". The breadcrumb is a labelled `<nav>`, separators are `aria-hidden`, and the spacer height is unchanged.
2. **/qualify showed "Julia is calling your phone" even when the server placed no call** (repeat number within 24h, dialer failure, and now no consent). It now follows `callDispatched` and `isAfterHours` from `/api/contact`.
3. **/qualify rate-lock claims** contradicted the Terms (rates aren't holds). Changed:

   | Before | After |
   | --- | --- |
   | "Locking Rate For … Live Verified Feed" | "Rate Inquiry For" |
   | "lock in BC's lowest rate options" | "compare competitive rate options" |
   | "AFTER-HOURS PRIORITY FILE LOCKED / Your Rate & File Are Reserved" | "AFTER-HOURS REQUEST RECEIVED / Your Callback Is Queued" |
   | "Your priority rate is locked immediately upon submitting" | "Your request is recorded as soon as you submit" |
   | "LOCK PRIORITY RATE & QUEUE CALLBACK" | (removed) |
   | "secure your priority rates" | (removed) |

4. **robots.txt** (`app/robots.ts`) now disallows the stale static export in `public/mli-select/`: `/mli-select/index.`, `/mli-select/404`, `/mli-select/_next/`, `/mli-select/mli-select/`, `/mli-select/contact/index.`. It also disallows `/test-voice-agent.html`. None of these prefixes matches a live route. This is a stopgap until the files are deleted (BUG-032, L3).
5. `ProvinceSelect`'s built-in `text-sm` overrode callers' sizes. The size now comes from `className` (default `text-sm`).

---

## needs-owner
1. **HIGH · SEO · calculators/specialty owners.** 13 sitemap URLs **inherit their hub's canonical and title** from `{hub}/layout.tsx` metadata, which breaks the "no metadata in a section layout with child routes" rule:
   - `/equity-lending/calculators/{debt-consolidation,heloc,home-equity}`
   - `/construction/calculators/{budget,builder-program,construction-draw,cost-to-complete,progressive-draw}`
   - `/commercial/calculators/{cap-rate,cash-flow,noi-analysis,refinance}`
   - `/private-lending/calculators/alternative-income`
   - also `/residential/calculators/stress-test`, which will redirect.

   As a result every one of these pages tells Google its canonical is the hub (e.g. heloc → `/equity-lending`). The pages are client components with no layout of their own. Fix: give each tool folder its own leaf `layout.tsx` with title, description, canonical and `openGraph: {...OG_DEFAULTS}`, as was done for the MLI calculators. Alternatively, move the hub metadata into the hub page; it is a client page today, so that would mean a server wrapper. I left these URLs in the sitemap.
2. **calc-specialty:** `app/(site)/residential/page.tsx:64` still links to `/residential/calculators/stress-test`. Point it to `/calculators/stress-test`.
3. **calc-specialty:** `components/PdfLeadModal.tsx` posts to `/api/contact` (the auto-dial endpoint) with no consent UI. Add `ConsentCheckboxes` with both boxes and `...consentFields()`.
4. **backend:**
   - Add `consentToCall`, `consentToMarketing` and `consentVersion` to the `/api/lead` and `/api/business-funding` zod schemas. They use `.strip()`, so the version string is currently dropped.
   - `/api/contact`'s after-hours `message` still says "Priority rate locked!". The UI ignores it, but it is misleading in any other consumer or CRM note.
5. **backend (compliance):** `app/api/webhooks/facebook/route.ts` → `triggerThinkrOutboundCall` has **no calling-hours gate**, unlike `/api/contact`. Facebook/Instagram leads can be AI-dialled at night (CRTC/ADAD). The privacy text avoids claiming otherwise.
6. **backend:** now that `/blog` is ISR (300 s), `/api/blog/ingest` (and any republish path) could call `revalidatePath('/blog')` and `revalidatePath('/blog/' + slug)` so new or edited posts show at once.
7. **legal/owner:** BUG-015 review list above. BUG-005 consent wording is still marked "pending legal review" in `consent.ts`.
8. **owner/platform:** delete `public/mli-select/` (stale static export) and `public/test-voice-agent.html`. Both are robots-blocked as a stopgap.

## New findings for the orchestrator to number
These use provisional IDs (NEW-FE-*) to avoid ID collisions between parallel agents.

| ID | Sev | Item | Status |
| --- | --- | --- | --- |
| NEW-FE-1 | high | Hub calculator pages inherit the hub canonical/title (needs-owner #1) | open |
| NEW-FE-2 | medium | /qualify claimed "Julia is calling" without a dispatched call | fixed |
| NEW-FE-3 | medium | /qualify "rate locked/reserved" claims | fixed |
| NEW-FE-4 | medium | Calculator quick-nav showed MLI breadcrumb/actions on all calculators | fixed |
| NEW-FE-5 | medium | Facebook-lead AI calls ignore calling hours (needs-owner #5) | open |
| NEW-FE-6 | low | /mli had no header/footer and was force-dynamic | fixed |
| NEW-FE-7 | low | Blog index dropped featured posts beyond 2 | fixed |
| NEW-FE-8 | low | Blog post OG missing url/site_name/locale | fixed |
| NEW-FE-9 | low | Stale `public/mli-select` export + test page crawlable | mitigated (robots) |
| NEW-FE-10 | low | LeadModal told users to "check your email" for a report that is never sent | fixed |
| NEW-FE-11 | low | Unused `generateRobotsTxt()` contained `Disallow: /_next/*` | fixed (deprecated) |
| NEW-FE-12 | low (visual) | Navigation always renders an `h-16` spacer, yet many pages also add `mt-16`/`pt-16`/`pt-32`, which probably leaves a 64 px+ blank band under the header | open. Check in the browser before changing |

NEW-FE-12 affects: city pages (`main.mt-16`), the homepage ticker (`div.mt-16`), contact, business-funding, rates (`mt-16`), provinces (`pt-16`) and learn (`pt-32`).

Proposed statuses:

| Item | Status |
| --- | --- |
| BUG-017 | fixed for qualify/mli (old-design/varun noindex, not done) |
| BUG-046 | fixed |
| BUG-039 | fixed |
| BUG-040 | fixed |
| BUG-051 | fixed, except the GA/Segment consent UI (Law 25), which is still open |
| BUG-038 | fixed in frontend files (other areas not audited this round) |
| BUG-015 | content updated, needs-decision (legal) |
| BUG-005 | UI done on 4 forms; PdfLeadModal + schema fields needs-owner |

I did not edit FINDINGS/STATUS/SESSIONS, to avoid colliding with the other 4 agents. The orchestrator should merge.

## Notes for next agent
- Skip-link contract: put `id="main-content"` on the page's `<main>`. Without it, `SkipToContent` falls back to the first `<main>` and then the first `<h1>`. Don't add a second element with that id on a page (the provinces layout owns it for `/provinces/*`).
- `SetProvince` is the pattern for server pages that imply a province. Never make city pages client components for this.
- `useLiveRates` is now a shared cache (5-minute TTL). If you need forced fresh data, call `refresh()`. Don't add another fetch of `/api/rates` in components; use the hook.
- Blog images:
  1. Add the PNG/JPG to `public/images/blog-*.{png,jpg}`.
  2. Run `node scripts/optimize-blog-images.mjs`.
  3. Paste the printed name into `BLOG_WEBP_AVAILABLE`.
  4. Run `--check`.
  5. OG images deliberately stay PNG/JPG.
- Lead forms: always use `ConsentCheckboxes` + `consentFields()`. Show the call box only for `/api/contact`. Never pre-tick. Drive "calling you now" copy only from `callDispatched === true`.
- Privacy policy: when an integration is added or removed, update `SERVICE_PROVIDERS` in `privacy/page.tsx` and the "Last Updated" date in the same change.
- Git Bash: `sed -i` strips CR. Use `sed -b -i` or the Edit tool on CRLF files. Also, MSYS rewrites command-line args that start with `/` (a `/**` arg became `//**`).

## Browser QA checklist (nothing here was seen in a browser)
1. **Skip link.**
   - Load `/`, press Tab: a gold "Skip to main content" appears top-left. Enter moves focus below the ticker and the header no longer covers the target.
   - Repeat on `/calculators/payment`, which uses the `<main>` fallback.
2. **Header province selector.**
   - Check widths 1024–1280 px for crowding or wrapping next to Apply Now.
   - Change the province, open `/calculators/payment`: the ComplianceBanner text should change.
   - Open `/mortgage-broker-toronto`, then any calculator: ON disclaimers. `/mortgage-broker-calgary` → AB.
3. **Mobile menu (375 px).**
   - Opening it focuses "Your province".
   - Tab and Shift+Tab cycle only through the menu + X; Escape closes it and focus returns to the burger.
   - The page behind doesn't scroll.
   - Resizing to ≥1024 px closes the menu.
4. **Desktop dropdowns via keyboard.** Tab to Services, press Enter, Tab into the links, press Escape: the menu closes and focus is back on the "Services" button.
5. **Calculator quick bar.**
   - `/calculators/payment` → "All Calculators" (`/calculators`) + Today's Rates / Talk to a Broker.
   - `/equity-lending/calculators/heloc` → "Equity Lending › All Calculators".
   - `/mli-select/calculators/points` is unchanged.
6. **/qualify.**
   - Walk all 5 steps. The Footer sits below the rate cards.
   - On step 5, both boxes are unticked and focusable with a visible ring, and labels toggle them.
   - Submit unticked → "We'll be in touch shortly" and no Julia copy.
   - Ticked in hours → "calling" only if the API returns `callDispatched:true`.
   - Ticked after hours → queued screen.
7. **/contact.** Same consent checks. With the call box ticked, phone becomes required. Check the success copy variants.
8. **Homepage LeadModal and /business-funding.** One (marketing) box plus the notice. The LeadModal success alert no longer mentions email.
9. **Homepage network tab.** Exactly **one** `/api/rates` request. Navigate to `/rates` within 5 minutes: no new request.
10. **Blog post.** Inline images load `.webp` (Network tab), and the layout and sizes look right. `/blog` shows every post, including a 3rd featured one if present.
11. **/privacy.** The new sections render. TOC links `#service-providers` and `#cross-border` land below the fixed header. Read on mobile for overflow.
12. **/mli.** It has the header and footer.
13. **NEW-FE-12.** Look for a blank band under the header on city pages, the homepage (above the ticker), contact, rates and learn.
