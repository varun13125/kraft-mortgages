"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { CreditCard, Calculator, DollarSign, ArrowRight, TrendingUp, Percent, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useLiveRates } from "@/lib/useLiveRates";
import { payment } from "@/lib/calc/payment";
import { stressTestRate } from "@/lib/calc/affordability";
import { livePrime, ratesAsOf } from "@/components/calculators/liveRateDefaults";

// HELOC calculation logic
// OSFI B-20 (federally regulated lenders): the revolving HELOC portion is capped at 65% of
// property value, and HELOC + amortizing mortgage combined at 80%. Qualification uses the
// stress-test rate (max(contract + 2%, 5.25%)) on the full limit amortized over 25 years.
function calculateHELOC({
  homeValue,
  mortgageBalance,
  creditScore,
  monthlyIncome,
  mortgagePayment,
  otherMonthlyCosts,
  primeRate
}: {
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  monthlyIncome: number;
  mortgagePayment: number;
  otherMonthlyCosts: number;
  primeRate: number;
}) {
  const value = Math.max(0, homeValue);
  const balance = Math.max(0, mortgageBalance);
  const revolvingCap = value * 0.65;
  const combinedRoom = value * 0.80 - balance;
  const availableEquity = Math.max(0, Math.min(revolvingCap, combinedRoom));
  const ltvLimit = Math.min(availableEquity, 500000); // illustrative cap used by many lenders' standard HELOCs

  // Estimated variable rate = prime + credit-based spread (estimates; lender pricing varies)
  let spread: number;
  if (creditScore >= 780) spread = 0.5;
  else if (creditScore >= 720) spread = 0.75;
  else if (creditScore >= 680) spread = 1.0;
  else if (creditScore >= 640) spread = 2.0; // typically alternative (B) lender
  else spread = 3.5; // typically private / alternative lender
  const rate = primeRate + spread;

  // Income test (TDS ≤ 44%): existing obligations + stress-tested payment on the HELOC limit
  const qualRate = stressTestRate(rate);
  const qualPaymentPerDollar = payment({ principal: 1, annualRatePct: qualRate, amortYears: 25, paymentsPerYear: 12 });
  const roomForHeloc = monthlyIncome * 0.44 - Math.max(0, mortgagePayment) - Math.max(0, otherMonthlyCosts);
  const incomeSupported = Math.max(0, roomForHeloc / qualPaymentPerDollar);
  const maxHELOC = Math.max(0, Math.min(ltvLimit, incomeSupported));
  const qualifies = incomeSupported >= ltvLimit;
  const tdsAtLimit = monthlyIncome > 0
    ? ((Math.max(0, mortgagePayment) + Math.max(0, otherMonthlyCosts) + ltvLimit * qualPaymentPerDollar) / monthlyIncome) * 100
    : 0;

  // Interest-only payment if the available limit is fully drawn
  const interestOnlyPayment = maxHELOC * rate / 100 / 12;

  return {
    availableEquity,
    maxHELOC,
    rate,
    qualRate,
    interestOnlyPayment,
    qualifies,
    tdsAtLimit,
    currentLTV: value > 0 ? (balance / value) * 100 : 0,
    newLTV: value > 0 ? ((balance + maxHELOC) / value) * 100 : 0
  };
}

export default function HELOCCalculator() {
  const [homeValue, setHomeValue] = useState(800000);
  const [mortgageBalance, setMortgageBalance] = useState(400000);
  const [creditScore, setCreditScore] = useState(750);
  const [income, setIncome] = useState(120000);
  const [mortgagePayment, setMortgagePayment] = useState(2300);
  const [otherMonthlyCosts, setOtherMonthlyCosts] = useState(600);
  const { primeRate, data: liveRates, loading: ratesLoading } = useLiveRates();
  const primeIsLive = livePrime(liveRates) !== undefined;
  const asOf = ratesAsOf(liveRates);

  const results = calculateHELOC({
    homeValue,
    mortgageBalance,
    creditScore,
    monthlyIncome: income / 12,
    mortgagePayment,
    otherMonthlyCosts,
    primeRate
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

                    {/* Current Mortgage Payment */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        Current Mortgage Payment (monthly)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={mortgagePayment}
                          onChange={(e) => setMortgagePayment(Math.max(0, Number(e.target.value)))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          step="50"
                        />
                      </div>
                    </div>

                    {/* Other monthly costs */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        Property Tax, Heat &amp; Other Debt Payments (monthly)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={otherMonthlyCosts}
                          onChange={(e) => setOtherMonthlyCosts(Math.max(0, Number(e.target.value)))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          step="50"
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
                    ${Math.round(results.maxHELOC).toLocaleString()}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Estimated line of credit — lesser of equity limit (65% revolving / 80% combined) and income qualification
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
                      <p className="text-sm text-gray-400">Variable (prime + spread, est.)</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Prime {primeRate.toFixed(2)}%
                        {primeIsLive ? (asOf ? ` as of ${asOf}` : "") : ratesLoading ? " (loading today's rate)" : " (example — live rates unavailable)"}
                        {" "}+ {(results.rate - primeRate).toFixed(2)}% est. credit spread
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gold-400" />
                        <h4 className="font-semibold">Monthly Payment</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        ${Math.round(results.interestOnlyPayment).toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-400">Interest only, if fully drawn</p>
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
                          <h4 className="font-semibold text-green-300">Income Supports Full Limit</h4>
                          <p className="text-sm text-green-200">TDS {results.tdsAtLimit.toFixed(1)}% at a {results.qualRate.toFixed(2)}% stress-test rate (max 44%)</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-300">Limited by Income</h4>
                          <p className="text-sm text-red-200">TDS would be {results.tdsAtLimit.toFixed(1)}% at the full equity limit (max 44% at a {results.qualRate.toFixed(2)}% stress-test rate) — limit reduced to what your income supports</p>
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
                      <span className="font-semibold text-gold-400">${Math.round(results.availableEquity).toLocaleString()}</span>
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
                    <p>• HELOC limit is capped at 65% of home value; HELOC plus mortgage combined at 80% (OSFI B-20)</p>
                    <p>• Credit score and income verification required</p>
                    <p>• Property appraisal may be required</p>
                    <p>• Minimum payment is usually interest-only on the balance used; you can repay any time</p>
                    <p>• Lenders qualify you at the stress-test rate as if the full limit were amortized over 25 years</p>
                    <p>• Rates shown are estimates (prime + a credit-based spread); lower credit scores may require an alternative lender</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ComplianceBanner feature="LEAD_FORM" />
      </main>
    </>
  );
}