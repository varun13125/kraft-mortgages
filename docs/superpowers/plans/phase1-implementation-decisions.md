# Phase 1 — Implementation Decisions & Deviations

This log records decisions made during execution of the Phase 1 plan
(`docs/superpowers/plans/2026-06-20-phase1-seo-ai-seo-fixes.md`) that differ
from the written plan, with the reason. Lives on the `fix/phase1-seo` branch.

## Task 11 — City-page consolidation: REVERTED (kept static architecture)

**Plan said:** Consolidate to the dynamic `mortgage-broker-[city]/page.tsx`,
delete the 15 static client pages, expand `generateStaticParams` to all cities.

**What happened:** The consolidation was implemented (ported 7 cities into
`CITY_METADATA`, expanded `generateStaticParams`, deleted the 19 static dirs)
but the dynamic route **does not function in Next.js 14.2.21** for the
`mortgage-broker-[city]` folder pattern.

**Root cause (verified):**
- The route is registered in `routes-manifest.json`, but its regex is
  `^/([^/]+?)(?:/)?$` — i.e. Next captures the *entire first path segment*
  as the `city` param (so `/mortgage-broker-surrey` → `city = "mortgage-broker-surrey"`),
  and the literal `mortgage-broker-` prefix in the folder name is cosmetic only.
- Even after adding prefix-stripping (`.replace(/^mortgage-broker-/, '')`),
  the page component **never executes** at runtime — debug `console.log` produced
  no output. The route does not appear in `dynamicRoutes` of the manifest, and
  no city `.html` files are prerendered. Every `/mortgage-broker-{city}` returns 404.
- The original site worked only because the **static** pages (exact path matches)
  took precedence; the dynamic route was effectively dead code (commits reference
  "static build generation" and "compliant dynamic regional city routing" — they
  worked around the same limitation by adding statics).

**Decision:** Reverted to the static-page architecture. All static city dirs
restored from git. The prior task fixes are preserved:
- Task 3's real phone numbers (`604-593-1550`) are intact on all static pages.
- Task 9's removal of fabricated reviews is intact.

The 7 newly-authored `CITY_METADATA` entries (coquitlam, nanaimo, victoria,
red-deer, lethbridge, airdrie, windsor, langley) were NOT committed — they're
captured in the spec for use if/when the dynamic route becomes viable, or for
generating improved static pages.

**Net effect on Phase 1:** No code change for Task 11. The static pages
continue to serve `/mortgage-broker-{city}` correctly (verified: all return
200 with city-specific content). The duplicate-content / shadowing concern
from the audit is moot because only the static pages were ever served.

**For Phase 2:** If the dynamic route is still desired, the supported pattern
is a nested route `mortgage-broker/[city]/` (changes URLs to `/mortgage-broker/surrey`,
which would require 301 redirects from the old `/mortgage-broker-surrey` URLs —
acceptable in a redesign but not as a Phase 1 fix). Otherwise, generate the
static pages programmatically from a shared data file.
