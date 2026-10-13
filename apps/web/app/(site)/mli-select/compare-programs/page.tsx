import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";
export const metadata: Metadata = {
  title: "MLI Select vs Standard CMHC Rental Insurance | Kraft Mortgages",
  description:
    "How MLI Select compares with standard CMHC multi-unit rental insurance on leverage, amortization and premiums.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/compare-programs" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select vs Standard CMHC Rental Insurance",
    description:
      "How MLI Select compares with standard CMHC multi-unit rental insurance on leverage, amortization and premiums.",
    url: "https://www.kraftmortgages.ca/mli-select/compare-programs",
  },
};

export default function CompareProgramsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="container-tight section-pad">
          <div className="max-w-3xl">
            <span className="badge badge-tier">CMHC • MLI Select</span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-brand-blue">
              Compare CMHC Programs
            </h1>
            <p className="mt-3 text-slate-700">
              Kraft Mortgages • MLI Select
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-tight grid gap-6">
          <div className="card">
            <div className="card-body">
              <div className="prose">
                <p>MLI Select vs CMHC Standard Rental Housing insurance (MLI Flex was replaced by MLI Select on March 7, 2022).</p>
                <ul>
                  <li><strong>MLI Select (50+ points):</strong> up to 95% loan-to-cost for new construction; existing properties up to 85% LTV at 50 points and 95% at 70+; amortization up to 40 / 45 / 50 years at 50 / 70 / 100 points; premium discounts of 10% / 20% / 30%; minimum DCR 1.10 for standard rental; limited recourse available at 100 points.</li>
                  <li><strong>Standard Rental Housing:</strong> up to 85% loan-to-value, longer amortizations than conventional financing, standard CMHC premiums with no MLI Select discount.</li>
                  <li><strong>Conventional (uninsured):</strong> typically 65–75% loan-to-value, 25–30 year amortization and higher debt-coverage requirements (often 1.20x+).</li>
                </ul>
                <p className="text-sm">Source: CMHC MLI Select and Standard Rental Housing product pages. CMHC updates terms periodically — confirm current criteria with your lender.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}