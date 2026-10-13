import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Extra Payment Savings Calculator Canada | Interest Savings | Kraft Mortgages",
  description:
    "See how extra mortgage payments save you thousands in interest and years off your amortization. Compare monthly vs lump sum strategies.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/extra-payments" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Extra Payment Savings Calculator Canada | Kraft Mortgages",
    description:
      "See how extra mortgage payments save you thousands in interest and years off your amortization. Compare monthly vs lump sum strategies.",
    url: "https://www.kraftmortgages.ca/calculators/extra-payments",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
