import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Calgary Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Calgary mortgage broker with customized solutions and lower interest rates. Expert in inner-city condos, developer draw progress financing, and relocation home purchases. Licensed RECA LIC-00655428.',
  keywords: 'mortgage broker Calgary, Calgary mortgage broker, best mortgage broker Calgary AB, Calgary mortgage rates, first-time home buyer Calgary, Mahogany Calgary mortgage, Aspen Woods mortgage, Calgary refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-calgary',
  },
  openGraph: {
    title: 'Calgary Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Calgary mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-calgary',
    type: 'website',
  },
};

export default function CalgaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Calgary" provinceName="AB" description="Licensed mortgage broker serving Calgary, AB. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
