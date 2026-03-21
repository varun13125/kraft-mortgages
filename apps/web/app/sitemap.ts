import { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/seo/sitemap';
import { getRecentPosts, Post } from '@/lib/db/firestore';

// Fetch blog posts from Firestore for sitemap
async function getBlogPosts(): Promise<Array<{ slug: string; publishedAt: Date; updatedAt?: Date }>> {
  try {
    const posts = await getRecentPosts(100);

    // Filter to only published posts and extract sitemap-relevant data
    return posts
      .filter((post: Post) => post.status === 'published')
      .map((post: Post) => ({
        slug: post.slug,
        publishedAt: post.publishedAt || new Date(),
        updatedAt: (post as any).updatedAt || undefined,
      }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();
  return generateSitemap(blogPosts);
}
