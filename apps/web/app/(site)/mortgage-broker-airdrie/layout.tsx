import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Airdrie Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Airdrie mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, new construction financing, and refinancing. Licensed BCFSA #M08001935. Serving Airdrie, Crossfield, Balzac & Rocky View County.',
  keywords: 'mortgage broker Airdrie, Airdrie mortgage broker, best mortgage broker Airdrie Alberta, Airdrie mortgage rates, first-time home buyer Airdrie, self-employed mortgage Airdrie, new construction Airdrie, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-airdrie',
  },
  openGraph: {
    title: 'Airdrie Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Airdrie mortgage broker with $2B+ funded and 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-airdrie',
    type: 'website',
  },
};

export default function AirdrieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
