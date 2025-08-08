# Kraft Mortgages – Next‑Gen Platform

🚀 **Live Site**: Professional mortgage brokerage platform with Firebase integration

## Quick Start
1) `pnpm i`
2) `docker compose -f infra/docker-compose.yml up -d`
3) `pnpm db:migrate`
4) `pnpm dev`
5) In another shell: `cd apps/fastapi && uvicorn src.main:app --reload`

Open http://localhost:3000


## Batch 2 Features
- Lender adapters (FastAPI) + `/lenders/aggregate`
- OCR for PDFs + S3 (Localstack) on `/documents/upload`
- GA4 + Segment inject via `Analytics` component
- Admin rates page `/admin/rates` and cron `/api/cron/pull-rates`
- Nurture automation endpoint `/api/automations/nurture`

### Cron examples
```bash
# pull lender rates and persist snapshots
curl -X POST http://localhost:3000/api/cron/pull-rates

# run nurture for recent leads
curl -X POST http://localhost:3000/api/automations/nurture
```


## Batch 3 Features
- Voice agent flow (Twilio): `/api/voice/twilio/entry` → record → transcription via OpenAI → lead creation
- Personalization API: `/api/user/prefs` (upsert prefs per user)
- PWA offline calculators: manifest + service worker + `<PWA/>` auto‑register
- Provincial compliance rule engine + `ComplianceBanner`
- Admin Analytics dashboard with simple forecast
- KPI daily cron: `POST /api/cron/reports/daily`

### Twilio Webhooks (dev)
- Voice URL: `https://yourdomain/api/voice/twilio/entry`
- Status callbacks optional. For local dev, expose via `ngrok http 3000`

### Migrations
Run after pulling Batch 3:
```bash
pnpm db:migrate   # or: pnpm --filter @kraft/prisma prisma migrate dev
```


## Polish & Wire-ups
- **Personalization:** Province & language stored locally and synced to server (`/api/user/prefs`); ChatAlex uses them in prompts.
- **Rule Engine UI:** `ComplianceBanner` added to all calculators + MLI + Chat.
- **PWA Offline:** Now caches pro calculators and MLI pages.
- **Preferences UI:** `/settings` page and province switcher in Nav.
- **SEO:** Organization JSON‑LD on home.
