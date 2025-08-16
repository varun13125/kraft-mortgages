"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { 
  Calculator, 
  Home, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Hammer, 
  ArrowRight,
  Zap,
  Users,
  Shield,
  Clock,
  Target
} from "lucide-react";

export default function CalculatorsHub() {
  const sections = [
    {
      title: "MLI Select Calculators",
      description: "CMHC multi-unit specialized calculators for developers and investors",
      icon: Building,
      color: "from-gold-500 to-amber-500",
      bgGradient: "from-gold-500/10 to-amber-500/10",
      href: "/mli-select/calculators",
      calculators: [
        "Points & Tier Calculator",
        "Premium Calculator", 
        "DSCR Calculator",
        "Maximum Loan Calculator",
        "Rent Cap Calculator"
      ],
      featured: true
    },
    {
      title: "Residential Lending",
      description: "Home buying, refinancing, and renewal calculators",
      icon: Home,
      color: "from-blue-500 to-cyan-500", 
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      href: "/residential",
      calculators: [
        "Affordability Calculator",
        "Payment Calculator",
        "Stress Test Calculator",
        "Renewal Calculator"
      ]
    },
    {
      title: "Equity Lending",
      description: "Professional equity solutions with institutional rates",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10", 
      href: "/equity-lending",
      calculators: [
        "Home Equity Calculator",
        "Debt Consolidation Calculator",
        "Cash-Out Refinance Calculator",
        "Investment Opportunity Calculator"
      ]
    },
    {
      title: "Construction Financing",
      description: "Progressive draws and construction-to-permanent financing",
      icon: Hammer,
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      href: "/construction",
      calculators: [
        "Construction Budget Calculator", 
        "Progressive Draw Calculator",
        "Cost-to-Complete Calculator",
        "Builder Program Calculator"
      ]
    },
    {
      title: "Commercial Lending", 
      description: "Commercial properties and multi-unit investment analysis",
      icon: Building,
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10",
      href: "/commercial",
      calculators: [
        "Commercial Cash Flow Calculator",
        "NOI Analysis Calculator", 
        "Cap Rate Calculator",
        "Commercial Refinance Calculator"
      ]
    },
    {
      title: "Private Lending",
      description: "Alternative lending solutions for unique scenarios",
      icon: Shield,
      color: "from-rose-500 to-pink-500", 
      bgGradient: "from-rose-500/10 to-pink-500/10",
      href: "/private-lending",
      calculators: [
        "Alternative Income Calculator",
        "Asset-Based Calculator", 
        "Bridge Financing Calculator",
        "Quick Approval Calculator"
      ]
    }
  ];

  const quickCalculators = [
    {
      title: "Payment Calculator",
      description: "Calculate monthly payments",
      href: "/calculators/payment",
      icon: Calculator
    },
    {
      title: "Affordability Calculator", 
      description: "Determine buying power",
      href: "/calculators/affordability",
      icon: DollarSign
    },
    {
      title: "Investment Calculator",
      description: "Analyze rental properties", 
      href: "/calculators/investment",
      icon: TrendingUp
    },
    {
      title: "Self-Employed Calculator",
      description: "Alternative income verification",
      href: "/calculators/self-employed", 
      icon: Users
    }
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
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
                <Calculator className="w-4 h-4" />
                Professional Calculator Suite
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                Mortgage <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Calculators</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Professional-grade calculators for every lending scenario. From residential mortgages to complex commercial deals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Access Calculators */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                <Zap className="w-6 h-6 inline mr-2 text-gold-400" />
                Quick Calculators
              </h2>
              <p className="text-gray-400">Most popular calculators for immediate use</p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16">
              {quickCalculators.map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-4 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-lg flex items-center justify-center border border-gold-500/30">
                          <calc.icon className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-xs text-gray-400">{calc.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lending Sections */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Specialized <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Calculator Suites</span>
              </h2>
              <p className="text-lg text-gray-400">
                Advanced calculators organized by lending expertise
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden ${section.featured ? 'lg:col-span-2' : ''}`}
                >
                  <Link href={section.href as any} className="group">
                    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden ${
                      section.featured ? 'border-gold-500/30 ring-1 ring-gold-500/20' : ''
                    }`}>
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-20`}></div>
                      
                      {/* Featured Badge */}
                      {section.featured && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                            Featured
                          </div>
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${section.color}/20 rounded-xl flex items-center justify-center border border-gray-700/50`}>
                            <section.icon className={`w-6 h-6 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-100">{section.title}</h3>
                            <p className="text-gray-400 text-sm">{section.description}</p>
                          </div>
                        </div>

                        {/* Calculator List */}
                        <div className="space-y-2 mb-4">
                          {section.calculators.slice(0, section.featured ? 5 : 3).map((calc, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color}`}></div>
                              {calc}
                            </div>
                          ))}
                          {section.calculators.length > (section.featured ? 5 : 3) && (
                            <div className="text-xs text-gray-500">
                              +{section.calculators.length - (section.featured ? 5 : 3)} more calculators
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-between">
                          <div className={`text-sm font-medium bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                            Explore Section
                          </div>
                          <ArrowRight className={`w-4 h-4 bg-gradient-to-r ${section.color} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Calculators */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Why Choose Our <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  title: "Industry-Specific",
                  description: "Calculators designed for specific lending scenarios with accurate formulas and current market data."
                },
                {
                  icon: Clock, 
                  title: "Real-Time Results",
                  description: "Instant calculations with export functionality and personalized reports delivered to your inbox."
                },
                {
                  icon: Shield,
                  title: "Professional Grade",
                  description: "Used by mortgage professionals across BC, AB, and ON. Trusted by developers and investors."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Need Help with <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Complex Scenarios?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Our mortgage specialists can provide personalized analysis and guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                >
                  Get Expert Analysis
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  Call 604-593-1550
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}