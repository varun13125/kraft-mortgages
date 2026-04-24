"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    code: "MLI",
    title: "MLI Select Calculators",
    tag: "CMHC · Multi-Unit",
    priority: "CORE",
    body: "Specialized calculators for developers and investors navigating CMHC's multi-unit insurance program.",
    href: "/mli-select/calculators",
    calculators: ["Points & Tier Calculator", "Premium Calculator", "DSCR Calculator", "Max Loan Calculator", "Rent Cap Calculator"],
  },
  {
    code: "RES",
    title: "Residential Lending",
    tag: "Home · Refinance · Renewal",
    priority: "STD",
    body: "Home buying, refinancing, and renewal calculators for every residential scenario.",
    href: "/residential",
    calculators: ["Affordability Calculator", "Payment Calculator", "Stress Test Calculator", "Renewal Calculator"],
  },
  {
    code: "EQY",
    title: "Equity Lending",
    tag: "HELOC · Consolidate",
    priority: "STD",
    body: "Professional equity solutions with institutional rates for debt consolidation and investment.",
    href: "/equity-lending",
    calculators: ["Home Equity Calculator", "Debt Consolidation Calculator", "Cash-Out Refinance", "HELOC Calculator"],
  },
  {
    code: "CST",
    title: "Construction Financing",
    tag: "Builders · Developers",
    priority: "CORE",
    body: "Progressive draws and construction-to-permanent financing calculators.",
    href: "/construction",
    calculators: ["Construction Budget", "Progressive Draw", "Cost-to-Complete", "Builder Program"],
  },
  {
    code: "COM",
    title: "Commercial Lending",
    tag: "Investment · NOI",
    priority: "STD",
    body: "Commercial properties and multi-unit investment analysis tools.",
    href: "/commercial",
    calculators: ["Cash Flow Calculator", "NOI Analysis", "Cap Rate Calculator", "Commercial Refinance"],
  },
  {
    code: "PRV",
    title: "Private Lending",
    tag: "Bridge · Alternative",
    priority: "SPEC",
    body: "Alternative lending solutions for unique scenarios and fast closings.",
    href: "/private-lending",
    calculators: ["Alternative Income", "Asset-Based Calculator", "Bridge Financing", "Quick Approval"],
  },
];

const QUICK_CALCULATORS = [
  { title: "Payment Calculator", sub: "Monthly payments", href: "/calculators/payment" },
  { title: "Affordability", sub: "Buying power", href: "/calculators/affordability" },
  { title: "Investment ROI", sub: "Rental analysis", href: "/calculators/investment" },
  { title: "Self-Employed", sub: "Alt income verification", href: "/calculators/self-employed" },
  { title: "Mortgage Penalty", sub: "Prepayment costs", href: "/calculators/mortgage-penalty" },
  { title: "Closing Costs", sub: "Full purchase costs", href: "/calculators/closing-costs" },
  { title: "First-Time Buyer", sub: "Incentives & rebates", href: "/calculators/first-time-home-buyer" },
  { title: "Land Transfer Tax", sub: "By province", href: "/calculators/land-transfer-tax" },
  { title: "Rent vs Buy", sub: "Side-by-side compare", href: "/calculators/rent-vs-buy" },
  { title: "Rate Comparison", sub: "Up to 4 rates", href: "/calculators/rate-comparison" },
  { title: "Debt Service Ratio", sub: "GDS/TDS check", href: "/calculators/debt-service-ratio" },
  { title: "Refinance Break-Even", sub: "Should you refi?", href: "/calculators/refinance-break-even" },
  { title: "Extra Payments", sub: "Interest savings", href: "/calculators/extra-payments" },
  { title: "Amortization", sub: "Full schedule", href: "/calculators/amortization" },
  { title: "Stress Test", sub: "OSFI qualification", href: "/calculators/stress-test" },
  { title: "Down Payment", sub: "Min down & CMHC", href: "/calculators/down-payment" },
  { title: "CMHC Insurance", sub: "Premium rates", href: "/calculators/cmhc-insurance" },
  { title: "Required Income", sub: "Income to qualify", href: "/calculators/required-income" },
  { title: "Self-Emp A vs B", sub: "Bank vs alt lender", href: "/calculators/self-employed-a-vs-b" },
  { title: "A vs Equity", sub: "Tax-aware compare", href: "/calculators/a-vs-equity" },
  { title: "B vs Equity", sub: "Alt vs private costs", href: "/calculators/b-vs-equity" },
  { title: "Refi vs HELOC vs 2nd", sub: "3 equity options", href: "/calculators/refinance-vs-heloc-vs-second" },
  { title: "BC Speculation Tax", sub: "SVT estimates", href: "/calculators/bc-speculation-tax" },
];

