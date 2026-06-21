# Kraft Mortgages — SEO/AI-SEO Fixes + World-Class 3D Redesign

**Status:** Approved (Phase 1 scope + city architecture + Phase 2 vision)
**Date:** 2026-06-20
**Author:** Brainstorming session with Varun

## Context

Kraft Mortgages (`kraftmortgages.ca`) is a Next.js 14 / TypeScript / Tailwind mortgage brokerage site serving BC, AB, and ON. A full codebase audit surfaced 7 CRITICAL bugs plus ~30 HIGH/MEDIUM issues across SEO, AI-SEO (GEO/AEO), code quality, performance, accessibility, and design consistency. This spec covers two phases: (1) fix the existing site so it ranks and gets cited by AI, and (2) rebuild it as a world-class, 3D-driven experience.

## Goals & Non-Goals

**Goals**
- Classic SEO: rank for "mortgage broker [city]" and calculator-intent searches across BC/AB/ON.
- AI-SEO (GEO/AEO): get cited by ChatGPT, Gemini, Claude, Perplexity when users ask mortgage questions.
- Conversion: stop leaking leads from broken links, fake phone numbers, and client-rendered pages.
- World-class visual redesign with a signature 3D moment (Phase 2).

**Non-Goals (Phase 1)**
- No visual/3D redesign (Phase 2).
- No new pages or calculators (only fix existing; dead service links redirect to real pages rather than build new ones).
- No design-system token overhaul (Phase 2 — tokens stay messy for now).
- Do not merge or build on the stale `redesign/terminal-v2` or `voice-implementation` branches in Phase 1.

## Guiding Principles
- **One source of truth** for business facts (NAP, hours, licensing, figures) — every page and schema reads from a single config.
- **Server-rendered by default** — interactive bits become client islands, not whole pages.
- **Fix forward** — when two systems conflict (e.g., static vs dynamic city pages), pick one and delete the other; don't band-aid both.
- **Ranking-safe 3D** (Phase 2) — WebGL surgically, static server-rendered content behind it, `prefers-reduced-motion` respected.

---

# PHASE 1 — Critical Fixes + SEO/AI-SEO Foundation

Goal: make the existing site rank, get cited by AI, and stop bleeding leads. No visual redesign. Ship in focused, reviewable batches.

## Workstream A — Stop the bleeding (CRITICAL, do first)

**A1. Replace `public/robots.txt` with a corrected `app/robots.ts`.**
Delete `public/robots.txt` (it overrides the App Router route and blocks all AI crawlers). Generate `app/robots.ts` that:
- Allows all general crawlers.
- **Explicitly allows** AI/answer-engine bots: `GPTBot`, `ChatGPT-User`, `Google-Extended`, `CCBot`, `anthropic-ai`, `ClaudeBot`, `PerplexityBot`, `Bytespider`, `Applebot-Extended`.
- Keeps sensible disallows: `/admin/*`, `/api/*`, `/dashboard/*`, `/old-design`, `/varun`, `/reports/*`, `/leads/*`.
- Removes `Disallow: /*?*` (kills UTM links and param-based calc results) and `Disallow: /search`.
- Declares the sitemap.
Remove the now-dead `generateRobotsTxt()` in `lib/seo/sitemap.ts` (dead code; never imported).

**A2. Fix the 15 fake phone numbers.**
Every city page renders `href="tel:+16045551234"` (a North-American placeholder that dials nothing). Replace with the real primary number `+1-604-593-1550`. Files (live source, not `.next` build output):
`mortgage-broker-{surrey,vancouver,burnaby,richmond,kelowna,kamloops,abbotsford,coquitlam,nanaimo,victoria,langley,calgary,edmonton,toronto,ottawa,red-deer,lethbridge,airdrie,windsor}/page.tsx`. (Note: many of these are deleted in Workstream D, but any that remain get the real number.)

