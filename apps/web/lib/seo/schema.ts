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