export default function CalculatorsHub() {
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
              §01 · CALCULATOR SUITE · 23+ TOOLS
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Mortgage <em className="text-term-gold italic font-normal">Calculators.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed">
              Professional-grade calculators for every lending scenario. From residential mortgages to complex commercial deals.
            </p>
          </div>
        </section>

        {/* ──── QUICK CALCULATORS ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
              §02 · QUICK ACCESS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {QUICK_CALCULATORS.map((calc, i) => (
                <Link key={i} href={calc.href as any} className="bg-term-bg p-5 group block hover:bg-white/[0.02] transition-colors">
                  <div className="font-serif text-base tracking-[-0.02em] mb-1 group-hover:text-term-gold transition-colors">{calc.title}</div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">{calc.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SPECIALIZED SUITES ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · SPECIALIZED CALCULATOR SUITES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-3">
              Advanced Tools by <em className="text-term-gold italic">Category.</em>
            </h2>
            <p className="text-base text-term-text-dim mb-12 max-w-[720px]">
              Organized by lending expertise. Each suite contains purpose-built calculators with professional-grade accuracy.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-line-dim">
              {SECTIONS.map((s) => (
                <Link
                  key={s.code}
                  href={s.href as any}
                  className="bg-term-bg p-8 relative group block border-t-2 hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderTopColor: s.priority === "CORE" ? "#C9A96E" : s.priority === "SPEC" ? "#D46A5F" : "rgba(232,225,210,0.35)"
                  }}
                >
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{s.code}</span>
                    <span className="text-term-text-mute tracking-[0.1em]">[{s.priority}]</span>
                  </div>
                  <h3 className="font-serif text-2xl tracking-[-0.02em] mb-1.5 leading-tight">{s.title}</h3>
                  <div className="font-mono text-[10px] text-term-text-dim tracking-[0.1em] mb-5">{s.tag}</div>
                  <div className="text-[13px] text-term-text-dim leading-relaxed mb-6">{s.body}</div>

                  <div className="space-y-1.5 mb-6">
                    {s.calculators.map((calc) => (
                      <div key={calc} className="flex items-center gap-2 text-[12px] text-term-text-mute">
                        <span className="text-term-green text-[10px]">▸</span> {calc}
                      </div>
                    ))}
                  </div>

                  <div className="font-mono text-[11px] text-term-gold tracking-[0.1em] group-hover:underline">EXPLORE →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── WHY OUR CALCULATORS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §04 · PROFESSIONAL GRADE
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Why Our <em className="text-term-gold italic">Calculators.</em>
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-term-line-dim">
              {[
                { num: "01", title: "Industry-Specific", body: "Calculators designed for specific lending scenarios with accurate formulas and current market data." },
                { num: "02", title: "Real-Time Results", body: "Instant calculations with export functionality and personalized reports delivered to your inbox." },
                { num: "03", title: "Professional Grade", body: "Used by mortgage professionals across BC, AB, and ON. Trusted by developers and investors." },
              ].map((item) => (
                <div key={item.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{item.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{item.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-[900px]">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§05 · NEED HELP?</div>
              <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-6">
                Complex Scenarios?<br />
                <em className="text-term-gold italic">We Can Help.</em>
              </h2>
              <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
                Our mortgage specialists provide personalized analysis and guidance for every scenario.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
                >
                  GET EXPERT ANALYSIS →
                </a>
                <a
                  href="tel:604-593-1550"
                  className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
                >
                  CALL 604-593-1550
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
