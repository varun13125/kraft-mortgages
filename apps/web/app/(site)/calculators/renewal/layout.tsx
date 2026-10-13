import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Renewal Calculator Canada | Renew or Break Early? | Kraft Mortgages",
  description:
    "Compare your current mortgage rate with today's rates at renewal, estimate your payment savings and see how long it takes to recover a prepayment penalty.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/renewal" },
  openGraph: {
    title: "Mortgage Renewal Calculator Canada | Renew or Break Early? | Kraft Mortgages",
    description:
      "Compare your current mortgage rate with today's rates at renewal, estimate your payment savings and see how long it takes to recover a prepayment penalty.",
    url: "https://www.kraftmortgages.ca/calculators/renewal",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
