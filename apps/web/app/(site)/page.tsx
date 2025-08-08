"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ModernLanding() {
  const [scrolled, setScrolled] = useState(false);
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
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    const clientTarget = 10000;
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
    
    // Send to API
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });

    // If calculator selected, generate and email report
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
    setShowLeadForm(false);
    setLeadData({ name: "", email: "", phone: "", calculatorType: "", loanAmount: "", message: "" });
  };

  const openCalculatorWithLead = (calcType: string) => {
    setSelectedCalculator(calcType);
    setShowLeadForm(true);
    setLeadData({ ...leadData, calculatorType: calcType });
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #1e3a8a;
          --primary-light: #3b82f6;
          --accent: #f59e0b;
          --dark: #0f172a;
          --light: #f8fafc;
          --glass: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        .gradient-text-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #f59e0b 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 50%, #1e293b 100%);
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .particle {
          position: absolute;
          background: #f59e0b;
          border-radius: 50%;
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-100px) translateX(50px); }
          50% { transform: translateY(-200px) translateX(-50px); }
          75% { transform: translateY(-100px) translateX(30px); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-scrolled {
          background: rgba(15, 23, 42, 0.95) !important;
        }
      `}</style>

      <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        {/* Background Effects */}
        <div className="hero-bg" />
        <div className="fixed inset-0 z-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 20 + 's',
                animationDuration: (Math.random() * 20 + 20) + 's'
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 glass-card ${scrolled ? 'nav-scrolled py-3' : 'py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-black bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                KRAFT
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <a href="#services" className="hover:text-amber-500 transition-colors">Services</a>
                <a href="#calculators" className="hover:text-amber-500 transition-colors">Calculators</a>
                <Link href="/about" className="hover:text-amber-500 transition-colors">About</Link>
                <Link href="/mli-select" className="hover:text-amber-500 transition-colors">MLI Select</Link>
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                Expert Mortgage Solutions for
                <span className="gradient-text-hero"> Complex Scenarios</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                23+ years navigating MLI Select, Construction Financing, and Self-Employed mortgages across BC, AB & ON
              </p>
              
              <div ref={statsRef} className="flex gap-8 mb-8">
                <div className="text-center">
                  <span className="block text-4xl font-black text-amber-500">{yearsCount}+</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</span>
                </div>
                <div className="text-center">
                  <span className="block text-4xl font-black text-amber-500">{clientsCount.toLocaleString()}+</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Happy Clients</span>
                </div>
                <div className="text-center">
                  <span className="block text-4xl font-black text-amber-500">${fundedCount}B+</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Funded</span>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 transition-all"
                >
                  Start Application →
                </a>
                <button 
                  onClick={() => setShowLeadForm(true)}
                  className="px-8 py-4 border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all"
                >
                  Get Free Analysis
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6">Why Industry Leaders Choose Us</h2>
                <ul className="space-y-4">
                  {[
                    { icon: "🏗️", title: "Construction Specialists", desc: "Progressive draws & builder expertise" },
                    { icon: "🏢", title: "MLI Select Masters", desc: "CMHC multi-unit program experts" },
                    { icon: "💼", title: "Self-Employed Solutions", desc: "Alternative income verification" },
                    { icon: "🍁", title: "Multi-Provincial", desc: "Licensed in BC, AB & ON" }
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 border-b border-gray-700 hover:bg-white/5 transition-colors rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div>
                        <strong className="block">{item.title}</strong>
                        <small className="text-gray-400">{item.desc}</small>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full block text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Start Application →
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text-hero">
                Specialized Mortgage Solutions
              </h2>
              <p className="text-xl text-gray-300">
                We don&apos;t just find mortgages - we architect financial solutions for complex scenarios
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🏗️", title: "Construction Financing", desc: "Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers." },
                { icon: "🏢", title: "MLI Select Program", desc: "Navigate CMHC&apos;s complex multi-unit insurance program with our specialized expertise, saving thousands in premiums." },
                { icon: "💼", title: "Self-Employed Solutions", desc: "Alternative income verification and stated income programs designed for entrepreneurs and business owners." },
                { icon: "🏠", title: "Purchase Financing", desc: "Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios." },
                { icon: "💰", title: "Refinancing & Equity", desc: "Unlock your property&apos;s potential with strategic refinancing for debt consolidation or investment opportunities." },
                { icon: "🔄", title: "Private Lending", desc: "Fast, flexible private mortgage solutions when traditional lending doesn&apos;t fit your timeline or situation." }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-6 hover:border-amber-500 border border-gray-700 transition-all hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculators Section with Lead Capture */}
        <section id="calculators" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-b from-transparent to-blue-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text-hero">
                Advanced Mortgage Calculators
              </h2>
              <p className="text-xl text-gray-300">
                Get personalized reports delivered to your inbox
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "💳", title: "Payment Calculator", desc: "Explore scenarios & amortization", type: "payment" },
                { icon: "🏡", title: "Affordability Analysis", desc: "True purchasing power & stress test", type: "affordability" },
                { icon: "🏗️", title: "Construction Pro", desc: "Progressive draws & cash flow", type: "construction" },
                { icon: "📊", title: "Investment ROI", desc: "Cap rates & leverage strategies", type: "investment" }
              ].map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => openCalculatorWithLead(calc.type)}
                  className="glass-card rounded-2xl p-6 text-center cursor-pointer hover:border-amber-500 border border-gray-700 transition-all hover:scale-105 group"
                >
                  <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                    {calc.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{calc.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{calc.desc}</p>
                  <span className="text-amber-500 font-semibold group-hover:translate-x-2 inline-block transition-transform">
                    Calculate Now →
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text-hero">
                Client Success Stories
              </h2>
              <p className="text-xl text-gray-300">
                Real results for complex mortgage challenges
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-8 relative"
              >
                <span className="text-6xl text-amber-500 opacity-30 absolute top-4 left-8">&ldquo;</span>
                <div className="relative z-10">
                  <p className="text-xl italic mb-6">
                    Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums. The level of knowledge and attention to detail was exceptional.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                      JD
                    </div>
                    <div>
                      <strong>John Davidson</strong>
                      <p className="text-gray-400 text-sm">Developer, Surrey BC</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-r from-blue-900 to-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Ready to Navigate Your Complex Mortgage?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied clients who&apos;ve achieved their property goals with expert guidance
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 transition-all"
              >
                Start Application
              </a>
              <a 
                href="tel:604-593-1550"
                className="px-8 py-4 border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all"
              >
                Call 604-593-1550
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/95 border-t border-gray-800 relative z-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-amber-500">Kraft Mortgages</h3>
              <p className="text-gray-400">
                23+ years of excellence in complex mortgage solutions across British Columbia, Alberta, and Ontario.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-amber-500">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-amber-500 transition-colors">About Us</Link>
                <Link href="#services" className="block text-gray-400 hover:text-amber-500 transition-colors">Services</Link>
                <Link href="#calculators" className="block text-gray-400 hover:text-amber-500 transition-colors">Calculators</Link>
                <Link href="/learn" className="block text-gray-400 hover:text-amber-500 transition-colors">Resources</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-amber-500">Contact</h3>
              <p className="text-gray-400 space-y-1">
                <span className="block">📞 604-593-1550</span>
                <span className="block">📱 604-727-1579</span>
                <span className="block">✉️ varun@kraftmortgages.ca</span>
                <span className="block">🏢 #301 1688 152nd Street</span>
                <span className="block">Surrey, BC V4A 4N2</span>
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-amber-500">Licensed In</h3>
              <p className="text-gray-400 space-y-1">
                <span className="block">✓ British Columbia</span>
                <span className="block">✓ Alberta</span>
                <span className="block">✓ Ontario</span>
                <span className="block mt-4">FSRA License: #M08001935</span>
              </p>
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
                className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700"
              >
                <h3 className="text-2xl font-bold mb-6">
                  {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
                </h3>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                    value={leadData.name}
                    onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                    value={leadData.email}
                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Loan Amount Needed"
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                    value={leadData.loanAmount}
                    onChange={(e) => setLeadData({...leadData, loanAmount: e.target.value})}
                  />
                  <textarea
                    placeholder="Tell us about your mortgage needs..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none resize-none"
                    value={leadData.message}
                    onChange={(e) => setLeadData({...leadData, message: e.target.value})}
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                  >
                    {selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
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