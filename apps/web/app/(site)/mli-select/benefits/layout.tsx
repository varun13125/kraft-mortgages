import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Benefits | Up to 95% Leverage & 50-Year Amortization | Kraft Mortgages",
  description:
    "MLI Select benefits by points tier: up to 95% loan-to-cost, 40/45/50-year amortization, 10/20/30% premium discounts and limited recourse at 100 points.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/benefits" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Benefits | Up to 95% Leverage & 50-Year Amortization",
    description:
      "MLI Select benefits by points tier: up to 95% loan-to-cost, 40/45/50-year amortization, 10/20/30% premium discounts and limited recourse at 100 points.",
    url: "https://www.kraftmortgages.ca/mli-select/benefits",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
