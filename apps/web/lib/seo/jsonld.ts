import { BUSINESS } from './business-config';

const SITE = BUSINESS.url;
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;

/** The single canonical Organization/LocalBusiness graph. Rendered once in app/layout.tsx. */
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness', 'MortgageBroker', 'FinancialService'],
        '@id': ORG_ID,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE,
        logo: BUSINESS.logoUrl,
        image: BUSINESS.imageUrls,
        description: 'Licensed Canadian mortgage brokerage offering residential, commercial, construction, private lending, and equity lending solutions across BC, Alberta and Ontario.',
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        priceRange: BUSINESS.priceRange,
        foundingDate: BUSINESS.foundingDate,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS.address.streetAddress,
          addressLocality: BUSINESS.address.addressLocality,
          addressRegion: BUSINESS.address.addressRegion,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS.geo.lat,
          longitude: BUSINESS.geo.lng,
        },
        areaServed: BUSINESS.areaServed.map((a) => ({ '@type': a.type, name: a.name })),
        openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        hasCredential: BUSINESS.licenses.map((l) => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'license',
          name: `${l.regulator} Licensed Mortgage Brokerage`,
          licenseNumber: l.licenseNumber,
          recognizedBy: { '@type': 'Organization', name: l.name },
        })),
        sameAs: BUSINESS.sameAs,
      },
      // WebSite + SearchAction for sitelinks search box eligibility.
      websiteJsonLdGraph(),
    ],
  };
}

function websiteJsonLdGraph() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: 'Kraft Mortgages Canada',
    url: SITE,
    inLanguage: BUSINESS.inLanguage,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList. Used on any page with visible breadcrumbs. */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage. Builds from the same FAQs array the page renders visibly. */
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Service / LocalBusiness node for a CITY page. REFERENCES the org by @id
 * rather than redefining it — fixes the local-SEO fragmentation in the audit.
 */
export function cityServiceJsonLd(opts: {
  cityName: string;
  provinceName: string;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['FinancialService', 'Service'],
    '@id': `${opts.url}#service`,
    name: `Mortgage Broker ${opts.cityName}`,
    serviceType: 'Mortgage Brokerage',
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'City',
      name: opts.cityName,
      containedInPlace: { '@type': 'State', name: opts.provinceName },
    },
    url: opts.url,
    description: opts.description,
  };
}

export { ORG_ID, SITE_ID };
