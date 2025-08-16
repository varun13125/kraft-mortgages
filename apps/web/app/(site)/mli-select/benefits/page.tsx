"use client";
import { motion } from "framer-motion";
import { Award, Calendar, TrendingUp, Zap, DollarSign, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Breadcrumb from "@/components/Breadcrumb";

export default function BenefitsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "MLI Select", href: "/mli-select" },
              { label: "Benefits" }
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
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Benefits</span> by Tier
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Tier 50/70/100: longer amortization, higher leverage, premium discounts. The more points you earn, the greater the benefits.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tier Comparison */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  tier: "Tier 50",
                  points: "50-69 Points",
                  color: "from-amber-500/20 to-yellow-500/20",
                  textColor: "text-amber-400",
                  borderColor: "border-amber-500/30",
                  benefits: [
                    { icon: Calendar, text: "40-year amortization", highlight: true },
                    { icon: DollarSign, text: "Basic premium discount", highlight: false },
                    { icon: TrendingUp, text: "Standard LTV ratios", highlight: false },
                    { icon: Zap, text: "Standard processing", highlight: false }
                  ],
                  premium: "5-10% discount",
                  amortization: "Up to 40 years"
                },
                {
                  tier: "Tier 70",
                  points: "70-99 Points",
                  color: "from-gold-500/20 to-amber-500/20", 
                  textColor: "text-gold-400",
                  borderColor: "border-gold-500/30",
                  benefits: [
                    { icon: Calendar, text: "Extended amortization", highlight: true },
                    { icon: DollarSign, text: "Enhanced premium discount", highlight: true },
                    { icon: TrendingUp, text: "Higher LTV ratios", highlight: true },
                    { icon: Zap, text: "Priority processing", highlight: false }
                  ],
                  premium: "15-20% discount",
                  amortization: "Up to 40 years",
                  highlight: true
                },
                {
                  tier: "Tier 100",
                  points: "100+ Points",
                  color: "from-emerald-500/20 to-green-500/20",
                  textColor: "text-emerald-400", 
                  borderColor: "border-emerald-500/30",
                  benefits: [
                    { icon: Calendar, text: "Maximum amortization", highlight: true },
                    { icon: DollarSign, text: "Maximum premium discount", highlight: true },
                    { icon: TrendingUp, text: "Highest LTV available", highlight: true },
                    { icon: Zap, text: "Expedited approval", highlight: true }
                  ],
                  premium: "Up to 25% discount",
                  amortization: "Up to 40 years"
                }
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border ${tier.borderColor} p-8 relative overflow-hidden ${
                    tier.highlight ? 'ring-2 ring-gold-500/30' : ''
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className={`w-8 h-8 ${tier.textColor}`} />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100">{tier.tier}</h3>
                        <p className={`text-sm ${tier.textColor}`}>{tier.points}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className={`text-3xl font-bold ${tier.textColor}`}>
                        {tier.premium}
                      </div>
                      <div className="text-sm text-gray-400">Premium Savings</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <benefit.icon className={`w-5 h-5 ${benefit.highlight ? tier.textColor : 'text-gray-500'}`} />
                          <span className={`text-sm ${benefit.highlight ? 'text-gray-300' : 'text-gray-500'}`}>
                            {benefit.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="text-xs text-gray-500">
                        <strong>Amortization:</strong> {tier.amortization}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Benefits */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Detailed <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Benefits</span> Breakdown
              </h2>
              <p className="text-lg text-gray-400">
                Understanding exactly what each tier unlocks for your project
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "Financial Benefits",
                  icon: DollarSign,
                  benefits: [
                    "Premium discounts ranging from 5% to 25%",
                    "Extended amortization periods up to 40 years",
                    "Higher loan-to-value ratios for reduced equity requirements",
                    "Improved cash flow through lower monthly payments",
                    "Potential savings of hundreds of thousands on large projects"
                  ]
                },
                {
                  title: "Operational Benefits", 
                  icon: Zap,
                  benefits: [
                    "Priority processing for higher tier applications",
                    "Expedited approval timelines for Tier 100 projects",
                    "Enhanced CMHC support throughout the process",
                    "Access to specialized MLI Select underwriters",
                    "Streamlined documentation requirements"
                  ]
                },
                {
                  title: "Competitive Advantages",
                  icon: TrendingUp,
                  benefits: [
                    "Market differentiation through MLI Select certification",
                    "Enhanced marketability to affordable housing advocates",
                    "Government recognition for sustainable development",
                    "Potential for additional municipal incentives",
                    "Long-term tenant stability through affordability commitments"
                  ]
                },
                {
                  title: "Project Impact",
                  icon: Award,
                  benefits: [
                    "Contribution to national affordable housing goals",
                    "Environmental benefits through energy efficiency requirements",
                    "Social impact through accessibility and affordability",
                    "Community development through thoughtful design",
                    "Legacy creation through sustainable building practices"
                  ]
                }
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <section.icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Savings Calculator */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-100 mb-4">
                Potential <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Cost Savings</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Example savings on a $10M project with different MLI Select tiers
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { tier: "Tier 50", savings: "$75,000 - $150,000", color: "text-amber-400" },
                  { tier: "Tier 70", savings: "$225,000 - $300,000", color: "text-gold-400" },
                  { tier: "Tier 100", savings: "$375,000 - $500,000", color: "text-emerald-400" }
                ].map((example, i) => (
                  <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-100 mb-2">{example.tier}</div>
                    <div className={`text-2xl font-bold ${example.color}`}>{example.savings}</div>
                    <div className="text-xs text-gray-500 mt-1">in premium savings</div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-6">
                *Actual savings depend on project specifics, location, and final CMHC terms. Contact us for a personalized assessment.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}