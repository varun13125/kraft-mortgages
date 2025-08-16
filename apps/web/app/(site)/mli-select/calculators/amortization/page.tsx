"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/mli/Card";
import { pmt, amortizationSchedule } from "@/lib/mli/calcs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Calendar, DollarSign, TrendingDown, BarChart3, Clock, Target } from "lucide-react";

export default function AmortizationPage() {
  const [loan, setLoan] = useState(15000000);
  const [rate, setRate] = useState(4.5);

  const yearsList = [25, 40, 50] as const;
  const payments = yearsList.map(y => ({ 
    years: y, 
    payment: Math.round(pmt(rate, y, loan)),
    total: Math.round(pmt(rate, y, loan) * 12 * y),
    interest: Math.round((pmt(rate, y, loan) * 12 * y) - loan)
  }));
  
  const schedule50 = amortizationSchedule(rate, 50, loan).rows
    .filter(r => r.period % 12 === 0)
    .map(r => ({ 
      year: r.period/12, 
      balance: Math.round(r.balance),
      principal: Math.round(loan - r.balance),
      interest: Math.round((r.period/12) * pmt(rate, 50, loan) * 12 - (loan - r.balance))
    }));

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-gray-900 to-amber-950">
          <div className="absolute inset-0">
            {/* Animated Timeline */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="timeline-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="50" cy="50" r="4" fill="rgba(251, 191, 36, 0.4)" />
                  <circle cx="100" cy="50" r="4" fill="rgba(251, 191, 36, 0.4)" />
                  <circle cx="150" cy="50" r="4" fill="rgba(251, 191, 36, 0.4)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#timeline-pattern)" />
            </svg>
            
            {/* Floating Chart Elements */}
            <div className="absolute top-20 left-10 w-80 h-80">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg opacity-10 transform rotate-12"
                animate={{
                  rotate: [12, 25, 12],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="absolute bottom-10 right-10 w-96 h-96">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full opacity-10"
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
          </div>
        </div>

        <div className="relative z-10 py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8 backdrop-blur-md"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-300 tracking-wider uppercase">Payment Timeline Tool</span>
              <motion.div 
                className="w-2 h-2 bg-orange-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
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
              <span className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                Amortization
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-400 font-light">
                Comparison
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Compare payment schedules across 
              <span className="text-orange-400 font-semibold"> 25, 40, and 50 years</span> with
              <span className="text-amber-400 font-semibold"> interactive balance curves</span>
            </motion.p>

            {/* Key Terms Display */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              {[25, 40, 50].map((years, index) => (
                <motion.div 
                  key={years}
                  className="group relative"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${
                    years === 25 ? 'from-red-600 to-orange-600' :
                    years === 40 ? 'from-orange-600 to-amber-600' :
                    'from-amber-600 to-yellow-600'
                  } rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-gray-700/50">
                    <Clock className={`w-8 h-8 mx-auto mb-2 ${
                      years === 25 ? 'text-red-400' :
                      years === 40 ? 'text-orange-400' :
                      'text-amber-400'
                    }`} />
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Term</div>
                    <div className={`text-3xl font-bold ${
                      years === 25 ? 'text-red-400' :
                      years === 40 ? 'text-orange-400' :
                      'text-amber-400'
                    }`}>{years}yr</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3 mb-8">
            {/* Inputs Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                    <Target className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Loan Details</span>
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
                        className="w-full pl-10 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-500 transition-all duration-200"
                        type="number" 
                        value={loan} 
                        onChange={e=>setLoan(+e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                    <input 
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-gray-500 transition-all duration-200"
                      type="number" 
                      step={0.05} 
                      value={rate} 
                      onChange={e=>setRate(+e.target.value)} 
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="text-sm font-medium text-gray-300 mb-3">Loan Overview</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Principal:</span>
                        <span className="text-orange-400 font-semibold">${(loan / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Rate:</span>
                        <span className="text-amber-400 font-semibold">{rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Payment Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Payment Comparison</span>
                </div>
              }>
                <div className="grid gap-6 md:grid-cols-3">
                  {payments.map((p, index) => (
                    <motion.div 
                      key={p.years}
                      className={`p-5 rounded-xl border ${
                        p.years === 25 ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20' :
                        p.years === 40 ? 'bg-gradient-to-br from-orange-900/20 to-amber-900/20 border-orange-500/20' :
                        'bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-500/20'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                    >
                      <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{p.years} Year Term</div>
                        <div className={`text-2xl font-bold mb-2 ${
                          p.years === 25 ? 'text-red-400' :
                          p.years === 40 ? 'text-orange-400' :
                          'text-amber-400'
                        }`}>
                          ${(p.payment / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-400 mb-3">Monthly Payment</div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Total Cost:</span>
                            <span className="text-gray-300">${(p.total / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Interest:</span>
                            <span className="text-red-400">${(p.interest / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Balance Curve Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
                  <TrendingDown className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">50-Year Balance Curve</span>
              </div>
            }>
              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <AreaChart data={schedule50} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity={0.8} />
                        <stop offset="50%" stopColor="rgb(245, 158, 11)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="rgb(217, 119, 6)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.7)"
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(v)=>`$${(v/1e6).toFixed(1)}M`}
                      stroke="rgba(255,255,255,0.7)"
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(v)=>[`$${Number(v).toLocaleString()}`, "Remaining Balance"]}
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.95)',
                        border: '1px solid rgba(75, 85, 99, 0.5)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      strokeWidth={3} 
                      fill="url(#balanceGradient)" 
                      stroke="rgb(251, 191, 36)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}