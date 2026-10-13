import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import { ORG_ID } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Commercial Mortgages BC | Kraft Mortgages",
  description: "Commercial mortgages for multi-unit, office, retail & industrial properties across BC, AB & ON. Free DSCR calculators.",
  keywords: "commercial mortgage BC, commercial real estate loan, multi-unit financing, apartment building mortgage, commercial refinance, DSCR calculator",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/commercial',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Commercial Mortgages BC | Kraft Mortgages",
    description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/commercial",
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  // Service node; the business itself is the single org node (provider) in app/layout.tsx.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.kraftmortgages.ca/commercial#service",
    serviceType: "commercial mortgages",
    provider: { "@id": ORG_ID },
    url: "https://www.kraftmortgages.ca/commercial",
    description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
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
