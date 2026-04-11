import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Stress Test Calculator Canada 2025 | OSFI Qualifying Rate | Kraft Mortgages",
  description:
    "Calculate whether you pass Canada's mortgage stress test. See qualifying rate, GDS/TDS ratios, and income requirements.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/stress-test" },
  openGraph: {
    title: "Mortgage Stress Test Calculator Canada 2025 | Kraft Mortgages",
    description:
      "Calculate whether you pass Canada's mortgage stress test. See qualifying rate, GDS/TDS ratios, and income requirements.",
    url: "https://www.kraftmortgages.ca/calculators/stress-test",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
