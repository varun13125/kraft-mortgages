import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftmortgages.ca';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  {
    url: '',
    priority: 1.0,
    changeFrequency: 'daily' as const,
  },
  {
    url: '/about',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  {
    url: '/contact',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  {
    url: '/services',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
];

// Calculator pages - high priority for SEO
const CALCULATOR_PAGES = [
  {
    url: '/mortgage-calculator',
    priority: 0.95,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/affordability-calculator', 
    priority: 0.95,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/refinance-calculator',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/investment-calculator',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/payment-calculator',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/amortization-calculator',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/prepayment-calculator',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/heloc-calculator',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/mortgage-vs-rent',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/pre-approval',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/construction-draw',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/bi-weekly-vs-monthly',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/extra-payment-savings',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/debt-consolidation',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/compound-growth',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/mli-select',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/stress-test',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/closing-costs',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/land-transfer-tax',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

export interface BlogPost {
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
}

export function generateSitemap(blogPosts: BlogPost[] = []): MetadataRoute.Sitemap {
  const currentDate = new Date();
  
  // Static pages
  const staticUrls = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  
  // Calculator pages
  const calculatorUrls = CALCULATOR_PAGES.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  
  // Blog pages
  const blogUrls = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
  
  return [...staticUrls, ...calculatorUrls, ...blogUrls];
}

// Generate XML sitemap string (for custom implementation if needed)
export function generateXMLSitemap(blogPosts: BlogPost[] = []): string {
  const urls = generateSitemap(blogPosts);
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

// Generate robots.txt content programmatically
export function generateRobotsTxt(): string {
  return `# Kraft Mortgages - Robots.txt
User-agent: *
Allow: /

# Allow access to all calculator pages
Allow: /calculators/*
Allow: /mortgage-calculator
Allow: /affordability-calculator

# Allow access to blog
Allow: /blog/*

# Disallow admin and API routes
Disallow: /admin/*
Disallow: /api/*
Disallow: /_next/*

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
}