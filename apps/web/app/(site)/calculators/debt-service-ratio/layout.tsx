import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "GDS/TDS Calculator Canada | Debt Service Ratio | CMHC Qualification | Kraft Mortgages",
  description:
    "Calculate your Gross Debt Service (GDS) and Total Debt Service (TDS) ratios. Check CMHC qualification and see your maximum affordable mortgage.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/debt-service-ratio" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "GDS/TDS Calculator Canada | Debt Service Ratio | CMHC Qualification | Kraft Mortgages",
    description:
      "Calculate your Gross Debt Service (GDS) and Total Debt Service (TDS) ratios. Check CMHC qualification and see your maximum affordable mortgage.",
    url: "https://www.kraftmortgages.ca/calculators/debt-service-ratio",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
