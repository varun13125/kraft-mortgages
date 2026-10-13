import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "CMHC Insurance Calculator Canada | 2026 Premium Rates | Kraft Mortgages",
  description:
    "Calculate your CMHC mortgage insurance premium. Compare current rates by down payment percentage. See total cost and monthly impact.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/cmhc-insurance" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "CMHC Insurance Calculator Canada | 2026 Premium Rates | Kraft Mortgages",
    description:
      "Calculate your CMHC mortgage insurance premium. Compare current rates by down payment percentage. See total cost and monthly impact.",
    url: "https://www.kraftmortgages.ca/calculators/cmhc-insurance",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
