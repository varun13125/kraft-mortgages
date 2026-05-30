import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ottawa Mortgage Broker | Best Mortgage Rates | Kraft Mortgages',
  description: 'Trusted Ottawa mortgage broker with low interest rates. Expert in public servant stable-income pre-approvals, tech contractor compensation rules, cash-back options, and heritage district financing. Licensed FSRA #12918.',
  keywords: 'mortgage broker Ottawa, Ottawa mortgage broker, best mortgage broker Ottawa ON, Ottawa mortgage rates, first-time home buyer Ottawa, Kanata mortgage, Orleans mortgage, Ottawa refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-ottawa',
  },
  openGraph: {
    title: 'Ottawa Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Ottawa mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-ottawa',
    type: 'website',
  },
};

export default function OttawaLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Ottawa mortgage broker with low interest rates",
    url: "https://www.kraftmortgages.ca/mortgage-broker-ottawa",
    areaServed: {
      "@type": "City",
      name: "Ottawa",
      containedInPlace: {
        "@type": "Province",
        name: "Ontario"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "Public Servant Mortgages", "Tech Contractor Financing", "Cash-Back Options", "First-Time Home Buyer Programs", "Pre-Approvals", "Refinancing"]
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
