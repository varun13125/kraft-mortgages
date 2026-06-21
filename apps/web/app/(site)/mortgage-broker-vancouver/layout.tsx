import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Vancouver Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Vancouver mortgage broker with 18+ Years Combined Experience. Expert in downtown condos, East Van homes, West Side luxury, and first-time buyer programs. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918.',
  keywords: 'mortgage broker Vancouver, Vancouver mortgage broker, best mortgage broker Vancouver BC, Vancouver mortgage rates, first-time home buyer Vancouver, downtown Vancouver mortgage, West Vancouver mortgage, East Van mortgage, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-vancouver',
  },
  openGraph: {
    title: 'Vancouver Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Vancouver mortgage broker with 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-vancouver',
    type: 'website',
  },
};

export default function VancouverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Vancouver" provinceName="BC" description="Licensed mortgage broker serving Vancouver, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
