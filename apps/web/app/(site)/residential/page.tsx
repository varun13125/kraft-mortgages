"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SERVICES = [
  { code: "FTB", title: "First-Time Home Buyers", body: "Specialized programs and guidance for your first home purchase.", features: ["First-time buyer incentives", "Down payment assistance", "Educational support", "Stress test guidance"] },
  { code: "REF", title: "Refinancing", body: "Lower rates, access equity, or consolidate debt into one payment.", features: ["Rate improvements", "Debt consolidation", "Home equity access", "Cash-out refinancing"] },
  { code: "RNW", title: "Mortgage Renewals", body: "Secure better terms at renewal time — don't auto-renew without checking.", features: ["Rate negotiations", "Term optimization", "Lender switching", "Early renewal options"] },
  { code: "PUR", title: "Purchase Financing", body: "Competitive rates for your next home purchase with quick decisions.", features: ["Pre-approvals", "Quick decisions", "Flexible terms", "Multiple lender options"] },
];

const CALCULATORS = [
  { title: "Affordability Calculator", sub: "How much can you buy?", href: "/calculators/affordability", tag: "CORE" },
  { title: "Payment Calculator", sub: "Monthly payment breakdown", href: "/calculators/payment", tag: "CORE" },
  { title: "Stress Test Calculator", sub: "OSFI qualification check", href: "/calculators/stress-test", tag: "STD" },
  { title: "Renewal Calculator", sub: "Compare renewal options", href: "/calculators/renewal", tag: "STD" },
  { title: "Rent vs Buy", sub: "Side-by-side comparison", href: "/calculators/rent-vs-buy", tag: "STD" },
  { title: "First-Time Buyer", sub: "Incentives & rebates", href: "/calculators/first-time-home-buyer", tag: "CORE" },
];

const BENEFITS = [
  { num: "01", title: "Expert Guidance", body: "23+ years of residential mortgage expertise across BC, AB, and ON." },
  { num: "02", title: "Multiple Lenders", body: "Access to major banks, credit unions, and alternative lenders." },
  { num: "03", title: "Competitive Rates", body: "Negotiated rates often better than bank branches." },
  { num: "04", title: "No Cost Service", body: "Lender-paid compensation means no fees to you." },
];

export default function ResidentialLending() {
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
              §01 · RESIDENTIAL LENDING · HOME FINANCING
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Residential<br />
              <em className="text-term-gold italic font-normal">Lending.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-10">
              From first-time buyers to seasoned homeowners — expert mortgage solutions for every residential financing need across BC, AB, and ON.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                START APPLICATION →
              </a>
              <Link
                href="/calculators"
                className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
              >
                USE CALCULATORS
              </Link>
            </div>
          </div>
        </section>

        {/* ──── SERVICES GRID ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §02 · RESIDENTIAL SERVICES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Solutions for Every <em className="text-term-gold italic">Scenario.</em>
            </h2>
            <div className="grid sm:grid-cols-2 gap-px bg-term-line-dim">
              {SERVICES.map((s) => (
                <div key={s.code} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{s.code}</span>
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
              §03 · CALCULATORS
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-line-dim">
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

        {/* ──── WHY CHOOSE US ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §04 · WHY KRAFT MORTGAGES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              The Residential <em className="text-term-gold italic">Advantage.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {BENEFITS.map((b) => (
                <div key={b.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{b.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{b.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{b.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[900px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§05 · GET STARTED</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
              Ready to Secure Your<br />
              <em className="text-term-gold italic">Dream Home?</em>
            </h2>
            <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
              Let our residential mortgage experts guide you through every step of the process.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                START YOUR APPLICATION →
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
