"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

const STATS = [
  { value: "$2B+", label: "TOTAL FUNDED" },
  { value: "5,000+", label: "HAPPY CLIENTS" },
  { value: "23+", label: "YEARS EXPERIENCE" },
  { value: "3", label: "PROVINCES LICENSED" },
];

const TEAM = [
  {
    initials: "VC",
    name: "Varun Chaudhry",
    role: "Founder & Principal Broker",
    badges: ["18+ YRS", "BCFSA", "RECA", "FSRAO"],
    specialties: ["MLI Select & Construction Specialist", "Multi-provincial transactions", "Complex financing architecture"],
    bio: "With over two decades in the mortgage industry, Varun has built a reputation as the go-to expert for complex financing scenarios. His deep understanding of MLI Select programs has saved developers millions in insurance premiums.",
    licenses: "BCFSA #X303985 · RECA #M22001447 · FSRAO #M22001447",
  },
  {
    initials: "GD",
    name: "Gursharan Dhaliwal",
    role: "Co-Founder & Senior Mortgage Advisor",
    badges: ["18+ YRS", "COMMERCIAL", "INVESTMENT"],
    specialties: ["Commercial & investment property financing", "First-time buyer education", "Multi-lingual client support"],
    bio: "Gursharan brings extensive expertise in commercial mortgages and investment property financing. His analytical approach and deep understanding of cash flow analysis has helped hundreds of investors build profitable real estate portfolios.",
    licenses: "Specialties: Commercial lending, Investment properties, New immigrant programs",
  },
];

const EXPERTISE = [
  { code: "MLI", title: "MLI Select Program", points: ["CMHC multi-unit specialist", "Energy efficiency optimization", "Affordability scoring expertise", "Premium reduction strategies"] },
  { code: "CST", title: "Construction Financing", points: ["Progressive draw scheduling", "Cost-to-complete analysis", "Builder mortgage programs", "Land development loans"] },
  { code: "SEL", title: "Self-Employed Solutions", points: ["Stated income programs", "Bank statement programs", "Business-for-self mortgages", "Alternative documentation"] },
];

const VALUES = [
  { num: "01", title: "Solution-Focused", body: "We don't just find mortgages, we architect financial solutions for scenarios others turn away." },
  { num: "02", title: "Speed & Efficiency", body: "Complex files approved in days, not weeks. Same-day pre-approvals across 30+ lenders." },
  { num: "03", title: "Triple Licensed", body: "Full coverage across British Columbia, Alberta, and Ontario markets with local expertise." },
  { num: "04", title: "Proven Track Record", body: "$2B+ funded with 98% approval rate on submitted files. Over 5,000 satisfied clients." },
];

