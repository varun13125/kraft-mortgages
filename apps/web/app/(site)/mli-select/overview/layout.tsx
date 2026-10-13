import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Overview | CMHC Multi-Unit Insurance Explained | Kraft Mortgages",
  description:
    "How CMHC MLI Select works for 5+ unit rental projects: points for affordability, energy efficiency and accessibility, and the leverage, amortization and premium benefits they unlock.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/overview" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Overview | CMHC Multi-Unit Insurance Explained",
    description:
      "How CMHC MLI Select works for 5+ unit rental projects: points for affordability, energy efficiency and accessibility, and the leverage, amortization and premium benefits they unlock.",
    url: "https://www.kraftmortgages.ca/mli-select/overview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
