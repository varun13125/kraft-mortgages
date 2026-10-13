import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo/og";
export const metadata: Metadata = {
  title: "MLI Select Eligibility Requirements | Kraft Mortgages",
  description:
    "Who qualifies for CMHC MLI Select: property types, unit counts, points thresholds and borrower requirements.",
  alternates: { canonical: "https://www.kraftmortgages.ca/mli-select/eligibility" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "MLI Select Eligibility Requirements",
    description:
      "Who qualifies for CMHC MLI Select: property types, unit counts, points thresholds and borrower requirements.",
    url: "https://www.kraftmortgages.ca/mli-select/eligibility",
  },
};

export default function EligibilityPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="container-tight section-pad">
          <div className="max-w-3xl">
            <span className="badge badge-tier">CMHC • MLI Select</span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-brand-blue">
              Eligibility
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
                <p>Borrower and property requirements, affordability term, minimum units.</p>
                <ul>
                  <li><strong>Property:</strong> new or existing rental housing with at least 5 units (retirement homes: 50+ units/beds); standard rental, SRO, supportive and retirement housing. Student housing qualifies through energy efficiency and accessibility only.</li>
                  <li><strong>Non-residential space:</strong> no more than 30% of gross floor area or 30% of total lending value.</li>
                  <li><strong>Points:</strong> at least 50 points from any combination of affordability, energy efficiency and accessibility commitments.</li>
                  <li><strong>Affordability term (if chosen):</strong> minimum 10 years from first occupancy; 20+ years earns 30 bonus points. Affordable rents are at or below 30% of the market&apos;s median renter income.</li>
                  <li><strong>Borrower:</strong> 5+ years managing similar multi-unit rentals (or a professional property manager) and net worth of at least 25% of the loan (minimum $100,000).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}