import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "HELOC Calculator Canada | Home Equity Line of Credit | Kraft Mortgages",
  description:
    "Estimate your HELOC limit under the 65% / 80% rules, the likely rate and whether your income supports it.",
  alternates: { canonical: "https://www.kraftmortgages.ca/equity-lending/calculators/heloc" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "HELOC Calculator Canada | Home Equity Line of Credit",
    description:
      "Estimate your HELOC limit under the 65% / 80% rules, the likely rate and whether your income supports it.",
    url: "https://www.kraftmortgages.ca/equity-lending/calculators/heloc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
