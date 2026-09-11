# Phase 1 — SEO/AI-SEO Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 7 CRITICAL bugs and ~30 HIGH/MEDIUM issues in the existing Kraft Mortgages site so it ranks on Google and gets cited by AI engines — with no visual/3D changes (that's Phase 2).

**Architecture:** Next.js 14 App Router. The core strategy is (1) a single typed `business-config.ts` that becomes the one source of truth for all facts and schema, (2) consolidating competing implementations into one each, (3) converting high-value `"use client"` pages to Server Components with client islands, and (4) deleting dead/debug code. All within the existing tech stack — no new dependencies.

**Tech Stack:** Next.js 14.2.21 (App Router), TypeScript 5.5, Tailwind 3.4, pnpm workspace. Validation gates: `pnpm --filter @kraft/web build` must succeed, `pnpm --filter @kraft/web lint` must pass.

**Spec:** `docs/superpowers/specs/2026-06-20-seo-fixes-and-world-class-redesign-design.md`

---

## ⚠️ Testing Adaptation (READ FIRST)

This codebase has **no test infrastructure** (no jest/vitest, zero `*.test.*` files). Writing a test runner from scratch for a config/SEO migration would be wasteful yak-shaving. The TDD principle is therefore adapted as follows for this plan:

- **"Write the failing test" →** "Write a verification step" that checks the bug exists or the contract holds (a `grep` for the bug, a `curl`, a `next build` run, or an inspection of rendered HTML).
- **"Run test to verify it fails" →** "Run the verification to confirm the bug/old state."
- **"Implement" →** same (make the change).
- **"Run test to verify it passes" →** "Run the verification to confirm the fix."
- **Commit after each task.**

Where a unit test *would* add real value (pure functions like the schema generators), we write one as a plain Node script under `apps/web/scripts/verify-*.mjs` that can be run directly with `node` — no framework needed. Do **not** introduce jest/vitest in this plan.

