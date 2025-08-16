"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/mli/Card";
import { breakEvenRentPerUnit, pmt } from "@/lib/mli/calcs";
import { DollarSign, Home, TrendingUp, Building, Calculator, Target, BarChart3 } from "lucide-react";

export default function BreakEvenPage() {
  const [loan, setLoan] = useState(15000000);
  const [rate, setRate] = useState(4.5);
  const [amort, setAmort] = useState(40);
  const [units, setUnits] = useState(100);
  const [otherOpex, setOtherOpex] = useState(50000);
  const [margin, setMargin] = useState(0.15);

  const monthlyPayment = pmt(rate, amort, loan);
  const breakEvenRent = breakEvenRentPerUnit({
    monthlyDebtService: monthlyPayment,
    otherMonthlyOpex: otherOpex,
    units,
    targetMargin: margin
  });

  const totalRentalIncome = breakEvenRent * units;
  const totalExpenses = monthlyPayment + otherOpex;
  const netCashFlow = totalRentalIncome - totalExpenses;
  const cashOnCashReturn = (netCashFlow * 12) / (loan * 0.15); // Assume 15% down

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-gray-900 to-orange-950">
          <div className="absolute inset-0">
            {/* Animated Building Silhouettes */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="building-pattern" x="0" y="0" width="300" height="200" patternUnits="userSpaceOnUse">
                  <rect x="20" y="120" width="40" height="80" fill="rgba(239, 68, 68, 0.3)" />
                  <rect x="80" y="100" width="50" height="100" fill="rgba(239, 68, 68, 0.4)" />
                  <rect x="150" y="110" width="45" height="90" fill="rgba(239, 68, 68, 0.3)" />
                  <rect x="220" y="130" width="35" height="70" fill="rgba(239, 68, 68, 0.2)" />
                  {/* Windows */}
                  <rect x="25" y="125" width="8" height="8" fill="rgba(251, 191, 36, 0.6)" />
                  <rect x="45" y="125" width="8" height="8" fill="rgba(251, 191, 36, 0.6)" />
                  <rect x="85" y="105" width="8" height="8" fill="rgba(251, 191, 36, 0.6)" />
                  <rect x="105" y="105" width="8" height="8" fill="rgba(251, 191, 36, 0.6)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#building-pattern)" />
            </svg>
            
            {/* Floating Calculation Elements */}
            <div className="absolute top-20 left-10 w-72 h-72">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl opacity-10 transform rotate-12"
                animate={{
                  rotate: [12, 25, 12],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="absolute bottom-10 right-10 w-80 h-80">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 20,
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
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 mb-8 backdrop-blur-md"
            >
              <BarChart3 className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-300 tracking-wider uppercase">Break-Even Analysis</span>
              <motion.div 
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [1, 0.3, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-red-200 via-orange-200 to-amber-200 bg-clip-text text-transparent">
                Break-Even
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-400 font-light">
                Rent Calculator
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Calculate the <span className="text-red-400 font-semibold">minimum rent per unit</span> needed to
              <span className="text-orange-400 font-semibold"> cover all expenses</span> and achieve target margins
            </motion.p>

            {/* Key Metrics Display */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              {[
                { label: "Debt Service", icon: DollarSign, color: "text-red-400", bg: "from-red-600 to-orange-600" },
                { label: "Operating Costs", icon: Building, color: "text-orange-400", bg: "from-orange-600 to-amber-600" },
                { label: "Target Margin", icon: Target, color: "text-amber-400", bg: "from-amber-600 to-yellow-600" },
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="group relative"
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.bg} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                    <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
                    <div className={`text-2xl font-bold ${item.color}`}>✓</div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                    <Calculator className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">Property Inputs</span>
                </div>
              }>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Loan Amount ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                        </div>
                        <input 
                          className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500 placeholder-gray-500 transition-all duration-200"
                          type="number" 
                          value={loan} 
                          onChange={e=>setLoan(+e.target.value)} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                      <input 
                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        step={0.05} 
                        value={rate} 
                        onChange={e=>setRate(+e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amortization (years)</label>
                      <input 
                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={amort} 
                        onChange={e=>setAmort(+e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Total Units</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-500" />
                        </div>
                        <input 
                          className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 placeholder-gray-500 transition-all duration-200"
                          type="number" 
                          value={units} 
                          onChange={e=>setUnits(+e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Operating Expenses ($)</label>
                    <input 
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500 placeholder-gray-500 transition-all duration-200"
                      type="number" 
                      value={otherOpex} 
                      onChange={e=>setOtherOpex(+e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Margin (%)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Target className="h-5 w-5 text-gray-500" />
                      </div>
                      <input 
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        step={0.01} 
                        value={margin * 100} 
                        onChange={e=>setMargin(+e.target.value / 100)} 
                      />
                    </div>
                  </div>

                  {/* Monthly Payment Preview */}
                  <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="text-sm font-medium text-gray-300 mb-3">Monthly Debt Service</div>
                    <div className="text-2xl font-bold text-red-400">
                      ${monthlyPayment.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {rate}% over {amort} years
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
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Break-Even Analysis</span>
                </div>
              }>
                <div className="space-y-6">
                  {/* Break-Even Rent */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Break-Even Rent per Unit</div>
                        <div className="text-3xl font-bold text-red-400">
                          ${breakEvenRent.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Monthly rent required</div>
                      </div>
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <Home className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Total Income */}
                  <motion.div 
                    className="p-5 bg-gradient-to-br from-orange-900/20 to-amber-900/20 rounded-xl border border-orange-500/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Total Monthly Income</div>
                        <div className="text-2xl font-bold text-orange-400">
                          ${totalRentalIncome.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{units} units × ${breakEvenRent.toFixed(0)}</div>
                      </div>
                      <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Expense Breakdown */}
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <div className="text-sm font-medium text-gray-300 mb-3">Monthly Expense Breakdown</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Debt Service:</span>
                        <span className="text-sm font-semibold text-red-400">${monthlyPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Operating Expenses:</span>
                        <span className="text-sm font-semibold text-orange-400">${otherOpex.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Total Expenses:</span>
                          <span className="text-sm font-semibold text-yellow-400">${totalExpenses.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Net Cash Flow:</span>
                          <span className="text-sm font-semibold text-green-400">${netCashFlow.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Breakdown */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-lg border border-red-700/30">
                      <div className="text-xs text-gray-500 mb-1">Debt %</div>
                      <div className="text-lg font-bold text-red-400">
                        {((monthlyPayment / totalRentalIncome) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-900/20 to-orange-800/10 rounded-lg border border-orange-700/30">
                      <div className="text-xs text-gray-500 mb-1">OpEx %</div>
                      <div className="text-lg font-bold text-orange-400">
                        {((otherOpex / totalRentalIncome) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-lg border border-green-700/30">
                      <div className="text-xs text-gray-500 mb-1">Margin %</div>
                      <div className="text-lg font-bold text-green-400">
                        {(margin * 100).toFixed(0)}%
                      </div>
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