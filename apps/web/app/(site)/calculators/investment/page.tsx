"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { cashflow } from "@/lib/calc/investment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { TrendingUp, Calculator, DollarSign, ArrowRight, Building, Percent, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Investment() {
  const [price, setPrice] = useState(800000);
  const [down, setDown] = useState(200000);
  const [rate, setRate] = useState(5.45);
  const [years, setYears] = useState(25);
  const [rent, setRent] = useState(4200);
  const [vacancy, setVacancy] = useState(3);
  const [expenses, setExpenses] = useState(1200);
  
  const r = cashflow({ 
    price, 
    downPayment: down, 
    ratePct: rate, 
    amortYears: years, 
    rentMonthly: rent, 
    vacancyPct: vacancy, 
    expensesMonthly: expenses 
  });
  
  const isGoodInvestment = r.cf > 0 && r.dscr >= 1.2 && r.capRate >= 4;

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
              <span className="text-gold-400">Investment Calculator</span>
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
                <TrendingUp className="w-4 h-4" />
                Investment Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Investment</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Analyze rental property cash flow, cap rates, and debt service coverage ratios for informed investment decisions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Investment Property Analysis</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    value={down}
                    onChange={(e) => setDown(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Interest Rate (% APR)
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
                    Amortization (Years)
                  </label>
                  <select
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Gross Rent
                  </label>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <input
                    type="number"
                    value={vacancy}
                    onChange={(e) => setVacancy(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Operating Expenses
                  </label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Property taxes, insurance, maintenance, etc."
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Investment Analysis</h3>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                    <div className="text-2xl font-bold text-red-400">
                      ${r.pmt.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Principal & Interest</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Net Operating Income</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${r.noi.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Monthly NOI</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cash Flow</div>
                    <div className={`text-2xl font-bold ${r.cf >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${r.cf.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Monthly net cash</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cap Rate</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {r.capRate.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">Annual return</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">DSCR</div>
                    <div className={`text-2xl font-bold ${r.dscr >= 1.2 ? 'text-green-400' : 'text-orange-400'}`}>
                      {r.dscr.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Debt coverage</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isGoodInvestment ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {isGoodInvestment ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${isGoodInvestment ? 'text-green-400' : 'text-orange-400'}`}>
                        {isGoodInvestment ? 'Strong Investment Potential' : 'Investment Requires Review'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isGoodInvestment 
                          ? `Positive cash flow with ${r.capRate.toFixed(1)}% cap rate and ${r.dscr.toFixed(2)} DSCR`
                          : 'Consider adjusting purchase price, down payment, or rental income'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Note:</strong> This analysis excludes closing costs, vacancy periods, and major repairs. Consult with a financial advisor for comprehensive investment planning.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Investment Metrics Explained</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Cap Rate (Capitalization Rate)</div>
                    <p>Annual NOI divided by property value. Higher cap rates indicate better returns but may come with higher risk.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">DSCR (Debt Service Coverage Ratio)</div>
                    <p>NOI divided by mortgage payments. Lenders typically require DSCR ≥ 1.20 for investment properties.</p>
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
                  href={"/private-lending/calculators/dscr" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Percent className="w-4 h-4" />
                  DSCR Calculator
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