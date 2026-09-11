import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.kraftmortgages.ca';

// AI / answer-engine crawlers we explicitly WELCOME for GEO/AEO.
// Without these, ChatGPT, Gemini, Claude, and Perplexity cannot read the site.
const AI_BOTS = [
  'GPTBot',          // OpenAI / ChatGPT
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended', // Gemini training + answer
  'CCBot',           // Common Crawl (Perplexity, others)
  'anthropic-ai',    // Claude
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'Applebot-Extended',
  'cohere-ai',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  const aiAllow = Object.fromEntries(
    AI_BOTS.map((ua) => [ua, { userAgent: ua, allow: '/' }])
  );

  return {
    rules: [
      // General rule: allow everything except internal/private surfaces.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/dashboard/*',
          '/old-design',
          '/varun',
          '/reports/*',
          '/leads/*',
          '/voice-test',
          '/voice-google-test',
          '/voice-compare',
          '/voice-ultimate',
        ],
      },
      // Explicitly allow each AI crawler (overrides any blanket block).
      ...Object.values(aiAllow),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
