import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Cost to Complete Calculator | Construction Funding Gap | Kraft Mortgages",
  description:
    "Compare the remaining construction budget with the undisbursed loan to see whether more equity is needed.",
  alternates: { canonical: "https://www.kraftmortgages.ca/construction/calculators/cost-to-complete" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Cost to Complete Calculator | Construction Funding Gap",
    description:
      "Compare the remaining construction budget with the undisbursed loan to see whether more equity is needed.",
    url: "https://www.kraftmortgages.ca/construction/calculators/cost-to-complete",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
