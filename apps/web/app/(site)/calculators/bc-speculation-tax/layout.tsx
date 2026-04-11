import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BC Speculation and Vacancy Tax Calculator 2025 | SVT Estimates | Kraft Mortgages",
  description:
    "Calculate your BC Speculation and Vacancy Tax. See rates by ownership type, region, and occupancy status for Metro Vancouver and other BC areas.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/bc-speculation-tax" },
  openGraph: {
    title: "BC Speculation and Vacancy Tax Calculator 2025 | Kraft Mortgages",
    description:
      "Calculate your BC Speculation and Vacancy Tax. See rates by ownership type, region, and occupancy status.",
    url: "https://www.kraftmortgages.ca/calculators/bc-speculation-tax",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
