import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Mortgage Stress Test Calculator Canada 2026 | OSFI Qualifying Rate | Kraft Mortgages",
  description:
    "Canada's mortgage stress test explained: your qualifying rate (contract rate + 2% or 5.25%), the stress-tested payment and the income you need to pass the 39% GDS / 44% TDS limits.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/stress-test" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mortgage Stress Test Calculator Canada 2026 | Kraft Mortgages",
    description:
      "Canada's mortgage stress test explained: your qualifying rate (contract rate + 2% or 5.25%), the stress-tested payment and the income you need to pass the 39% GDS / 44% TDS limits.",
    url: "https://www.kraftmortgages.ca/calculators/stress-test",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
