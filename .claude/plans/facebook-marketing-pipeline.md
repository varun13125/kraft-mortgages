# Facebook Marketing Pipeline — Phase 4: Credential Extraction

## Status: READY FOR PLAYWRIGHT — User will restart session, then say "resume"

## Context (from sessions 2026-05-17/18)

### What's Built (Phases 1-3: CODE COMPLETE)
All infrastructure code is committed on branch `redesign/terminal-v2`:

1. **Meta Conversions API** — `apps/web/lib/meta/conversions.ts`
   - Server-side event tracking (Lead, Contact, QualifiedLead events)
   - SHA-256 hashing for user data matching
   - Integrated into contact form and lead scoring endpoints

2. **Meta Pixel (client-side)** — injected via Analytics component
   - `NEXT_PUBLIC_META_PIXEL_ID` env var

3. **Facebook Lead Ad Webhook** — `apps/web/app/api/webhooks/facebook/route.ts`
   - Leadgen data fetch via Graph API
   - Routes to Twenty CRM + Discord notifications
   - Signature verification with APP_SECRET

4. **UTM Attribution** — `apps/web/lib/utm.ts`
   - UTM parameter capture and forwarding to CRM

5. **Thinkr Voice Agent** — integrated, webhook handler at `app/api/webhooks/thinkr/route.ts`

### What's Needed (Phase 4: CREDENTIALS)
These env vars need to be extracted from Facebook/Meta and added to Vercel:

| # | Env Var | Where to Get It | Status |
|---|---------|-----------------|--------|
| 1 | `NEXT_PUBLIC_META_PIXEL_ID` | business.facebook.com → Events Manager → Pixel → Settings | PENDING |
| 2 | `META_PIXEL_ID` | Same as #1 (server-side copy) | PENDING |
| 3 | `META_CONVERSIONS_ACCESS_TOKEN` | Events Manager → Conversions API → Settings → Generate Token | PENDING |
| 4 | `FACEBOOK_APP_ID` | developers.facebook.com → Apps → App Dashboard | PENDING |
| 5 | `FACEBOOK_APP_SECRET` | App Dashboard → Settings → Show Secret | PENDING |
| 6 | `FACEBOOK_PAGE_ACCESS_TOKEN` | Graph API Explorer or App Settings → Generate Page Token | PENDING |
| 7 | `FACEBOOK_WEBHOOK_VERIFY_TOKEN` | Self-generated | DONE: `p8Gj_PAF9LaNTx9v7ID9HXjyewK7iNeFuSrcyApWKUg` |

### Facebook Page
- facebook.com/kraftmortgages

### RESUME PROTOCOL (for next session)
When user says "resume" or "continue the Facebook pipeline":

1. **Verify Playwright MCP is connected** — check if browser tools are available
2. **Launch browser via Playwright** — open headed browser so user can see
3. **Navigate to business.facebook.com** — user may need to log in manually
4. **Extract Pixel ID** from Events Manager (credentials #1 and #2)
5. **Generate Conversions API token** from Events Manager settings (credential #3)
6. **Navigate to developers.facebook.com/apps** — extract App ID and App Secret (#4, #5)
7. **Generate Page Access Token** via Graph API Explorer (#6)
8. **Save all to `.env.local`** and **add to Vercel** via `vercel env add`
9. **Test**: verify pixel fires on page load, test webhook endpoint
10. **Configure webhook in Facebook App** — subscribe to leadgen events

### MCP Config (active at ~/.claude/mcp.json)
- **playwright**: `cmd /c npx -y @playwright/mcp` — browser automation
- **n8n-mcp**: n8n workflow automation
- **outlook-mcp**: email integration
- All fixed in prior session: removed broken servers, added cmd wrappers

### Playwright Automation Steps (detailed)
```
1. browser_navigate to https://business.facebook.com/events_manager
2. User logs in if needed (or may already be logged in)
3. Find pixel in data sources list → extract Pixel ID from URL or settings
4. Navigate to pixel settings → Conversions API section → Generate Access Token
5. browser_navigate to https://developers.facebook.com/apps
6. Select app → copy App ID from dashboard
7. Settings → Basic → Show App Secret
8. Navigate to https://developers.facebook.com/tools/explorer/
9. Select app, select Page token, add permissions, generate token
10. Write all values to apps/web/.env.local
11. Run: vercel env add for each variable (or use vercel env pull + push)
12. Test webhook: curl the endpoint, verify Facebook webhook subscription
```

### Key Files
- `apps/web/lib/meta/conversions.ts` — Meta Conversions API module
- `apps/web/app/api/webhooks/facebook/route.ts` — Lead Ad webhook
- `apps/web/.env.example` — All required env vars listed
- `~/.claude/mcp.json` — MCP server config (playwright ready)
- `apps/web/components/Analytics.tsx` — Pixel injection point

### Vercel Deployment
After extracting credentials:
```bash
# Add each to Vercel production
vercel env add NEXT_PUBLIC_META_PIXEL_ID production
vercel env add META_PIXEL_ID production
vercel env add META_CONVERSIONS_ACCESS_TOKEN production
vercel env add FACEBOOK_APP_ID production
vercel env add FACEBOOK_APP_SECRET production
vercel env add FACEBOOK_PAGE_ACCESS_TOKEN production
vercel env add FACEBOOK_WEBHOOK_VERIFY_TOKEN production

# Redeploy to pick up new env vars
vercel --prod
```
