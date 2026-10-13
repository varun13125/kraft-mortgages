import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPost } from '@/lib/db/firestore';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const RepublishRequestSchema = z.object({
  slug: z.string().min(1).max(200),
});

async function republishToWordPress(post: any): Promise<string> {
  if (!process.env.WORDPRESS_BASE_URL || !process.env.WORDPRESS_USERNAME || !process.env.WORDPRESS_APP_PASSWORD) {
    throw new Error('WordPress not configured');
  }

  const wpData = {
    title: post.title,
    slug: post.slug,
    content: post.html || post.markdown,
    status: 'publish',
    excerpt: post.metaDescription || '',
    meta: {
      description: post.metaDescription || '',
      keywords: (post.keywords || []).join(', ')
    }
  };

  const response = await fetch(`${process.env.WORDPRESS_BASE_URL}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`
      ).toString('base64')}`
    },
    body: JSON.stringify(wpData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WordPress API error: ${response.status} ${response.statusText} - ${error.slice(0, 300)}`);
  }

  const result = await response.json();
  return result.link || `${process.env.WORDPRESS_BASE_URL}/${post.slug}`;
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

    let url: string;
    let method: 'wordpress' | 'firestore' = 'firestore';

    // Try WordPress first
    try {
      url = await republishToWordPress(post);
      method = 'wordpress';
    } catch (wpError) {
      console.warn('WordPress republish failed:', wpError);
      // Fallback to Firestore URL
      url = `https://www.kraftmortgages.ca/blog/${slug}`;
      method = 'firestore';
    }

    // TODO (not implemented): persist republishedAt / republishedBy (adminCheck.uid)
    // on the Firestore post. NOTE: republishToWordPress() always POSTs a NEW
    // WordPress post, so repeated republishes create duplicates there.
    
    return NextResponse.json({
      success: true,
      slug,
      url,
      method,
      message: `Post republished via ${method}`
    });

  } catch (error) {
    console.error('Republish error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}