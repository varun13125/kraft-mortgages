import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Get Pre-Qualified for a Mortgage | Kraft Mortgages",
  description:
    "Answer a few quick questions to see what you could qualify for. Licensed mortgage broker serving BC, Alberta and Ontario.",
  alternates: { canonical: "https://www.kraftmortgages.ca/qualify" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Get Pre-Qualified for a Mortgage",
    description:
      "Answer a few quick questions to see what you could qualify for. Licensed mortgage broker serving BC, Alberta and Ontario.",
    url: "https://www.kraftmortgages.ca/qualify",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
