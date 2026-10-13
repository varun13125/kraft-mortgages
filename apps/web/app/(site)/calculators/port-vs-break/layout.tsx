import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "Port vs Break Mortgage Calculator Canada | Kraft Mortgages",
  description:
    "Moving or upsizing? Compare porting your mortgage with a blended rate against breaking it, including the estimated prepayment penalty and 5-year interest cost.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/port-vs-break" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Port vs Break Mortgage Calculator Canada | Kraft Mortgages",
    description:
      "Moving or upsizing? Compare porting your mortgage with a blended rate against breaking it, including the estimated prepayment penalty and 5-year interest cost.",
    url: "https://www.kraftmortgages.ca/calculators/port-vs-break",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
