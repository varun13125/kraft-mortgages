import { BUSINESS } from './business-config';

/**
 * Shared Open Graph defaults.
 *
 * Next.js replaces (does not deep-merge) a parent's `openGraph` object when a
 * child segment defines its own, so any page that sets `openGraph` without
 * `images` silently loses the og:image. Spread this into every page-level
 * `openGraph` so the default share image, site name and locale are kept:
 *
 *   openGraph: { ...OG_DEFAULTS, title, description, url }
 */
export const OG_DEFAULTS = {
  siteName: 'Kraft Mortgages',
  locale: 'en_CA',
  type: 'website' as const,
  images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
};
