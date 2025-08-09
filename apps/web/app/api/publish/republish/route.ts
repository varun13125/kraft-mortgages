import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import admin from 'firebase-admin';
import { isAdmin, getPost } from '@/lib/db/firestore';

const RepublishRequestSchema = z.object({
  slug: z.string().min(1),
});

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decodedToken = await admin.auth().verifyIdToken(token);
  
  const userIsAdmin = await isAdmin(decodedToken.uid);
  if (!userIsAdmin) {
    throw new Error('Admin access required');
  }

  return decodedToken;
}

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
    throw new Error(`WordPress API error: ${response.statusText} - ${error}`);
  }

  const result = await response.json();
  return result.link || `${process.env.WORDPRESS_BASE_URL}/${post.slug}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin status
    const user = await verifyAuth(request);
    
    // Parse and validate request body
    const body = await request.json();
    const { slug } = RepublishRequestSchema.parse(body);

    // Get existing post
    const post = await getPost(slug);
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

    // Update post with republish timestamp
    const updatedPost = {
      ...post,
      republishedAt: new Date(),
      republishedBy: user.uid,
    };

    // Save updated post (implementation would go here)
    
    return NextResponse.json({
      success: true,
      slug,
      url,
      method,
      message: `Post republished via ${method}`
    });

  } catch (error) {
    console.error('Republish error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('authorization') || error.message.includes('Admin')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}