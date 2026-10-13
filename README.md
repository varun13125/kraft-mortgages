# Kraft Mortgages AI Content System

A single Next.js application with integrated AI content generation pipeline for automated mortgage industry content creation.

## Developer quick reference (updated 2026-10)

The sections further down describe the original AI content pipeline and are partly out of date. Current facts:

- **Monorepo:** pnpm workspaces. `apps/web` (`@kraft/web`, the site, Next.js 14 App Router), `mli-select-complete` (`mli-portal`, a static-export microsite copied into `apps/web/public/mli-select` at build time), `packages/prisma` (optional Postgres schema), `packages/ui` (empty placeholder).
- **Install / run (local):** `pnpm install` → `pnpm dev` (http://localhost:3000). Other scripts: `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- **Env vars:** copy `apps/web/.env.example` to `apps/web/.env.local`. Next.js only reads env files from `apps/web/`. That example file is the full, commented list of every variable the code reads.
- **Vercel deploy (as configured today):** the project Root Directory is the **repo root**, so the **root `vercel.json` is the one in effect**. It uses `npm install` (resolved from `package-lock.json`) and runs `npm run build`, which uses pnpm to build `mli-portal` and then `@kraft/web`. `apps/web/vercel.json` is **ignored**, so its apex→www redirect, `X-Robots-Tag` header, `/crewapi` rewrite and `/api/cron/daily` cron do not run. Two lockfiles exist (`package-lock.json` for prod, `pnpm-lock.yaml` for local/CI). See `DEVLOG/audit-2026-10/platform-build-deps.md` before changing any of this.
- **Cron:** `/api/orchestrate` runs at `5 9 * * *`. Vercel cron times are **UTC**, so that is 09:05 UTC (about 2:05 AM Vancouver), not 9:05 AM local time. Set `CRON_SECRET` in Vercel so cron calls are authenticated.
- **CI:** `.github/workflows/ci.yml` runs a blocking typecheck, a lint job that does not block yet (existing errors still need fixing), and a build.

## 🚀 Features

- **AI Agent Pipeline**: Scout → Brief → Writer → Gate → Editor → Publisher
- **Manual Control Modes**: Auto discovery, Manual topic, or Manual idea input
- **Live Dashboard**: Real-time SSE streaming of agent progress
- **Multi-Publisher**: WordPress REST API + Firestore CMS fallback
- **SEO Strategy**: Weekly analysis and recommendations
- **Firebase Auth**: Secure admin-only access with role management
- **Quality Control**: Duplicate detection, fact-checking, E-E-A-T optimization

## 📋 Environment Variables Required

Create `apps/web/.env.local` (subset shown — the full list is in `apps/web/.env.example`):

```env
# Firebase Web Config (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Required - Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# LLM APIs (At least ONE required)
OPENAI_API_KEY=sk-...                    # GPT-4 (recommended)
ANTHROPIC_API_KEY=sk-ant-...             # Claude (alternative)
GOOGLE_API_KEY=AIza...                   # Gemini (alternative)
OPENROUTER_API_KEY=sk-or-...             # OpenRouter (fallback)

# Search API (Required)
TAVILY_API_KEY=tvly-...                  # Get free at tavily.com

# WordPress (Optional - uses Firestore CMS if not configured)
WORDPRESS_BASE_URL=https://blog.kraftmortgages.ca
WORDPRESS_USERNAME=admin
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Google Search Console (Optional - for SEO strategy)
GSC_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GSC_SITE_URL=https://www.kraftmortgages.ca

# Cron Security (Required)
CREWAPI_SECRET=your-random-secret-string
```

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Firebase Setup
1. Create project at https://console.firebase.google.com
2. Enable **Email/Password** authentication
3. Create Firestore database (production mode)
4. Generate service account key:
   - Project Settings → Service Accounts → Generate New Private Key
5. Add admin user to Firebase Auth
6. Create Firestore document: `admins/{uid}` with any field (e.g., `role: "admin"`)

### 3. Get API Keys

**Tavily (Required):**
- Sign up at https://tavily.com (free tier: 1000 searches/month)

**Choose an LLM Provider (at least one):**
- **OpenAI**: https://platform.openai.com/api-keys (best quality)
- **Anthropic**: https://console.anthropic.com/settings/keys
- **Google**: https://makersuite.google.com/app/apikey (free tier available)
- **OpenRouter**: https://openrouter.ai/keys (fallback option)

### 4. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/varun13125/kraft-mortgages)

1. Connect GitHub repository
2. Set Framework Preset to "Next.js"  
3. Add all environment variables in Vercel dashboard
4. Deploy!

The system runs daily at 09:05 UTC (`5 9 * * *` in the root `vercel.json`, about 2:05 AM Vancouver) via Vercel Cron.

## 📊 Dashboard Usage

### Access
Navigate to: `https://your-app.vercel.app/login`
Login with your Firebase admin account.

### Run Modes
- **Auto**: AI discovers trending mortgage topics automatically
- **Manual Topic**: You provide a specific topic to write about
- **Manual Idea**: You provide a content idea or angle

### Agent Pipeline
1. **Scout**: Searches for authoritative sources and trending topics
2. **Brief**: Creates SEO-optimized content outline and strategy
3. **Writer**: Drafts comprehensive article with proper citations [n]
4. **Gate**: Fact-checks content and detects duplicates using embeddings
5. **Editor**: Enhances for E-E-A-T principles, adds author credentials
6. **Publisher**: Publishes to WordPress or Firestore CMS with schema markup

### Live Monitoring
- Real-time progress via Server-Sent Events (SSE)
- Step-by-step status updates
- Error handling and retry logic
- Completion notifications with publish URLs

## 🔗 API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/run` - Start new content generation
- `GET /api/runs/[runId]` - Get run status
- `GET /api/runs/[runId]/stream` - SSE live updates
- `POST /api/orchestrate` - Execute pipeline step (cron)
- `POST /api/publish/republish` - Republish existing content
- `POST /api/strategy/weekly` - Generate SEO strategy

## 🎯 Content Quality

### E-E-A-T Optimization
- **Expertise**: Cites authoritative mortgage industry sources
- **Experience**: Includes 23+ years broker credentials and real examples
- **Authoritativeness**: Author bio with license #M08001935
- **Trustworthiness**: Fact-checked claims with proper attribution

### Anti-AI Detection
**Important**: This system does NOT attempt to evade AI detection. Content is enhanced for genuine quality, expertise, and reader value through:
- Real industry expertise integration
- Proper source attribution
- Author credentials and contact information
- Current market data and regulations
- Actionable advice for Canadian homebuyers

## 🧪 Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
http://localhost:3000
```

For local development, put your API keys and Firebase config in `apps/web/.env.local`.

## 🔒 Security Features

- Firebase ID token verification on all write endpoints
- Admin role checking via Firestore `admins/{uid}` collection
- API key protection for cron jobs (`CREWAPI_SECRET`)
- Input validation with Zod schemas
- Rate limiting considerations for production

## 📈 SEO Strategy Module

If Google Search Console is configured:
- Weekly performance analysis
- Content gap identification  
- Keyword opportunity detection
- Technical optimization recommendations
- Automated action plan generation

## 🚨 Troubleshooting

### "Admin only" error
- Ensure Firebase user exists in `admins/{uid}` Firestore collection

### No LLM response
- Verify at least one LLM API key is configured and has credits
- Check API key quotas and rate limits

### SSE stream not connecting
- Check browser developer tools for connection errors
- Verify Firebase token is valid and not expired

### WordPress publish fails
- Verify REST API is enabled on WordPress site
- Check application password is correct (not regular password)
- Ensure proper authentication headers

### Cron not running
- Verify `CREWAPI_SECRET` is set in Vercel environment
- Check Vercel function logs for cron execution
- Ensure cron schedule is properly configured in `vercel.json`

## 📖 Content Generation Process

### Automated Daily Runs
1. Cron triggers `/api/orchestrate` at 09:05 UTC
2. System creates new auto-discovery run
3. Scout finds trending mortgage topics from authoritative sources
4. Brief creates SEO-optimized content strategy
5. Writer drafts comprehensive article with citations
6. Gate performs quality control and duplicate detection
7. Editor enhances for E-E-A-T and adds author credentials  
8. Publisher posts to WordPress or Firestore with schema markup

### Manual Content Creation
Use the dashboard to create targeted content:
- **Topic Mode**: "BC First-Time Home Buyer Guide 2024"
- **Idea Mode**: "How recent rate changes affect refinancing decisions"

## 🎯 Production Checklist

- [ ] Firebase project created and configured
- [ ] Admin user added with Firestore admin document
- [ ] At least one LLM API key configured with credits
- [ ] Tavily API key obtained (free tier sufficient for testing)
- [ ] Environment variables set in Vercel
- [ ] Test run completed successfully
- [ ] Cron job verified working
- [ ] WordPress integration tested (if using)

## 📧 Support & Maintenance

- Monitor Vercel function logs for errors
- Check Firebase Firestore for run status and debugging
- Review published content quality regularly
- Update API keys before expiration
- Monitor API usage and quotas

---

**Built with Next.js 14, TypeScript, Firebase, and AI agents for automated mortgage industry content generation.**# Updated Tue, Oct  7, 2025 10:38:55 PM
