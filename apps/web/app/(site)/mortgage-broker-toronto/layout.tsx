import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toronto Mortgage Broker | Premium Rates | Kraft Mortgages',
  description: 'Trusted Toronto mortgage broker with premium institutional rates and customized financing structures. Expert in double land transfer tax rebates, garden suite secondary income calculation, and high-net-worth stress-test bypass options. Licensed FSRA #12918.',
  keywords: 'mortgage broker Toronto, Toronto mortgage broker, best mortgage broker Toronto ON, Toronto mortgage rates, first-time home buyer Toronto, downtown Toronto mortgage, GTA mortgage, Toronto refinancing, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-toronto',
  },
  openGraph: {
    title: 'Toronto Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Toronto mortgage broker with low interest rates. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-toronto',
    type: 'website',
  },
};

export default function TorontoLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Toronto mortgage broker with premium interest rates",
    url: "https://www.kraftmortgages.ca/mortgage-broker-toronto",
    areaServed: {
      "@type": "City",
      name: "Toronto",
      containedInPlace: {
        "@type": "Province",
        name: "Ontario"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "High Net Worth Financing", "Double Land Transfer Tax Rebates", "Laneway Suites", "First-Time Home Buyer Programs", "Pre-Approvals", "Refinancing"]
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
