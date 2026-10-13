import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

// Own metadata so this calculator doesn't inherit its hub's title/canonical from the hub layout.
export const metadata: Metadata = {
  title: "Home Equity Calculator | How Much Can I Borrow? | Kraft Mortgages",
  description:
    "Estimate how much equity you can borrow through a refinance, based on your home value, mortgage and income.",
  alternates: { canonical: "https://www.kraftmortgages.ca/equity-lending/calculators/home-equity" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Home Equity Calculator | How Much Can I Borrow?",
    description:
      "Estimate how much equity you can borrow through a refinance, based on your home value, mortgage and income.",
    url: "https://www.kraftmortgages.ca/equity-lending/calculators/home-equity",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
