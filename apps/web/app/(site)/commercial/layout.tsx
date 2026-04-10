import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Mortgages BC | Kraft Mortgages",
  description: "Commercial mortgages for multi-unit, office, retail & industrial properties across BC, AB & ON. Free DSCR calculators.",
  keywords: "commercial mortgage BC, commercial real estate loan, multi-unit financing, apartment building mortgage, commercial refinance, DSCR calculator",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/commercial',
  },
  openGraph: {
    title: "Commercial Mortgages BC | Kraft Mortgages",
    description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/commercial",
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "FinancialService",
      "@id": "https://www.kraftmortgages.ca/#commercial",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/commercial",
      telephone: "+1-604-593-1550",
      description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "#301 - 1688 152nd Street",
        addressLocality: "Surrey",
        addressRegion: "BC",
        postalCode: "V4A 4N2",
        addressCountry: "CA"
      },
      areaServed: [
        { "@type": "CanadianProvince", "name": "British Columbia" },
        { "@type": "CanadianProvince", "name": "Alberta" },
        { "@type": "CanadianProvince", "name": "Ontario" }
      ],
      serviceType: "commercial mortgages"
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
