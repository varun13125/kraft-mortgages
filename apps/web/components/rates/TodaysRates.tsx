'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveRates } from '@/lib/useLiveRates';
import {
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Calculator,
  Lock,
  Layers,
  Sparkles,
  Info,
  Building2,
  Calendar,
  Percent,
} from 'lucide-react';
import Link from 'next/link';

type TabCategory = 'all' | 'fixed' | 'variable' | 'equity';

export const TodaysRates: React.FC = () => {
  const { data, loading, best5YrFixed, best3YrFixed, best5YrVariable, bestHeloc, bestPrivateSecond, primeRate, allRates } = useLiveRates();
  const [activeTab, setActiveTab] = useState<TabCategory>('all');

  const filteredRates = allRates.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fixed') return item.category === 'fixed';
    if (activeTab === 'variable') return item.category === 'variable';
    if (activeTab === 'equity') return item.category === 'heloc' || item.category === 'private';
    return true;
  });

  return (
    <section id="todays-rates" className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-gold-500/10 via-amber-500/5 to-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header & Badges */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-4 h-4" />
            <span>Updated Today • Verified Master Rate Feed</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Today&apos;s Verified{' '}
            <span className="bg-gradient-to-r from-gold-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Mortgage Rates
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Real-time rate benchmarks harvested directly from over 30 Canadian banks, credit unions, and institutional lenders. Compare starting rates, prime spreads, and product tiers across BC, Alberta &amp; Ontario.
          </p>

          {/* Prime Benchmark Indicator */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-slate-400">Bank of Canada Prime Benchmark:</span>
              <span className="font-bold text-white text-sm bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                {primeRate.toFixed(2)}%
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-slate-400">Lowest 5-Yr Fixed:</span>
              <span className="font-bold text-emerald-400 text-sm">
                From {best5YrFixed.toFixed(2)}%
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-slate-400">Lowest 5-Yr Variable:</span>
              <span className="font-bold text-amber-400 text-sm">
                From {best5YrVariable.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Benchmarks' },
            { id: 'fixed', label: 'Fixed Rates' },
            { id: 'variable', label: 'Variable ARMs' },
            { id: 'equity', label: 'HELOC & Private 2nd' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabCategory)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black border-transparent shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rate Cards Grid */}
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <AnimatePresence>
            {filteredRates.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                  item.badge
                    ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border-gold-500/40 hover:border-gold-400 hover:shadow-[0_0_25px_rgba(212,175,55,0.18)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Card Top: Term & Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                        {item.term}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.structure}
                      </p>
                    </div>
                    {item.badge && (
                      <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Rate Display */}
                  <div className="my-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Starting Rate</span>
                      <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
                        {item.startingRate}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Spread / Formula:</span>
                      <span className="font-semibold text-gold-400">
                        {item.spreadFormula}
                      </span>
                    </div>
                  </div>

                  {/* Leading Program & Date */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        Sample Lender:
                      </span>
                      <span className="text-slate-200 font-medium truncate max-w-[170px]" title={item.leadingLender}>
                        {item.leadingLender}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Rate Sheet Date:
                      </span>
                      <span className="text-slate-400">{item.effectiveDate || 'Active'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/calculators/payment?rate=${item.rate}`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-medium py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/60"
                  >
                    <Calculator className="w-3 h-3 text-gold-400" />
                    <span>Calculate</span>
                  </Link>

                  <Link
                    href={`/qualify?product=${encodeURIComponent(item.term)}`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-lg bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-black transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  >
                    <span>Lock Rate</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Detailed Benchmarks Table & Advisory */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold-400" />
                Comprehensive Canadian Market Benchmark Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Rates apply to owner-occupied and qualifying residential properties in BC, AB &amp; ON (OAC). Terms subject to lender guidelines.
              </p>
            </div>
            <Link
              href="/calculators/payment"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              <span>Explore All Calculators</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-3">Term &amp; Product</th>
                  <th className="py-3 px-3">Program Tier</th>
                  <th className="py-3 px-3">Starting Rate</th>
                  <th className="py-3 px-3">Pricing Formula</th>
                  <th className="py-3 px-3">Sample Leading Lender</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {allRates.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {r.term}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-400">
                      {r.structure}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-400 whitespace-nowrap">
                      {r.rate.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-xs text-gold-400/90 whitespace-nowrap">
                      {r.spreadFormula}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-300 truncate max-w-[200px]" title={r.leadingLender}>
                      {r.leadingLender}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Link
                        href={`/calculators/payment?rate=${r.rate}`}
                        className="text-xs font-semibold text-gold-400 hover:text-gold-300 hover:underline mr-3"
                      >
                        Calculate
                      </Link>
                      <Link
                        href={`/qualify?term=${encodeURIComponent(r.term)}`}
                        className="inline-flex items-center text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700"
                      >
                        Apply
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              <span>
                Actual rate depends on credit profile, LTV, property location, and debt ratios. Private 2nd mortgages start from 7.99% with appraisal.
              </span>
            </div>
            <div className="shrink-0 text-slate-400 font-medium">
              Kraft Mortgages Canada Inc. • FSRA &amp; BCFSA Licensed Brokerage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
