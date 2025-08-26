"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { CreditCard, Calculator, DollarSign, ArrowRight, TrendingUp, Percent, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

// HELOC calculation logic
function calculateHELOC({
  homeValue,
  mortgageBalance,
  creditScore,
  income
}: {
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  income: number;
}) {
  // HELOC limit is typically 65% of home value minus existing mortgage
  const maxLTV = 0.65;
  const maxCombinedLoan = homeValue * maxLTV;
  const availableEquity = Math.max(0, maxCombinedLoan - mortgageBalance);
  
  // Minimum HELOC amounts and credit-based rates
  const minHELOC = 10000;
  const maxHELOC = Math.min(availableEquity, 500000); // Cap at $500k
  
  // Rate based on credit score
  let rate: number;
  if (creditScore >= 780) rate = 6.95;
  else if (creditScore >= 720) rate = 7.45;
  else if (creditScore >= 680) rate = 7.95;
  else if (creditScore >= 640) rate = 8.95;
  else rate = 10.45;
  
  // Interest-only payment calculation
  const monthlyRate = rate / 100 / 12;
  const interestOnlyPayment = maxHELOC * monthlyRate;
  
  // Qualification check - payment should be under 5% of gross income
  const maxPaymentRatio = 0.05;
  const maxQualifyingPayment = income * maxPaymentRatio;
  const qualifies = interestOnlyPayment <= maxQualifyingPayment;
  
  return {
    availableEquity,
    maxHELOC: Math.max(0, Math.min(maxHELOC, qualifies ? maxHELOC : 0)),
    rate,
    interestOnlyPayment,
    qualifies,
    currentLTV: (mortgageBalance / homeValue) * 100,
    newLTV: ((mortgageBalance + maxHELOC) / homeValue) * 100
  };
}

export default function HELOCCalculator() {
  const [homeValue, setHomeValue] = useState(800000);
  const [mortgageBalance, setMortgageBalance] = useState(400000);
  const [creditScore, setCreditScore] = useState(750);
  const [income, setIncome] = useState(120000);

  const results = calculateHELOC({
    homeValue,
    mortgageBalance,
    creditScore,
    income: income / 12 // Convert to monthly
  });

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
              <Link href="/equity-lending" className="text-gray-400 hover:text-gold-400 transition-colors">Equity Lending</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">HELOC Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gold-500/20 rounded-full mb-6">
                <CreditCard className="w-5 h-5 text-gold-400" />
                <span className="text-gold-400 font-semibold">HELOC Calculator</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent">
                Home Equity Line of Credit
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Calculate how much you can access through a Home Equity Line of Credit (HELOC) based on your home value, existing mortgage, and credit profile.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Property & Financial Details
                  </h2>

                  <div className="space-y-6">
                    {/* Home Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold-400" />
                        Current Home Value
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={homeValue}
                          onChange={(e) => setHomeValue(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="100000"
                          max="5000000"
                          step="10000"
                        />
                      </div>
                    </div>

                    {/* Mortgage Balance */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        Current Mortgage Balance
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={mortgageBalance}
                          onChange={(e) => setMortgageBalance(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max={homeValue}
                          step="5000"
                        />
                      </div>
                    </div>

                    {/* Credit Score */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gold-400" />
                        Credit Score
                      </label>
                      <input
                        type="range"
                        min="500"
                        max="850"
                        value={creditScore}
                        onChange={(e) => setCreditScore(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>500</span>
                        <span className="font-semibold text-gold-400">{creditScore}</span>
                        <span>850</span>
                      </div>
                    </div>

                    {/* Annual Income */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gold-400" />
                        Annual Income
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={income}
                          onChange={(e) => setIncome(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="50000"
                          max="1000000"
                          step="5000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* HELOC Amount */}
                <div className="bg-gradient-to-br from-gold-500/20 to-gold-600/10 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-gold-400" />
                    <h3 className="text-xl font-bold">HELOC Available</h3>
                  </div>
                  <div className="text-4xl font-bold text-gold-400 mb-2">
                    ${results.maxHELOC.toLocaleString()}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Maximum line of credit amount
                  </p>
                </div>

                {/* Rate & Payment */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="w-5 h-5 text-gold-400" />
                        <h4 className="font-semibold">Interest Rate</h4>
                      </div>
                      <div className="text-2xl font-bold text-gold-400">
                        {results.rate.toFixed(2)}%
                      </div>
                      <p className="text-sm text-gray-400">Variable rate</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gold-400" />
                        <h4 className="font-semibold">Monthly Payment</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        ${results.interestOnlyPayment.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-400">Interest only</p>
                    </div>
                  </div>
                </div>

                {/* Qualification Status */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 border ${results.qualifies ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {results.qualifies ? (
                      <>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-300">Pre-Qualified</h4>
                          <p className="text-sm text-green-200">Based on the information provided</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-300">Income Insufficient</h4>
                          <p className="text-sm text-red-200">Payment exceeds 5% of income</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* LTV Information */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold mb-4">Loan-to-Value Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current LTV</span>
                      <span className="font-semibold">{results.currentLTV.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">New Combined LTV</span>
                      <span className="font-semibold">{results.newLTV.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available Equity</span>
                      <span className="font-semibold text-gold-400">${results.availableEquity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="flex gap-4">
                  <Link 
                    href="/contact"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center"
                  >
                    Get Pre-Approved
                  </Link>
                  <Link 
                    href="/equity-lending/calculators/home-equity"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    Home Equity
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Important HELOC Information</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• HELOC rates are variable and subject to change</p>
                    <p>• Maximum combined loan-to-value is typically 65% in Canada</p>
                    <p>• Credit score and income verification required</p>
                    <p>• Property appraisal may be required</p>
                    <p>• Interest-only payments during draw period (typically 10 years)</p>
                    <p>• Principal and interest payments required during repayment period</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ComplianceBanner />
      </main>
    </>
  );
}