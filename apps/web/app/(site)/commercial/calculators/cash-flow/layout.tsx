import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Commercial Cash Flow & DSCR Calculator | Kraft Mortgages",
  description:
    "Estimate debt service, net operating income, cash flow, DSCR and cash-on-cash return for a commercial property.",
  alternates: { canonical: "https://www.kraftmortgages.ca/commercial/calculators/cash-flow" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Commercial Cash Flow & DSCR Calculator",
    description:
      "Estimate debt service, net operating income, cash flow, DSCR and cash-on-cash return for a commercial property.",
    url: "https://www.kraftmortgages.ca/commercial/calculators/cash-flow",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
