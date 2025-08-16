import Link from "next/link";
import { Calculator, BookOpenCheck, ListChecks, BarChartBig } from "lucide-react";

export default function MLISelectPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
            CMHC • MLI Select
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
            MLI Select — Complete Portal
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Everything developers and investors need: deep program guide, rich UI calculators, and a clean application roadmap.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/mli-select/overview" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
            >
              Learn the Program
            </Link>
            <Link 
              href="/mli-select/calculators" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
            >
              Use Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <Link href="/mli-select/overview" className="group">
              <div className="h-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1">
                <BookOpenCheck className="h-10 w-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Program Overview</h3>
                <p className="text-gray-400">
                  Understand eligibility, scoring, and benefits across tiers (50 / 70 / 100 points).
                </p>
              </div>
            </Link>
            
            <Link href="/mli-select/calculators" className="group">
              <div className="h-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1">
                <Calculator className="h-10 w-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Calculators</h3>
                <p className="text-gray-400">
                  Points & tier, rent cap, max loan, DSCR, amortization, premium, break-even, eligibility.
                </p>
              </div>
            </Link>
            
            <Link href="/mli-select/application-process" className="group">
              <div className="h-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1">
                <ListChecks className="h-10 w-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Application Process</h3>
                <p className="text-gray-400">
                  Step-by-step guide, documentation checklist, and underwriting timeline.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50">
              <BarChartBig className="h-10 w-10 text-gold-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-100 mb-3">Download the MLI Select Guide (PDF)</h3>
              <p className="text-gray-400 mb-6">
                Informational + promotional guide: scoring, benefits, and why Kraft Mortgages is your partner.
              </p>
              <a 
                href="/guide.pdf" 
                download
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all"
              >
                Download Guide
              </a>
            </div>

            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">Talk to an MLI Select Specialist</h3>
              <p className="text-gray-400 mb-6">
                Get a free assessment of your project — we'll size your deal, optimize points, and map your timeline.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}