export default function AboutUs() {
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
              §01 · ABOUT KRAFT MORTGAGES · EST. 2002
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] leading-[0.9] tracking-[-0.04em] mb-8 max-w-[900px]">
              Two Decades of <em className="text-term-gold italic font-normal">Mortgage</em><br />
              Excellence.
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed">
              Making complex mortgages simple across <span className="text-term-text font-medium">British Columbia, Alberta, and Ontario</span>.
              Specialists in MLI Select, construction financing, and self-employed solutions.
            </p>
          </div>
        </section>

        {/* ──── STATS ──── */}
        <section className="py-14 px-4 sm:px-8 border-t border-b border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`py-8 px-6 ${i === 0 ? "border-l border-l-term-gold" : "border-l border-l-term-line-dim"} ${i === 3 ? "border-r border-r-term-line-dim" : ""}`}
              >
                <div className="font-serif text-[42px] sm:text-[52px] font-normal leading-none text-term-gold tracking-[-0.02em]">
                  {s.value}
                </div>
                <div className="mt-2.5 font-mono text-[10px] text-term-text-mute tracking-[0.15em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──── COMPANY OVERVIEW ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.25fr_1fr] gap-16">
            <div>
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
                §02 · OUR STORY
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-8">
                Founded on <em className="text-term-gold italic">Expertise.</em>
              </h2>
              <div className="space-y-5 text-[15px] text-term-text-dim leading-relaxed">
                <p>
                  Kraft Mortgages Canada Inc. was founded with a clear vision: to provide sophisticated mortgage solutions
                  that go beyond traditional brokering. We recognized that the Canadian mortgage landscape was becoming
                  increasingly complex, with borrowers facing unique challenges that required specialized expertise.
                </p>
                <p>
                  Today, we&apos;re recognized as specialists in three critical areas: <span className="text-term-gold">MLI Select multi-unit financing</span>,
                  construction mortgages with progressive draws, and self-employed mortgage solutions. Our expertise in these
                  complex scenarios sets us apart from conventional brokers.
                </p>
                <p>
                  With licenses across <span className="text-term-text font-medium">British Columbia, Alberta, and Ontario</span>, we bring local market knowledge combined with
                  national lending relationships to deliver optimal outcomes for our clients.
                </p>
              </div>
            </div>

            {/* Terminal-style info block */}
            <div className="bg-term-deep border border-term-line font-mono text-xs leading-relaxed overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-term-line-dim text-[10px] text-term-text-dim tracking-[0.1em]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="w-2 h-2 rounded-full bg-term-gold/60" />
                  <span className="w-2 h-2 rounded-full bg-term-green/60" />
                </div>
                <span>kraft@terminal · ~/profile</span>
                <span className="text-term-green">● verified</span>
              </div>
              <div className="p-5 text-term-text-dim space-y-1.5">
                <div><span className="text-term-gold">{'>'}</span> kraft --info</div>
                <div>  NAME:     Kraft Mortgages Canada Inc.</div>
                <div>  FOUNDED:  2002</div>
                <div>  HQ:       #301 1688 152nd Street, Surrey BC</div>
                <div>  LICENSED: BC · AB · ON</div>
                <div>  FSRA:     #M08001935</div>
                <div className="mt-3"><span className="text-term-gold">{'>'}</span> kraft --specializations</div>
                <div>  ✓ MLI Select (CMHC Multi-Unit)</div>
                <div>  ✓ Construction Financing</div>
                <div>  ✓ Self-Employed Solutions</div>
                <div>  ✓ Private & Equity Lending</div>
                <div>  ✓ Commercial Mortgages</div>
                <div className="mt-3"><span className="text-term-gold">{'>'}</span> kraft --lenders</div>
                <div>  ACTIVE_LENDERS: 30+</div>
                <div>  APPROVAL_RATE:  98%</div>
                <div className="mt-3"><span className="text-term-gold">{'>'}</span> _<span className="text-term-text animate-pulse">▊</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── LEADERSHIP ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · LEADERSHIP TEAM
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Our <em className="text-term-gold italic">Team.</em>
            </h2>

            <div className="grid md:grid-cols-2 gap-px bg-term-line-dim">
              {TEAM.map((member) => (
                <div key={member.initials} className="bg-term-bg p-8 sm:p-10">
                  {/* Header */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 bg-term-gold text-term-deep flex items-center justify-center font-serif text-xl font-semibold shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-term-text">{member.name}</h3>
                      <div className="font-mono text-[11px] text-term-gold tracking-[0.1em] mt-1">{member.role}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.badges.map((badge) => (
                      <span key={badge} className="font-mono text-[10px] tracking-[0.1em] text-term-text-dim border border-term-line-dim px-2.5 py-1">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2 mb-6">
                    {member.specialties.map((spec) => (
                      <div key={spec} className="flex items-center gap-2 text-[13px] text-term-text-dim">
                        <span className="text-term-green">✓</span> {spec}
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-[13px] text-term-text-dim leading-relaxed mb-5">{member.bio}</p>

                  {/* Licenses */}
                  <div className="pt-4 border-t border-term-line-dim font-mono text-[10px] text-term-text-mute tracking-[0.08em]">
                    {member.licenses}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── EXPERTISE ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §04 · CORE EXPERTISE
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Specialized <em className="text-term-gold italic">Knowledge.</em>
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-term-line-dim">
              {EXPERTISE.map((item) => (
                <div key={item.code} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="flex justify-between items-center mb-6 font-mono text-[11px]">
                    <span className="text-term-gold tracking-[0.1em]">{item.code}</span>
                  </div>
                  <h3 className="font-serif text-2xl tracking-[-0.02em] mb-5">{item.title}</h3>
                  <ul className="space-y-2.5">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-[13px] text-term-text-dim">
                        <span className="text-term-green text-[10px]">▸</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── WHY CHOOSE US ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-term-deep border-t border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §05 · WHY KRAFT MORTGAGES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              The Kraft <em className="text-term-gold italic">Difference.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-term-line-dim">
              {VALUES.map((v) => (
                <div key={v.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-6">{v.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{v.title}</h3>
                  <div className="text-[13px] text-term-text-dim leading-relaxed">{v.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-b border-term-line-dim">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-[900px]">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-4">§06 · GET STARTED</div>
              <h2 className="font-serif font-normal text-4xl sm:text-6xl lg:text-[80px] leading-[0.95] tracking-[-0.03em] mb-6">
                Ready to Experience<br />
                <em className="text-term-gold italic">the Kraft Difference?</em>
              </h2>
              <p className="text-lg text-term-text-dim mb-10 max-w-[680px] leading-relaxed">
                Let&apos;s discuss your unique mortgage needs and find the perfect solution. Free consultations available.
              </p>
              <div className="flex flex-wrap gap-3 mb-14">
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

            {/* Contact Details */}
            <div className="grid sm:grid-cols-3 gap-px bg-term-line-dim max-w-[900px]">
              <div className="bg-term-deep p-6">
                <div className="font-mono text-[10px] text-term-gold tracking-[0.1em] mb-3">HEAD OFFICE</div>
                <div className="text-[13px] text-term-text-dim leading-relaxed">
                  #301 1688 152nd Street<br />Surrey, BC V4A 4N2
                </div>
              </div>
              <div className="bg-term-deep p-6">
                <div className="font-mono text-[10px] text-term-gold tracking-[0.1em] mb-3">PHONE</div>
                <div className="text-[13px] text-term-text-dim">
                  <a href="tel:604-593-1550" className="hover:text-term-text transition-colors">604-593-1550</a> (Office)<br />
                  <a href="tel:604-727-1579" className="hover:text-term-text transition-colors">604-727-1579</a> (Mobile)
                </div>
              </div>
              <div className="bg-term-deep p-6">
                <div className="font-mono text-[10px] text-term-gold tracking-[0.1em] mb-3">EMAIL</div>
                <div className="text-[13px] text-term-text-dim">
                  <a href="mailto:varun@kraftmortgages.ca" className="hover:text-term-text transition-colors">varun@kraftmortgages.ca</a><br />
                  <a href="mailto:gursharan@kraftmortgages.ca" className="hover:text-term-text transition-colors">gursharan@kraftmortgages.ca</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
