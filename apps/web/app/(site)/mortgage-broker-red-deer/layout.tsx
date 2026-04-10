import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Red Deer Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Red Deer mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, rural property financing, and refinancing. Licensed BCFSA #M08001935. Serving Red Deer, Blackfalds, Lacombe, Sylvan Lake & central Alberta.',
  keywords: 'mortgage broker Red Deer, Red Deer mortgage broker, best mortgage broker Red Deer Alberta, Red Deer mortgage rates, first-time home buyer Red Deer, self-employed mortgage Red Deer, rural property mortgage Red Deer, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-red-deer',
  },
  openGraph: {
    title: 'Red Deer Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Red Deer mortgage broker with $2B+ funded and 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-red-deer',
    type: 'website',
  },
};

export default function RedDeerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
