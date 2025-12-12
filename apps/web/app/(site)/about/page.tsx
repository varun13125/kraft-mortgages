"use client";
import { motion } from "framer-motion";
import { Award, Shield, Users, Building, Target, Clock, Briefcase, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function AboutUs() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                About Kraft Mortgages
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">About</span> Kraft Mortgages
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Two decades of expertise. Three provinces. One mission: Making complex mortgages simple.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                  Established in <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">2014</span>
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Kraft Mortgages Canada Inc. was founded with a clear vision: to provide sophisticated mortgage solutions
                  that go beyond traditional brokering. We recognized that the Canadian mortgage landscape was becoming
                  increasingly complex, with borrowers facing unique challenges that required specialized expertise.
                </p>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Today, we're proud to be recognized as specialists in three critical areas: MLI Select multi-unit financing,
                  construction mortgages with progressive draws, and self-employed mortgage solutions. Our expertise in these
                  complex scenarios sets us apart from conventional brokers.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  With licenses across British Columbia, Alberta, and Ontario, we bring local market knowledge combined with
                  national lending relationships to deliver optimal outcomes for our clients.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: "$2B+", label: "Total Funded" },
                  { number: "10,000+", label: "Families Helped" },
                  { number: "500+", label: "Complex Cases" },
                  { number: "11", label: "Years of Excellence" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-gold-400 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                  Our <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Leadership Team</span>
                </h2>
                <p className="text-lg text-gray-400">
                  Decades of combined experience in Canadian mortgage markets
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Varun Chaudhry */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                      <span className="text-2xl font-bold text-gold-400">VC</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">Varun Chaudhry</h3>
                      <p className="text-gold-400">Founder & Principal Broker</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">18+ Years Industry Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">Licensed in BC, AB, ON</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">MLI Select & Construction Specialist</span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    With over two decades in the mortgage industry, Varun has built a reputation as the go-to expert
                    for complex financing scenarios. His deep understanding of MLI Select programs has saved developers
                    millions in insurance premiums.
                  </p>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Varun's expertise spans construction financing with progressive draws, self-employed mortgage solutions,
                    and multi-provincial transactions. He has successfully navigated challenging files that other brokers
                    deemed impossible.
                  </p>

                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-500">
                      <strong>Licenses:</strong> BCFSA #X303985 | RECA #M22001447 | FSRAO #M22001447
                    </p>
                  </div>
                </motion.div>

                {/* Gursharan Dhalwial */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                      <span className="text-2xl font-bold text-gold-400">GD</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">Gursharan Dhalwial</h3>
                      <p className="text-gold-400">Co-Founder & Senior Mortgage Advisor</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">15+ Years Industry Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">Commercial & Investment Specialist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-gray-400">First-Time Buyer Expert</span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Gursharan brings extensive expertise in commercial mortgages and investment property financing.
                    His analytical approach and deep understanding of cash flow analysis has helped hundreds of investors
                    build profitable real estate portfolios.
                  </p>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Known for his patient, educational approach with first-time buyers, Gursharan ensures clients understand
                    every aspect of their mortgage. His multi-lingual capabilities serve our diverse client base across
                    Western Canada.
                  </p>

                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-500">
                      <strong>Specialties:</strong> Commercial lending, Investment properties, New immigrant programs
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                  Our Core <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Expertise</span>
                </h2>
                <p className="text-lg text-gray-400">
                  Specialized knowledge in complex mortgage scenarios
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Building,
                    title: "MLI Select Program",
                    points: [
                      "CMHC multi-unit specialist",
                      "Energy efficiency optimization",
                      "Affordability scoring expertise",
                      "Premium reduction strategies"
                    ]
                  },
                  {
                    icon: Briefcase,
                    title: "Construction Financing",
                    points: [
                      "Progressive draw scheduling",
                      "Cost-to-complete analysis",
                      "Builder mortgage programs",
                      "Land development loans"
                    ]
                  },
                  {
                    icon: Users,
                    title: "Self-Employed Solutions",
                    points: [
                      "Stated income programs",
                      "Bank statement programs",
                      "Business-for-self mortgages",
                      "Alternative documentation"
                    ]
                  }
                ].map((expertise, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                      <expertise.icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">{expertise.title}</h3>
                    <ul className="space-y-2">
                      {expertise.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                  Why Choose <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Kraft Mortgages</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Target,
                    title: "Solution-Focused",
                    description: "We don't just find mortgages, we architect financial solutions"
                  },
                  {
                    icon: Clock,
                    title: "Speed & Efficiency",
                    description: "Complex files approved in days, not weeks"
                  },
                  {
                    icon: Shield,
                    title: "Triple Licensed",
                    description: "Full coverage across BC, Alberta, and Ontario markets"
                  },
                  {
                    icon: Award,
                    title: "Proven Track Record",
                    description: "$2B+ funded with 98% approval rate on submitted files"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-gold-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Experience the <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Kraft Difference</span>?
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Let's discuss your unique mortgage needs and find the perfect solution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                >
                  Start Your Application
                </a>
                <a
                  href="tel:604-593-1550"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 604-593-1550
                </a>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-100">Head Office</p>
                    <p className="text-sm text-gray-400">#301 1688 152nd Street<br />Surrey, BC V4A 4N2</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-100">Phone</p>
                    <p className="text-sm text-gray-400">604-593-1550 (Office)<br />604-727-1579 (Varun)<br />604-725-0134 (Gursharan)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-100">Email</p>
                    <p className="text-sm text-gray-400">info@kraftmortgages.ca<br />varun@kraftmortgages.ca<br />gursharan@kraftmortgages.ca</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}