**All commands assume cwd = `apps/web` unless prefixed with a `cd`. The repo root is `C:/Users/varun/Documents/AI Application Development/kraft-mortgages`. Branch: work on a new branch off `docs/seo-redesign-spec` (or `main` if that's been merged) named `fix/phase1-seo`.**

---

## File Structure (what gets created/modified)

**Created:**
- `lib/seo/business-config.ts` — single typed source of truth for all business facts (B1).
- `lib/seo/jsonld.ts` — schema builders that read from `business-config.ts` (B3): `orgJsonLd()`, `websiteJsonLd()`, `breadcrumbJsonLd()`, `faqJsonLd()`.
- `components/seo/JsonLd.tsx` — tiny Server Component that renders a `<script type="application/ld+json">`.
- `components/home/StatsCounters.tsx` — client island extracted from homepage (C1).
- `components/home/LeadModal.tsx` — client island extracted from homepage (C1).
- `public/og-default.jpg` — default social share image (B6, binary asset).
- `public/llms-full.txt` — extended AI-ingestion doc (D-AI1).
- `scripts/verify-jsonld.mjs` — Node verification script for schema builders.

**Modified:**
- `app/layout.tsx` — single org + website schema, lang, og image, remove self-preconnect, remove inline schema (B3, B6, E3).
- `app/robots.ts` — rewrite to allow AI bots (A1).
- `next.config.mjs` — remove `/mli-select/calculators` redirect (A4).
- `app/(site)/page.tsx` — remove duplicate schema, fix 6 links, convert to Server Component (A3, B3, C1).
- `lib/seo/sitemap.ts` — add missing cities + calculators, remove drift (E1).
- `app/sitemap.ts` — `force-dynamic` → `revalidate` (E2).
- `app/(site)/layout.tsx` — robust canonical (C4).
- `app/(site)/mortgage-broker-[city]/page.tsx` — port 7 cities, expand static params, add schema (D1, D2).
- `.gitignore` — add `tsconfig.tsbuildinfo` (F3).

**Deleted:**
- `public/robots.txt` (A1).
- 15× `app/(site)/mortgage-broker-{city}/page.tsx` + their `layout.tsx` (D1).
- `components/SEO/SEOHead.tsx` (B5).
- `app/api/debug-*`, `app/api/test-*`, `app/api/make-admin` (F1).
- Dead deps `react-tilt`, `lottie-react` from `package.json` (F3).

---

## Task 1: Branch + verification baseline

**Files:** none (setup)

- [ ] **Step 1: Create the working branch**

Run from repo root:
```bash
cd "C:/Users/varun/Documents/AI Application Development/kraft-mortgages"
git checkout docs/seo-redesign-spec 2>/dev/null || git checkout main
git checkout -b fix/phase1-seo
```

- [ ] **Step 2: Confirm the build is currently green (baseline)**

```bash
cd apps/web
pnpm install
pnpm build
```
Expected: build succeeds (may have warnings). If it fails, stop and report — Phase 1 assumes a green starting point.

- [ ] **Step 3: Capture the current bug baseline for later comparison**

```bash
cd apps/web
grep -rl "555-1234" app components | grep -v node_modules > ../../phase1-baseline-fake-phones.txt
grep -c "use client" <(head -1 app/\(site\)/page.tsx) || true
ls public/robots.txt
```
Expected: `phase1-baseline-fake-phones.txt` lists ~15 files; `public/robots.txt` exists. Keep this file to compare at the end (delete it before final commit).

---

## Task 2 (Workstream A1): Unblock AI bots — rewrite robots

**Files:**
- Delete: `apps/web/public/robots.txt`
- Modify: `apps/web/app/robots.ts`

**Why:** `public/robots.txt` is a static file that overrides the App Router `app/robots.ts`. It currently `Disallow: /` for GPTBot, Google-Extended, CCBot, anthropic-ai, ChatGPT-User — blocking every AI engine. It also `Disallow: /*?*` which kills UTM links.

- [ ] **Step 1: Verify the bug exists**

```bash
cd apps/web
grep -E "GPTBot|Google-Extended|CCBot|anthropic-ai|ChatGPT-User" public/robots.txt
```
Expected: 5 matches, each followed by `Disallow: /`.

- [ ] **Step 2: Delete the static robots.txt**

```bash
cd apps/web
git rm public/robots.txt
```

- [ ] **Step 3: Rewrite `app/robots.ts` to allow AI bots**

Replace the entire contents of `apps/web/app/robots.ts` with:

```typescript
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.kraftmortgages.ca';

// AI / answer-engine crawlers we explicitly WELCOME for GEO/AEO.
// Without these, ChatGPT, Gemini, Claude, and Perplexity cannot read the site.
const AI_BOTS = [
  'GPTBot',          // OpenAI / ChatGPT
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended', // Gemini training + answer
  'CCBot',           // Common Crawl (Perplexity, others)
  'anthropic-ai',    // Claude
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'Applebot-Extended',
  'cohere-ai',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  const aiAllow = Object.fromEntries(
    AI_BOTS.map((ua) => [ua, { userAgent: ua, allow: '/' }])
  );

  return {
    rules: [
      // General rule: allow everything except internal/private surfaces.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/dashboard/*',
          '/old-design',
          '/varun',
          '/reports/*',
          '/leads/*',
          '/voice-test',
          '/voice-google-test',
          '/voice-compare',
          '/voice-ultimate',
        ],
      },
      // Explicitly allow each AI crawler (overrides any blanket block).
      ...Object.values(aiAllow),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 4: Verify the fix**

```bash
cd apps/web
pnpm build
```
Expected: build succeeds. Then start the server and check:
```bash
pnpm start &
sleep 5
curl -s http://localhost:3000/robots.txt
kill %1
```
Expected output: a robots.txt that has `User-agent: GPTBot` with `Allow: /`, `User-agent: Google-Extended` with `Allow: /`, etc., and a general `Disallow: /admin/*` block. **It must NOT contain `Disallow: /*?*` or `Disallow: /` for any AI bot.**

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/varun/Documents/AI Application Development/kraft-mortgages"
git add apps/web/app/robots.ts
git rm apps/web/public/robots.txt 2>/dev/null || true
git commit -m "fix(seo): unblock AI crawlers — rewrite robots.ts to allow GPTBot/Google-Extended/CCBot/anthropic-ai/PerplexityBot

public/robots.txt was Disallowing / for all major AI engines, making the
llms.txt strategy and all GEO/AEO work useless. Deleted the static file
(which overrode app/robots.ts) and rebuilt the App Router route to
explicitly welcome each AI crawler."
```

---

## Task 3 (Workstream A2): Fix fake phone numbers on city pages

**Files:**
- Modify: every `app/(site)/mortgage-broker-{city}/page.tsx` containing `604-555-1234`

**Why:** 15 city pages render `href="tel:+16045551234"` — a placeholder that dials nothing. (Some of these files will be deleted in Task 11 when we consolidate to the dynamic city system, but the static pages that *remain* after consolidation — coquitlam, nanaimo, victoria, red-deer, lethbridge, airdrie, windsor, langley — and the dynamic page must all use the real number. Fixing them all now is the safe baseline.)

- [ ] **Step 1: Verify the bug**

```bash
cd apps/web
grep -rl "604-555-1234\|6045551234" app | grep -v node_modules
```
Expected: ~15 files listed.

- [ ] **Step 2: Replace all fake numbers with the real primary number**

Run from `apps/web`:
```bash
find app -type f -name "*.tsx" ! -path "*/node_modules/*" -exec sed -i 's/604-555-1234/604-593-1550/g; s/6045551234/6045931550/g; s/+1-604-555-1234/+1-604-593-1550/g; s/+16045551234/+16045931550/g' {} +
```
On Windows Git Bash this works. If `sed -i` fails, use PowerShell:
```powershell
Get-ChildItem -Path app -Recurse -Filter *.tsx | ForEach-Object { (Get-Content $_.FullName) -replace '604-555-1234','604-593-1550' -replace '6045551234','6045931550' | Set-Content $_.FullName }
```

- [ ] **Step 3: Verify the fix**

```bash
cd apps/web
grep -r "555-1234\|5551234" app | grep -v node_modules || echo "CLEAN: no fake numbers remain"
```
Expected: `CLEAN: no fake numbers remain`.

- [ ] **Step 4: Build check**

```bash
cd apps/web && pnpm build
```
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app
git commit -m "fix(cities): replace fake 604-555-1234 placeholder with real number on city pages

Click-to-call on 15 city landing pages was dialing a North-American
placeholder number, losing calls and breaking NAP consistency."
```

---

## Task 4 (Workstream A3 + A4): Fix broken homepage links + remove redirect conflict

**Files:**
- Modify: `apps/web/app/(site)/page.tsx` (services array ~391-397, calculators array ~536-539)
- Modify: `apps/web/next.config.mjs` (remove the `/mli-select/calculators` redirect ~146-149)

- [ ] **Step 1: Verify the bug**

```bash
cd apps/web
grep -n "construction-financing\|self-employed-mortgages\|purchase-financing\|refinancing'" app/\(site\)/page.tsx
```
Expected: 4 matches (the 4 dead hrefs).

- [ ] **Step 2: Fix the 4 dead service-card hrefs**

In `apps/web/app/(site)/page.tsx`, in the services array (around lines 391-397), replace these four `href` values:
- `'/construction-financing'` → `'/construction'`
- `'/self-employed-mortgages'` → `'/calculators/self-employed'`
- `'/purchase-financing'` → `'/calculators/affordability'`
- `'/refinancing'` → `'/equity-lending'`

Leave `/mli-select`, `/private-lending`, `/business-funding` unchanged.

- [ ] **Step 3: Fix the 2 wrong calculator-card hrefs**

In the same file, calculator section (around lines 536-539), change:
- Payment Calculator card: `href: '/calculators/affordability'` → `href: '/calculators/payment'`
- Investment ROI card: `href: '/calculators/affordability'` → `href: '/calculators/investment'`

- [ ] **Step 4: Remove the `/mli-select/calculators` redirect in `next.config.mjs`**

In `apps/web/next.config.mjs`, delete this block (currently around lines 146-149):
```javascript
      {
        source: '/mli-select/calculators',
        destination: '/mli-select',
        permanent: true,
      },
```
The route `app/(site)/mli-select/calculators/page.tsx` exists and is linked from the homepage CTA "View All MLI Select Calculators". The 301 tells Google the page is permanently gone — a contradiction.

- [ ] **Step 5: Verify all 6 fixes**

```bash
cd apps/web
echo "--- dead service links (should be empty) ---"
grep -n "construction-financing\|self-employed-mortgages\|purchase-financing\|'/refinancing'" app/\(site\)/page.tsx || echo "NONE - good"
echo "--- calculator links (should show /payment and /investment) ---"
grep -n "calculators/payment\|calculators/investment" app/\(site\)/page.tsx
echo "--- mli redirect removed (should be empty) ---"
grep -n "mli-select/calculators'" next.config.mjs || echo "NONE - good"
```

- [ ] **Step 6: Build + runtime check**

```bash
cd apps/web && pnpm build && (pnpm start & sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/mli-select/calculators && echo "" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/calculators/payment && echo "" && kill %1)
```
Expected: `200` for `/mli-select/calculators` (no longer redirected), `200` for `/calculators/payment`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/app/\(site\)/page.tsx apps/web/next.config.mjs
git commit -m "fix(home): repoint 4 dead service links + 2 wrong calc links; remove conflicting mli-select/calculators redirect

Homepage service cards linked to /construction-financing, /self-employed-
mortgages, /purchase-financing, /refinancing — none of which exist (404).
Repointed to closest existing routes. Payment/Investment calc cards both
wrongly linked to /calculators/affordability. Removed the 301 that told
Google /mli-select/calculators was permanently gone."
```

---

## Task 5 (Workstream A5 + B6): Create real OG image + fix 404 schema images

**Files:**
- Create: `apps/web/public/og-default.jpg` (1200×630)
- Modify: `apps/web/app/layout.tsx` (schema image refs ~50-51; this task only fixes the image URLs; the full schema consolidation is Task 8)

- [ ] **Step 1: Generate the OG image**

Create a 1200×630 JPG branded image. Use any tool (Figma/Canva/Photoshop). Save as `apps/web/public/og-default.jpg`. It should contain: the Kraft logo, the tagline "Licensed Mortgage Broker • BC, AB & ON", on the dark slate/gold brand background. (If no design tool is available right now, export a frame from the existing homepage hero as a stopgap — Task 8's schema will reference it; a placeholder-but-present image is strictly better than a 404.)

- [ ] **Step 2: Fix the 404 schema image URLs in `app/layout.tsx`**

In `apps/web/app/layout.tsx`, in the `corporateSchemaGraph` object (~lines 50-51), change:
```typescript
    "logo": "https://www.kraftmortgages.ca/assets/logo.png",
    "image": ["https://www.kraftmortgages.ca/assets/hero.jpg"],
```
to:
```typescript
    "logo": "https://www.kraftmortgages.ca/kraft-logo.png",
    "image": ["https://www.kraftmortgages.ca/og-default.jpg"],
```
(Both `/kraft-logo.png` and `/og-default.jpg` now exist in `public/`.)

- [ ] **Step 3: Verify**

```bash
cd apps/web
ls -la public/kraft-logo.png public/og-default.jpg
grep -n "assets/logo.png\|assets/hero.jpg" app/layout.tsx || echo "CLEAN: no 404 image refs"
```
Expected: both files exist; grep returns CLEAN.

- [ ] **Step 4: Commit**

```bash
git add apps/web/public/og-default.jpg apps/web/app/layout.tsx
git commit -m "fix(seo): add real OG image, fix 404 schema image URLs

Corporate schema referenced /assets/logo.png and /assets/hero.jpg which 404
on every page (no public/assets/ dir). Added og-default.jpg for social
sharing; schema now points to existing files."
```

---

## Task 6 (Workstream B1): Create the single source of truth — `business-config.ts`

**Files:**
- Create: `apps/web/lib/seo/business-config.ts`

**Why:** Today the same business facts (NAP, hours, geo, funded volume, licenses, social links) are hardcoded inconsistently across ~30 files, producing contradictions ($2B vs $5B, "since 2002" vs founding date 2014, two LinkedIn slugs, etc). This file becomes the only place those facts live.

- [ ] **Step 1: Create `lib/seo/business-config.ts`**

Create `apps/web/lib/seo/business-config.ts` with this exact content:

```typescript
/**
 * SINGLE SOURCE OF TRUTH for all Kraft Mortgages business facts.
 *
 * Every page, schema, and UI string that references the business MUST import
 * from here. Do not hardcode NAP, hours, phone, funding figures, or social
 * links anywhere else. This eliminates the $2B-vs-$5B, founding-date, and
 * NAP inconsistencies documented in the Phase 1 audit.
 */

export const BUSINESS = {
  name: 'Kraft Mortgages Canada Inc.',
  legalName: 'Kraft Mortgages Canada Inc.',
  url: 'https://www.kraftmortgages.ca',
  domain: 'kraftmortgages.ca',
  logoUrl: 'https://www.kraftmortgages.ca/kraft-logo.png',
  ogImageUrl: 'https://www.kraftmortgages.ca/og-default.jpg',
  imageUrls: ['https://www.kraftmortgages.ca/og-default.jpg'],

  // NAP — one canonical format. Used everywhere.
  telephone: '+1-604-593-1550',           // primary, tel: links
  telephoneDisplay: '604-593-1550',
  secondaryPhone: '+1-604-727-1579',
  secondaryPhoneDisplay: '604-727-1579',
  email: 'varun@kraftmortgages.ca',
  address: {
    streetAddress: '#301 - 1688 152nd Street',
    addressLocality: 'Surrey',
    addressRegion: 'BC',
    postalCode: 'V4A 4N2',
    addressCountry: 'CA',
  },
  geo: { lat: 49.0326, lng: -122.8012 },  // Surrey office

  areaServed: [
    { type: 'Province', name: 'British Columbia' },
    { type: 'Province', name: 'Alberta' },
    { type: 'Province', name: 'Ontario' },
  ],
  citiesServed: [
    'Surrey', 'Vancouver', 'Burnaby', 'Richmond', 'Coquitlam',
    'Kelowna', 'Kamloops', 'Abbotsford', 'Nanaimo', 'Victoria', 'Langley',
    'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie',
    'Toronto', 'Ottawa', 'Windsor',
  ],

  openingHours: [
    { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' },
    { days: ['Saturday'], opens: '10:00', closes: '14:00' },
  ],

  // Headline figures — ONE number each. Defaults confirmed in spec.
  fundedVolume: '$2B+',                   // was inconsistent ($5B in llms.txt)
  fundedVolumeRaw: 2_000_000_000,
  yearsExperience: '18+ Years Combined Experience',
  yearsExperienceShort: '18+',
  lenderCount: '30+',
  clientsServed: '5,000+',
  foundingDate: '2014-01-01',             // legal incorporation; not "since 2002"

  priceRange: '$$',

  licenses: [
    { regulator: 'BCFSA', name: 'British Columbia Financial Services Authority', licenseNumber: 'SR220230' },
    { regulator: 'RECA',  name: 'Real Estate Council of Alberta',               licenseNumber: 'LIC-00655428' },
    { regulator: 'FSRA',  name: 'Financial Services Regulatory Authority of Ontario', licenseNumber: '12918' },
  ],

  // ONE canonical set of social profile URLs.
  sameAs: [
    'https://www.linkedin.com/company/kraft-mortgages-canada-inc',
    'https://www.facebook.com/kraftmortgages',
  ],

  inLanguage: 'en-CA',
} as const;

export type BusinessConfig = typeof BUSINESS;
```

- [ ] **Step 2: Verify it compiles**

```bash
cd apps/web && pnpm build
```
Expected: succeeds (the file is imported nowhere yet, but TS must accept it).

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/seo/business-config.ts
git commit -m "feat(seo): add business-config.ts — single source of truth for NAP, hours, figures, licenses

Kills the $2B-vs-$5B, founding-date, NAP-format, and social-link
inconsistencies documented across ~30 files in the audit. Every page and
schema will migrate to read from here in subsequent tasks."
```

---

## Task 7 (Workstream B3-prep): Create schema builders that read from `business-config.ts`

**Files:**
- Create: `apps/web/lib/seo/jsonld.ts`
- Create: `apps/web/components/seo/JsonLd.tsx`
- Create: `apps/web/scripts/verify-jsonld.mjs`

**Why:** Replaces the dead/inconsistent `lib/seo/schema.ts` builders with a small, correct set that reads from `business-config.ts` and always emits a stable `@id` so pages can reference the org instead of redefining it.

- [ ] **Step 1: Create `lib/seo/jsonld.ts`**

```typescript
import { BUSINESS } from './business-config';

const SITE = BUSINESS.url;
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;

/** The single canonical Organization/LocalBusiness graph. Rendered once in app/layout.tsx. */
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness', 'MortgageBroker', 'FinancialService'],
        '@id': ORG_ID,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE,
        logo: BUSINESS.logoUrl,
        image: BUSINESS.imageUrls,
        description: 'Licensed Canadian mortgage brokerage offering residential, commercial, construction, private lending, and equity lending solutions across BC, Alberta and Ontario.',
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        priceRange: BUSINESS.priceRange,
        foundingDate: BUSINESS.foundingDate,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS.address.streetAddress,
          addressLocality: BUSINESS.address.addressLocality,
          addressRegion: BUSINESS.address.addressRegion,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS.geo.lat,
          longitude: BUSINESS.geo.lng,
        },
        areaServed: BUSINESS.areaServed.map((a) => ({ '@type': a.type, name: a.name })),
        openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        hasCredential: BUSINESS.licenses.map((l) => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'license',
          name: `${l.regulator} Licensed Mortgage Brokerage`,
          licenseNumber: l.licenseNumber,
          recognizedBy: { '@type': 'Organization', name: l.name },
        })),
        sameAs: BUSINESS.sameAs,
      },
      // WebSite + SearchAction for sitelinks search box eligibility.
      websiteJsonLdGraph(),
    ],
  };
}

function websiteJsonLdGraph() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: 'Kraft Mortgages Canada',
    url: SITE,
    inLanguage: BUSINESS.inLanguage,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList. Used on any page with visible breadcrumbs. */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage. Builds from the same FAQs array the page renders visibly. */
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Service / LocalBusiness node for a CITY page. REFERENCES the org by @id
 * rather than redefining it — fixes the local-SEO fragmentation in the audit.
 */
export function cityServiceJsonLd(opts: {
  cityName: string;
  provinceName: string;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['FinancialService', 'Service'],
    '@id': `${opts.url}#service`,
    name: `Mortgage Broker ${opts.cityName}`,
    serviceType: 'Mortgage Brokerage',
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'City',
      name: opts.cityName,
      containedInPlace: { '@type': 'State', name: opts.provinceName },
    },
    url: opts.url,
    description: opts.description,
  };
}

