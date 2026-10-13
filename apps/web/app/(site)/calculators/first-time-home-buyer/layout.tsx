import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "First-Time Home Buyer Calculator Canada | FHSA, HBP & Rebates | Kraft Mortgages",
  description:
    "Estimate first-time buyer savings in BC, Alberta and Ontario: FHSA tax savings, RRSP Home Buyers' Plan, land transfer tax relief and the GST rebate on new homes.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/first-time-home-buyer" },
  openGraph: {
    title: "First-Time Home Buyer Calculator Canada | Kraft Mortgages",
    description:
      "Estimate first-time buyer savings in BC, Alberta and Ontario: FHSA tax savings, RRSP Home Buyers' Plan, land transfer tax relief and the GST rebate on new homes.",
    url: "https://www.kraftmortgages.ca/calculators/first-time-home-buyer",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
