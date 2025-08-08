"use client";
import { useMemo, useState } from "react";
import { estimateMliPremium } from "@/lib/calc/mli";
import { motion } from "framer-motion";
import { Building, DollarSign, Target, Award, CheckCircle, Calculator, ArrowRight, Shield } from "lucide-react";
import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function MLISelect() {
  const [units, setUnits] = useState(24);
  const [price, setPrice] = useState(6500000);
  const [loan, setLoan] = useState(5200000);
  const [scores, setScores] = useState({ affordability: 65, energy: 58, accessibility: 62 });

  const result = useMemo(() => estimateMliPremium({ units, purchasePrice: price, loanAmount: loan, termYears: 10, scores }), [units, price, loan, scores]);

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
              <span>CMHC MLI Select Expert Since 2019</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">MLI Select</span> Program
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Canada&apos;s most sophisticated multi-unit mortgage insurance program. Save hundreds of thousands 
              in CMHC premiums with our expertise.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* What is MLI Select */}
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
                What is <span className="gradient-text">MLI Select</span>?
              </h2>
              <p className="text-gray-300 mb-4">
                MLI Select is CMHC&apos;s premium multi-unit mortgage insurance program designed for properties 
                with 5 or more units. It rewards sustainable building practices and affordability measures 
                with significant premium reductions.
              </p>
              <p className="text-gray-300 mb-6">
                The program evaluates properties across three pillars: Affordability, Energy Efficiency, 
                and Accessibility. Each pillar achieved can reduce your insurance premium by up to 25%, 
                with maximum savings of 50% when meeting all criteria.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Properties with 5+ residential units</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Up to 95% LTV financing available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Premium savings up to 50%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, value: "$500K+", label: "Average Savings" },
                { icon: Building, value: "100+", label: "Projects Completed" },
                { icon: Target, value: "95%", label: "Approval Rate" },
                { icon: Award, value: "#1", label: "MLI Select Broker" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="metallic-card rounded-xl p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* The Three Pillars */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Three <span className="gradient-text">Pillars</span> of MLI Select
            </h2>
            <p className="text-lg text-gray-300">
              Each pillar achieved reduces your CMHC premium by up to 25%
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Affordability",
                icon: DollarSign,
                description: "Minimum 30% of units below market rent or 10% below median income thresholds",
                benefits: [
                  "25% premium reduction",
                  "Social housing credits",
                  "Municipal incentives",
                  "Tax advantages"
                ]
              },
              {
                title: "Energy Efficiency",
                icon: Target,
                description: "15% reduction in energy consumption or specific green certifications",
                benefits: [
                  "25% premium reduction",
                  "Lower operating costs",
                  "Green financing rates",
                  "Carbon credit eligibility"
                ]
              },
              {
                title: "Accessibility",
                icon: Building,
                description: "20% of units meeting accessibility standards or universal design principles",
                benefits: [
                  "25% premium reduction",
                  "Broader tenant base",
                  "Future-proof design",
                  "Grant opportunities"
                ]
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="metallic-card rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gold-900/40 rounded-lg flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{pillar.description}</p>
                <ul className="space-y-2">
                  {pillar.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              MLI Select <span className="gradient-text">Premium Calculator</span>
            </h2>
            <p className="text-lg text-gray-300">
              Estimate your CMHC insurance premium and potential savings
            </p>
          </div>

          <div className="metallic-card rounded-2xl p-8">
            <div className="mb-6"><ComplianceBanner feature="CALC_MLI" /></div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-gray-200">Units
          <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Purchase Price
          <input type="number" value={price} onChange={e=>setPrice(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Loan Amount
          <input type="number" value={loan} onChange={e=>setLoan(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(["affordability","energy","accessibility"] as const).map((k)=> (
          <label key={k} className="grid gap-1 capitalize text-gray-200">{k} score
            <input type="number" min={0} max={100} value={(scores as any)[k]}
              onChange={e=>setScores(s=>({ ...s, [k]: +e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
          </label>
        ))}
      </div>

      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 space-y-2">
        <div className="text-gray-200">Premium Rate (est.): <strong className="text-gold-500">{(result.rate*100).toFixed(2)}%</strong></div>
        <div className="text-gray-200">Premium Amount: <strong className="text-gold-500">${result.premium.toLocaleString()}</strong></div>
        <div className="text-gray-200">Pillars Attained: <strong className="text-gold-500">{result.attained.length ? result.attained.join(", ") : "None"}</strong></div>
        <p className="text-xs text-gray-400">Figures are estimates. Confirm with official CMHC tables before advising clients.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Kraft */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Kraft for <span className="gradient-text">MLI Select</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Deep Expertise",
                description: "Completed 100+ MLI Select applications with 95% approval rate"
              },
              {
                title: "Maximum Savings",
                description: "Average client saves $500K+ in CMHC premiums through optimization"
              },
              {
                title: "Full Service",
                description: "From initial assessment to final approval and documentation"
              },
              {
                title: "Strategic Planning",
                description: "Pre-development consulting to maximize pillar achievements"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 mb-8">
              Ready to save hundreds of thousands on your multi-unit project?
            </p>
            <button className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2">
              Schedule MLI Select Consultation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
