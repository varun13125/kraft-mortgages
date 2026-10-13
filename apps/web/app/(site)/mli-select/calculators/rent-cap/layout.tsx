import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";

export const metadata: Metadata = {
  title: "MLI Select Affordable Rent Cap Calculator | Kraft Mortgages",
  description:
    "Calculate the MLI Select affordable rent cap: 30% of median renter household income for your market.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/rent-cap" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Affordable Rent Cap Calculator",
    description:
      "Calculate the MLI Select affordable rent cap: 30% of median renter household income for your market.",
    url: "https://www.kraftmortgages.ca/mli-select/calculators/rent-cap",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
