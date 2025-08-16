"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Building, TrendingUp, Calculator, DollarSign, AlertTriangle, CheckCircle, PieChart } from "lucide-react";
import Link from "next/link";

export default function CommercialCashFlowCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(2500000);
  const [downPayment, setDownPayment] = useState(625000); // 25%
  const [interestRate, setInterestRate] = useState(6.25);
  const [amortization, setAmortization] = useState(25);
  const [grossRent, setGrossRent] = useState(300000);
  const [vacancy, setVacancy] = useState(5);
  const [operatingExpenses, setOperatingExpenses] = useState(90000);
  const [propertyTaxes, setPropertyTaxes] = useState(24000);
  const [insurance, setInsurance] = useState(12000);
  const [maintenance, setMaintenance] = useState(15000);

  // Calculated values
  const loanAmount = purchasePrice - downPayment;
  const downPaymentPercent = (downPayment / purchasePrice) * 100;

  // Monthly mortgage payment calculation
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = amortization * 12;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Annual cash flow analysis
  const effectiveGrossIncome = grossRent * (1 - vacancy / 100);
  const totalOperatingExpenses = operatingExpenses + propertyTaxes + insurance + maintenance;
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
  const annualDebtService = monthlyPayment * 12;
  const beforeTaxCashFlow = netOperatingIncome - annualDebtService;
  const monthlyBeforeTaxCashFlow = beforeTaxCashFlow / 12;

  // Key ratios
  const dscr = netOperatingIncome / annualDebtService; // Debt Service Coverage Ratio
  const capRate = (netOperatingIncome / purchasePrice) * 100; // Capitalization Rate
  const cashOnCashReturn = (beforeTaxCashFlow / downPayment) * 100; // Cash-on-Cash Return
  const loanToValue = (loanAmount / purchasePrice) * 100; // Loan-to-Value Ratio

  // Qualification assessment
  const dscrGood = dscr >= 1.25;
  const capRateGood = capRate >= 6.0;
  const cashFlowPositive = beforeTaxCashFlow > 0;
  const goodInvestment = dscrGood && capRateGood && cashFlowPositive;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/commercial" className="text-gray-400 hover:text-purple-400 transition-colors">Commercial Lending</Link>
              <span className="text-gray-600">›</span>
              <span className="text-purple-400">Cash Flow Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-6">
                <PieChart className="w-4 h-4" />
                Commercial Investment Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Cash Flow</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Analyze commercial real estate investments with comprehensive cash flow and ratio calculations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Commercial Cash Flow Analysis</h2>
              
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {downPaymentPercent.toFixed(1)}% of purchase price
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Amortization (Years)
                  </label>
                  <select
                    value={amortization}
                    onChange={(e) => setAmortization(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  >
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Gross Rent
                  </label>
                  <input
                    type="number"
                    value={grossRent}
                    onChange={(e) => setGrossRent(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vacancy}
                    onChange={(e) => setVacancy(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Operating Expenses
                  </label>
                  <input
                    type="number"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Property Taxes
                  </label>
                  <input
                    type="number"
                    value={propertyTaxes}
                    onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Insurance
                  </label>
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Maintenance & Repairs
                  </label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Cash Flow Analysis</h3>
                
                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Cash Flow</div>
                    <div className={`text-2xl font-bold ${beforeTaxCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${monthlyBeforeTaxCashFlow.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Before tax</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">DSCR</div>
                    <div className={`text-2xl font-bold ${dscrGood ? 'text-green-400' : 'text-red-400'}`}>
                      {dscr.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Min: 1.25</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cap Rate</div>
                    <div className={`text-2xl font-bold ${capRateGood ? 'text-green-400' : 'text-yellow-400'}`}>
                      {capRate.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">Market rate</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cash-on-Cash</div>
                    <div className={`text-2xl font-bold ${cashOnCashReturn >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {cashOnCashReturn.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">Return on investment</div>
                  </div>
                </div>

                {/* Income Statement */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="text-purple-400 font-semibold mb-3">Annual Income Statement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Rental Income:</span>
                      <span className="text-white">${grossRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Less: Vacancy ({vacancy}%):</span>
                      <span className="text-red-400">-${(grossRent * vacancy / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-gray-400">Effective Gross Income:</span>
                      <span className="text-white font-semibold">${effectiveGrossIncome.toLocaleString()}</span>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operating Expenses:</span>
                        <span className="text-red-400">-${operatingExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Property Taxes:</span>
                        <span className="text-red-400">-${propertyTaxes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Insurance:</span>
                        <span className="text-red-400">-${insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Maintenance:</span>
                        <span className="text-red-400">-${maintenance.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-gray-400">Net Operating Income:</span>
                      <span className="text-purple-400 font-semibold">${netOperatingIncome.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Debt Service:</span>
                      <span className="text-red-400">-${annualDebtService.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-gray-400">Before-Tax Cash Flow:</span>
                      <span className={`font-semibold ${beforeTaxCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${beforeTaxCashFlow.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${goodInvestment ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {goodInvestment ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${goodInvestment ? 'text-green-400' : 'text-orange-400'}`}>
                        {goodInvestment ? 'Strong Investment Opportunity' : 'Investment Requires Review'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {goodInvestment 
                          ? `DSCR: ${dscr.toFixed(2)}, Cap Rate: ${capRate.toFixed(2)}%, Positive Cash Flow`
                          : `Review: DSCR ${dscr < 1.25 ? 'low' : 'good'}, Cash Flow ${beforeTaxCashFlow < 0 ? 'negative' : 'positive'}`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lending Criteria */}
              <div className="bg-purple-500/10 rounded-xl p-6 mb-6 border border-purple-500/20">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Commercial Lending Criteria</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Minimum DSCR</div>
                    <div className="text-xl font-bold text-purple-400">1.25</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Maximum LTV</div>
                    <div className="text-xl font-bold text-purple-400">75%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Current LTV</div>
                    <div className={`text-xl font-bold ${loanToValue <= 75 ? 'text-green-400' : 'text-red-400'}`}>
                      {loanToValue.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-3">
                  Professional valuation and environmental assessments required for all commercial financing.
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/calculators/payment" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link 
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href={"/commercial" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Back to Commercial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}