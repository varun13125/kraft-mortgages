import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B-Lender vs Equity Lending Calculator | Compare Rates & Fees | Kraft Mortgages",
  description:
    "Compare B-lender vs private equity lending costs side by side. See real Canadian lender rates, fees, and which option saves you more.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/b-vs-equity" },
  openGraph: {
    title: "B-Lender vs Equity Lending Calculator | Compare Rates & Fees | Kraft Mortgages",
    description:
      "Compare B-lender vs private equity lending costs side by side. See real Canadian lender rates, fees, and which option saves you more.",
    url: "https://www.kraftmortgages.ca/calculators/b-vs-equity",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