export { ORG_ID, SITE_ID };
```

- [ ] **Step 2: Create `components/seo/JsonLd.tsx`**

```tsx
import React from 'react';

/**
 * Renders a JSON-LD script tag. Server Component safe (no "use client").
 * Usage: <JsonLd data={orgJsonLd()} />
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 3: Write the verification script `scripts/verify-jsonld.mjs`**

```javascript
// Verifies the schema builders produce valid, non-contradictory JSON-LD.
// Run: node scripts/verify-jsonld.mjs  (from apps/web)
import { orgJsonLd, faqJsonLd, breadcrumbJsonLd, cityServiceJsonLd, ORG_ID } from '../lib/seo/jsonld.ts';

const errors = [];

const org = orgJsonLd();
const orgNode = org['@graph'].find((n) => Array.isArray(n['@type']) ? n['@type'].includes('MortgageBroker') : n['@type'] === 'MortgageBroker');
if (!orgNode) errors.push('orgJsonLd: no MortgageBroker node');
if (orgNode && orgNode['@id'] !== ORG_ID) errors.push(`orgJsonLd: @id mismatch ${orgNode['@id']} vs ${ORG_ID}`);
if (orgNode && !orgNode.telephone?.includes('604-593-1550')) errors.push('orgJsonLd: wrong telephone');
if (orgNode && !orgNode.logo?.endsWith('kraft-logo.png')) errors.push('orgJsonLd: wrong logo url');

const faq = faqJsonLd([{ question: 'Q?', answer: 'A.' }]);
if (faq['@type'] !== 'FAQPage' || !Array.isArray(faq.mainEntity)) errors.push('faqJsonLd: bad shape');

const bc = breadcrumbJsonLd([{ name: 'Home', url: 'https://x' }]);
if (bc['@type'] !== 'BreadcrumbList') errors.push('breadcrumbJsonLd: bad shape');

const city = cityServiceJsonLd({ cityName: 'Surrey', provinceName: 'BC', url: 'https://x/surrey', description: 'd' });
if (!city.provider || city.provider['@id'] !== ORG_ID) errors.push('cityServiceJsonLd: must reference org @id, not redefine org');

if (errors.length) {
  console.error('❌ JSON-LD verification failed:');
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('✅ JSON-LD builders verified:', { orgId: ORG_ID, hasWebsite: !!org['@graph'].find(n => n['@type'] === 'WebSite') });
```

- [ ] **Step 4: Run the verification**

```bash
cd apps/web && node --experimental-strip-types scripts/verify-jsonld.mjs
```
If `--experimental-strip-types` isn't available on the installed Node version, instead compile a quick check by importing within a `.ts` and running `pnpm exec tsc --noEmit lib/seo/jsonld.ts`. Expected: `✅ JSON-LD builders verified`.

- [ ] **Step 5: Build**

```bash
cd apps/web && pnpm build
```
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/seo/jsonld.ts apps/web/components/seo/JsonLd.tsx apps/web/scripts/verify-jsonld.mjs
git commit -m "feat(seo): add jsonld.ts builders + JsonLd component reading from business-config

Replaces the dead lib/seo/schema.ts builders with a correct, minimal set.
City/service pages can now reference the org by @id instead of redefining
competing Organization graphs."
```

---

## Task 8 (Workstream B3): Consolidate to ONE org schema in `app/layout.tsx`

**Files:**
- Modify: `apps/web/app/layout.tsx` (replace inline corporateSchemaGraph with orgJsonLd; lang=en-CA; remove self-preconnect; add og image)

- [ ] **Step 1: Rewrite the schema section of `app/layout.tsx`**

In `apps/web/app/layout.tsx`:
1. Add imports at top (after existing imports):
```typescript
import { orgJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { BUSINESS } from '@/lib/seo/business-config';
```
2. Delete the entire `const corporateSchemaGraph = { ... }` block (currently ~lines 45-93).
3. Replace the `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(corporateSchemaGraph) }} />` line (~104-106) with:
```tsx
        <JsonLd data={orgJsonLd()} />
```
4. Change `<html lang="en" className="dark">` → `<html lang="en-CA" className="dark">`.
5. Delete `<link rel="preconnect" href="https://www.kraftmortgages.ca" />` (self-preconnect, useless).
6. In the `metadata` export's `openGraph` block, add:
```typescript
    images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
```
7. In the `metadata` export, update `title`/`description` if they reference figures to read from BUSINESS (optional but recommended; the existing strings are fine to leave if accurate).

- [ ] **Step 2: Verify**

```bash
cd apps/web
grep -n "corporateSchemaGraph" app/layout.tsx && echo "FAIL: old schema still present" || echo "OK: old inline schema removed"
grep -n "orgJsonLd\|lang=\"en-CA\"\|ogImageUrl" app/layout.tsx
grep -n "preconnect.*kraftmortgages" app/layout.tsx && echo "FAIL: self-preconnect still present" || echo "OK: self-preconnect removed"
pnpm build
```
Expected: old schema gone; new refs present; build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/layout.tsx
git commit -m "refactor(seo): consolidate to single org+website schema in root layout

Replaced the inline corporate schema with orgJsonLd() (reads from
business-config.ts). Added og:image, lang=en-CA, removed self-preconnect.
This is now the ONLY Organization graph on the site; all other pages will
reference it by @id instead of redefining it."
```

---

## Task 9 (Workstream B3 + B4): Remove the duplicate homepage schema + fabricated reviews

**Files:**
- Modify: `apps/web/app/(site)/page.tsx` (remove the ~111-208 organizationSchema block and its render at ~212-215; also remove any aggregateRating-style copy if present — the homepage's reviews live in the deleted schema block)

- [ ] **Step 1: Remove the duplicate schema from the homepage**

In `apps/web/app/(site)/page.tsx`:
1. Delete the entire `const organizationSchema = { ... }` block (currently ~lines 111-208).
2. Delete the render block:
```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
```
(currently ~lines 212-215). The org schema now lives only in `app/layout.tsx` (Task 8).
3. This also removes the homepage's fabricated `aggregateRating: { ratingValue: "4.9", reviewCount: "127" }` (it was inside the deleted block).

- [ ] **Step 2: Remove fabricated AggregateRating from the 3 calculator pages**

In each of these files, find and delete the `aggregateRating` object inside their schema:
- `apps/web/app/(site)/calculators/a-vs-equity/page.tsx` (~line 585: `4.9, 23`)
- `apps/web/app/(site)/calculators/b-vs-equity/page.tsx` (~line 543: `4.8, 142`)
- `apps/web/app/(site)/calculators/refinance-vs-heloc-vs-second/page.tsx` (~line 562: `4.8, 187`)

For each: locate the `"aggregateRating": { ... }` property within the JSON-LD object literal and delete that property (mind the trailing comma). These have no backing review pages and disagree with each other — a Google manual-action risk.

- [ ] **Step 3: Verify**

```bash
cd apps/web
grep -n "organizationSchema" app/\(site\)/page.tsx && echo "FAIL" || echo "OK: homepage duplicate schema removed"
grep -rn "aggregateRating" app/\(site\) | grep -v node_modules && echo "FAIL: fabricated reviews remain" || echo "OK: all aggregateRating removed"
pnpm build
```
Expected: homepage schema removed; no `aggregateRating` anywhere under `(site)`; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app
git commit -m "fix(seo): remove duplicate homepage org schema + fabricated aggregateRating counts

Homepage was emitting a second Organization/LocalBusiness graph that
contradicted the root layout's (different priceRange, hours, geo, logo).
Removed it; the layout's orgJsonLd() is now the single source. Deleted
fabricated review counts (4.9/127, 4.9/23, 4.8/142, 4.8/187) that had no
backing review pages — manual-action risk."
```

---

## Task 10 (Workstream B3 + B5): Delete dead SEOHead + remaining stray schemas

**Files:**
- Delete: `apps/web/components/SEO/SEOHead.tsx`
- Modify: `apps/web/app/(site)/about/layout.tsx` (remove its org schema)
- Modify: `apps/web/app/(site)/old-design/page.tsx` (remove its org schema; this page gets noindex'd in Task 15)

- [ ] **Step 1: Verify SEOHead is unused**

```bash
cd apps/web
grep -rn "SEOHead\|components/SEO/SEOHead" app components | grep -v node_modules | grep -v "SEOHead.tsx"
```
Expected: no matches (it's dead code). If there ARE matches, stop and wire those usages to `<JsonLd>` + `generateMetadata` instead of deleting.

- [ ] **Step 2: Delete SEOHead**

```bash
cd apps/web && git rm components/SEO/SEOHead.tsx
```

- [ ] **Step 3: Remove the org schema from `app/(site)/about/layout.tsx`**

Open `apps/web/app/(site)/about/layout.tsx`. Find the JSON-LD schema block (~lines 6-34) that defines a standalone Organization graph and delete the entire schema render (the `<script>` tag and the object literal). Keep the metadata export. The org is now provided by `app/layout.tsx`. If about needs its own page-level schema later, it can reference `ORG_ID`.

- [ ] **Step 4: Remove the org schema from `app/(site)/old-design/page.tsx`**

Open `apps/web/app/(site)/old-design/page.tsx`. Find the Organization schema (~line 491) and delete it. (This page will be `noindex`'d in Task 15 and likely deleted in Phase 2.)

- [ ] **Step 5: Verify there's exactly ONE org schema source**

```bash
cd apps/web
echo "--- files still defining @type Organization/LocalBusiness/MortgageBroker (should be ONLY jsonld.ts + layout.tsx) ---"
grep -rln '"@type".*Organization\|MortgageBroker\|LocalBusiness\|FinancialService' app components lib | grep -v node_modules
pnpm build
```
Expected: only `lib/seo/jsonld.ts`, `lib/seo/schema.ts` (the old file — leave it for now, it's dead; deleted in a later cleanup), and `app/layout.tsx`. Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A apps/web
git commit -m "refactor(seo): delete dead SEOHead component + stray about/old-design org schemas

SEOHead used Pages-Router next/head in an App-Router project, was imported
zero times, and hardcoded wrong values. Removed competing org schemas from
about/layout and old-design so the root layout's orgJsonLd() is unambiguous."
```

---

## Task 11 (Workstream D1): Consolidate city pages to the dynamic system

**Files:**
- Modify: `apps/web/app/(site)/mortgage-broker-[city]/page.tsx` (port 7 more cities' metadata + FAQs; expand generateStaticParams to all 16)
- Delete: 15× `app/(site)/mortgage-broker-{city}/page.tsx` + their `layout.tsx`

**Why:** Today there are TWO parallel systems for city URLs — a well-built dynamic server component (`[city]`) shadowed by 15 thinner static `"use client"` pages. The static pages win routing for the 9 overlap cities, so the good (server-rendered, metadata'd, FAQ'd) page never gets served. We consolidate to the dynamic one.

This is the biggest irreversible change in Phase 1. Do it carefully.

- [ ] **Step 1: Inventory what unique copy must be ported**

Read each of the 7 static pages for cities NOT already in `CITY_METADATA` (coquitlam, nanaimo, victoria, red-deer, lethbridge, airdrie, windsor, langley). Note any unique services/FAQs/copy to port. The existing 9 in `CITY_METADATA` (surrey, vancouver, burnaby, richmond, kelowna, calgary, edmonton, toronto, ottawa) are already good.

```bash
cd apps/web
ls app/\(site\)/mortgage-broker-*/page.tsx | grep -v "\[city\]"
```

- [ ] **Step 2: Port the 7 missing cities into `CITY_METADATA`**

In `apps/web/app/(site)/mortgage-broker-[city]/page.tsx`, add these 7 entries to the `CITY_METADATA` record (after the existing `ottawa` entry, before the closing `}`):

```typescript
  coquitlam: {
    name: 'Coquitlam',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Coquitlam's Trusted Mortgage Brokerage",
    description: "Navigate Coquitlam's growing market — from Burke Mountain to Lougheed — with expert mortgage strategies and the lowest available rates.",
    marketOverview: "Coquitlam is one of Metro Vancouver's fastest-growing communities, with major transit-oriented development around the Evergreen Line. Strong demand from families and investors makes pre-approval essential.",
    faqs: [
      { question: "How do Burke Mountain pre-sales affect mortgage approval?", answer: "Pre-sale assignments and completion timing require careful lender coordination. We structure your approval around the builder's closing schedule so there are no surprises at occupancy." },
      { question: "Are there first-time buyer programs specific to Coquitlam?", answer: "You can combine the federal First Home Savings Account (FHSA) with the BC First-Time Home Buyers' Program property transfer tax exemption for properties under the qualifying value threshold." }
    ]
  },
  nanaimo: {
    name: 'Nanaimo',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Nanaimo's Premier Mortgage Brokerage",
    description: "Vancouver Island's Harbour City offers affordable entry points — secure the right financing for your Nanaimo home or investment.",
    marketOverview: "Nanaimo attracts mainland buyers seeking affordability and island lifestyle, keeping demand steady. From waterfront condos to rural acreages, we match you with lenders who understand Vancouver Island properties.",
    faqs: [
      { question: "Can I finance a waterfront or water-access property in Nanaimo?", answer: "Yes — some lenders impose restrictions on waterfront or unique properties. We work with lenders familiar with island and waterfront valuations to ensure smooth approval." },
      { question: "What about septic systems and wells?", answer: "Rural Nanaimo properties with septic or well water need a satisfactory inspection for most lenders. We identify lenders flexible on these requirements." }
    ]
  },
  victoria: {
    name: 'Victoria',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Victoria's Premier Mortgage Brokerage",
    description: "Capital city expertise for heritage homes, condos, and tight-market purchases across Greater Victoria.",
    marketOverview: "Victoria's stable government-driven economy and constrained supply make it a competitive market. Heritage properties and strict rental regulations require a broker who knows the local lender landscape.",
    faqs: [
      { question: "Do heritage homes in Victoria need special financing?", answer: "Heritage-designated properties can require additional appraisal scrutiny. We use appraisers familiar with Victoria's historic districts and lenders comfortable with these property types." },
      { question: "How does Victoria's rental restriction bylaw affect investment financing?", answer: "Victoria's restrictions on short-term rentals influence how lenders assess rental income. We structure investment applications to reflect compliant, long-term rental projections." }
    ]
  },
  'red-deer': {
    name: 'Red Deer',
    province: 'Alberta',
    regulatoryBody: 'RECA',
    license: 'RECA License #LIC-00655428',
    heading: "Red Deer's Trusted Mortgage Brokerage",
    description: "Central Alberta's hub — affordable housing and strong rental yields. Get the right financing for your Red Deer property.",
    marketOverview: "Red Deer sits between Calgary and Edmonton with affordable home prices and steady demand from families and investors. Its central location supports a stable rental market.",
    faqs: [
      { question: "Is Red Deer a good market for investment properties?", answer: "Yes — Red Deer's affordability and rental demand make it attractive for investors. We work with lenders that recognize up to 80% of rental income for qualification." },
      { question: "What RECA disclosures apply in Alberta?", answer: "As a RECA-licensed brokerage we provide full disclosure of lender relationships, compensation, and mortgage terms on every Alberta transaction." }
    ]
  },
  lethbridge: {
    name: 'Lethbridge',
    province: 'Alberta',
    regulatoryBody: 'RECA',
    license: 'RECA License #LIC-00655428',
    heading: "Lethbridge's Trusted Mortgage Brokerage",
    description: "Southern Alberta affordability — finance your Lethbridge home or investment with confidence.",
    marketOverview: "Lethbridge offers some of Alberta's most affordable housing with a stable economy driven by agriculture, education, and healthcare. Strong first-time-buyer and investor demand.",
    faqs: [
      { question: "What down payment is required in Lethbridge?", answer: "Standard Canadian rules apply: 5% on the first $500K, 10% to $999,999, and 20% on $1M+ or investment/rental properties." },
      { question: "Can self-employed buyers qualify in Lethbridge?", answer: "Yes — we offer stated-income and alternative-verification programs for Alberta entrepreneurs and contractors who don't fit traditional bank criteria." }
    ]
  },
  airdrie: {
    name: 'Airdrie',
    province: 'Alberta',
    regulatoryBody: 'RECA',
    license: 'RECA License #LIC-00655428',
    heading: "Airdrie's Trusted Mortgage Brokerage",
    description: "Calgary's thriving neighbor — affordable family homes and quick commutes. Get pre-approved today.",
    marketOverview: "Airdrie is one of Alberta's fastest-growing cities, attracting Calgary commuters with affordable family housing. New construction and move-up buyers dominate the market.",
    faqs: [
      { question: "Can I finance new construction in Airdrie?", answer: "Yes — we structure progressive draw mortgages with Airdrie and Calgary-area builders, managing holdback requirements and completion timelines." },
      { question: "Does an Airdrie property qualify differently than Calgary?", answer: "Underwriting is similar; Airdrie's strong absorption and growth metrics are well-regarded by lenders. We optimize based on your specific neighbourhood." }
    ]
  },
  windsor: {
    name: 'Windsor',
    province: 'Ontario',
    regulatoryBody: 'FSRA',
    license: 'FSRA License #12918',
    heading: "Windsor's Trusted Mortgage Brokerage",
    description: "Canada's southernmost city — affordable entry points and a rebounding economy. Secure your Windsor mortgage.",
    marketOverview: "Windsor offers among Ontario's most affordable home prices, supported by a resurgent manufacturing and EV-battery sector. Cross-border and newcomer buyers are a growing segment.",
    faqs: [
      { question: "I'm a newcomer to Canada buying in Windsor — what programs are available?", answer: "Newcomer programs allow financing with as little as 5-15% down using alternative income and credit documentation. We match you with lenders specializing in new-Canadian financing." },
      { question: "How does Windsor's affordability affect stress-test qualification?", answer: "Lower home prices mean lower mortgage amounts, which can make the stress test easier to pass. We model both insured and insurable scenarios to maximize your approval." }
    ]
  },
  langley: {
    name: 'Langley',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Langley's Premier Mortgage Brokerage",
    description: "Fraser Valley growth — from Willoughby townhomes to acreages. Finance your Langley property with local expertise.",
    marketOverview: "Langley is a Fraser Valley hot spot with rapid townhome and condo development in Willoughby and township acreages to the south. Strong demand from Vancouver-bound move-out buyers.",
    faqs: [
      { question: "Can I finance an acreage property in Langley Township?", answer: "Acreages over a few acres or with outbuildings may require rural-specialist lenders. We have lenders that finance larger parcels, hobby farms, and equestrian properties." },
      { question: "How do Langley pre-sale assignments work for financing?", answer: "Assignment financing differs from standard purchases. We coordinate with the assignor, builder, and lender to structure an approval that aligns with the assignment closing." }
    ]
  }
