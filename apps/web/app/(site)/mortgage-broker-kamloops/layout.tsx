import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kamloops Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Licensed Kamloops mortgage broker with $5B+ funded and 18+ years experience. Expert in residential, commercial, construction, and private lending. Free pre-approval in 24 hours.',
  keywords: 'mortgage broker Kamloops, Kamloops mortgage broker, best mortgage broker Kamloops BC, Kamloops mortgage rates',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-kamloops',
  },
};

export default function KamloopsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
