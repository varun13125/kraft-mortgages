import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equity Lending BC | HELOC, Debt Consolidation & Home Equity | Kraft Mortgages",
  description: "Unlock your home equity with competitive rates. HELOC, debt consolidation, cash-out refinancing, and investment financing across BC, Alberta & Ontario. Free equity calculator.",
  keywords: "equity lending BC, home equity loan, HELOC BC, debt consolidation mortgage, cash out refinance, home equity calculator BC",
  openGraph: {
    title: "Equity Lending BC | Kraft Mortgages",
    description: "Unlock your home equity with HELOC, debt consolidation, and cash-out refinancing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/equity-lending",
  },
};

export default function EquityLendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
