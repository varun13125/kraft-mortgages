import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Mortgages BC | Multi-Unit, Office, Retail & Industrial | Kraft Mortgages",
  description: "Commercial mortgage financing across BC, Alberta & Ontario. Multi-unit residential, office, retail, industrial properties, and commercial refinancing. Free cash flow calculators.",
  keywords: "commercial mortgage BC, commercial real estate loan, multi-unit financing, apartment building mortgage, commercial refinance, DSCR calculator",
  openGraph: {
    title: "Commercial Mortgages BC | Kraft Mortgages",
    description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/commercial",
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
