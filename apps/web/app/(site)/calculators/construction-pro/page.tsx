"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { interestOnlyCost } from "@/lib/calc/construction";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Hammer, Calculator, Plus, Trash2, ArrowRight, Clock, DollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ConstructionPro() {
  const [rate, setRate] = useState(7.25);
  const [draws, setDraws] = useState([
    { month: 1, amount: 200000 }, 
    { month: 4, amount: 250000 }, 
    { month: 7, amount: 300000 }
  ] as {month: number, amount: number}[]);
  
  const result = useMemo(() => interestOnlyCost({ draws, annualRatePct: rate }), [draws, rate]);
  
  const totalProjectCost = draws.reduce((sum, draw) => sum + draw.amount, 0);

  const addDraw = () => {
    const lastMonth = draws.at(-1)?.month || 1;
    setDraws(prev => [...prev, { month: lastMonth + 1, amount: 100000 }]);
  };

  const removeDraw = (index: number) => {
    if (draws.length > 1) {
      setDraws(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDraw = (index: number, field: 'month' | 'amount', value: number) => {
    setDraws(prev => prev.map((draw, i) => 
      i === index ? { ...draw, [field]: value } : draw
    ));
  };

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
              <span className="text-gold-400">Construction Pro Calculator</span>
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
                <Hammer className="w-4 h-4" />
                Construction Financing
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Construction Pro</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate interest costs for construction projects with progressive draw schedules and interest-only payments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Construction Cost Analysis</h2>
              
              <div className="mb-6">
                <ComplianceBanner feature="CALC_CONSTRUCTION" />
              </div>

              {/* Construction Rate */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Construction Interest Rate (% APR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="7.25"
                />
              </div>

              {/* Draw Schedule */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">Progressive Draw Schedule</h3>
                  <button
                    onClick={addDraw}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Draw
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-400 px-2">
                    <div>Month</div>
                    <div>Draw Amount</div>
                    <div>Action</div>
                  </div>
                  
                  {draws.map((draw, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-3 gap-4 items-center bg-gray-700/30 rounded-lg p-3"
                    >
                      <input
                        type="number"
                        value={draw.month}
                        onChange={(e) => updateDraw(index, 'month', Number(e.target.value))}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Month"
                        min="1"
                      />
                      <input
                        type="number"
                        value={draw.amount}
                        onChange={(e) => updateDraw(index, 'amount', Number(e.target.value))}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Amount"
                        min="0"
                      />
                      <button
                        onClick={() => removeDraw(index)}
                        disabled={draws.length <= 1}
                        className="inline-flex items-center justify-center p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Construction Cost Analysis</h3>
                
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Project Cost</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${totalProjectCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">All draws combined</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Interest During Construction</div>
                    <div className="text-2xl font-bold text-red-400">
                      ${result.totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-500">Interest-only period</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Construction Period</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {Math.max(...draws.map(d => d.month))} months
                    </div>
                    <div className="text-xs text-gray-500">Based on final draw</div>
                  </div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <div>
                      <div className="font-semibold text-orange-400">Important Construction Financing Notes</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Interest calculations assume interest-only payments during construction. Final costs depend on lender-specific draw timing, compounding methods, and additional fees.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Disclaimer:</strong> This calculator provides estimates only. Actual construction loan terms, draw schedules, and interest calculations vary by lender. Consult with your construction loan specialist for precise projections.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Construction Financing Essentials</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Progressive Draws</div>
                    <p>Funds are released in stages as construction milestones are completed. Interest only accrues on funds drawn, not the total loan amount.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Interest-Only Period</div>
                    <p>During construction, you typically pay only interest on drawn funds. Upon completion, the loan converts to a traditional amortizing mortgage.</p>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/calculators/payment" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link 
                  href={"/private-lending/calculators/hard-money" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Hard Money Calculator
                </Link>
                <Link 
                  href={"/calculators" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  All Calculators
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}