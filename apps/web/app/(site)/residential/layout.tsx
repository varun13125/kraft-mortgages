import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential Mortgages BC | First-Time Buyers, Refinancing & More | Kraft Mortgages",
  description: "Expert residential mortgage solutions in BC, Alberta & Ontario. First-time home buyer programs, refinancing, renewals, and purchase financing. Licensed mortgage broker with 18+ years experience.",
  keywords: "residential mortgage BC, first time home buyer mortgage, mortgage refinance, mortgage renewal, purchase financing, home loan BC",
  openGraph: {
    title: "Residential Mortgages BC | Kraft Mortgages",
    description: "Expert residential mortgage solutions for first-time buyers, refinancing, and purchase financing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/residential",
  },
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
