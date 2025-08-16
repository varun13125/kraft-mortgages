"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCard from "@/components/mli/AnimatedCard";
import TierBadge from "@/components/mli/TierBadge";
import Breadcrumb from "@/components/Breadcrumb";
import {
  affordabilityPoints,
  energyPoints,
  accessibilityPoints,
  totalPointsCalc,
  tierFromPoints,
  amortByTier,
  leverageFor,
  maxLoanFromValueOrCost,
  pmt,
} from "@/lib/mli/calcs";
import { downloadCSV, downloadJSON } from "@/lib/mli/export";
import { 
  Calculator, 
  Home, 
  Zap, 
  Accessibility, 
  TrendingUp, 
  Award,
  DollarSign,
  BarChart3,
  FileText,
  Download,
  Save,
  Sparkles
} from "lucide-react";

export default function EnhancedPointsPage() {
  const [name, setName] = useState("Scenario A");
  const [projectType, setProjectType] = useState<"new"|"existing">("new");
  const [units, setUnits] = useState(100);
  const [affUnits, setAffUnits] = useState(25);
  const [affYears, setAffYears] = useState(10);
  const [energyPct, setEnergyPct] = useState(25);

  const [visitAll, setVisitAll] = useState(true);
  const [commons, setCommons] = useState(true);
  const [accPct, setAccPct] = useState(15);
  const [udPct, setUdPct] = useState(0);
  const [rhf, setRhf] = useState(0);

  const pctAff = units ? (affUnits / units) * 100 : 0;
  const aPts = affordabilityPoints(projectType === "new", pctAff, affYears);
  const ePts = energyPoints(energyPct);
  const accPts = accessibilityPoints({
    visitableAll: visitAll,
    commonsBarrierFree: commons,
    pctAccessible: accPct,
    pctUniversal: udPct,
    rhfScore: rhf
  });
  const total = totalPointsCalc(aPts, ePts, accPts);
  const tier = tierFromPoints(total);
  const amort = amortByTier(tier);
  const leverage = leverageFor(projectType === "new", tier);

  const snapshot = {
    name, projectType, units, affUnits, affYears, energyPct, visitAll, commons, accPct, udPct, rhf,
    points: { affordability: aPts, energy: ePts, accessibility: accPts, total, tier, amort, leverage }
  };

  function saveScenario() {
    const key = "mli:scenarios";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift({ ...snapshot, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 24)));
    alert("Saved.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Ultra Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        {/* Multiple Animated Layers */}
        <div className="absolute inset-0">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          
          {/* Animated Aurora Effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-transparent to-amber-500/10 animate-aurora"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-orange-500/10 via-transparent to-gold-500/10 animate-aurora-reverse"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 20
                }}
                animate={{ 
                  y: -20,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
          
          {/* Hexagon Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse">
                  <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" 
                           fill="none" 
                           stroke="rgba(245, 158, 11, 0.2)" 
                           strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Breadcrumb items={[
                { label: "MLI Select", href: "/mli-select" },
                { label: "Calculators", href: "/mli-select/calculators" },
                { label: "Points & Tier" }
              ]} />
            </motion.div>
            
            <div className="text-center">
              {/* Animated Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="inline-block mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-amber-500 blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative inline-flex items-center gap-3 rounded-full px-6 py-3 bg-gradient-to-r from-gold-500/20 to-amber-500/20 border border-gold-500/30 backdrop-blur-xl">
                    <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
                    <span className="text-sm font-bold text-gold-400 tracking-wider uppercase">CMHC • MLI SELECT PROGRAM</span>
                    <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
                  </div>
                </div>
              </motion.div>
              
              {/* Animated Title */}
              <motion.h1 
                className="text-6xl sm:text-8xl font-black tracking-tight mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-gold-400 via-amber-400 to-orange-400 blur-xl opacity-50 animate-pulse"></span>
                  <span className="relative bg-gradient-to-r from-gold-200 via-amber-200 to-gold-200 bg-clip-text text-transparent">
                    Points & Tier
                  </span>
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-300 font-light mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Advanced MLI Calculator
              </motion.p>
              
              {/* Interactive Score Preview */}
              <motion.div 
                className="flex flex-wrap justify-center gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { label: "Affordability", value: aPts, max: 50, color: "gold", icon: <Home className="w-6 h-6" /> },
                  { label: "Energy", value: ePts, max: 30, color: "green", icon: <Zap className="w-6 h-6" /> },
                  { label: "Accessibility", value: accPts, max: 20, color: "blue", icon: <Accessibility className="w-6 h-6" /> }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className={`w-32 h-32 relative bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 rounded-2xl border border-${item.color}-500/30 backdrop-blur-xl overflow-hidden`}>
                      {/* Progress Circle */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={`url(#gradient-${item.label})`}
                          strokeWidth="8"
                          strokeDasharray={`${(item.value / item.max) * 352} 352`}
                          initial={{ strokeDasharray: "0 352" }}
                          animate={{ strokeDasharray: `${(item.value / item.max) * 352} 352` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                        <defs>
                          <linearGradient id={`gradient-${item.label}`}>
                            <stop offset="0%" stopColor={item.color === "gold" ? "#f59e0b" : item.color === "green" ? "#10b981" : "#3b82f6"} />
                            <stop offset="100%" stopColor={item.color === "gold" ? "#fbbf24" : item.color === "green" ? "#34d399" : "#60a5fa"} />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`text-${item.color}-400 mb-1`}>
                          {item.icon}
                        </div>
                        <motion.div 
                          className="text-2xl font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                        >
                          {item.value}
                        </motion.div>
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Total Score */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-amber-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-gold-500/30 to-amber-600/30 rounded-2xl border border-gold-500/50 backdrop-blur-xl flex flex-col items-center justify-center">
                      <Award className="w-8 h-8 text-gold-400 mb-1" />
                      <div className="text-3xl font-black text-gold-400">{total}</div>
                      <div className="text-xs text-gray-300 font-semibold">TOTAL POINTS</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calculator Section with Advanced Cards */}
      <section className="relative pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Inputs Card */}
            <AnimatedCard
              title="Project Configuration"
              icon={<Calculator className="w-6 h-6 text-gold-400" />}
              delay={0.1}
              gradient="from-gray-800/70 to-gray-900/70"
              glow={true}
            >
              <div className="space-y-6">
                {/* Scenario Name with Animation */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Scenario Name
                  </label>
                  <input 
                    className="w-full rounded-xl border border-gray-600 bg-gray-700/50 text-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder-gray-500 transition-all duration-300 hover:bg-gray-700/70" 
                    value={name} 
                    onChange={e=>setName(e.target.value)} 
                    placeholder="My scenario" 
                  />
                </motion.div>

                {/* Project Type with Visual Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Project Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["new", "existing"].map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProjectType(type as "new" | "existing")}
                        className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                          projectType === type
                            ? "bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 shadow-lg shadow-gold-500/30"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600"
                        }`}
                      >
                        {type === "new" ? "New Construction" : "Existing Property"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Animated Sliders */}
                <div className="space-y-4">
                  {/* Units Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-300">Total Units</label>
                      <span className="text-lg font-bold text-gold-400">{units}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="500"
                        value={units}
                        onChange={e => setUnits(+e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(units - 5) / 495 * 100}%, #374151 ${(units - 5) / 495 * 100}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Affordable Units */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-300">Affordable Units</label>
                      <span className="text-lg font-bold text-gold-400">{affUnits}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={units}
                      value={affUnits}
                      onChange={e => setAffUnits(+e.target.value)}
                      className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${units ? (affUnits / units * 100) : 0}%, #374151 ${units ? (affUnits / units * 100) : 0}%, #374151 100%)`
                      }}
                    />
                  </div>

                  {/* Energy Improvement with Visual Indicator */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-300">Energy Improvement</label>
                      <span className="text-lg font-bold text-green-400">{energyPct}%</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={energyPct}
                        onChange={e => setEnergyPct(+e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${energyPct * 2}%, #374151 ${energyPct * 2}%, #374151 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Standard</span>
                        <span>High Efficiency</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accessibility Toggles with Icons */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Accessibility Features</label>
                  {[
                    { checked: visitAll, onChange: setVisitAll, label: "All Units Visitable", icon: "🚪" },
                    { checked: commons, onChange: setCommons, label: "Barrier-Free Commons", icon: "♿" }
                  ].map((item, i) => (
                    <motion.label
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={e => item.onChange(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-gold-400 focus:ring-gold-500/50 focus:ring-2"
                      />
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-300">{item.label}</span>
                    </motion.label>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveScenario}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all border border-gray-600"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 rounded-xl hover:from-gold-400 hover:to-amber-500 transition-all font-semibold shadow-lg shadow-gold-500/30"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Results Card */}
              <AnimatedCard
                title="Analysis Results"
                icon={<BarChart3 className="w-6 h-6 text-gold-400" />}
                delay={0.2}
                gradient="from-gray-800/70 to-gray-900/70"
                glow={true}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Points Breakdown */}
                  <div className="space-y-4">
                    {[
                      { label: "Affordability", value: aPts, max: 50, color: "gold", desc: `${pctAff.toFixed(1)}% units • ${affYears} years` },
                      { label: "Energy", value: ePts, max: 30, color: "green", desc: `${energyPct}% improvement` },
                      { label: "Accessibility", value: accPts, max: 20, color: "blue", desc: "Combined features" }
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-100">{item.label}</span>
                          <span className={`text-2xl font-bold text-${item.color}-400`}>{item.value}</span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">{item.desc}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              item.color === "gold" ? "from-gold-400 to-amber-500" :
                              item.color === "green" ? "from-green-400 to-emerald-500" :
                              "from-blue-400 to-cyan-500"
                            }`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total Score Display */}
                  <div className="flex flex-col justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.6 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-amber-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gold-500/30 p-8 text-center">
                        <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Score</div>
                        <div className="text-6xl font-black text-gold-400 mb-4">{total}</div>
                        <TierBadge points={total} />
                        
                        <div className="mt-6 space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Max Amortization:</span>
                            <span className="font-semibold text-white">{amort} years</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Leverage:</span>
                            <span className="font-semibold text-white">{(leverage*100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Quick Loan Illustration */}
              <AnimatedCard
                title="Loan Illustration"
                icon={<DollarSign className="w-6 h-6 text-gold-400" />}
                delay={0.3}
                gradient="from-gray-800/70 to-gray-900/70"
              >
                <div className="p-6 rounded-xl bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-500/30">
                  <div className="text-gray-300">
                    <p className="mb-3">
                      Based on a project value of <span className="text-gold-400 font-bold">$20,000,000</span>
                    </p>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span>Maximum Loan</span>
                        <span className="text-xl font-bold text-gold-400">
                          ${maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span>Monthly Payment (4.5%, {amort}y)</span>
                        <span className="text-xl font-bold text-green-400">
                          ${Math.round(pmt(4.5, amort, maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000))).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes aurora {
          0% { transform: translateX(-100%) translateY(0); }
          50% { transform: translateX(100%) translateY(-100%); }
          100% { transform: translateX(-100%) translateY(0); }
        }
        
        @keyframes aurora-reverse {
          0% { transform: translateX(100%) translateY(0); }
          50% { transform: translateX(-100%) translateY(100%); }
          100% { transform: translateX(100%) translateY(0); }
        }
        
        .animate-aurora {
          animation: aurora 15s ease-in-out infinite;
        }
        
        .animate-aurora-reverse {
          animation: aurora-reverse 20s ease-in-out infinite;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
          border: none;
        }
      `}</style>
    </div>
  );
}