import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Alternative Income Mortgage Calculator | Private & B-Lender | Kraft Mortgages",
  description:
    "Estimate qualifying income, interest-only payments, debt ratios and fees for private and alternative mortgages.",
  alternates: { canonical: "https://www.kraftmortgages.ca/private-lending/calculators/alternative-income" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Alternative Income Mortgage Calculator | Private & B-Lender",
    description:
      "Estimate qualifying income, interest-only payments, debt ratios and fees for private and alternative mortgages.",
    url: "https://www.kraftmortgages.ca/private-lending/calculators/alternative-income",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
