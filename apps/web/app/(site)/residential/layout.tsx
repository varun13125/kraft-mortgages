import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential Mortgages BC | Kraft Mortgages",
  description: "Residential mortgages in BC, AB & ON. First-time buyers, refinancing, renewals & purchase financing. 23+ years experience.",
  keywords: "residential mortgage BC, first time home buyer mortgage, mortgage refinance, mortgage renewal, purchase financing, home loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/residential',
  },
  openGraph: {
    title: "Residential Mortgages BC | Kraft Mortgages",
    description: "Expert residential mortgage solutions for first-time buyers, refinancing, and purchase financing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/residential",
  },
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "FinancialService",
      "@id": "https://www.kraftmortgages.ca/#residential",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/residential",
      telephone: "+1-604-593-1550",
      description: "Residential mortgage solutions for first-time buyers, refinancing, renewals, and purchase financing across BC, AB & ON.",
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
      serviceType: "residential mortgages"
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
