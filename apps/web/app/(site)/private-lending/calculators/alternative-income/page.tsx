"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { TrendingUp, Calculator, DollarSign, AlertTriangle, CheckCircle, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function AlternativeIncomeCalculator() {
  // Property Details
  const [purchasePrice, setPurchasePrice] = useState(850000);
  const [downPayment, setDownPayment] = useState(170000); // 20%
  
  // Income Sources
  const [employmentIncome, setEmploymentIncome] = useState(60000);
  const [selfEmployedIncome, setSelfEmployedIncome] = useState(80000);
  const [rentalIncome, setRentalIncome] = useState(36000);
  const [investmentIncome, setInvestmentIncome] = useState(24000);
  const [otherIncome, setOtherIncome] = useState(15000);
  
  // Debts
  const [creditCardDebt, setCreditCardDebt] = useState(15000);
  const [carLoans, setCarLoans] = useState(25000);
  const [otherDebts, setOtherDebts] = useState(10000);
  
  // Credit Profile
  const [creditScore, setCreditScore] = useState(650);
  const [incomeDocumentation, setIncomeDocumentation] = useState("stated"); // stated, bank-statements, tax-returns
  
  // Private Lending Parameters
  const loanAmount = purchasePrice - downPayment;
  const ltvRatio = (loanAmount / purchasePrice) * 100;
  
  // Interest rate based on risk profile
  const interestRate = useMemo(() => {
    let baseRate = 8.5; // Private lending base rate
    
    // Credit score adjustment
    if (creditScore >= 700) baseRate -= 0.5;
    else if (creditScore < 600) baseRate += 1.0;
    
    // LTV adjustment
    if (ltvRatio > 80) baseRate += 0.75;
    else if (ltvRatio < 70) baseRate -= 0.25;
    
    // Documentation adjustment
    if (incomeDocumentation === "tax-returns") baseRate -= 0.5;
    else if (incomeDocumentation === "stated") baseRate += 0.75;
    
    return Math.max(baseRate, 7.5); // Minimum 7.5%
  }, [creditScore, ltvRatio, incomeDocumentation]);

  // Income calculations
  const totalGrossIncome = employmentIncome + selfEmployedIncome + rentalIncome + investmentIncome + otherIncome;
  const adjustedRentalIncome = rentalIncome * 0.75; // 75% of rental income considered
  const adjustedSelfEmployedIncome = selfEmployedIncome * 0.85; // 85% of self-employed income
  const totalQualifyingIncome = employmentIncome + adjustedSelfEmployedIncome + adjustedRentalIncome + investmentIncome + otherIncome;
  
  // Monthly calculations
  const monthlyQualifyingIncome = totalQualifyingIncome / 12;
  const monthlyDebts = (creditCardDebt + carLoans + otherDebts) / 12; // Simplified monthly payment estimate
  
  // Mortgage payment calculation (2-year term typical for private)
  const monthlyRate = interestRate / 100 / 12;
  const amortizationMonths = 25 * 12; // 25-year amortization
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths)) / 
                        (Math.pow(1 + monthlyRate, amortizationMonths) - 1);
  
  // Ratios
  const gdsRatio = (monthlyPayment / monthlyQualifyingIncome) * 100;
  const tdsRatio = ((monthlyPayment + monthlyDebts) / monthlyQualifyingIncome) * 100;
  
  // Private lending qualification (more flexible than traditional)
  const privateLendingGDS = gdsRatio <= 50; // More flexible than traditional 39%
  const privateLendingTDS = tdsRatio <= 60; // More flexible than traditional 44%
  const qualifiesForPrivate = privateLendingGDS && privateLendingTDS && ltvRatio <= 85;
  
  // Risk assessment
  const isLowRisk = creditScore >= 650 && ltvRatio <= 75 && totalQualifyingIncome >= 100000;
  const isMediumRisk = creditScore >= 600 && ltvRatio <= 80;
  const isHighRisk = !isLowRisk && !isMediumRisk;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-rose-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/private-lending" className="text-gray-400 hover:text-rose-400 transition-colors">Private Lending</Link>
              <span className="text-gray-600">›</span>
              <span className="text-rose-400">Alternative Income Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-6">
                <FileText className="w-4 h-4" />
                Alternative Income Verification
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Alternative Income</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Qualify for financing with flexible income verification when traditional lending doesn't fit your situation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Alternative Income Analysis</h2>
              
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column - Inputs */}
                <div className="space-y-6">
                  {/* Property Information */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-rose-400 mb-4">Property Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Purchase Price
                        </label>
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
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
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          {((downPayment / purchasePrice) * 100).toFixed(1)}% down payment
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Income Sources */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-rose-400 mb-4">Annual Income Sources</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Employment Income (T4)
                        </label>
                        <input
                          type="number"
                          value={employmentIncome}
                          onChange={(e) => setEmploymentIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Self-Employed Income
                        </label>
                        <input
                          type="number"
                          value={selfEmployedIncome}
                          onChange={(e) => setSelfEmployedIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Rental Income
                        </label>
                        <input
                          type="number"
                          value={rentalIncome}
                          onChange={(e) => setRentalIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Investment Income
                        </label>
                        <input
                          type="number"
                          value={investmentIncome}
                          onChange={(e) => setInvestmentIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Other Income
                        </label>
                        <input
                          type="number"
                          value={otherIncome}
                          onChange={(e) => setOtherIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Debts */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-rose-400 mb-4">Current Debts</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Credit Card Debt
                        </label>
                        <input
                          type="number"
                          value={creditCardDebt}
                          onChange={(e) => setCreditCardDebt(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Car Loans
                        </label>
                        <input
                          type="number"
                          value={carLoans}
                          onChange={(e) => setCarLoans(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Other Debts
                        </label>
                        <input
                          type="number"
                          value={otherDebts}
                          onChange={(e) => setOtherDebts(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Credit Profile */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-rose-400 mb-4">Credit Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Credit Score
                        </label>
                        <select
                          value={creditScore}
                          onChange={(e) => setCreditScore(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        >
                          <option value={750}>750+ (Excellent)</option>
                          <option value={700}>700-749 (Very Good)</option>
                          <option value={650}>650-699 (Good)</option>
                          <option value={600}>600-649 (Fair)</option>
                          <option value={550}>550-599 (Poor)</option>
                          <option value={500}>500-549 (Very Poor)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Income Documentation
                        </label>
                        <select
                          value={incomeDocumentation}
                          onChange={(e) => setIncomeDocumentation(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        >
                          <option value="tax-returns">Tax Returns (2+ years)</option>
                          <option value="bank-statements">Bank Statements (3-12 months)</option>
                          <option value="stated">Stated Income</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                  {/* Financing Summary */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Financing Summary</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Loan Amount</div>
                        <div className="text-xl font-bold text-rose-400">
                          ${loanAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{ltvRatio.toFixed(1)}% LTV</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Interest Rate</div>
                        <div className="text-xl font-bold text-rose-400">{interestRate.toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">Private lending rate</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                        <div className="text-xl font-bold text-rose-400">
                          ${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </div>
                        <div className="text-xs text-gray-500">25-year amortization</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Term</div>
                        <div className="text-xl font-bold text-rose-400">2 Years</div>
                        <div className="text-xs text-gray-500">Typical private term</div>
                      </div>
                    </div>
                  </div>

                  {/* Income Analysis */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Income Analysis</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Gross Income:</span>
                        <span className="text-white">${totalGrossIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Adjusted Rental Income (75%):</span>
                        <span className="text-white">${adjustedRentalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Adjusted Self-Employed (85%):</span>
                        <span className="text-white">${adjustedSelfEmployedIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-300">Qualifying Income:</span>
                        <span className="text-rose-400 font-bold">${totalQualifyingIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Debt Service Ratios */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Qualification Ratios</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">GDS Ratio</div>
                        <div className={`text-xl font-bold ${privateLendingGDS ? 'text-green-400' : 'text-red-400'}`}>
                          {gdsRatio.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Max: 50% (private)</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">TDS Ratio</div>
                        <div className={`text-xl font-bold ${privateLendingTDS ? 'text-green-400' : 'text-red-400'}`}>
                          {tdsRatio.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Max: 60% (private)</div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Risk Profile</h3>
                    <div className={`p-4 rounded-lg border ${
                      isLowRisk ? 'bg-green-500/10 border-green-500/30' : 
                      isMediumRisk ? 'bg-yellow-500/10 border-yellow-500/30' : 
                      'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isLowRisk ? 'bg-green-400' : 
                          isMediumRisk ? 'bg-yellow-400' : 
                          'bg-red-400'
                        }`}></div>
                        <div>
                          <div className={`font-semibold ${
                            isLowRisk ? 'text-green-400' : 
                            isMediumRisk ? 'text-yellow-400' : 
                            'text-red-400'
                          }`}>
                            {isLowRisk ? 'Low Risk Profile' : isMediumRisk ? 'Medium Risk Profile' : 'High Risk Profile'}
                          </div>
                          <div className="text-sm text-gray-400">
                            Rate: {interestRate.toFixed(2)}% | LTV: {ltvRatio.toFixed(1)}% | Credit: {creditScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Qualification Status */}
                  <div className={`p-4 rounded-lg border ${qualifiesForPrivate ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                    <div className="flex items-center gap-3">
                      {qualifiesForPrivate ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                      )}
                      <div>
                        <div className={`font-semibold ${qualifiesForPrivate ? 'text-green-400' : 'text-orange-400'}`}>
                          {qualifiesForPrivate ? 'Qualifies for Private Lending' : 'May Require Adjustment'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {qualifiesForPrivate 
                            ? 'Alternative income documentation accepted with flexible qualification criteria'
                            : 'Consider increasing down payment or improving debt-to-income ratios'
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Private Lending Benefits */}
                  <div className="bg-rose-500/10 rounded-xl p-6 border border-rose-500/20">
                    <h4 className="text-lg font-semibold text-rose-400 mb-3">Private Lending Advantages</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Flexible income verification (stated income accepted)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Self-employed and commission income considered
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Faster approval process (7-14 days)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Higher debt-to-income ratios accepted
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Credit challenges considered case-by-case
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Link 
                  href={"/equity-lending/calculators/debt-consolidation" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Debt Consolidation
                </Link>
                <Link 
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href={"/private-lending" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Back to Private Lending
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}