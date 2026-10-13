import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Transfer Tax Calculator | BC, Alberta & Ontario (incl. Toronto) | Kraft Mortgages",
  description:
    "Calculate BC property transfer tax, Ontario and Toronto land transfer tax, and Alberta land titles fees, including first-time buyer exemptions and rebates.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/land-transfer-tax" },
  openGraph: {
    title: "Land Transfer Tax Calculator BC, AB & ON | Kraft Mortgages",
    description:
      "Calculate BC property transfer tax, Ontario and Toronto land transfer tax, and Alberta land titles fees, including first-time buyer exemptions and rebates.",
    url: "https://www.kraftmortgages.ca/calculators/land-transfer-tax",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
