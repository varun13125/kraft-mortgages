import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Points Calculator | Kraft Mortgages",
  description:
    "Estimate your CMHC MLI Select points from affordability, energy efficiency and accessibility commitments, and see the tier you reach.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/points" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Points Calculator",
    description:
      "Estimate your CMHC MLI Select points from affordability, energy efficiency and accessibility commitments, and see the tier you reach.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/points",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
