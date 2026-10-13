import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refinance Cash-Out Calculator Canada | How Much Equity Can I Access? | Kraft Mortgages",
  description:
    "Estimate how much home equity you can access with a cash-out refinance at up to 80% loan-to-value, and see your new monthly mortgage payment.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/refinance-cashout" },
  openGraph: {
    title: "Refinance Cash-Out Calculator Canada | How Much Equity Can I Access? | Kraft Mortgages",
    description:
      "Estimate how much home equity you can access with a cash-out refinance at up to 80% loan-to-value, and see your new monthly mortgage payment.",
    url: "https://www.kraftmortgages.ca/calculators/refinance-cashout",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
