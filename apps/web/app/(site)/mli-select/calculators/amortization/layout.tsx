import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Amortization Calculator | 25 vs 40 vs 50 Years | Kraft Mortgages",
  description:
    "Compare payments and balances for 25, 40 and 50-year amortizations available under MLI Select.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/amortization" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Amortization Calculator | 25 vs 40 vs 50 Years",
    description:
      "Compare payments and balances for 25, 40 and 50-year amortizations available under MLI Select.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/amortization",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
