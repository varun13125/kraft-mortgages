import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Abbotsford Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Licensed Abbotsford mortgage broker with $2B+ funded and 18+ Years Combined Experience. Expert in residential, commercial, construction, and private lending. Free pre-approval in 24 hours.',
  keywords: 'mortgage broker Abbotsford, Abbotsford mortgage broker, best mortgage broker Abbotsford BC, Abbotsford mortgage rates',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-abbotsford',
  },
};

export default function AbbotsfordLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <CityServiceJsonLd cityName="Abbotsford" provinceName="BC" description="Licensed mortgage broker serving Abbotsford, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
