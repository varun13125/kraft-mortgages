import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equity Lending BC | Home Equity Loans | Kraft Mortgages",
  description: "Home equity loans, HELOC, debt consolidation & cash-out refinancing across BC, AB & ON. Competitive rates. Free calculator.",
  keywords: "equity lending BC, home equity loan, HELOC BC, debt consolidation mortgage, cash out refinance, home equity calculator BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/equity-lending',
  },
  openGraph: {
    title: "Equity Lending BC | Kraft Mortgages",
    description: "Unlock your home equity with HELOC, debt consolidation, and cash-out refinancing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/equity-lending",
  },
};

export default function EquityLendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
