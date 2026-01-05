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
    // Default category to 'Mortgage Advice' instead of 'Uncategorized'
    const categories: string[] = Array.isArray(body.categories)
      ? body.categories
      : (typeof body.categories === 'string' && body.categories.trim()
        ? [body.categories]
        : ['Mortgage Advice']);
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


