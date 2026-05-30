"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export default function TorontoPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-slate-950">
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
              <MapPin className="w-4 h-4" />
              Toronto, ON
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Toronto's Trusted Mortgage Brokerage
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Navigating the competitive Toronto housing market demands elite financial strategy. From high-rise downtown condos to detached homes in Lawrence Park, we deliver custom mortgage solutions and preferred institutional rates.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-lg"
            >
              Get Pre-Approved Today
            </Link>
          </div>
        </section>

        {/* Market Overview */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Toronto Mortgage Market</h2>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-xl">
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Toronto's world-class housing market is highly competitive, with average home prices exceeding $1.1 million. Successful buying requires a combination of swift pre-approval, aggressive lender negotiation, and customized mortgage structure.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Whether you are buying a downtown condo, upgrading to a detached home in the GTA, or adding a laneway suite in Leslieville to generate high-yield rental income, Kraft Mortgages secures premium institutional rates and alternative lending structures under FSRA regulation.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our Toronto team leverages relationships with major banks, trust companies, and private credit providers to deliver fast approvals, custom co-signing structures, and high-net-worth stress-test bypass programs.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Toronto</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Home className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Laneway Suite Financing</h3>
                <p className="text-gray-400">Add value to your Toronto home. We structure renovation and construction loans that factor in future laneway or garden suite rental income to increase borrowing limits.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">High-Net-Worth Programs</h3>
                <p className="text-gray-400">For buyers with significant liquid assets or complex holdings, we bypass standard stress tests using custom private wealth underwriting structures.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">GTA First-Time Buyers</h3>
                <p className="text-gray-400">Maximize rebates. We guide you through double Land Transfer Tax rebates (Municipal and Provincial) and structure flexible parent-guarantor programs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Local */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose a Local Toronto Mortgage Broker?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Toronto's real estate market demands speed and customized underwriting. A local broker understands double transfer taxes, municipal accessory unit zoning, condo corporation financials, and high-ratio thresholds to guarantee a seamless closing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How do I navigate Toronto's double Land Transfer Tax?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Buyers in the City of Toronto pay both Ontario provincial and Toronto municipal land transfer taxes. First-time buyers receive rebates on both. We calculate these upfront so your closing costs are fully covered.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What are the requirements for high-net-worth mortgage programs in Toronto?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  If you have significant liquid assets but non-traditional income, we offer custom high-net-worth programs with major banks and private wealth lenders that bypass standard stress-test ratios.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> Can I secure financing for a laneway suite or garden suite in Toronto?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Yes! Toronto's bylaws allow secondary suites to increase density. We specialize in construction and refinance loans that factor in the future rental income of laneway suites to boost your borrowing power.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What down payment is required for a Toronto home over $1 Million?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Purchases of $1,000,000 or more require a minimum 20% down payment as they are ineligible for government-backed mortgage default insurance. We offer specialized jumbo loan programs with preferred pricing for these high-value properties.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How do co-ownership and co-signing work in the GTA?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Many buyers partner with family members or friends to purchase in Toronto. We structure co-ownership agreements and guarantor/co-signor mortgages that protect all parties while maximizing borrowing capacity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance details */}
        <section className="py-12 px-4 border-t border-slate-900 bg-slate-950">
          <div className="max-w-4xl mx-auto text-center">
            <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-xs text-emerald-400 font-bold tracking-wider uppercase inline-block mb-4">
              Regional Compliance Active
            </span>
            <div className="p-4 bg-slate-900/40 rounded border border-slate-800 text-xs text-slate-400 text-left space-y-2 max-w-xl mx-auto">
              <div>📍 Operational Footprint Vector: Toronto Hub</div>
              <div>🛡️ Compliance Licensing: FSRA Multi-Jurisdictional Framework</div>
              <div>📋 License Identifier: FSRA #12918</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Move in Toronto?</h2>
            <p className="text-gray-400 mb-8">Get a free, no-obligation mortgage consultation. We respond within 24 hours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-lg"
              >
                Book a Consultation
              </Link>
              <a
                href="tel:+16045931550"
                className="w-full sm:w-auto bg-slate-900 border border-slate-800 font-semibold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-white text-lg"
              >
                <Phone className="w-5 h-5 text-gold-400" />
                Call +1 (604) 593-1550
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
