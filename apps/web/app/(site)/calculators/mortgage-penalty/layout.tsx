import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Penalty Calculator Canada | Break Costs",
  description:
    "Estimate your mortgage break penalty with IRD and 3 months interest calculations. Free tool for Canadian homeowners considering refinancing.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/mortgage-penalty" },
  openGraph: {
    title: "Mortgage Penalty Calculator Canada | Break Costs",
    description:
      "Estimate your mortgage break penalty with IRD and 3 months interest calculations. Free tool for Canadian homeowners.",
    url: "https://www.kraftmortgages.ca/calculators/mortgage-penalty",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
