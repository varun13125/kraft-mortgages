"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export default function CalgaryPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-transparent">
        {/* Hero */}
        <section className="py-20 px-4 bg-transparent">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
              <MapPin className="w-4 h-4" />
              Calgary, AB
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Calgary's Premier Mortgage Brokerage
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Navigating Calgary's dynamic real estate market takes more than luck — it takes a mortgage broker who knows every neighbourhood, from Beltline condos to detached homes in Mahogany, and every strategy to secure the best rates.
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
            <h2 className="text-3xl font-bold mb-6 text-center">The Calgary Mortgage Market</h2>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-xl">
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Calgary's real estate market has experienced rapid growth, with the average home price near $580,000 in early 2025. Driven by interprovincial migration and strong economic fundamentals, the market spans highly sought-after inner-city condos and expansive suburban single-family developments.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Whether you are buying your first condo in the Beltline, upgrading to a detached home in Aspen Woods, or investing in a rental property in Mahogany, having a mortgage broker who understands Calgary's micro-markets is essential. Kraft Mortgages brings access to over 40 top lenders and customized rate structures under RECA compliance.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our Calgary team has deep expertise in structured progress draws for custom builders, refinancing pipelines for equity extraction, and alternative lending strategies for self-employed professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Calgary</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Home className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">First-Time Buyer Programs</h3>
                <p className="text-gray-400">Calgary is highly attractive for first-time buyers. We help you maximize your purchasing power with down payment strategies, FHSA timing, and optimal lender selection.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Builder Progress Draws</h3>
                <p className="text-gray-400">Building in Mahogany or Aspen Woods? We structure progress draw mortgages that align perfectly with construction schedules, keeping your build moving smoothly.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Relocation Mortgages</h3>
                <p className="text-gray-400">Relocating from Vancouver or Toronto? We secure pre-approvals using your confirmed transition income, ensuring a stress-free transition to Alberta.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Local */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose a Local Calgary Mortgage Broker?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Calgary's real estate market moves fast and rewards preparation. A local broker understands Alberta's land title registration system, property transfer procedures, and local market dynamics, assuring a smooth closing process.
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
                  <span className="text-gold-400">Q:</span> What is the minimum down payment required in Calgary?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  For homes under $500,000, the minimum is 5%. For homes between $500,000 and $999,999, it is 5% on the first $500,000 and 10% on the remainder. For homes over $1 million, it is 20%. Given Calgary's relative affordability, many buyers can enter the market with under $40,000 down.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How does the Alberta prompt-pay legislation affect builder mortgages in Calgary?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Alberta's prompt payment rules keep construction projects moving. For custom home builds or developer draws in neighbourhoods like Mahogany or Aspen Woods, we structure progress draw mortgages that align perfectly with contractor billing schedules.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> Can I qualify for a Calgary mortgage using interprovincial relocation income?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Yes! Many buyers relocating from Vancouver or Toronto purchase homes in Calgary before moving. If you have a confirmed job offer or remote work agreement with your employer, we have lenders who will approve your mortgage based on that transition income.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What are the best neighbourhoods for first-time buyers in Calgary?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Neighbourhoods like Evanston and Redstone in the north, or legacy communities in the south, offer excellent value-per-square-foot. Inner-city areas like the Beltline and Bridgeland are popular for condos. We can help you secure pre-approvals for all options.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> Do I need a local Calgary mortgage broker?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Absolutely. A local broker understands Alberta's land title registration system, property transfer procedures, and local market dynamics, assuring a smooth closing process.
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
              <div>📍 Operational Footprint Vector: Calgary Hub</div>
              <div>🛡️ Compliance Licensing: RECA Multi-Jurisdictional Framework</div>
              <div>📋 License Identifier: LIC-00655428</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Move in Calgary?</h2>
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
