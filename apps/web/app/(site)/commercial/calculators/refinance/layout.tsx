import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Commercial Mortgage Refinance Calculator | Kraft Mortgages",
  description:
    "Compare your current commercial mortgage with a refinance: prepayment penalty, costs, payment savings and break-even.",
  alternates: { canonical: "https://www.kraftmortgages.ca/commercial/calculators/refinance" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Commercial Mortgage Refinance Calculator",
    description:
      "Compare your current commercial mortgage with a refinance: prepayment penalty, costs, payment savings and break-even.",
    url: "https://www.kraftmortgages.ca/commercial/calculators/refinance",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
