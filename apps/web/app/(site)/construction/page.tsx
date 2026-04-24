"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SERVICES = [
  { code: "DRW", title: "Progressive Draw Construction", body: "Construction financing with scheduled draw releases tied to project milestones.", features: ["Progress-based funding", "Hold back management", "Site inspection coordination", "Completion guarantees"], rate: "Prime + 1.00%" },
  { code: "CTP", title: "Construction-to-Permanent", body: "Single-close financing from build to permanent mortgage — no second closing.", features: ["No second closing", "Rate lock options", "Simplified process", "Permanent conversion"], rate: "Competitive rates" },
  { code: "BLD", title: "Builder Programs", body: "Specialized financing for professional builders with volume discounts.", features: ["Volume discounts", "Fast approvals", "Dedicated support", "Portfolio management"], rate: "Preferred rates" },
  { code: "LND", title: "Land Development", body: "Financing for land acquisition and development with phased disbursement.", features: ["Site servicing", "Infrastructure funding", "Phased development", "Exit strategies"], rate: "Market rates" },
];

const PROCESS = [
  { step: "01", title: "Pre-Construction Planning", body: "Budget approval, plan review, and financing structure", dur: "1-2 weeks" },
  { step: "02", title: "Construction Loan Approval", body: "Final approval and construction loan documentation", dur: "1-2 weeks" },
  { step: "03", title: "Progressive Draws", body: "Scheduled funding based on construction milestones", dur: "6-18 months" },
  { step: "04", title: "Permanent Conversion", body: "Convert to permanent mortgage upon completion", dur: "1-2 weeks" },
];

const CALCULATORS = [
  { title: "Construction Budget", sub: "Full cost breakdown", href: "/construction/calculators/budget", tag: "CORE" },
  { title: "Progressive Draw", sub: "Draw schedules & interest", href: "/construction/calculators/progressive-draw", tag: "CORE" },
  { title: "Cost-to-Complete", sub: "Remaining costs tracker", href: "/construction/calculators/cost-to-complete", tag: "STD" },
  { title: "Builder Program", sub: "Volume discount analysis", href: "/construction/calculators/builder-program", tag: "STD" },
];

const EXPERTISE = [
  { num: "01", title: "18+ Years Construction Experience", body: "Deep understanding of construction financing across residential and commercial projects." },
  { num: "02", title: "Builder Relationships", body: "Established partnerships with reputable builders and contractors across BC, AB, ON." },
  { num: "03", title: "Progress Monitoring", body: "Professional site inspections and progress verification for draw releases." },
  { num: "04", title: "Risk Management", body: "Comprehensive insurance requirements and completion guarantees protection." },
];

export default function ConstructionFinancing() {
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
              §01 · CONSTRUCTION FINANCING · BUILDER SPECIALISTS
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Construction<br />
              <em className="text-term-gold italic font-normal">Financing.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-6">
              Expert construction financing with progressive draws, builder programs, and construction-to-permanent solutions. 23+ years of construction lending expertise across BC, AB, and ON.
            </p>
            <div className="inline-block border border-term-line-dim bg-term-deep p-5 mb-10">
              <div className="font-mono text-lg text-term-gold font-semibold mb-1">Starting from Prime + 1.00%</div>
              <div className="font-mono text-[11px] text-term-text-mute tracking-[0.1em]">Progressive draws · Professional inspections · Completion guarantees</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                START YOUR PROJECT →
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

        {/* ──── PROCESS TIMELINE ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-b border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
              §02 · CONSTRUCTION PROCESS
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {PROCESS.map((step) => (
                <div key={step.step} className="bg-term-bg p-6 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-4">STEP {step.step}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-2">{step.title}</h3>
                  <div className="text-[13px] text-term-text-dim mb-3">{step.body}</div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">{step.dur}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SERVICES GRID ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · CONSTRUCTION SOLUTIONS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Financing for Every <em className="text-term-gold italic">Project.</em>
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

        {/* ──── EXPERTISE ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §05 · WHY KRAFT FOR CONSTRUCTION
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Construction <em className="text-term-gold italic">Expertise.</em>
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
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[900px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§06 · GET STARTED</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
              Ready to Build Your<br />
              <em className="text-term-gold italic">Dream Project?</em>
            </h2>
            <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
              Our construction financing experts will guide your project from foundation to completion.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                START CONSTRUCTION LOAN →
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
