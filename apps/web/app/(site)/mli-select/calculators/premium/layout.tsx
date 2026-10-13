import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Premium Calculator | CMHC Insurance Cost | Kraft Mortgages",
  description:
    "Estimate the CMHC MLI Select insurance premium from loan-to-value, loan purpose, amortization surcharge and points-tier discount.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/premium" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Premium Calculator | CMHC Insurance Cost",
    description:
      "Estimate the CMHC MLI Select insurance premium from loan-to-value, loan purpose, amortization surcharge and points-tier discount.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/premium",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
