import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Construction Budget Calculator | Kraft Mortgages",
  description:
    "Build a construction budget with land, hard and soft costs, contingency, loan-to-cost financing and interest.",
  alternates: { canonical: "https://www.kraftmortgages.ca/construction/calculators/budget" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Construction Budget Calculator",
    description:
      "Build a construction budget with land, hard and soft costs, contingency, loan-to-cost financing and interest.",
    url: "https://www.kraftmortgages.ca/construction/calculators/budget",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
