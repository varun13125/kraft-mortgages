"use client";
import { motion } from "framer-motion";
import { Award, TrendingUp, Zap, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Breadcrumb from "@/components/Breadcrumb";

export default function ScoringPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "MLI Select", href: "/mli-select" },
              { label: "Scoring" }
            ]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                CMHC • MLI Select
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Scoring</span> System
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Interactive breakdown of Affordability, Energy, and Accessibility points to maximize your MLI Select tier.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Scoring Categories */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Affordability Points",
                  description: "Rent-to-income ratios and accessibility features that improve housing affordability.",
                  maxPoints: 50,
                  color: "emerald"
                },
                {
                  icon: Zap,
                  title: "Energy Efficiency",
                  description: "Green building features, energy ratings, and sustainable design elements.",
                  maxPoints: 30,
                  color: "blue"
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  description: "Universal design features and barrier-free accessibility enhancements.",
                  maxPoints: 20,
                  color: "purple"
                }
              ].map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <category.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{category.title}</h3>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  <div className="text-2xl font-bold text-gold-400">
                    Up to {category.maxPoints} Points
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tier System */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                MLI Select <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Tier System</span>
              </h2>
              <p className="text-lg text-gray-400">
                Higher points unlock better terms and premium discounts
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  tier: "Tier 50",
                  points: "50+ Points",
                  benefits: ["Extended amortization", "Basic premium discount", "Standard lending ratio"],
                  color: "from-amber-500/20 to-yellow-500/20",
                  textColor: "text-amber-400"
                },
                {
                  tier: "Tier 70",
                  points: "70+ Points", 
                  benefits: ["Higher leverage ratios", "Enhanced premium discount", "Priority processing"],
                  color: "from-gold-500/20 to-amber-500/20",
                  textColor: "text-gold-400"
                },
                {
                  tier: "Tier 100",
                  points: "100+ Points",
                  benefits: ["Maximum premium discount", "Highest leverage", "Expedited approval"],
                  color: "from-emerald-500/20 to-green-500/20", 
                  textColor: "text-emerald-400"
                }
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 relative overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className={`w-6 h-6 ${tier.textColor}`} />
                      <h3 className="text-xl font-semibold text-gray-100">{tier.tier}</h3>
                    </div>
                    <div className={`text-2xl font-bold ${tier.textColor} mb-4`}>
                      {tier.points}
                    </div>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${tier.textColor.replace('text-', 'bg-')}`}></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}