import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator Canada | GDS/TDS & Stress Test | Kraft Mortgages",
  description:
    "See how much mortgage you can afford in Canada. Checks GDS/TDS ratios at the stress-test qualifying rate and estimates your maximum mortgage.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/affordability" },
  openGraph: {
    title: "Mortgage Affordability Calculator Canada | Kraft Mortgages",
    description:
      "See how much mortgage you can afford in Canada. Checks GDS/TDS ratios at the stress-test qualifying rate and estimates your maximum mortgage.",
    url: "https://www.kraftmortgages.ca/calculators/affordability",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
