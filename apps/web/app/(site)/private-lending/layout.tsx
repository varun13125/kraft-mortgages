import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import { ORG_ID } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Private Lending BC | Fast Approval | Kraft Mortgages",
  description: "Private mortgages for credit challenges, unique properties & time-sensitive deals. Fast approval across BC, AB & ON.",
  keywords: "private mortgage BC, private lending, alternative mortgage, bad credit mortgage, fast mortgage approval, hard money lender BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/private-lending',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Private Lending BC | Fast Approval | Kraft Mortgages",
    description: "Fast private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/private-lending",
  },
};

export default function PrivateLendingLayout({ children }: { children: React.ReactNode }) {
  // Service node; the business itself is the single org node (provider) in app/layout.tsx.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.kraftmortgages.ca/private-lending#service",
    serviceType: "private mortgages",
    provider: { "@id": ORG_ID },
    url: "https://www.kraftmortgages.ca/private-lending",
    description: "Private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
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
