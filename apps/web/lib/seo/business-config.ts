/**
 * SINGLE SOURCE OF TRUTH for all Kraft Mortgages business facts.
 *
 * Every page, schema, and UI string that references the business MUST import
 * from here. Do not hardcode NAP, hours, phone, funding figures, or social
 * links anywhere else. This eliminates the $2B-vs-$5B, founding-date, and
 * NAP inconsistencies documented in the Phase 1 audit.
 */

export const BUSINESS = {
  name: 'Kraft Mortgages Canada Inc.',
  legalName: 'Kraft Mortgages Canada Inc.',
  url: 'https://www.kraftmortgages.ca',
  domain: 'kraftmortgages.ca',
  logoUrl: 'https://www.kraftmortgages.ca/kraft-logo.png',
  ogImageUrl: 'https://www.kraftmortgages.ca/og-default.jpg',
  imageUrls: ['https://www.kraftmortgages.ca/og-default.jpg'],

  // NAP — one canonical format. Used everywhere.
  telephone: '+1-604-593-1550',           // primary, tel: links
  telephoneDisplay: '604-593-1550',
  secondaryPhone: '+1-604-727-1579',
  secondaryPhoneDisplay: '604-727-1579',
  email: 'varun@kraftmortgages.ca',
  address: {
    streetAddress: '#301 - 1688 152nd Street',
    addressLocality: 'Surrey',
    addressRegion: 'BC',
    postalCode: 'V4A 4N2',
    addressCountry: 'CA',
  },
  geo: { lat: 49.0326, lng: -122.8012 },  // Surrey office

  areaServed: [
    { type: 'Province', name: 'British Columbia' },
    { type: 'Province', name: 'Alberta' },
    { type: 'Province', name: 'Ontario' },
  ],
  citiesServed: [
    'Surrey', 'Vancouver', 'Burnaby', 'Richmond', 'Coquitlam',
    'Kelowna', 'Kamloops', 'Abbotsford', 'Nanaimo', 'Victoria', 'Langley',
    'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie',
    'Toronto', 'Ottawa', 'Windsor',
  ],

  openingHours: [
    { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' },
    { days: ['Saturday'], opens: '10:00', closes: '14:00' },
  ],

  // Headline figures — ONE number each. Defaults confirmed in spec.
  fundedVolume: '$2B+',                   // was inconsistent ($5B in llms.txt)
  fundedVolumeRaw: 2_000_000_000,
  yearsExperience: '18+ Years Combined Experience',
  yearsExperienceShort: '18+',
  lenderCount: '30+',
  clientsServed: '5,000+',
  foundingDate: '2014-01-01',             // legal incorporation; not "since 2002"

  priceRange: '$$',

  licenses: [
    { regulator: 'BCFSA', name: 'British Columbia Financial Services Authority', licenseNumber: 'SR220230' },
    { regulator: 'RECA',  name: 'Real Estate Council of Alberta',               licenseNumber: 'LIC-00655428' },
    { regulator: 'FSRA',  name: 'Financial Services Regulatory Authority of Ontario', licenseNumber: '12918' },
  ],

  // ONE canonical set of social profile URLs.
  sameAs: [
    'https://www.linkedin.com/company/kraft-mortgages-canada-inc',
    'https://www.facebook.com/kraftmortgages',
  ],

  inLanguage: 'en-CA',
} as const;

export type BusinessConfig = typeof BUSINESS;
