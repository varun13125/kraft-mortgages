"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { 
  Shield, 
  Calculator, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  DollarSign,
  Zap,
  Users,
  Phone,
  ArrowRight,
  AlertTriangle,
  Target,
  CreditCard
} from "lucide-react";

export default function PrivateLending() {
  const scenarios = [
    {
      title: "Credit Challenges",
      description: "Previous bankruptcy, consumer proposals, or credit issues",
      features: ["Recent credit events", "Self-employed income", "Non-traditional employment", "Asset-based approval"],
      icon: CreditCard,
      typical: "8% - 12%"
    },
    {
      title: "Speed Requirements",
      description: "Time-sensitive transactions requiring fast approvals",
      features: ["Same-day approvals", "Quick closings", "Bridge financing", "Minimal documentation"],
      icon: Zap,
      typical: "9% - 15%"
    },
    {
      title: "Unique Properties", 
      description: "Properties that don't fit traditional lending criteria",
      features: ["Rural properties", "Unique constructions", "Mixed-use buildings", "Special purpose properties"],
      icon: Target,
      typical: "10% - 14%"
    },
    {
      title: "Alternative Income",
      description: "Non-traditional income sources and documentation",
      features: ["Cash businesses", "Foreign income", "Investment income", "Bank statement programs"],
      icon: Users,
      typical: "8% - 13%"
    }
  ];

  const calculators = [
    {
      title: "Alternative Income Calculator",
      description: "Calculate approval amounts using non-traditional income",
      href: "/private-lending/calculators/alternative-income",
      icon: Users,
      popular: true
    },
    {
      title: "Asset-Based Calculator",
      description: "Determine loan amounts based on property value vs income",
      href: "/private-lending/calculators/asset-based", 
      icon: DollarSign,
      popular: true
    },
    {
      title: "Bridge Financing Calculator",
      description: "Calculate short-term bridge loan costs and timeline",
      href: "/private-lending/calculators/bridge-financing",
      icon: Clock,
      popular: false
    },
    {
      title: "Quick Approval Calculator",
      description: "Estimate approval probability and terms for fast decisions",
      href: "/private-lending/calculators/quick-approval",
      icon: Zap,
      popular: false
    }
  ];

  const comparison = {
    traditional: {
      title: "Traditional Lending",
      rates: "3.5% - 6.5%",
      timeline: "30-45 days",
      docs: "Extensive",
      credit: "Excellent required",
      approval: "70-80%",
      color: "blue"
    },
    equity: {
      title: "Equity Lending", 
      rates: "Prime + 0.50-2.00%",
      timeline: "1-2 weeks",
      docs: "Standard",
      credit: "Good required",
      approval: "85-90%",
      color: "emerald"
    },
    private: {
      title: "Private Lending",
      rates: "8% - 15%+",
      timeline: "24-48 hours",
      docs: "Minimal",
      credit: "Flexible",
      approval: "95%+",
      color: "rose"
    }
  };

  const advantages = [
    {
      title: "High Approval Rates",
      description: "95%+ approval rate for deals that qualify, even with credit challenges"
    },
    {
      title: "Fast Decisions", 
      description: "Same-day approvals available for time-sensitive transactions"
    },
    {
      title: "Flexible Terms",
      description: "Customizable repayment options and creative deal structuring"
    },
    {
      title: "Asset-Based Approval",
      description: "Focus on property value and equity rather than just income and credit"
    }
  ];

  const whenToConsider = [
    "Traditional lenders have declined your application",
    "You need funding within 24-48 hours", 
    "Credit challenges prevent bank approval",
    "Self-employed with complex income",
    "Unique property or transaction structure",
    "Bridge financing for time-sensitive deals"
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-6">
                <Shield className="w-4 h-4" />
                Alternative Lending Solutions
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Private</span> Lending
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Alternative lending solutions when traditional financing isn't an option. Fast approvals, flexible terms, and creative solutions for unique scenarios.
              </p>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-rose-500/20 p-4 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <div className="text-lg font-semibold text-rose-400">Higher Cost • Higher Approval</div>
                </div>
                <div className="text-sm text-gray-400">8-15%+ rates • 24-48 hour approvals • 95%+ approval rates</div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-400 hover:to-rose-500 transition-all transform hover:scale-105"
                >
                  Get Fast Approval
                </a>
                <Link 
                  href="#calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-rose-500/50 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  Calculate Options
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Lending Spectrum Comparison */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Lending <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Spectrum</span>
              </h2>
              <p className="text-lg text-gray-400">
                Understanding your options across the lending spectrum
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {Object.entries(comparison).map(([key, option], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 relative ${
                    key === 'private' ? 'ring-2 ring-rose-500/30' : ''
                  }`}
                >
                  {key === 'private' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        This Section
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-100 mb-6 text-center">{option.title}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Rates:</span>
                      <span className={`font-semibold ${
                        key === 'traditional' ? 'text-blue-400' : 
                        key === 'equity' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>{option.rates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeline:</span>
                      <span className="text-gray-300">{option.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documentation:</span>
                      <span className="text-gray-300">{option.docs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credit Required:</span>
                      <span className="text-gray-300">{option.credit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approval Rate:</span>
                      <span className={`font-semibold ${
                        key === 'traditional' ? 'text-blue-400' : 
                        key === 'equity' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>{option.approval}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Scenarios Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Private Lending <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Scenarios</span>
              </h2>
              <p className="text-lg text-gray-400">
                When private lending provides the best solution
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {scenarios.map((scenario, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-rose-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                      <scenario.icon className="w-6 h-6 text-rose-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-100">{scenario.title}</h3>
                      <p className="text-gray-400 text-sm">{scenario.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-rose-400 font-semibold text-sm">{scenario.typical}</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {scenario.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* When to Consider */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                When to Consider <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Private Lending</span>
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {whenToConsider.map((reason, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calculators Section */}
        <section id="calculators" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Private Lending <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
              <p className="text-lg text-gray-400">
                Specialized calculators for alternative lending scenarios
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {calculators.map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative ${calc.popular ? 'ring-2 ring-rose-500/30' : ''}`}
                >
                  {calc.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-rose-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                          <calc.icon className="w-6 h-6 text-rose-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-gray-400 text-sm">{calc.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {advantages.map((advantage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-rose-500/30 mx-auto mb-4">
                    <span className="text-2xl font-bold text-rose-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{advantage.title}</h3>
                  <p className="text-sm text-gray-400">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-rose-900/20 to-pink-900/20 border-t border-rose-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Need <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Fast Approval?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                When traditional lenders say no, we find a way. Fast approvals for unique scenarios.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-400 hover:to-rose-500 transition-all transform hover:scale-105"
                >
                  Get Fast Approval Today
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-rose-500/50 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
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