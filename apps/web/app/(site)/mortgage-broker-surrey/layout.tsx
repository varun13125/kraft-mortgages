import { Metadata } from 'next';
import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';

export const metadata: Metadata = {
  title: 'Surrey Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Surrey mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, construction financing, and private lending. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Serving Whalley, Fleetwood, Guildford, Newton, Cloverdale & South Surrey.',
  keywords: 'mortgage broker Surrey, Surrey mortgage broker, best mortgage broker Surrey BC, Surrey mortgage rates, first-time home buyer Surrey, self-employed mortgage Surrey, construction financing Surrey, private lending Surrey, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-surrey',
  },
  openGraph: {
    title: 'Surrey Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Surrey mortgage broker with $2B+ funded and 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-surrey',
    type: 'website',
  },
};

export default function SurreyLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <CityServiceJsonLd cityName="Surrey" provinceName="BC" description="Licensed mortgage broker serving Surrey, BC. Residential, construction, self-employed, MLI Select, and private lending solutions." />
      {children}
    </>
  );
}