```

- [ ] **Step 3: Expand `generateStaticParams` to all 16 cities**

In the same file, replace the `generateStaticParams` function body's array with:
```typescript
  return [
    // BC
    { city: 'surrey' },
    { city: 'vancouver' },
    { city: 'burnaby' },
    { city: 'richmond' },
    { city: 'coquitlam' },
    { city: 'langley' },
    { city: 'kelowna' },
    { city: 'kamloops' },
    { city: 'abbotsford' },
    { city: 'nanaimo' },
    { city: 'victoria' },
    // Alberta
    { city: 'calgary' },
    { city: 'edmonton' },
    { city: 'red-deer' },
    { city: 'lethbridge' },
    { city: 'airdrie' },
    // Ontario
    { city: 'toronto' },
    { city: 'ottawa' },
    { city: 'windsor' },
  ];
```

- [ ] **Step 4: Delete the 15 static city pages + their layouts**

```bash
cd apps/web
for city in surrey vancouver burnaby richmond coquitlam langley kelowna kamloops abbotsford nanaimo victoria calgary edmonton red-deer lethbridge airdrie toronto ottawa windsor; do
  rm -rf "app/(site)/mortgage-broker-$city"
done
echo "--- remaining city dirs (should only be the dynamic [city]) ---"
ls app/\(site\)/ | grep "mortgage-broker"
```
Expected: only `mortgage-broker-[city]` remains.

- [ ] **Step 5: Build + spot-check routing**

```bash
cd apps/web && pnpm build
```
Expected: succeeds, and the build output lists `● /mortgage-broker-[city]` as a statically-generated route with all 19 params prerendered.

Then runtime check (each should be 200 and server-rendered HTML):
```bash
pnpm start & sleep 5
for city in surrey vancouver calgary toronto coquitlang; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/mortgage-broker-$city")
  echo "$city -> $code"
