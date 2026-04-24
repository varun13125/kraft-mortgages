"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type CmdLine = { type: "cmd"; txt: string };
type OutLine = { type: "out"; txt: string };
type MatchLine = { type: "match"; label: string; rate: string; tag: string; pts: number };
type RecLine = { type: "rec"; txt: string };
type TerminalLine = CmdLine | OutLine | MatchLine | RecLine;

const TERMINAL_SCRIPT: TerminalLine[] = [
  { type: "cmd", txt: "> kraft scan --file=K-2026-0419" },
  { type: "out", txt: "  PROFILE: self-employed, incorporated" },
  { type: "out", txt: "  SUBJECT: $1.85M · Vancouver SFH" },
  { type: "out", txt: "  DOWN:    25% · 2-yr T1 available" },
  { type: "out", txt: "  STATUS:  matching… ✓" },
  { type: "cmd", txt: "> kraft match --top=3" },
  { type: "match", label: "A-LENDER · Schedule 1", rate: "4.69%", tag: "TRADITIONAL", pts: 86 },
  { type: "match", label: "MIC · Alt-A Priority", rate: "5.84%", tag: "STATED_INC", pts: 94 },
  { type: "match", label: "Private · Kraft Syndicate", rate: "7.20%", tag: "BRIDGE_12M", pts: 72 },
  { type: "cmd", txt: "> kraft recommend" },
  { type: "rec", txt: "MIC · Alt-A is the structured fit. 12-mo term, refinance to A at T2 filing." },
  { type: "out", txt: "  est. savings vs A-denial delay: $14,200" },
  { type: "out", txt: "  ready to initiate? [Y/n]" },
];

const RATES = [
  { name: "1-yr fixed", rate: "5.79", delta: "-0.04", trend: "down" as const },
  { name: "3-yr fixed", rate: "4.89", delta: "-0.02", trend: "down" as const },
  { name: "5-yr fixed", rate: "4.69", delta: "-0.06", trend: "down" as const },
  { name: "5-yr variable", rate: "5.20", delta: "+0.10", trend: "up" as const },
  { name: "MLI Select", rate: "3.98", delta: "0.00", trend: "flat" as const },
  { name: "HELOC prime", rate: "6.45", delta: "0.00", trend: "flat" as const },
];

const SERVICES = [
  { code: "MLI", title: "MLI Select Program", tag: "CMHC · Multi-Unit", priority: "CORE", body: "Navigate CMHC's complex multi-unit insurance program with our specialized expertise, saving thousands in premiums.", href: "/mli-select" },
  { code: "CST", title: "Construction Financing", tag: "Builders · Developers", priority: "CORE", body: "Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers.", href: "/construction-financing" },
  { code: "SEL", title: "Self-Employed Solutions", tag: "Alternative Income", priority: "CORE", body: "Alternative income verification and stated income programs designed for entrepreneurs and business owners.", href: "/self-employed-mortgages" },
  { code: "PUR", title: "Purchase Financing", tag: "Residential · Investment", priority: "STD", body: "Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios.", href: "/purchase-financing" },
  { code: "RFI", title: "Refinancing & Equity", tag: "Equity · Consolidate", priority: "STD", body: "Unlock your property's potential with strategic refinancing for debt consolidation or investment opportunities.", href: "/refinancing" },
  { code: "PRV", title: "Private Lending", tag: "Bridge · Short-Term", priority: "SPEC", body: "Fast, flexible private mortgage solutions when traditional lending doesn't fit your timeline or situation.", href: "/private-lending" },
];

const CALCULATORS = [
  { title: "Payment Calculator", sub: "Explore scenarios & amortization", href: "/calculators/affordability" },
  { title: "Affordability Analysis", sub: "True purchasing power & stress test", href: "/calculators/affordability" },
  { title: "MLI Select Suite", sub: "Complete CMHC calculator suite", href: "/mli-select/calculators" },
  { title: "Investment ROI", sub: "Cap rates & leverage strategies", href: "/calculators/affordability" },
];

