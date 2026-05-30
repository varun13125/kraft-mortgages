import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Richmond Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Richmond mortgage broker with 18+ Years Combined Experience. Expert in newcomer mortgages, investor financing, Steveston properties, and condo purchases. Licensed BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918.',
  keywords: 'mortgage broker Richmond, Richmond mortgage broker, best mortgage broker Richmond BC, Richmond mortgage rates, newcomer mortgage Richmond, Steveston mortgage, Richmond investor mortgage, first-time home buyer Richmond, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-richmond',
  },
  openGraph: {
    title: 'Richmond Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Richmond mortgage broker with 18+ Years Combined Experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-richmond',
    type: 'website',
  },
};

export default function RichmondLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Richmond mortgage broker with 18+ Years Combined Experience",
    url: "https://www.kraftmortgages.ca/mortgage-broker-richmond",
    areaServed: {
      "@type": "City",
      name: "Richmond",
      containedInPlace: {
        "@type": "Province",
        name: "British Columbia"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "Newcomer Programs", "Investment Financing", "Pre-Approvals"]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
