"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { normalizedIncome } from "@/lib/calc/selfEmployed";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Briefcase, Calculator, DollarSign, ArrowRight, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

export default function SelfEmployed() {
  const [y1, setY1] = useState(90000);
  const [y2, setY2] = useState(110000);
  const [y3, setY3] = useState(80000);
  const [addbacks, setAddbacks] = useState(15000);
  const r = normalizedIncome({ noa1:y2, noa2:y1, noa3:y3, addbacks });

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Self-Employed Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Briefcase className="w-4 h-4" />
                Self-Employed Income Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Self-Employed</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate your qualifying income for mortgage applications using Notice of Assessment and business addbacks.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Self-Employed Income Calculator</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Latest Year NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y2}
                    onChange={(e) => setY2(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Current year income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Prior Year NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y1}
                    onChange={(e) => setY1(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Previous year income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Two Years Ago NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y3}
                    onChange={(e) => setY3(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Two years ago income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Addbacks
                  </label>
                  <input
                    type="number"
                    value={addbacks}
                    onChange={(e) => setAddbacks(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Depreciation, CCA, etc."
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Income Analysis</h3>
                
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Qualifying Income</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${r.qualifyingIncome.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Annual (estimated)</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">3-Year Average</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${r.threeYearAvg.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">For reference</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-semibold text-blue-400">Income Calculation Method</div>
                      <div className="text-sm text-gray-400">
                        Lenders typically use the lower of the most recent year or 2-year average, plus acceptable addbacks.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Important:</strong> Different lenders use different calculation methods. Always confirm the specific approach with your lender. This is for educational purposes only.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Self-Employed Documentation Tips</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Required Documents</div>
                    <ul className="space-y-1 text-xs">
                      <li>• 2+ years Notice of Assessment</li>
                      <li>• T1 Generals (personal returns)</li>
                      <li>• Financial statements</li>
                      <li>• Business license/registration</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Common Addbacks</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Depreciation/CCA</li>
                      <li>• Personal use of business expenses</li>
                      <li>• One-time write-offs</li>
                      <li>• Non-cash expenses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href={"/private-lending/calculators/alternative-income" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Alternative Income
                </Link>
                <Link 
                  href={"/calculators" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  All Calculators
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}