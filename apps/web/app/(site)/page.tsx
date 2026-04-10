"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { DollarSign, Home, Building, Users, Shield, TrendingUp, Calculator, Phone, Mail, MapPin, CheckCircle, Clock, Award, Globe, Handshake, FileCheck } from "lucide-react";

export default function ModernHomepage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    calculatorType: "",
    loanAmount: "",
    message: ""
  });

  // Counter animation states
  const [yearsCount, setYearsCount] = useState(23);
  const [clientsCount, setClientsCount] = useState(5000);
  const [fundedCount, setFundedCount] = useState(2);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const yearTarget = 23;
    const clientTarget = 5000;
    const fundedTarget = 2;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setYearsCount(Math.floor(yearTarget * progress));
      setClientsCount(Math.floor(clientTarget * progress));
      setFundedCount(Number((fundedTarget * progress).toFixed(1)));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });

      if (selectedCalculator) {
        await fetch("/api/calculator-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...leadData,
            calculatorType: selectedCalculator
          })
        });
      }

      alert("Thank you! We'll be in touch shortly. Check your email for your personalized report.");
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert("Thank you! We've received your information and will be in touch shortly.");
    }

    setShowLeadForm(false);
    setSelectedCalculator(null);
    setLeadData({ name: "", email: "", phone: "", calculatorType: "", loanAmount: "", message: "" });
  };

  const openCalculatorWithLead = (calcType: string) => {
    setSelectedCalculator(calcType);
    setShowLeadForm(true);
    setLeadData({ ...leadData, calculatorType: calcType });
  };

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
        geo: {
          "@type": "GeoCoordinates",
          latitude: 49.1014,
          longitude: -122.7927
        },
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
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "14:00"
          }
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
          bestRating: "5"
        },
        sameAs: [
          "https://www.linkedin.com/company/kraft-mortgages-canada-inc"
        ]
      },
      {
        "@type": "MortgageBroker",
        name: "Varun Chaudhry",
        jobTitle: "Licensed Mortgage Broker & President",
        worksFor: { "@id": "https://www.kraftmortgages.ca/#organization" },
        telephone: "+1-604-593-1550",
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "BCFSA Licensed Mortgage Broker",
            licenseNumber: "M08001935",
            recognizedBy: { "@type": "Organization", "name": "BC Financial Services Authority" }
          }
        ],
        knowsAbout: [
          "Residential Mortgages", "Commercial Mortgages", "Construction Financing",
          "Self-Employed Mortgages", "MLI Select", "Private Lending",
          "Equity Lending", "Mortgage Renewals", "First-Time Home Buyers", "Debt Consolidation"
        ]
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                  Mortgage Experts \u2022 23+ Years of Excellence
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                  Surrey&apos;s Trusted Mortgage Broker for
                  <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent"> Complex Scenarios</span>
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Navigate MLI Select, Construction Financing, and Self-Employed mortgages across BC, AB & ON with industry-leading expertise.
                </p>

                <div ref={statsRef} className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">{yearsCount}+</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">{clientsCount.toLocaleString()}+</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">${fundedCount}B+</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Funded</div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-gray-400 leading-relaxed mb-4">
                    As Surrey&apos;s population surpasses 600,000 and the city solidifies its position as one of BC&apos;s fastest-growing municipalities, the demand for a knowledgeable mortgage broker in Surrey BC has never been greater. Kraft Mortgages has been proudly serving the Surrey community for over 23 years, helping families, investors, and business owners navigate an increasingly competitive real estate market where average home prices continue to climb.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Whether you&apos;re purchasing your first home in Guildford, investing in a multi-family property in Whalley, or building in the growing South Surrey corridor, having the right Surrey mortgage broker makes all the difference. We understand the unique dynamics of Surrey real estate \u2014 from the rapid transit expansion along the Surrey-Langley SkyTrain corridor to the revitalization of City Centre and the steady appreciation in neighborhoods like Fleetwood, Newton, and Cloverdale. Our deep roots in the community mean we don&apos;t just offer competitive mortgage rates Surrey residents trust \u2014 we provide tailored advice shaped by local market knowledge.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    For first-time home buyers in Surrey, the path to homeownership can feel overwhelming. Between the BC First-Time Home Buyer Program, the Home Buyers&apos; Tax Credit, and various lender incentive programs, there are opportunities to reduce your upfront costs. Our team specializes in helping first-time home buyer Surrey applicants understand every option available, from the minimum 5% down payment on properties under $500,000 to the extended amortizations offered by select lenders. We shop across 30+ lenders to find the best mortgage rates Surrey has to offer, so you can focus on finding the perfect home.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://r.mtg-app.com/varun-chaudhry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                  >
                    Start Application
                  </a>
                  <a
                    href="tel:604-593-1550"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                  >
                    Call 604-593-1550
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6">Why Industry Leaders Choose Us</h2>
                <div className="space-y-6">
                  {[
                    { icon: Building, title: 'Construction Specialists', desc: 'Progressive draws & builder expertise' },
                    { icon: Home, title: 'MLI Select Masters', desc: 'CMHC multi-unit program experts' },
                    { icon: Users, title: 'Self-Employed Solutions', desc: 'Alternative income verification' },
                    { icon: Shield, title: 'Multi-Provincial', desc: 'Licensed in BC, AB & ON' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-lg flex items-center justify-center border border-gold-500/30">
                        <item.icon className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-100">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Kraft Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Why Choose Kraft Mortgages
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Surrey families and investors have trusted us for 23+ years \u2014 here&apos;s why we&apos;re the best mortgage broker Surrey has to offer
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: 'Deep Surrey Roots',
                  desc: "Our office is located in the heart of Surrey at #301 1688 152nd Street, and we've been embedded in this community for over two decades. We've watched Guildford evolve into a retail hub, seen Whalley transform into the Surrey City Centre, and helped thousands of families settle into neighborhoods like Fleetwood, Newton, Cloverdale, and South Surrey. This local knowledge means we understand property values, neighborhood trends, and the unique challenges of Surrey's diverse real estate market \u2014 insight you won't find with a downtown Vancouver broker."
                },
                {
                  icon: Award,
                  title: '23+ Years of Experience',
                  desc: "Since 2003, Kraft Mortgages has been guiding clients through every type of mortgage scenario imaginable. From straightforward first-time purchases to complex construction draws and commercial refinances, our experience means fewer surprises and smoother closings. We've seen multiple market cycles, rate environments, and regulatory changes \u2014 and we use that institutional knowledge to protect our clients' interests every step of the way."
                },
                {
                  icon: Building,
                  title: 'Access to 30+ Lenders',
                  desc: "As an independent mortgage broker, we're not tied to any single bank. We shop your application across Canada's top lenders \u2014 including major banks, credit unions, trust companies, and private lenders \u2014 to find the mortgage rates Surrey borrowers deserve. This competition works in your favor, often securing rates and terms that aren't available when you walk into a branch directly."
                },
                {
                  icon: Handshake,
                  title: 'Free Consultations',
                  desc: "Every mortgage journey starts with a no-obligation, no-cost consultation. We'll review your financial situation, discuss your goals, and outline your options \u2014 whether you're ready to buy tomorrow or planning 12 months out. Our transparent approach means no hidden fees, no pressure, and no surprises. For Surrey home loans, getting expert advice should never cost you a dime upfront."
                },
                {
                  icon: Clock,
                  title: 'Same-Day Pre-Approvals',
                  desc: "In Surrey's competitive real estate market, speed matters. When you find the right home in Panorama Ridge or a townhouse in Fraserview, you need a pre-approval that holds weight with sellers. Our streamlined process allows us to deliver pre-approvals within the same business day in many cases, so you can make offers with confidence and never miss an opportunity."
                },
                {
                  icon: Globe,
                  title: 'Multilingual Service',
                  desc: "Surrey is one of Canada's most diverse cities, and we reflect that. Our team serves clients in English, Punjabi, and Hindi, ensuring that language is never a barrier to understanding your mortgage options. We believe every Surrey resident deserves clear, comfortable communication when making one of the biggest financial decisions of their life."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <item.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Specialized Mortgage Solutions
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From Surrey first-time buyers to seasoned developers \u2014 comprehensive mortgage solutions tailored to your scenario
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Building, title: 'Construction Financing', desc: "Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers. Surrey's construction boom demands a broker who understands builder timelines, municipal permitting, and lender requirements for multi-phase projects across the Lower Mainland.", link: '/construction' },
                { icon: Home, title: 'MLI Select Program', desc: "Navigate CMHC's complex multi-unit insurance program with our specialized expertise, saving thousands in premiums. As Surrey's rental market expands, MLI Select offers developers significant advantages \u2014 and our deep program knowledge ensures you capture every benefit available.", link: '/mli-select' },
                { icon: Users, title: 'Self-Employed Solutions', desc: "Alternative income verification and stated income programs designed for entrepreneurs and business owners. Surrey's thriving business community includes thousands of self-employed professionals who deserve fair access to competitive mortgage rates without being penalized for how they earn their income.", link: '/residential' },
                { icon: Shield, title: 'Purchase Financing', desc: "Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios. Whether you're buying a starter condo in Newton or a luxury home in South Surrey, we structure your financing to maximize savings and ensure a smooth closing process.", link: '/residential' },
                { icon: DollarSign, title: 'Refinancing & Equity', desc: "Unlock your property's potential with strategic refinancing for debt consolidation or investment opportunities. Surrey homeowners have seen significant equity growth \u2014 we help you leverage it responsibly to achieve your financial goals, from renovations to investment portfolios.", link: '/equity-lending' },
                { icon: TrendingUp, title: 'Private Lending', desc: "Fast, flexible private mortgage solutions when traditional lending doesn't fit your timeline or situation. For Surrey properties that need quick closings, creative structuring, or non-traditional income qualification, our private lending network provides reliable alternatives with transparent terms.", link: '/private-lending' }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mb-4">
                    <service.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{service.desc}</p>
                  <Link href={service.link} className="text-gold-400 text-sm font-semibold hover:text-gold-300 transition-colors">
                    Learn More \u2192
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Surrey Neighborhoods Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Surrey Neighborhoods We Serve
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Local expertise across every Surrey community \u2014 from City Centre to the semirural south
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Guildford', desc: "A major retail and residential hub with a mix of condos and single-family homes. Guildford's central location and SkyTrain access make it popular with first-time buyers and investors alike." },
                { name: 'Whalley / City Centre', desc: "Surrey's downtown core is undergoing rapid transformation with new condo towers, SFU Surrey campus, and the upcoming Surrey-Langley SkyTrain. Ideal for investors seeking appreciation potential." },
                { name: 'Fleetwood', desc: "A family-friendly neighborhood known for excellent schools, parks, and community centres. Fleetwood offers a range of housing options from townhomes to executive detached homes." },
                { name: 'Newton', desc: "One of Surrey's most affordable entry points for home buyers. Newton offers diverse housing stock, strong commercial corridors, and ongoing community revitalization efforts." },
                { name: 'Cloverdale', desc: "A blend of historic charm and modern development. Known for its country feel, the Cloverdale Fairgrounds, and a growing selection of new subdivisions attracting young families." },
                { name: 'South Surrey', desc: "Home to some of Surrey's most desirable real estate, including Morgan Creek and Grandview Heights. Premium properties, ocean views, and proximity to White Rock drive strong demand." },
                { name: 'Panorama Ridge', desc: "A sought-after neighborhood with winding streets, large lots, and a golf course community feel. Panorama Ridge consistently ranks among Surrey's top areas for property value retention." },
                { name: 'Fraserview', desc: "An established neighborhood offering mature trees, quiet streets, and a mix of mid-century homes and new builds. Excellent value for buyers seeking character and proximity to the Pattullo Bridge." }
              ].map((hood, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-lg flex items-center justify-center border border-gold-500/30 mb-3">
                    <MapPin className="w-5 h-5 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{hood.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{hood.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Getting a mortgage in Surrey doesn't have to be complicated. Here's our proven four-step process.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', icon: Phone, title: 'Free Consultation', desc: "Book a no-cost consultation where we review your financial picture, discuss your homeownership goals, and map out a strategy tailored to your situation." },
                { step: '02', icon: FileCheck, title: 'Pre-Approval', desc: "We pull your credit, verify your income documents, and secure a same-day pre-approval so you can shop for Surrey homes with confidence and a clear budget." },
                { step: '03', icon: Building, title: 'Lender Matching', desc: "We submit your application to our network of 30+ lenders, negotiating on your behalf to secure the lowest mortgage rates and best terms available." },
                { step: '04', icon: CheckCircle, title: 'Closing', desc: "We coordinate with your Realtor, lawyer, and lender to ensure a smooth closing. We're with you at every stage \u2014 from condition removal to picking up your keys." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 text-center"
                >
                  <div className="text-4xl font-bold text-gold-400/20 mb-2">{item.step}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculators" className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Advanced Mortgage Calculators
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Professional-grade calculators with personalized reports delivered to your inbox
              </p>
              <Link
                href="/mli-select/calculators"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
              >
                <Calculator className="w-5 h-5 mr-2" />
                View All MLI Select Calculators
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Calculator, title: 'Payment Calculator', desc: 'Explore scenarios & amortization', type: 'payment', href: '/calculators/affordability' },
                { icon: Home, title: 'Affordability Analysis', desc: 'True purchasing power & stress test', type: 'affordability', href: '/calculators/affordability' },
                { icon: Building, title: 'MLI Select Suite', desc: 'Complete CMHC calculator suite', type: 'mli', href: '/mli-select/calculators' },
                { icon: TrendingUp, title: 'Investment ROI', desc: 'Cap rates & leverage strategies', type: 'investment', href: '/calculators/affordability' }
              ].map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={calc.href as any} className="group">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 transition-all hover:shadow-gold-500/20 hover:shadow-2xl hover:-translate-y-1 text-center h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                        <calc.icon className="w-6 h-6 text-gold-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-100 mb-2">{calc.title}</h3>
                      <p className="text-gray-400 text-sm">{calc.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Client Success Stories
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Real results for complex mortgage challenges across Surrey
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 relative max-w-4xl mx-auto"
              >
                <div className="absolute top-4 left-6 text-6xl text-gold-400/20 font-serif">&ldquo;</div>
                <blockquote className="text-lg text-gray-200 italic mb-6 relative z-10 pl-8">
                  Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums. The level of knowledge and attention to detail was exceptional.
                </blockquote>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                    <span className="text-gold-400 font-bold">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-100">John Davidson</div>
                    <div className="text-sm text-gray-400">Developer, Surrey BC</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 relative max-w-4xl mx-auto"
              >
                <div className="absolute top-4 left-6 text-6xl text-gold-400/20 font-serif">&ldquo;</div>
                <blockquote className="text-lg text-gray-200 italic mb-6 relative z-10 pl-8">
                  As first-time buyers in Fleetwood, we were nervous about the whole process. Kraft Mortgages made it feel effortless. They found us a rate significantly lower than our bank offered and walked us through every step. We closed on our dream home in just three weeks.
                </blockquote>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                    <span className="text-gold-400 font-bold">RP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-100">Raj & Priya Sharma</div>
                    <div className="text-sm text-gray-400">Homeowners, Fleetwood Surrey</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 relative max-w-4xl mx-auto"
              >
                <div className="absolute top-4 left-6 text-6xl text-gold-400/20 font-serif">&ldquo;</div>
                <blockquote className="text-lg text-gray-200 italic mb-6 relative z-10 pl-8">
                  I'm self-employed and was turned down by two banks before finding Kraft Mortgages. They understood my business financials and matched me with a lender who saw the full picture. I now own a four-plex in Whalley that cash flows beautifully. Couldn't have done it without them.
                </blockquote>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                    <span className="text-gold-400 font-bold">MK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-100">Mike Khangura</div>
                    <div className="text-sm text-gray-400">Investor, Whalley Surrey</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-100">
              Ready to Buy Your Next Home in Surrey?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a first-time buyer, seasoned investor, or looking to refinance \u2014 Surrey&apos;s trusted mortgage broker is here to help. Get started with a free consultation today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 text-lg"
              >
                Start Application
              </a>
              <a
                href="tel:604-593-1550"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors text-lg font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 604-593-1550
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 bg-gray-900/95 border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-semibold text-gold-400 mb-4">Kraft Mortgages</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                23+ years of excellence in complex mortgage solutions across British Columbia, Alberta, and Ontario.
              </p>
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
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>604-593-1550</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>604-727-1579</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>varun@kraftmortgages.ca</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>#301 1688 152nd Street<br />Surrey, BC V4A 4N2</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gold-400 mb-4">Licensed In</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div>&#10003; British Columbia</div>
                <div>&#10003; Alberta</div>
                <div>&#10003; Ontario</div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <span className="text-xs">FSRA License: #M08001935</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Lead Capture Modal */}
        <AnimatePresence>
          {showLeadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowLeadForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-100 mb-6">
                  {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
                </h3>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Loan Amount Needed (e.g. $500,000)"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.loanAmount}
                    onChange={(e) => setLeadData({ ...leadData, loanAmount: e.target.value })}
                  />
                  <textarea
                    placeholder="Tell us about your mortgage needs..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
                    value={leadData.message}
                    onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg"
                  >
                    {selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Your information is secure and will never be shared
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
