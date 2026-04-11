import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Rate Comparison Calculator Canada | Compare Rates Side by Side | Kraft Mortgages",
  description:
    "Compare up to 4 mortgage rates side by side. See monthly payments, total interest over term and amortization, and payment differences.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/rate-comparison" },
  openGraph: {
    title: "Mortgage Rate Comparison Calculator Canada | Compare Rates Side by Side | Kraft Mortgages",
    description:
      "Compare up to 4 mortgage rates side by side. See monthly payments, total interest over term and amortization, and payment differences.",
    url: "https://www.kraftmortgages.ca/calculators/rate-comparison",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
