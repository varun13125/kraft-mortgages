"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { CheckCircle, Calculator, DollarSign, Percent, Clock, Home, CreditCard, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Pre-approval calculation logic
function calculatePreApproval({
  grossIncome,
  monthlyDebts,
  downPayment,
  creditScore,
  heatingCosts = 150,
  propertyTax = 300,
  condoFees = 0
}: {
  grossIncome: number;
  monthlyDebts: number;
  downPayment: number;
  creditScore: number;
  heatingCosts?: number;
  propertyTax?: number;
  condoFees?: number;
}) {
  // Get stress test rate and mortgage rate based on credit score
  const stressTestRate = 5.25; // Bank of Canada qualifying rate
  let mortgageRate: number;
  
  if (creditScore >= 780) mortgageRate = 5.49;
  else if (creditScore >= 720) mortgageRate = 5.69;
  else if (creditScore >= 680) mortgageRate = 5.89;
  else if (creditScore >= 640) mortgageRate = 6.19;
  else mortgageRate = 6.89;
  
  // CMHC insurance requirements
  const isHighRatio = downPayment < 0.20;
  const minDownPayment = downPayment >= 0.05 ? downPayment : 0.05;
  
  // Calculate maximum purchase price using stress test
  const monthlyIncome = grossIncome / 12;
  
  // GDS ratio calculation (max 39% for stress test)
  const maxGDS = monthlyIncome * 0.39;
  const availableForMortgage = maxGDS - heatingCosts - propertyTax - condoFees;
  
  // TDS ratio calculation (max 44% for stress test) 
  const maxTDS = monthlyIncome * 0.44;
  const availableForMortgageWithDebts = maxTDS - heatingCosts - propertyTax - condoFees - monthlyDebts;
  
  // Use the lower of GDS or TDS available amount
  const maxMortgagePayment = Math.min(availableForMortgage, availableForMortgageWithDebts);
  
  if (maxMortgagePayment <= 0) {
    return {
      maxPurchasePrice: 0,
      maxMortgageAmount: 0,
      monthlyPayment: 0,
      gdsRatio: 0,
      tdsRatio: 0,
      qualifies: false,
      mortgageRate,
      stressTestRate,
      isHighRatio,
      cmhcPremium: 0,
      recommendation: "Income insufficient for qualification"
    };
  }
  
  // Calculate maximum mortgage amount using stress test rate
  const monthlyStressRate = stressTestRate / 100 / 12;
  const numPayments = 25 * 12; // 25 year amortization
  
  const maxMortgageAmount = maxMortgagePayment * ((1 - Math.pow(1 + monthlyStressRate, -numPayments)) / monthlyStressRate);
  
  // Calculate maximum purchase price
  const maxPurchasePrice = maxMortgageAmount / (1 - minDownPayment);
  
  // CMHC premium calculation for high-ratio mortgages
  let cmhcPremiumRate = 0;
  if (isHighRatio) {
    if (minDownPayment < 0.10) cmhcPremiumRate = 0.04;
    else if (minDownPayment < 0.15) cmhcPremiumRate = 0.031;
    else cmhcPremiumRate = 0.028;
  }
  
  const cmhcPremium = isHighRatio ? maxMortgageAmount * cmhcPremiumRate : 0;
  
  // Calculate actual monthly payment at contract rate
  const monthlyRate = mortgageRate / 100 / 12;
  const actualMortgageAmount = maxMortgageAmount + cmhcPremium;
  const monthlyPayment = actualMortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  // Calculate actual ratios
  const totalHousingCosts = monthlyPayment + heatingCosts + propertyTax + condoFees;
  const gdsRatio = (totalHousingCosts / monthlyIncome) * 100;
  const tdsRatio = ((totalHousingCosts + monthlyDebts) / monthlyIncome) * 100;
  
  const qualifies = gdsRatio <= 39 && tdsRatio <= 44 && maxMortgagePayment > 0;
  
  let recommendation = "";
  if (qualifies) {
    recommendation = "You qualify for pre-approval!";
  } else if (gdsRatio > 39) {
    recommendation = "Reduce housing costs or increase income";
  } else if (tdsRatio > 44) {
    recommendation = "Pay down existing debts to improve qualification";
  }
  
  return {
    maxPurchasePrice,
    maxMortgageAmount: actualMortgageAmount,
    monthlyPayment,
    gdsRatio,
    tdsRatio,
    qualifies,
    mortgageRate,
    stressTestRate,
    isHighRatio,
    cmhcPremium,
    recommendation
  };
}

