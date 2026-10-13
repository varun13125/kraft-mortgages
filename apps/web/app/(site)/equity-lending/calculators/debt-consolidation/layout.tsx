import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Debt Consolidation Mortgage Calculator | Kraft Mortgages",
  description:
    "See whether rolling debts into your mortgage saves money: monthly payments, total interest and refinance costs.",
  alternates: { canonical: "https://www.kraftmortgages.ca/equity-lending/calculators/debt-consolidation" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Debt Consolidation Mortgage Calculator",
    description:
      "See whether rolling debts into your mortgage saves money: monthly payments, total interest and refinance costs.",
    url: "https://www.kraftmortgages.ca/equity-lending/calculators/debt-consolidation",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
