import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Lending BC | Fast Approval | Kraft Mortgages",
  description: "Private mortgages for credit challenges, unique properties & time-sensitive deals. Fast approval across BC, AB & ON.",
  keywords: "private mortgage BC, private lending, alternative mortgage, bad credit mortgage, fast mortgage approval, hard money lender BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/private-lending',
  },
  openGraph: {
    title: "Private Lending BC | Fast Approval | Kraft Mortgages",
    description: "Fast private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/private-lending",
  },
};

export default function PrivateLendingLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "FinancialService",
      "@id": "https://www.kraftmortgages.ca/#private-lending",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/private-lending",
      telephone: "+1-604-593-1550",
      description: "Private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
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
      serviceType: "private mortgages"
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
