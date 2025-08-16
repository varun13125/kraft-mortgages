"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Hammer, Calculator, DollarSign, AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function ConstructionBudgetCalculator() {
  // Land and Development
  const [landCost, setLandCost] = useState(500000);
  const [sitePrepCost, setSitePrepCost] = useState(75000);
  const [servicing, setServicing] = useState(50000);
  
  // Construction Costs
  const [hardCosts, setHardCosts] = useState(1200000);
  const [softCosts, setSoftCosts] = useState(150000);
  const [contingency, setContingency] = useState(10); // percentage
  
  // Financing
  const [constructionRate, setConstructionRate] = useState(7.5);
  const [constructionTerm, setConstructionTerm] = useState(12); // months
  const [takeOutRate, setTakeOutRate] = useState(5.75);
  const [ltv, setLtv] = useState(75);
  
  // Timeline
  const [constructionPeriod, setConstructionPeriod] = useState(10); // months
  
  // Calculated values
  const totalLandCosts = landCost + sitePrepCost + servicing;
  const totalConstructionCosts = hardCosts + softCosts;
  const contingencyAmount = (totalConstructionCosts * contingency) / 100;
  const totalProjectCost = totalLandCosts + totalConstructionCosts + contingencyAmount;
  
  // Financing calculations
  const maxLoanAmount = (totalProjectCost * ltv) / 100;
  const requiredEquity = totalProjectCost - maxLoanAmount;
  const equityPercentage = (requiredEquity / totalProjectCost) * 100;
  
  // Construction loan interest (simplified - assumes 50% average advance)
  const averageBalance = maxLoanAmount * 0.5; // Assumes progressive draws
  const monthlyConstructionRate = constructionRate / 100 / 12;
  const constructionInterest = averageBalance * monthlyConstructionRate * constructionPeriod;
  
  // Total project cost including financing
  const totalCostWithFinancing = totalProjectCost + constructionInterest;
  
  // Profitability analysis (if selling)
  const [sellingPrice, setSellingPrice] = useState(2100000);
  const grossProfit = sellingPrice - totalCostWithFinancing;
  const profitMargin = (grossProfit / sellingPrice) * 100;
  
  // Cash flow timing
  const landEquityRequired = totalLandCosts;
  const constructionEquityRequired = requiredEquity - landEquityRequired;
  
  // Risk assessment
  const isViableProject = profitMargin >= 15 && equityPercentage <= 30;
  const hasAdequateContingency = contingency >= 10;
  const reasonableTimeline = constructionPeriod <= 12;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/construction" className="text-gray-400 hover:text-orange-400 transition-colors">Construction Financing</Link>
              <span className="text-gray-600">›</span>
              <span className="text-orange-400">Budget Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-6">
                <Hammer className="w-4 h-4" />
                Construction Budget Planning
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Construction Budget</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Plan your construction project with comprehensive budgeting and financing analysis.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Construction Budget Analysis</h2>
              
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column - Inputs */}
                <div className="space-y-6">
                  {/* Land & Development */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4">Land & Development</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Land Cost
                        </label>
                        <input
                          type="number"
                          value={landCost}
                          onChange={(e) => setLandCost(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Site Preparation
                        </label>
                        <input
                          type="number"
                          value={sitePrepCost}
                          onChange={(e) => setSitePrepCost(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Servicing & Utilities
                        </label>
                        <input
                          type="number"
                          value={servicing}
                          onChange={(e) => setServicing(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Construction Costs */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4">Construction Costs</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Hard Costs (Materials & Labor)
                        </label>
                        <input
                          type="number"
                          value={hardCosts}
                          onChange={(e) => setHardCosts(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Soft Costs (Permits, Professional Fees)
                        </label>
                        <input
                          type="number"
                          value={softCosts}
                          onChange={(e) => setSoftCosts(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Contingency (%)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={contingency}
                          onChange={(e) => setContingency(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financing */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4">Financing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Construction Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          value={constructionRate}
                          onChange={(e) => setConstructionRate(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Loan-to-Value (%)
                        </label>
                        <input
                          type="number"
                          value={ltv}
                          onChange={(e) => setLtv(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Construction Period (Months)
                        </label>
                        <input
                          type="number"
                          value={constructionPeriod}
                          onChange={(e) => setConstructionPeriod(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Value */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4">Project Value</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Expected Selling Price
                      </label>
                      <input
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                  {/* Cost Breakdown */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Cost Breakdown</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Land & Development:</span>
                        <span className="text-white font-semibold">${totalLandCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Construction Costs:</span>
                        <span className="text-white font-semibold">${totalConstructionCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contingency ({contingency}%):</span>
                        <span className="text-white font-semibold">${contingencyAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Construction Interest:</span>
                        <span className="text-orange-400 font-semibold">${constructionInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-300">Total Project Cost:</span>
                        <span className="text-orange-400 font-bold text-lg">${totalCostWithFinancing.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financing Summary */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Financing Summary</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Maximum Loan</div>
                        <div className="text-xl font-bold text-orange-400">
                          ${maxLoanAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{ltv}% LTV</div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Required Equity</div>
                        <div className="text-xl font-bold text-orange-400">
                          ${requiredEquity.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{equityPercentage.toFixed(1)}% of total</div>
                      </div>
                    </div>
                  </div>

                  {/* Profitability Analysis */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Profitability Analysis</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Selling Price:</span>
                        <span className="text-green-400 font-semibold">${sellingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Project Cost:</span>
                        <span className="text-red-400 font-semibold">${totalCostWithFinancing.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="text-gray-300">Gross Profit:</span>
                        <span className={`font-bold text-lg ${grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${grossProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Profit Margin:</span>
                        <span className={`font-semibold ${profitMargin >= 15 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitMargin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className={`p-4 rounded-lg border ${isViableProject ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                    <div className="flex items-center gap-3">
                      {isViableProject ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                      )}
                      <div>
                        <div className={`font-semibold ${isViableProject ? 'text-green-400' : 'text-orange-400'}`}>
                          {isViableProject ? 'Viable Construction Project' : 'Project Requires Review'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {isViableProject 
                            ? `Strong profit margin (${profitMargin.toFixed(1)}%) with manageable equity requirement`
                            : `Consider: ${profitMargin < 15 ? 'Low profit margin' : ''} ${equityPercentage > 30 ? 'High equity requirement' : ''}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Risk Factors */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Risk Assessment</h3>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${hasAdequateContingency ? 'text-green-400' : 'text-red-400'}`}>
                        {hasAdequateContingency ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        <span className="text-sm">Contingency: {contingency}% {hasAdequateContingency ? '(Adequate)' : '(Consider 10%+)'}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${reasonableTimeline ? 'text-green-400' : 'text-orange-400'}`}>
                        {reasonableTimeline ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        <span className="text-sm">Timeline: {constructionPeriod} months {reasonableTimeline ? '(Reasonable)' : '(Extended)'}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${equityPercentage <= 30 ? 'text-green-400' : 'text-orange-400'}`}>
                        {equityPercentage <= 30 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        <span className="text-sm">Equity Requirement: {equityPercentage.toFixed(1)}% {equityPercentage <= 30 ? '(Manageable)' : '(High)'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Link 
                  href={"/calculators/payment" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link 
                  href={"/construction" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Hammer className="w-4 h-4" />
                  Back to Construction
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}