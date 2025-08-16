"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { payment, biweeklySavings } from "@/lib/calc/payment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, DollarSign, TrendingUp, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function PaymentCalculatorPage() {
  const [principal, setPrincipal] = useState(700000);
  const [rate, setRate] = useState(5.34);
  const [years, setYears] = useState(25);

  const monthly = payment({ principal, annualRatePct: rate, amortYears: years, paymentsPerYear: 12 });
  const { acceleratedBiweekly, annualSavings } = biweeklySavings({ principal, annualRatePct: rate, amortYears: years });

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
              <span className="text-gold-400">Payment Calculator</span>
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
                <Calculator className="w-4 h-4" />
                Payment Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Payment</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate monthly payments and discover potential savings with accelerated payment options.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Smart Mortgage Payment Calculator</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-8">
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
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Payment Options</h3>
                
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${monthly.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">12 payments/year</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Bi-weekly Payment</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${acceleratedBiweekly.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">26 payments/year</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Annual Savings</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${annualSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">With bi-weekly payments</div>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-semibold text-green-400">Accelerated Payment Benefits</div>
                      <div className="text-sm text-gray-400">
                        By switching to bi-weekly payments, you could save ${annualSavings.toLocaleString()} annually and pay off your mortgage faster.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Payment Frequency Benefits</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Bi-weekly Payments</div>
                    <p>Making 26 bi-weekly payments equals 13 monthly payments per year, reducing your amortization period and total interest paid.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Interest Savings</div>
                    <p>Extra payments go directly toward principal, reducing the amount of interest calculated on your remaining balance.</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-6">
                <strong>Note:</strong> This calculator includes payment frequency comparison analysis. Provincial taxes and fees may apply. Results are for educational purposes only.
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
                  href={"/calculators/renewal" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Renewal Calculator
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