"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SERVICES = [
  { code: "HEQ", title: "Home Equity Lines of Credit", body: "Access up to 80% of your home's equity with competitive institutional rates.", features: ["Institutional rates", "Flexible access", "Interest-only payments", "Reusable credit line"], rate: "Starting 4.99%" },
  { code: "DBC", title: "Debt Consolidation", body: "Consolidate high-interest debt into one manageable monthly payment.", features: ["Lower monthly payments", "Single payment", "Improved credit score", "Tax-deductible options"], rate: "4.99% - 7.95%" },
  { code: "INV", title: "Investment Opportunities", body: "Leverage your home equity for investment property down payments.", features: ["Investment property down payments", "Portfolio expansion", "Tax advantages", "Professional guidance"], rate: "5.25% - 7.95%" },
  { code: "CSH", title: "Cash-Out Refinancing", body: "Refinance and access cash for major expenses — renovations, business, education.", features: ["Home renovations", "Business investments", "Education funding", "Emergency reserves"], rate: "5.50% - 7.95%" },
];

const CALCULATORS = [
  { title: "Home Equity Calculator", sub: "Available equity amount", href: "/calculators/home-equity", tag: "CORE" },
  { title: "Debt Consolidation", sub: "Compare consolidation savings", href: "/calculators/debt-consolidation", tag: "CORE" },
  { title: "Cash-Out Refinance", sub: "Refinancing options & costs", href: "/calculators/cash-out-refinance", tag: "STD" },
  { title: "HELOC Calculator", sub: "Credit line analysis", href: "/calculators/heloc", tag: "STD" },
];

const COMPARISON = [
  { feature: "Interest Rates", equity: "4.99% - 7.95%", private: "8% - 15%+" },
  { feature: "Approval Time", equity: "24-48 hours", private: "Same day" },
  { feature: "Documentation", equity: "Standard verification", private: "Minimal docs" },
  { feature: "Professional Service", equity: "Full-service support", private: "Basic service" },
  { feature: "Long-term Cost", equity: "Significantly lower", private: "Much higher" },
  { feature: "Reputation", equity: "Institutional backing", private: "Varies widely" },
];

const ADVANTAGES = [
  { num: "01", title: "Institutional Rates", body: "Access rates typically reserved for banks and credit unions, not private lenders." },
  { num: "02", title: "Professional Service", body: "White-glove service with dedicated account management and ongoing support." },
  { num: "03", title: "Fast Approvals", body: "Streamlined process with decisions in 24-48 hours for qualified applicants." },
  { num: "04", title: "Flexible Terms", body: "Customizable repayment options and credit facilities to match your needs." },
];

export default function EquityLending() {
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
              §01 · EQUITY LENDING · INSTITUTIONAL RATES
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Equity<br />
              <em className="text-term-gold italic font-normal">Lending.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-6">
              Professional equity lending solutions with institutional rates. Access your home's equity through established lenders, not high-cost private alternatives.
            </p>
            <div className="inline-block border border-term-line-dim bg-term-deep p-5 mb-10">
              <div className="font-mono text-lg text-term-gold font-semibold mb-1">Starting from Prime + 0.50%</div>
              <div className="font-mono text-[11px] text-term-text-mute tracking-[0.1em]">Institutional rates · Professional service · Proven track record</div>
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
                CALCULATE EQUITY
              </Link>
            </div>
          </div>
        </section>

        {/* ──── EQUITY VS PRIVATE COMPARISON ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §02 · EQUITY VS PRIVATE
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Why Choose <em className="text-term-gold italic">Equity Lending.</em>
            </h2>
            <div className="border border-term-line-dim overflow-hidden">
              <div className="grid grid-cols-3 gap-px bg-term-line-dim">
                <div className="bg-term-bg p-4" />
                <div className="bg-term-bg p-4 text-center">
                  <div className="font-serif text-lg text-term-gold">Equity Lending</div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">PROFESSIONAL · INSTITUTIONAL</div>
                </div>
                <div className="bg-term-bg p-4 text-center">
                  <div className="font-serif text-lg text-term-red">Private Lending</div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">ALTERNATIVE · HIGH-COST</div>
                </div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 gap-px bg-term-line-dim ${i % 2 === 0 ? "" : ""}`}>
                  <div className="bg-term-bg p-4 text-[13px] text-term-text">{row.feature}</div>
                  <div className="bg-term-bg p-4 text-[13px] text-center text-term-green">{row.equity}</div>
                  <div className="bg-term-bg p-4 text-[13px] text-center text-term-text-dim">{row.private}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SERVICES GRID ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · EQUITY SOLUTIONS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Institutional-Grade <em className="text-term-gold italic">Solutions.</em>
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

        {/* ──── CALCULATORS ──── */}
        <section className="py-14 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
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

        {/* ──── ADVANTAGES ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §05 · PROFESSIONAL ADVANTAGES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              The Equity <em className="text-term-gold italic">Advantage.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {ADVANTAGES.map((a) => (
                <div key={a.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{a.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{a.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{a.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[900px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§06 · GET STARTED</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
              Ready to Access Your<br />
              <em className="text-term-gold italic">Home's Equity?</em>
            </h2>
            <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
              Professional equity lending with institutional rates and white-glove service.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                GET PRE-APPROVED TODAY →
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
