'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  schema?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SEO: SEOProps = {
  title: 'Kraft Mortgages - Expert Mortgage Advisory & AI Consultation',
  description: 'Get expert mortgage advice with our AI-powered platform. Calculate affordability, compare rates, and connect with certified mortgage professionals in Canada.',
  keywords: 'mortgage calculator, mortgage broker, home financing, mortgage rates, affordability calculator, mortgage advice Canada, AI mortgage consultation',
  ogImage: 'https://www.kraftmortgages.ca/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  author: 'Kraft Mortgages',
};

export function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  schema,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
}: SEOProps) {
  const pathname = usePathname();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftmortgages.ca';
  const fullTitle = title ? `${title} | Kraft Mortgages` : DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaKeywords = keywords || DEFAULT_SEO.keywords;
  const imageUrl = ogImage || DEFAULT_SEO.ogImage;
  const pageUrl = ogUrl || canonicalUrl || `${siteUrl}${pathname}`;
  
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author || DEFAULT_SEO.author} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en-CA" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content="Kraft Mortgages" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || 'Kraft Mortgages'} />
      <meta property="og:locale" content="en_CA" />
      
      {/* Article-specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title || 'Kraft Mortgages'} />
      <meta name="twitter:site" content="@kraftmortgages" />
      <meta name="twitter:creator" content="@kraftmortgages" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#D4AF37" />
      <meta name="msapplication-TileColor" content="#D4AF37" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* JSON-LD Schema */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      
      {/* Default Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Kraft Mortgages",
            "description": "Expert mortgage advisory services with AI-powered consultation and comprehensive mortgage calculators.",
            "url": siteUrl,
            "logo": `${siteUrl}/images/kraft-logo.png`,
            "image": imageUrl,
            "telephone": "+1-604-727-1579",
            "email": "info@kraftmortgages.ca",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA",
              "addressRegion": "BC"
            },
            "serviceArea": {
              "@type": "Country",
              "name": "Canada"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Mortgage Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mortgage Calculation Services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Mortgage Consultation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mortgage Rate Comparison"
                  }
                }
              ]
            }
          })
        }}
      />
    </Head>
  );
}