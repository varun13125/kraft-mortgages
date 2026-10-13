import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Closing Costs Calculator Canada | BC, AB, ON | Kraft Mortgages",
  description:
    "Calculate closing costs for your home purchase in BC, Alberta, or Ontario. Land transfer tax, CMHC, legal fees, and more.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/closing-costs" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Closing Costs Calculator Canada | BC, AB, ON | Kraft Mortgages",
    description:
      "Calculate closing costs for your home purchase in BC, Alberta, or Ontario. Land transfer tax, CMHC, legal fees, and more.",
    url: "https://www.kraftmortgages.ca/calculators/closing-costs",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
