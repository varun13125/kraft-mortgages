import { motion } from "framer-motion";
import { CheckCircle, User, Building, Calendar, FileText, DollarSign, Users, MapPin } from "lucide-react";

export default function EligibilityPage() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero */}
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
              MLI Select <span className="gradient-text">Eligibility</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive requirements for borrowers, properties, and program compliance. Ensure your project qualifies for CMHC MLI Select benefits.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Borrower Requirements */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            <span className="gradient-text">Borrower</span> Requirements
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Individual Borrowers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Canadian citizen or permanent resident</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Good credit history (minimum 650+ credit score)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Stable income verification (T1, T2, or equivalent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Minimum 20% down payment or equity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Experience in property ownership or management</span>
                </li>
              </ul>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Corporate Borrowers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Canadian corporation or partnership</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Minimum 2 years of financial statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Strong debt service coverage ratios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Experienced management team required</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Clean corporate registry and tax compliance</span>
                </li>
              </ul>
            </div>

            <div className="metallic-card rounded-xl p-6">
              <div className="w-12 h-12 bg-gold-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Investment Entities</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>REITs, limited partnerships, trusts eligible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Professional management structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Experienced property management team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Transparent ownership structure</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Property Requirements */}
      <section className="px-6 py-20 metallic-dark">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            <span className="gradient-text">Property</span> Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="metallic-card rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Building className="w-6 h-6 text-gold-400" />
                Property Types
              </h3>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Eligible Properties:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Apartment buildings (5+ units)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Row/townhouse complexes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Mixed-use (residential focus)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Manufactured home parks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Student/senior housing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-gold-400" />
                Location & Criteria
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Geographic Coverage:</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    Available in all Canadian provinces and territories with CMHC underwriting guidelines.
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-200">
                    <strong>Provincial variations:</strong> Local market conditions and regulations may apply
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Minimum Requirements:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Minimum 5 residential units</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Maximum 4.0 DSCR for affordability units</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Energy efficiency baseline requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Affordability Requirements */}
      <section className="px-6 py-20 metallic-grey">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="gradient-text">Affordability</span> Requirements
          </h2>

          <div className="metallic-card rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-gold-400" />
              Rent Restrictions & Calculations
            </h3>
            
            <p className="text-gray-300 mb-6">
              For Tier 50+ eligibility, 30% of residential units must be affordable. Affordability is determined relative to:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Method 1: Area Median Income</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Median income data from Statistics Canada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Annual rental cap at 30% of AMI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Regional variations automatically adjusted</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">Method 2: Market Rent Comparison</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>At least 20% below market rents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Annual CPI adjustments for rent increases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Benchmarked against CMHC rental market data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <div className="text-blue-200 text-sm flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Pro Tip:</strong> Use our <a href="/mli-select/calculators/rent-cap" className="text-gold-400 underline">Rent Cap Calculator</a> to determine exact restrictions by property type and location.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}