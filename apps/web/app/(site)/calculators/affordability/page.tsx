"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { stressTestRate, gdsTds } from "@/lib/calc/affordability";
import { payment } from "@/lib/calc/payment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { DollarSign, Calculator, Home, AlertTriangle, CheckCircle, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { validationRules, formatCurrency, formatPercentage } from "@/lib/utils/validation";

export default function Affordability() {
  const [income, setIncome] = useState(120000);
  const [debts, setDebts] = useState(6000); // annual non‑housing
  const [propTax, setPropTax] = useState(3000);
  const [heat, setHeat] = useState(1200);
  const [condoFees, setCondoFees] = useState(0);
  const [rate, setRate] = useState(5.35);
  const [principal, setPrincipal] = useState(650000);
  
  const qualRate = useMemo(() => stressTestRate(rate), [rate]);
  const monthlyPI = payment({ principal, annualRatePct: qualRate, amortYears: 25, paymentsPerYear: 12 });
  const housingAnnual = monthlyPI * 12 + propTax + heat + condoFees * 12;
  const { gds, tds } = gdsTds({ incomeAnnual: income, housingCostsAnnual: housingAnnual, totalDebtAnnual: debts });
  const pass = gds <= 39 && tds <= 44; // typical guideline

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
              <span className="text-gold-400">Affordability Calculator</span>
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
                <DollarSign className="w-4 h-4" />
                Affordability Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Affordability</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate your qualifying mortgage amount with GDS/TDS stress testing and CMHC guidelines.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Income & Debt Details
                  </h2>
                  
                  <div className="mb-6">
                    <ComplianceBanner feature="LEAD_FORM" />
                  </div>

                  <div className="space-y-6">
                    <ValidatedInput
                      label="Annual Household Income"
                      value={income}
                      onChange={setIncome}
                      validation={validationRules.income}
                      type="currency"
                      help="Include all household income before taxes"
                    />

                    <ValidatedInput
                      label="Annual Debt Payments"
                      value={debts}
                      onChange={setDebts}
                      validation={validationRules.monthlyDebts}
                      type="currency"
                      help="Credit cards, loans, car payments (annual total)"
                    />
                  </div>
                </div>

                {/* Housing Costs */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                    <Home className="w-5 h-5 text-gold-400" />
                    Housing Costs
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ValidatedInput
                      label="Annual Property Tax"
                      value={propTax}
                      onChange={setPropTax}
                      validation={{ min: 1000, max: 20000 }}
                      type="currency"
                    />

                    <ValidatedInput
                      label="Annual Heating Costs"
                      value={heat}
                      onChange={setHeat}
                      validation={{ min: 600, max: 6000 }}
                      type="currency"
                    />

                    <ValidatedInput
                      label="Monthly Condo Fees"
                      value={condoFees}
                      onChange={setCondoFees}
                      validation={{ min: 0, max: 1000 }}
                      type="currency"
                      help="Leave as 0 if not applicable"
                      className="sm:col-span-2"
                    />
                  </div>
                </div>

                {/* Mortgage Details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gold-400" />
                    Mortgage Details
                  </h3>
                  
                  <div className="space-y-6">
                    <ValidatedSlider
                      label={`Interest Rate (${formatPercentage(rate)})`}
                      value={rate}
                      onChange={setRate}
                      min={2.0}
                      max={10.0}
                      step={0.05}
                      formatValue={(v) => `${v.toFixed(2)}%`}
                    />

                    <ValidatedInput
                      label="Mortgage Principal"
                      value={principal}
                      onChange={setPrincipal}
                      validation={validationRules.homeValue}
                      type="currency"
                      help="The mortgage amount you're testing for affordability"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Qualification Status */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${pass ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {pass ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <h3 className="text-xl font-bold">Affordability Result</h3>
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold mb-2 ${pass ? 'text-green-400' : 'text-red-400'}`}>
                    {pass ? 'QUALIFIED' : 'NOT QUALIFIED'}
                  </div>
                  <p className={`text-sm ${pass ? 'text-green-200' : 'text-red-200'}`}>
                    {pass 
                      ? 'You meet the affordability requirements for this mortgage amount.'
                      : 'This mortgage amount exceeds affordability guidelines. Consider reducing the principal or improving your debt-to-income ratio.'
                    }
                  </p>
                </div>

                {/* Qualification Metrics */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-6">Qualification Metrics</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-300 block">Stress Test Rate</span>
                      <span className="font-semibold text-lg text-gold-400">{formatPercentage(qualRate)}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-300 block">Monthly P&I</span>
                      <span className="font-semibold text-lg">{formatCurrency(monthlyPI, 0)}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-300 block">GDS Ratio</span>
                      <span className={`font-semibold text-lg ${gds <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(gds, 1)}
                      </span>
                      <span className="text-xs text-gray-400 block">Max: 39%</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-300 block">TDS Ratio</span>
                      <span className={`font-semibold text-lg ${tds <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(tds, 1)}
                      </span>
                      <span className="text-xs text-gray-400 block">Max: 44%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-6">Debt Service Ratios</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">GDS Ratio (max 39%)</span>
                        <span className={`font-semibold ${gds <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(gds, 1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${gds <= 39 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(gds / 39 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">TDS Ratio (max 44%)</span>
                        <span className={`font-semibold ${tds <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(tds, 1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${tds <= 44 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(tds / 44 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/contact"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center"
                  >
                    Get Pre-Approved
                  </Link>
                  <Link 
                    href="/calculators/pre-approval"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    Pre-Approval Calculator
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
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding Affordability</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• <strong>GDS (Gross Debt Service) Ratio:</strong> Housing costs ÷ gross income (max 39%)</p>
                    <p>• <strong>TDS (Total Debt Service) Ratio:</strong> All debts + housing ÷ gross income (max 44%)</p>
                    <p>• <strong>Stress Test:</strong> Qualification rate is higher of contract rate + 2% or 5.25%</p>
                    <p>• Housing costs include: mortgage payment, property tax, heating, and condo fees</p>
                    <p>• These are guidelines - individual lender requirements may vary</p>
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