import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Financing BC | Kraft Mortgages",
  description: "Construction financing with progressive draws, builder programs & land development across BC, AB & ON. 23+ years experience.",
  keywords: "construction mortgage BC, construction financing, progressive draw mortgage, builder financing, construction loan, land development loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/construction',
  },
  openGraph: {
    title: "Construction Financing BC | Kraft Mortgages",
    description: "Expert construction mortgage financing with progressive draws, builder programs, and land development across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/construction",
  },
};

export default function ConstructionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
