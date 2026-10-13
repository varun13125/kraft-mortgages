import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select FAQ | CMHC MLI Select Questions Answered | Kraft Mortgages",
  description:
    "Answers to common CMHC MLI Select questions: eligibility, points, rent caps, amortization, premiums and the application process.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/faq" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select FAQ | CMHC MLI Select Questions Answered",
    description:
      "Answers to common CMHC MLI Select questions: eligibility, points, rent caps, amortization, premiums and the application process.",
    url: "https://www.kraftmortgages.ca/mli-select/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
