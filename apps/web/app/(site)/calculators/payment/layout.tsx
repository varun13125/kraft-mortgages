import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator Canada | Monthly & Bi-Weekly | Kraft Mortgages",
  description:
    "Calculate Canadian mortgage payments with semi-annual compounding, plus accelerated bi-weekly payments and the interest you could save.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/payment" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mortgage Payment Calculator Canada | Kraft Mortgages",
    description:
      "Calculate Canadian mortgage payments with semi-annual compounding, plus accelerated bi-weekly payments and the interest you could save.",
    url: "https://www.kraftmortgages.ca/calculators/payment",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
