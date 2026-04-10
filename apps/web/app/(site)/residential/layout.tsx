import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential Mortgages BC | Kraft Mortgages",
  description: "Residential mortgages in BC, AB & ON. First-time buyers, refinancing, renewals & purchase financing. 23+ years experience.",
  keywords: "residential mortgage BC, first time home buyer mortgage, mortgage refinance, mortgage renewal, purchase financing, home loan BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/residential',
  },
  openGraph: {
    title: "Residential Mortgages BC | Kraft Mortgages",
    description: "Expert residential mortgage solutions for first-time buyers, refinancing, and purchase financing across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/residential",
  },
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
