# Production release receipt — 2026-10-20

The owner authorized committing, pushing and going live. Implementation commit **`d42ea97337f54f193c3768251d1e846b3263c824`** was pushed to `origin/main`.

- Project: `kraft-mortgages` / `prj_6czOXZkuqKyVm02yyU4yBpbTLlwh`.
- Team: `team_0EUuetdSQbmqlyYnpDd6pRgw`.
- Production deployment: `dpl_6yqURBnT5Km64v8GtqW3Nd1aPUj5`.
- Verified state: **READY**, source Git, exact commit SHA above, `main`, `aliasError: null`.
- Verified production alias: [www.kraftmortgages.ca](https://www.kraftmortgages.ca).
- Deployment inspector: [Vercel release](https://vercel.com/varun-chaudhrys-projects/kraft-mortgages/6yqURBnT5Km64v8GtqW3Nd1aPUj5).
- Build logs report completed output deployment and cache upload. Local isolated production build also passed (126 pages).

## Live checks

All 53 calculator routes returned HTTP200 with H1 and the correct route canonical: [live-route-smoke.json](live-route-smoke.json). Home, directory, rates and sitemap were also checked: [live-http-smoke.json](live-http-smoke.json).

The real custom domain passed **12/12 safe browser checks**: directory search/filter, payment URL/manual rate preservation, independent payment value, economic renewal comparison and early-break horizon, MLI invalid/fractional counts and sizing, single help launcher/chat close/Escape/focus/voice disclosure, all three current-state PDF downloads, and 1440/390/320px accessibility/overflow checks. See [live/premium-regressions.json](live/premium-regressions.json), screenshots and example PDFs in `live/`.

No real leads, messages, calls or non-GET integration requests were sent. AI/CRM/voice backend operation, field performance, traffic load and complete manual accessibility are not certified by these checks.

## Release-receipt follow-up

The follow-up commit records this receipt, clears pending statuses and corrects **BUG-072**: the draft CMHC premium landing-page URL returned 404. The UI and developer guide now use the exact official premium PDF linked from CMHC’s live MLI Select page; that target returned HTTP200. This reference-only correction changes no financial engine, input or output. Resolve the final deployment SHA from `git log` and Vercel using `DEVELOPER_GUIDE.md`; the implementation receipt above remains tied to its immutable deployment.

The four pre-existing owner data changes were excluded from both release commits and remain untouched in the original working folder. The released data baseline was tested in the isolated archive. Shared styling covers the complete calculator collection; full shared-shell bodies are Payment, Renewal and MLI Deal Sizer. FEAT-069/070 and the other open roadmap items remain future work.
