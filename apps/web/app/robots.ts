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

// Private / non-content surfaces. Prefix rules (no trailing `/*`) so the bare
// path (e.g. `/admin`) is covered as well as everything under it.
//
// NOTE: `/old-design` and `/varun` are intentionally NOT disallowed. Both pages
// emit `robots: noindex` metadata, and Google can only honour a noindex on a
// page it is allowed to crawl — a robots.txt block would let the bare URL be
// indexed from external links (e.g. the varun.kraftmortgages.ca redirect).
const PRIVATE_PATHS = [
  '/admin',
  '/api/',
  '/dashboard',
  '/login',
  '/settings',
  '/mli-proxy/',
  '/crewapi/',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General rule: allow everything except internal/private surfaces.
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // Explicitly allow each AI crawler. A crawler that matches its own group
      // ignores the `*` group entirely, so the private paths must be repeated
      // here or these bots would be invited into /admin and /api.
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/', disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
