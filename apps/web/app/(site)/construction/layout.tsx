import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import { ORG_ID } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Construction Financing BC | Kraft Mortgages",
  description: "Construction financing with progressive draws, builder programs & land development across BC, AB & ON. 18+ Years Combined Experience.",
  keywords: "construction mortgage BC, construction financing, progressive draw mortgage, builder financing, construction loan, land development loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/construction',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Construction Financing BC | Kraft Mortgages",
    description: "Expert construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/construction",
  },
};

export default function ConstructionLayout({ children }: { children: React.ReactNode }) {
  // Service node; the business itself is the single org node (provider) in app/layout.tsx.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.kraftmortgages.ca/construction#service",
    serviceType: "construction financing",
    provider: { "@id": ORG_ID },
    url: "https://www.kraftmortgages.ca/construction",
    description: "Construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
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
