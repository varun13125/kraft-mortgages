# Kraft Mortgages AI Content System

A single Next.js application with integrated AI content generation pipeline for automated mortgage industry content creation.

## 🚀 Features

- **AI Agent Pipeline**: Scout → Brief → Writer → Gate → Editor → Publisher
- **Manual Control Modes**: Auto discovery, Manual topic, or Manual idea input
- **Live Dashboard**: Real-time SSE streaming of agent progress
- **Multi-Publisher**: WordPress REST API + Firestore CMS fallback
- **SEO Strategy**: Weekly analysis and recommendations
- **Firebase Auth**: Secure admin-only access with role management
- **Quality Control**: Duplicate detection, fact-checking, E-E-A-T optimization

## 📋 Environment Variables Required

Create `.env.local` with these variables:

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
npm install
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

The system will automatically run daily at 9:05 AM Vancouver time via Vercel Cron.

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
npm install

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

For local development, update `.env.local` with your API keys and Firebase config.

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
1. Cron triggers `/api/orchestrate` at 9:05 AM Vancouver time
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
