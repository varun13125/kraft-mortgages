import { motion } from "framer-motion";
import { TrendingUp, Star, Clock, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BenefitsPage() {
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
              MLI Select <span className="gradient-text">Benefits</span> by Tier
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock progressive benefits as you achieve higher tiers. From premium reductions to extended amortization & enhanced underwriting.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Overview */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            <span className="gradient-text">Stacking Benefits</span> by Achievement Level
          </h2>
          
          <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
            Each tier unlocks progressively better terms. Move from Tier 50 to Tier 100 to maximize your project's financial benefits and long-term value.
          </p>
        </motion.div>
      </section>

      {/* Benefits Comparison */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800/50 rounded-xl overflow-hidden">
              <thead className="bg-gold-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold w-1/4">Benefit Category</th>
                  <th className="px-6 py-4 text-center text-yellow-400 font-semibold">Tier 50
                    <div className="text-sm text-gray-300 font-normal">50 Points</div>
                  </th>
                  <th className="px-6 py-4 text-center text-blue-400 font-semibold">Tier 70
                    <div className="text-sm text-gray-300 font-normal">70 Points</div>
                  </th>
                  <th className="px-6 py-4 text-center text-green-400 font-semibold">Tier 100
                    <div className="text-sm text-gray-300 font-normal">100 Points</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white font-medium">Premium Reduction</td>
                  <td className="px-6 py-4 text-center text-gray-300">Standard</td>
                  <td className="px-6 py-4 text-center text-gray-300">Intermediate</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">Maximum 50%</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/30">
                  <td className="px-6 py-4 text-white font-medium">Amortization</td>
                  <td className="px-6 py-4 text-center text-gray-300">Up to 30 years</td>
                  <td className="px-6 py-4 text-center text-gray-300">Up to 35 years</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">Up to 40 years</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white font-medium">Maximum LTV Ratio</td>
                  <td className="px-6 py-4 text-center text-gray-300">85%</td>
                  <td className="px-6 py-4 text-center text-gray-300">90%</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">95%</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/30">
                  <td className="px-6 py-4 text-white font-medium">DSCR & Flexibility</td>
                  <td className="px-6 py-4 text-center text-gray-300">1.00× DSCR</td>
                  <td className="px-6 py-4 text-center text-gray-300">0.95× DSCR</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">0.90× DSCR</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white font-medium">Green Financing Rates</td>
                  <td className="px-6 py-4 text-center text-gray-400">❌</td>
                  <td className="px-6 py-4 text-center text-yellow-400">Partial</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">✅ Maximum</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/30">
                  <td className="px-6 py-4 text-white font-medium">Enhanced Underwriting</td>
                  <td className="px-6 py-4 text-center text-gray-300">Base level</td>
                  <td className="px-6 py-4 text-center text-gray-300">Improved</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">Full</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white font-medium">Multiple Investor Friendly</td>
                  <td className="px-6 py-4 text-center text-yellow-400">Limited</td>
                  <td className="px-6 py-4 text-center text-yellow-400">Enhanced</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">Maximum
              </div>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Tier50Icon,
            title: "Tier 50 Benefits",
            description: "Foundation tier with premium recognition, competitive rates, and moderate flexibility. Ideal for projects focusing on single pillar achievement.",
            points: "50+ pts"
          },
          {
            icon: Tier70Icon, 
            title: "Tier 70 Benefits",
            description: "Enhanced tier with better amortization, improved rates, and increased flexibility. Perfect for projects achieving partial pillar combination.",
            points: "70+ pts"
          },
          {
            icon: Tier100Icon,
            title: "Tier 100 Benefits", 
            description: "Maximum tier unlocking full premium reduction, extended amortization, superior rates, and comprehensive underwriting flexibility. Ultimate project optimization.",
            points: "100 pts"
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="metallic-card rounded-xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{item.description}</p>
            <div className="text-gold-400 font-bold">{item.points}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-gray-800/50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Calculate Your Project Tier</h3>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Use our specialized calculators to predict your MLI Select tier based on your project's affordability commitment, energy efficiency, and accessibility features.
        </p>
        <Link href="/mli-select/calculators/tier-calculator" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors">
          Tier Calculator
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  </section>
</main>
  );
}

// Simple placeholder icons for the benefit tiers
function Tier50Icon() {
  return (
    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function Tier70Icon() {
  return (
    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function Tier100Icon() {
  return (
    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m9.663 5.5a9.5 9.5 0 01-1.333 3.167m-8.664 0A9.5 9.5 0 013.001 23l-3-3h18l-3 3A9.5 9.5 0 0120.337 20.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c0 1.472.348 2.855.968 4.086m18.064-8.172C21.652 13.145 22 11.472 22 12c0 5.523-4.477 10-10 10A10 10 0 012 12C2 6.477 6.477 2 12 2z" />
    </svg>
  );
}

// Fix the missing icons - add these to the imports
const DollarSign = () => (
  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" />
  </svg>
);