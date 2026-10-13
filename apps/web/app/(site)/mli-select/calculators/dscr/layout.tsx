import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select DSCR Calculator | Kraft Mortgages",
  description:
    "Size an MLI Select loan at CMHC's 1.10 debt coverage ratio from your net operating income, rate and amortization.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/dscr" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select DSCR Calculator",
    description:
      "Size an MLI Select loan at CMHC's 1.10 debt coverage ratio from your net operating income, rate and amortization.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/dscr",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
