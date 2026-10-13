import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Amortization Schedule Calculator Canada | Full Payment Breakdown | Kraft Mortgages",
  description:
    "Generate a complete amortization schedule for any Canadian mortgage. See monthly principal, interest, and remaining balance for every payment.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/amortization" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Amortization Schedule Calculator Canada | Kraft Mortgages",
    description:
      "Generate a complete amortization schedule for any Canadian mortgage. See monthly principal, interest, and remaining balance for every payment.",
    url: "https://www.kraftmortgages.ca/calculators/amortization",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
