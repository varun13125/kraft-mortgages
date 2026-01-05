import { NextRequest, NextResponse } from 'next/server';
import { savePost } from '@/lib/db/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    if (token !== required) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    // Decode HTML entities from WordPress/Marblism content
    const title: string = decodeHtmlEntities(body.title || '');
    const slug: string = body.slug || slugify(title);
    const markdown: string = decodeHtmlEntities(body.content || body.markdown || '');
    const html: string = decodeHtmlEntities(body.html || '');
    const metaDescription: string = decodeHtmlEntities(body.excerpt || body.metaDescription || '');
    const keywords: string[] = Array.isArray(body.tags) ? body.tags : (typeof body.tags === 'string' ? JSON.parse(body.tags || '[]') : []);

    // Auto-categorize based on content if no categories provided
    const categories: string[] = (Array.isArray(body.categories) && body.categories.length > 0)
      ? body.categories
      : (typeof body.categories === 'string' && body.categories.trim()
        ? [body.categories]
        : autoCategories(title, markdown));
    const publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    const status: 'published' | 'draft' = body.status === 'draft' ? 'draft' : 'published';

    if (!slug || !title) {
      return NextResponse.json({ error: 'Missing slug/title' }, { status: 400 });
    }

    await savePost({
      slug,
      title,
      markdown,
      html,
      status,
      publishedAt,
      author: {
        name: body.author || 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935',
      },
      metaDescription,
      keywords,
      categories,
    });

    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}


