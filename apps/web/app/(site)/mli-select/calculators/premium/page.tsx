"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/mli/Card";
import TierBadge from "@/components/mli/TierBadge";
import { tierFromPoints, premiumDiscountFor } from "@/lib/mli/calcs";
import { DollarSign, Percent, TrendingDown, PiggyBank, Award, Calculator } from "lucide-react";

export default function PremiumPage() {
  const [loan, setLoan] = useState(15000000);
  const [basePremium, setBasePremium] = useState(3.85);
  const [points, setPoints] = useState(100);

  const tier = tierFromPoints(points);
  const discount = premiumDiscountFor(tier);
  const finalPremium = basePremium * (1 - discount);
  const savings = loan * (basePremium - finalPremium) / 100;
  const baseCost = loan * basePremium / 100;
  const finalCost = loan * finalPremium / 100;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-900 to-emerald-950">
          <div className="absolute inset-0">
            {/* Animated Money Flow */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="money-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="8" fill="rgba(34, 197, 94, 0.3)" />
                  <circle cx="75" cy="75" r="12" fill="rgba(34, 197, 94, 0.4)" />
                  <circle cx="120" cy="120" r="6" fill="rgba(34, 197, 94, 0.3)" />
                  <path d="M30 30 Q50 50, 75 75 T120 120" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="2" fill="none" strokeDasharray="3,3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#money-pattern)" />
            </svg>
            
            {/* Floating Discount Badges */}
            <div className="absolute top-20 left-10 w-64 h-64">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full opacity-10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <div className="absolute bottom-10 right-10 w-80 h-80">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg opacity-10 transform rotate-45"
                animate={{
                  rotate: [45, 90, 45],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-8 backdrop-blur-md"
            >
              <PiggyBank className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-300 tracking-wider uppercase">Savings Calculator</span>
              <motion.div 
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </motion.div>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Premium
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
              Calculate your <span className="text-green-400 font-semibold">CMHC premium discounts</span> and
              <span className="text-emerald-400 font-semibold"> total savings</span> based on tier level
            </motion.p>

            {/* Discount Tiers Display */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              {[
                { tier: 1, discount: 0, color: "from-gray-600 to-gray-700", text: "text-gray-400" },
                { tier: 2, discount: 10, color: "from-green-600 to-emerald-600", text: "text-green-400" },
                { tier: 3, discount: 25, color: "from-emerald-600 to-teal-600", text: "text-emerald-400" },
              ].map((item, index) => (
                <motion.div 
                  key={item.tier}
                  className="group relative"
                  whileHover={{ scale: 1.05, rotate: item.tier === 3 ? 2 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                    <Award className={`w-8 h-8 mx-auto mb-2 ${item.text}`} />
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Tier {item.tier}</div>
                    <div className={`text-3xl font-bold ${item.text}`}>{item.discount}%</div>
                    <div className="text-xs text-gray-400 mt-1">Discount</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

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
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                    <Calculator className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Loan Details</span>
                </div>
              }>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Loan Amount ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={loan} 
                        onChange={e=>setLoan(+e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base Premium Rate (%)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        step={0.05} 
                        value={basePremium} 
                        onChange={e=>setBasePremium(+e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Points</label>
                    <input 
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 placeholder-gray-500 transition-all duration-200"
                      type="number" 
                      value={points} 
                      onChange={e=>setPoints(+e.target.value)} 
                    />
                    <div className="mt-2">
                      <TierBadge points={points} />
                    </div>
                  </div>

                  {/* Premium Overview */}
                  <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="text-sm font-medium text-gray-300 mb-3">Premium Breakdown</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Base Rate:</span>
                        <span className="text-red-400 font-semibold">{basePremium}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-green-400 font-semibold">-{(discount * 100).toFixed(0)}%</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Final Rate:</span>
                          <span className="text-emerald-400 font-semibold">{finalPremium.toFixed(2)}%</span>
                        </div>
                      </div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Savings Analysis</span>
                </div>
              }>
                <div className="space-y-6">
                  {/* Total Savings */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Total Premium Savings</div>
                        <div className="text-3xl font-bold text-green-400">
                          ${(savings / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Tier {tier} discount applied</div>
                      </div>
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <PiggyBank className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Premium Costs */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Base Premium</div>
                        <div className="text-xl font-bold text-red-400">
                          ${(baseCost / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-400">{basePremium}%</div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="p-4 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Final Premium</div>
                        <div className="text-xl font-bold text-emerald-400">
                          ${(finalCost / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-400">{finalPremium.toFixed(2)}%</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Visual Savings Bar */}
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <div className="text-sm font-medium text-gray-300 mb-3">Savings Visualization</div>
                    <div className="flex h-6 rounded-lg overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-xs font-semibold text-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${((baseCost - savings) / baseCost) * 100}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      >
                        {((baseCost - savings) / baseCost) * 100 >= 30 && 'Final Cost'}
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xs font-semibold text-gray-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${(savings / baseCost) * 100}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                      >
                        {(savings / baseCost) * 100 >= 15 && 'Savings'}
                      </motion.div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>You Pay: ${(finalCost / 1000).toFixed(0)}K</span>
                      <span>You Save: ${(savings / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-gray-800/30 to-gray-800/10 rounded-lg border border-gray-700/30">
                      <div className="text-xs text-gray-500 mb-1">Discount</div>
                      <div className="text-lg font-bold text-green-400">{(discount * 100).toFixed(0)}%</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-gray-800/30 to-gray-800/10 rounded-lg border border-gray-700/30">
                      <div className="text-xs text-gray-500 mb-1">Tier</div>
                      <div className="text-lg font-bold text-emerald-400">{tier}</div>
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