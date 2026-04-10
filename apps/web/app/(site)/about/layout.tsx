import { aboutMetadata } from './metadata';

export const metadata = aboutMetadata;

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "Organization",
      "@id": "https://www.kraftmortgages.ca/#organization",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca",
      logo: "https://www.kraftmortgages.ca/kraft-logo.png",
      description: "Licensed mortgage brokerage offering residential, commercial, construction, private lending, and equity lending solutions across BC, Alberta and Ontario.",
      telephone: "+1-604-593-1550",
      email: "varun@kraftmortgages.ca",
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
      sameAs: [
        "https://www.linkedin.com/company/kraft-mortgages-canada-inc"
      ]
    }]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
