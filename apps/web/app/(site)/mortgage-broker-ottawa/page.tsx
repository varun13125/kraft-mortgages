"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export default function OttawaPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-transparent">
        {/* Hero */}
        <section className="py-20 px-4 bg-transparent">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
              <MapPin className="w-4 h-4" />
              Ottawa, ON
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ottawa's Trusted Mortgage Brokerage
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Secure your home in Canada's capital with confidence. From public sector professionals to tech sector innovators, we provide customized mortgage solutions and market-leading rates across Ottawa.
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
            <h2 className="text-3xl font-bold mb-6 text-center">The Ottawa Mortgage Market</h2>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-xl">
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Ottawa's real estate market is characterized by stability and consistent demand, anchored by a strong public sector and a thriving technology hub. Average home prices average around $650,000, offering an attractive balance of urban lifestyle and value.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Whether you are buying in the family-friendly suburbs of Orleans, a tech-centered home in Kanata, or a heritage brick property in the Glebe, Kraft Mortgages delivers highly competitive interest rates and structured underwriting under FSRA compliance.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We specialize in matching Ottawa public servants with specialized low-ratio incentives, helping high-tech contractors utilize complex compensation profiles, and coordinating cash-back structures to cover closing costs.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-slate-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Ottawa</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Home className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Public Servant Stability</h3>
                <p className="text-gray-400">Federal and provincial public servants enjoy high stability. We leverage your employment status to negotiate premium rate discounts and flexible underwriting.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Tech Innovator Loans</h3>
                <p className="text-gray-400">Work in Kanata's tech sector? We use specialized lenders who recognize stock options, bonuses, and tech-consultant structures as qualifying income.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all">
                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Heritage Property Structuring</h3>
                <p className="text-gray-400">Buying in the Glebe or Rockcliffe Park? We structure custom appraisal and financing programs that align with unique heritage guidelines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Local */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose a Local Ottawa Mortgage Broker?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Ottawa's market requires an understanding of diverse employment profiles and suburban micro-climates. A local broker guarantees that your file is positioned perfectly to leverage public stability or tech compensation for maximum rate cuts.
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
                  <span className="text-gold-400">Q:</span> Do you offer specialized mortgage programs for Ottawa public servants?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Yes! Public sector employees enjoy stable, predictable income that lenders love. We leverage your employment status to secure premium rate discounts and flexible underwriting terms with top-tier lenders.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How do I qualify for a mortgage if I work in Ottawa's tech sector?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Tech professionals often have complex compensation, including stock options, bonuses, or contract income. We work with specialized lenders who recognize these alternative compensation streams as qualifying income.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> What should I know about buying in Ottawa's heritage districts?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Purchasing in historic areas like the Glebe or Rockcliffe Park requires understanding heritage guidelines and potential renovation restrictions. We ensure your appraisal and financing structure align with these unique property profiles.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> Are there cash-back mortgage options available in Ottawa?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Yes, cash-back mortgages can help cover land transfer taxes, moving expenses, or immediate renovations. We analyze whether the slightly higher interest rate is worth the upfront cash payout for your situation.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                  <span className="text-gold-400">Q:</span> How does buying in Kanata compare to Orleans from a lender's perspective?
                </h3>
                <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                  Lenders view both suburbs favorably, but Kanata's high concentration of tech employers and Orleans' rapid transit expansion create slightly different local market metrics. We optimize your application based on neighbourhood-specific property values.
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
              <div>📍 Operational Footprint Vector: Ottawa Hub</div>
              <div>🛡️ Compliance Licensing: FSRA Multi-Jurisdictional Framework</div>
              <div>📋 License Identifier: FSRA #12918</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Move in Ottawa?</h2>
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
