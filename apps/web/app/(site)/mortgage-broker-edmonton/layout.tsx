import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';
import { SetProvince } from '@/components/SetProvince';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';

export const metadata: Metadata = {
  title: 'Edmonton Mortgage Broker | Competitive Rates | Kraft Mortgages',
  description: 'Trusted Edmonton mortgage broker with low interest rates. Expert in Windermere home builds, rental property cashflow calculation offsets, and first-time buyer assistance. Licensed RECA LIC-00655428.',
  keywords: 'mortgage broker Edmonton, Edmonton mortgage broker, best mortgage broker Edmonton AB, Edmonton mortgage rates, first-time home buyer Edmonton, Windermere Edmonton mortgage, Griesbach mortgage, Edmonton refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-edmonton',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Edmonton Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Edmonton mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-edmonton',
    type: 'website',
  },
};

export default function EdmontonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Edmonton" provinceName="AB" description="Licensed mortgage broker serving Edmonton, AB. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {/* Province-specific disclosures follow the city's province (BUG-039). */}
      <SetProvince province="AB" />
      {children}
      <Footer />
    </>
  );
}
