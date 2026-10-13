import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "B-Lender vs Equity Lending Calculator | Compare Rates & Fees | Kraft Mortgages",
  description:
    "Compare B-lender vs private equity lending costs side by side. See live Canadian rate benchmarks, fees, and which option costs less.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/b-vs-equity" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "B-Lender vs Equity Lending Calculator | Compare Rates & Fees | Kraft Mortgages",
    description:
      "Compare B-lender vs private equity lending costs side by side. See live Canadian rate benchmarks, fees, and which option costs less.",
    url: "https://www.kraftmortgages.ca/calculators/b-vs-equity",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
