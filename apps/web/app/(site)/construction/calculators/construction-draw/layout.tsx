import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Construction Draw Schedule Calculator | Kraft Mortgages",
  description:
    "Model a construction-to-permanent loan: land advance, draws by stage of completion, interest and fees.",
  alternates: { canonical: "https://www.kraftmortgages.ca/construction/calculators/construction-draw" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Construction Draw Schedule Calculator",
    description:
      "Model a construction-to-permanent loan: land advance, draws by stage of completion, interest and fees.",
    url: "https://www.kraftmortgages.ca/construction/calculators/construction-draw",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
