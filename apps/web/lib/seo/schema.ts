interface FAQ {
  question: string;
  answer: string;
}

interface ArticleData {
  title: string;
  description: string;
  content: string;
  author: string;
  url: string;
  publishedDate?: string;
  modifiedDate?: string;
  faq?: FAQ[];
}

export function buildArticleJsonLd(data: ArticleData): any {
  const {
    title,
    description,
    content,
    author,
    url,
    publishedDate,
    modifiedDate,
    faq = []
  } = data;

  const publishDate = publishedDate || new Date().toISOString();
  const modifyDate = modifiedDate || publishDate;

  const schema: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: title,
        description,
        url,
        datePublished: publishDate,
        dateModified: modifyDate,
        wordCount: content.split(/\s+/).length,
        author: {
          '@type': 'Person',
          '@id': `https://www.kraftmortgages.ca/about#varun-chaudhry`,
          name: author,
          jobTitle: 'Licensed Mortgage Broker',
          worksFor: {
            '@type': 'FinancialService',
            '@id': 'https://www.kraftmortgages.ca#organization',
            name: 'Kraft Mortgages Canada Inc.',
            url: 'https://www.kraftmortgages.ca',
            telephone: '+1-604-593-1550',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '301-1688 152nd Street',
              addressLocality: 'Surrey',
              addressRegion: 'BC',
              postalCode: 'V4A 4N2',
              addressCountry: 'CA'
            }
          }
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.kraftmortgages.ca#organization',
          name: 'Kraft Mortgages Canada Inc.',
          logo: {
            '@type': 'ImageObject',
            '@id': 'https://www.kraftmortgages.ca/kraft-logo.png',
            url: 'https://www.kraftmortgages.ca/kraft-logo.png',
            width: 180,
            height: 60
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        },
        isPartOf: {
          '@type': 'Website',
          '@id': 'https://www.kraftmortgages.ca#website',
          name: 'Kraft Mortgages Canada',
          url: 'https://www.kraftmortgages.ca'
        }
      }
    ]
  };

  // Add FAQ schema if FAQ data is provided
  if (faq && faq.length > 0) {
    schema['@graph'].push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  return schema;
}

// Calculator-specific schema
export function buildCalculatorJsonLd(
  calculatorName: string,
  description: string,
  url: string
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#calculator`,
    name: calculatorName,
    description: description,
    url: url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD'
    },
    provider: {
      '@type': 'Organization',
      '@id': 'https://www.kraftmortgages.ca#organization',
      name: 'Kraft Mortgages Canada Inc.',
      url: 'https://www.kraftmortgages.ca'
    },
    browserRequirements: 'Requires JavaScript',
    permissions: 'No special permissions required',
    isAccessibleForFree: true,
    inLanguage: 'en-CA',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
}

// How-to schema for calculator guides
export function buildHowToJsonLd(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `#how-to-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name: name,
    description: description,
    totalTime: 'PT5M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'CAD',
      value: '0'
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Income information'
      },
      {
        '@type': 'HowToSupply', 
        name: 'Property details'
      }
    ],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image
    }))
  };
}

// Website schema with site search
export function buildWebSiteJsonLd(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.kraftmortgages.ca#website',
    name: 'Kraft Mortgages Canada',
    alternateName: 'Kraft Mortgage Calculator & Advisory',
    url: 'https://www.kraftmortgages.ca',
    description: 'Professional mortgage advisory platform with AI consultation and comprehensive mortgage calculators for Canadian homebuyers.',
    inLanguage: 'en-CA',
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.kraftmortgages.ca/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.kraftmortgages.ca#organization',
      name: 'Kraft Mortgages Canada Inc.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.kraftmortgages.ca/kraft-logo.png'
      }
    }
  };
}

// Breadcrumb schema generator
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': '#breadcrumb',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// FAQ schema
export function buildFAQJsonLd(faqs: Array<{ question: string; answer: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': '#faq',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function buildLocalBusinessJsonLd(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': 'https://www.kraftmortgages.ca#organization',
    name: 'Kraft Mortgages Canada Inc.',
    description: 'Expert mortgage solutions across BC, AB & ON. Specializing in MLI Select, Construction Financing, and Self-Employed mortgages.',
    url: 'https://www.kraftmortgages.ca',
    telephone: '+1-604-593-1550',
    email: 'varun@kraftmortgages.ca',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '301-1688 152nd Street',
      addressLocality: 'Surrey',
      addressRegion: 'BC',
      postalCode: 'V4A 4N2',
      addressCountry: 'CA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.0323,
      longitude: -122.8028
    },
    openingHours: ['Mo-Fr 09:00-17:00'],
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'State',
        name: 'British Columbia',
        containedInPlace: {
          '@type': 'Country',
          name: 'Canada'
        }
      },
      {
        '@type': 'State',
        name: 'Alberta',
        containedInPlace: {
          '@type': 'Country',
          name: 'Canada'
        }
      },
      {
        '@type': 'State',
        name: 'Ontario',
        containedInPlace: {
          '@type': 'Country',
          name: 'Canada'
        }
      }
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Professional License',
        recognizedBy: {
          '@type': 'Organization',
          name: 'British Columbia Financial Services Authority',
          url: 'https://www.bcfsa.ca'
        }
      }
    ],
    sameAs: [
      'https://www.linkedin.com/company/kraft-mortgages'
    ]
  };
}