const DEALS = [
  { date: "APR 12", id: "K-2026-0411", type: "MLI Select", amt: "$8.4M", note: "16-door · Surrey · 100 pts" },
  { date: "APR 08", id: "K-2026-0405", type: "Construction", amt: "$14.2M", note: "6-story · Langley · draw-to-perm" },
  { date: "APR 03", id: "K-2026-0398", type: "Self-Employed", amt: "$2.1M", note: "Incorporated · 2-yr T1 · A-lender" },
  { date: "MAR 27", id: "K-2026-0387", type: "Private", amt: "$680K", note: "Bridge · 9-mo · 78% LTV" },
  { date: "MAR 21", id: "K-2026-0372", type: "Purchase", amt: "$1.6M", note: "First-time · Ontario · 20% down" },
];

const CITIES = [
  { city: "Surrey", province: "BC", desc: "Our headquarters and home base — serving Surrey and the broader Lower Mainland since 2002.", href: "/mortgage-broker-surrey" },
  { city: "Vancouver", province: "BC", desc: "Canada's most competitive market. We help buyers navigate bidding wars and complex financing.", href: "/mortgage-broker-vancouver" },
  { city: "Kelowna", province: "BC", desc: "The Okanagan's booming real estate market demands experienced brokers who understand local dynamics.", href: "/mortgage-broker-kelowna" },
  { city: "Calgary", province: "AB", desc: "Alberta's economic engine — from downtown condos to sprawling suburban developments.", href: "/mortgage-broker-calgary" },
  { city: "Edmonton", province: "AB", desc: "Affordable housing, strong rental yields, and one of Canada's most investor-friendly markets.", href: "/mortgage-broker-edmonton" },
  { city: "Toronto", province: "ON", desc: "Canada's largest real estate market. We help clients compete with the right financing strategy.", href: "/mortgage-broker-toronto" },
];

function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    let mounted = true;
    const iv = setInterval(() => {
      if (!mounted || i >= TERMINAL_SCRIPT.length) { clearInterval(iv); return; }
      setLines(prev => [...prev, TERMINAL_SCRIPT[i]]);
      i++;
    }, 480);
    const cur = setInterval(() => { if (mounted) setCursor(c => !c); }, 540);
    return () => { mounted = false; clearInterval(iv); clearInterval(cur); };
  }, []);

  return (
    <div className="bg-term-deep border border-term-line font-mono text-xs leading-relaxed sticky top-24 overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-term-line-dim text-[10px] text-term-text-dim tracking-[0.1em]">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/60" />
          <span className="w-2 h-2 rounded-full bg-term-gold/60" />
          <span className="w-2 h-2 rounded-full bg-term-green/60" />
        </div>
        <span>kraft@terminal · ~/files/K-2026-0419</span>
        <span className="text-term-green">● live</span>
      </div>
      {/* Terminal Body */}
      <div className="p-5 min-h-[480px] text-term-text-dim">
        {lines.filter(Boolean).map((l, i) => {
          if (l.type === "cmd") return <div key={i} className="text-term-gold mt-2">{l.txt}</div>;
          if (l.type === "out") return <div key={i}>{l.txt}</div>;
          if (l.type === "rec") return (
            <div key={i} className="text-term-text mt-2 px-2.5 py-1.5 border-l-2 border-term-gold bg-term-gold/[0.06]">
              <span className="text-term-gold">▶</span> {l.txt}
            </div>
          );
          if (l.type === "match") return (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2.5 px-2.5 py-2 mt-1 bg-white/[0.02] border-l-2 border-term-gold items-center">
              <div>
                <div className="text-term-text font-medium">{l.label}</div>
                <div className="text-term-text-mute text-[10px] tracking-[0.08em]">[{l.tag}]</div>
              </div>
              <div className="text-term-gold font-semibold">{l.rate}</div>
              <div className="text-term-green text-[10px]">fit·{l.pts}</div>
            </div>
          );
          return null;
        })}
        <div className="mt-1.5">
          <span className="text-term-gold">_</span>
          <span className={`text-term-text ${cursor ? "opacity-100" : "opacity-0"}`}>▊</span>
        </div>
      </div>
    </div>
  );
}

