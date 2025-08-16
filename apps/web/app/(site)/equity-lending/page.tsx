"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { 
  TrendingUp, 
  Calculator, 
  Shield, 
  CheckCircle, 
  DollarSign,
  Home,
  CreditCard,
  Building2,
  Phone,
  ArrowRight,
  Award,
  Clock,
  Users
} from "lucide-react";

export default function EquityLending() {
  const services = [
    {
      title: "Home Equity Lines of Credit",
      description: "Access up to 80% of your home's equity with competitive rates",
      features: ["Institutional rates", "Flexible access", "Interest-only payments", "Reusable credit line"],
      icon: Home,
      rate: "Prime + 0.50%"
    },
    {
      title: "Debt Consolidation",
      description: "Consolidate high-interest debt into one manageable payment",
      features: ["Lower monthly payments", "Single payment", "Improved credit score", "Tax-deductible options"],
      icon: CreditCard,
      rate: "From 3.95%"
    },
    {
      title: "Investment Opportunities", 
      description: "Leverage your home equity for investment properties",
      features: ["Investment property down payments", "Portfolio expansion", "Tax advantages", "Professional guidance"],
      icon: Building2,
      rate: "Competitive rates"
    },
    {
      title: "Cash-Out Refinancing",
      description: "Refinance and access cash for major expenses",
      features: ["Home renovations", "Business investments", "Education funding", "Emergency reserves"],
      icon: TrendingUp,
      rate: "Market rates"
    }
  ];

  const calculators = [
    {
      title: "Home Equity Calculator",
      description: "Calculate how much equity you can access from your home",
      href: "/equity-lending/calculators/home-equity",
      icon: Home,
      popular: true
    },
    {
      title: "Debt Consolidation Calculator",
      description: "Compare savings from consolidating high-interest debt",
      href: "/equity-lending/calculators/debt-consolidation", 
      icon: CreditCard,
      popular: true
    },
    {
      title: "Cash-Out Refinance Calculator",
      description: "Analyze cash-out refinancing options and costs",
      href: "/equity-lending/calculators/cash-out-refinance",
      icon: DollarSign,
      popular: false
    },
    {
      title: "Investment Opportunity Calculator",
      description: "Evaluate investment property purchases using home equity",
      href: "/equity-lending/calculators/investment-opportunity",
      icon: TrendingUp,
      popular: false
    }
  ];

  const advantages = [
    {
      title: "Institutional Rates",
      description: "Access rates typically reserved for banks and credit unions, not private lenders",
      icon: Award
    },
    {
      title: "Professional Service",
      description: "White-glove service with dedicated account management and ongoing support",
      icon: Users
    },
    {
      title: "Fast Approvals",
      description: "Streamlined process with decisions in 24-48 hours for qualified applicants",
      icon: Clock
    },
    {
      title: "Flexible Terms",
      description: "Customizable repayment options and credit facilities to match your needs",
      icon: Shield
    }
  ];

  const comparisonData = [
    { feature: "Interest Rates", equity: "Prime + 0.50% - 2.00%", private: "8% - 15%+", winner: "equity" },
    { feature: "Approval Time", equity: "24-48 hours", private: "Same day", winner: "private" },
    { feature: "Documentation", equity: "Standard verification", private: "Minimal docs", winner: "private" },
    { feature: "Professional Service", equity: "Full-service support", private: "Basic service", winner: "equity" },
    { feature: "Long-term Cost", equity: "Significantly lower", private: "Much higher", winner: "equity" },
    { feature: "Reputation", equity: "Institutional backing", private: "Varies widely", winner: "equity" }
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
                <TrendingUp className="w-4 h-4" />
                Professional Equity Solutions
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Equity</span> Lending
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Professional equity lending solutions with institutional rates. Access your home's equity through established lenders, not high-cost private alternatives.
              </p>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-4 max-w-2xl mx-auto mb-8">
                <div className="text-lg font-semibold text-emerald-400 mb-2">Starting from Prime + 0.50%</div>
                <div className="text-sm text-gray-400">Institutional rates • Professional service • Proven track record</div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-400 hover:to-emerald-500 transition-all transform hover:scale-105"
                >
                  Get Pre-Approved
                </a>
                <Link 
                  href="#calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors"
                >
                  Calculate Equity
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Equity vs Private Comparison */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Why Choose <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Equity Lending</span>
              </h2>
              <p className="text-lg text-gray-400">
                Professional equity solutions vs. high-cost private alternatives
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-700/50">
                <div></div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-emerald-400">Equity Lending</div>
                  <div className="text-sm text-gray-400">Professional • Institutional</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-400">Private Lending</div>
                  <div className="text-sm text-gray-400">Alternative • High-cost</div>
                </div>
              </div>
              
              {comparisonData.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 gap-4 p-4 ${i % 2 === 0 ? 'bg-gray-700/20' : ''}`}>
                  <div className="font-medium text-gray-200">{row.feature}</div>
                  <div className={`text-center ${row.winner === 'equity' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                    {row.equity}
                  </div>
                  <div className={`text-center ${row.winner === 'private' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                    {row.private}
                  </div>
                </div>
              ))}
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
                Professional <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-lg text-gray-400">
                Institutional-grade equity lending with competitive rates
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
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-emerald-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                      <service.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-100">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold text-sm">{service.rate}</div>
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
                Equity <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Calculators</span>
              </h2>
              <p className="text-lg text-gray-400">
                Professional calculators for equity lending analysis
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
                  className={`relative ${calc.popular ? 'ring-2 ring-emerald-500/30' : ''}`}
                >
                  {calc.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-emerald-500/20 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                          <calc.icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-100">{calc.title}</h3>
                          <p className="text-gray-400 text-sm">{calc.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
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
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Professional <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Advantages</span>
              </h2>
            </motion.div>

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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 mx-auto mb-4">
                    <advantage.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{advantage.title}</h3>
                  <p className="text-sm text-gray-400">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-t border-emerald-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Access Your <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Home's Equity?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Professional equity lending with institutional rates and white-glove service.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-400 hover:to-emerald-500 transition-all transform hover:scale-105"
                >
                  Get Pre-Approved Today
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors"
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