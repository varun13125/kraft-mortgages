import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Refinance Break-Even Calculator Canada | Kraft Mortgages",
  description:
    "Calculate whether refinancing your mortgage makes financial sense. See break-even timeline, interest savings, and net benefit.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/refinance-break-even" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Refinance Break-Even Calculator Canada | Kraft Mortgages",
    description:
      "Calculate whether refinancing your mortgage makes financial sense. See break-even timeline, interest savings, and net benefit.",
    url: "https://www.kraftmortgages.ca/calculators/refinance-break-even",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
