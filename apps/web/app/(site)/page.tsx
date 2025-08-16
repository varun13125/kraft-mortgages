"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { DollarSign, Home, Building, Users, Shield, TrendingUp, Calculator, Phone, Mail, MapPin } from "lucide-react";

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
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
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

  return (
    <>
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
                  Mortgage Experts • 23+ Years
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                  Expert Mortgage Solutions for
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
                We don't just find mortgages - we architect financial solutions for complex scenarios
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Building, title: 'Construction Financing', desc: 'Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers.' },
                { icon: Home, title: 'MLI Select Program', desc: 'Navigate CMHC\'s complex multi-unit insurance program with our specialized expertise, saving thousands in premiums.' },
                { icon: Users, title: 'Self-Employed Solutions', desc: 'Alternative income verification and stated income programs designed for entrepreneurs and business owners.' },
                { icon: Shield, title: 'Purchase Financing', desc: 'Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios.' },
                { icon: DollarSign, title: 'Refinancing & Equity', desc: 'Unlock your property\'s potential with strategic refinancing for debt consolidation or investment opportunities.' },
                { icon: TrendingUp, title: 'Private Lending', desc: 'Fast, flexible private mortgage solutions when traditional lending doesn\'t fit your timeline or situation.' }
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
                  <p className="text-gray-400 leading-relaxed">{service.desc}</p>
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
                  <Link href={calc.href} className="group">
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
                Real results for complex mortgage challenges
              </p>
            </div>

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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-100">
              Ready to Navigate Your Complex Mortgage?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who've achieved their property goals with expert guidance
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
                <div>✓ British Columbia</div>
                <div>✓ Alberta</div>
                <div>✓ Ontario</div>
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
                    onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.email}
                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Loan Amount Needed (e.g. $500,000)"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    value={leadData.loanAmount}
                    onChange={(e) => setLeadData({...leadData, loanAmount: e.target.value})}
                  />
                  <textarea
                    placeholder="Tell us about your mortgage needs..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
                    value={leadData.message}
                    onChange={(e) => setLeadData({...leadData, message: e.target.value})}
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