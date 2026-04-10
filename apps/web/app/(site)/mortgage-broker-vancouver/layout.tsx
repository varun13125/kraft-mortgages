import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vancouver Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Vancouver mortgage broker with 23+ years experience. Expert in downtown condos, East Van homes, West Side luxury, and first-time buyer programs. Licensed BCFSA #M08001935.',
  keywords: 'mortgage broker Vancouver, Vancouver mortgage broker, best mortgage broker Vancouver BC, Vancouver mortgage rates, first-time home buyer Vancouver, downtown Vancouver mortgage, West Vancouver mortgage, East Van mortgage, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-vancouver',
  },
  openGraph: {
    title: 'Vancouver Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Vancouver mortgage broker with 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-vancouver',
    type: 'website',
  },
};

export default function VancouverLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Vancouver mortgage broker with 23+ years experience",
    url: "https://www.kraftmortgages.ca/mortgage-broker-vancouver",
    areaServed: {
      "@type": "City",
      name: "Vancouver",
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
