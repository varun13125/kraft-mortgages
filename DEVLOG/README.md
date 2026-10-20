# Kraft Mortgages — Developer Log

This folder is the shared memory for every developer and AI agent working on this repo.
If you are picking up work, **read this file first, then follow the reading order below.**
If you finish work, **update the log before you stop** (see "When you finish").

## Reading order (≈10 minutes)

1. [`STATUS.md`](STATUS.md): where the project stands right now, what's in progress, what's next.
2. [`FINDINGS.md`](FINDINGS.md): register of bugs, flaws and risks (`BUG-###`). Shows what's open and what's fixed.
3. [`FEATURES.md`](FEATURES.md): feature backlog (`FEAT-###`) with priority, effort and status.
4. [`SESSIONS.md`](SESSIONS.md): chronological work log, newest first. Read at least the latest entry.
5. [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md): required design, calculator, integration, verification and release rules. Follow this before implementing UI or financial logic.
6. `audit-2026-10/`: raw area reports from the October 2026 full audit. Go here for detail
   (file:line references, verification notes, reasoning) behind any `BUG`/`FEAT` item.

## Other docs and how much to trust them

| Doc | Status |
| --- | --- |
| `CLAUDE.md` (root) | Partly stale. Its phase percentages and file paths (e.g. `lib/utils/formatting.ts`, `lib/validation/`) predate the 2026 work. Trust the code and this DEVLOG over it. |
| `AI_CONTEXT_LOG.md` (root) | Legacy log (2025-08 → 2026-10-04). Ordering is inconsistent. Kept for history; new entries go in `SESSIONS.md`. |
| `IMPLEMENTATION_PROGRESS.md`, `AI_ASSISTANT_IMPLEMENTATION_CHECKLIST.md` | Historical checklists from 2025. |
| `docs/superpowers/` | June 2026 SEO + redesign spec and plan. |
| `docs/thinkrr_julia_production_setup.md` | Thinkrr voice agent production setup. |

## Conventions

### IDs
- `BUG-###`: a defect, flaw, security risk or compliance gap. Lives in `FINDINGS.md`.
- `FEAT-###`: a new capability or enhancement. Lives in `FEATURES.md`.
- IDs are permanent. Never renumber or reuse them. Never delete an entry. Change its status instead.

### Status values
`open` → `in-progress (<agent/person>, <YYYY-MM-DD>)` → `fixed (<commit or session date>)` / `done`
Also: `wontfix (<reason>)`, `blocked (<on what>)`, `needs-decision (<question for the owner>)`.

### Severity (bugs)
- **critical**: security hole, data leak, legal/compliance exposure, or wrong numbers a client could rely on to make a financial decision
- **high**: a broken user-facing feature, or a materially misleading output
- **medium**: an incorrect edge case, degraded UX, or a maintainability risk with real impact
- **low**: cosmetic, cleanup, nice-to-have

### Priority and effort (features)
- Priority: **P0** (do next) · **P1** (this quarter) · **P2** (later) · **P3** (idea)
- Effort: **S** (≤1 day) · **M** (2–5 days) · **L** (1–3 weeks) · **XL** (more)

### Area owners
Used to route work. These are areas, not people.
`calc-res-a` · `calc-res-b` · `calc-specialty` · `ai-voice` · `backend` · `frontend-seo` · `platform`
(the file ownership map for each area is in `STATUS.md`).

## Before you start work
1. Read `STATUS.md` and the latest `SESSIONS.md` entry.
2. Run `git status` and `git log --oneline -10`. The user often has uncommitted data updates in
   `apps/web/data/` (rates, lenders, underwriting matrix). **Don't modify or revert those files
   without the user's say-so.**
3. Claim the items you'll work on by setting their status to `in-progress (<you>, <date>)`.

## When you finish (required)
1. Update each `BUG`/`FEAT` you touched (status, plus a one-line note with the commit hash or files).
2. Add new findings and ideas as new IDs. Don't bury them in prose.
3. Prepend an entry to `SESSIONS.md` using the template there.
4. Refresh `STATUS.md` (the "Right now" and "Next up" sections at minimum).

## Verification commands
```bash
# Type-check the web app (≈60s). Must stay at zero errors.
cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .

# Lint
cd apps/web && ./node_modules/.bin/next lint
```
`npx tsc` does **not** work here because it resolves the wrong package. Use the local binary above.

```bash
# Tests (Node >= 22.18; no extra dependencies). Must stay green.
pnpm test        # = cd apps/web && node --test "tests/**/*.test.mjs"
```
Any change to calculator, rates or calling-hours logic needs a test in `apps/web/tests/`.

## Ground rules
- Don't commit, push, or deploy unless the user asks.
- Don't read or print secret values from `.env*` files. Variable names are fine.
- Calculator math is client-facing financial information. Any change needs a numeric before/after
  example in the log entry, and should cite the rule source (CMHC, OSFI, BC/ON government) when it
  involves a regulatory constant.
