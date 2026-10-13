import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import { ORG_ID } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Equity Lending BC | Home Equity Loans | Kraft Mortgages",
  description: "Home equity loans, HELOC, debt consolidation & cash-out refinancing across BC, AB & ON. Competitive rates. Free calculator.",
  keywords: "equity lending BC, home equity loan, HELOC BC, debt consolidation mortgage, cash out refinance, home equity calculator BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/equity-lending',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Equity Lending BC | Home Equity Loans | Kraft Mortgages",
    description: "Unlock your home equity with HELOC, debt consolidation, and cash-out refinancing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/equity-lending",
  },
};

export default function EquityLendingLayout({ children }: { children: React.ReactNode }) {
  // Service node; the business itself is the single org node (provider) in app/layout.tsx.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.kraftmortgages.ca/equity-lending#service",
    serviceType: "home equity loans",
    provider: { "@id": ORG_ID },
    url: "https://www.kraftmortgages.ca/equity-lending",
    description: "Home equity loans, HELOC, debt consolidation and cash-out refinancing across BC, AB & ON.",
    areaServed: [
      { "@type": "AdministrativeArea", name: "British Columbia" },
      { "@type": "AdministrativeArea", name: "Alberta" },
      { "@type": "AdministrativeArea", name: "Ontario" }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
      <Footer />
    </>
  );
}
