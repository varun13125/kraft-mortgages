import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lethbridge Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Lethbridge mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, rural and acreage financing, and refinancing. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Serving Lethbridge, Coaldale, Taber, Medicine Hat & southern Alberta.',
  keywords: 'mortgage broker Lethbridge, Lethbridge mortgage broker, best mortgage broker Lethbridge Alberta, Lethbridge mortgage rates, first-time home buyer Lethbridge, self-employed mortgage Lethbridge, acreage mortgage Lethbridge, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-lethbridge',
  },
  openGraph: {
    title: 'Lethbridge Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Lethbridge mortgage broker with $2B+ funded and 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-lethbridge',
    type: 'website',
  },
};

export default function LethbridgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
