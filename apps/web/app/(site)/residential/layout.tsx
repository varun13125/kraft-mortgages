import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import { ORG_ID } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Residential Mortgages BC | Kraft Mortgages",
  description: "Residential mortgages in BC, AB & ON. First-time buyers, refinancing, renewals & purchase financing. 18+ Years Combined Experience.",
  keywords: "residential mortgage BC, first time home buyer mortgage, mortgage refinance, mortgage renewal, purchase financing, home loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/residential',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Residential Mortgages BC | Kraft Mortgages",
    description: "Expert residential mortgage solutions for first-time buyers, refinancing, and purchase financing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/residential",
  },
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  // Service node; the business itself is the single org node (provider) in app/layout.tsx.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.kraftmortgages.ca/residential#service",
    serviceType: "residential mortgages",
    provider: { "@id": ORG_ID },
    url: "https://www.kraftmortgages.ca/residential",
    description: "Residential mortgage solutions for first-time buyers, refinancing, renewals, and purchase financing across BC, AB & ON.",
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
