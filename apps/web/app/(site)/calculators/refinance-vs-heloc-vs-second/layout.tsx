import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refinance vs HELOC vs Second Mortgage Calculator | Kraft Mortgages",
  description:
    "Compare refinancing, HELOC, and second mortgage side by side. See total costs, monthly payments, and which option saves you most when accessing home equity.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/refinance-vs-heloc-vs-second" },
  openGraph: {
    title: "Refinance vs HELOC vs Second Mortgage Calculator | Kraft Mortgages",
    description:
      "Compare refinancing, HELOC, and second mortgage side by side. See total costs, monthly payments, and which option saves you most when accessing home equity.",
    url: "https://www.kraftmortgages.ca/calculators/refinance-vs-heloc-vs-second",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
