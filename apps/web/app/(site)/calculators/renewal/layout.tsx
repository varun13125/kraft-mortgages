import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Mortgage Renewal Offer Comparison | Kraft Mortgages",
  description:
    "Compare renewal offers with fees, cashback, interest and ending balances. Model a straight switch or early break over the same comparison period.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/renewal" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mortgage Renewal Offer Comparison | Kraft Mortgages",
    description:
      "Compare renewal offers with fees, cashback, interest and ending balances. Model a straight switch or early break over the same comparison period.",
    url: "https://www.kraftmortgages.ca/calculators/renewal",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
