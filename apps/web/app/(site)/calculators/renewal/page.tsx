"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { payment } from "@/lib/calc/payment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Clock, Calculator, TrendingUp, ArrowRight, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Renewal() {
  const [balance, setBalance] = useState(450000);
  const [monthsLeft, setMonthsLeft] = useState(36);
  const [currentRate, setCurrentRate] = useState(5.89);
  const [marketRate, setMarketRate] = useState(5.19);
  const [penalty, setPenalty] = useState(2500);

  const currPay = payment({ principal: balance, annualRatePct: currentRate, amortYears: Math.ceil(monthsLeft/12), paymentsPerYear: 12 });
  const newPay = payment({ principal: balance, annualRatePct: marketRate, amortYears: Math.ceil(monthsLeft/12), paymentsPerYear: 12 });
  const monthlySavings = currPay - newPay;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(penalty / monthlySavings) : 0;
  const worthSwitching = monthlySavings > 0 && breakEvenMonths <= monthsLeft && breakEvenMonths <= 12;

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
              <span className="text-gold-400">Renewal Calculator</span>
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
                <Clock className="w-4 h-4" />
                Renewal Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Renewal</span> Optimizer
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Compare your renewal options and calculate if it's worth breaking your current mortgage early.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Renewal Optimizer</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Remaining Balance
                  </label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Months Remaining in Term
                  </label>
                  <input
                    type="number"
                    value={monthsLeft}
                    onChange={(e) => setMonthsLeft(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Current Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    New Market Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={marketRate}
                    onChange={(e) => setMarketRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Estimated Prepayment Penalty ($)
                  </label>
                  <input
                    type="number"
                    value={penalty}
                    onChange={(e) => setPenalty(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Renewal Analysis</h3>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Current Payment</div>
                    <div className="text-2xl font-bold text-red-400">
                      ${currPay.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">At {currentRate.toFixed(2)}%</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">New Payment</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${newPay.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">At {marketRate.toFixed(2)}%</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Savings</div>
                    <div className={`text-2xl font-bold ${monthlySavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Per month</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Break-even Period</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {breakEvenMonths} months
                    </div>
                    <div className="text-xs text-gray-500">To recover penalty</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${worthSwitching ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {worthSwitching ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${worthSwitching ? 'text-green-400' : 'text-orange-400'}`}>
                        {worthSwitching ? 'Worth Breaking Early' : 'Consider Waiting for Renewal'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {worthSwitching 
                          ? `You'll recover the penalty in ${breakEvenMonths} months and save ${monthlySavings.toLocaleString()} monthly`
                          : 'The break-even period is too long or savings are minimal'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Note:</strong> Penalties vary by lender and term structure. Always confirm exact penalty calculations with your current lender before proceeding.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Renewal Strategy Tips</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Timing Matters</div>
                    <p>Start shopping for rates 120 days before renewal. You can negotiate with your current lender or switch without penalty.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Breaking Early</div>
                    <p>If rates drop significantly, breaking early might save money despite penalties. Calculate the break-even point carefully.</p>
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
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
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