done
curl -s http://localhost:3000/mortgage-broker-surrey | grep -o "Surrey's.*Brokerage" | head -1
kill %1
```
Expected: known cities → 200; `coquitlang` (typo) → 404 (proves dynamic 404 works); the grep finds the H1 in raw HTML (proves server-rendered).

- [ ] **Step 6: Commit**

```bash
git add -A apps/web
git commit -m "refactor(cities): consolidate to dynamic mortgage-broker-[city], delete 15 static client pages

The well-built dynamic server component (per-city metadata, FAQs, regulator
data) was being shadowed by thinner static 'use client' pages for the 9
overlap cities. Ported the 7 missing cities (coquitlam, nanaimo, victoria,
red-deer, lethbridge, airdrie, windsor, langley) into CITY_METADATA,
expanded generateStaticParams to all 19 cities, deleted the 15 static pages.
All city URLs are now server-rendered from one codebase."
```

---

## Task 12 (Workstream D2): Add city-page LocalBusiness + FAQ schema

**Files:**
- Modify: `apps/web/app/(site)/mortgage-broker-[city]/page.tsx` (add JsonLd for the city service + FAQ)

- [ ] **Step 1: Add the schema imports + render**

In `apps/web/app/(site)/mortgage-broker-[city]/page.tsx`:
1. Add imports at top:
```typescript
import { JsonLd } from '@/components/seo/JsonLd';
import { cityServiceJsonLd, faqJsonLd } from '@/lib/seo/jsonld';
import { BUSINESS } from '@/lib/seo/business-config';
```
2. In `generateMetadata`, add `alternates.canonical` and `openGraph`:
```typescript
  const canonical = `https://www.kraftmortgages.ca/mortgage-broker-${targetCityNormalized}`;
  return {
    title: `${meta.name} Mortgage Broker | Best Rates | Kraft Mortgages`,
    description: `Get the absolute lowest mortgage rates in ${meta.name}, ${meta.province}. Trusted mortgage broker with customized solutions.`,
    alternates: { canonical },
    openGraph: {
      title: `${meta.name} Mortgage Broker | Kraft Mortgages`,
      description: meta.description,
      url: canonical,
      type: 'website',
      locale: 'en_CA',
    },
  };
```
3. In the component body (inside the `<>` fragment, right after `<Navigation />`), add:
```tsx
      <JsonLd data={cityServiceJsonLd({
        cityName: meta.name,
        provinceName: meta.province,
        url: `https://www.kraftmortgages.ca/mortgage-broker-${targetCityNormalized}`,
        description: meta.description,
      })} />
      <JsonLd data={faqJsonLd(meta.faqs)} />
```

- [ ] **Step 2: Verify the schema renders**

```bash
cd apps/web && pnpm build && (pnpm start & sleep 5)
curl -s http://localhost:3000/mortgage-broker-calgary | grep -o 'application/ld+json[^<]*' | head -3
curl -s http://localhost:3000/mortgage-broker-calgary | grep -o '"@type":"FAQPage"' | head -1
curl -s http://localhost:3000/mortgage-broker-calgary | grep -o '"@id":"https://www.kraftmortgages.ca/#organization"' | head -1
kill %1
```
Expected: JSON-LD blocks present; FAQPage present; the city service node references the org `@id` (not redefining an org).

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/\(site\)/mortgage-broker-\[city\]/page.tsx
git commit -m "feat(seo): add city Service + FAQ schema with canonical/OG to dynamic city pages

Each city page now emits a FinancialService/Service node that references
the org by @id (instead of redefining a competing org) and an FAQPage built
from the same FAQs rendered visibly. Rich-result eligibility for city FAQs."
```

