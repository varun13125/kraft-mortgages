"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/mli/Card";
import TierBadge from "@/components/mli/TierBadge";
import { tierFromPoints, maxLoanFromValueOrCost, leverageFor } from "@/lib/mli/calcs";
import { DollarSign, Building2, TrendingUp, PiggyBank, Calculator, Target } from "lucide-react";

export default function MaxLoanPage() {
  const [valueOrCost, setValueOrCost] = useState(20000000);
  const [projectType, setProjectType] = useState<"new"|"existing">("new");
  const [points, setPoints] = useState(100);

  const tier = tierFromPoints(points);
  const leverage = leverageFor(projectType === "new", tier);
  const maxLoan = maxLoanFromValueOrCost(projectType === "new", tier, valueOrCost);
  const equityRequired = valueOrCost - maxLoan;
  const equityPercent = (equityRequired / valueOrCost) * 100;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-900 to-teal-950">
          <div className="absolute inset-0">
            {/* Floating Geometric Shapes */}
            <div className="absolute top-10 left-20 w-72 h-72">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl transform rotate-45 opacity-10 animate-float"></div>
            </div>
            <div className="absolute bottom-10 right-20 w-96 h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-10 animate-float-delayed"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl transform rotate-12 opacity-10 animate-float-slow"></div>
            </div>
          </div>
          {/* Animated Lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(14, 165, 233)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,200 Q400,100 800,200 T1600,200"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M0,400 Q400,300 800,400 T1600,400"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        <div className="relative z-10 py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-8 backdrop-blur-md"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300 tracking-wider uppercase">Financing Calculator</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent">
                Maximum Loan
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-400 font-light">
                & Equity Calculator
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Determine your <span className="text-emerald-400 font-semibold">maximum financing</span> based on
              <span className="text-cyan-400 font-semibold"> project value</span> and
              <span className="text-teal-400 font-semibold"> tier level</span>
            </motion.p>

            {/* Interactive Leverage Display */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mt-10"
            >
              {[
                { tier: 1, leverage: projectType === "new" ? 85 : 85, color: "from-amber-600 to-orange-600" },
                { tier: 2, leverage: projectType === "new" ? 90 : 85, color: "from-emerald-600 to-teal-600" },
                { tier: 3, leverage: projectType === "new" ? 95 : 85, color: "from-cyan-600 to-blue-600" },
              ].map((item) => (
                <motion.div 
                  key={item.tier}
                  className="group relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tier {item.tier}</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{item.leverage}%</div>
                      <div className="text-xs text-gray-400 mt-1">Max LTV</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-30px) rotate(45deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite;
          animation-delay: 3s;
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
          animation-delay: 6s;
        }
      `}</style>

      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Project Details</span>
                </div>
              }>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Value/Cost ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={valueOrCost} 
                        onChange={e=>setValueOrCost(+e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                    <div className="relative">
                      <select 
                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                        value={projectType} 
                        onChange={e=>setProjectType(e.target.value as any)}
                      >
                        <option value="new">New Construction</option>
                        <option value="existing">Existing Property</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Points</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Target className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={points} 
                        onChange={e=>setPoints(+e.target.value)} 
                      />
                    </div>
                    <div className="mt-2">
                      <TierBadge points={points} />
                    </div>
                  </div>

                  {/* Visual Leverage Indicator */}
                  <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Loan-to-Value Ratio</span>
                      <span className="text-emerald-400 font-semibold">{(leverage * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${leverage * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Financing Analysis</span>
                </div>
              }>
                <div className="space-y-6">
                  {/* Max Loan Amount */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Maximum Loan Amount</div>
                        <div className="text-3xl font-bold text-emerald-400">
                          ${(maxLoan / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{(leverage * 100).toFixed(0)}% of project value</div>
                      </div>
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Required Equity */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Required Equity</div>
                        <div className="text-3xl font-bold text-cyan-400">
                          ${(equityRequired / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{equityPercent.toFixed(0)}% of project value</div>
                      </div>
                      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                        <PiggyBank className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Financing Split Visualization */}
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <div className="text-sm font-medium text-gray-300 mb-3">Financing Structure</div>
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-semibold text-gray-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${leverage * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        {leverage * 100 >= 20 && `Loan ${(leverage * 100).toFixed(0)}%`}
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-semibold text-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${equityPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      >
                        {equityPercent >= 20 && `Equity ${equityPercent.toFixed(0)}%`}
                      </motion.div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>Total Project Value:</span>
                      <span className="text-gray-400 font-semibold">${(valueOrCost / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}