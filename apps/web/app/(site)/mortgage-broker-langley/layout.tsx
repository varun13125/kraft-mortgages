import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langley Mortgage Broker | Best Rates | Kraft Mortgages',
  description: 'Trusted Langley mortgage broker with 23+ years experience. Expert in acreage financing, farm mortgages, Willowbrook condos, and first-time buyer programs. Licensed BCFSA #M08001935.',
  keywords: 'mortgage broker Langley, Langley mortgage broker, best mortgage broker Langley BC, Langley mortgage rates, acreage mortgage Langley, farm mortgage Langley, Fort Langley mortgage, first-time home buyer Langley, mortgage broker near me',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/mortgage-broker-langley',
  },
  openGraph: {
    title: 'Langley Mortgage Broker | Kraft Mortgages Canada',
    description: 'Trusted Langley mortgage broker with 23+ years experience. Free pre-approval in 24 hours.',
    url: 'https://www.kraftmortgages.ca/mortgage-broker-langley',
    type: 'website',
  },
};

export default function LangleyLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Kraft Mortgages",
    description: "Trusted Langley mortgage broker with 23+ years experience",
    url: "https://www.kraftmortgages.ca/mortgage-broker-langley",
    areaServed: {
      "@type": "City",
      name: "Langley",
      containedInPlace: {
        "@type": "Province",
        name: "British Columbia"
      }
    },
    serviceType: "Mortgage Brokerage",
    knowsAbout: ["Residential Mortgages", "Acreage Financing", "Farm Mortgages", "Pre-Approvals"]
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
