import { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/seo/sitemap';

// This would eventually fetch from your blog database
async function getBlogPosts() {
  // TODO: Replace with actual database query when blog is implemented
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();
  return generateSitemap(blogPosts);
}
