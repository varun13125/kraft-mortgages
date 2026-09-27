import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { TodaysRates, RatesTicker } from '@/components/rates';
import { ComplianceBanner } from '@/components/ComplianceBanner';
import { Calculator, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Today's Verified Canadian Mortgage Rates | Kraft Mortgages",
  description:
    'Live mortgage rate benchmarks across 30+ Canadian lenders. Lowest 5-year fixed, 3-year fixed, variable ARMs, HELOCs, and private 2nd mortgages for BC, Alberta, and Ontario.',
  alternates: { canonical: 'https://www.kraftmortgages.ca/rates' },
  openGraph: {
    title: "Today's Verified Mortgage Rates | Kraft Mortgages Canada",
    description:
      'Compare lowest insured, insurable, and conventional mortgage rates updated daily from Canadian lenders.',
    url: 'https://www.kraftmortgages.ca/rates',
  },
};

export default function RatesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 bg-slate-950 text-white">
        {/* Ticker Strip */}
        <RatesTicker />

        {/* Breadcrumb */}
        <div className="py-4 px-4 bg-slate-900/40 border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gold-400">Verified Rates Intelligence</span>
          </div>
        </div>

        {/* Main Rates Component */}
        <TodaysRates />

        {/* Quick Calculator Linking Bar */}
        <section className="py-16 px-4 bg-slate-900/40 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Test These Live Rates In Our Calculators
              </h3>
              <p className="text-sm text-slate-400">
                Default interest rates are automatically synchronized to today&apos;s lowest market benchmark.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Payment Calculator', href: '/calculators/payment', desc: 'Calculate monthly and accelerated bi-weekly payments' },
                { title: 'Affordability Analysis', href: '/calculators/affordability', desc: 'Estimate buying power with GDS/TDS stress test' },
                { title: 'Amortization Schedule', href: '/calculators/amortization', desc: 'Inspect principal reduction & interest curves' },
                { title: 'Renewal Optimizer', href: '/calculators/renewal', desc: 'Evaluate breaking your current term vs penalty' },
              ].map((calc, i) => (
                <Link
                  key={i}
                  href={calc.href}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-gold-500/40 hover:bg-slate-800/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-3">
                      <Calculator className="w-4 h-4 text-gold-400" />
                    </div>
                    <h4 className="font-bold text-white text-base mb-1 group-hover:text-gold-300 transition-colors">
                      {calc.title}
                    </h4>
                    <p className="text-xs text-slate-400">{calc.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gold-400">
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ComplianceBanner feature="LEAD_FORM" />
      </main>
    </>
  );
}