**A3. Fix the 6 broken/wrong homepage links.**
In `app/(site)/page.tsx` Services section (the 6 service cards) and Calculator section. **Confirmed decisions (no ambiguity):**
- Construction Financing card: `href` `/construction-financing` → change to `/construction` (existing route).
- Self-Employed Solutions card: `href` `/self-employed-mortgages` → change to `/calculators/self-employed` (existing route; closest match). Keep the card.
- Purchase Financing card: `href` `/purchase-financing` → change to `/calculators/affordability` (existing route; closest match). Keep the card.
- Refinancing & Equity card: `href` `/refinancing` → change to `/equity-lending` (existing route).
- MLI Select Program card: `href` `/mli-select` → unchanged (valid).
- Private Lending card: `href` `/private-lending` → unchanged (valid).
- Business Funding card: `href` `/business-funding` → unchanged (valid).
- Calculator section "Payment Calculator" card: `href` `/calculators/affordability` → change to `/calculators/payment`.
- Calculator section "Investment ROI" card: `href` `/calculators/affordability` → change to `/calculators/investment`.

Rationale: every broken link is repointed to the closest existing route rather than removing cards — keeps the homepage's service coverage intact and routes users to real pages.

**A4. Remove the conflicting `/mli-select/calculators` 301 redirect.**
In `next.config.mjs`, delete the redirect block `source: '/mli-select/calculators' → destination: '/mli-select'`. The route `app/(site)/mli-select/calculators/page.tsx` exists and is linked from the homepage CTA "View All MLI Select Calculators". The permanent redirect tells Google the page is gone — a direct contradiction.

**A5. Fix the 404 schema images.**
In `app/layout.tsx` corporate schema: `"logo": "https://www.kraftmortgages.ca/assets/logo.png"` and `"image": [".../assets/hero.jpg"]` — neither `/assets/logo.png` nor `/assets/hero.jpg` exists (no `public/assets/` directory). Replace with real assets: `/kraft-logo.png` (exists) and a real hero/OG image we'll create. (See B6 for the OG image.)

## Workstream B — One source of truth for facts + schema

