import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';
import { SetProvince } from '@/components/SetProvince';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';

export const metadata: Metadata = {
  title: 'Kamloops Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Licensed Kamloops mortgage broker with $2B+ funded and 18+ Years Combined Experience. Expert in residential, commercial, construction, and private lending. Free pre-approval in 24 hours.',
  keywords: 'mortgage broker Kamloops, Kamloops mortgage broker, best mortgage broker Kamloops BC, Kamloops mortgage rates',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-kamloops',
  },
  // Without its own openGraph this page inherited the homepage's og:title/og:url.
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Kamloops Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
    description: 'Licensed Kamloops mortgage broker with $2B+ funded and 18+ Years Combined Experience. Expert in residential, commercial, construction, and private lending. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-kamloops',
  },
};

export default function KamloopsLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <CityServiceJsonLd cityName="Kamloops" provinceName="BC" description="Licensed mortgage broker serving Kamloops, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {/* Province-specific disclosures follow the city's province (BUG-039). */}
      <SetProvince province="BC" />
      {children}
      <Footer />
    </>
  );
}
