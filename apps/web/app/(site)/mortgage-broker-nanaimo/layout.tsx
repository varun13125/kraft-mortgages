import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nanaimo Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Nanaimo mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, investment properties, and refinancing. Licensed BCFSA #M08001935. Serving Nanaimo, Parksville, Ladysmith & central Vancouver Island.',
  keywords: 'mortgage broker Nanaimo, Nanaimo mortgage broker, best mortgage broker Nanaimo BC, Nanaimo mortgage rates, first-time home buyer Nanaimo, self-employed mortgage Nanaimo, investment property Nanaimo, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-nanaimo',
  },
  openGraph: {
    title: 'Nanaimo Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Nanaimo mortgage broker with $2B+ funded and 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-nanaimo',
    type: 'website',
  },
};

export default function NanaimoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
