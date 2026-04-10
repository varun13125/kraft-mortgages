import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Financing BC | Kraft Mortgages",
  description: "Construction financing with progressive draws, builder programs & land development across BC, AB & ON. 23+ years experience.",
  keywords: "construction mortgage BC, construction financing, progressive draw mortgage, builder financing, construction loan, land development loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/construction',
  },
  openGraph: {
    title: "Construction Financing BC | Kraft Mortgages",
    description: "Expert construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/construction",
  },
};

export default function ConstructionLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "FinancialService",
      "@id": "https://www.kraftmortgages.ca/#construction",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/construction",
      telephone: "+1-604-593-1550",
      description: "Construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
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
      serviceType: "construction financing"
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
