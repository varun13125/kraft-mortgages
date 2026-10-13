import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Cap Rate Calculator | Commercial Property Valuation | Kraft Mortgages",
  description:
    "Calculate the capitalization rate, implied value and required NOI for a commercial or multi-unit property.",
  alternates: { canonical: "https://www.kraftmortgages.ca/commercial/calculators/cap-rate" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Cap Rate Calculator | Commercial Property Valuation",
    description:
      "Calculate the capitalization rate, implied value and required NOI for a commercial or multi-unit property.",
    url: "https://www.kraftmortgages.ca/commercial/calculators/cap-rate",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
