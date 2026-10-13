"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { TrendingUp, Calculator, DollarSign, AlertTriangle, CheckCircle, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useLiveRates } from "@/lib/useLiveRates";
import { useLiveDefault, livePrivateSecond, ratesAsOf } from "@/components/calculators/liveRateDefaults";
import { LiveRateNote } from "@/components/calculators/LiveRateNote";
import CalculatorPdfButton from "@/components/calculator-report/CalculatorPdfButton";
import { money, pct } from "@/components/calculator-report/reportFormat";

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

  // Starting private rate: seeded from today's lowest advertised private mortgage rate (live feed)
  // until the user edits it; 8.5% is the static fallback when the feed is unavailable.
  const { data: liveRates, loading: ratesLoading } = useLiveRates();
  const liveStartRate = livePrivateSecond(liveRates);
  const startRate = useLiveDefault(8.5, liveStartRate);
  
  // Private Lending Parameters
  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const ltvRatio = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;
  
  // Interest rate based on risk profile
  const interestRate = useMemo(() => {
    let baseRate = Math.max(0, startRate.value || 0); // starting private rate (live-seeded)
    
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
  }, [creditScore, ltvRatio, incomeDocumentation, startRate.value]);

  // Income calculations
  const totalGrossIncome = employmentIncome + selfEmployedIncome + rentalIncome + investmentIncome + otherIncome;
  const adjustedRentalIncome = rentalIncome * 0.75; // 75% of rental income considered
  // Self-employed: with tax returns (NOAs), alternative lenders commonly gross up net business
  // income by 15%; bank-statement and stated programs use the reasonable declared income as-is.
  const selfEmployedFactor = incomeDocumentation === "tax-returns" ? 1.15 : 1.0;
  const adjustedSelfEmployedIncome = selfEmployedIncome * selfEmployedFactor;
  const totalQualifyingIncome = employmentIncome + adjustedSelfEmployedIncome + adjustedRentalIncome + investmentIncome + otherIncome;
  
  // Monthly calculations
  const monthlyQualifyingIncome = totalQualifyingIncome / 12;
  // Inputs are outstanding BALANCES; lenders use ~3% of the balance per month when the actual
  // payment is unknown (previously balances were divided by 12, overstating payments ~2.8x).
  const monthlyDebts = (creditCardDebt + carLoans + otherDebts) * 0.03;

  // Private mortgages are typically interest-only on a 1-year (renewable) term
  const monthlyPayment = loanAmount * interestRate / 100 / 12;

  // Typical private-lending fees (deducted from or added to the advance)
  const lenderFee = loanAmount * 0.02; // 1–3% lender fee
  const brokerFee = loanAmount * 0.01; // ~1% brokerage fee
  const totalFees = lenderFee + brokerFee;
  // Effective first-year cost of borrowing: interest + fees, as % of loan
  const effectiveAnnualCost = loanAmount > 0 ? ((monthlyPayment * 12 + totalFees) / loanAmount) * 100 : 0;

  // Ratios (payment only — property tax and heat not included)
  const gdsRatio = monthlyQualifyingIncome > 0 ? (monthlyPayment / monthlyQualifyingIncome) * 100 : 0;
  const tdsRatio = monthlyQualifyingIncome > 0 ? ((monthlyPayment + monthlyDebts) / monthlyQualifyingIncome) * 100 : 0;
  
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
                Qualify for financing with flexible income verification when traditional lending doesn&apos;t fit your situation.
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
                          {(purchasePrice > 0 ? (downPayment / purchasePrice) * 100 : 0).toFixed(1)}% down payment
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
                          Credit Card Balance
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
                          Car Loan Balance
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
                          Other Debt Balances
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
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Starting Private Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={startRate.value}
                          onChange={(e) => startRate.set(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white"
                        />
                        <LiveRateNote
                          label="advertised private mortgage rate (2nd mortgage, low LTV)"
                          liveRate={liveStartRate}
                          asOf={ratesAsOf(liveRates)}
                          touched={startRate.touched}
                          loading={ratesLoading}
                          onReset={startRate.reset}
                          extra="— credit, LTV and documentation adjustments are added below (min. 7.5%)"
                        />
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
                        <div className="text-xs text-gray-500">Starting rate {startRate.value.toFixed(2)}% + risk adjustments (est.)</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                        <div className="text-xl font-bold text-rose-400">
                          ${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </div>
                        <div className="text-xs text-gray-500">Interest-only</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Term</div>
                        <div className="text-xl font-bold text-rose-400">1 Year</div>
                        <div className="text-xs text-gray-500">Typical private term (renewable)</div>
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
                        <span className="text-white">${Math.round(adjustedRentalIncome).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Self-Employed ({selfEmployedFactor > 1 ? '15% gross-up' : 'as declared'}):</span>
                        <span className="text-white">${Math.round(adjustedSelfEmployedIncome).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Est. Monthly Debt Payments (3% of balances):</span>
                        <span className="text-white">${Math.round(monthlyDebts).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-300">Qualifying Income:</span>
                        <span className="text-rose-400 font-bold">${Math.round(totalQualifyingIncome).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost of Borrowing */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Estimated Cost of Borrowing</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lender Fee (est. 2%):</span>
                        <span className="text-white">${Math.round(lenderFee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Broker Fee (est. 1%):</span>
                        <span className="text-white">${Math.round(brokerFee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interest, First Year:</span>
                        <span className="text-white">${Math.round(monthlyPayment * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-300">Effective First-Year Cost:</span>
                        <span className="text-rose-400 font-bold">{effectiveAnnualCost.toFixed(2)}%</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Fees vary by lender and deal (lender fees typically 1–3%); legal and appraisal costs are extra.
                        Plan an exit (refinance to a B or A lender, or sale) before the term ends.
                      </p>
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
                        <div className="text-xs text-gray-500">Max: 50% (private) • P&amp;I only</div>
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

              <CalculatorPdfButton
                source="calculator-pdf-private-alternative-income"
                title="Your Alternative Income Analysis"
                subtitle="Get a personalized PDF with your private-lending qualification estimate"
                calculatorName="Alternative Income Calculator"
                mortgageType="Private / Alternative"
                amount={loanAmount}
                getSections={() => [
                  {
                    title: "Your Inputs",
                    rows: [
                      { label: "Purchase Price", value: money(purchasePrice) },
                      { label: "Down Payment", value: money(downPayment) },
                      { label: "Total Gross Income (annual)", value: money(totalGrossIncome) },
                      { label: "Debt Balances (cards, car, other)", value: money(creditCardDebt + carLoans + otherDebts) },
                      { label: "Credit Score", value: String(creditScore) },
                      { label: "Income Documentation", value: incomeDocumentation === "tax-returns" ? "Tax returns" : incomeDocumentation === "bank-statements" ? "Bank statements" : "Stated income" },
                      { label: "Starting Private Rate", value: pct(startRate.value) },
                    ],
                  },
                  {
                    title: "Your Results",
                    rows: [
                      { label: "Loan Amount", value: money(loanAmount), highlight: true },
                      { label: "Loan-to-Value", value: pct(ltvRatio, 1) },
                      { label: "Estimated Interest Rate", value: pct(interestRate) },
                      { label: "Monthly Payment (interest-only)", value: money(monthlyPayment), highlight: true },
                      { label: "Qualifying Income (annual)", value: money(totalQualifyingIncome) },
                      { label: "Est. Monthly Debt Payments (3% of balances)", value: money(monthlyDebts) },
                      { label: "GDS (payment only; private max ~50%)", value: pct(gdsRatio, 1) },
                      { label: "TDS (private max ~60%)", value: pct(tdsRatio, 1) },
                      { label: "Lender + Broker Fees (est. 2% + 1%)", value: money(totalFees) },
                      { label: "Effective First-Year Cost", value: pct(effectiveAnnualCost), highlight: true },
                      { label: "Qualifies for Private Lending (estimate)", value: qualifiesForPrivate ? "Likely" : "May require adjustment" },
                    ],
                  },
                ]}
                educationalContent="Private mortgages are usually interest-only on a 1-year renewable term, with lender and broker fees of about 1-3% each. Rates depend on credit, loan-to-value and how income is documented. Plan your exit (refinance to a B or A lender, or sale) before the term ends. Estimates only; not a commitment to lend."
              />

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