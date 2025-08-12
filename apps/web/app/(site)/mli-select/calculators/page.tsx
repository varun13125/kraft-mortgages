import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default function Calculators() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 metallic-dark" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              MLI Select <span className="gradient-text">Calculators</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade calculators optimized for Canadian multi-unit development. Accurate projections tailored to CMHC MLI Select program rules.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Calculator Grid */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Specialized <span className="gradient-text">Calculators</span> for MLI Select
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Points & Tier Calculator */}
            <Link href="/mli-select/calculators/points-tier" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors"
                >
                  <TrendingUp className="w-6 h-6 text-gold-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Points & Tier Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Calculate your total score based on affordability, energy efficiency, and accessibility achievements.
                </p>
                <div className="text-gold-400 text-sm font-medium">Predict Tier Level →</div>
              </motion.div>
            </Link>

            {/* Rent Cap Calculator */}
            <Link href="/mli-select/calculators/rent-cap" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors"
                >
                  <DollarSign className="w-6 h-6 text-green-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rent Cap Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Determine your maximum affordable rent restrictions by property type and location.
                </p>
                <div className="text-green-400 text-sm font-medium">Calculate Caps →</div>
              </motion.div>
            </Link>

            {/* Maximum Loan Calculator */}
            <Link href="/mli-select/calculators/max-loan" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors"
                >
                  <Calculator className="w-6 h-6 text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Maximum Loan Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Find your maximum loan amounts based on property NOI, purchase price, and tier benefits.
                </p>
                <div className="text-blue-400 text-sm font-medium">Calculate Max Loan →</div>
              </motion.div>
            </Link>

            {/* DSCR Calculator */}
            <Link href="/mli-select/calculators/dscr" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors"
                >
                  <TrendingUp className="w-6 h-6 text-purple-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">DSCR Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Analyze debt service coverage ratios with tier-specific DSCR requirements and cash flow impact.
                </p>
                <div className="text-purple-400 text-sm font-medium">Analyze DSCR →</div>
              </motion.div>
            </Link>

            {/* Amortization Calculator */}
            <Link href="/mli-select/calculators/amortization" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors"
                >
                  <Clock className="w-6 h-6 text-orange-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Amortization Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Explore extended amortization options by tier level and their impact on monthly payments.
                </p>
                <div className="text-orange-400 text-sm font-medium">Check Amortization →</div>
              </motion.div>
            </Link>

            {/* Premium Calculator */}
            <Link href="/mli-select/calculators/premium" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors"
                >
                  <DollarSign className="w-6 h-6 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Insurance Premium Calculator</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Calculate your CMHC insurance premiums with accurate tier-based reduction calculations.
                </p>
                <div className="text-red-400 text-sm font-medium">Estimate Premium →</div>
              </motion.div>
            </Link>

            {/* Additional Calculators */}
            
            <Link href="/mli-select/calculators/break-even" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4"
                >
                  <Calculator className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Break-Even Analysis</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Analyze break-even scenarios for different tier achievements and investment strategies.
                </p>
                <div className="text-gray-400 text-sm font-medium">Break-Even Analysis →</div>
              </motion.div>
            </Link>

            <Link href="/mli-select/calculators/eligibility-checklist" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Eligibility Checklist</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Quick eligibility assessment for borrower, property, and program requirements.
                </p>
                <div className="text-gray-400 text-sm font-medium">Check Eligibility →</div>
              </motion.div>
            </Link>

            <Link href="/mli-select/calculators/scenario-compare" className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="metallic-card rounded-xl p-6 h-full group-hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4"
                >
                  <Calculator className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Scenario Comparison</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Compare multiple scenarios side-by-side to optimize your MLI Select strategy.
                </p>
                <div className="text-gray-400 text-sm font-medium">Compare Scenarios →</div>
              </motion.div>
            </Link>
          </div>

          <div className="mt-12 bg-gray-800/50 rounded-xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Developer & Investor Focus</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto"
            >
              Our calculators are built specifically for Canadian multi-unit development. Get accurate results based on CMHC program rules, provincial regulations, and current market conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/mli-select/calculators/points-tier" className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors"
              >
                Points Calculator
              </Link>
              <Link href="/mli-select/contact" className="px-6 py-3 border border-gold-500 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
              >
                Contact Specialist
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

// Fixed Calculator Component
function Calculator({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}