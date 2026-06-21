import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { StatsCounters } from "@/components/home/StatsCounters";
import { HeroCTAs } from "@/components/home/HeroCTAs";
import { BUSINESS } from "@/lib/seo/business-config";
import { DollarSign, Home, Building, Users, Shield, TrendingUp, Calculator, Phone, Mail, MapPin, CheckCircle, ArrowRight, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Kraft Mortgages Canada Inc. | Mortgage Broker Surrey, BC, AB & ON",
  description:
    "Licensed Canadian mortgage brokerage. 18+ years, $2B+ funded, access to 30+ lenders. Specialists in MLI Select, construction financing, self-employed, and private mortgages across BC, Alberta, and Ontario.",
  alternates: { canonical: "https://www.kraftmortgages.ca" },
  openGraph: {
    title: "Kraft Mortgages Canada Inc. | Mortgage Broker Surrey",
    description:
      "Licensed Canadian mortgage brokerage across BC, Alberta, and Ontario. MLI Select, construction, self-employed, and private mortgage specialists.",
    url: "https://www.kraftmortgages.ca",
    siteName: "Kraft Mortgages",
    locale: "en_CA",
    type: "website",
    images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
  },
};

const services = [
  { icon: Building, title: "Construction Financing", desc: "Building a new home or developing a multi-unit project? We structure progressive draw schedules, manage holdback requirements, and optimize cash flow so your construction stays on track. Our team has decades of experience working with builders across BC, Alberta, and Ontario.", href: "/construction" },
  { icon: Home, title: "MLI Select Program", desc: "CMHC's MLI Select program offers significant insurance premium savings for qualifying multi-unit rental properties. Our team understands the eligibility criteria, energy-efficiency requirements, and application process inside out — saving developers thousands per unit.", href: "/mli-select" },
  { icon: Users, title: "Self-Employed Solutions", desc: "Traditional banks often struggle to qualify entrepreneurs, freelancers, and small business owners. We offer stated-income and alternative-verification programs that recognize the full picture of your earnings — not just your T4.", href: "/calculators/self-employed" },
  { icon: Shield, title: "Purchase Financing", desc: "Whether it's your first home, an investment property, or a vacation retreat, we match you with the right lender and the right product. We handle single-family, condo, duplex, and multi-unit purchases across all three provinces.", href: "/calculators/affordability" },
  { icon: DollarSign, title: "Refinancing & Equity", desc: "Your home equity is a powerful financial tool. We help clients consolidate high-interest debt, fund renovations, access cash for investments, or simply secure a better rate at renewal. Strategic refinancing can save you tens of thousands over your mortgage term.", href: "/equity-lending" },
  { icon: TrendingUp, title: "Private Lending", desc: "When timeline, credit, or property type falls outside conventional guidelines, private lending bridges the gap. We work with a vetted network of private lenders to deliver fast approvals — often within 24 to 48 hours — for short-term and alternative financing needs.", href: "/private-lending" },
  { icon: Briefcase, title: "Business Funding", desc: "Secure working capital, lines of credit, or equipment financing to grow operations. Submit a quick inquiry or schedule a call with our business funding specialists.", href: "/business-funding" },
];

