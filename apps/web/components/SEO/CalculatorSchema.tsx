import { JsonLd } from "@/components/SEO/JsonLd";
import { ORG_ID } from "@/lib/seo/jsonld";

/**
 * Renders a SoftwareApplication schema for a calculator page.
 * Server-component safe. Drop into any calculator page:
 *   <CalculatorSchema name="Payment Calculator" description="..." url="/calculators/payment" />
 */
export function CalculatorSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    provider: { "@id": ORG_ID },
  };
  return <JsonLd data={data} />;
}
