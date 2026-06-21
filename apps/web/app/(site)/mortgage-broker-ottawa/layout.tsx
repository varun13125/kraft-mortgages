import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Ottawa Mortgage Broker | Best Mortgage Rates | Kraft Mortgages',
  description: 'Trusted Ottawa mortgage broker with low interest rates. Expert in public servant stable-income pre-approvals, tech contractor compensation rules, cash-back options, and heritage district financing. Licensed FSRA #12918.',
  keywords: 'mortgage broker Ottawa, Ottawa mortgage broker, best mortgage broker Ottawa ON, Ottawa mortgage rates, first-time home buyer Ottawa, Kanata mortgage, Orleans mortgage, Ottawa refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-ottawa',
  },
  openGraph: {
    title: 'Ottawa Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Ottawa mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-ottawa',
    type: 'website',
  },
};

export default function OttawaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Ottawa" provinceName="ON" description="Licensed mortgage broker serving Ottawa, ON. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
