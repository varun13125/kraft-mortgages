import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refinance Break-Even Calculator Canada | Kraft Mortgages",
  description:
    "Calculate whether refinancing your mortgage makes financial sense. See break-even timeline, interest savings, and net benefit.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/refinance-break-even" },
  openGraph: {
    title: "Refinance Break-Even Calculator Canada | Kraft Mortgages",
    description:
      "Calculate whether refinancing your mortgage makes financial sense. See break-even timeline, interest savings, and net benefit.",
    url: "https://www.kraftmortgages.ca/calculators/refinance-break-even",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
