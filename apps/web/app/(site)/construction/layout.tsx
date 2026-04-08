import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Financing BC | Progressive Draws & Builder Programs | Kraft Mortgages",
  description: "Expert construction mortgage financing in BC, Alberta & Ontario. Progressive draws, construction-to-permanent loans, builder programs, and land development financing. 18+ years experience.",
  keywords: "construction mortgage BC, construction financing, progressive draw mortgage, builder financing, construction loan, land development loan BC",
  openGraph: {
    title: "Construction Financing BC | Kraft Mortgages",
    description: "Expert construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/construction",
  },
};

export default function ConstructionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
