import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Mortgage Pre-Approval Calculator Canada | Maximum Purchase Price | Kraft Mortgages",
  description:
    "Estimate your maximum purchase price and mortgage amount from your income, debts, down payment and credit using the Canadian stress test.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/pre-approval" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mortgage Pre-Approval Calculator Canada | Kraft Mortgages",
    description:
      "Estimate your maximum purchase price and mortgage amount from your income, debts, down payment and credit using the Canadian stress test.",
    url: "https://www.kraftmortgages.ca/calculators/pre-approval",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
