import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Victoria Mortgage Broker | Best Rates & Fast Approval | Kraft Mortgages',
  description: 'Top-rated Victoria mortgage broker with $2B+ funded. Expert in first-time buyers, self-employed mortgages, heritage homes, and investment properties. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918. Serving Victoria, Saanich, Oak Bay, Esquimalt & Greater Victoria.',
  keywords: 'mortgage broker Victoria, Victoria mortgage broker, best mortgage broker Victoria BC, Victoria mortgage rates, first-time home buyer Victoria, self-employed mortgage Victoria, heritage home mortgage Victoria, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-victoria',
  },
  openGraph: {
    title: 'Victoria Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Victoria mortgage broker with $2B+ funded and 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-victoria',
    type: 'website',
  },
};

export default function VictoriaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
