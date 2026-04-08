import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Lending BC | Fast Mortgage Approval for Complex Situations | Kraft Mortgages",
  description: "Private mortgage solutions when traditional lending doesn't fit. Fast approvals for credit challenges, unique properties, time-sensitive deals, and alternative income across BC, Alberta & Ontario.",
  keywords: "private mortgage BC, private lending, alternative mortgage, bad credit mortgage, fast mortgage approval, hard money lender BC",
  openGraph: {
    title: "Private Lending BC | Kraft Mortgages",
    description: "Fast private mortgage solutions for credit challenges, unique properties, and time-sensitive deals across BC, AB & ON.",
    url: "https://www.kraftmortgages.ca/private-lending",
  },
};

export default function PrivateLendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
