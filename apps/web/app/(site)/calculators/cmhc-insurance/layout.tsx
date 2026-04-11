import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMHC Insurance Calculator Canada | 2025 Premium Rates | Kraft Mortgages",
  description:
    "Calculate your CMHC mortgage insurance premium. Compare 2025 rates by down payment percentage. See total cost and monthly impact.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/cmhc-insurance" },
  openGraph: {
    title: "CMHC Insurance Calculator Canada | 2025 Premium Rates | Kraft Mortgages",
    description:
      "Calculate your CMHC mortgage insurance premium. Compare 2025 rates by down payment percentage. See total cost and monthly impact.",
    url: "https://www.kraftmortgages.ca/calculators/cmhc-insurance",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
