# Session Log

Newest first. Every agent or developer session that changes the repo adds an entry here before stopping.
Older history (2025-08 → 2026-10-04) lives in `/AI_CONTEXT_LOG.md`.

## Template

```markdown
## YYYY-MM-DD: <short title>
- **Who:** <agent/model or person>
- **Commit(s):** <hash(es) or "uncommitted">
- **Goal:** <what was asked>
- **Done:** <bullets; reference BUG-/FEAT- IDs>
- **Verified:** <tsc / lint / build / tests / manual checks and their results>
- **New items logged:** <BUG-/FEAT- IDs created>
- **Left in progress / handoff notes:** <what the next person must know>
```

---

## 2026-10-12: Full codebase audit, fixes, and developer log

- **Who:** Claude Code (Opus 5.5), acting as orchestrator, plus 7 parallel area agents: calc-res-a, calc-res-b, calc-specialty, ai-voice, backend, frontend-seo, platform.
- **Commit(s):** uncommitted (base `891d870`). The owner's data refresh in `apps/web/data/` was already uncommitted before the session.
- **Goal:** The owner asked for:
  - an audit of the entire codebase
  - a list of new features to add
  - a find-and-fix pass on all flaws and mistakes, "including the calculators"
  - a developer log that lets any future agent pick up where this one left off
- **Done:**
  - Created `DEVLOG/` (README protocol, STATUS, FINDINGS, FEATURES, SESSIONS) and 7 detailed audit reports in `DEVLOG/audit-2026-10/`.
  - About **200 fixes**, summarised in FINDINGS.md §3:
    - ~93 calculator fixes. Major ones: required-income % ÷ 12; down payment and CMHC rules; BC first-time PTT exemption; refinance break-even; negative interest in 3 calculators; refi-vs-HELOC; rent-vs-buy; port-vs-break IRD; commercial refinance; MLI Select tiers and premium grid; HELOC; debt consolidation; alternative income; construction draws; Canadian semi-annual compounding everywhere; new `lib/calc/landTransferTax.ts`. The AI chat calculators now match the web calculators.
    - Security:
      - Twilio toll-fraud endpoint.
      - Unsigned Twilio callback (SSRF).
      - Unauthenticated pipeline/cron/admin routes.
      - `mli-proxy` path traversal.
      - Public `/admin` lead data.
      - Admin list leak.
      - Contact-form abuse.
      - Facebook webhook fail-open.
      - Rate limits on paid AI endpoints.
      - Security headers.
    - Reliability: silent lead loss; three conflicting Firebase initialisers; the AI content pipeline could never complete; chat lender resolver hijacking ordinary questions.
    - SEO/compliance: homepage canonical inherited by ~25 pages; robots/sitemap/JSON-LD fixes; licence footer on ~100 pages; AI disclosure and recording notices; unsubstantiated "lowest rate / guarantee" wording; stale $1M down-payment rule in city FAQs.
    - Platform: complete `.env.example` (72 vars), CI that actually type-checks, lint 172 errors → 0 (CI lint now blocking).
  - Orchestrator integration pass:
    - `isDormant` added to the interface (approved by the owner mid-session).
    - Fixed a `rate-tools.ts` compareRates crash plus compounding.
    - Dead links in the AI navigation tool and the blog ingest pillar map.
    - Metadata for `/calculators` (server page + `CalculatorsHub.tsx` client component), `/qualify`, `/mli` and all MLI pages.
    - Removed duplicate nav on 5 MLI pages.
    - Footer on all calculators, MLI pages and service hubs.
    - Service-hub JSON-LD and og:image fixes.
    - Escaped 171 JSX entities.
  - Feature backlog: 59 items (FEAT-001…059) prioritised P0–P2.
- **Verified:**
  - `tsc` 0 errors.
  - `next lint` 0 errors (2 warnings).
  - `next build` succeeded (135 static pages).
  - All calculator verification suites re-run against the final combined code and passing. They are throwaway scripts in the session scratchpad, not in the repo; FEAT-006 ports them.
  - **No browser/visual verification was done.**
- **New items logged:**
  - BUG-001…053 (open items; IDs 001–006, 014, 015, 027, 028 and 036 need the owner).
  - FEAT-001…059.
- **Left in progress / handoff notes:**
  - Nothing is committed. Keep the audit work and the owner's data refresh in separate commits. Read BUG-028 before committing the data file.
  - **Deploying will change behaviour** (see STATUS.md "Behaviour changes"). In particular, `/admin` returns 503 until `ADMIN_BASIC_AUTH_*` is set, and the Twilio callbacks need `TWILIO_AUTH_TOKEN`.
  - The most urgent owner items are key rotation (BUG-001/002) and env vars (BUG-006).
  - The most valuable next engineering steps are a visual QA pass, then FEAT-006 (tests), FEAT-007 (live-rate defaults), FEAT-003 (durable rate limits) and FEAT-002 (unified lead ingestion).
  - `CLAUDE.md`'s status sections are stale. A pointer to this DEVLOG was added at its top; `AGENTS.md` was created for non-Claude agents.
