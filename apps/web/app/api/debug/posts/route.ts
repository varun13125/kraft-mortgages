import { NextResponse } from 'next/server';
import { getRecentPosts, getPost } from '@/lib/db/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getRecentPosts(10);
    return NextResponse.json({
      count: posts.length,
      slugs: posts.map(p => p.slug),
      sample: posts.slice(0, 2).map(p => ({ slug: p.slug, title: p.title, publishedAt: p.publishedAt })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}