export default function PreApprovalCalculator() {
  const [grossIncome, setGrossIncome] = useState(85000);
  const [monthlyDebts, setMonthlyDebts] = useState(800);
  const [downPayment, setDownPayment] = useState(0.10); // 10%
  const [creditScore, setCreditScore] = useState(720);
  const [heatingCosts, setHeatingCosts] = useState(150);
  const [propertyTax, setPropertyTax] = useState(300);
  const [condoFees, setCondoFees] = useState(0);

  const results = calculatePreApproval({
    grossIncome,
    monthlyDebts,
    downPayment,
    creditScore,
    heatingCosts,
    propertyTax,
    condoFees
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
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Pre-Approval Calculator</span>
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
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Pre-Approval Calculator</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
                Mortgage Pre-Approval
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get an instant estimate of how much you can qualify for with our pre-approval calculator using current stress test requirements.
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
                    Income & Financial Details
                  </h2>

                  <div className="space-y-6">
                    {/* Gross Annual Income */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        Gross Annual Income
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="30000"
                          max="500000"
                          step="5000"
                        />
                      </div>
                    </div>

                    {/* Monthly Debt Payments */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gold-400" />
                        Monthly Debt Payments
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={monthlyDebts}
                          onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max="5000"
                          step="50"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Credit cards, loans, car payments</p>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold-400" />
                        Down Payment ({(downPayment * 100).toFixed(0)}%)
                      </label>
                      <input
                        type="range"
                        min="0.05"
                        max="0.35"
                        step="0.01"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>5%</span>
                        <span className="font-semibold text-gold-400">{(downPayment * 100).toFixed(0)}%</span>
                        <span>35%</span>
                      </div>
                    </div>

                    {/* Credit Score */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gold-400" />
                        Credit Score
                      </label>
                      <input
                        type="range"
                        min="600"
                        max="850"
                        value={creditScore}
                        onChange={(e) => setCreditScore(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>600</span>
                        <span className="font-semibold text-gold-400">{creditScore}</span>
                        <span>850</span>
                      </div>
                    </div>

                    {/* Housing Costs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Monthly Heating</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
                            type="number"
                            value={heatingCosts}
                            onChange={(e) => setHeatingCosts(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 text-sm bg-white/5 border border-white/20 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors"
                            min="50"
                            max="500"
                            step="25"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Property Tax</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
                            type="number"
                            value={propertyTax}
                            onChange={(e) => setPropertyTax(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 text-sm bg-white/5 border border-white/20 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors"
                            min="100"
                            max="1000"
                            step="50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Condo Fees */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Condo Fees (if applicable)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={condoFees}
                          onChange={(e) => setCondoFees(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max="800"
                          step="25"
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
                {/* Pre-Approval Amount */}
                <div className={`backdrop-blur-sm rounded-2xl p-8 border ${results.qualifies ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {results.qualifies ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <h3 className="text-xl font-bold">Pre-Approval Amount</h3>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${results.qualifies ? 'text-green-400' : 'text-red-400'}`}>
                    ${results.maxPurchasePrice.toLocaleString()}
                  </div>
                  <p className={`text-sm ${results.qualifies ? 'text-green-200' : 'text-red-200'}`}>
                    {results.recommendation}
                  </p>
                </div>

                {/* Mortgage Details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Mortgage Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300 block">Mortgage Amount</span>
                      <span className="font-semibold text-lg">${results.maxMortgageAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Monthly Payment</span>
                      <span className="font-semibold text-lg">${results.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Mortgage Rate</span>
                      <span className="font-semibold text-lg">{results.mortgageRate.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Stress Test Rate</span>
                      <span className="font-semibold text-lg">{results.stressTestRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Debt Service Ratios */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Debt Service Ratios</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">GDS Ratio (max 39%)</span>
                        <span className={`font-semibold ${results.gdsRatio <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                          {results.gdsRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${results.gdsRatio <= 39 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(results.gdsRatio / 39 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">TDS Ratio (max 44%)</span>
                        <span className={`font-semibold ${results.tdsRatio <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                          {results.tdsRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${results.tdsRatio <= 44 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(results.tdsRatio / 44 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CMHC Insurance */}
                {results.isHighRatio && (
                  <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-yellow-300">CMHC Insurance Required</h4>
                    </div>
                    <p className="text-sm text-yellow-200 mb-2">
                      Down payment less than 20% requires mortgage insurance
                    </p>
                    <div className="text-lg font-semibold text-yellow-400">
                      ${results.cmhcPremium.toLocaleString()} premium
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="flex gap-4">
                  <Link 
                    href="/contact"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center"
                  >
                    Get Pre-Approved
                  </Link>
                  <Link 
                    href="/calculators/affordability"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    Affordability
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">About Pre-Approval</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• This calculator uses the current stress test rate of {results.stressTestRate}%</p>
                    <p>• Pre-approval is valid for 90-120 days depending on the lender</p>
                    <p>• Actual rates and approval are subject to credit and income verification</p>
                    <p>• CMHC insurance is required for down payments under 20%</p>
                    <p>• Property appraisal and other conditions will apply to final approval</p>
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