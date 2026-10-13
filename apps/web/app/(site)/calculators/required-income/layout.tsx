import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Required Income Calculator Canada | Mortgage Qualification | Kraft Mortgages",
  description:
    "Calculate the minimum income needed to qualify for a mortgage in Canada. GDS/TDS ratios, stress test rates, and qualifying income estimates.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/required-income" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Required Income Calculator Canada | Mortgage Qualification | Kraft Mortgages",
    description:
      "Calculate the minimum income needed to qualify for a mortgage in Canada. GDS/TDS ratios, stress test rates, and qualifying income estimates.",
    url: "https://www.kraftmortgages.ca/calculators/required-income",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
