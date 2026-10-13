# Agent Instructions (Codex, Gemini, Antigravity, Cursor, Claude, humans)

Before doing anything in this repository:

1. **Read `DEVLOG/README.md`.** It explains the handoff protocol and the reading order:
   `DEVLOG/STATUS.md` → `DEVLOG/FINDINGS.md` → `DEVLOG/FEATURES.md` → the latest entry in `DEVLOG/SESSIONS.md`.
2. Run `git status`. The owner often has uncommitted data updates in `apps/web/data/` (rates, lenders,
   underwriting matrix). Don't modify or revert them without permission.
3. Claim the `BUG-###` / `FEAT-###` items you'll work on (set them to `in-progress (<you>, <date>)`).

Before you stop:

- Update the status of every item you touched, log new findings and ideas as new IDs,
  prepend an entry to `DEVLOG/SESSIONS.md`, and refresh `DEVLOG/STATUS.md`.

Quick facts:

- The site is `apps/web` (Next.js 14 App Router, TypeScript strict, pnpm workspace). Type-check with
  `cd apps/web && ./node_modules/.bin/tsc --noEmit --incremental false -p .` and lint with `./node_modules/.bin/next lint`.
  Both must stay at 0 errors.
- Calculator math must go through `apps/web/lib/calc/*` (Canadian semi-annual compounding, CMHC/LTT rules).
  The conventions are in `DEVLOG/STATUS.md`.
- Don't commit, push or deploy unless the owner asks. Don't print secret values from `.env*` files.
- `CLAUDE.md` and `AI_CONTEXT_LOG.md` are partly stale history; the DEVLOG wins.
