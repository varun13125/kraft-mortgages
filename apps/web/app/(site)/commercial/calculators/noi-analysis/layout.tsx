import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "NOI Analysis Calculator | Net Operating Income | Kraft Mortgages",
  description:
    "Work out gross potential income, vacancy, effective gross income, operating expenses and net operating income.",
  alternates: { canonical: "https://www.kraftmortgages.ca/commercial/calculators/noi-analysis" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "NOI Analysis Calculator | Net Operating Income",
    description:
      "Work out gross potential income, vacancy, effective gross income, operating expenses and net operating income.",
    url: "https://www.kraftmortgages.ca/commercial/calculators/noi-analysis",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