const cities = [
  { city: "Surrey", province: "BC", desc: "Our headquarters and home base — serving Surrey and the broader Lower Mainland since 2002.", href: "/mortgage-broker-surrey" },
  { city: "Vancouver", province: "BC", desc: "Canada's most competitive market. We help buyers navigate bidding wars and complex financing.", href: "/mortgage-broker-vancouver" },
  { city: "Burnaby", province: "BC", desc: "A growing hub for families and investors — from Metrotown condos to Brentwood developments.", href: "/mortgage-broker-burnaby" },
  { city: "Richmond", province: "BC", desc: "Strong rental and investment market. We secure financing for condos, townhomes, and multi-unit builds.", href: "/mortgage-broker-richmond" },
  { city: "Kelowna", province: "BC", desc: "The Okanagan's booming real estate market demands experienced brokers who understand local dynamics.", href: "/mortgage-broker-kelowna" },
  { city: "Kamloops", province: "BC", desc: "Affordable entry points and growing demand — ideal for first-time buyers and investors alike.", href: "/mortgage-broker-kamloops" },
  { city: "Abbotsford", province: "BC", desc: "The Fraser Valley's largest city offers a mix of suburban living and agricultural investment opportunities.", href: "/mortgage-broker-abbotsford" },
  { city: "Victoria", province: "BC", desc: "Vancouver Island's capital city with unique heritage properties and a tight rental market.", href: "/mortgage-broker-victoria" },
  { city: "Calgary", province: "AB", desc: "Alberta's economic engine — from downtown condos to sprawling suburban developments.", href: "/mortgage-broker-calgary" },
  { city: "Edmonton", province: "AB", desc: "Affordable housing, strong rental yields, and one of Canada's most investor-friendly markets.", href: "/mortgage-broker-edmonton" },
  { city: "Toronto", province: "ON", desc: "Canada's largest real estate market. We help clients compete with the right financing strategy.", href: "/mortgage-broker-toronto" },
  { city: "Ottawa", province: "ON", desc: "Stable government-driven market with excellent opportunities for first-time buyers and investors.", href: "/mortgage-broker-ottawa" },
];

const steps = [
  { step: "01", title: "Free Consultation", desc: "Tell us about your goals, income situation, and timeline. We assess your options and outline a strategy — no fees, no obligations." },
  { step: "02", title: "Pre-Approval", desc: "We pull your credit, verify your documents, and shop across 30+ lenders to secure a written pre-approval — often the same day." },
  { step: "03", title: "Lender Matching", desc: "Once you find your property, we negotiate rate, terms, and conditions with the best-fit lender. We handle the paperwork so you don't have to." },
  { step: "04", title: "Closing", desc: "We coordinate with your lawyer, lender, and realtor to ensure a smooth closing. You get the keys — we make sure every detail is handled." },
];

const calculators = [
  { icon: Calculator, title: "Payment Calculator", desc: "Explore scenarios & amortization", href: "/calculators/payment" },
  { icon: Home, title: "Affordability Analysis", desc: "True purchasing power & stress test", href: "/calculators/affordability" },
  { icon: Building, title: "MLI Select Suite", desc: "Complete CMHC calculator suite", href: "/mli-select/calculators" },
  { icon: TrendingUp, title: "Investment ROI", desc: "Cap rates & leverage strategies", href: "/calculators/investment" },
];

const testimonials = [
  {
    quote: "Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums. The level of knowledge and attention to detail was exceptional.",
    initials: "JD", name: "John Davidson", location: "Developer, Surrey BC",
  },
  {
    quote: "As a self-employed contractor, three banks turned me down before I found Kraft Mortgages. They got me approved in four days with a stated-income program I didn't even know existed. Genuine experts.",
    initials: "MP", name: "Michael Patel", location: "Business Owner, Calgary AB",
  },
  {
    quote: "We were relocating from Vancouver to Toronto and needed to coordinate a sale and purchase simultaneously across two provinces. Kraft handled everything seamlessly — the communication was incredible from start to finish.",
    initials: "SR", name: "Sarah & Raj Mehta", location: "Homebuyers, Toronto ON",
  },
];

