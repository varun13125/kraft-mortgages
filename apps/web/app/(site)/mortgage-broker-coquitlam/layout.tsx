import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coquitlam Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Coquitlam mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, pre-sales, and refinancing. Licensed BCFSA #M08001935. Serving Coquitlam, Port Coquitlam, Port Moody & Tri-Cities.',
  keywords: 'mortgage broker Coquitlam, Coquitlam mortgage broker, best mortgage broker Coquitlam BC, Coquitlam mortgage rates, first-time home buyer Coquitlam, self-employed mortgage Coquitlam, pre-sale financing Coquitlam, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-coquitlam',
  },
  openGraph: {
    title: 'Coquitlam Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Coquitlam mortgage broker with $2B+ funded and 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-coquitlam',
    type: 'website',
  },
};

export default function CoquitlamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
