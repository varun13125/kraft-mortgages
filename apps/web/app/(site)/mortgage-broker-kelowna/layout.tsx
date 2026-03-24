import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelowna Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Licensed Kelowna mortgage broker with $5B+ funded and 18+ years experience. Expert in residential, commercial, construction, and private lending. Free pre-approval in 24 hours.',
  keywords: 'mortgage broker Kelowna, Kelowna mortgage broker, best mortgage broker Kelowna BC, Kelowna mortgage rates',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-kelowna',
  },
};

export default function KelownaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
