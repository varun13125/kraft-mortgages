import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftmortgages.ca';

// Homepage - highest priority
const HOMEPAGE = {
  url: '',
  priority: 1.0,
  changeFrequency: 'daily' as const,
};

// Service Hubs - high priority landing pages
const SERVICE_HUBS = [
  {
    url: '/residential',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/construction',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/commercial',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/equity-lending',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/private-lending',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/business-funding',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
];

// Main calculators index
const CALCULATOR_INDEX = [
  {
    url: '/calculators',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
];

// Core calculators (under /calculators)
const CORE_CALCULATORS = [
  {
    url: '/calculators/affordability',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/payment',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/pre-approval',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/renewal',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/self-employed',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/investment',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/construction-pro',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/mortgage-penalty',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/closing-costs',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/first-time-home-buyer',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/land-transfer-tax',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/a-vs-equity',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/b-vs-equity',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/self-employed-a-vs-b',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/refinance-vs-heloc-vs-second',
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/rent-vs-buy',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/rate-comparison',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/extra-payments',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/debt-service-ratio',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/down-payment',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/cmhc-insurance',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/required-income',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/amortization',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/calculators/bc-speculation-tax',
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  },
  {
    url: '/calculators/stress-test',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

// MLI Select calculators
const MLI_SELECT_CALCULATORS = [
  {
    url: '/mli-select/calculators',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/amortization',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/break-even',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/dscr',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/eligibility-checklist',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/max-loan',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/points',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/premium',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/rent-cap',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/mli-select/calculators/scenario-compare',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

// Equity lending calculators
const EQUITY_LENDING_CALCULATORS = [
  {
    url: '/equity-lending/calculators/debt-consolidation',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/equity-lending/calculators/heloc',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/equity-lending/calculators/home-equity',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

// Construction calculators
const CONSTRUCTION_CALCULATORS = [
  {
    url: '/construction/calculators/budget',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/construction/calculators/construction-draw',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/construction/calculators/cost-to-complete',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/construction/calculators/progressive-draw',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/construction/calculators/builder-program',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

// Commercial calculators
const COMMERCIAL_CALCULATORS = [
  {
    url: '/commercial/calculators/cap-rate',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/commercial/calculators/cash-flow',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/commercial/calculators/noi-analysis',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
  {
    url: '/commercial/calculators/refinance',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
];

// Residential calculators
const RESIDENTIAL_CALCULATORS = [
  {
    url: '/residential/calculators/stress-test',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
];

// Private lending calculators
const PRIVATE_LENDING_CALCULATORS = [
  {
    url: '/private-lending/calculators/alternative-income',
    priority: 0.75,
    changeFrequency: 'weekly' as const,
  },
];

// Location pages — all 19 served cities. Must stay in sync with the static
// mortgage-broker-{city} routes under app/(site).
const LOCATION_PAGES = [
  'surrey', 'vancouver', 'burnaby', 'richmond', 'coquitlam', 'langley',
  'kelowna', 'kamloops', 'abbotsford', 'nanaimo', 'victoria',
  'calgary', 'edmonton', 'red-deer', 'lethbridge', 'airdrie',
  'toronto', 'ottawa', 'windsor',
].map((c) => ({ url: `/mortgage-broker-${c}`, priority: 0.7, changeFrequency: 'monthly' as const }));

// Info pages
const INFO_PAGES = [
  {
    url: '/about',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
  {
    url: '/contact',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
  {
    url: '/privacy',
    priority: 0.5,
    changeFrequency: 'yearly' as const,
  },
  {
    url: '/terms',
    priority: 0.5,
    changeFrequency: 'yearly' as const,
  },
  {
    url: '/learn',
    priority: 0.5,
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

  // Combine all static pages
  const staticPages = [
    HOMEPAGE,
    ...SERVICE_HUBS,
    ...CALCULATOR_INDEX,
    ...CORE_CALCULATORS,
    ...MLI_SELECT_CALCULATORS,
    ...EQUITY_LENDING_CALCULATORS,
    ...CONSTRUCTION_CALCULATORS,
    ...COMMERCIAL_CALCULATORS,
    ...RESIDENTIAL_CALCULATORS,
    ...PRIVATE_LENDING_CALCULATORS,
    ...LOCATION_PAGES,
    ...INFO_PAGES,
  ];

  // Generate URLs for static pages
  const staticUrls = staticPages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Blog index and posts
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

  return [...staticUrls, ...blogUrls];
}

// Generate XML sitemap string (for custom implementation if needed)
export function generateXMLSitemap(blogPosts: BlogPost[] = []): string {
  const urls = generateSitemap(blogPosts);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified instanceof Date ? url.lastModified.toISOString() : new Date(url.lastModified || new Date()).toISOString()}</lastmod>
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

# Allow access to all service hubs
Allow: /residential
Allow: /construction
Allow: /commercial
Allow: /equity-lending
Allow: /private-lending
Allow: /mli-select

# Allow access to all calculator pages
Allow: /calculators
Allow: /calculators/*
Allow: /mli-select/calculators/*
Allow: /equity-lending/calculators/*
Allow: /construction/calculators/*
Allow: /commercial/calculators/*
Allow: /residential/calculators/*
Allow: /private-lending/calculators/*

# Allow access to blog
Allow: /blog
Allow: /blog/*

# Allow location and province pages
Allow: /mortgage-broker-*
Allow: /provinces/*

# Disallow admin and API routes
Disallow: /admin/*
Disallow: /api/*
Disallow: /_next/*

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
}
