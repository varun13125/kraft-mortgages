import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Builder Financing Program Comparison | Kraft Mortgages",
  description:
    "Compare illustrative builder financing programs: eligibility, loan-to-cost, rates and interest over the build.",
  alternates: { canonical: "https://www.kraftmortgages.ca/construction/calculators/builder-program" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Builder Financing Program Comparison",
    description:
      "Compare illustrative builder financing programs: eligibility, loan-to-cost, rates and interest over the build.",
    url: "https://www.kraftmortgages.ca/construction/calculators/builder-program",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
