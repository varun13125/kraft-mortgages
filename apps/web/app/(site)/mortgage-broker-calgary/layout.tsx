import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calgary Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Calgary mortgage broker with customized solutions and lower interest rates. Expert in inner-city condos, developer draw progress financing, and relocation home purchases. Licensed RECA LIC-00655428.',
  keywords: 'mortgage broker Calgary, Calgary mortgage broker, best mortgage broker Calgary AB, Calgary mortgage rates, first-time home buyer Calgary, Mahogany Calgary mortgage, Aspen Woods mortgage, Calgary refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-calgary',
  },
  openGraph: {
    title: 'Calgary Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Calgary mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-calgary',
    type: 'website',
  },
};

export default function CalgaryLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Calgary mortgage broker with low interest rates",
    url: "https://www.kraftmortgages.ca/mortgage-broker-calgary",
    areaServed: {
      "@type": "City",
      name: "Calgary",
      containedInPlace: {
        "@type": "Province",
        name: "Alberta"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "Construction Draw Financing", "First-Time Home Buyer Programs", "Pre-Approvals", "Refinancing"]
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
