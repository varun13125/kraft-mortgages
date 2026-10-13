"use client";
import { motion } from "framer-motion";
import { Building, TrendingUp, Shield, CheckCircle, Award, Zap, Users } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function OverviewPage() {
  return (
    <>
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "MLI Select", href: "/mli-select" },
              { label: "Overview" }
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
                What is <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">MLI Select?</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Earn points for Affordability, Energy Efficiency, and Accessibility. Higher tiers unlock better terms and significant premium savings.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Overview Content */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                  <Building className="w-6 h-6 text-gold-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100">CMHC MLI Select Program</h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                MLI Select is CMHC&apos;s premium multi-unit residential insurance program that rewards developers and property owners 
                for creating more affordable, energy-efficient, and accessible housing. Through a point-based scoring system, 
                projects can qualify for enhanced insurance terms, extended amortizations, and substantial premium discounts.
              </p>
            </motion.div>

            {/* Key Features */}
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              {[
                {
                  icon: TrendingUp,
                  title: "Affordability Focus",
                  description: "Earn 50, 70 or 100 points by keeping a share of units at or below 30% of median renter income for 10+ years (+30 bonus points for 20+ years).",
                  features: ["Rent-to-income caps", "Affordable unit requirements", "Long-term affordability commitments"]
                },
                {
                  icon: Zap,
                  title: "Energy Efficiency",
                  description: "Earn 20, 35 or 50 points for energy performance better than NECB/NBC Tier 1 (new) or reductions vs. current use (existing).",
                  features: ["ENERGY STAR certification", "High-performance building envelope", "Renewable energy systems"]
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  description: "Earn 20 or 30 points with accessible / universal-design units or RHFAC certification (100% visitable units and barrier-free commons required).",
                  features: ["Universal design principles", "Accessible unit requirements", "Enhanced accessibility features"]
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <feature.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Benefits by Tier */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Benefits</span> by Tier
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                The more points you earn, the greater the benefits and cost savings for your project
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  tier: "Tier 50",
                  points: "50-69 Points",
                  benefits: ["Up to 40-year amortization", "10% premium discount", "Up to 95% LTC (new) / 85% LTV (existing)"],
                  highlight: false
                },
                {
                  tier: "Tier 70", 
                  points: "70-99 Points",
                  benefits: ["Up to 45-year amortization", "20% premium discount", "Up to 95% LTC / LTV"],
                  highlight: true
                },
                {
                  tier: "Tier 100",
                  points: "100+ Points", 
                  benefits: ["Up to 50-year amortization", "30% premium discount", "Limited recourse available"],
                  highlight: false
                }
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border ${
                    tier.highlight ? 'border-gold-500/50' : 'border-gray-700/50'
                  } p-6 relative ${tier.highlight ? 'ring-2 ring-gold-500/30' : ''}`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-gold-400" />
                    <h3 className="text-xl font-semibold text-gray-100">{tier.tier}</h3>
                  </div>
                  <div className="text-2xl font-bold text-gold-400 mb-4">
                    {tier.points}
                  </div>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Why <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">MLI Select</span> Matters
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
              >
                <Shield className="w-12 h-12 text-gold-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-4">For Developers</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Significant insurance premium savings (up to 30% discount)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Extended amortization periods for better cash flow
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Higher loan-to-value ratios reducing equity requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Competitive advantage in the affordable housing market
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
              >
                <Building className="w-12 h-12 text-gold-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-4">For Communities</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    More affordable rental housing options
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Energy-efficient buildings reducing environmental impact
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Enhanced accessibility for residents with disabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Long-term affordability commitments protecting tenants
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}