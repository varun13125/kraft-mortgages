import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edmonton Mortgage Broker | Lowest Rates | Kraft Mortgages',
  description: 'Trusted Edmonton mortgage broker with low interest rates. Expert in Windermere home builds, rental property cashflow calculation offsets, and first-time buyer assistance. Licensed RECA LIC-00655428.',
  keywords: 'mortgage broker Edmonton, Edmonton mortgage broker, best mortgage broker Edmonton AB, Edmonton mortgage rates, first-time home buyer Edmonton, Windermere Edmonton mortgage, Griesbach mortgage, Edmonton refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-edmonton',
  },
  openGraph: {
    title: 'Edmonton Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Edmonton mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-edmonton',
    type: 'website',
  },
};

export default function EdmontonLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Edmonton mortgage broker with low interest rates",
    url: "https://www.kraftmortgages.ca/mortgage-broker-edmonton",
    areaServed: {
      "@type": "City",
      name: "Edmonton",
      containedInPlace: {
        "@type": "Province",
        name: "Alberta"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "Rental Cashflow Analysis", "First-Time Home Buyer Programs", "Pre-Approvals", "Refinancing"]
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
