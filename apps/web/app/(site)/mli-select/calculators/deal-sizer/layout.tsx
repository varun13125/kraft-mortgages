import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";
const title = "MLI Select Deal Sizer | Loan, DCR, Premium & Cash | Kraft Mortgages";
const description = "Size a standard rental MLI Select scenario with program points, leverage, financed insurance premiums, debt coverage and cash required.";
export const metadata: Metadata = { title, description, alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/calculators/deal-sizer" }, openGraph: { ...OG_DEFAULTS, title, description, url: "https://www.kraftmortgages.ca/mli-select/calculators/deal-sizer" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
