import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equity Lending BC | Home Equity Loans | Kraft Mortgages",
  description: "Home equity loans, HELOC, debt consolidation & cash-out refinancing across BC, AB & ON. Competitive rates. Free calculator.",
  keywords: "equity lending BC, home equity loan, HELOC BC, debt consolidation mortgage, cash out refinance, home equity calculator BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/equity-lending',
  },
  openGraph: {
    title: "Equity Lending BC | Home Equity Loans | Kraft Mortgages",
    description: "Unlock your home equity with HELOC, debt consolidation, and cash-out refinancing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/equity-lending",
  },
};

export default function EquityLendingLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "FinancialService",
      "@id": "https://www.kraftmortgages.ca/#equity-lending",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/equity-lending",
      telephone: "+1-604-593-1550",
      description: "Home equity loans, HELOC, debt consolidation and cash-out refinancing across BC, AB & ON.",
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
      serviceType: "home equity loans"
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
