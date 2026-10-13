import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPost, updatePostMeta } from '@/lib/db/firestore';
import { requireAdmin } from '@/lib/auth';
import { sanitizeBlogHtml } from '@/lib/security/sanitizeHtml';

export const dynamic = 'force-dynamic';

const RepublishRequestSchema = z.object({
  slug: z.string().min(1).max(200),
});

type WordPressResult = { url: string; wpPostId: number | null; action: 'updated' | 'created' };

function wordPressConfig() {
  const base = (process.env.WORDPRESS_BASE_URL || '').trim().replace(/\/+$/, '');
  const user = process.env.WORDPRESS_USERNAME;
  const pass = process.env.WORDPRESS_APP_PASSWORD;
  if (!base || !user || !pass) return null;
  return {
    base,
    auth: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
  };
}

/**
 * Finds the existing WordPress post for a slug (any status except trash).
 * Throws when the lookup itself fails, so we never create a duplicate just
 * because WordPress was unreachable.
 */
async function findWordPressPostId(cfg: { base: string; auth: string }, slug: string): Promise<number | null> {
  const url = `${cfg.base}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=any&context=edit&_fields=id,slug`;
  const res = await fetch(url, { headers: { Authorization: cfg.auth }, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`WordPress lookup failed: ${res.status} ${res.statusText}`);
  }
  const rows = await res.json();
  if (!Array.isArray(rows)) return null;
  const match = rows.find((r: any) => r && r.slug === slug && Number.isInteger(r.id)) || rows.find((r: any) => r && Number.isInteger(r.id));
  return match ? Number(match.id) : null;
}

/** Update the post with this slug in WordPress, or create it if it does not exist yet. */
async function republishToWordPress(post: any): Promise<WordPressResult> {
  const cfg = wordPressConfig();
  if (!cfg) {
    throw new Error('WordPress not configured');
  }

  const wpData = {
    title: post.title,
    slug: post.slug,
    // Already sanitized on read; sanitize again because this leaves our domain.
    content: sanitizeBlogHtml(post.html || post.markdown || ''),
    // Republishing is an explicit admin action (the human review step for AI drafts).
    status: 'publish',
    excerpt: post.metaDescription || '',
    meta: {
      description: post.metaDescription || '',
      keywords: (post.keywords || []).join(', ')
    }
  };

  // Previously this always POSTed to /posts, creating a duplicate WordPress post
  // on every republish. Look the post up by slug and update it in place.
  const existingId = await findWordPressPostId(cfg, post.slug);
  const endpoint = existingId ? `${cfg.base}/wp-json/wp/v2/posts/${existingId}` : `${cfg.base}/wp-json/wp/v2/posts`;

  const response = await fetch(endpoint, {
    method: 'POST', // WordPress accepts POST (as well as PUT/PATCH) for updates on /posts/{id}
    headers: {
      'Content-Type': 'application/json',
      Authorization: cfg.auth,
    },
    body: JSON.stringify(wpData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WordPress API error: ${response.status} ${response.statusText} - ${error.slice(0, 300)}`);
  }

  const result = await response.json();
  const wpPostId = Number.isInteger(result?.id) ? Number(result.id) : existingId;
  return {
    url: result.link || `${cfg.base}/${post.slug}`,
    wpPostId: wpPostId ?? null,
    action: existingId ? 'updated' : 'created',
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin status.
    // (Previously used admin.auth() directly, which throws "default Firebase app
    // does not exist" unless another module had initialised Firebase first.)
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // Parse and validate request body
    const parsed = RepublishRequestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }
    const { slug } = parsed.data;

    // Get existing post (admins may republish drafts)
    const post = await getPost(slug, { includeDrafts: true });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    let url = `https://www.kraftmortgages.ca/blog/${slug}`;
    let method: 'wordpress' | 'firestore' = 'firestore';
    let wp: WordPressResult | null = null;

    // Try WordPress first (only when configured)
    if (wordPressConfig()) {
      try {
        wp = await republishToWordPress(post);
        url = wp.url;
        method = 'wordpress';
      } catch (wpError) {
        console.warn('WordPress republish failed:', wpError instanceof Error ? wpError.message : wpError);
      }
    }

    // Persist the republish on the Firestore post. Republishing is the admin
    // approval step for AI drafts (BUG-018), so a draft becomes published here.
    // updatePostMeta() never creates a document, so hard-coded seed posts are
    // left alone (a stub doc would shadow them).
    const now = new Date();
    const wasDraft = post.status === 'draft';
    const firestoreUpdated = await updatePostMeta(slug, {
      status: 'published',
      ...(wasDraft ? { publishedAt: now } : {}),
      republishedAt: now,
      republishedBy: adminCheck.uid,
      republishMethod: method,
      ...(wp?.wpPostId ? { wpPostId: wp.wpPostId, wpUrl: wp.url } : {}),
    });

    return NextResponse.json({
      success: true,
      slug,
      url,
      method,
      wpAction: wp?.action ?? null,
      wpPostId: wp?.wpPostId ?? null,
      approvedDraft: wasDraft && firestoreUpdated,
      firestoreUpdated,
      message: wp
        ? `Post ${wp.action === 'updated' ? 'updated' : 'created'} in WordPress${wasDraft && firestoreUpdated ? ' and published on the blog' : ''}`
        : wasDraft && firestoreUpdated
          ? 'Draft approved and published on the blog'
          : 'Post republished via firestore'
    });

  } catch (error) {
    console.error('Republish error:', error instanceof Error ? error.message : error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
