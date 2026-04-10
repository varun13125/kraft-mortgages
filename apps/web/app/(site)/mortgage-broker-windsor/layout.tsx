import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Windsor Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Windsor mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, investment properties, and cross-border considerations. Licensed BCFSA #M08001935. Serving Windsor, Tecumseh, LaSalle, Amherstburg & Essex County.',
  keywords: 'mortgage broker Windsor, Windsor mortgage broker, best mortgage broker Windsor Ontario, Windsor mortgage rates, first-time home buyer Windsor, self-employed mortgage Windsor, investment property Windsor, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-windsor',
  },
  openGraph: {
    title: 'Windsor Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Windsor mortgage broker with $2B+ funded and 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-windsor',
    type: 'website',
  },
};

export default function WindsorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
