import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';
import { SetProvince } from '@/components/SetProvince';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';

export const metadata: Metadata = {
  title: 'Coquitlam Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Coquitlam mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, pre-sales, and refinancing. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Serving Coquitlam, Port Coquitlam, Port Moody & Tri-Cities.',
  keywords: 'mortgage broker Coquitlam, Coquitlam mortgage broker, best mortgage broker Coquitlam BC, Coquitlam mortgage rates, first-time home buyer Coquitlam, self-employed mortgage Coquitlam, pre-sale financing Coquitlam, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-coquitlam',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Coquitlam Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Coquitlam mortgage broker with $2B+ funded and 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-coquitlam',
    type: 'website',
  },
};

export default function CoquitlamLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <CityServiceJsonLd cityName="Coquitlam" provinceName="BC" description="Licensed mortgage broker serving Coquitlam, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {/* Province-specific disclosures follow the city's province (BUG-039). */}
      <SetProvince province="BC" />
      {children}
      <Footer />
    </>
  );
}
