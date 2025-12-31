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

export async function POST(req: NextRequest) {
  try {
    // Temporary: allow unauthenticated ingestion to unblock deployment.
    // If you want to require a token, set CREWAPI_SECRET and uncomment below.
    // const auth = req.headers.get('authorization') || '';
    // const required = process.env.CREWAPI_SECRET || process.env.BLOG_INGEST_TOKEN || 'n8n';
    // const token = auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : '';
    // if (token !== required && token !== 'n8n') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const title: string = body.title || '';
    const slug: string = body.slug || slugify(title);
    const markdown: string = body.content || body.markdown || '';
    const html: string = body.html || '';
    const metaDescription: string = body.excerpt || body.metaDescription || '';
    const keywords: string[] = Array.isArray(body.tags) ? body.tags : (typeof body.tags === 'string' ? JSON.parse(body.tags || '[]') : []);
    const publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();

    if (!slug || !title) {
      return NextResponse.json({ error: 'Missing slug/title' }, { status: 400 });
    }

    await savePost({
      slug,
      title,
      markdown,
      html,
      status: 'published',
      publishedAt,
      author: {
        name: body.author || 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935',
      },
      metaDescription,
      keywords,
    });

    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}


