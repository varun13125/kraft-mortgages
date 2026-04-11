import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amortization Schedule Calculator Canada | Full Payment Breakdown | Kraft Mortgages",
  description:
    "Generate a complete amortization schedule for any Canadian mortgage. See monthly principal, interest, and remaining balance for every payment.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/amortization" },
  openGraph: {
    title: "Amortization Schedule Calculator Canada | Kraft Mortgages",
    description:
      "Generate a complete amortization schedule for any Canadian mortgage. See monthly principal, interest, and remaining balance for every payment.",
    url: "https://www.kraftmortgages.ca/calculators/amortization",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
