import { contactMetadata } from './metadata';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/SEO/JsonLd';
import { ORG_ID, SITE_ID } from '@/lib/seo/jsonld';

export const metadata = contactMetadata;

// The page used to emit its own LocalBusiness node (@id "/#contact") with a
// different geo point (49.1014,-122.7927 — Newton, not the 152nd St office),
// different hours (Mon–Fri 9–6, Sat 10–4) and a non-schema.org type
// ("CanadianProvince"), contradicting the canonical org node rendered in
// app/layout.tsx from lib/seo/business-config.ts. A ContactPage that points at
// that single org node avoids conflicting structured data.
const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://www.kraftmortgages.ca/contact#webpage',
  url: 'https://www.kraftmortgages.ca/contact',
  name: 'Contact Kraft Mortgages',
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  mainEntity: { '@id': ORG_ID },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactPageJsonLd} />
      {children}
      <Footer />
    </>
  );
}
