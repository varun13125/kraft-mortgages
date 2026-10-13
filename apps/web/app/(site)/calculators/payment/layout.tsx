import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator Canada | Monthly & Bi-Weekly | Kraft Mortgages",
  description:
    "Calculate Canadian mortgage payments with semi-annual compounding, plus accelerated bi-weekly payments and the interest you could save.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/payment" },
  openGraph: {
    title: "Mortgage Payment Calculator Canada | Kraft Mortgages",
    description:
      "Calculate Canadian mortgage payments with semi-annual compounding, plus accelerated bi-weekly payments and the interest you could save.",
    url: "https://www.kraftmortgages.ca/calculators/payment",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
