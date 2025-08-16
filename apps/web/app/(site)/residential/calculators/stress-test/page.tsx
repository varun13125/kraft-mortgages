"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Shield, Home, Calculator, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StressTestCalculator() {
  const [income, setIncome] = useState(120000);
  const [debts, setDebts] = useState(6000);
  const [propTax, setPropTax] = useState(3000);
  const [heat, setHeat] = useState(1200);
  const [condoFees, setCondoFees] = useState(0);
  const [contractRate, setContractRate] = useState(5.35);
  const [principal, setPrincipal] = useState(650000);

  // Stress test rate (contract rate + 2% or 5.25%, whichever is higher)
  const stressRate = useMemo(() => Math.max(contractRate + 2, 5.25), [contractRate]);
  
  // Monthly payment calculation at stress test rate
  const monthlyRate = stressRate / 100 / 12;
  const numPayments = 25 * 12; // 25 year amortization
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);

  const housingCosts = monthlyPayment + propTax/12 + heat/12 + condoFees;
  const gds = (housingCosts * 12) / income * 100;
  const tds = ((housingCosts * 12) + debts) / income * 100;
  
  const passesStressTest = gds <= 39 && tds <= 44;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/residential" className="text-gray-400 hover:text-blue-400 transition-colors">Residential Lending</Link>
              <span className="text-gray-600">›</span>
              <span className="text-blue-400">Stress Test Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-6">
                <Shield className="w-4 h-4" />
                Mortgage Stress Test
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Stress Test</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Test your mortgage qualification at higher rates to ensure you can handle potential rate increases.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Mortgage Stress Test</h2>
              
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Household Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Other Debts
                  </label>
                  <input
                    type="number"
                    value={debts}
                    onChange={(e) => setDebts(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Contract Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={contractRate}
                    onChange={(e) => setContractRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Mortgage Principal
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Property Tax
                  </label>
                  <input
                    type="number"
                    value={propTax}
                    onChange={(e) => setPropTax(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Annual Heating Costs
                  </label>
                  <input
                    type="number"
                    value={heat}
                    onChange={(e) => setHeat(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Stress Test Results</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Stress Test Rate</div>
                    <div className="text-2xl font-bold text-blue-400">{stressRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">Contract rate + 2% or 5.25% min</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Payment (Stress)</div>
                    <div className="text-2xl font-bold text-blue-400">${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div className="text-xs text-gray-500">At stress test rate</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">GDS Ratio</div>
                    <div className={`text-2xl font-bold ${gds <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                      {gds.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Max 39%</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">TDS Ratio</div>
                    <div className={`text-2xl font-bold ${tds <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                      {tds.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Max 44%</div>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg border ${passesStressTest ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {passesStressTest ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${passesStressTest ? 'text-green-400' : 'text-red-400'}`}>
                        {passesStressTest ? 'Passes Stress Test' : 'Fails Stress Test'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {passesStressTest 
                          ? 'You qualify for this mortgage at the stress test rate'
                          : 'You may need to reduce the mortgage amount or improve your financial position'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/calculators/affordability"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href="/calculators/payment"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link 
                  href="/residential"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Back to Residential
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}