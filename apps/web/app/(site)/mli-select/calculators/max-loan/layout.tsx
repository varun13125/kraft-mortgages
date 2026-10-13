import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Maximum Loan Calculator | Kraft Mortgages",
  description:
    "Estimate the maximum MLI Select loan from your points tier and project value or cost, before debt-coverage limits.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/max-loan" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Maximum Loan Calculator",
    description:
      "Estimate the maximum MLI Select loan from your points tier and project value or cost, before debt-coverage limits.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/max-loan",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
