import Link from "next/link";
import { Calculator } from "lucide-react";

export default function CalculatorsPage() {
  const items = [
    ["Points & Tier", "/mli-select/calculators/points"],
    ["Affordability Rent Cap", "/mli-select/calculators/rent-cap"],
    ["Max Loan / Equity", "/mli-select/calculators/max-loan"],
    ["DSCR Max Loan", "/mli-select/calculators/dscr"],
    ["Amortization", "/mli-select/calculators/amortization"],
    ["Premium", "/mli-select/calculators/premium"],
    ["Break-Even Rent", "/mli-select/calculators/break-even"],
    ["Eligibility Checklist", "/mli-select/calculators/eligibility-checklist"],
    ["Scenario Compare", "/mli-select/calculators/scenario-compare"]
  ] as const;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
            CMHC • MLI Select
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
            MLI Select Calculators
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Plan points, leverage, amortization, premiums, cash flow — all in one place.
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(([label, href]) => (
              <Link key={href} href={href} className="group">
                <div className="h-full p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1">
                  <Calculator className="h-8 w-8 text-gold-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{label}</h3>
                  <p className="text-sm text-gray-500">Open calculator</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}