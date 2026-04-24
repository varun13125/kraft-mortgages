"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SCENARIOS = [
  { code: "CRD", title: "Credit Challenges", body: "Previous bankruptcy, consumer proposals, or credit issues — we look beyond the score.", features: ["Recent credit events", "Self-employed income", "Non-traditional employment", "Asset-based approval"], rate: "8% - 12%" },
  { code: "SPD", title: "Speed Requirements", body: "Time-sensitive transactions requiring fast approvals and quick closings.", features: ["Same-day approvals", "Quick closings", "Bridge financing", "Minimal documentation"], rate: "9% - 15%" },
  { code: "UNQ", title: "Unique Properties", body: "Properties that don't fit traditional lending criteria.", features: ["Rural properties", "Unique constructions", "Mixed-use buildings", "Special purpose properties"], rate: "10% - 14%" },
  { code: "ALT", title: "Alternative Income", body: "Non-traditional income sources and documentation methods.", features: ["Cash businesses", "Foreign income", "Investment income", "Bank statement programs"], rate: "8% - 13%" },
];

const CALCULATORS = [
  { title: "Alternative Income", sub: "Non-traditional income calc", href: "/private-lending/calculators/alternative-income", tag: "CORE" },
  { title: "Asset-Based Calculator", sub: "Property value vs income", href: "/private-lending/calculators/asset-based", tag: "CORE" },
  { title: "Bridge Financing", sub: "Short-term bridge costs", href: "/private-lending/calculators/bridge-financing", tag: "STD" },
  { title: "Quick Approval", sub: "Approval probability check", href: "/private-lending/calculators/quick-approval", tag: "STD" },
];

const SPECTRUM = [
  { type: "Traditional", tag: "BANK", rates: "3.5% - 6.5%", timeline: "30-45 days", docs: "Extensive", credit: "Excellent", approval: "70-80%" },
  { type: "Equity Lending", tag: "EQUITY", rates: "Prime + 0.50-2.00%", timeline: "1-2 weeks", docs: "Standard", credit: "Good", approval: "85-90%" },
  { type: "Private Lending", tag: "PRIVATE", rates: "8% - 15%+", timeline: "24-48 hours", docs: "Minimal", credit: "Flexible", approval: "95%+", highlight: true },
];

const WHEN_TO_CONSIDER = [
  "Traditional lenders have declined your application",
  "You need funding within 24-48 hours",
  "Credit challenges prevent bank approval",
  "Self-employed with complex income",
  "Unique property or transaction structure",
  "Bridge financing for time-sensitive deals",
];

const ADVANTAGES = [
  { num: "01", title: "High Approval Rates", body: "95%+ approval rate for deals that qualify, even with credit challenges." },
  { num: "02", title: "Fast Decisions", body: "Same-day approvals available for time-sensitive transactions." },
  { num: "03", title: "Flexible Terms", body: "Customizable repayment options and creative deal structuring." },
  { num: "04", title: "Asset-Based Approval", body: "Focus on property value and equity rather than just income and credit." },
];

export default function PrivateLending() {
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
              §01 · PRIVATE LENDING · ALTERNATIVE SOLUTIONS
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Private<br />
              <em className="text-term-gold italic font-normal">Lending.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-6">
              Alternative lending solutions when traditional financing isn't an option. Fast approvals, flexible terms, and creative solutions for unique scenarios.
            </p>
            <div className="inline-block border border-term-line-dim bg-term-deep p-5 mb-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-term-red text-sm">▲</span>
                <span className="font-mono text-lg text-term-red font-semibold">Higher Cost · Higher Approval</span>
              </div>
              <div className="font-mono text-[11px] text-term-text-mute tracking-[0.1em]">8-15%+ rates · 24-48 hour approvals · 95%+ approval rates</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                GET FAST APPROVAL →
              </a>
              <Link
                href="/calculators"
                className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
              >
                CALCULATE OPTIONS
              </Link>
            </div>
          </div>
        </section>

        {/* ──── LENDING SPECTRUM ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §02 · LENDING SPECTRUM
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Understand Your <em className="text-term-gold italic">Options.</em>
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-term-line-dim">
              {SPECTRUM.map((s) => (
                <div key={s.tag} className={`bg-term-bg p-8 ${s.highlight ? "border-t-2 border-t-term-gold" : "border-t border-t-term-line-dim"}`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-serif text-xl">{s.type}</span>
                    <span className={`font-mono text-[10px] tracking-[0.1em] ${s.highlight ? "text-term-gold" : "text-term-text-mute"}`}>[{s.tag}]</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-term-text-dim">Rates:</span>
                      <span className={s.highlight ? "text-term-gold font-medium" : "text-term-text"}>{s.rates}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-term-text-dim">Timeline:</span>
                      <span className="text-term-text">{s.timeline}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-term-text-dim">Docs:</span>
                      <span className="text-term-text">{s.docs}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-term-text-dim">Credit:</span>
                      <span className="text-term-text">{s.credit}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-term-text-dim">Approval:</span>
                      <span className={s.highlight ? "text-term-gold font-medium" : "text-term-text"}>{s.approval}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SCENARIOS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · PRIVATE LENDING SCENARIOS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              When Private Lending <em className="text-term-gold italic">Fits.</em>
            </h2>
            <div className="grid sm:grid-cols-2 gap-px bg-term-line-dim">
              {SCENARIOS.map((s) => (
                <div key={s.code} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{s.code}</span>
                    <span className="text-term-red">{s.rate}</span>
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

        {/* ──── WHEN TO CONSIDER ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
              §04 · WHEN TO CONSIDER PRIVATE LENDING
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-term-line-dim">
              {WHEN_TO_CONSIDER.map((reason, i) => (
                <div key={i} className="bg-term-bg p-6 flex items-start gap-3">
                  <span className="text-term-green text-[10px] mt-1">▸</span>
                  <span className="text-[14px] text-term-text-dim">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CALCULATORS ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
              §05 · CALCULATORS
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
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §06 · ADVANTAGES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Private Lending <em className="text-term-gold italic">Advantages.</em>
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
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[900px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§07 · GET STARTED</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
              Need <em className="text-term-gold italic">Fast Approval?</em>
            </h2>
            <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
              When traditional lenders say no, we find a way. Fast approvals for unique scenarios.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                GET FAST APPROVAL TODAY →
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
