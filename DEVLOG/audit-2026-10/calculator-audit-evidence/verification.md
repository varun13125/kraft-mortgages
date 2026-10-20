# Verification and reproduction — 20 October 2026

Base: main / `006c93a`; fixes uncommitted. No push or production deployment.

| Check | Result |
| --- | --- |
| Node automated suite | 109/109 passed; 2,160 ledger combinations plus dedicated regressions |
| Initial browser interaction sweep | 52/52 pages HTTP 200; 314 visible controls; 1,146 numeric/range and 43 select cases; no captured page exceptions or non-finite output |
| Final accessibility/toggle sweep | 52/52 pages HTTP 200; 38 toggle cases, including all 17 checklist boxes; zero final axe violation nodes after rechecks |
| Latest three-page numeric recheck | B-vs-equity, down payment and updated HELOC: zero axe issues/exceptions/non-finite outputs |
| Targeted browser checks | 24/24: 16 functional/regression checks plus 8 visual/viewport captures |
| Mobile width | No measured horizontal overflow in final sampled 390×844 states |
| Concept | $500k/5%/25y → $2,908.02; 0% → $1,666.67; mobile width 390; axe 0. Uses a compiled copy of lib/calc/payment.ts. |
| Type check / lint / production build | TypeScript exit 0; lint exit 0, no warnings/errors; final production build exit 0, 125/125 pages |
| Diff whitespace check | Passed, excluding owner-managed data; normal Windows line-ending notices are informational |

The initial sweep ran while fixes were underway; it is not a pristine HEAD baseline. Do not use its accessibility totals to claim a percentage improvement. `final-accessibility-and-toggles.json` merges the final full scan with later corrections/rechecks of three routes. `full-interaction-sweep.json` retains the separate complete numeric run. Dev-server load times are not production performance measurements.

Assertions check bounded examples and invariants; the browser smoke sweep does not independently prove every displayed number. Source/model review, independent monthly ledgers, tax/premium boundaries, AI parity and targeted golden cases complement it. Screenshots include both initial and corrected states, not a deployed redesign.

Runtime: Node 24.15.0; Next 14.2.35; TypeScript 5.5.4; Playwright 1.64.1; @axe-core/playwright 4.14.0; installed Chrome in headless mode. The repository declares Node 22.x; CI/production should retain their configured runtime verification. No dependency/lockfile changes were needed for browser tools.

From the repo root in PowerShell, with the local server on port 3100:

```powershell
npm install --prefix "$env:TEMP/kraft-audit-tools" playwright@1.64.1 @axe-core/playwright@4.14.0 --no-audit --no-fund
$env:AUDIT_TOOLS="$env:TEMP/kraft-audit-tools/node_modules"
$env:AUDIT_OUTPUT="$env:TEMP/kraft-calculator-audit"
node apps/web/scripts/audit-calculators.cjs
node apps/web/scripts/audit-calculator-regressions.cjs
```

Use a distinct output folder for each run. Optional `AUDIT_BASE_URL` changes the local base, `AUDIT_ROUTES` selects comma-separated routes, `AUDIT_QUICK=1` skips numeric/select stress but keeps accessibility/toggles, and `REGRESSION_FILTER` selects named targeted checks. Both scripts block non-GET requests and third-party widgets to avoid real lead/call submissions.

App checks, from `apps/web`:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit --incremental false -p .
.\node_modules\.bin\next.cmd lint
node --test "tests/**/*.test.mjs"
.\node_modules\.bin\next.cmd build
```

The production build should run with the dev server stopped. The first build passed; a second build covers the final bounded-simulation guard and verdict-copy update. Final completion and local production smoke results are appended below.

This audit did not submit real applications, contact/PDF leads, emails or phone calls; test real delivery with controlled recipients separately. Production infrastructure/key rotation, legal approval, complete screen-reader/zoom review and real-user performance were not certified here. The owner's pre-existing changes in `canadianLendersData.ts`, `current_rates.json`, `current_rates_summary.md` and `underwriting_criteria_matrix.json` were preserved.


**Final production verification:** final build completed successfully (125 pages). The final bounded-simulation guard is present in the emitted JavaScript. The built app on localhost:3100 returned 200 on all 52 calculator routes; each has an H1 and a unique canonical matching its route. Six targeted browser regressions passed against this production build. Source fingerprints are recorded in source-hashes.json.

Build-reported first-load JS: Payment 165 kB; Mortgage Qualifier 165 kB; MLI Points 153 kB; MLI Premium 150 kB; shared 87.8 kB. These are build artifact sizes, not real-user timing measurements. Local build logs correctly report unconfigured Firebase and fallback blog content; this does not certify production Firebase/content configuration. No real external integration was exercised.
