import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Toronto Mortgage Broker | Premium Rates | Kraft Mortgages',
  description: 'Trusted Toronto mortgage broker with premium institutional rates and customized financing structures. Expert in double land transfer tax rebates, garden suite secondary income calculation, and high-net-worth stress-test bypass options. Licensed FSRA #12918.',
  keywords: 'mortgage broker Toronto, Toronto mortgage broker, best mortgage broker Toronto ON, Toronto mortgage rates, first-time home buyer Toronto, downtown Toronto mortgage, GTA mortgage, Toronto refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-toronto',
  },
  openGraph: {
    title: 'Toronto Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Toronto mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-toronto',
    type: 'website',
  },
};

export default function TorontoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Toronto" provinceName="ON" description="Licensed mortgage broker serving Toronto, ON. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
