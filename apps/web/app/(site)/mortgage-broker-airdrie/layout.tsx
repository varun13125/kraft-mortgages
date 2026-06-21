import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Airdrie Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Airdrie mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, new construction financing, and refinancing. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Serving Airdrie, Crossfield, Balzac & Rocky View County.',
  keywords: 'mortgage broker Airdrie, Airdrie mortgage broker, best mortgage broker Airdrie Alberta, Airdrie mortgage rates, first-time home buyer Airdrie, self-employed mortgage Airdrie, new construction Airdrie, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-airdrie',
  },
  openGraph: {
    title: 'Airdrie Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Airdrie mortgage broker with $2B+ funded and 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-airdrie',
    type: 'website',
  },
};

export default function AirdrieLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <CityServiceJsonLd cityName="Airdrie" provinceName="AB" description="Licensed mortgage broker serving Airdrie, AB. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
