import { contactMetadata } from './metadata';

export const metadata = contactMetadata;

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "LocalBusiness",
      "@id": "https://www.kraftmortgages.ca/#contact",
      name: "Kraft Mortgages Canada",
      url: "https://www.kraftmortgages.ca/contact",
      telephone: "+1-604-593-1550",
      email: "varun@kraftmortgages.ca",
      image: "https://www.kraftmortgages.ca/kraft-logo.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "#301 - 1688 152nd Street",
        addressLocality: "Surrey",
        addressRegion: "BC",
        postalCode: "V4A 4N2",
        addressCountry: "CA"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.1014,
        longitude: -122.7927
      },
      areaServed: [
        { "@type": "CanadianProvince", "name": "British Columbia" },
        { "@type": "CanadianProvince", "name": "Alberta" },
        { "@type": "CanadianProvince", "name": "Ontario" }
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "16:00"
        }
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
