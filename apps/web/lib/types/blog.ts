export interface BlogPost {
  slug: string;
  title: string;
  content: string; // Full markdown content
  excerpt: string; // Meta description (155 chars)
  author: string;
  authorEmail: string;
  publishedAt: string; // ISO string
  updatedAt: string; // ISO string
  status: 'published' | 'draft';
  featured: boolean;
  categories: string[]; // ["Mortgage Advice", "Canadian Real Estate"]
  tags: string[]; // SEO keywords array
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string; // "/images/blog-default.jpg"
    canonicalUrl: string; // Full URL
  };
  readingTime: number; // Minutes to read
  brief?: any; // Content planning data from n8n
}

export interface BlogPostListItem {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
  categories: string[];
}