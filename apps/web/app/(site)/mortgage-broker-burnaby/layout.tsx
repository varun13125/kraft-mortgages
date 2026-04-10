import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Burnaby Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Top-rated Burnaby mortgage broker with 23+ years experience. Expert in Metrotown condos, Brentwood pre-sales, and SFU area homes. Licensed BCFSA #M08001935. Free pre-approval.',
  keywords: 'mortgage broker Burnaby, Burnaby mortgage broker, best mortgage broker Burnaby BC, Burnaby mortgage rates, Metrotown mortgage, Brentwood condo mortgage, SFU area mortgage, first-time home buyer Burnaby, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-burnaby',
  },
  openGraph: {
    title: 'Burnaby Mortgage Broker | Kraft Mortgages Canada',
    description: 'Top-rated Burnaby mortgage broker with 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-burnaby',
    type: 'website',
  },
};

export default function BurnabyLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Top-rated Burnaby mortgage broker with 23+ years experience",
    url: "https://www.kraftmortgages.ca/mortgage-broker-burnaby",
    areaServed: {
      "@type": "City",
      name: "Burnaby",
      containedInPlace: {
        "@type": "Province",
        name: "British Columbia"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "First-Time Home Buyer Programs", "Pre-Approvals", "Refinancing"]
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
