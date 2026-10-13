import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Application Process | Step-by-Step Guide | Kraft Mortgages",
  description:
    "Step-by-step guide to applying for CMHC MLI Select financing, from feasibility and documents to lender submission and commitment.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/application-process" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Application Process | Step-by-Step Guide",
    description:
      "Step-by-step guide to applying for CMHC MLI Select financing, from feasibility and documents to lender submission and commitment.",
    url: "https://www.kraftmortgages.ca/mli-select/application-process",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
