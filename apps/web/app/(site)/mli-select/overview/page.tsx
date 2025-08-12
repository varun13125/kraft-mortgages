import { motion } from "framer-motion";
import { MapPin, CheckCircle, DollarSign, Building, Users, Clock, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProgramOverview() {
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
              <Building className="w-4 h-4" />
              <span>CMHC MLI Select Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              MLI Select <span className="gradient-text">Program Overview</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive guide to CMHC's premier multi-unit mortgage insurance program. Learn how to maximize your premium savings and financing benefits.
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
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            What is <span className="gradient-text">MLI Select</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-gray-300 mb-6 text-lg">
                MLI Select is CMHC's next-generation mortgage insurance program designed specifically for multi-unit residential properties with 5 or more units. It replaces the traditional approach with a modern, incentive-based system.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Tier-Based System</h4>
                    <p className="text-sm text-gray-300">Achieve 50, 70, or 100 points across three pillars</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Premium Reductions</h4>
                    <p className="text-sm text-gray-300">Up to 50% reduction in CMHC insurance premiums</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Enhanced Terms</h4>
                    <p className="text-sm text-gray-300">Longer amortization and higher loan-to-value ratios</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="metallic-card rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Program Highlights</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-gold-400">50%</div>
                  <div className="text-gray-300">Max Premium Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold-400">95%</div>
                  <div className="text-gray-300">Maximum LTV</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold-400">5+</div>
                  <div className="text-gray-300">Minimum Units</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold-400">40-yrs</div>
                  <div className="text-gray-300">Amortization</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/mli-select/eligibility" className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors">
              Check Eligibility
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Program <span className="gradient-text">Features</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Premium Reductions</h3>
              <p className="text-gray-300 text-sm mb-4">
                Significant premium reductions based on program achievements across affordability, energy efficiency, and accessibility targets.
              </p>
              <div className="text-gold-400 text-sm font-medium">Up to 50% reduction</div>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Extended Amortization</h3>
              <p className="text-gray-300 text-sm mb-4">
                Qualifying projects can access longer amortization periods, improving cash flow and project feasibility.
              </p>
              <div className="text-gold-400 text-sm font-medium">Up to 40 years</div>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Investor Benefits</h3>
              <p className="text-gray-300 text-sm mb-4">
                Enhanced underwriting flexibility and improved loan terms for qualifying multi-unit residential projects.
              </p>
              <div className="text-gold-400 text-sm font-medium">Multi investor friendly</div>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Streamlined Process</h3>
              <p className="text-gray-300 text-sm mb-4">
                Simplified application process with clear documentation requirements and faster approval timelines.
              </p>
              <div className="text-gold-400 text-sm font-medium">Efficient processing</div>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">National Coverage</h3>
              <p className="text-gray-300 text-sm mb-4">
                Available across Canada with regional variations and local market considerations.
              </p>
              <div className="text-gold-400 text-sm font-medium">Across provinces</div>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">All Property Types</h3>
              <p className="text-gray-300 text-sm mb-4">
                Covers market, non-market, and mixed-use properties with flexible use restrictions and zoning allowances.
              </p>
              <div className="text-gold-400 text-sm font-medium">Inclusive eligibility</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            MLI Select vs. <span className="gradient-text">Traditional MLI</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800/50 rounded-xl overflow-hidden">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                  <th className="px-6 py-4 text-left text-gold-400 font-semibold">MLI Select</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">Traditional MLI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white">Premium Structure</td>
                  <td className="px-6 py-4 text-gray-300">Tier-based reductions up to 50%</td>
                  <td className="px-6 py-4 text-gray-400">Fixed standard rates</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/50">
                  <td className="px-6 py-4 text-white">Amortization</td>
                  <td className="px-6 py-4 text-gray-300">Up to 40 years based on achievements</td>
                  <td className="px-6 py-4 text-gray-400">Standard 25-30 years</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white">Flexibility</td>
                  <td className="px-6 py-4 text-gray-300">Multiple investor-friendly underwriting</td>
                  <td className="px-6 py-4 text-gray-400">Limited investor accommodation</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/50">
                  <td className="px-6 py-4 text-white">Documentation</td>
                  <td className="px-6 py-4 text-gray-300">Streamlined requirements</td>
                  <td className="px-6 py-4 text-gray-400">Comprehensive documentation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <Link href="/mli-select/compare-programs" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors">
              Detailed Comparison
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}