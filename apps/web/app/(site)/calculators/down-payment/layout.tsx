import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Down Payment Calculator Canada | How Much Do You Need? | Kraft Mortgages",
  description:
    "Calculate your minimum down payment in Canada. 5% on the first $500K, 10% up to $1.5M, 20% at $1.5M+. Includes CMHC insurance estimates.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/down-payment" },
  openGraph: {
    title: "Down Payment Calculator Canada | How Much Do You Need? | Kraft Mortgages",
    description:
      "Calculate your minimum down payment in Canada. 5% on the first $500K, 10% up to $1.5M, 20% at $1.5M+. Includes CMHC insurance estimates.",
    url: "https://www.kraftmortgages.ca/calculators/down-payment",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
