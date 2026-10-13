import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Mortgage Qualifier Calculator Canada | Can I Afford This Home? | Kraft Mortgages",
  description:
    "Find out if you qualify to buy a specific home in BC, Alberta or Ontario: stress test, CMHC insurance, GDS/TDS ratios, minimum down payment and cash to close.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/mortgage-qualifier" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mortgage Qualifier Calculator Canada | Kraft Mortgages",
    description:
      "Find out if you qualify to buy a specific home in BC, Alberta or Ontario: stress test, CMHC insurance, GDS/TDS ratios, minimum down payment and cash to close.",
    url: "https://www.kraftmortgages.ca/calculators/mortgage-qualifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
