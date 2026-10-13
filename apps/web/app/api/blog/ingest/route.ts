import { NextRequest, NextResponse } from 'next/server';
import { savePost } from '@/lib/db/firestore';
import { safeEqual } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Pillar pages for internal linking. Every url must be an existing route
// (keep in sync with DEAD_PILLAR_REDIRECTS in lib/utils/blog-content.ts).
const PILLAR_PAGES: { keywords: string[]; title: string; url: string }[] = [
  { keywords: ['private mortgage', 'private lender', 'private lending', 'alternative lender', 'b-lender', 'b lender'], title: 'Private Mortgages', url: '/private-lending' },
  { keywords: ['commercial', 'office building', 'retail space', 'industrial', 'multi-unit', 'commercial mortgage'], title: 'Commercial Financing', url: '/commercial' },
  { keywords: ['construction', 'builder', 'draw mortgage', 'build your', 'construction loan', 'construction financing'], title: 'Construction Financing', url: '/construction' },
  { keywords: ['self-employed', 'self employed', 'business owner', 'stated income'], title: 'Self-Employed Mortgages', url: '/calculators/self-employed' },
  { keywords: ['refinance', 'refinancing', 'equity take out', 'cash out', 'debt consolidation'], title: 'Mortgage Refinancing', url: '/equity-lending' },
  { keywords: ['investment property', 'rental property', 'investor', 'rental income', 'income property'], title: 'Investment Property Mortgages', url: '/calculators/investment' },
  { keywords: ['first-time', 'first time buyer', 'first home', 'first home buyer'], title: 'First-Time Home Buyer Programs', url: '/calculators/first-time-home-buyer' },
  { keywords: ['mli select', 'mli-select', 'cmhc insured', 'multi-family insurance'], title: 'MLI Select Program', url: '/mli-select' },
];

const SITE_URL = 'https://www.kraftmortgages.ca';

// Count existing internal links in content
function countInternalLinks(content: string): number {
  // Match markdown links [text](/path) or [text](https://kraftmortgages.ca/path)
  const internalLinkPattern = /\[([^\]]+)\]\(\/?[a-z][^)]*\)|\[([^\]]+)\]\(https?:\/\/(?:www\.)?kraftmortgages\.ca[^)]*\)/gi;
  return (content.match(internalLinkPattern) || []).length;
}

// Find relevant pillar pages based on content keywords
function findRelevantPillars(content: string, title: string): typeof PILLAR_PAGES {
  const text = (title + ' ' + content).toLowerCase();
  return PILLAR_PAGES.filter(p => p.keywords.some(kw => text.includes(kw)));
}

// Append internal links section if post lacks them
function ensureInternalLinks(markdown: string, title: string): { markdown: string; linksAdded: string[] } {
  const existingCount = countInternalLinks(markdown);
  if (existingCount >= 2) {
    return { markdown, linksAdded: [] };
  }

  const relevantPillars = findRelevantPillars(markdown, title);
  if (relevantPillars.length === 0) {
    // No topic match — add a generic CTA to /contact as minimum
    if (existingCount === 0) {
      const append = `\n\n---\n\n**Looking for expert mortgage advice?** [Contact Kraft Mortgages](${SITE_URL}/contact) for a free consultation.\n`;
      return { markdown: markdown + append, linksAdded: ['/contact'] };
    }
    return { markdown, linksAdded: [] };
  }

  // Build a "Related Resources" section with matched pillars
  const linkLines = relevantPillars.slice(0, 3).map(p => `- [${p.title}](${SITE_URL}${p.url})`).join('\n');
  const append = `\n\n---\n\n### Related Resources\n\n${linkLines}\n`;
  return { markdown: markdown + append, linksAdded: relevantPillars.map(p => p.url) };
}

