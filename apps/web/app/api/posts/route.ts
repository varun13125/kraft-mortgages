import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { listFirestorePosts } from '@/lib/db/firestore';

export const dynamic = 'force-dynamic';

/**
 * Admin: list Firestore blog posts INCLUDING drafts, for the dashboard "Posts"
 * tab. AI pipeline posts are saved as drafts (BUG-018) and published from that
 * tab via POST /api/publish/republish. Hard-coded seed posts are not listed.
 */
export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const limitParam = Number(request.nextUrl.searchParams.get('limit') || 50);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 200) : 50;

  try {
    const posts = await listFirestorePosts(limit);
    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        status: p.status,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
        republishedAt: p.republishedAt ? p.republishedAt.toISOString() : null,
        wpPostId: p.wpPostId ?? null,
      })),
    });
  } catch (error) {
    console.error('[api/posts] list failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
