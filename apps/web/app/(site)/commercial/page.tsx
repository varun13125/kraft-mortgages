"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SERVICES = [
  { code: "MUR", title: "Multi-Unit Residential", body: "Apartment buildings, condos, and rental properties with 5+ units.", features: ["5+ unit buildings", "Investment analysis", "Cash flow optimization", "Refinancing options"], rate: "Prime + 1.50%+" },
  { code: "OFC", title: "Office & Retail", body: "Commercial office buildings and retail properties, owner-occupied or investment.", features: ["Owner-occupied", "Investment properties", "Mixed-use buildings", "Ground floor retail"], rate: "Competitive rates" },
  { code: "IND", title: "Industrial Properties", body: "Warehouses, manufacturing, and industrial facilities.", features: ["Manufacturing facilities", "Warehouse properties", "Distribution centers", "Industrial condos"], rate: "Market rates" },
  { code: "REF", title: "Commercial Refinancing", body: "Refinance existing commercial mortgages for better terms.", features: ["Rate improvements", "Cash-out refinancing", "Debt consolidation", "Term optimization"], rate: "Prime + 1.25%+" },
];

const CALCULATORS = [
  { title: "Cash Flow Calculator", sub: "Property cash flow & DSCR", href: "/commercial/calculators/cash-flow", tag: "CORE" },
  { title: "NOI Analysis", sub: "Net Operating Income", href: "/commercial/calculators/noi-analysis", tag: "CORE" },
  { title: "Cap Rate Calculator", sub: "Property valuations", href: "/commercial/calculators/cap-rate", tag: "STD" },
  { title: "Commercial Refinance", sub: "Compare refinancing options", href: "/commercial/calculators/refinance", tag: "STD" },
];

const REQUIREMENTS = [
  { code: "FIN", title: "Financial Requirements", items: ["Minimum $500,000 loan amount", "25-30% down payment typical", "1.20+ Debt Service Coverage Ratio", "Strong personal/corporate financials"] },
  { code: "PRP", title: "Property Requirements", items: ["Professional appraisal required", "Environmental assessment", "Property condition report", "Zoning compliance verification"] },
  { code: "DOC", title: "Documentation", items: ["3 years financial statements", "Rent rolls and lease agreements", "Operating expense statements", "Property tax assessments"] },
  { code: "TIM", title: "Approval Timeline", items: ["Pre-approval: 3-5 business days", "Full approval: 2-4 weeks", "Complex deals: 4-6 weeks", "Expedited options available"] },
];

const EXPERTISE = [
  { num: "01", title: "Commercial Specialists", body: "Dedicated commercial lending team with decades of experience in complex transactions." },
  { num: "02", title: "Lender Network", body: "Access to major banks, credit unions, and alternative commercial lenders across Canada." },
  { num: "03", title: "Fast Decisions", body: "Streamlined approval process with pre-approvals available in 3-5 business days." },
  { num: "04", title: "Complex Deals", body: "Experience with challenging transactions including mixed-use and special purpose properties." },
];

export default function CommercialLending() {
  return (
    <>
      <Navigation />
      <main className="bg-term-bg text-term-text font-sans text-sm leading-relaxed">

        {/* ──── HERO ──── */}
        <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 term-grid-bg opacity-20 pointer-events-none" />
          <div className="max-w-[1400px] mx-auto relative">
            <div className="flex items-center gap-2.5 mb-7 font-mono text-[11px] text-term-gold tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-term-green shadow-[0_0_8px_rgba(95,179,128,0.8)]" />
              §01 · COMMERCIAL LENDING · INVESTMENT PROPERTIES
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Commercial<br />
              <em className="text-term-gold italic font-normal">Lending.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-6">
              Professional commercial mortgage solutions for multi-unit residential, office, retail, and industrial properties. Expert analysis and competitive rates across 30+ lenders.
            </p>
            <div className="inline-block border border-term-line-dim bg-term-deep p-5 mb-10">
              <div className="font-mono text-lg text-term-gold font-semibold mb-1">From Prime + 1.25%</div>
              <div className="font-mono text-[11px] text-term-text-mute tracking-[0.1em]">Competitive rates · Expert analysis · Fast approvals</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                GET PRE-APPROVED →
              </a>
              <Link
                href="/calculators"
                className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
              >
                ANALYZE CASH FLOW
              </Link>
            </div>
          </div>
        </section>

        {/* ──── SERVICES GRID ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §02 · COMMERCIAL SOLUTIONS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Financing for Every <em className="text-term-gold italic">Property Type.</em>
            </h2>
            <div className="grid sm:grid-cols-2 gap-px bg-term-line-dim">
              {SERVICES.map((s) => (
                <div key={s.code} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{s.code}</span>
                    <span className="text-term-text-dim">{s.rate}</span>
                  </div>
                  <h3 className="font-serif text-2xl tracking-[-0.02em] mb-2 leading-tight">{s.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed mb-5">{s.body}</div>
                  <div className="space-y-2">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-[12px] text-term-text-mute">
                        <span className="text-term-green text-[10px]">▸</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── REQUIREMENTS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · REQUIREMENTS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              What You Need for <em className="text-term-gold italic">Approval.</em>
            </h2>
            <div className="grid sm:grid-cols-2 gap-px bg-term-line-dim">
              {REQUIREMENTS.map((r) => (
                <div key={r.code} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.1em] mb-4">{r.code}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-5">{r.title}</h3>
                  <div className="space-y-2.5">
                    {r.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[12px] text-term-text-dim">
                        <span className="text-term-green text-[10px]">▸</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CALCULATORS ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
              §04 · CALCULATORS
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {CALCULATORS.map((calc, i) => (
                <Link key={i} href={calc.href as any} className="bg-term-bg p-6 group block hover:bg-white/[0.02] transition-colors border-t-2 border-t-term-gold">
                  <div className="flex justify-between items-center mb-4 font-mono text-[10px]">
                    <span className="text-term-gold tracking-[0.1em]">{calc.tag}</span>
                  </div>
                  <div className="font-serif text-base tracking-[-0.02em] mb-1 group-hover:text-term-gold transition-colors">{calc.title}</div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">{calc.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── EXPERTISE ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §05 · COMMERCIAL EXPERTISE
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Why Kraft for <em className="text-term-gold italic">Commercial.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {EXPERTISE.map((e) => (
                <div key={e.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{e.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{e.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{e.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[900px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§06 · GET STARTED</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
              Ready to Finance Your<br />
              <em className="text-term-gold italic">Commercial Property?</em>
            </h2>
            <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
              Our commercial lending specialists will structure the optimal financing for your investment.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                START COMMERCIAL APPLICATION →
              </a>
              <a
                href="tel:604-593-1550"
                className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
              >
                CALL 604-593-1550
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
