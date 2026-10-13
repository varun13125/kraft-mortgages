import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Pre-Approval Calculator Canada | Maximum Purchase Price | Kraft Mortgages",
  description:
    "Estimate your maximum purchase price and mortgage amount from your income, debts, down payment and credit using the Canadian stress test.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/pre-approval" },
  openGraph: {
    title: "Mortgage Pre-Approval Calculator Canada | Kraft Mortgages",
    description:
      "Estimate your maximum purchase price and mortgage amount from your income, debts, down payment and credit using the Canadian stress test.",
    url: "https://www.kraftmortgages.ca/calculators/pre-approval",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