**B1. Create `lib/seo/business-config.ts`.**
A single typed object — the canonical source for all business facts. Fields:
- `name`, `legalName`, `url`, `domain`, `logoUrl`, `imageUrls[]`, `ogImageUrl`.
- NAP: `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`, `geo { lat, lng }` (one canonical coordinate set).
- `telephone` (primary), `secondaryPhone`, `email`.
- `areaServed[]` (provinces + cities).
- `openingHours[]` (one canonical schedule).
- `foundingDate`, `yearsExperience` (computed or stated), `fundedVolume` (one number — see B2), `lenderCount`, `clientsServed`.
- `licenses[]` (BCFSA #SR220230, RECA LIC-00655428, FSRA #12918) with regulator + region.
- `sameAs[]` (one canonical set of social profile URLs).
- `priceRange`.
Every page, every schema, every UI string referencing these facts imports from here. **This single change kills the $2B-vs-$5B, founding-date, hours, NAP, and social-link inconsistencies.**

**B2. Decide the canonical funded-volume figure.**
Current: `llms.txt` says $5B; everything else says $2B. **Decision: use $2B** (the widely-used figure; correct the `llms.txt` outlier in D1). Confirm with Varun before writing — if the real figure is different, B1 holds the truth.

**B3. Consolidate to ONE Organization/LocalBusiness schema.**
- Move the canonical schema into `app/layout.tsx`, using `business-config.ts`, with a stable `@id: https://www.kraftmortgages.ca/#organization` and `@type: ["Organization","LocalBusiness","MortgageBroker","FinancialService"]`.
- **Delete** the duplicate schema in `app/(site)/page.tsx` (lines ~111-208).
- **Delete** the schema in `app/(site)/about/layout.tsx` and `app/(site)/old-design/page.tsx`.
- All service/city pages **reference** the org via `@id` (`"@id": "https://www.kraftmortgages.ca/#organization"` or `"worksFor": { "@id": ... }`) instead of redefining a competing Organization/FinancialService graph.
- Wire up the previously-unused `buildWebSiteJsonLd()` (WebSite + SearchAction) and add it alongside the org schema for sitelinks-search-box eligibility.

**B4. Remove fabricated AggregateRating review counts.**
Delete the hardcoded `aggregateRating` blocks across:
- `app/(site)/page.tsx` (4.9/127), `calculators/a-vs-equity/page.tsx` (4.9/23), `calculators/b-vs-equity/page.tsx` (4.8/142), `calculators/refinance-vs-heloc-vs-second/page.tsx` (4.8/187).
These have no backing review pages, disagree with each other, and risk a Google manual action for fake review structured data. **Decision: delete for now.** When Varun provides genuine review data (Google reviews, Trustpilot), reintroduce a single defensible count from B1.

**B5. Delete the dead SEOHead component.**
`components/SEO/SEOHead.tsx` uses Pages-Router `next/head` in an App-Router project, is imported zero times, and hardcodes wrong values (`info@kraftmortgages.ca`, wrong phone, `/manifest.json`, non-existent images). Delete the file.

**B6. Create a real default OG image + favicon set.**
Create `/public/og-default.jpg` (1200×630) branded for social sharing, and set it as the `openGraph.images` default in `app/layout.tsx` (currently there is no `images` field — link previews have no image). Fix blog fallback `/images/blog-default.jpg` (doesn't exist).

## Workstream C — Server-rendered + indexable pages (the SEO core)

**C1. Convert the homepage from `"use client"` to a Server Component.**
`app/(site)/page.tsx` is a 799-line client component — the single biggest SEO defect (the whole page, including the 600-word SEO block and the JSON-LD, is client-rendered). Refactor:
- The page becomes a Server Component: holds all static content, schema (now via B3 it's in the layout, so the page script tag is removed), and structure.
- Extract interactive islands as separate `"use client"` components: the animated counters (`<StatsCounters/>`), the lead-capture modal (`<LeadModal/>`), and the hero animations (`<HeroCanvas/>` placeholder for Phase 2).
- Add a `metadata` export (homepage currently has none — it inherits only the generic root title).

**C2. Repeat server-component conversion for top traffic pages.**
Priority order (by traffic/intent value): `about`, `contact`, `calculators/page.tsx` (index), `mli-select/page.tsx`, then the key services (`construction`, `commercial`, `equity-lending`, `private-lending`, `residential`, `business-funding`). Goal: get the most important content server-rendered. (91 client pages total — we won't convert all in Phase 1; we convert the high-value subset and the rest get fixed in Workstream D / Phase 2.)

**C3. Add `generateMetadata` to every page that lacks it.**
Add explicit `metadata` exports (title, description, canonical, openGraph, twitter) to:
- Homepage (C1).
- All calculator `page.tsx` files that currently lack metadata and lack a sibling `layout.tsx`: `affordability`, `payment`, `pre-approval`, `renewal`, `self-employed`, `investment`, `construction-pro`, `mortgage-penalty`, `closing-costs`, `first-time-home-buyer`, `land-transfer-tax`, `stress-test`, `amortization`, `rent-vs-buy`, `down-payment`, `cmhc-insurance`, `debt-service-ratio`, `required-income`, and the `a-vs-equity`/`b-vs-equity` pages. These are high-intent commercial pages; they need dedicated titles/descriptions.
- All service pages and the dynamic city page (the latter has `generateMetadata` already — extend it with canonical + OG in D2).

**C4. Fix the fragile auto-canonical in `app/(site)/layout.tsx`.**
Current fallback builds canonical from `headers().get('x-next-url') || 'x-invoke-path'` — unreliable in current Next.js. Replace with a robust per-route canonical strategy (each page sets its own canonical via metadata; the fallback uses a stable default). `lang="en-CA"` on `<html>`.

## Workstream D — City-page consolidation (Section 2 decision)

**D1. Consolidate to the DYNAMIC city system.**
- Port the best unique copy from the 15 static `mortgage-broker-{city}/page.tsx` files into the `CITY_METADATA` map in `app/(site)/mortgage-broker-[city]/page.tsx`.
- Expand `generateStaticParams` to cover all 16 cities (currently 9): add Vancouver, Burnaby, Richmond, Langley, Toronto, Calgary, Edmonton (and any others in the static set).
- **Delete the 15 static client pages** + their `layout.tsx` files. Next.js will then route all `/mortgage-broker-{city}` URLs to the dynamic server component (which is already SEO-friendly and has per-city FAQs + regulatory data).

**D2. Add per-city schema.**
On the dynamic city page, emit:
- A `LocalBusiness`/`Service` node that **references** the org `@id` (not redefining it), with city-specific `areaServed`, and the canonical NAP from B1.
- An `FAQPage` node built from the per-city `faqs[]` array (the FAQs are already rendered visibly — they just need schema to become rich-result-eligible).

## Workstream E — Sitemap + technical SEO

**E1. Rewrite `lib/seo/sitemap.ts` to match actual routes.**
- **Add** the 7 missing cities: `toronto`, `vancouver`, `calgary`, `edmonton`, `burnaby`, `richmond`, `langley` (the biggest Canadian markets, currently absent from the sitemap).
- **Add** the ~25 missing calculators + service sub-pages that exist but aren't listed (down-payment, cmhc-insurance, required-income, refinance-break-even, self-employed-a-vs-b, rent-vs-buy, rate-comparison, extra-payments, debt-service-ratio, amortization, bc-speculation-tax, mortgage-penalty, closing-costs, first-time-home-buyer, construction/calculators/*, equity-lending/calculators/*, commercial/calculators/*, mli-select/{overview,benefits,scoring,faq,application-process,eligibility,compare-programs}).
- **Remove** the 4 non-existent MLI calculator URLs (`/mli-select/calculators`, `/amortization`, `/break-even`, `/dscr`) that will 404.
- Derive the static-route list from the actual `app/` directory tree (or a maintained manifest) so it can't drift again.

**E2. Switch sitemap from `force-dynamic` to ISR.**
`app/sitemap.ts` currently `export const dynamic = 'force-dynamic'` — every `/sitemap.xml` request hits Firestore. Change to `export const revalidate = 3600` (regenerate at most hourly) and give each route a real `lastmod` (not "now" on every generation, which trains crawlers to ignore lastmod).

**E3. Minor technical fixes.**
- `<html lang="en-CA">` (currently `lang="en"`) to match `og:locale: en_CA` and schema `inLanguage`.
- Remove the useless `<link rel="preconnect" href="https://www.kraftmortgages.ca">` (preconnecting to the origin you're already on wastes a connection slot).
- Standardize NAP address formatting to one canonical string in B1; audit pages still using `"301 1688..."` vs `"#301 - 1688..."`.

## Workstream F — Security + cleanup

**F1. Delete debug/test/make-admin routes.**
Remove from the app (they ship to production with weak guards):
- `app/api/debug-*` (debug, debug-env, debug-firebase, debug-run).
- `app/api/test-*` (test-ai, test-firebase, test-firebase-simple, test-run-creation).
- `app/api/make-admin/route.ts` (self-service privilege escalation, tagged "TEMPORARY - REMOVE AFTER SETUP").
- Empty route dirs: `app/voice-test/`, `app/voice-google-test/`, `app/voice-compare/`, `app/voice-ultimate/`.

**F2. `noindex` non-public pages.**
Add `robots: { index: false, follow: false }` metadata to `/old-design`, `/varun`, `/dashboard`, `/admin` (or remove them). `/old-design` currently ships a competing Organization schema.

**F3. Repo hygiene.**
- Add `apps/web/tsconfig.tsbuildinfo` to `.gitignore` and `git rm --cached` it (currently tracked; causes spurious diffs).
- Remove dead deps from `apps/web/package.json`: `react-tilt`, `lottie-react` (installed, zero imports).
- Update `.env.example` to document the AI/HubSpot/Meta/Thinkr vars that `.env.local` actually uses.

**F4. Rotate exposed secrets (out of scope for code; action for Varun).**
`.env.local` contains live production secrets in plaintext (Facebook page access token, FB app secret, Thinkr API key). The file is gitignored (not leaked via git), but if this machine is shared/lost these must be rotated. Flag to Varun; not a code change.

---

# PHASE 1 — Verification

How we know Phase 1 worked:
- `curl https://www.kraftmortgages.ca/robots.txt` shows AI bots **allowed**; `public/robots.txt` deleted.
- View-source of `/` shows the full homepage HTML (server-rendered content present without JS).
- No `604-555-1234` anywhere in source; all city pages show `604-593-1550`.
- All 6 homepage links resolve to real pages (no 404s).
- `https://www.kraftmortgages.ca/mli-select/calculators` loads the calculator index (not redirected).
- Google Rich Results Test on `/` shows ONE Organization entity (not 6), zero 404 images.
- `/sitemap.xml` includes Toronto/Vancouver/Calgary/Edmonton; excludes the 4 dead MLI URLs; cached (not hitting Firestore per request).
- `/old-design` returns `noindex`.
- `git status` no longer shows `tsconfig.tsbuildinfo`.

---

# PHASE 2 — World-Class 3D Redesign (Vision Roadmap)

Detailed spec written after Phase 1 ships. This section captures the approved direction.

## Concept: "The Gold Standard"
A mortgage site that feels like a premium fintech + a luxury brand. Dark, warm, confident. Gold as a living material (not just a color). Real spatial depth. Every interaction rewards attention. Current site is "Premium (upper)"; target is "world-class."

## Technical approach: Hybrid (R3F signature hero + CSS/Canvas elsewhere)
**Rationale:** Varun's #1 goal is ranking. All-WebGL sites tank Core Web Vitals (LCP/INP) and mobile performance, which directly hurts rankings. World-class sites (Linear, Vercel, Stripe, Apple) use WebGL surgically — one signature moment — and CSS/Canvas/Framer Motion elsewhere. This delivers the "never seen before" wow while keeping the site fast and indexable.

## Signature moments

**1. Bespoke React Three Fiber hero (the one "never seen before" moment).**
Replaces the current CSS floating ovals (`components/ui/shape-landing-hero.tsx`). Three concepts to refine/mock up in Phase 2 planning:
- **Liquid Gold** — cinematic fluid-gold shader responsive to cursor, headline floating above. Premium, abstract, brand-defining.
- **The Map** — stylized 3D topographic mesh of BC/AB/ON with gold light nodes at service cities; scroll morphs into property/house shapes. Tells the "we cover Canada" story spatially.
- **Particle Constellation** — thousands of gold particles forming the logo / a house / a key, dispersing and reforming on scroll.
Lazy-loaded `ssr: false`, `IntersectionObserver`-gated, `prefers-reduced-motion` → static fallback image, static server-rendered H1/content behind the canvas for bots.

**2. Scroll-driven storytelling on the homepage.**
Pin the hero; on scroll: stats count up in 3D space → "How It Works" unfolds as a connected path → services reveal with parallax depth → live rate/amortization data-viz (Canvas 2D + the already-installed `recharts`) animates. One choreographed narrative, not independent fades.

**3. Interactive financial moments.**
- Affordability visualizer (drag a slider, watch a Canvas-drawn house/price animate in real time) using existing calculator logic.
- Animated rate cards with subtle breathing/pulse.

**4. Design-system overhaul (the foundation).**
- **One token system** — consolidate `gold`/`amber`/`accentPalette`/`term-*` into a single documented palette. Fixes the broken `term-*` Footer (undefined CSS tokens).
- **Real typography** — self-host a display serif (Fraunces or Tiempos) for headlines + Inter for body via `next/font` (kills the render-blocking Google Fonts request). Define an actual type scale.
- **Shared chrome** — `<Navigation/>` + `<Footer/>` move into `app/(site)/layout.tsx`. Delete the 76 manual Navigation imports and the per-page footer reimplementations.
- **Micro-interactions library** — deploy existing-but-unused `MagneticButton` and `HolographicCard` site-wide. Route transitions via Framer `AnimatePresence`.

**5. Performance guardrails (so the 3D doesn't kill rankings).**
- WebGL only in the hero; `ssr:false` + `IntersectionObserver`-gated.
- Static H1 + content rendered server-side behind the canvas.
- `prefers-reduced-motion` → skip all WebGL/animations, static fallbacks.
- Lighthouse performance budget enforced; no regressions on LCP/INP/CLS vs Phase 1.

## Phase 2 sequencing (rough — refined in a dedicated Phase 2 spec)
1. Design-system foundation (tokens, fonts, shared chrome) — unlocks everything else.
2. Homepage rebuild with R3F hero + scroll story.
3. Service/calculator page redesigns on the new system.
4. City pages on the new system.
5. Polish: micro-interactions, page transitions, performance pass.

---

# Open Questions for Phase 1 Implementation
- **B2 funded volume:** confirm $2B is the correct canonical figure (llms.txt outlier says $5B). Default: use $2B.

# Resolved Decisions (locked, no further input needed)
- **A3 broken links:** every dead homepage link is repointed to the closest existing route (Construction→/construction, Self-Employed→/calculators/self-employed, Purchase→/calculators/affordability, Refinancing→/equity-lending); no cards removed.
- **B4 reviews:** fabricated AggregateRating counts are deleted now; reintroduce a single real count once genuine review data is provided.
- **D1 city pages:** consolidate to the dynamic system; delete the 15 static client pages.

# Out of Scope
- Merging or building on `redesign/terminal-v2` or `voice-implementation` branches (evaluate separately).
- The `openclaw-migration/` and `social-media-scripts-temp/` untracked dirs (not part of the site).
- New pages/calculators beyond fixing existing routes.
- Full design-system token overhaul (Phase 2).
