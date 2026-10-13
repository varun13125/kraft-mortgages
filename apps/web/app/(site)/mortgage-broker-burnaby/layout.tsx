import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';
import { SetProvince } from '@/components/SetProvince';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';

export const metadata: Metadata = {
  title: 'Burnaby Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Top-rated Burnaby mortgage broker with 18+ Years Combined Experience. Expert in Metrotown condos, Brentwood pre-sales, and SFU area homes. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Free pre-approval.',
  keywords: 'mortgage broker Burnaby, Burnaby mortgage broker, best mortgage broker Burnaby BC, Burnaby mortgage rates, Metrotown mortgage, Brentwood condo mortgage, SFU area mortgage, first-time home buyer Burnaby, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-burnaby',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Burnaby Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Burnaby mortgage broker with 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-burnaby',
    type: 'website',
  },
};

export default function BurnabyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Burnaby" provinceName="BC" description="Licensed mortgage broker serving Burnaby, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {/* Province-specific disclosures follow the city's province (BUG-039). */}
      <SetProvince province="BC" />
      {children}
      <Footer />
    </>
  );
}
