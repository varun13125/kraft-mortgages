import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Loan Interest Calculator | Progressive Draws | Kraft Mortgages",
  description:
    "Estimate interest-only costs on a construction mortgage with a progressive draw schedule, including peak monthly interest and total interest during construction.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/construction-pro" },
  openGraph: {
    title: "Construction Loan Interest Calculator | Progressive Draws | Kraft Mortgages",
    description:
      "Estimate interest-only costs on a construction mortgage with a progressive draw schedule, including peak monthly interest and total interest during construction.",
    url: "https://www.kraftmortgages.ca/calculators/construction-pro",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
