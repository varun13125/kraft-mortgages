"use client";
import { motion } from "framer-motion";
import { Award, Shield, Users, Building, Target, Clock, Briefcase, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">About</span> Kraft Mortgages
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Two decades of expertise. Three provinces. One mission: Making complex mortgages simple.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Company Overview */}
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
                Established in <span className="gradient-text">2014</span>
              </h2>
              <p className="text-gray-300 mb-4">
                Kraft Mortgages Canada Inc. was founded with a clear vision: to provide sophisticated mortgage solutions 
                that go beyond traditional brokering. We recognized that the Canadian mortgage landscape was becoming 
                increasingly complex, with borrowers facing unique challenges that required specialized expertise.
              </p>
              <p className="text-gray-300 mb-4">
                Today, we're proud to be recognized as specialists in three critical areas: MLI Select multi-unit financing, 
                construction mortgages with progressive draws, and self-employed mortgage solutions. Our expertise in these 
                complex scenarios sets us apart from conventional brokers.
              </p>
              <p className="text-gray-300">
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
                  className="metallic-card rounded-xl p-6 text-center"
                >
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Leadership Team */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Leadership Team</span>
            </h2>
            <p className="text-lg text-gray-300">
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
              className="metallic-card rounded-2xl p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">VC</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Varun Chaudhry</h3>
                  <p className="text-gold-400">Founder & Principal Broker</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">23+ Years Industry Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">Licensed in BC, AB, ON</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">MLI Select & Construction Specialist</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                With over two decades in the mortgage industry, Varun has built a reputation as the go-to expert 
                for complex financing scenarios. His deep understanding of MLI Select programs has saved developers 
                millions in insurance premiums.
              </p>
              
              <p className="text-gray-300 mb-4">
                Varun's expertise spans construction financing with progressive draws, self-employed mortgage solutions, 
                and multi-provincial transactions. He has successfully navigated challenging files that other brokers 
                deemed impossible.
              </p>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
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
              className="metallic-card rounded-2xl p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">GD</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Gursharan Dhalwial</h3>
                  <p className="text-gold-400">Co-Founder & Senior Mortgage Advisor</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">15+ Years Industry Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">Commercial & Investment Specialist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-300">First-Time Buyer Expert</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                Gursharan brings extensive expertise in commercial mortgages and investment property financing. 
                His analytical approach and deep understanding of cash flow analysis has helped hundreds of investors 
                build profitable real estate portfolios.
              </p>
              
              <p className="text-gray-300 mb-4">
                Known for his patient, educational approach with first-time buyers, Gursharan ensures clients understand 
                every aspect of their mortgage. His multi-lingual capabilities serve our diverse client base across 
                Western Canada.
              </p>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  <strong>Specialties:</strong> Commercial lending, Investment properties, New immigrant programs
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Expertise */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-lg text-gray-300">
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
                className="metallic-card rounded-xl p-6"
              >
                <expertise.icon className="w-10 h-10 text-gold-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">{expertise.title}</h3>
                <ul className="space-y-2">
                  {expertise.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">Kraft Mortgages</span>
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
                <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 py-20 bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the <span className="gradient-text">Kraft Difference</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Let's discuss your unique mortgage needs and find the perfect solution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/calculators/affordability" className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors">
              Start Your Application
            </Link>
            <a href="tel:1-800-KRAFT-MTG" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call 1-800-KRAFT-MTG
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-500 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Head Office</p>
                <p className="text-sm text-gray-300">301-1688 152nd Street<br />Surrey, BC V4A 4N2</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold-500 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="text-sm text-gray-300">1-800-KRAFT-MTG<br />(604) 555-0123</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold-500 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="text-sm text-gray-300">info@kraftmortgages.ca<br />varun@kraftmortgages.ca</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}