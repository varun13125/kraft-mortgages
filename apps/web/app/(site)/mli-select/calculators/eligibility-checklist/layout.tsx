import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Eligibility Checklist | Kraft Mortgages",
  description:
    "Check your project against CMHC MLI Select requirements: unit count, points, borrower experience, net worth and documents.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/eligibility-checklist" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Eligibility Checklist",
    description:
      "Check your project against CMHC MLI Select requirements: unit count, points, borrower experience, net worth and documents.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/eligibility-checklist",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
