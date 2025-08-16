"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { TrendingDown, CreditCard, Calculator, DollarSign, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DebtConsolidationCalculator() {
  const [homeValue, setHomeValue] = useState(750000);
  const [currentMortgage, setCurrentMortgage] = useState(350000);
  const [creditScore, setCreditScore] = useState(700);
  const [totalDebts, setTotalDebts] = useState(85000);
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(3200);
  const [income, setIncome] = useState(120000);

  // Calculate available equity for debt consolidation
  const availableEquity = useMemo(() => {
    const maxLTV = creditScore >= 720 ? 0.80 : creditScore >= 680 ? 0.75 : 0.70;
    const maxLoanAmount = homeValue * maxLTV;
    const availableForConsolidation = Math.max(0, maxLoanAmount - currentMortgage);
    return Math.min(availableForConsolidation, totalDebts); // Can't consolidate more than total debts
  }, [homeValue, currentMortgage, creditScore, totalDebts]);

  // Calculate new mortgage payment if debt is consolidated
  const newMortgageAmount = currentMortgage + availableEquity;
  const newRate = useMemo(() => {
    // Equity lending rate range: 4.99% - 7.95%
    if (creditScore >= 750) return 4.99;
    if (creditScore >= 700) return 5.25;
    if (creditScore >= 650) return 6.25;
    return 7.50;
  }, [creditScore]);

  // Monthly payment calculation (25 year amortization)
  const monthlyRate = newRate / 100 / 12;
  const numPayments = 25 * 12;
  const newMortgagePayment = (newMortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);

  const originalMortgagePayment = (currentMortgage * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                 (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Calculate savings
  const remainingDebtPayments = monthlyDebtPayments * (availableEquity / totalDebts);
  const totalOriginalPayments = originalMortgagePayment + monthlyDebtPayments;
  const monthlySavings = totalOriginalPayments - newMortgagePayment;
  const annualSavings = monthlySavings * 12;

  // DTI calculations
  const monthlyIncome = income / 12;
  const newDTI = (newMortgagePayment / monthlyIncome) * 100;
  const originalDTI = (totalOriginalPayments / monthlyIncome) * 100;

  const isGoodCandidate = availableEquity > 50000 && monthlySavings > 500 && newDTI < 40;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-emerald-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/equity-lending" className="text-gray-400 hover:text-emerald-400 transition-colors">Equity Lending</Link>
              <span className="text-gray-600">›</span>
              <span className="text-emerald-400">Debt Consolidation Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
                <TrendingDown className="w-4 h-4" />
                Debt Consolidation Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Debt Consolidation</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate potential savings by consolidating high-interest debt into your mortgage at institutional rates.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Debt Consolidation Analysis</h2>
              
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Current Home Value
                  </label>
                  <input
                    type="number"
                    value={homeValue}
                    onChange={(e) => setHomeValue(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Current Mortgage Balance
                  </label>
                  <input
                    type="number"
                    value={currentMortgage}
                    onChange={(e) => setCurrentMortgage(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Total Debt to Consolidate
                  </label>
                  <input
                    type="number"
                    value={totalDebts}
                    onChange={(e) => setTotalDebts(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Debt Payments
                  </label>
                  <input
                    type="number"
                    value={monthlyDebtPayments}
                    onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Credit Score
                  </label>
                  <select
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  >
                    <option value={800}>800+ (Excellent)</option>
                    <option value={750}>750-799 (Very Good)</option>
                    <option value={700}>700-749 (Good)</option>
                    <option value={650}>650-699 (Fair)</option>
                    <option value={600}>600-649 (Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Consolidation Results</h3>
                
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Available for Consolidation</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${availableEquity.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Based on home equity</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Savings</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Per month</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Annual Savings</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${annualSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Per year</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">New Mortgage Rate</div>
                    <div className="text-2xl font-bold text-emerald-400">{newRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">Institutional rate</div>
                  </div>
                </div>

                {/* Before/After Comparison */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <h4 className="text-red-400 font-semibold mb-3">Current Situation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mortgage Payment:</span>
                        <span className="text-white">${originalMortgagePayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Debt Payments:</span>
                        <span className="text-white">${monthlyDebtPayments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-red-500/20 pt-2">
                        <span className="text-gray-400">Total Monthly:</span>
                        <span className="text-red-400 font-semibold">${totalOriginalPayments.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DTI Ratio:</span>
                        <span className="text-red-400">{originalDTI.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                    <h4 className="text-emerald-400 font-semibold mb-3">After Consolidation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">New Mortgage Payment:</span>
                        <span className="text-white">${newMortgagePayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Remaining Debt Payments:</span>
                        <span className="text-white">${Math.max(0, monthlyDebtPayments - remainingDebtPayments).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between border-t border-emerald-500/20 pt-2">
                        <span className="text-gray-400">Total Monthly:</span>
                        <span className="text-emerald-400 font-semibold">${(newMortgagePayment + Math.max(0, monthlyDebtPayments - remainingDebtPayments)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DTI Ratio:</span>
                        <span className="text-emerald-400">{newDTI.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isGoodCandidate ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {isGoodCandidate ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${isGoodCandidate ? 'text-green-400' : 'text-orange-400'}`}>
                        {isGoodCandidate ? 'Excellent Consolidation Candidate' : 'Limited Consolidation Benefits'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isGoodCandidate 
                          ? `Save $${annualSavings.toLocaleString()} annually with improved cash flow and lower DTI ratio`
                          : 'Consider other debt reduction strategies or improve credit score for better rates'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits of Equity Lending */}
              <div className="bg-emerald-500/10 rounded-xl p-6 mb-6 border border-emerald-500/20">
                <h4 className="text-lg font-semibold text-emerald-400 mb-3">Why Choose Equity Lending for Debt Consolidation?</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Your Rate</div>
                    <div className="text-xl font-bold text-emerald-400">{newRate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Typical Credit Card Rate</div>
                    <div className="text-xl font-bold text-red-400">19.99%</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-3">
                  Access institutional rates typically reserved for prime lending, with professional service and flexible terms.
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/equity-lending/calculators/home-equity" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Home Equity Calculator
                </Link>
                <Link 
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href={"/equity-lending" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Back to Equity Lending
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}