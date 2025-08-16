"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { stressTestRate, gdsTds } from "@/lib/calc/affordability";
import { payment } from "@/lib/calc/payment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { DollarSign, Calculator, Home, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Affordability() {
  const [income, setIncome] = useState(120000);
  const [debts, setDebts] = useState(6000); // annual non‑housing
  const [propTax, setPropTax] = useState(3000);
  const [heat, setHeat] = useState(1200);
  const [condoFees, setCondoFees] = useState(0);
  const [rate, setRate] = useState(5.35);
  const [principal, setPrincipal] = useState(650000);
  
  const qualRate = useMemo(() => stressTestRate(rate), [rate]);
  const monthlyPI = payment({ principal, annualRatePct: qualRate, amortYears: 25, paymentsPerYear: 12 });
  const housingAnnual = monthlyPI * 12 + propTax + heat + condoFees * 12;
  const { gds, tds } = gdsTds({ incomeAnnual: income, housingCostsAnnual: housingAnnual, totalDebtAnnual: debts });
  const pass = gds <= 39 && tds <= 44; // typical guideline

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
              <span className="text-gold-400">Affordability Calculator</span>
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
                <DollarSign className="w-4 h-4" />
                Affordability Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Affordability</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate your qualifying mortgage amount with GDS/TDS stress testing and CMHC guidelines.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Mortgage Affordability Analysis</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Household Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Other Debts
                  </label>
                  <input
                    type="number"
                    value={debts}
                    onChange={(e) => setDebts(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Quoted Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Mortgage Principal
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Property Tax
                  </label>
                  <input
                    type="number"
                    value={propTax}
                    onChange={(e) => setPropTax(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Heating Costs
                  </label>
                  <input
                    type="number"
                    value={heat}
                    onChange={(e) => setHeat(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Condo Fees
                  </label>
                  <input
                    type="number"
                    value={condoFees}
                    onChange={(e) => setCondoFees(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Qualification Results</h3>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Stress Test Rate</div>
                    <div className="text-2xl font-bold text-gold-400">{qualRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">CMHC requirement</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly P&I</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${monthlyPI.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">At stress test rate</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">GDS Ratio</div>
                    <div className={`text-2xl font-bold ${gds <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                      {gds.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Max: 39%</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">TDS Ratio</div>
                    <div className={`text-2xl font-bold ${tds <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                      {tds.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Max: 44%</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${pass ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {pass ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${pass ? 'text-green-400' : 'text-red-400'}`}>
                        {pass ? 'Within Typical Guidelines' : 'Above Typical Guidelines'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {pass 
                          ? 'Your mortgage application meets standard qualification ratios'
                          : 'You may need to adjust the mortgage amount or improve debt ratios'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Note:</strong> Guidelines vary by lender and program. This calculation is for educational purposes only and does not constitute pre-approval.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Understanding Debt Service Ratios</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">GDS (Gross Debt Service)</div>
                    <p>Maximum 39% of gross income should go to housing costs (mortgage, taxes, heating, condo fees).</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">TDS (Total Debt Service)</div>
                    <p>Maximum 44% of gross income should go to all debt payments including housing and other debts.</p>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/calculators/payment" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link 
                  href={"/residential/calculators/stress-test" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Stress Test Calculator
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