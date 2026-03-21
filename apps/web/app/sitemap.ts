import { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/seo/sitemap';
import { postsCol } from '@/lib/db/firestore';

async function getBlogPosts() {
  try {
    const col = await postsCol();
    const snapshot = await col.where('status', '==', 'published').get();
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        slug: doc.id,
        publishedAt: data.publishedAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();
  return generateSitemap(blogPosts);
}
