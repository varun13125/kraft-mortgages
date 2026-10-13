import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Break-Even Rent Calculator | Kraft Mortgages",
  description:
    "Find the break-even rent per unit for a multi-unit project, including vacancy, operating expenses and debt service.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/break-even" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Break-Even Rent Calculator",
    description:
      "Find the break-even rent per unit for a multi-unit project, including vacancy, operating expenses and debt service.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/break-even",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
