import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Progressive Draw Mortgage Calculator | Kraft Mortgages",
  description:
    "Estimate interest-only costs on a progressive draw construction mortgage, draw by draw.",
  alternates: { canonical: "https://www.kraftmortgages.ca/construction/calculators/progressive-draw" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Progressive Draw Mortgage Calculator",
    description:
      "Estimate interest-only costs on a progressive draw construction mortgage, draw by draw.",
    url: "https://www.kraftmortgages.ca/construction/calculators/progressive-draw",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
