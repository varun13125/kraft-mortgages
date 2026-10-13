import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";
import CalculatorsHub from "./CalculatorsHub";

// Metadata lives here (not in a calculators/layout.tsx) so it doesn't cascade
// onto the individual calculator routes under /calculators/*.
export const metadata: Metadata = {
  title: "Free Canadian Mortgage Calculators | Kraft Mortgages",
  description:
    "Free mortgage calculators for BC, Alberta and Ontario: payments, affordability, stress test, CMHC insurance, land transfer tax, refinance, renewal and more.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Free Canadian Mortgage Calculators",
    description:
      "Free mortgage calculators for BC, Alberta and Ontario: payments, affordability, stress test, CMHC insurance, land transfer tax, refinance, renewal and more.",
    url: "https://www.kraftmortgages.ca/calculators",
  },
};

export default function CalculatorsPage() {
  return <CalculatorsHub />;
}
