"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatAlex } from "@/components/ChatAlex";
import { ArrowRight, Award, Shield, Users, TrendingUp, Building, CheckCircle, Sparkles, Clock, DollarSign, Target, Briefcase } from "lucide-react";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section - Clean Professional Layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 metallic-dark" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-900/30 border border-gold-700/50 text-gold-200 text-sm font-medium mb-6"
              >
                <Shield className="w-4 h-4" />
                <span>Licensed Across BC • Alberta • Ontario</span>
              </motion.div>
              
              <div className="space-y-4 mb-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-6xl font-bold text-white"
                >
                  <span className="gradient-text">Expert Mortgage Solutions</span>
                  <br />
                  <span className="text-white">23+ Years of Excellence</span>
                </motion.h1>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl"
              >
                Specialized in MLI Select, Construction Financing, and Self-Employed mortgages. We navigate complex scenarios that others can&apos;t handle.
              </motion.p>
          
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 group">
                  Start Your Application
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 transition-colors">
                  Calculate Affordability
                </button>
              </motion.div>
            </div>

            {/* Right Column - Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="relative"
            >
              <div className="relative metallic-card rounded-2xl p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-900/40 rounded-bl-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-6">Why Choose Kraft Mortgages?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-200 font-medium">MLI Select Expert</span>
                      <p className="text-sm text-gray-400">CMHC&apos;s complex multi-unit program specialist</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-200 font-medium">Construction Financing</span>
                      <p className="text-sm text-gray-400">Progressive draws for builders & developers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-200 font-medium">Self-Employed Specialist</span>
                      <p className="text-sm text-gray-400">Alternative income verification expertise</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-200 font-medium">Multi-Provincial Coverage</span>
                      <p className="text-sm text-gray-400">Licensed expertise in BC, AB & ON markets</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Clean Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-gray-700"
          >
            {[
              { value: "$2B+", desc: "Funded", icon: DollarSign },
              { value: "23+ Years", desc: "Industry Experience", icon: Clock },
              { value: "10,000+", desc: "Families Helped", icon: Users },
              { value: "500+", desc: "Complex Cases Solved", icon: Target }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto text-gold-500 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.desc}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Clean Calculator Section */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Advanced Mortgage <span className="gradient-text">Calculators</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Industry-leading tools powered by AI to help you make informed decisions
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Payment Calculator",
                href: "/calculators/payment",
                description: "Explore different payment scenarios, frequencies, and amortization periods to find your optimal structure"
              },
              {
                title: "Affordability Analysis",
                href: "/calculators/affordability", 
                description: "Understand your true purchasing power with stress test calculations and debt service ratios"
              },
              {
                title: "Renewal Strategy",
                href: "/calculators/renewal",
                description: "Compare renewal options, calculate penalties, and determine the best timing for your renewal"
              }
            ].map((calc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={calc.href as any}>
                  <div className="group metallic-card rounded-xl p-6 hover:shadow-2xl hover:border-gold-500 transition-all cursor-pointer h-full">
                    <div className="w-12 h-12 bg-gold-900/40 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-800/60 transition-colors">
                      <Building className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-300 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {calc.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-gold-400 group-hover:text-gold-300">
                      Try Calculator
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mt-6">
            {[
              {
                title: "Construction Financing",
                href: "/calculators/construction-pro",
                description: "Plan progressive draws, manage holdbacks, and optimize cash flow for your building project"
              },
              {
                title: "Investment Analysis",
                href: "/calculators/investment",
                description: "Calculate ROI, cash flow, cap rates, and leverage strategies for rental properties"
              },
              {
                title: "Self-Employed Solutions",
                href: "/calculators/self-employed",
                description: "Navigate stated income programs and alternative documentation requirements"
              }
            ].map((calc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 3) * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={calc.href as any}>
                  <div className="group metallic-card rounded-xl p-6 hover:shadow-2xl hover:border-gold-500 transition-all cursor-pointer h-full">
                    <div className="w-12 h-12 bg-gold-900/40 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-800/60 transition-colors">
                      <Building className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-300 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {calc.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-gold-400 group-hover:text-gold-300">
                      Try Calculator
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How We Work Section */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Solution-Driven</span> Process
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We don&apos;t just find you a mortgage - we architect the right financial solution for your unique situation
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Discovery Call",
                description: "Understand your complete financial picture and long-term goals",
                icon: Briefcase
              },
              {
                step: "2",
                title: "Strategic Analysis",
                description: "Leverage 23+ years of expertise to identify optimal solutions",
                icon: Target
              },
              {
                step: "3",
                title: "Custom Solutions",
                description: "Present tailored options including MLI Select, construction, or alternative lending",
                icon: Building
              },
              {
                step: "4",
                title: "Seamless Execution",
                description: "Navigate complex requirements and documentation with ease",
                icon: CheckCircle
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="metallic-card rounded-xl p-6 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-gold-900/40 rounded-full mb-4">
                    <span className="text-gold-400 font-bold text-lg">{item.step}</span>
                  </div>
                  <item.icon className="w-8 h-8 text-gold-500 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold-500 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Client <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-lg text-gray-300">
              Real results for real people facing complex mortgage challenges
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums.",
                author: "Developer",
                location: "Surrey, BC",
                type: "MLI Select"
              },
              {
                quote: "As self-employed contractors, we thought homeownership was impossible. Kraft Mortgages found us the perfect solution within 3 weeks.",
                author: "Business Owners",
                location: "Calgary, AB",
                type: "Self-Employed"
              },
              {
                quote: "The construction financing expertise was invaluable. They structured our draws perfectly and kept our project on budget throughout.",
                author: "Custom Home Builder",
                location: "Toronto, ON",
                type: "Construction"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="metallic-card rounded-xl p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gold-900/30 text-gold-400 text-xs font-semibold rounded-full">
                      {testimonial.type}
                    </span>
                  </div>
                  <blockquote className="text-gray-200 mb-4 flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Alex Chat Assistant Section - More Honest Positioning */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quick Mortgage <span className="gradient-text">Guidance Tool</span>
            </h2>
            <p className="text-lg text-gray-300">
              Get instant answers to common mortgage questions
            </p>
          </div>
          <div className="metallic-card rounded-2xl p-8">
            <ChatAlex />
          </div>
        </motion.div>
      </section>

      {/* Provincial Coverage */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Licensed Across <span className="gradient-text">Western Canada</span>
            </h2>
            <p className="text-lg text-gray-300">
              Expert mortgage services tailored to your province
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { province: "British Columbia", href: "/provinces/bc", features: ["BCFSA Licensed", "Surrey Office", "Lower Mainland Focus"] },
              { province: "Alberta", href: "/provinces/ab", features: ["RECA Licensed", "Calgary & Edmonton", "Energy Sector Expertise"] },
              { province: "Ontario", href: "/provinces/on", features: ["FSRAO Licensed", "GTA Coverage", "First-Time Buyer Programs"] }
            ].map((prov, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={prov.href as any}>
                  <div className="group p-6 bg-gray-700 rounded-xl shadow-sm hover:shadow-lg border border-gray-600 hover:border-gold-500 transition-all cursor-pointer h-full">
                    <Building className="w-10 h-10 text-gold-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-300 transition-colors">
                      {prov.province}
                    </h3>
                    <ul className="space-y-2 mb-4">
                      {prov.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-sm font-medium text-gold-400 group-hover:text-gold-300">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your Mortgage Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of satisfied clients who&apos;ve achieved their homeownership dreams
          </p>
          <button className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto">
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Organization",
        "name":"Kraft Mortgages Canada Inc.",
        "url":process.env.NEXTAUTH_URL || "http://localhost:3000",
        "logo":"/icons/icon-192.png",
        "areaServed":["CA-BC","CA-AB","CA-ON"]
      }) }} />
    </main>
  );
}
