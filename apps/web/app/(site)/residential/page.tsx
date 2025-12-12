"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import {
  Home,
  Calculator,
  Users,
  Shield,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Phone,
  ArrowRight
} from "lucide-react";

export default function ResidentialLending() {
  const services = [
    {
      title: "First-Time Home Buyers",
      description: "Specialized programs and guidance for your first home purchase",
      features: ["First-time buyer incentives", "Down payment assistance", "Educational support", "Stress test guidance"],
      icon: Users
    },
    {
      title: "Refinancing",
      description: "Lower rates, access equity, or consolidate debt",
      features: ["Rate improvements", "Debt consolidation", "Home equity access", "Cash-out refinancing"],
      icon: TrendingUp
    },
    {
      title: "Mortgage Renewals",
      description: "Secure better terms at renewal time",
      features: ["Rate negotiations", "Term optimization", "Lender switching", "Early renewal options"],
      icon: Shield
    },
    {
      title: "Purchase Financing",
      description: "Competitive rates for your next home purchase",
      features: ["Pre-approvals", "Quick decisions", "Flexible terms", "Multiple lender options"],
      icon: Home
    }
  ];

  const calculators = [
    {
      title: "Affordability Calculator",
      description: "Determine how much home you can afford with current income and debts",
      href: "/calculators/affordability",
      icon: DollarSign,
      popular: true
    },
    {
      title: "Payment Calculator",
      description: "Calculate monthly payments based on loan amount, rate, and term",
      href: "/calculators/payment",
      icon: Calculator,
      popular: true
    },
    {
      title: "Stress Test Calculator",
      description: "Test your mortgage qualification at higher rates",
      href: "/residential/calculators/stress-test",
      icon: Shield,
      popular: false
    },
    {
      title: "Renewal Calculator",
      description: "Compare your renewal options and potential savings",
      href: "/calculators/renewal",
      icon: TrendingUp,
      popular: false
    }
  ];

  const benefits = [
    {
      title: "Expert Guidance",
      description: "18+ years of residential mortgage expertise across BC, AB, and ON"
    },
    {
      title: "Multiple Lenders",
      description: "Access to major banks, credit unions, and alternative lenders"
    },
    {
      title: "Competitive Rates",
      description: "Negotiated rates often better than bank branches"
    },
    {
      title: "No Cost Service",
      description: "Lender-paid compensation means no fees to you"
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-6">
                <Home className="w-4 h-4" />
                Residential Mortgage Specialists
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Residential</span> Lending
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                From first-time buyers to seasoned homeowners, we provide expert mortgage solutions for every residential financing need.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
                >
                  Start Application
                </a>
                <Link
                  href="#calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                >
                  Use Calculators
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Residential <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Services</span>
              </h2>
              <p className="text-lg text-gray-400">
                Comprehensive mortgage solutions for every residential scenario
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <service.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {service.features.map((feature, j) => (
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

        {/* Calculators Section */}
        <section id="calculators" className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Residential <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
              <p className="text-lg text-gray-400">
                Professional calculators for residential mortgage planning
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
                  className={`relative ${calc.popular ? 'ring-2 ring-blue-500/30' : ''}`}
                >
                  {calc.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}

                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                          <calc.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-gray-400 text-sm">{calc.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Kraft Mortgages</span>
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-blue-500/30 mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-t border-blue-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Dream Home?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Let our residential mortgage experts guide you through every step of the process.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
                >
                  Start Your Application
                </a>
                <a
                  href="tel:604-593-1550"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
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