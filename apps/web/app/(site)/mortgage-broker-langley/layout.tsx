import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Langley Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Langley mortgage broker with 18+ Years Combined Experience. Expert in acreage financing, farm mortgages, Willowbrook condos, and first-time buyer programs. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918.',
  keywords: 'mortgage broker Langley, Langley mortgage broker, best mortgage broker Langley BC, Langley mortgage rates, acreage mortgage Langley, farm mortgage Langley, Fort Langley mortgage, first-time home buyer Langley, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-langley',
  },
  openGraph: {
    title: 'Langley Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Langley mortgage broker with 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-langley',
    type: 'website',
  },
};

export default function LangleyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CityServiceJsonLd cityName="Langley" provinceName="BC" description="Licensed mortgage broker serving Langley, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
