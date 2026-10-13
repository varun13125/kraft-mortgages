import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Property Investment Calculator Canada | Cap Rate, DSCR & Cash Flow | Kraft Mortgages",
  description:
    "Analyze a rental property: monthly cash flow, cap rate, cash-on-cash return and debt service coverage ratio (DSCR) using Canadian mortgage math.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/investment" },
  openGraph: {
    title: "Rental Property Investment Calculator Canada | Cap Rate, DSCR & Cash Flow | Kraft Mortgages",
    description:
      "Analyze a rental property: monthly cash flow, cap rate, cash-on-cash return and debt service coverage ratio (DSCR) using Canadian mortgage math.",
    url: "https://www.kraftmortgages.ca/calculators/investment",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
