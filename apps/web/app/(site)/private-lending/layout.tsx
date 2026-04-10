import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Lending BC | Fast Approval | Kraft Mortgages",
  description: "Private mortgages for credit challenges, unique properties & time-sensitive deals. Fast approval across BC, AB & ON.",
  keywords: "private mortgage BC, private lending, alternative mortgage, bad credit mortgage, fast mortgage approval, hard money lender BC",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/private-lending',
  },
  openGraph: {
    title: "Private Lending BC | Kraft Mortgages",
    description: "Fast private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/private-lending",
  },
};

export default function PrivateLendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
