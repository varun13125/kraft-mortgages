import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self-Employed Mortgage Income Calculator Canada | Kraft Mortgages",
  description:
    "Estimate your qualifying income as a self-employed borrower using your Notices of Assessment (line 15000), the lender 2-year averaging rule and add-backs.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/self-employed" },
  openGraph: {
    title: "Self-Employed Mortgage Income Calculator Canada | Kraft Mortgages",
    description:
      "Estimate your qualifying income as a self-employed borrower using your Notices of Assessment (line 15000), the lender 2-year averaging rule and add-backs.",
    url: "https://www.kraftmortgages.ca/calculators/self-employed",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
