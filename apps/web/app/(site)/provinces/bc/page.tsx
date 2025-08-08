"use client";
import { motion } from "framer-motion";
import { MapPin, Home, TrendingUp, Shield, Building, Users, DollarSign, CheckCircle, ArrowRight, Phone, Clock, Target } from "lucide-react";
import Link from "next/link";

export default function BC() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-900/30 border border-gold-700/50 text-gold-200 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>BCFSA Licensed #X303985</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">British Columbia</span> Mortgage Solutions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Headquartered in Surrey with deep expertise in Lower Mainland, Fraser Valley, and Vancouver Island markets
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Local Market Expertise */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Your <span className="gradient-text">BC Market</span> Experts
              </h2>
              <p className="text-gray-300 mb-4">
                With our headquarters in Surrey and over a decade serving British Columbia, we understand the unique 
                challenges and opportunities in BC&apos;s diverse real estate markets. From Vancouver&apos;s competitive 
                landscape to emerging opportunities in the Fraser Valley and Interior regions.
              </p>
              <p className="text-gray-300 mb-6">
                Our expertise spans the full spectrum of BC mortgage products, including the BC Home Owner Mortgage 
                and Equity Partnership, First-Time Home Buyers&apos; Program, and specialized construction financing for 
                the province&apos;s booming development sector.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Foreign Buyer and Speculation Tax navigation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Strata property financing expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Agricultural Land Reserve (ALR) properties</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5,000+", label: "BC Families Helped" },
                { value: "$1.2B", label: "BC Properties Funded" },
                { value: "11 Years", label: "Serving BC Markets" },
                { value: "48 hrs", label: "Average Approval Time" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="metallic-card rounded-xl p-6 text-center"
                >
                  <div className="text-2xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* BC Programs */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              BC <span className="gradient-text">Specialized Programs</span>
            </h2>
            <p className="text-lg text-gray-300">
              Expert guidance through British Columbia&apos;s unique mortgage programs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "First-Time Buyers",
                icon: Home,
                description: "BC Home Owner Mortgage & Equity Partnership",
                features: [
                  "5% down payment matching",
                  "Property Transfer Tax exemption",
                  "Up to $750K purchase price",
                  "New construction incentives"
                ]
              },
              {
                title: "Construction & Development",
                icon: Building,
                description: "Builder financing and land development",
                features: [
                  "Progressive draw mortgages",
                  "Land acquisition loans",
                  "Spec home financing",
                  "Multi-unit development"
                ]
              },
              {
                title: "Investment Properties",
                icon: TrendingUp,
                description: "Rental and vacation property solutions",
                features: [
                  "Up to 80% LTV financing",
                  "Rental income calculations",
                  "Multi-property portfolios",
                  "Short-term rental strategies"
                ]
              }
            ].map((program, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="metallic-card rounded-xl p-6"
              >
                <program.icon className="w-10 h-10 text-gold-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{program.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{program.description}</p>
                <ul className="space-y-2">
                  {program.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Regional Coverage */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Serving All <span className="gradient-text">BC Regions</span>
            </h2>
            <p className="text-lg text-gray-300">
              Local expertise across British Columbia&apos;s diverse markets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                region: "Lower Mainland",
                cities: ["Vancouver", "Surrey", "Burnaby", "Richmond"],
                specialty: "High-ratio financing & foreign buyer solutions"
              },
              {
                region: "Fraser Valley",
                cities: ["Abbotsford", "Chilliwack", "Langley", "Mission"],
                specialty: "Agricultural properties & acreage financing"
              },
              {
                region: "Vancouver Island",
                cities: ["Victoria", "Nanaimo", "Campbell River", "Courtenay"],
                specialty: "Vacation properties & retirement planning"
              },
              {
                region: "Interior/North",
                cities: ["Kelowna", "Kamloops", "Prince George", "Vernon"],
                specialty: "Resort properties & resource sector mortgages"
              }
            ].map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="metallic-card rounded-xl p-6"
              >
                <MapPin className="w-8 h-8 text-gold-500 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{area.region}</h3>
                <div className="mb-3">
                  {area.cities.map((city, j) => (
                    <span key={j} className="text-sm text-gray-400">
                      {city}{j < area.cities.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gold-400">{area.specialty}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BC Market Challenges We Solve */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              BC Market <span className="gradient-text">Challenges We Solve</span>
            </h2>
            <p className="text-lg text-gray-300">
              Specialized solutions for British Columbia&apos;s unique mortgage landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                challenge: "High Property Values",
                solution: "Creative financing structures, co-borrower strategies, and alternative lenders for high-ratio mortgages"
              },
              {
                challenge: "Foreign Buyer Restrictions",
                solution: "Navigate regulations, structure compliant purchases, and maximize available programs"
              },
              {
                challenge: "Strata Properties",
                solution: "Expert review of strata documents, depreciation reports, and contingency fund analysis"
              },
              {
                challenge: "Self-Employed in Tech/Film",
                solution: "Industry-specific income verification for BC&apos;s creative and tech sectors"
              },
              {
                challenge: "Property Transfer Tax",
                solution: "Maximize exemptions, time purchases strategically, and structure for tax efficiency"
              },
              {
                challenge: "Speculation Tax",
                solution: "Structure ownership to minimize exposure and ensure compliance"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gold-900/30 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-gold-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.challenge}</h3>
                  <p className="text-sm text-gray-300">{item.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BC Office CTA */}
      <section className="px-6 py-20 bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Visit Our <span className="gradient-text">Surrey Headquarters</span>
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Meet with our BC mortgage experts in person or connect virtually
          </p>
          
          <div className="metallic-card rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Surrey Office</p>
                  <p className="text-sm text-gray-300">301-1688 152nd Street<br />Surrey, BC V4A 4N2</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p className="text-sm text-gray-300">(604) 555-0123<br />1-800-KRAFT-MTG</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Hours</p>
                  <p className="text-sm text-gray-300">Mon-Fri: 9AM-6PM<br />Sat: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/affordability" className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2">
              Start BC Application
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:604-555-0123" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 transition-colors inline-flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call BC Office
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}