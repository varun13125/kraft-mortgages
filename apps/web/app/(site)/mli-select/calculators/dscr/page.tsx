"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/mli/Card";
import { dscrMaxLoan, amortByTier, tierFromPoints } from "@/lib/mli/calcs";
import { TrendingUp, Percent, DollarSign, Clock, Activity, Shield } from "lucide-react";
import TierBadge from "@/components/mli/TierBadge";

export default function DSCRPage() {
  const [noi, setNoi] = useState(1200000);
  const [rate, setRate] = useState(4.5);
  const [points, setPoints] = useState(100);
  const [customYears, setCustomYears] = useState<number | "">("");

  const tier = tierFromPoints(points);
  const defaultYears = amortByTier(tier);
  const years = customYears === "" ? defaultYears : Number(customYears);

  const loan = dscrMaxLoan({ noi, rateAnnual: rate, years, minDcr: 1.10 });
  const annualDebtService = noi / 1.10;
  const monthlyPayment = annualDebtService / 12;
  const coverage = (noi / annualDebtService).toFixed(2);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-gray-900 to-indigo-950">
          <div className="absolute inset-0">
            {/* Animated Chart Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="chart-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" fill="none" />
                  <circle cx="25" cy="25" r="2" fill="rgba(139, 92, 246, 0.5)" />
                  <circle cx="50" cy="50" r="2" fill="rgba(139, 92, 246, 0.5)" />
                  <circle cx="75" cy="25" r="2" fill="rgba(139, 92, 246, 0.5)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#chart-pattern)" />
            </svg>
            
            {/* Floating Data Points */}
            <div className="absolute top-20 left-10 w-64 h-64">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <div className="absolute bottom-10 right-10 w-96 h-96">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full opacity-10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30 mb-8 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-violet-300 tracking-wider uppercase">DSCR Analysis Tool</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                DSCR Max Loan
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-400 font-light">
                Calculator
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Calculate maximum loan amount based on 
              <span className="text-violet-400 font-semibold"> Net Operating Income</span> with
              <span className="text-purple-400 font-semibold"> 1.10 DSCR</span> requirement
            </motion.p>

            {/* Key Metrics Display */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              <motion.div 
                className="group relative"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                  <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Min DSCR</div>
                  <div className="text-3xl font-bold text-violet-400">1.10</div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Max Amort</div>
                  <div className="text-3xl font-bold text-purple-400">40yr</div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Coverage</div>
                  <div className="text-3xl font-bold text-indigo-400">Safe</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
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
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-violet-500/30">
                    <Activity className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">Income Analysis</span>
                </div>
              }>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Net Operating Income (Annual)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={noi} 
                        onChange={e=>setNoi(+e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={rate} 
                        step={0.05} 
                        onChange={e=>setRate(+e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Points</label>
                    <input 
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-gray-500 transition-all duration-200"
                      type="number" 
                      value={points} 
                      onChange={e=>setPoints(+e.target.value)} 
                    />
                    <div className="mt-2">
                      <TierBadge points={points} />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Override Amortization (Years)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        placeholder={`Default: ${defaultYears} years`} 
                        value={customYears as any} 
                        onChange={e=>setCustomYears(e.target.value === "" ? "" : +e.target.value)} 
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Leave blank for tier default ({defaultYears} years)</div>
                  </div>

                  {/* Visual DSCR Indicator */}
                  <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Coverage Ratio</span>
                      <span className="text-violet-400 font-semibold">{coverage}x</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((1.10 / 2) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Min: 1.10</span>
                      <span>Target: 1.25+</span>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">Loan Analysis</span>
                </div>
              }>
                <div className="space-y-6">
                  {/* Maximum Loan */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl border border-violet-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Maximum DSCR Loan</div>
                        <div className="text-3xl font-bold text-violet-400">
                          ${(loan / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Based on 1.10 DSCR requirement</div>
                      </div>
                      <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-violet-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Debt Service */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Annual Debt Service</div>
                        <div className="text-2xl font-bold text-purple-400">
                          ${(annualDebtService / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Monthly: ${(monthlyPayment).toFixed(0).toLocaleString()}</div>
                      </div>
                      <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                        <Activity className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Coverage Analysis */}
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <div className="text-sm font-medium text-gray-300 mb-3">Coverage Breakdown</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Net Operating Income:</span>
                        <span className="text-sm font-semibold text-green-400">+${(noi / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Debt Service:</span>
                        <span className="text-sm font-semibold text-red-400">-${(annualDebtService / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Net Cash Flow:</span>
                          <span className="text-sm font-semibold text-violet-400">${((noi - annualDebtService) / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-gray-800/30 to-gray-800/10 rounded-lg border border-gray-700/30">
                      <div className="text-xs text-gray-500 mb-1">Rate</div>
                      <div className="text-lg font-bold text-indigo-400">{rate}%</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-gray-800/30 to-gray-800/10 rounded-lg border border-gray-700/30">
                      <div className="text-xs text-gray-500 mb-1">Amort</div>
                      <div className="text-lg font-bold text-blue-400">{years}yr</div>
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