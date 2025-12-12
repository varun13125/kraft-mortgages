"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import {
  Hammer,
  Calculator,
  Building,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Phone,
  ArrowRight,
  Layers,
  Target,
  Users
} from "lucide-react";

export default function ConstructionFinancing() {
  const services = [
    {
      title: "Progressive Draw Construction",
      description: "Construction financing with scheduled draw releases",
      features: ["Progress-based funding", "Hold back management", "Site inspection coordination", "Completion guarantees"],
      icon: Layers,
      typical: "Prime + 1.00%"
    },
    {
      title: "Construction-to-Permanent",
      description: "Single-close financing from build to permanent mortgage",
      features: ["No second closing", "Rate lock options", "Simplified process", "Permanent conversion"],
      icon: Building,
      typical: "Competitive rates"
    },
    {
      title: "Builder Programs",
      description: "Specialized financing for professional builders",
      features: ["Volume discounts", "Fast approvals", "Dedicated support", "Portfolio management"],
      icon: Users,
      typical: "Preferred rates"
    },
    {
      title: "Land Development",
      description: "Financing for land acquisition and development",
      features: ["Site servicing", "Infrastructure funding", "Phased development", "Exit strategies"],
      icon: Target,
      typical: "Market rates"
    }
  ];

  const calculators = [
    {
      title: "Construction Budget Calculator",
      description: "Plan your construction budget with detailed cost breakdown",
      href: "/construction/calculators/budget",
      icon: DollarSign,
      popular: true
    },
    {
      title: "Progressive Draw Calculator",
      description: "Calculate draw schedules and interest during construction",
      href: "/construction/calculators/progressive-draw",
      icon: Layers,
      popular: true
    },
    {
      title: "Cost-to-Complete Calculator",
      description: "Track remaining costs and funding requirements",
      href: "/construction/calculators/cost-to-complete",
      icon: Target,
      popular: false
    },
    {
      title: "Builder Program Calculator",
      description: "Analyze builder financing options and volume discounts",
      href: "/construction/calculators/builder-program",
      icon: Building,
      popular: false
    }
  ];

  const process = [
    {
      step: "01",
      title: "Pre-Construction Planning",
      description: "Budget approval, plan review, and financing structure",
      duration: "1-2 weeks"
    },
    {
      step: "02",
      title: "Construction Loan Approval",
      description: "Final approval and construction loan documentation",
      duration: "1-2 weeks"
    },
    {
      step: "03",
      title: "Progressive Draws",
      description: "Scheduled funding based on construction milestones",
      duration: "6-18 months"
    },
    {
      step: "04",
      title: "Permanent Conversion",
      description: "Convert to permanent mortgage upon completion",
      duration: "1-2 weeks"
    }
  ];

  const expertise = [
    {
      title: "18+ Years Construction Experience",
      description: "Deep understanding of construction financing across residential and commercial projects"
    },
    {
      title: "Builder Relationships",
      description: "Established partnerships with reputable builders and contractors across BC, AB, ON"
    },
    {
      title: "Progress Monitoring",
      description: "Professional site inspections and progress verification for draw releases"
    },
    {
      title: "Risk Management",
      description: "Comprehensive insurance requirements and completion guarantees protection"
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-6">
                <Hammer className="w-4 h-4" />
                Construction Finance Specialists
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Construction</span> Financing
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Expert construction financing with progressive draws, builder programs, and construction-to-permanent solutions. 18+ years of construction lending expertise.
              </p>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-4 max-w-2xl mx-auto mb-8">
                <div className="text-lg font-semibold text-orange-400 mb-2">Starting from Prime + 1.00%</div>
                <div className="text-sm text-gray-400">Progressive draws • Professional inspections • Completion guarantees</div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105"
                >
                  Start Your Project
                </a>
                <Link
                  href="#calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-colors"
                >
                  Calculate Budget
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Construction Process */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Construction <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Process</span>
              </h2>
              <p className="text-lg text-gray-400">
                Streamlined construction financing from planning to permanent conversion
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent transform -translate-y-1/2"></div>
                  )}

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 text-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center border border-orange-500/30 mx-auto mb-4">
                      <span className="text-lg font-bold text-orange-400">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                    <div className="text-orange-400 text-xs font-medium">{step.duration}</div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Construction <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-lg text-gray-400">
                Comprehensive construction financing for every project type
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
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-orange-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                      <service.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-100">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold text-sm">{service.typical}</div>
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
                Construction <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
              <p className="text-lg text-gray-400">
                Professional calculators for construction project planning
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
                  className={`relative ${calc.popular ? 'ring-2 ring-orange-500/30' : ''}`}
                >
                  {calc.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}

                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-orange-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                          <calc.icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-gray-400 text-sm">{calc.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
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
                Construction <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Expertise</span>
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {expertise.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center border border-orange-500/30 mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-orange-900/20 to-red-900/20 border-t border-orange-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Build Your <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Dream Project?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Our construction financing experts will guide your project from foundation to completion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all transform hover:scale-105"
                >
                  Start Your Construction Loan
                </a>
                <a
                  href="tel:604-593-1550"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-colors"
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