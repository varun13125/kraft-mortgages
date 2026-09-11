"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export default function EdmontonPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-transparent">
        {/* Hero */}
        <section className="py-20 px-4 bg-transparent">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
              <MapPin className="w-4 h-4" />
              Edmonton, AB
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Edmonton's Premier Mortgage Brokerage
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Edmonton's real estate market offers incredible affordability and opportunity. From mature neighbourhoods like Strathcona to new developments in Windermere, we secure the absolute lowest interest rates for your home purchase.
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
            <h2 className="text-3xl font-bold mb-6 text-center">The Edmonton Mortgage Market</h2>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-xl">
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Edmonton remains one of the most accessible major metropolitan housing markets in Canada, with average home prices hovering around $400,000. This affordability makes Edmonton a magnet for first-time home buyers and real estate investors looking for high-yield rental properties.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Whether you are buying a character home near Strathcona, building a custom property in Windermere, or investing in multi-unit properties in Griesbach, Kraft Mortgages provides the deep lender access and specialized underwriter relations needed to secure premium terms.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We work with major banks, credit unions, and alternative capital structures under full RECA compliance to deliver tailored solutions for self-employed professionals, real estate holding corporations, and relocation clients.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Edmonton</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Home className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Rental Portfolio Offsets</h3>
                <p className="text-gray-400">Edmonton has incredibly strong rental math. We work with lenders who recognize up to 80% of rental income to optimize qualification for real estate investors.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Custom Build Financing</h3>
                <p className="text-gray-400">Building in new developments like Windermere or Griesbach? We coordinate progress draws aligned with key build phases (foundation, drywall, completion).</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">First-Time Buyer Rebates</h3>
                <p className="text-gray-400">Take advantage of Edmonton's entry-level affordability. We leverage federal programs and preferred rates to get you approved with minimal down payments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Local */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose a Local Edmonton Mortgage Broker?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Edmonton's local market is distinct, spanning century-old strata rules and massive suburban communities. A local broker understands reserve fund financial audits, builder credentials, and regional municipal bylaws to keep your transaction on track.
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
                  <span className="text-gold-400">Q:</span> Why are rental property mortgages so popular in Edmonton?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Edmonton has favorable rent-to-value ratios, making cash-flow positive investment properties highly achievable. We work with lenders who recognize up to 80% of rental income to help you qualify for investment financing.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What is the process for a progress draw mortgage in Edmonton?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  When building a new home in developments like Windermere or Griesbach, a progress draw mortgage releases funds at key stages (foundation, lock-up, drywall, completion). We coordinate directly with your builder to streamline approvals.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How do I qualify as a first-time buyer in Edmonton?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  With lower average purchase prices, first-time buyers in Edmonton can often qualify with down payments under $20,000. Programs like the federal First Home Savings Account (FHSA) can be combined with our preferred lender rates to maximize your budget.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What strata considerations apply to Edmonton condos?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Lenders review the building's reserve fund study and condo corporation finances. Whether buying near the University of Alberta or downtown, we ensure your building choice meets all lending requirements.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How does the local economy affect Edmonton mortgage rates?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  While global bond yields drive fixed rates, Edmonton's diverse economic sectors (health, education, tech, energy) create unique local lending incentives. We compare over 40 lenders to find the optimal fit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance details */}
        <section className="py-12 px-4 border-t border-slate-900 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-xs text-emerald-400 font-bold tracking-wider uppercase inline-block mb-4">
              Regional Compliance Active
            </span>
            <div className="p-4 bg-slate-900/40 rounded border border-slate-800 text-xs text-slate-400 text-left space-y-2 max-w-xl mx-auto">
              <div>📍 Operational Footprint Vector: Edmonton Hub</div>
              <div>🛡️ Compliance Licensing: RECA Multi-Jurisdictional Framework</div>
              <div>📋 License Identifier: LIC-00655428</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Move in Edmonton?</h2>
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
