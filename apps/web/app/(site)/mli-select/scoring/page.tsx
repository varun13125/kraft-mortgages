import { motion } from "framer-motion";
import { Target, TrendingUp, Star, Building, Leaf, Accessibility, Award } from "lucide-react";

export default function ScoringSystem() {
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
              MLI Select <span className="gradient-text">Scoring System</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Understand the three-pillar framework to achieve 50, 70, or 100 points and unlock maximum CMHC premium discounts.
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
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="gradient-text">Pillar-Based</span> Scoring Framework
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 text-center max-w-3xl mx-auto">
            MLI Select evaluates projects across three essential pillars. Each pillar achieved contributes to your tier qualification & unlocks significant benefits.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="metallic-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Affordability Pillar</h3>
              <p className="text-sm text-gray-300 mb-4">
                30% of units maintained below market rents for affordability term
              </p>
              <div className="text-gold-400 text-2xl font-bold">+25 pts</div>
              <div className="text-sm text-gray-400 mt-2">When achieved</div>
            </div>

            <div className="metallic-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Energy Pillar</h3>
              <p className="text-sm text-gray-300 mb-4">
                15% energy efficiency improvement vs baseline or green certification
              </p>
              <div className="text-green-400 text-2xl font-bold">+25 pts</div>
              <div className="text-sm text-gray-400 mt-2">When achieved</div>
            </div>

            <div className="metallic-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Accessibility className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Accessibility Pillar</h3>
              <p className="text-sm text-gray-300 mb-4">
                20% of units meet accessibility standards or universal design
              </p>
              <div className="text-blue-400 text-2xl font-bold">+25 pts</div>
              <div className="text-sm text-gray-400 mt-2">When achieved</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tier Benefits */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            <span className="gradient-text">Tier</span> Benefits & Requirements
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="metallic-card rounded-xl p-6 border-l-4 border-gold-500"
            >
              <div className="flex items-center gap-3 mb-4"
                <div className="w-12 h-12 bg-gold-900/30 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tier 50</h3>
                  <p className="text-sm text-gold-400">50 Points Required</p>
                </div>
              </div>

              <div className="space-y-4"
                <div>
                  <h4 className="text-white font-semibold text-sm">Core Benefits:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Mortgage insurer premium reduction</li>
                    <li>• Standard underwriting guidelines</li>
                    <li>• Competitive market rates</li>
                    <li>• 1.00× DSCR requirement</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-sm">Achievement Examples:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Affordable housing commitment (50 pts)</li>
                    <li>
                      OR
                      <ul className="ml-2 space-y-0.5">
                        <li>• Energy + Accessibility (50 pts)</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="metallic-card rounded-xl p-6 border-l-4 border-green-400"
            >
              <div className="flex items-center gap-3 mb-4"
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tier 70</h3>
                  <p className="text-sm text-green-400">70 Points Required</p>
                </div>
              </div>

              <div className="space-y-4"
                <div>
                  <h4 className="text-white font-semibold text-sm">Enhanced Benefits:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Larger premium reduction</li>
                    <li>• Extended amortization (up to 35 yrs)</li>
                    <li>• 0.95× DSCR requirement</li>
                    <li>• Green financing rate support</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-sm">Achievement Examples:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Affordability (50) + Energy (20)</li>
                    <li>• Affordability (50) + Accessibility (20)</li>
                    <li>• Partial achievement across pillars</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="metallic-card rounded-xl p-6 border-l-4 border-blue-400"
            >
              <div className="flex items-center gap-3 mb-4"
                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tier 100</h3>
                  <p className="text-sm text-blue-400">100 Points Required</p>
                </div>
              </div>

              <div className="space-y-4"
                <div>
                  <h4 className="text-white font-semibold text-sm">Maximum Benefits:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• 50% mortgage insurance premium reduction</li>
                    <li>• Extended amortization (up to 40 yrs)</li>
                    <li>• 0.90× DSCR requirement</li>
                    <li>• Maximum green financing support</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-sm">Perfect Achievement:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Affordability (50) + Energy (25) + Accessibility (25)</li>
                    <li>• Complete pillar achievement required</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}