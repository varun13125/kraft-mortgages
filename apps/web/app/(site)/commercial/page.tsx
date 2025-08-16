"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { 
  Building, 
  Calculator, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  BarChart3,
  Clock,
  Shield,
  Phone,
  ArrowRight,
  Target,
  Users,
  Briefcase
} from "lucide-react";

export default function CommercialLending() {
  const services = [
    {
      title: "Multi-Unit Residential",
      description: "Apartment buildings, condos, and rental properties",
      features: ["5+ unit buildings", "Investment analysis", "Cash flow optimization", "Refinancing options"],
      icon: Building,
      typical: "Prime + 1.50%+"
    },
    {
      title: "Office & Retail",
      description: "Commercial office buildings and retail properties",
      features: ["Owner-occupied", "Investment properties", "Mixed-use buildings", "Ground floor retail"],
      icon: Briefcase,
      typical: "Competitive rates"
    },
    {
      title: "Industrial Properties", 
      description: "Warehouses, manufacturing, and industrial facilities",
      features: ["Manufacturing facilities", "Warehouse properties", "Distribution centers", "Industrial condos"],
      icon: Target,
      typical: "Market rates"
    },
    {
      title: "Commercial Refinancing",
      description: "Refinance existing commercial mortgages",
      features: ["Rate improvements", "Cash-out refinancing", "Debt consolidation", "Term optimization"],
      icon: TrendingUp,
      typical: "Prime + 1.25%+"
    }
  ];

  const calculators = [
    {
      title: "Commercial Cash Flow Calculator",
      description: "Analyze property cash flow and debt service coverage",
      href: "/commercial/calculators/cash-flow",
      icon: DollarSign,
      popular: true
    },
    {
      title: "NOI Analysis Calculator",
      description: "Calculate Net Operating Income and operating ratios",
      href: "/commercial/calculators/noi-analysis", 
      icon: BarChart3,
      popular: true
    },
    {
      title: "Cap Rate Calculator",
      description: "Determine capitalization rates and property valuations",
      href: "/commercial/calculators/cap-rate",
      icon: TrendingUp,
      popular: false
    },
    {
      title: "Commercial Refinance Calculator",
      description: "Compare refinancing options and potential savings",
      href: "/commercial/calculators/refinance",
      icon: Building,
      popular: false
    }
  ];

  const requirements = [
    {
      category: "Financial Requirements",
      items: [
        "Minimum $500,000 loan amount",
        "25-30% down payment typical",
        "1.20+ Debt Service Coverage Ratio",
        "Strong personal/corporate financials"
      ]
    },
    {
      category: "Property Requirements", 
      items: [
        "Professional appraisal required",
        "Environmental assessment",
        "Property condition report",
        "Zoning compliance verification"
      ]
    },
    {
      category: "Documentation",
      items: [
        "3 years financial statements",
        "Rent rolls and lease agreements",
        "Operating expense statements",
        "Property tax assessments"
      ]
    },
    {
      category: "Approval Timeline",
      items: [
        "Pre-approval: 3-5 business days",
        "Full approval: 2-4 weeks",
        "Complex deals: 4-6 weeks",
        "Expedited options available"
      ]
    }
  ];

  const expertise = [
    {
      title: "Commercial Specialists",
      description: "Dedicated commercial lending team with decades of experience in complex transactions",
      icon: Users
    },
    {
      title: "Lender Network",
      description: "Access to major banks, credit unions, and alternative commercial lenders across Canada",
      icon: Shield
    },
    {
      title: "Fast Decisions",
      description: "Streamlined approval process with pre-approvals available in 3-5 business days",
      icon: Clock
    },
    {
      title: "Complex Deals",
      description: "Experience with challenging transactions including mixed-use, special purpose properties",
      icon: Target
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-6">
                <Building className="w-4 h-4" />
                Commercial Real Estate Specialists
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Commercial</span> Lending
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Professional commercial mortgage solutions for multi-unit residential, office, retail, and industrial properties. Expert analysis and competitive rates.
              </p>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 max-w-2xl mx-auto mb-8">
                <div className="text-lg font-semibold text-purple-400 mb-2">From Prime + 1.25%</div>
                <div className="text-sm text-gray-400">Competitive rates • Expert analysis • Fast approvals</div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all transform hover:scale-105"
                >
                  Get Pre-Approved
                </a>
                <Link 
                  href="#calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  Analyze Cash Flow
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
                Commercial <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-lg text-gray-400">
                Comprehensive commercial mortgage solutions for every property type
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
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-purple-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <service.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-100">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-semibold text-sm">{service.typical}</div>
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
                Commercial <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
              <p className="text-lg text-gray-400">
                Professional calculators for commercial property analysis
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
                  className={`relative ${calc.popular ? 'ring-2 ring-purple-500/30' : ''}`}
                >
                  {calc.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-purple-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                          <calc.icon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-gray-400 text-sm">{calc.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Commercial Lending <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Requirements</span>
              </h2>
              <p className="text-lg text-gray-400">
                What you need to know for commercial mortgage approval
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {requirements.map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-4">{req.category}</h3>
                  <ul className="space-y-3">
                    {req.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Commercial <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Expertise</span>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center border border-purple-500/30 mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-t border-purple-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Finance Your <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Commercial Property?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Our commercial lending specialists will structure the optimal financing for your investment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all transform hover:scale-105"
                >
                  Start Commercial Application
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
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