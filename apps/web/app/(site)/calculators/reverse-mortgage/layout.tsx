import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Reverse Mortgage Calculator Canada | Kraft Mortgages",
  description:
    "Estimate how much tax-free cash you could access with a Canadian reverse mortgage (age 55+) and how your home equity may change as interest compounds.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/reverse-mortgage" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Reverse Mortgage Calculator Canada | Kraft Mortgages",
    description:
      "Estimate how much tax-free cash you could access with a Canadian reverse mortgage (age 55+) and how your home equity may change as interest compounds.",
    url: "https://www.kraftmortgages.ca/calculators/reverse-mortgage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
