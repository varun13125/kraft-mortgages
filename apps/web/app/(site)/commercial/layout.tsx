import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Mortgages BC | Kraft Mortgages",
  description: "Commercial mortgages for multi-unit, office, retail & industrial properties across BC, AB & ON. Free DSCR calculators.",
  keywords: "commercial mortgage BC, commercial real estate loan, multi-unit financing, apartment building mortgage, commercial refinance, DSCR calculator",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/commercial',
  },
  openGraph: {
    title: "Commercial Mortgages BC | Kraft Mortgages",
    description: "Commercial mortgage financing for multi-unit, office, retail, and industrial properties across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/commercial",
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
