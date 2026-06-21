import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Richmond Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Richmond mortgage broker with 18+ Years Combined Experience. Expert in newcomer mortgages, investor financing, Steveston properties, and condo purchases. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918.',
  keywords: 'mortgage broker Richmond, Richmond mortgage broker, best mortgage broker Richmond BC, Richmond mortgage rates, newcomer mortgage Richmond, Steveston mortgage, Richmond investor mortgage, first-time home buyer Richmond, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-richmond',
  },
  openGraph: {
    title: 'Richmond Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Richmond mortgage broker with 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-richmond',
    type: 'website',
  },
};

export default function RichmondLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Richmond" provinceName="BC" description="Licensed mortgage broker serving Richmond, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
