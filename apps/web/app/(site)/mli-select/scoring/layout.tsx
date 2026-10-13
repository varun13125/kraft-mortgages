import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Points Scoring | Affordability, Energy & Accessibility | Kraft Mortgages",
  description:
    "How CMHC scores MLI Select: affordability, energy efficiency and accessibility points, and the 50, 70 and 100 point tiers.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/scoring" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Points Scoring | Affordability, Energy & Accessibility",
    description:
      "How CMHC scores MLI Select: affordability, energy efficiency and accessibility points, and the 50, 70 and 100 point tiers.",
    url: "https://www.kraftmortgages.ca/mli-select/scoring",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