function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Decode common HTML entities from WordPress/Marblism content
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&#x22;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")  // Right single quote
    .replace(/&#8216;/g, "'")  // Left single quote
    .replace(/&#8220;/g, '"')  // Left double quote
    .replace(/&#8221;/g, '"')  // Right double quote
    .replace(/&#8211;/g, '–')  // En dash
    .replace(/&#8212;/g, '—'); // Em dash
}

// Auto-categorize based on content analysis
function autoCategories(title: string, content: string): string[] {
  const text = (title + ' ' + content).toLowerCase();
  const categories: string[] = [];

  // Topic-based categories (priority order)
  if (text.includes('mli select') || text.includes('cmhc') || text.includes('multi-unit') || text.includes('multiunit')) {
    categories.push('MLI Select');
  }
  if (text.includes('construction') || text.includes('builder') || text.includes('draw mortgage') || text.includes('build your')) {
    categories.push('Construction Financing');
  }
  if (text.includes('self-employed') || text.includes('self employed') || text.includes('business owner') || text.includes('variable income') || text.includes('entrepreneur')) {
    categories.push('Self-Employed Mortgages');
  }
  if (text.includes('renewal') || text.includes('renew') || text.includes('refinance') || text.includes('refinancing')) {
    categories.push('Mortgage Renewals');
  }
  if (text.includes('first-time') || text.includes('first time buyer') || text.includes('first home')) {
    categories.push('First-Time Buyers');
  }
  if (text.includes('investment property') || text.includes('rental property') || text.includes('investor')) {
    categories.push('Investment Properties');
  }
  if (text.includes('bank of canada') || text.includes('interest rate') || text.includes('rate change') || text.includes('rate cut') || text.includes('rate hold') || text.includes('market update')) {
    categories.push('Market Commentary');
  }
  if (text.includes('commercial') || text.includes('office building') || text.includes('retail space')) {
    categories.push('Commercial Financing');
  }

  // Location-based categories
  if (text.includes('surrey')) {
    categories.push('Surrey Real Estate');
  }
  if (text.includes('burnaby')) {
    categories.push('Burnaby Real Estate');
  }
  if (text.includes('coquitlam')) {
    categories.push('Coquitlam Real Estate');
  }
  if (text.includes('vancouver') && !text.includes('surrey') && !text.includes('burnaby') && !text.includes('coquitlam')) {
    categories.push('Vancouver Real Estate');
  }
  if (text.includes('kelowna') || text.includes('okanagan')) {
    categories.push('Kelowna Real Estate');
  }
  if (text.includes('abbotsford') || text.includes('fraser valley')) {
    categories.push('Fraser Valley Real Estate');
  }
  if (text.includes('kamloops')) {
    categories.push('Kamloops Real Estate');
  }
  if (text.includes('calgary') || text.includes('alberta')) {
    categories.push('Alberta Real Estate');
  }
  if (text.includes('toronto') || text.includes('ontario')) {
    categories.push('Ontario Real Estate');
  }

  // Limit to 2 categories max, default to 'Mortgage Advice' if none matched
  if (categories.length === 0) {
    return ['Mortgage Advice'];
  }
  return categories.slice(0, 2);
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication via Bearer token
    const auth = req.headers.get('authorization') || '';
    const required = process.env.CREWAPI_SECRET || process.env.BLOG_INGEST_TOKEN;

    if (!required) {
      return NextResponse.json({ error: 'API not configured - set CREWAPI_SECRET or BLOG_INGEST_TOKEN' }, { status: 500 });
    }

    const token = auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : '';
    if (!safeEqual(token, required)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    // Decode HTML entities from WordPress/Marblism content
    const title: string = decodeHtmlEntities(String(body.title || '')).slice(0, 300);
    // The slug becomes the Firestore document ID: it must not contain '/' (would
    // address a sub-collection) or be '.'/'..'. Unsafe slugs are normalised.
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const slug: string = rawSlug && /^[A-Za-z0-9][A-Za-z0-9_-]{0,199}$/.test(rawSlug) ? rawSlug : slugify(rawSlug || title);
    const markdown: string = decodeHtmlEntities(body.content || body.markdown || '');
    const html: string = decodeHtmlEntities(body.html || '');

    // Auto-inject internal links if post has fewer than 2
    const { markdown: enrichedMarkdown, linksAdded } = ensureInternalLinks(markdown, title);
    const finalMarkdown = body.skipAutoLinks ? markdown : enrichedMarkdown;
    if (linksAdded.length > 0 && !body.skipAutoLinks) {
      console.log(`[ingest] Auto-added ${linksAdded.length} internal links to "${title}": ${linksAdded.join(', ')}`);
    }
    const metaDescription: string = decodeHtmlEntities(body.excerpt || body.metaDescription || '');
    let keywords: string[] = [];
    if (Array.isArray(body.tags)) {
      keywords = body.tags;
    } else if (typeof body.tags === 'string' && body.tags.trim()) {
      try {
        const parsedTags = JSON.parse(body.tags);
        keywords = Array.isArray(parsedTags) ? parsedTags : [];
      } catch {
        // Accept comma-separated tags instead of failing the whole ingest
        keywords = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    keywords = keywords.map((k) => String(k).slice(0, 100)).slice(0, 50);

    // Auto-categorize based on content if no categories provided
    const categories: string[] = (Array.isArray(body.categories) && body.categories.length > 0)
      ? body.categories
      : (typeof body.categories === 'string' && body.categories.trim()
        ? [body.categories]
        : autoCategories(title, markdown));
    const parsedDate = body.publishedAt ? new Date(body.publishedAt) : new Date();
    const publishedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const status: 'published' | 'draft' = body.status === 'draft' ? 'draft' : 'published';

    if (!slug || !title) {
      return NextResponse.json({ error: 'Missing slug/title' }, { status: 400 });
    }

    await savePost({
      slug,
      title,
      markdown: finalMarkdown,
      html,
      status,
      publishedAt,
      author: {
        name: body.author || 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918',
      },
      metaDescription,
      keywords,
      categories,
    });

    return NextResponse.json({ success: true, slug, autoLinks: linksAdded });
  } catch (e: any) {
    console.error('[blog/ingest] failed:', e?.message || e);
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 });
  }
}


