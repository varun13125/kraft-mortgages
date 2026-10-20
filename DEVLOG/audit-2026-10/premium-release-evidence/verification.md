# Premium calculator release verification — 2026-10-20

The owner approved implementation, commit/push and production release. This folder extends the earlier [52-calculator audit](../calculator-premium-audit-2026-10-20.md). It does not replace historical evidence or certify unrelated integrations.

## Delivered scope

- A restrained scoped calculator theme and complete searchable 53-tool registry.
- Shared ivory/ink shell, mobile summary, transparent results/assumptions and local ungated PDF for Payment, Renewal Offer Comparison and MLI Select Deal Sizer.
- One guidance launcher for phone/WhatsApp/text AI/voice AI; focus restoration, chat close/Escape, voice modal keyboard containment and existing explicit voice start/end lifecycle.
- The prior correctness/accessibility repairs from BUG-061…071, plus the newly integrated decision engines and tests.
- Mandatory [developer/design guide](../../DEVELOPER_GUIDE.md), linked from root AGENTS and DEVLOG reading order.

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Math/unit suite | 119/119 passing; includes 2,160 independent payment/inverse/ledger combinations and 75 integrated MLI sizing combinations | `apps/web/tests/**`; clean tree suite rerun before commit |
| TypeScript / lint | Zero errors; lint zero warnings | Explicit local checks and isolated release-tree checks |
| Production build | Exit 0, 126/126 pages | Isolated archived staged source, runtime changes synchronized and matched; no owner data refresh included |
| Runtime source match | 86 changed runtime files match built source after newline normalization | [built-source-match.json](built-source-match.json) |
| Preserved data baseline | Four archive data files match original HEAD Git blob hashes after normal Git newline normalization | No apps/web/data paths staged; owner working changes untouched |
| Built HTTP/SEO | 53/53 HTTP200, H1 and unique matching route canonical; new route present in sitemap | [built-app-route-smoke.json](built-app-route-smoke.json) |
| All-route browser scan | 53 routes; final merged zero axe nodes, page errors or measured 390px horizontal overflow | [final-all-routes.json](final-all-routes.json) |
| Original audit regression suite | 24/24 pass after redesign | [original-regressions/regression-results.json](original-regressions/regression-results.json) |
| Built-app premium flow | 12/12 pass | [built-app/premium-regressions.json](built-app/premium-regressions.json) |
| New tool numeric stress | 136 numeric normal/blank/negative/extreme drafts plus three toggle cases; no non-finite result/page error | [new-tool-input-stress/browser-results.json](new-tool-input-stress/browser-results.json) |
| New layouts | 1440, 390 and 320px; zero measured overflow and axe violations | Built-app flow, desktop/mobile PNGs |
| PDF | All three local downloads begin with `%PDF-`, include the displayed current result, do not open a lead modal | Built-app flow and example PDFs |

The collection sweep ran while visual fixes were being made. `final-all-routes.json` merges the sweep with later rechecks of affordability, B-vs-equity, debt-service ratio, MLI max-loan and MLI premium. The initial five contrast failures remain in raw evidence for traceability; they are fixed in the final result. The final full built-app flow independently rechecked the three shared-shell tools and open help panels.

## Safety and practical limits

Browser harnesses blocked non-GET/HEAD requests and external widget calls. No real leads, emails, WhatsApp messages or calls were sent. Opening voice was tested only through its pre-call disclosure screen. This is numerical/input stress testing, not production traffic load testing. Automated axe/layout checks do not establish full screen-reader, manual zoom or real-device certification.

The isolated build had no Firebase credentials and used the existing mock blog fallback. Local build success does not certify production Firebase/CRM/AI/voice integrations. Stale Browserslist data is a nonblocking tool warning. Production release status is recorded in the later live receipt and DEVLOG session.

## Intentional scope limits

The other 50 calculator bodies retain their existing controls/model and receive shared styling; their complete component/result-contract migration is FEAT-069. Renewal compares the same principal with cash-paid fees over the shortest quoted horizon; cash-out/capitalized-fee integration is FEAT-070. MLI sizing is standard rental, minimum five units, with explicit excluded special purposes, premium taxes, application fees and construction carry/reserves. It is a planning estimate, not an approval.
