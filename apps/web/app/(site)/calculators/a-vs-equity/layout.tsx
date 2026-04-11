import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A-Lender vs Equity Lending Calculator Canada | Kraft Mortgages",
  description:
    "Compare A-lender mortgages vs equity lending costs for self-employed borrowers. See the hidden tax impact and find out which option saves more.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/a-vs-equity" },
  openGraph: {
    title: "A-Lender vs Equity Lending Calculator Canada | Kraft Mortgages",
    description:
      "Compare A-lender mortgages vs equity lending costs for self-employed borrowers. See the hidden tax impact and find out which option saves more.",
    url: "https://www.kraftmortgages.ca/calculators/a-vs-equity",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