export default function TerminalHomepage() {
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const steps = 60;
            let step = 0;
            const interval = setInterval(() => {
              step++;
              const p = step / steps;
              setYearsCount(Math.floor(23 * p));
              setClientsCount(Math.floor(5000 * p));
              setFundedCount(Number((2 * p).toFixed(1)));
              if (step >= steps) clearInterval(interval);
            }, duration / steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "FinancialService"],
        "@id": "https://www.kraftmortgages.ca/#organization",
        name: "Kraft Mortgages Canada Inc.",
        url: "https://www.kraftmortgages.ca",
        logo: "https://www.kraftmortgages.ca/kraft-logo.png",
        image: "https://www.kraftmortgages.ca/kraft-logo.png",
        description: "Licensed mortgage brokerage offering residential, commercial, construction, private lending, and equity lending solutions across BC, Alberta and Ontario.",
        telephone: "+1-604-593-1550",
        email: "varun@kraftmortgages.ca",
        address: {
          "@type": "PostalAddress",
          streetAddress: "#301 - 1688 152nd Street",
          addressLocality: "Surrey",
          addressRegion: "BC",
          postalCode: "V4A 4N2",
          addressCountry: "CA"
        },
        geo: { "@type": "GeoCoordinates", latitude: 49.1014, longitude: -122.7927 },
        areaServed: [
          { "@type": "City", "name": "Surrey" },
          { "@type": "City", "name": "Vancouver" },
          { "@type": "City", "name": "Kelowna" },
          { "@type": "City", "name": "Kamloops" },
          { "@type": "City", "name": "Abbotsford" },
          { "@type": "Province", "name": "British Columbia" },
          { "@type": "Province", "name": "Alberta" },
          { "@type": "Province", "name": "Ontario" }
        ],
        priceRange: "$$",
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "17:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" }
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127", bestRating: "5" },
        sameAs: ["https://www.linkedin.com/company/kraft-mortgages-canada-inc"]
      },
      {
        "@type": "MortgageBroker",
        name: "Varun Chaudhry",
        jobTitle: "Licensed Mortgage Broker & President",
        worksFor: { "@id": "https://www.kraftmortgages.ca/#organization" },
        telephone: "+1-604-593-1550",
        hasCredential: [{
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "license",
          name: "BCFSA Licensed Mortgage Broker",
          licenseNumber: "M08001935",
          recognizedBy: { "@type": "Organization", "name": "BC Financial Services Authority" }
        }],
        knowsAbout: ["Residential Mortgages","Commercial Mortgages","Construction Financing","Self-Employed Mortgages","MLI Select","Private Lending","Equity Lending","Mortgage Renewals","First-Time Home Buyers","Debt Consolidation"]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navigation />

      <main className="bg-term-bg text-term-text font-sans text-sm leading-relaxed">

        {/* ──── HERO ──── */}
        <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 term-grid-bg opacity-30 pointer-events-none" />
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.25fr_1fr] gap-12 relative">
            <div>
              <div className="flex items-center gap-2.5 mb-7 font-mono text-[11px] text-term-gold tracking-[0.15em]">
                <span className="w-1.5 h-1.5 rounded-full bg-term-green shadow-[0_0_8px_rgba(95,179,128,0.8)]" />
                MORTGAGE EXPERTS · 23+ YEARS · LIVE
              </div>

              <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[104px] leading-[0.9] tracking-[-0.04em] mb-8 text-balance">
                Expert Mortgage<br />
                Solutions for <em className="text-term-gold italic font-normal">Complex</em><br />
                Scenarios.
              </h1>

              <p className="text-lg text-term-text-dim max-w-[620px] leading-relaxed mb-10">
                Navigate <span className="text-term-gold">MLI Select</span>, Construction Financing, and Self-Employed mortgages
                across <span className="text-term-text font-medium">BC, AB &amp; ON</span> with industry-leading expertise.
              </p>

              <div className="flex flex-wrap gap-3 mb-16">
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors"
                >
                  START APPLICATION →
                </a>
                <a
                  href="tel:604-593-1550"
                  className="border border-term-gold text-term-text font-mono text-[13px] font-medium tracking-[0.1em] px-7 py-4 hover:bg-term-gold/10 transition-colors"
                >
                  CALL 604-593-1550
                </a>
              </div>

              {/* Stat Rail */}
              <div ref={statsRef} className="grid grid-cols-3">
                {[
                  [`${yearsCount}+`, "YEARS EXPERIENCE"],
                  [`${clientsCount.toLocaleString()}+`, "HAPPY CLIENTS"],
                  [`$${fundedCount}B+`, "FUNDED"],
                ].map(([n, k], i) => (
                  <div
                    key={i}
                    className={`py-6 px-5 bg-white/[0.02] border-t border-b border-term-line-dim ${
                      i === 0 ? "border-l border-l-term-gold" : "border-l border-l-term-line-dim"
                    } ${i === 2 ? "border-r border-r-term-line-dim" : ""}`}
                  >
                    <div className="font-serif text-[42px] sm:text-[52px] font-normal leading-none text-term-gold tracking-[-0.02em]">
                      {n}
                    </div>
                    <div className="mt-2.5 font-mono text-[10px] text-term-text-mute tracking-[0.15em]">
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Window */}
            <div className="hidden lg:block">
              <TerminalWindow />
            </div>
          </div>
        </section>

        {/* ──── RATE PANEL ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-b border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
                  §02 · RATE BOARD · LIVE
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em]">
                  Live rates, <em className="text-term-gold italic">scored</em> against your scenario.
                </h2>
              </div>
              <Link
                href="/calculators/affordability"
                className="font-mono bg-transparent text-term-gold border border-term-gold px-5 py-3 text-[11px] tracking-[0.1em] hover:bg-term-gold/10 transition-colors text-center"
              >
                VIEW ALL LENDERS →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-term-line-dim">
              {RATES.map((r, i) => (
                <div
                  key={i}
                  className={`p-5 bg-term-bg ${i < 5 ? "border-r border-r-term-line-dim" : ""} ${
                    i >= 2 ? "border-t sm:border-t-0" : ""
                  }`}
                >
                  <div className="font-mono text-[10px] text-term-text-mute tracking-[0.1em] uppercase mb-3.5">
                    {r.name}
                  </div>
                  <div className="font-serif text-[36px] sm:text-[42px] font-normal text-term-text leading-none tracking-[-0.02em]">
                    {r.rate}<span className="text-xl text-term-text-dim">%</span>
                  </div>
                  <div className={`mt-2.5 font-mono text-[11px] ${
                    r.trend === "down" ? "text-term-green" : r.trend === "up" ? "text-term-red" : "text-term-text-dim"
                  }`}>
                    {r.trend === "down" ? "▼" : r.trend === "up" ? "▲" : "■"} {r.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── WHY CHOOSE ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · WHY INDUSTRY LEADERS CHOOSE US
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-12">
              Why Industry Leaders <em className="text-term-gold italic">Choose Us.</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {[
                { num: "01", title: "Construction Specialists", body: "Progressive draws & builder expertise across BC, AB & ON." },
                { num: "02", title: "MLI Select Masters", body: "CMHC multi-unit program experts — 140+ files structured." },
                { num: "03", title: "Self-Employed Solutions", body: "Alternative income verification and stated income programs." },
                { num: "04", title: "Multi-Provincial", body: "Licensed in BC, AB & ON with local market knowledge." },
              ].map((p, i) => (
                <div key={i} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{p.num}</div>
                  <h3 className="font-serif font-normal text-2xl tracking-[-0.02em] mb-2.5">{p.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SERVICES ──── */}
        <section id="services" className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §04 · SPECIALIZED MORTGAGE SOLUTIONS
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-3">
              Specialized Mortgage <em className="text-term-gold italic">Solutions.</em>
            </h2>
            <p className="text-base text-term-text-dim mb-12 max-w-[720px]">
              We don&apos;t just find mortgages — we architect financial solutions for complex scenarios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-line-dim">
              {SERVICES.map((s) => (
                <Link
                  key={s.code}
                  href={s.href as any}
                  className="bg-term-bg p-8 relative group block border-t-2 hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderTopColor: s.priority === "CORE" ? "#C9A96E" : s.priority === "SPEC" ? "#D46A5F" : "rgba(232,225,210,0.35)"
                  }}
                >
                  <div className="flex justify-between items-center mb-8 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{s.code}</span>
                    <span className="text-term-text-mute tracking-[0.1em]">[{s.priority}]</span>
                  </div>
                  <div className="font-serif text-2xl tracking-[-0.02em] mb-1.5 leading-tight">{s.title}</div>
                  <div className="font-mono text-[10px] text-term-text-dim tracking-[0.1em] mb-5">{s.tag}</div>
                  <div className="text-[13px] text-term-text-dim leading-relaxed mb-7">{s.body}</div>
                  <div className="font-mono text-[11px] text-term-gold tracking-[0.1em] group-hover:underline">LEARN MORE →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── SEO CONTENT BLOCK ──── */}
        <section className="py-20 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-term-deep border border-term-line p-8 sm:p-10">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">
                §05 · CANADA&apos;S MORTGAGE LANDSCAPE
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl tracking-[-0.02em] mb-6">
                Why an <em className="text-term-gold italic">Experienced Broker</em> Matters
              </h2>
              <div className="space-y-4 text-term-text-dim leading-relaxed text-[15px]">
                <p>
                  Canada&apos;s mortgage market has shifted dramatically in recent years. Rising interest rates, tightened lending guidelines, and new stress-test requirements have made it harder than ever for Canadians to secure financing — especially if your situation doesn&apos;t fit a traditional bank&apos;s checklist. Whether you&apos;re self-employed, purchasing an investment property, building a custom home, or looking to refinance during a renewal, the right guidance can be the difference between approval and frustration.
                </p>
                <p>
                  That&apos;s where Kraft Mortgages comes in. Headquartered in Surrey, BC, and licensed across <span className="text-term-text font-medium">British Columbia, Alberta, and Ontario</span>, we bring over 23 years of frontline experience to every file. Our team specializes in the mortgage scenarios that other brokers turn away — including <span className="text-term-gold">MLI Select multi-unit financing</span>, construction draw management, stated-income programs for entrepreneurs, equity lending, and private mortgage solutions. With access to more than 30 lenders, we shop the market on your behalf so you don&apos;t have to.
                </p>
                <p>
                  From the Lower Mainland and the Okanagan to Calgary, Edmonton, Toronto, and Ottawa — Kraft Mortgages has helped over 5,000 clients and funded more than $2 billion in mortgages. Whether you&apos;re buying your first home, expanding your portfolio, or restructuring your debt, we deliver personalized strategies backed by decades of lender relationships and deep product knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ──── CALCULATORS ──── */}
        <section id="calculators" className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
                  §06 · ADVANCED MORTGAGE CALCULATORS
                </div>
                <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-3">
                  Advanced Mortgage <em className="text-term-gold italic">Calculators.</em>
                </h2>
                <p className="text-base text-term-text-dim max-w-[720px]">
                  Professional-grade calculators with personalized reports delivered to your inbox.
                </p>
              </div>
              <Link
                href="/mli-select/calculators"
                className="font-mono bg-transparent text-term-gold border border-term-gold px-5 py-3 text-[11px] tracking-[0.1em] hover:bg-term-gold/10 transition-colors text-center whitespace-nowrap"
              >
                VIEW ALL MLI SELECT CALCULATORS →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {CALCULATORS.map((c, i) => (
                <Link key={i} href={c.href as any} className="bg-term-bg p-8 group block hover:bg-white/[0.02] transition-colors min-h-[200px]">
                  <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">0{i + 1}</div>
                  <h3 className="font-serif font-normal text-2xl tracking-[-0.02em] mb-2.5 leading-tight">{c.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed mb-6">{c.sub}</div>
                  <div className="font-mono text-[11px] text-term-gold tracking-[0.1em] group-hover:underline">OPEN →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── TESTIMONIALS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §07 · CLIENT SUCCESS STORIES
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-3">
              Client Success <em className="text-term-gold italic">Stories.</em>
            </h2>
            <p className="text-base text-term-text-dim mb-14">Real results for complex mortgage challenges.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-term-line-dim">
              {[
                {
                  quote: "Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums. The level of knowledge and attention to detail was exceptional.",
                  initials: "JD", name: "John Davidson", location: "Developer · Surrey BC"
                },
                {
                  quote: "As a self-employed contractor, three banks turned me down before I found Kraft Mortgages. They got me approved in four days with a stated-income program I didn't even know existed. Genuine experts.",
                  initials: "MP", name: "Michael Patel", location: "Business Owner · Calgary AB"
                },
                {
                  quote: "We were relocating from Vancouver to Toronto and needed to coordinate a sale and purchase simultaneously across two provinces. Kraft handled everything seamlessly — the communication was incredible.",
                  initials: "SR", name: "Sarah & Raj Mehta", location: "Homebuyers · Toronto ON"
                },
              ].map((t, i) => (
                <div key={i} className="bg-term-bg p-8 relative">
                  <div className="absolute top-4 right-6 font-serif text-6xl text-term-gold/20 leading-none">&ldquo;</div>
                  <blockquote className="text-term-text italic mb-6 relative z-10 leading-relaxed text-[15px]">
                    {t.quote}
                  </blockquote>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-term-gold text-term-deep flex items-center justify-center font-serif text-lg font-semibold shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-serif text-lg text-term-text">{t.name}</div>
                      <div className="font-mono text-[11px] text-term-text-dim tracking-[0.1em] mt-1">{t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── LIVE FUND LOG ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">§08 · LIVE FUND LOG</div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-10">
              Recent <em className="text-term-gold italic">closes.</em>
            </h2>

            <div className="border border-term-line-dim overflow-x-auto">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[100px_160px_160px_140px_1fr] gap-4 px-5 py-3 font-mono text-[10px] text-term-text-mute tracking-[0.12em] border-b border-term-line-dim bg-term-deep">
                <span>DATE</span><span>FILE_ID</span><span>PROGRAM</span><span>AMOUNT</span><span>NOTE</span>
              </div>
              {DEALS.map((d, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-2 sm:grid-cols-[100px_160px_160px_140px_1fr] gap-2 sm:gap-4 px-5 py-4 font-mono text-[13px] text-term-text ${i < DEALS.length - 1 ? "border-b border-term-line-dim" : ""} ${i % 2 === 0 ? "bg-term-bg" : "bg-transparent"}`}
                >
                  <span className="text-term-text-dim">{d.date}</span>
                  <span className="text-term-gold">{d.id}</span>
                  <span>{d.type}</span>
                  <span className="text-term-green">{d.amt}</span>
                  <span className="text-term-text-dim col-span-2 sm:col-span-1">{d.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CITIES ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §09 · CITIES WE SERVE
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-12">
              Local Expertise, <em className="text-term-gold italic">National Reach.</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-line-dim">
              {CITIES.map((c, i) => (
                <Link key={i} href={c.href as any} className="bg-term-bg p-6 group block hover:bg-white/[0.02] transition-colors border-t-2 border-t-term-gold">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-term-gold text-sm">📍</span>
                    <h3 className="font-serif text-lg text-term-text group-hover:text-term-gold transition-colors">{c.city}</h3>
                    <span className="font-mono text-[10px] text-term-text-mute tracking-[0.1em]">{c.province}</span>
                  </div>
                  <p className="text-[13px] text-term-text-dim leading-relaxed">{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──── HOW IT WORKS ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §10 · HOW IT WORKS
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-6xl leading-[0.95] tracking-[-0.03em] mb-12">
              From Conversation to <em className="text-term-gold italic">Closing.</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {[
                { step: "01", title: "Free Consultation", desc: "Tell us about your goals, income situation, and timeline. We assess your options and outline a strategy — no fees, no obligations." },
                { step: "02", title: "Pre-Approval", desc: "We pull your credit, verify your documents, and shop across 30+ lenders to secure a written pre-approval — often the same day." },
                { step: "03", title: "Lender Matching", desc: "Once you find your property, we negotiate rate, terms, and conditions with the best-fit lender. We handle the paperwork." },
                { step: "04", title: "Closing", desc: "We coordinate with your lawyer, lender, and realtor to ensure a smooth closing. Every detail is handled." },
              ].map((item, i) => (
                <div key={i} className="bg-term-bg p-8 text-center border-t-2 border-t-term-gold">
                  <div className="w-12 h-12 border border-term-gold/30 flex items-center justify-center mx-auto mb-5 text-term-gold font-mono font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{item.title}</h3>
                  <p className="text-[13px] text-term-text-dim leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-b border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-[900px]">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§11 · READY TO BEGIN</div>
              <h2 className="font-serif font-normal text-4xl sm:text-6xl lg:text-[80px] leading-[0.95] tracking-[-0.03em] mb-6 text-balance">
                Ready to Navigate Your<br />
                <em className="text-term-gold italic">Complex Mortgage?</em>
              </h2>
              <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
                Join thousands of satisfied clients who&apos;ve achieved their property goals with expert guidance. Free consultations, same-day pre-approvals, and access to 30+ lenders across BC, Alberta, and Ontario.
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
