"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { TrendingUp, Home, Calculator, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useLiveRates } from "@/lib/useLiveRates";
import { payment } from "@/lib/calc/payment";
import { stressTestRate } from "@/lib/calc/affordability";
import { liveConventional5yr, ratesAsOf } from "@/components/calculators/liveRateDefaults";

// Static conventional 5-yr fixed used when the live feed is unavailable (Oct 2026 snapshot)
const FALLBACK_CONVENTIONAL_5YR = 4.39;

export default function HomeEquityCalculator() {
  const [homeValue, setHomeValue] = useState(800000);
  const [currentMortgage, setCurrentMortgage] = useState(400000);
  const [creditScore, setCreditScore] = useState(750);
  const [income, setIncome] = useState(150000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [taxAndHeat, setTaxAndHeat] = useState(450);
  // Refinances can't be insured, so price off the lowest CONVENTIONAL 5-yr fixed
  // (useLiveRates().best5YrFixed is the insured rate).
  const { data: liveRates, loading: ratesLoading } = useLiveRates();
  const liveConv = liveConventional5yr(liveRates);
  const baseRate = liveConv ?? FALLBACK_CONVENTIONAL_5YR;

  // Calculate available equity (LTV room): 80% max for a conventional refinance
  const availableEquity = useMemo(() => {
    const maxLTV = creditScore >= 720 ? 0.80 : creditScore >= 680 ? 0.75 : 0.70;
    const maxLoanAmount = homeValue * maxLTV;
    return Math.max(0, maxLoanAmount - currentMortgage);
  }, [homeValue, currentMortgage, creditScore]);

  // Rate estimation: today's lowest conventional 5-yr fixed + credit-based spread (estimates)
  const creditSpread = creditScore >= 750 ? 0.30 : creditScore >= 700 ? 0.60 : creditScore >= 650 ? 1.60 : 3.00; // 650-699: typically alternative (B) lender
  const estimatedRate = useMemo(() => baseRate + creditSpread, [baseRate, creditSpread]);

  // Qualification (refinance): the whole new mortgage is stress-tested at max(rate + 2%, 5.25%)
  // over 25 years; TDS = mortgage + property tax/heat + other debts ≤ 44% of gross income.
  const monthlyIncome = income / 12;
  const qualRate = stressTestRate(estimatedRate);
  const qualPerDollar = payment({ principal: 1, annualRatePct: qualRate, amortYears: 25, paymentsPerYear: 12 });
  const maxMortgageByIncome = Math.max(0, (monthlyIncome * 0.44 - monthlyDebts - taxAndHeat) / qualPerDollar);
  const availableByIncome = Math.max(0, maxMortgageByIncome - currentMortgage);
  const availableToBorrow = Math.min(availableEquity, availableByIncome);
  const debtToIncome = monthlyIncome > 0
    ? (((currentMortgage + availableEquity) * qualPerDollar + monthlyDebts + taxAndHeat) / monthlyIncome) * 100
    : 0;
  const qualifiesBasic = debtToIncome <= 44 && creditScore >= 600;

  // Estimated payment on the new money at the contract rate, 25-year amortization (semi-annual compounding)
  const monthlyPaymentNewMoney = availableToBorrow > 0
    ? payment({ principal: availableToBorrow, annualRatePct: estimatedRate, amortYears: 25, paymentsPerYear: 12 })
    : 0;

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
              <span className="text-emerald-400">Home Equity Calculator</span>
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
                <TrendingUp className="w-4 h-4" />
                Home Equity Access
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Home Equity</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate how much equity you can access from your home at institutional rates.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Home Equity Analysis</h2>
              
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Debt Payments (excluding mortgage)
                  </label>
                  <input
                    type="number"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Property Tax &amp; Heating (monthly)
                  </label>
                  <input
                    type="number"
                    value={taxAndHeat}
                    onChange={(e) => setTaxAndHeat(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Available Equity</h3>
                
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Current Equity</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${(homeValue - currentMortgage).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Home value - mortgage</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Available to Borrow</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${availableToBorrow.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">
                      Lesser of LTV room (${Math.round(availableEquity).toLocaleString()}) and income limit (${Math.round(availableByIncome).toLocaleString()})
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Estimated Rate</div>
                    <div className="text-2xl font-bold text-emerald-400">{estimatedRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">
                      {liveConv !== undefined
                        ? `Lowest conventional 5-yr fixed ${baseRate.toFixed(2)}%${ratesAsOf(liveRates) ? ` (as of ${ratesAsOf(liveRates)})` : ""}`
                        : ratesLoading
                          ? `Conventional 5-yr fixed ${baseRate.toFixed(2)}% (loading today's rate)`
                          : `Example conventional 5-yr fixed ${baseRate.toFixed(2)}% (live rates unavailable)`}
                      {` + ${creditSpread.toFixed(2)}% credit-based spread`}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Payment on New Money</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${monthlyPaymentNewMoney.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Monthly, 25-yr amortization (est.)</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${qualifiesBasic ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {qualifiesBasic ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${qualifiesBasic ? 'text-green-400' : 'text-orange-400'}`}>
                        {qualifiesBasic ? 'Likely Qualifies' : 'May Need Review'}
                      </div>
                      <div className="text-sm text-gray-400">
                        TDS at full LTV room: {debtToIncome.toFixed(1)}% (stress-tested at {qualRate.toFixed(2)}%, max 44%)
                        {qualifiesBasic
                          ? ' - Within guideline'
                          : ' - Income limits the amount; an alternative lender or smaller amount may be needed'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Comparison */}
              <div className="bg-emerald-500/10 rounded-xl p-6 mb-6 border border-emerald-500/20">
                <h4 className="text-lg font-semibold text-emerald-400 mb-3">Why Choose Equity Lending?</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Our Equity Rate</div>
                    <div className="text-xl font-bold text-emerald-400">{estimatedRate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Private Lender Rate</div>
                    <div className="text-xl font-bold text-red-400">8-15%+</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-3">
                  Save thousands with our institutional rates and professional service.
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Estimates only. Assumes a refinance of the whole mortgage, qualified at the federal stress-test rate with a 44% TDS limit.
                  Rates are estimated from today&apos;s lowest conventional (uninsured) 5-year fixed rate plus a credit-based spread; refinance penalties, legal and
                  appraisal costs are not included.
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/equity-lending/calculators/debt-consolidation"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Debt Consolidation
                </Link>
                <Link 
                  href="/calculators/affordability"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href="/equity-lending"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
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