export default function ModernHomepage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen relative overflow-hidden bg-transparent">
        {/* Hero Section with floating geometry background */}
        <HeroGeometric className="py-20 px-4 mt-16 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <AnimatedSection variant="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-gold-500/20 via-amber-500/10 to-transparent text-gold-400 border border-gold-500/30 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
                  Mortgage Experts • 18+ Years Combined Experience
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6 leading-[1.1]">
                  Expert Mortgage Solutions Across
                  <span className="bg-gradient-to-r from-gold-400 via-amber-400 to-amber-600 bg-clip-text text-transparent block sm:inline"> BC, Alberta &amp; Ontario</span>
                </h1>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  From first-time homebuyers to seasoned developers — navigate construction financing, MLI Select, self-employed mortgages, and private lending with a brokerage that has funded over $2 billion.
                </p>

                <StatsCounters />
                <HeroCTAs />
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={0.2}
                className="bg-gradient-to-br from-gray-800/40 via-gray-900/50 to-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/40 p-8 hover:border-gold-500/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] transition-all duration-500">
                <h2 className="text-xl font-bold text-gray-100 mb-6 bg-gradient-to-r from-gold-200 to-amber-400 bg-clip-text text-transparent">Why Industry Leaders Choose Us</h2>
                <div className="space-y-6">
                  {[
                    { icon: Building, title: "Construction Specialists", desc: "Progressive draws & builder expertise" },
                    { icon: Home, title: "MLI Select Masters", desc: "CMHC multi-unit program experts" },
                    { icon: Users, title: "Self-Employed Solutions", desc: "Alternative income verification" },
                    { icon: Shield, title: "Multi-Provincial", desc: "Licensed in BC, AB & ON" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-lg flex items-center justify-center border border-gold-500/30">
                        <item.icon className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-100">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* SEO Content Block */}
            <AnimatedSection variant="fade-up" className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-8">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Canada&apos;s Mortgage Landscape — Why an Experienced Broker Matters</h2>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p>
                    Canada&apos;s mortgage market has shifted dramatically in recent years. Rising interest rates, tightened lending guidelines, and new stress-test requirements have made it harder than ever for Canadians to secure financing — especially if your situation doesn&apos;t fit a traditional bank&apos;s checklist. Whether you&apos;re self-employed, purchasing an investment property, building a custom home, or looking to refinance during a renewal, the right guidance can be the difference between approval and frustration.
                  </p>
                  <p>
                    That&apos;s where Kraft Mortgages comes in. Headquartered in Surrey, BC, and licensed across <strong className="text-gray-200">British Columbia, Alberta, and Ontario</strong>, we bring over 18 years of combined frontline experience to every file. Our team specializes in the mortgage scenarios that other brokers turn away — including MLI Select multi-unit financing, construction draw management, stated-income programs for entrepreneurs, equity lending, and private mortgage solutions. With access to more than 30 lenders, we shop the market on your behalf so you don&apos;t have to.
                  </p>
                  <p>
                    From the Lower Mainland and the Okanagan to Calgary, Edmonton, Toronto, and Ottawa — Kraft Mortgages has helped over 5,000 clients and funded more than $2 billion in mortgages. Whether you&apos;re buying your first home, expanding your portfolio, or restructuring your debt, we deliver personalized strategies backed by decades of lender relationships and deep product knowledge.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </HeroGeometric>

        {/* Why Choose Kraft Mortgages */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Why Choose Kraft Mortgages</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">What sets us apart from every other mortgage brokerage in Canada</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: TrendingUp, title: "18+ Years Combined Experience", desc: "Over 18 years of combined experience in the mortgage industry with more than $2 billion in funded deals. Deep lender relationships and institutional knowledge that translates into better terms for every client." },
                { icon: Shield, title: "Licensed in 3 Provinces", desc: "Fully licensed to operate in British Columbia, Alberta, and Ontario. Whether you are buying in Vancouver, investing in Calgary, or relocating to Toronto — we have you covered coast to coast." },
                { icon: Users, title: "Access to 30+ Lenders", desc: "We work with major banks, credit unions, trust companies, and private lenders. That means more options, better rates, and solutions tailored to your unique financial situation." },
                { icon: Building, title: "Complex Mortgage Specialists", desc: "MLI Select multi-unit financing, construction draws, self-employed stated income, equity lending, and private mortgages — these are not side services for us. They are our core expertise." },
                { icon: Calculator, title: "Interactive Calculators & Tools", desc: "Plan your next move with our suite of professional-grade mortgage calculators. Get personalized payment estimates, affordability analysis, and MLI Select projections delivered to your inbox." },
                { icon: CheckCircle, title: "Free Consultations, Same-Day Pre-Approvals", desc: "No fees, no obligations. Speak with a licensed broker who can run numbers, answer questions, and deliver a pre-approval letter — often within the same day." },
              ].map((item, i) => (
                <AnimatedSection key={i} variant="fade-up" delay={i * 0.1}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <item.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Specialized Mortgage Solutions</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Comprehensive mortgage services designed for every stage of your property journey</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <AnimatedSection key={i} variant="fade-up" delay={i * 0.1}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <service.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{service.desc}</p>
                  <Link href={service.href} className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors text-sm font-medium">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Cities We Serve */}
        <section id="cities" className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Cities We Serve</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Local expertise across British Columbia, Alberta, and Ontario</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cities.map((item, i) => (
                <AnimatedSection key={i} variant="fade-up" delay={i * 0.05}>
                  <Link href={item.href} className="group block h-full">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-5 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gold-400" />
                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-gold-400 transition-colors">{item.city}</h3>
                        <span className="text-xs text-gray-500 font-medium">{item.province}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">How It Works</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">From first conversation to closing — a straightforward process</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((item, i) => (
                <AnimatedSection key={i} variant="fade-up" delay={i * 0.1}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                    <span className="text-gold-400 font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculators" className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Advanced Mortgage Calculators</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">Professional-grade calculators with personalized reports delivered to your inbox</p>
              <Link href="/mli-select/calculators"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105">
                <Calculator className="w-5 h-5 mr-2" />
                View All MLI Select Calculators
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {calculators.map((calc, i) => (
                <AnimatedSection key={i} variant="scale" delay={i * 0.1}>
                  <Link href={calc.href} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 text-center h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                        <calc.icon className="w-6 h-6 text-gold-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-100 mb-2">{calc.title}</h3>
                      <p className="text-gray-400 text-sm">{calc.desc}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Client Success Stories</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Real results for complex mortgage challenges across Canada</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <AnimatedSection key={i} variant="fade-up" delay={i * 0.15}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 relative">
                  <div className="absolute top-4 left-6 text-6xl text-gold-400/20 font-serif">&ldquo;</div>
                  <blockquote className="text-gray-200 italic mb-6 relative z-10 pl-8 leading-relaxed">{testimonial.quote}</blockquote>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                      <span className="text-gold-400 font-bold">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-100">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-100">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you are buying your first home in Vancouver, investing in Calgary, or building in Toronto — our team is ready to help. Free consultations, same-day pre-approvals, and access to 30+ lenders across BC, Alberta, and Ontario.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 text-lg">
                Start Application
              </a>
              <a href={`tel:${BUSINESS.telephoneDisplay}`}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors text-lg font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                Call {BUSINESS.telephoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 bg-gray-900/95 border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-semibold text-gold-400 mb-4">Kraft Mortgages</h3>
              <p className="text-gray-400 text-sm leading-relaxed">18+ Years Combined Experience in complex mortgage solutions across British Columbia, Alberta, and Ontario.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gold-400 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-gold-400 transition-colors text-sm">About Us</Link>
                <a href="#services" className="block text-gray-400 hover:text-gold-400 transition-colors text-sm">Services</a>
                <a href="#calculators" className="block text-gray-400 hover:text-gold-400 transition-colors text-sm">Calculators</a>
                <Link href="/mli-select" className="block text-gray-400 hover:text-gold-400 transition-colors text-sm">MLI Select</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gold-400 mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{BUSINESS.telephoneDisplay}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{BUSINESS.secondaryPhoneDisplay}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{BUSINESS.email}</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{BUSINESS.address.streetAddress}<br />{BUSINESS.address.addressLocality}, {BUSINESS.address.addressRegion} {BUSINESS.address.postalCode}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gold-400 mb-4">Licensed In</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div>✓ British Columbia</div>
                <div>✓ Alberta</div>
                <div>✓ Ontario</div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <span className="text-xs">BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