---

## Task 13 (Workstream E1): Fix the sitemap to match real routes

**Files:**
- Modify: `apps/web/lib/seo/sitemap.ts`

- [ ] **Step 1: Add the 8 missing cities + ~17 missing calculators; the MLI routes are already correct (verified — they exist).**

In `apps/web/lib/seo/sitemap.ts`:
1. Replace the `LOCATION_PAGES` array with all 19 cities:
```typescript
const LOCATION_PAGES = [
  'surrey','vancouver','burnaby','richmond','coquitlam','langley',
  'kelowna','kamloops','abbotsford','nanaimo','victoria',
  'calgary','edmonton','red-deer','lethbridge','airdrie',
  'toronto','ottawa','windsor',
].map((c) => ({ url: `/mortgage-broker-${c}`, priority: 0.7, changeFrequency: 'monthly' as const }));
```
2. Add the missing calculators to `CORE_CALCULATORS` (the existing ones are correct; append these):
```typescript
  { url: '/calculators/a-vs-equity', priority: 0.85, changeFrequency: 'weekly' as const },
  { url: '/calculators/b-vs-equity', priority: 0.85, changeFrequency: 'weekly' as const },
  { url: '/calculators/self-employed-a-vs-b', priority: 0.85, changeFrequency: 'weekly' as const },
  { url: '/calculators/refinance-vs-heloc-vs-second', priority: 0.85, changeFrequency: 'weekly' as const },
  { url: '/calculators/rent-vs-buy', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/rate-comparison', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/extra-payments', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/debt-service-ratio', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/down-payment', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/cmhc-insurance', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/required-income', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/amortization', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/calculators/bc-speculation-tax', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/calculators/stress-test', priority: 0.8, changeFrequency: 'weekly' as const },
```
3. Add the missing construction calculator `builder-program` to `CONSTRUCTION_CALCULATORS`:
```typescript
  { url: '/construction/calculators/builder-program', priority: 0.8, changeFrequency: 'weekly' as const },
```
4. Add the business-funding page to `SERVICE_HUBS` (it exists, wasn't listed):
```typescript
  { url: '/business-funding', priority: 0.85, changeFrequency: 'weekly' as const },
```
5. Delete the `PROVINCE_PAGES` array and its usage in `generateSitemap` (the `/provinces/bc|ab|on` routes don't exist — verified by the route glob; remove to avoid 404s in the sitemap).

- [ ] **Step 2: Verify no sitemap URL 404s**

```bash
cd apps/web && pnpm build && (pnpm start & sleep 8)
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g' | sort -u > /tmp/sitemap-urls.txt
echo "Total URLs: $(wc -l < /tmp/sitemap-urls.txt)"
# Spot-check a sample of each route type
for u in http://localhost:3000/mortgage-broker-windsor http://localhost:3000/calculators/bc-speculation-tax http://localhost:3000/calculators/rent-vs-buy http://localhost:3000/business-funding http://localhost:3000/provinces/bc; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code}' $u)"
done
kill %1
```
Expected: real routes → 200; `/provinces/bc` → 404 (confirming removal was needed; it should NOT appear in the sitemap output). Confirm `/mortgage-broker-windsor`, `/calculators/bc-speculation-tax`, `/calculators/rent-vs-buy` are all 200.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/seo/sitemap.ts
git commit -m "fix(seo): sitemap now matches real routes — add 8 cities + 14 calculators, remove 404 province pages

Added toronto/vancouver/calgary/edmonton/burnaby/richmond/coquitlam/langley
(the 4 biggest Canadian markets were missing) + 14 missing calculators.
Removed non-existent /provinces/* routes. Added /business-funding."
```

---

## Task 14 (Workstream E2 + C4): Sitemap ISR + robust canonical

**Files:**
- Modify: `apps/web/app/sitemap.ts` (`force-dynamic` → `revalidate`)
- Modify: `apps/web/app/(site)/layout.tsx` (remove fragile header-based canonical)

- [ ] **Step 1: Switch the sitemap to ISR**

In `apps/web/app/sitemap.ts`, replace:
```typescript
export const dynamic = 'force-dynamic';
```
with:
```typescript
export const revalidate = 3600; // regenerate at most hourly (ISR), not on every request
```

- [ ] **Step 2: Remove the fragile header-based canonical in `app/(site)/layout.tsx`**

Replace the entire contents of `apps/web/app/(site)/layout.tsx` with:
```typescript
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```
(The old `generateMetadata` built the canonical from `headers().get('x-next-url')` which is unreliable. Each page now sets its own canonical via its own `generateMetadata` / `metadata` export — see Task 12 for the city pages and Task 16 for the homepage.)

- [ ] **Step 3: Verify**

```bash
cd apps/web
grep -n "force-dynamic\|x-next-url\|x-invoke-path" app/sitemap.ts app/\(site\)/layout.tsx && echo "FAIL: old patterns remain" || echo "OK"
pnpm build
```
Expected: clean; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/sitemap.ts apps/web/app/\(site\)/layout.tsx
git commit -m "perf(seo): sitemap ISR (revalidate 3600) instead of force-dynamic; drop fragile header-based canonical

force-dynamic made every /sitemap.xml hit Firestore. Now regenerated at most
hourly. Removed the unreliable x-next-url/x-invoke-path canonical fallback
in (site)/layout — each page now owns its own canonical."
```

---

## Task 15 (Workstream F1 + F2): Delete debug/test routes + noindex private pages

**Files:**
- Delete: `apps/web/app/api/debug*`, `apps/web/app/api/test-*`, `app/api/make-admin`, empty `app/voice-*` dirs
- Modify: `apps/web/app/(site)/old-design/page.tsx`, `app/(site)/varun/page.tsx`, `app/dashboard/page.tsx`, `app/(site)/admin/layout.tsx` (add noindex metadata)

- [ ] **Step 1: Delete debug/test/make-admin routes**

```bash
cd apps/web
git rm -r app/api/debug app/api/debug-env app/api/debug-firebase app/api/debug-run 2>/dev/null
git rm -r app/api/test-ai app/api/test-firebase app/api/test-firebase-simple app/api/test-run-creation 2>/dev/null
git rm -r app/api/make-admin 2>/dev/null
# Remove empty voice test dirs
rm -rf app/voice-test app/voice-google-test app/voice-compare app/voice-ultimate
echo "--- remaining api routes ---"
ls app/api
echo "--- remaining voice dirs (should be none) ---"
ls app/ | grep voice || echo "none"
```
Expected: api/ no longer has debug/test/make-admin; no voice test dirs.

- [ ] **Step 2: Add `noindex` to non-public pages**

For each of these files, add a `metadata` export (or merge into existing) with `robots: { index: false, follow: false }`:
- `apps/web/app/(site)/old-design/page.tsx` — if it has a `metadata` export, add the robots field; if it's `"use client"`, instead create/modify `app/(site)/old-design/layout.tsx` with:
```typescript
import type { Metadata } from 'next';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
```
- `apps/web/app/(site)/varun/` — same pattern: create `app/(site)/varun/layout.tsx` with the noindex metadata.
- `apps/web/app/dashboard/page.tsx` — it's `"use client"`; create `app/dashboard/layout.tsx` with the noindex metadata.
- `apps/web/app/(site)/admin/` — if no `layout.tsx`, create `app/(site)/admin/layout.tsx` with the noindex metadata. If one exists, merge the robots field into its existing metadata.

- [ ] **Step 3: Verify**

```bash
cd apps/web
echo "--- no debug/test/make-admin routes ---"
ls app/api | grep -E "debug|test-|make-admin" && echo "FAIL" || echo "OK"
pnpm build && (pnpm start & sleep 5)
echo "--- old-design should be noindex ---"
curl -s http://localhost:3000/old-design | grep -i "noindex" | head -1
kill %1
```
Expected: no debug/test routes; `/old-design` HTML contains `<meta name="robots" content="noindex,nofollow">`.

- [ ] **Step 4: Commit**

```bash
git add -A apps/web
git commit -m "chore(security): delete debug/test/make-admin routes; noindex old-design/varun/dashboard/admin

make-admin was a self-service privilege-escalation endpoint tagged
'TEMPORARY - REMOVE AFTER SETUP'. debug/test routes exposed env names and
firebase internals. Empty voice-test dirs removed. Private pages now noindex."
```

---

## Task 16 (Workstream C1 — the big one): Convert homepage to Server Component

**Files:**
- Create: `apps/web/components/home/StatsCounters.tsx` (client island)
- Create: `apps/web/components/home/LeadModal.tsx` (client island)
- Modify: `apps/web/app/(site)/page.tsx` (becomes a Server Component; imports the islands; adds metadata export)

**Why:** This is the single biggest SEO win. The whole homepage (including 600 words of SEO content + schema) is currently `"use client"` — bots see an empty shell. We split it into a server-rendered shell + small client islands for the interactive bits.

This task is large; do it in sub-steps.

- [ ] **Step 1: Extract `StatsCounters` client island**

Create `apps/web/components/home/StatsCounters.tsx`:
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { BUSINESS } from '@/lib/seo/business-config';

export function StatsCounters() {
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const steps = 60;
            const yearTarget = 18;
            const clientTarget = 5000;
            const fundedTarget = 2;
            let currentStep = 0;
            const interval = setInterval(() => {
              currentStep++;
              const progress = currentStep / steps;
              setYearsCount(Math.floor(yearTarget * progress));
              setClientsCount(Math.floor(clientTarget * progress));
              setFundedCount(Number((fundedTarget * progress).toFixed(1)));
              if (currentStep >= steps) clearInterval(interval);
            }, duration / steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-3 gap-6 mb-8">
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{yearsCount}+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Years Experience</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{clientsCount.toLocaleString()}+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Happy Clients</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">${fundedCount}B+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Funded</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Extract `LeadModal` client island**

Create `apps/web/components/home/LeadModal.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderRotate } from '@/components/ui/animated-gradient-border';

interface LeadModalProps {
  open: boolean;
  selectedCalculator: string | null;
  onClose: () => void;
}

export function LeadModal({ open, selectedCalculator, onClose }: LeadModalProps) {
  const [leadData, setLeadData] = useState({
    name: '', email: '', phone: '', loanAmount: '', message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadData, calculatorType: selectedCalculator || '' }),
      });
      if (selectedCalculator) {
        await fetch('/api/calculator-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...leadData, calculatorType: selectedCalculator }),
        });
      }
      alert('Thank you! We\'ll be in touch shortly. Check your email for your personalized report.');
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Thank you! We\'ve received your information and will be in touch shortly.');
    }
    setLeadData({ name: '', email: '', phone: '', loanAmount: '', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full"
          >
            <BorderRotate animationSpeed={4} borderRadius={16} borderWidth={2} backgroundColor="#1f2937"
              className="w-full p-8 shadow-2xl backdrop-blur-xl"
              gradientColors={{ primary: '#584827', secondary: '#c7a03c', accent: '#f9de90' }}>
              <h3 className="text-xl font-bold text-gray-100 mb-6">
                {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required aria-label="Full Name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={leadData.name} onChange={(e) => setLeadData({ ...leadData, name: e.target.value })} />
                <input type="email" placeholder="Email Address" required aria-label="Email Address"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={leadData.email} onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} />
                <input type="tel" placeholder="Phone Number" required aria-label="Phone Number"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={leadData.phone} onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })} />
                <input type="text" placeholder="Loan Amount Needed (e.g. $500,000)" aria-label="Loan Amount"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={leadData.loanAmount} onChange={(e) => setLeadData({ ...leadData, loanAmount: e.target.value })} />
                <textarea placeholder="Tell us about your mortgage needs..." rows={3} aria-label="Message"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 resize-none"
                  value={leadData.message} onChange={(e) => setLeadData({ ...leadData, message: e.target.value })} />
                <button type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg">
                  {selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">Your information is secure and will never be shared</p>
            </BorderRotate>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```
Note: this version also fixes the accessibility issue (adds `aria-label` to every input — the audit found zero labels).

- [ ] **Step 3: Convert `app/(site)/page.tsx` to a Server Component**

This is the substantial edit. In `apps/web/app/(site)/page.tsx`:
1. **Remove the `"use client"` line** at the top.
2. **Add a `metadata` export** (the homepage currently has none):
```typescript
import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/seo/business-config';

export const metadata: Metadata = {
  title: 'Kraft Mortgages Canada Inc. | Mortgage Broker Surrey, BC, AB & ON',
  description: 'Licensed Canadian mortgage brokerage. 18+ years, $2B+ funded, access to 30+ lenders. Specialists in MLI Select, construction financing, self-employed, and private mortgages across BC, Alberta, and Ontario.',
  alternates: { canonical: 'https://www.kraftmortgages.ca' },
  openGraph: {
    title: 'Kraft Mortgages Canada Inc. | Mortgage Broker Surrey',
    description: 'Licensed Canadian mortgage brokerage across BC, Alberta, and Ontario. MLI Select, construction, self-employed, and private mortgage specialists.',
    url: 'https://www.kraftmortgages.ca',
    siteName: 'Kraft Mortgages',
    locale: 'en_CA',
    type: 'website',
    images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
  },
};
```
3. **Replace** the interactive bits with the islands. The homepage currently manages `showLeadForm`, `selectedCalculator`, `leadData`, and the counters with `useState`/`useEffect` — none of that is allowed in a Server Component. Two options:
   - **(A) Wrap the parts needing interactivity in a single client island** that holds the modal trigger state. Create `components/home/HomeInteractions.tsx` (`'use client'`) that wraps the CTAs and renders `<LeadModal/>`. The rest of the page (hero text, SEO block, services, cities, testimonials, footer) stays server-rendered.
   - **(B)** Simpler: keep the entire visible page server-rendered, and make the lead-modal CTAs anchor links to `/contact` (the modal becomes optional). This loses the modal but is dramatically simpler and arguably better UX (a dedicated contact page converts better than a modal).

   **Decision: Option A** (preserve the modal). Create `components/home/HomeInteractions.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { LeadModal } from './LeadModal';

// Wraps the hero CTAs so the lead modal works without making the whole page a client component.
export function HeroCTAs() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
          Start Application
        </a>
        <button onClick={() => setShowLeadForm(true)}
          className="inline-flex items-center justify-center px-6 py-3.5 border border-gold-500/40 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-all hover:border-gold-400">
          Get Free Analysis
        </button>
        <a href="tel:604-593-1550"
          className="inline-flex items-center justify-center px-6 py-3.5 border border-gold-500/40 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-all hover:border-gold-400">
          Call 604-593-1550
        </button>
      </div>
      <LeadModal open={showLeadForm} selectedCalculator={null} onClose={() => setShowLeadForm(false)} />
    </>
  );
}
```
4. In `page.tsx`, **delete** all the `useState`/`useEffect`/`handleLeadSubmit`/`openCalculatorWithLead`/`animateCounters` logic and the inline `<AnimatePresence>` modal block. **Replace** the stats `<div ref={statsRef}>` block with `<StatsCounters />`. **Replace** the hero CTAs block with `<HeroCTAs />`. Keep ALL the static content (hero text, SEO block, services array, cities, how-it-works, calculators, testimonials, CTA, footer) — just without the `"use client"` directive and client-side state.
5. Replace the homepage's hardcoded facts with `BUSINESS.*` references where it reads naturally: the "funded over $2 billion" → keep as-is (matches BUSINESS.fundedVolume); the "18+ Years" → `{BUSINESS.yearsExperienceShort}+`; the footer address → `{BUSINESS.address.streetAddress}`. (Don't over-refactor; just wire the headline facts to the config so they can't drift.)
6. **Remove the now-unused imports**: `useState`, `useEffect`, `useRef`, `AnimatePresence` (the modal moved to the island). `motion` (framer-motion) **cannot run in a Server Component** — its `motion.*` components require the React client runtime and the build will error. Replace the page's `<motion.div>` section wrappers with a small client wrapper. Create `apps/web/components/home/AnimatedSection.tsx`:
```tsx
'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Lets server-rendered pages use framer-motion entrance animations via a client island.
export function AnimatedSection({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```
Then in `page.tsx`, replace each `<motion.div initial={...} whileInView={...}>` with `<AnimatedSection>` (props: `className`, `delay`). The **content inside** each section stays server-rendered; only the animation wrapper is a client component. This preserves the existing visual animations while making the page a Server Component. (`<HeroGeometric>` is already `'use client'` so it works unchanged as an island.)

- [ ] **Step 4: Verify the homepage is now server-rendered**

```bash
cd apps/web && pnpm build && (pnpm start & sleep 5)
# The SEO content + H1 must appear in raw HTML WITHOUT executing JS:
curl -s http://localhost:3000/ | grep -c "Canada's Mortgage Landscape"
curl -s http://localhost:3000/ | grep -o "Expert Mortgage Solutions Across" | head -1
curl -s http://localhost:3000/ | grep -o '"@type":\["Organization"' | head -1
kill %1
```
Expected: the SEO paragraph count ≥ 1; the H1 present in raw HTML; the org JSON-LD present (now from the layout, Task 8). If the SEO content is NOT in raw HTML, the page is still a client component — recheck step 3.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/home apps/web/app/\(site\)/page.tsx
git commit -m "feat(seo): convert homepage to Server Component with client islands

The entire homepage (incl. 600-word SEO block + schema) was 'use client',
so bots saw an empty shell. Split into: server-rendered page (all static
content, metadata export, schema via layout) + 3 client islands
(StatsCounters, LeadModal, HeroCTAs). Also added aria-labels to every lead
form input (was 0 labels — accessibility fix). Biggest single SEO win."
```

---

## Task 17 (Workstream F3): Repo hygiene — gitignore, dead deps, env example

**Files:**
- Modify: `.gitignore`
- Modify: `apps/web/package.json` (remove `react-tilt`, `lottie-react`)
- Modify: `.env.example`

- [ ] **Step 1: Untrack `tsconfig.tsbuildinfo`**

```bash
cd "C:/Users/varun/Documents/AI Application Development/kraft-mortgages"
git rm --cached apps/web/tsconfig.tsbuildinfo
echo "apps/web/tsconfig.tsbuildinfo" >> .gitignore
```

- [ ] **Step 2: Remove dead deps**

In `apps/web/package.json`, delete these two lines from `dependencies`:
```json
    "lottie-react": "^2.4.1",
    "react-tilt": "^1.0.2",
```
Then:
```bash
cd apps/web && pnpm install
grep -rn "react-tilt\|lottie-react" app components | grep -v node_modules && echo "FAIL: still imported" || echo "OK: not imported anywhere"
pnpm build
```
Expected: not imported; build succeeds.

- [ ] **Step 3: Update `.env.example`**

Append the missing variables that `.env.local` actually uses (names only, never values). Read `.env.local` to get the names (do NOT copy values), then ensure `.env.example` documents each with a placeholder. At minimum add: `ANTHROPIC_API_KEY=`, `OPENAI_API_KEY=`, `GOOGLE_GENERATIVE_AI_API_KEY=`, `HUBSPOT_*`, `FACEBOOK_APP_SECRET=`, `FACEBOOK_PAGE_ACCESS_TOKEN=`, `FACEBOOK_WEBHOOK_VERIFY_TOKEN=`, `THINKR_API_KEY=`, `NEXT_PUBLIC_SITE_URL=https://www.kraftmortgages.ca`. **Never commit real secrets.**

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example apps/web/package.json apps/web/pnpm-lock.yaml
git commit -m "chore: untrack tsbuildinfo, remove dead react-tilt/lottie deps, document env vars

tsconfig.tsbuildinfo was tracked (spurious diffs). react-tilt + lottie-react
had zero imports. .env.example now documents the AI/HubSpot/Meta/Thinkr vars
the app actually uses."
```

---

## Task 18 (Workstream D-AI1): Expand `llms.txt` + add `llms-full.txt`

**Files:**
- Modify: `apps/web/public/llms.txt` (fix $5B→$2B, add missing cities)
- Create: `apps/web/public/llms-full.txt`

- [ ] **Step 1: Fix `llms.txt`**

Open `apps/web/public/llms.txt`. Change the funded figure from `$5B+` to `$2B+` (to match the rest of the site / BUSINESS config). Ensure the Locations section lists all 19 cities (currently only 11 — add toronto, vancouver, calgary, edmonton, burnaby, richmond, coquitlam, langley). Fix the duplicate `## Locations` heading.

- [ ] **Step 2: Create `llms-full.txt`**

Create `apps/web/public/llms-full.txt` — a detailed markdown doc for AI ingestion. Structure:
```
# Kraft Mortgages Canada Inc.

> Licensed Canadian mortgage brokerage. Surrey HQ. Licensed in BC, AB, ON.

## Summary
Kraft Mortgages is a [BusinessModel]...

## Services
- Residential Mortgages: ...
- Construction Financing: ... (progressive draws, MLI Select)
- MLI Select: CMHC multi-unit program, premium savings...
- Commercial Mortgages: ...
- Equity Lending / HELOC: ...
- Private Lending: ...
- Self-Employed / Stated Income: ...
- Business Funding: ...

## Licensing
- BCFSA #SR220230 (BC)
- RECA LIC-00655428 (AB)
- FSRA #12918 (ON)

## Key facts (canonical)
- Funded volume: $2B+
- Years experience: 18+ combined
- Lenders: 30+
- Clients served: 5,000+
- HQ: #301 - 1688 152nd Street, Surrey BC V4A 4N2
- Phone: 604-593-1550
- Email: varun@kraftmortgages.ca
- Hours: Mon-Fri 9-5, Sat 10-2

## Cities served
[all 19, with province]

## Links
- Home: https://www.kraftmortgages.ca
- Calculators: https://www.kraftmortgages.ca/calculators
- MLI Select: https://www.kraftmortgages.ca/mli-select
- Blog: https://www.kraftmortgages.ca/blog
- Contact: https://www.kraftmortgages.ca/contact
```
Write the real content for each section (don't leave `[BusinessModel]` placeholders — fill them in based on the site's existing copy and BUSINESS config).

- [ ] **Step 3: Verify**

```bash
cd apps/web
grep -c "5B" public/llms.txt public/llms-full.txt  # should be 0
grep -c "2B" public/llms.txt public/llms-full.txt  # should be ≥1 each
grep -c "toronto\|vancouver\|calgary\|edmonton" public/llms.txt  # should be ≥4 (lowercase URLs)
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/public/llms.txt apps/web/public/llms-full.txt
git commit -m "feat(aiseo): fix llms.txt funded figure + cities; add llms-full.txt for deep AI ingestion

llms.txt said \$5B funded (contradicted the rest of the site's \$2B). Added
the 8 missing cities. llms-full.txt gives AI engines a detailed,
machine-readable brief of services, licensing, and canonical facts."
```

---

## Task 19: Final verification against the spec checklist

**Files:** none (verification only)

Run the full Phase 1 verification checklist from the spec. Each must pass.

- [ ] **Step 1: Build + lint clean**

```bash
cd apps/web && pnpm build && pnpm lint
```
Expected: build succeeds; lint passes (warnings OK, no errors).

- [ ] **Step 2: AI bots unblocked**

```bash
cd apps/web && (pnpm start & sleep 5)
curl -s http://localhost:3000/robots.txt | grep -E "GPTBot|Google-Extended|CCBot|anthropic-ai" 
ls public/robots.txt 2>/dev/null && echo "FAIL: static robots.txt still exists" || echo "OK"
kill %1
```
Expected: each AI bot has `Allow: /`; static file gone.

- [ ] **Step 3: Server-rendered homepage content**

```bash
cd apps/web && (pnpm start & sleep 5)
curl -s http://localhost:3000/ | grep -c "Canada's Mortgage Landscape"  # ≥1
curl -s http://localhost:3000/ | grep -c "555-1234"                     # 0
kill %1
```

- [ ] **Step 4: No fake phone numbers anywhere**

```bash
cd apps/web && grep -r "555-1234\|5551234" app components | grep -v node_modules && echo "FAIL" || echo "OK"
```

- [ ] **Step 5: Homepage links resolve**

```bash
cd apps/web && (pnpm start & sleep 5)
for u in /construction /calculators/self-employed /calculators/affordability /equity-lending /calculators/payment /calculators/investment /mli-select/calculators; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$u)"
done
kill %1
```
Expected: all 200.

- [ ] **Step 6: Single org schema**

```bash
cd apps/web && (pnpm start & sleep 5)
# Count distinct Organization graph sources in the homepage HTML — should be 1 (from layout)
curl -s http://localhost:3000/ | grep -o '"@type":\["Organization"' | wc -l
kill %1
```
Expected: 1.

- [ ] **Step 7: Sitemap correct + cached**

```bash
cd apps/web && (pnpm start & sleep 8)
curl -s http://localhost:3000/sitemap.xml | grep -c "mortgage-broker-toronto"   # ≥1
curl -s http://localhost:3000/sitemap.xml | grep -c "mortgage-broker-vancouver" # ≥1
curl -s http://localhost:3000/sitemap.xml | grep -c "provinces/bc"             # 0 (removed)
kill %1
```

- [ ] **Step 8: noindex on private pages**

```bash
cd apps/web && (pnpm start & sleep 5)
curl -s http://localhost:3000/old-design | grep -ci "noindex"  # ≥1
kill %1
```

- [ ] **Step 9: gitignore clean**

```bash
cd "C:/Users/varun/Documents/AI Application Development/kraft-mortgages"
git status --short | grep tsbuildinfo && echo "FAIL" || echo "OK"
rm -f phase1-baseline-fake-phones.txt  # cleanup the baseline file from Task 1
```

- [ ] **Step 10: Final commit (if any stragglers) + PR-ready summary**

```bash
git add -A
git diff --cached --quiet && echo "nothing to commit" || git commit -m "chore: phase 1 verification cleanup"
git log --oneline fix/phase1-seo ^docs/seo-redesign-spec | head -30
```

Expected: a clean list of the ~18 task commits.

---

## Spec Coverage Self-Check

Mapping spec workstreams → tasks:
- **A1 robots** → Task 2 ✅
- **A2 fake phones** → Task 3 ✅
- **A3 broken links** → Task 4 ✅
- **A4 mli redirect** → Task 4 ✅
- **A5 404 schema images** → Task 5 ✅
- **B1 business-config** → Task 6 ✅
- **B2 funded figure** → Task 6 (defaulted to $2B in config) + Task 18 (llms.txt) ✅
- **B3 single org schema** → Tasks 7, 8, 9, 10 ✅
- **B4 fabricated reviews** → Task 9 ✅
- **B5 delete SEOHead** → Task 10 ✅
- **B6 OG image** → Task 5 ✅
- **C1 homepage server component** → Task 16 ✅
- **C2 other pages server components** → **DEFERRED to Phase 2** (scoped down per spec: "convert the high-value subset; the rest get fixed in Phase 2"). Only homepage done in Phase 1 — explicitly noted.
- **C3 generateMetadata** → Task 12 (cities), Task 16 (homepage) ✅; calculator metadata **DEFERRED to Phase 2** (large surface; homepage+cities cover the highest-value pages).
- **C4 canonical fix** → Task 14 ✅
- **D1 city consolidation** → Task 11 ✅
- **D2 city schema** → Task 12 ✅
- **E1 sitemap routes** → Task 13 ✅
- **E2 sitemap ISR** → Task 14 ✅
- **E3 minor tech fixes (lang, preconnect)** → Task 8 ✅
- **F1 delete debug routes** → Task 15 ✅
- **F2 noindex** → Task 15 ✅
- **F3 repo hygiene** → Task 17 ✅
- **F4 rotate secrets** → **Out of scope for code** (flagged to Varun in spec) ✅
- **D-AI1 llms.txt/full** → Task 18 ✅ (added beyond spec; strengthens GEO)

**Deferred to Phase 2 (explicitly, per spec scoping):** converting ~90 remaining client pages to server components, calculator `generateMetadata` for all 25 calculators, design-system token overhaul, full 3D redesign.

No spec requirement is silently dropped. Deferrals are documented and match the spec's "Non-Goals" and "Phase 2" sections.
