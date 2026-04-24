import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLI Select Mortgage Program | Complete Guide & Calculators | Kraft Mortgages",
  description: "Complete guide to CMHC MLI Select program for developers and investors. Eligibility, scoring, calculators, and application roadmap.",
  alternates: {
    canonical: "https://www.kraftmortgages.ca/mli-select",
  },
};

const FEATURES = [
  { code: "OVW", title: "Program Overview", body: "Eligibility, scoring, and benefits across tiers (50 / 70 / 100 points). Deep-dive into CMHC requirements.", href: "/mli-select/overview", tag: "GUIDE" },
  { code: "CALC", title: "Calculator Suite", body: "Points & tier, rent cap, max loan, DSCR, amortization, premium, break-even, and eligibility tools.", href: "/mli-select/calculators", tag: "TOOLS" },
  { code: "APP", title: "Application Process", body: "Step-by-step guide, documentation checklist, and underwriting timeline.", href: "/mli-select/application-process", tag: "ROADMAP" },
  { code: "ELG", title: "Eligibility Check", body: "Interactive checklist to determine if your project qualifies for MLI Select.", href: "/mli-select/eligibility", tag: "CHECK" },
  { code: "SCR", title: "Scoring System", body: "Understand how CMHC scores projects and strategies to maximize your points.", href: "/mli-select/scoring", tag: "ANALYSIS" },
  { code: "CMP", title: "Compare Programs", body: "Side-by-side comparison of MLI Select tiers and traditional CMHC programs.", href: "/mli-select/compare-programs", tag: "COMPARE" },
];

const TIERS = [
  { tier: "50 PTS", premium: "Up to 25% reduction", label: "TIER 1", color: "text-term-text" },
  { tier: "70 PTS", premium: "Up to 40% reduction", label: "TIER 2", color: "text-term-gold" },
  { tier: "100 PTS", premium: "Up to 55% reduction", label: "TIER 3", color: "text-term-green" },
];

export default function MLISelectPage() {
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
              §01 · CMHC MLI SELECT · COMPLETE PORTAL
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              MLI Select —<br />
              <em className="text-term-gold italic font-normal">Complete Portal.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed mb-10">
              Everything developers and investors need: deep program guide, rich UI calculators, and a clean application roadmap.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mli-select/overview"
                className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
              >
                LEARN THE PROGRAM →
              </Link>
              <Link
                href="/mli-select/calculators"
                className="border border-term-gold text-term-text font-mono text-[13px] tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
              >
                USE CALCULATORS
              </Link>
            </div>
          </div>
        </section>

        {/* ──── TIER RATES ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-b border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-6">
              PREMIUM REDUCTION TIERS
            </div>
            <div className="grid grid-cols-3 border border-term-line-dim">
              {TIERS.map((t, i) => (
                <div key={i} className={`p-6 bg-term-bg ${i < 2 ? "border-r border-r-term-line-dim" : ""}`}>
                  <div className={`font-serif text-[36px] sm:text-[42px] font-normal leading-none tracking-[-0.02em] ${t.color}`}>
                    {t.tier}
                  </div>
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em] mt-2 mb-3">{t.label}</div>
                  <div className="text-[13px] text-term-text-dim">{t.premium}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── FEATURES GRID ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §02 · RESOURCES & TOOLS
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Explore the <em className="text-term-gold italic">Program.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-line-dim">
              {FEATURES.map((f) => (
                <Link
                  key={f.code}
                  href={f.href as any}
                  className="bg-term-bg p-8 group block hover:bg-white/[0.02] transition-colors border-t-2 border-t-term-gold"
                >
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{f.code}</span>
                    <span className="text-term-text-mute tracking-[0.1em]">[{f.tag}]</span>
                  </div>
                  <h3 className="font-serif text-2xl tracking-[-0.02em] mb-3 leading-tight">{f.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed mb-6">{f.body}</div>
                  <div className="font-mono text-[11px] text-term-gold tracking-[0.1em] group-hover:underline">EXPLORE →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA BLOCKS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto grid sm:grid-cols-2 gap-px bg-term-line-dim">
            <div className="bg-term-bg p-10 border-t-2 border-t-term-gold">
              <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-5">GUIDE</div>
              <h3 className="font-serif text-2xl tracking-[-0.02em] mb-3">Download the MLI Select Guide</h3>
              <p className="text-[13px] text-term-text-dim leading-relaxed mb-6">
                Informational + promotional guide: scoring, benefits, and why Kraft Mortgages is your partner.
              </p>
              <a
                href="/mli-select"
                className="bg-term-gold text-term-deep font-mono text-[11px] font-semibold tracking-[0.1em] px-5 py-3 hover:bg-term-gold-bright transition-colors inline-block"
              >
                DOWNLOAD PDF →
              </a>
            </div>
            <div className="bg-term-bg p-10 border-t-2 border-t-term-gold">
              <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-5">SPECIALIST</div>
              <h3 className="font-serif text-2xl tracking-[-0.02em] mb-3">Talk to an MLI Specialist</h3>
              <p className="text-[13px] text-term-text-dim leading-relaxed mb-6">
                Free assessment of your project — we&apos;ll size your deal, optimize points, and map your timeline.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="border border-term-gold text-term-text font-mono text-[11px] tracking-[0.1em] px-5 py-3 hover:bg-term-gold/10 transition-colors"
                >
                  CONTACT US
                </Link>
                <a
                  href="tel:604-593-1550"
                  className="font-mono text-[11px] text-term-text-dim tracking-[0.1em] px-5 py-3 hover:text-term-text transition-colors"
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
