import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Scenario Comparison | Kraft Mortgages",
  description:
    "Compare MLI Select scenarios side by side: points, tier, leverage, maximum loan and premium.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/scenario-compare" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Scenario Comparison",
    description:
      "Compare MLI Select scenarios side by side: points, tier, leverage, maximum loan and premium.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/scenario-compare",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
