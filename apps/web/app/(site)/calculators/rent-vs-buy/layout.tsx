import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator Canada | Should You Rent or Buy? | Kraft Mortgages",
  description:
    "Compare the true cost of renting vs buying a home in Canada. See monthly costs, net worth over time, and your break-even year.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/rent-vs-buy" },
  openGraph: {
    title: "Rent vs Buy Calculator Canada | Should You Rent or Buy? | Kraft Mortgages",
    description:
      "Compare the true cost of renting vs buying a home in Canada. See monthly costs, net worth over time, and your break-even year.",
    url: "https://www.kraftmortgages.ca/calculators/rent-vs-buy",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
