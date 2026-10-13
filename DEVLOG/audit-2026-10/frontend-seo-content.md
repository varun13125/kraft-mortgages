# Frontend / SEO / Content / A11y / Performance audit — 2026-10-12

Scope: public pages, shared components, SEO libs, content, `public/`. Owner: frontend-seo agent.
Verification: full `tsc --noEmit --incremental false -p .` → **0 errors** (run near the end, after a parallel agent's temporary syntax error in `calculators/amortization` was resolved; a scoped tsc over every file I touched was also clean). Plus Node-based route/link/sitemap/canonical crawlers over `app/` (scripts kept in my scratchpad, not the repo) and an isolated unit run of `lib/utils/blog-content.ts`. No `next build`/`next dev` was run, so runtime rendering is **not** visually verified.

---

## 1. Route & navigation inventory

### 1.1 Routes (119 non-API `page.tsx`)
| Group | Routes | Notes |
|---|---|---|
| Home | `/` | Server component; own inline footer |
| Service hubs | `/residential` `/construction` `/commercial` `/equity-lending` `/private-lending` `/mli-select` `/business-funding` | calculators agent owns all but business-funding |
| Calculators | `/calculators` + 30 under `/calculators/*`, plus `/{commercial,construction,equity-lending,private-lending,residential}/calculators/*`, `/mli-select/calculators/*` (10) | calculators agent |
| MLI info | `/mli-select/{overview,benefits,scoring,faq,eligibility,compare-programs,application-process}`, `/mli` | no metadata/canonical (see open issues) |
| Cities | 19 static `/mortgage-broker-{city}` + dead `mortgage-broker-[city]` | see 1.3 |
| Info/legal | `/about` `/contact` `/rates` `/privacy` `/terms` `/compliance-security` `/compliance` `/privacy-policy` `/terms-of-service` | |
| Content | `/blog`, `/blog/[slug]`, `/learn`, `/learn/[slug]` | |
| Other | `/provinces/{bc,ab,on}`, `/qualify`, `/varun`, `/old-design` | |
| Private | `/admin/**`, `/dashboard`, `/login`, `/settings` | backend agent |

### 1.2 Navigation surfaces
- `components/Navigation.tsx` — live header on ~86 pages (desktop hover dropdowns + mobile drawer).
- Homepage inline `<footer>` (`app/(site)/page.tsx`) — the only full footer most visitors saw.
- `components/Footer.tsx` — was only on `/privacy` and `/terms`; now also on city pages, about, contact, compliance-security, business-funding, rates, blog, learn, provinces, 404 (see Fixed #14).
- `components/Nav.tsx` — **unused** (0 imports); it is the only thing linking `/learn`, `/provinces/*` and `ProvinceSelect`.

### 1.3 Duplicate / competing pages — verdicts
| Pair | What actually happens | Verdict |
|---|---|---|
| `/privacy` vs `/privacy-policy` | `next.config.mjs` 308-redirects `/privacy-policy` → `/privacy` before the filesystem; `privacy-policy/page.tsx` is a 1-line re-export that is never served | Fine. Delete the dead file (low). |
| `/terms` vs `/terms-of-service` | Same pattern (redirect) | Fine. Delete dead file (low). |
| `mortgage-broker-[city]` vs 19 static city pages | A folder named `mortgage-broker-[city]` is **not** a dynamic segment in Next 14 (brackets must be the whole segment). It only matches the literal URL `/mortgage-broker-%5Bcity%5D`, where `params.city` is undefined → `notFound()`. Static pages always win. Confirmed by `docs/superpowers/plans/phase1-implementation-decisions.md` Task 11. | Dead code (429 lines, also contains stale "$1M = 20% down" rules, "absolute lowest rates", "40+ lenders"). Delete (low). |
| `/compliance` vs `/compliance-security` | `/compliance` was an "under construction" stub inheriting the homepage canonical | **Fixed**: 308 to `/compliance-security`. |
| City pages vs each other | 19 static pages, 82–173 lines each, mostly unique local copy (neighbourhoods, local FAQs). Not thin duplicates, but share boilerplate sections and several share identical FAQ wording on down payments. | Acceptable; see opportunities (shared data file). |
| `/old-design`, `/varun` | Both already had `robots: noindex` in their layouts, **but** `robots.txt` disallowed them, so Google could never see the noindex (URL-only indexing from links, e.g. the `varun.kraftmortgages.ca` → `/varun` redirect in `middleware.ts`) | **Fixed** (robots no longer blocks them; noindex now effective). |
| `/learn`, `/learn/first-time-buyer` | "Under construction" stub + 2-line MDX; `/learn` was in the sitemap | **Fixed**: noindex, removed from sitemap, nav + footer added. |
| `/provinces/*` | AB/ON are 2-line stubs, BC has stale content; no nav, inherited homepage canonical; linked only from unused `Nav.tsx` and `/old-design` | **Fixed**: section noindex + nav/footer via new layout; BC placeholder phone fixed. |

### 1.4 Dead internal links (whole app) — final state after this audit
Found with a route-matcher over every `href`/`link`/`path`/`router.push`/`redirect` literal in `app/ components/ lib/ store/ content/`.

| Link | Where | Status | Owner |
|---|---|---|---|
| `/construction-financing`, `/private-mortgages`, `/self-employed-mortgages`, `/refinancing`, `/investment-properties`, `/first-time-home-buyers` | `app/api/blog/ingest/route.ts:10-16` (`PILLAR_PAGES`, auto-appended to every ingested post as "Related Resources") | **404** at source. Mitigated at render time on `/blog/[slug]` (Fixed #20). Root fix needed in ingest + 308s in next.config for any other consumer of stored content. | needs-owner: backend (ingest), platform (redirects) |
| `/self-employed` | `lib/ai/tools/navigation-tools.ts:25` | **404** (AI assistant can send users there). Suggest `/calculators/self-employed`. | needs-owner: AI |
| `/services` | `lib/db/firestore.ts:2099` (seed post HTML) | **404**. Mitigated on blog render (→ `/#services`). | needs-owner: backend |
| `/calculators/construction-draw`, `/calculators/payment-calculator`, `/investment-calculator`, `/mortgage-calculator`, `/refinance-calculator` | `lib/db/firestore.ts:1744,1764-1766,2182,2408` | Work only via `next.config.mjs` redirect hop; blog render now links the final URL directly. | backend (optional cleanup) |
| `/faq` | `lib/seo/internalLinks.ts:31` (unused helper) | **Fixed** → `/mli-select/faq`. | frontend |
| `/private-lending/calculators/hard-money`, `/equity-lending/calculators/{cash-out-refinance,investment-opportunity}`, `/private-lending/calculators/{asset-based,bridge-financing,quick-approval}` | calculators/service pages | Were dead/redirect-hop at audit start; **fixed by the calculators agent during this audit** (no longer present). | calculators |
| `/calculators/stress-test` | 3 links + sitemap | `next.config.mjs` permanently redirects it to `/residential/calculators/stress-test`, **shadowing an existing page** (`calculators/stress-test/page.tsx` + layout are unreachable). Removed from sitemap (Fixed #3). | needs-owner: calculators/platform (pick one URL) |
| `/kraft-logo-light.png` (image) | `components/Footer.tsx` | Missing file → broken logo. **Fixed**. | frontend |
| `//images/blog-1.png` (image, protocol-relative = `https://images/...`) | `lib/db/firestore.ts` seed post (×2) | Broken image. Mitigated on render (Fixed #20). | backend |
| `/images/blog-default.jpg` (OG image) | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` | Missing file → broken og:image. **Fixed**. | frontend |

### 1.5 Sitemap vs routes (after fixes)
- Every sitemap URL resolves to an existing route; no redirecting URLs remain.
- Added: `/rates`, `/compliance-security`, `/calculators/refinance-break-even`. Removed: `/calculators/stress-test` (redirect), `/learn` (noindex stub).
- Intentionally not added until they get their own canonical/metadata: `/mli-select/{overview,benefits,scoring,faq,eligibility,compare-programs,application-process}`, `/mli`, `/qualify`.
- 14 sitemap URLs still have **no canonical/title of their own** (`/calculators`, 10× `/mli-select/calculators/*`, and a few others — see Open H1). Before this audit they all declared the **homepage** as canonical (Fixed #1).

---

## 2. Fixed

Line numbers are post-edit.

1. **`apps/web/app/layout.tsx:35,53`** · Root metadata set `alternates.canonical = https://www.kraftmortgages.ca` and `openGraph.url = homepage`. Next.js inherits these into every page that doesn't override them, so ~25 sitemap pages (calculators index, MLI calculators, business-funding, learn, provinces…) declared the **homepage as their canonical** and shared the homepage og:url — telling Google to drop them. · Removed both from the root (homepage sets its own canonical/og:url in `app/(site)/page.tsx`). · Verified with canonical crawler: pages without their own now emit no canonical instead of the homepage; tsc clean.
2. **`apps/web/app/robots.ts:31-53`** · (a) AI-bot groups had `allow: '/'` with no disallow; a crawler matching its own group ignores `*`, so GPTBot/ClaudeBot/etc. were invited into `/admin` and `/api`. (b) `/old-design` and `/varun` were disallowed, which stops Google from ever seeing their `noindex`. (c) `/admin/*`/`/dashboard/*` patterns didn't cover the bare paths; `/login`, `/settings`, `/mli-proxy/`, `/crewapi/` weren't covered. · Single `PRIVATE_PATHS` list (prefix rules) applied to `*` and to every AI bot; old-design/varun left crawlable so noindex works. · tsc; read-through of generated rule shape.
3. **`apps/web/lib/seo/sitemap.ts:198,207,388-399`** · Sitemap listed `/calculators/stress-test` (308 redirect) and `/learn` (stub); omitted `/rates` (primary nav item), `/compliance-security`, `/calculators/refinance-break-even`. · Fixed lists; comments explain the omissions. · Sitemap/route diff script: 0 URLs without a route.
4. **`apps/web/lib/seo/sitemap.ts:429-445`** · Every static URL got `lastModified = now` on each regeneration (inaccurate; spec E2 flagged it). · Static entries omit lastmod; `/blog` lastmod = newest post date. · tsc.
5. **`apps/web/lib/seo/jsonld.ts:15`** · Org `@type` included `MortgageBroker`, which is not a schema.org type. · Now `['Organization','LocalBusiness','FinancialService']`. · tsc.
6. **`apps/web/lib/seo/jsonld.ts:63`** · WebSite `SearchAction` advertised `/blog?q=` but `/blog` ignores `q` (and Google retired the sitelinks search box). · Removed. · tsc.
7. **`apps/web/lib/seo/jsonld.ts:119`** · City nodes were typed `FinancialService` (a LocalBusiness) without address → implied a second business per city and "missing address" warnings. · Now plain `Service` with `provider: {@id: ORG_ID}`. · tsc.
8. **`apps/web/lib/seo/schema.ts:1,54,58,70,117,175,192,238`** · Article/calculator/local schema used `https://www.kraftmortgages.ca#organization` / `#website` (no slash) — a different `@id` than the canonical `/#organization` — and redefined the org with partial NAP; `isPartOf` used invalid type `Website`. · Import `ORG_ID`/`SITE_ID`, reference by `@id`. · tsc.
9. **`apps/web/app/(site)/contact/layout.tsx`** · Emitted a second `LocalBusiness` (`/#contact`) with a different geo point (49.1014,-122.7927 = Newton, not the 152nd St office), different hours (9–6 / Sat 10–4) than the org node, and invalid type `CanadianProvince`. · Replaced with a `ContactPage` node pointing at `ORG_ID`; added Footer. · tsc.
10. **`apps/web/app/(site)/compliance-security/page.tsx:108`** · JSON-LD included another `LocalBusiness` with a different address (Suite 202 – 12725 80 Ave, V3W 3A6) and geo → conflicting NAP. · Removed that node (FAQPage kept; licences already in org `hasCredential`). · tsc.
11. **`apps/web/lib/seo/og.ts` (new) + 19 city layouts, about/contact metadata, compliance-security layout, privacy, terms, rates, blog index** · Next replaces (doesn't merge) a parent `openGraph` when a page sets its own, so every page with `openGraph` but no `images` had **no og:image**; Abbotsford/Kamloops/Kelowna had no openGraph at all and inherited the homepage og:title/og:url. · Shared `OG_DEFAULTS` (image, siteName, locale, type) spread into each; added openGraph to the 3 cities. · Verified Next 14.2.21 merge logic in `node_modules/next/dist/lib/metadata/resolve-metadata.js`; tsc.
12. **`apps/web/app/(site)/business-funding/layout.tsx` (new)** · Sitemap service hub had no title/description/canonical (client page) → homepage title/canonical. · Layout with metadata + canonical + OG + Footer. · tsc.
13. **`apps/web/components/Footer.tsx:54,92-93`** · Logo `src="/kraft-logo-light.png"` doesn't exist (broken image); only FSRA licence shown (no BCFSA/RECA); bottom bar "SURREY · CALGARY · TORONTO" implied offices that `business-config` doesn't list; Calculators linked to a 4-card homepage anchor. · Uses `/kraft-logo-dark.png` (same as Navigation), all three licences from `BUSINESS.licenses`, "SERVING BC · ALBERTA · ONTARIO", phone from BUSINESS, Calculators → `/calculators`. · tsc.
14. **Footer coverage** (19 city layouts, about, contact, compliance-security, business-funding layouts; rates, blog index/post, learn pages; provinces layout; new 404) · Only 4 pages had any footer, so licence numbers/legal links were invisible on location landing pages. · Added `<Footer />` to the pages I own. · tsc. (Remaining pages: see Open H5.)
15. **19 × `apps/web/app/(site)/mortgage-broker-*/page.tsx:1`** · Static content pages were `"use client"` with zero hooks/handlers → whole page shipped and hydrated as client JS. · Removed the directive (now Server Components; Navigation stays a client island). · grep for hooks/handlers/motion = 0 per file; tsc.
16. **City page FAQs — Calgary :96, Coquitlam :102, Nanaimo :94, Surrey :75, Toronto :117/:120, Vancouver :91/:95** · Stated 20% down for homes ≥ $1M and 10% on $500k–$999,999. Since Dec 15 2024 the insured price cap is $1.5M (5% on first $500k, 10% to $1,499,999, 20% at $1.5M+). · Updated wording. · Text diff.
17. **`mortgage-broker-edmonton/page.tsx` + `layout.tsx:5`, `ottawa/page.tsx`, `toronto/page.tsx`** · "secure the absolute lowest interest rates", title "Lowest Rates", "guarantees"/"guarantee a seamless closing" — unsubstantiated superlative/guarantee claims in mortgage advertising. · "competitive interest rates", "Competitive Rates", "helps ensure". · Text diff.
18. **`apps/web/app/blog/[slug]/page.tsx:81,106-107,117,139,16,209-220`** · (a) Dates read only legacy lowercase `publishedat`; Firestore returns `publishedAt` → **every post showed today's date** in UI, `datePublished`, OG. (b) Rendered `post.markdown` before `post.html`, so pipeline posts (markdown + converted html) displayed raw markdown. (c) Missing default OG image; relative image URLs in OG/schema. (d) Drafts indexable. (e) Schema: licences in `honorificPrefix`, non-www publisher logo, publisher not linked to org. (f) Firestore read twice per request. · `toIso()` handles both shapes; `html` preferred; `BUSINESS.ogImageUrl` + absolute URLs; drafts get `noindex` (still viewable for admin preview); schema references `ORG_ID`; `react.cache()`; Footer. · tsc.
19. **`apps/web/app/blog/page.tsx:21,118,144-146`** · Listed draft posts publicly (`getRecentPosts` has no status filter); broken OG image; org schema duplicated. · Filter `status !== 'draft'`; `OG_DEFAULTS`; `@id` refs; Footer. · tsc.
20. **`apps/web/lib/utils/blog-content.ts:30-104`** · (a) `[IMAGE: …]` became a `via.placeholder.com` image (service offline → broken image). (b) Ingest's appended markdown tail ("--- ### Related Resources - [x](url)") rendered as literal text with dead URLs. (c) Dead/redirect-hop own-domain hrefs. (d) In-body `<h1>` duplicated the page h1. (e) `//images/...` broken src. (f) 0.7–1.6 MB images loaded eagerly. · Placeholders dropped; tail converted to HTML; href remap table (pillars, `/services`, legacy calculator URLs, absolute→relative); h1→h2; src fix; `loading="lazy" decoding="async"`. · Isolated Node unit run with sample HTML (output verified), tsc.
21. **`apps/web/app/globals.css:671+`** · `@tailwindcss/typography` isn't installed, so all `prose-*` classes on blog posts are no-ops: headings rendered at body size, lists had no bullets. · Minimal typography scoped to `article .prose` (other `.prose` users unaffected). · CSS review.
22. **`apps/web/app/globals.css:649-669`, `apps/web/components/MotionProvider.tsx` (new), `app/layout.tsx:72-106`** · No `prefers-reduced-motion` handling anywhere: infinite mesh-blob/spotlight/glow/gradient animations site-wide plus Framer loops (hero shapes). Four 500–800px `blur(120px)` blobs + three blurred spotlights animate forever on phones. · Global reduced-motion CSS block; `<MotionConfig reducedMotion="user">` around the app; background animations frozen (still visible) ≤767px. · tsc; CSS review.
23. **`apps/web/app/layout.tsx:65`** · Preconnects to `fonts.googleapis.com`, `fonts.gstatic.com`, `vercel.live` — none are used. · Removed. · grep (no Google Fonts / next/font usage).
24. **`apps/web/components/Navigation.tsx:73,117-131 (×4 dropdowns),535-537`** · Desktop dropdowns opened on hover only (keyboard users couldn't reach Services/Calculators/MLI/About menus); mobile toggle had no accessible name/state; back button relied on `title`. · `aria-haspopup`/`aria-expanded`, keyboard activation toggles (mouse hover unchanged), close on Escape / focus leaving; mobile button `aria-label` + `aria-expanded` + `aria-controls`; back button `aria-label`. · tsc.
25. **`apps/web/components/home/LeadModal.tsx`** · No dialog semantics/close button/Escape; **failed submissions showed "Thank you"** (no `res.ok` check, catch also said thanks); promised "check your email for your report" with no report; claimed info "will never be shared" (contradicts Privacy Policy sharing with lenders/insurers). · `role="dialog"`/`aria-modal`/labelledby, close button, Escape, `res.ok` check with retry/phone message (form data kept), correct thank-you text, privacy-policy link, autocomplete, submitting state. · tsc.
26. **`apps/web/components/home/StatsCounters.tsx`** · SSR HTML (what non-JS crawlers incl. the invited AI bots see) said "0+ Years / 0+ Happy Clients / $0B+ Funded"; no reduced-motion handling; 10px gray-500 labels. · Final values as `sr-only` text, animated digits `aria-hidden`, reduced-motion shows final values, labels gray-400, interval cleanup. · tsc.
27. **`apps/web/components/rates/TodaysRates.tsx:33,58,75,100,106,204,289` & `RatesTicker.tsx:14,46,64-65`** · Hard-coded "Updated Today"/"Live" even when the API failed and hardcoded fallback rates were shown; "Real-time … harvested"; prime labelled "Bank of Canada Prime" (prime is set by banks); "Lock Rate" CTA (Terms say rates aren't rate holds); hardcoded "7.99%" private 2nd; US term "ARM". · Badge uses API `last_updated_human` / "Indicative rates"; "compiled daily"; "Canadian Prime Rate"/"Prime Rate"; CTA "Apply"; live private-2nd rate + "not a rate hold or commitment to lend"; "Variable"; tabs get `aria-pressed`; new `headingLevel` prop. · tsc.
28. **`apps/web/app/(site)/rates/page.tsx:42,89`** · Page had **no h1** (top heading was an h2 inside TodaysRates), heading levels skipped, no OG image, no footer. · `headingLevel="h1"`, h2/h3 fix, OG_DEFAULTS, Footer. · tsc.
29. **`apps/web/app/(site)/page.tsx:41,388`** · "serving Surrey … since 2002" contradicts `business-config` (founded 2014, "not since 2002"); secondary phone `tel:(604) 359-5993` (spaces/parens). · Removed "since 2002"; `tel:` uses E.164 `BUSINESS.secondaryPhone`. · tsc.
30. **`apps/web/app/(site)/about/page.tsx:67`** · "10,000+ Families Helped" vs `BUSINESS.clientsServed` "5,000+" used everywhere else. · Reads `BUSINESS.clientsServed`. · tsc.
31. **`apps/web/app/(site)/provinces/bc/page.tsx:342,356,360` + new `provinces/layout.tsx`** · Placeholder phone "(604) 555-0123" (tel link too) and fake "1-800-KRAFT-MTG"; white text on gold-500 button (≈2.1:1); provinces pages had no nav/metadata. · Real phone from BUSINESS, gray-900 button text, layout with nav/footer + noindex. · tsc.
32. **`apps/web/app/(site)/compliance/page.tsx`** · Duplicate "under construction" stub. · `permanentRedirect('/compliance-security')`. · tsc.
33. **`apps/web/app/(site)/learn/page.tsx`, `learn/[slug]/page.tsx`, `content/learn/first-time-buyer.mdx`** · No metadata (homepage canonical), no nav, sitemap-listed stub; MDX contained literal `\n\n`. · noindex+title, nav/footer, links to blog/calculators, BUSINESS email; MDX newlines fixed. · tsc.
34. **`apps/web/app/not-found.tsx` (new)** · Dead links landed on Next's bare default 404 with no way back. · Branded 404 with nav, helpful links, phone, footer. · tsc.
35. **`apps/web/components/Breadcrumb.tsx`** · No landmark label or current-page marker. · `aria-label="Breadcrumb"`, `aria-current="page"`, decorative chevrons hidden. · tsc.
36. **`apps/web/app/(site)/contact/page.tsx:186`, `business-funding/page.tsx:508`** · Forms collected personal/financial info with no privacy notice. · One-line notice + Privacy Policy link under submit. · tsc.
37. **`apps/web/lib/seo/internalLinks.ts:32`** · `/faq` doesn't exist. · `/mli-select/faq`. · tsc.

---

## 3. Open issues (not fixed)

### Critical
- None open in my area. (At audit start `app/api/lead/route.ts` returned a fake `temp_` success when the DB write failed, so leads were silently lost. The backend agent changed it to return 500 during this audit, and the homepage LeadModal now checks `res.ok` and shows a retry/phone message.)

### High
- **H1 · Pages without their own title/description/canonical** — `/calculators` (index), `/mli`, all `/mli-select/*` info pages (7) and `/mli-select/calculators/*` (10), `/qualify`. They now emit no canonical (instead of the homepage) but still share the root default title/description (duplicate titles in SERPs). · Add `metadata` (layout.tsx for client pages) with title, description, canonical, `openGraph: {...OG_DEFAULTS, …}`. Then add the MLI info pages to `lib/seo/sitemap.ts`. · needs-owner: calculators/MLI.
- **H2 · Privacy policy vs actual data flows** (`app/(site)/privacy/page.tsx` §9) · Mentions Vercel Analytics and Julia/Thinkrr voice only. Not disclosed: chat text sent to OpenAI/Anthropic/Google/OpenRouter; ElevenLabs/MiniMax voice synthesis; Twilio `<Record>` voicemail (`api/voice/twilio/entry`); LeadConnector/GoHighLevel form embed on `/varun`; Firebase/Google Cloud storage; HubSpot CRM; Brevo email; optional GA/Segment (`components/Analytics.tsx`); cross-border (US) processing (PIPEDA transparency). Also two "Head Office" addresses (see M2). · Legal review + rewrite §9/§4. · needs-owner: business/legal · Content requires legal sign-off.
- **H3 · Homepage testimonials** (`app/(site)/page.tsx:69-82`) — named people ("John Davidson", "Michael Patel", "Sarah & Raj Mehta") with specific outcomes and no source. If not genuine and consented, this is a Competition Act / regulator advertising risk (the spec already removed fake AggregateRating for this reason). · Confirm with Varun or replace with sourced Google reviews. · business decision.
- **H4 · Blog ingest pillar links** (`app/api/blog/ingest/route.ts:9-17`, `SITE_URL` non-www) — still writes links to 6 non-existent pages into stored content (render-time remap only protects `/blog/[slug]`). · Map to real routes; add 308s in `next.config.mjs`. · needs-owner: backend + platform.
- **H5 · No footer on ~80 other pages** (calculators, service hubs, MLI, qualify) → brokerage licence numbers and legal links absent on most ad landing pages (FSRA/BCFSA advertising rules expect the licensed name/licence to be identifiable). · Add `<Footer />` to `residential/commercial/construction/equity-lending/private-lending/mli-select/calculators` layouts (or move it into `(site)/layout.tsx` and drop the homepage/privacy/terms copies). · needs-owner: calculators (or a coordinated layout change).
- **H6 · Blog HTML rendered with `dangerouslySetInnerHTML`, unsanitized** (`app/blog/[slug]/page.tsx`) — content arrives via the ingest API/pipeline. If ingest auth is weak this is stored XSS on the main domain. · Sanitize on ingest (or render with a sanitizer). · needs-owner: backend.

### Medium
- **M1 · Business hours conflict** — `business-config`/org JSON-LD/`llms.txt`: Mon–Fri 9–5, Sat 10–2. Contact page (`contact/page.tsx:260-262`) and BC page: Mon–Fri 9–6, Sat 10–4. Not unambiguous which is real. · Confirm, then render contact/BC hours from `BUSINESS.openingHours`.
- **M2 · "Head Office" conflict** — About: Head Office = #301-1688 152nd St. Privacy/Terms/Compliance: Head Office = Suite 202-12725 80 Ave (V3W 3A6), 152nd St = "Dealing Office". · Confirm; label consistently (e.g., "Registered office" vs "Office").
- **M3 · Licence numbers to verify** — About (`about/page.tsx` Varun card): "BCFSA #X303985 | RECA #M22001447 | FSRAO #M22001447" (RECA and FSRA identical → likely copy error); BC province badge shows "BCFSA Licensed #X303985" (individual licence presented as the firm's). · Verify against registries.
- **M4 · Unsubstantiated marketing claims** — "Top-rated" in 13 city meta descriptions + Surrey/Airdrie H1s; "98% approval rate on submitted files" (About); "Free pre-approval in 24 hours"/"same-day pre-approvals"; BC page "$1.2B BC funded / 11 years / 48 hrs"; "Contact our Windsor team", "Operational Footprint Vector: Calgary Hub" (implies local offices); About "12 Years of Excellence" hard-coded; "Varun since 2010, Gursharan since 2008 … 18 years combined" (16+18=34). · Substantiate or soften.
- **M5 · Rate advertising compliance** — rates shown as "From x%" with OAC text but no APR and the "Verified" wording. Ontario rules on advertised rates (APR disclosure) should be checked by the broker of record. · needs-owner: business/legal.
- **M6 · Double navigation on MLI pages** — `mli-select/layout.tsx` renders `<Navigation />` and `overview/benefits/faq/scoring/application-process` pages render it again. · Remove from the pages. · needs-owner: calculators/MLI.
- **M7 · `/calculators/stress-test` page is unreachable** (next.config redirect shadows it) and `/calculators/debt-consolidation`, `/calculators/refinance-calculator` redirect to the *payment* calculator (intent mismatch). · Decide canonical URL per tool. · needs-owner: calculators/platform.
- **M8 · Contrast** — `text-gray-500`/`text-slate-500` small text on gray-900/slate-950 ≈ 3.6–3.9:1 (fails WCAG AA 4.5:1), used widely (labels, captions, footer of several pages). · Use gray-400 minimum for text < 18px.
- **M9 · Province selector not reachable** — `ProvinceSelect` only lives in unused `Nav.tsx`, so the store keeps its default province and `ComplianceBanner` shows the default province's disclaimers to AB/ON users. · Render it in `Navigation` or auto-set from city pages.
- **M10 · Consent** — no CASL express-consent checkbox on contact/business-funding/LeadModal while `api/automations/nurture` exists (implied consent from an inquiry doesn't cover ongoing marketing). · Add opt-in checkbox + store consent. · needs-owner: backend + legal.
- **M11 · Blog images** — 8 PNG/JPGs of 0.7–1.6 MB in `public/images/` served raw inside post HTML (not `next/image`). Lazy loading added; still heavy. · Re-encode to WebP/AVIF ≤ 200 KB.
- **M12 · `app/blog/*` are `force-dynamic`** — every view hits Firestore. · `export const revalidate = 300` once build-time Firestore access is confirmed safe. Not changed (risk to build without env).

### Low
- **L1** Dead code to delete (needs user OK; I may not delete): `app/(site)/mortgage-broker-[city]/`, `privacy-policy/page.tsx`, `terms-of-service/page.tsx`, `components/{Nav,CalculatorCard,GradientOrbs,HolographicCard,InteractiveBackground,MagneticButton,ScrambleText,TrustAssuranceCard,Seo}.tsx`, `components/home/TodaysRates.tsx` (re-export), `components/ui/spotlight-background.tsx`, `lib/analytics.ts` (console.log only), `lib/meta/conversions.ts` (unused). `HolographicCard`/`InteractiveBackground`/`ScrambleText` use `Math.random()` in render → hydration mismatch if ever revived.
- **L2** `/old-design` (489-line legacy homepage, noindex) — delete when no longer needed.
- **L3** `public/test-voice-agent.html` is publicly served — needs-owner: AI. `public/mli-select/` contains an old static Next export (`index.html`, `_next/` chunks, `guide.pdf`) reachable at `/mli-select/index.html` etc. — duplicate-content/stale-asset risk. needs-owner: platform.
- **L4** Homepage makes two `/api/rates` requests (RatesTicker + TodaysRates each call `useLiveRates`). · Lift into a shared context/SWR cache.
- **L5** `contact/page.tsx:10` exports `dynamic = "force-dynamic"` from a client page → needless per-request SSR.
- **L6** No skip-to-content link; mobile menu has no focus trap/scroll lock; Escape in a dropdown doesn't return focus to its button.
- **L7** Two public contact emails (`info@` in JSON-LD/business-config vs `varun@` in footer/contact/blog). Pick one primary.
- **L8** GA/Segment load without any consent UI (fine for BC/AB/ON; required if targeting Quebec under Law 25).
- **L9** BC province page content stale (BC HOME Partnership ended 2019) — now noindexed; rewrite before re-indexing.
- **L10** `vercel.json` adds `X-Robots-Tag: all` to every path (redundant; noindex still wins).

---

## 4. Feature opportunities

| Title | Value | Builds on | Effort |
|---|---|---|---|
| City pages from one data file | Removes 19 near-identical files; consistent licence/FAQ/CTA blocks; easy to add cities (Kitchener, Hamilton, Saskatoon…) | `CITY_METADATA` already written in the dead `[city]` route; plan doc suggests `mortgage-broker/[city]` or generated statics | M |
| BreadcrumbList + FAQPage JSON-LD on city and MLI pages | Breadcrumb rich results; AEO answers from visible FAQs | `breadcrumbJsonLd`/`faqJsonLd` in `lib/seo/jsonld.ts` (currently unused) | S |
| Real reviews | Trust + legitimate review stars | Replace homepage testimonials with Google Business Profile reviews; one defensible count in `business-config` | M |
| Rate-history & "rates in {city}" pages | High-intent SEO pages, daily freshness signal | `/api/rates` feed, `TodaysRates`, `last_synced_utc` | M |
| UTM / source attribution on leads | Know which city page/ad converts | `lib/utm.ts` exists but `captureUTM()` is never called; pass into `/api/lead` + `/api/contact` | S |
| Learn hub from existing blog | Turns the stub into topical clusters (first-time buyer, renewals, self-employed) with internal links | Blog categories already auto-derived in `app/blog/*`; `lib/seo/internalLinks.ts` | M |
| Blog search & category pages | Usability; restores a genuine SearchAction later | Categories/tags already computed per post | M |
| Province hubs (BC/AB/ON) rebuilt | Ranks for "mortgage broker Alberta/Ontario"; regulator-specific disclosures | `/provinces/*` routes, `BUSINESS.licenses`, `ComplianceBanner` rules | M |
| Sticky mobile CTA (Call / WhatsApp / Apply) | Conversion on phones | `/varun` already has a mobile sticky bar pattern; `WHATSAPP_LINK` | S |
| Image pipeline for blog | LCP + bandwidth | `sharp` already in devDependencies; render post images through `next/image` | M |

---

## 5. Notes for the next agent
- **Root metadata no longer sets a canonical or og:url.** Every indexable page must set `alternates.canonical`; use `openGraph: { ...OG_DEFAULTS, title, description, url }` from `lib/seo/og.ts` — otherwise the page has no og:image (Next replaces, not merges, `openGraph`).
- **`mortgage-broker-[city]` is not a dynamic route** in Next 14 — don't add cities there; add a static folder (and list it in `LOCATION_PAGES` in `lib/seo/sitemap.ts` and `BUSINESS.citiesServed`).
- Sitemap: only list URLs that (a) exist, (b) aren't redirected in `next.config.mjs`, (c) have their own canonical.
- `business-config.ts` is the source of truth for NAP/licences/figures; hours and "head office" still need owner confirmation before wiring the contact page to it.
- Reduced motion: CSS block in `globals.css` + `MotionProvider` (Framer `reducedMotion="user"`). Background animations are intentionally static ≤767px.
- `TodaysRates` takes `headingLevel` (`h1` on `/rates`, default `h2`).
- Blog render pipeline: `processPostContent()` now converts the ingest tail, remaps dead internal links (`DEAD_PILLAR_REDIRECTS`), demotes in-body h1, lazy-loads images. Fixing the ingest map at source is still needed.
- `@tailwindcss/typography` is not installed; blog typography is plain CSS scoped to `article .prose` in `globals.css`.
- Many files in this repo are CRLF; use CRLF-aware edits.
- Nothing was visually verified in a browser (no `next dev`/`build` allowed) — a quick visual pass of the homepage, a city page, `/rates`, a blog post, the LeadModal and keyboard nav through the header dropdowns is recommended.
