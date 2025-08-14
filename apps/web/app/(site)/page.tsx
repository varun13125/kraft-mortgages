"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ModernHomepage() {
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

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: var(--dark);
          color: var(--light);
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* Animated Background */
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

        /* Floating Particles */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: var(--accent);
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

        .gradient-text {
          background: linear-gradient(135deg, var(--light) 0%, var(--accent) 50%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .glass-card {
          background: var(--glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
        }

        .nav-scrolled {
          background: rgba(15, 23, 42, 0.95) !important;
          padding: 0.7rem 5% !important;
        }

        .feature-list li:hover {
          padding-left: 1rem;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--primary-light) 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .calc-card::after {
          content: '→';
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          color: var(--accent);
          transition: all 0.3s ease;
        }

        .calc-card:hover::after {
          transform: translateX(5px);
        }
      `}</style>

      <div className="min-h-screen text-white overflow-x-hidden">
        {/* Background Effects */}
        <div className="hero-bg" />
        <div className="particles">
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 glass-card ${scrolled ? 'nav-scrolled' : ''}`} style={{ padding: scrolled ? '0.7rem 5%' : '1rem 5%' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image 
                src="/kraft-logo-dark.png" 
                alt="Kraft Mortgages Canada" 
                width={180} 
                height={60}
                style={{ 
                  height: 'auto',
                  maxWidth: '180px'
                }}
                priority
              />
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-300 hover:text-amber-500 transition-colors font-medium text-sm">Services</a>
              <a href="#calculators" className="text-gray-300 hover:text-amber-500 transition-colors font-medium text-sm">Calculators</a>
              <Link href="/about" className="text-gray-300 hover:text-amber-500 transition-colors font-medium text-sm">About</Link>
              <Link href={"/mli" as any} className="text-gray-300 hover:text-amber-500 transition-colors font-medium text-sm">MLI Select</Link>
              <a 
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  padding: '0.7rem 1.5rem',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow = '0 6px 25px rgba(245, 158, 11, 0.4)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                }}
              >
                Apply Now
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative z-10" style={{ padding: '0 5%' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }} className="hero-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                Expert Mortgage Solutions for
                <span className="gradient-text"> Complex Scenarios</span>
              </h1>
              <p style={{ fontSize: '1.3rem', color: 'rgba(248, 250, 252, 0.8)', marginBottom: '2rem' }}>
                23+ years navigating MLI Select, Construction Financing, and Self-Employed mortgages across BC, AB & ON
              </p>
              
              <div ref={statsRef} style={{ display: 'flex', gap: '3rem', marginTop: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)', display: 'block' }}>{yearsCount}+</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(248, 250, 252, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Experience</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)', display: 'block' }}>{clientsCount.toLocaleString()}+</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(248, 250, 252, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Clients</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)', display: 'block' }}>${fundedCount}B+</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(248, 250, 252, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Funded</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card"
              style={{ 
                borderRadius: '20px', 
                padding: '3rem', 
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                content: '',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                animation: 'rotate 20s linear infinite reverse'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Why Industry Leaders Choose Us</h2>
                <ul style={{ listStyle: 'none', margin: '2rem 0' }}>
                  {[
                    { icon: '🏗️', title: 'Construction Specialists', desc: 'Progressive draws & builder expertise' },
                    { icon: '🏢', title: 'MLI Select Masters', desc: 'CMHC multi-unit program experts' },
                    { icon: '💼', title: 'Self-Employed Solutions', desc: 'Alternative income verification' },
                    { icon: '🍁', title: 'Multi-Provincial', desc: 'Licensed in BC, AB & ON' }
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      style={{
                        padding: '1rem 0',
                        borderBottom: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      className="feature-list"
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <strong style={{ display: 'block' }}>{item.title}</strong>
                        <small style={{ color: 'rgba(248, 250, 252, 0.6)' }}>{item.desc}</small>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '1rem 2.5rem',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.target as HTMLElement).style.boxShadow = '0 6px 30px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  Start Application →
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" style={{ padding: '5rem 5%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }} className="gradient-text">
                Specialized Mortgage Solutions
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(248, 250, 252, 0.8)' }}>
                We don&apos;t just find mortgages - we architect financial solutions for complex scenarios
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                { icon: '🏗️', title: 'Construction Financing', desc: 'Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers.' },
                { icon: '🏢', title: 'MLI Select Program', desc: 'Navigate CMHC&apos;s complex multi-unit insurance program with our specialized expertise, saving thousands in premiums.' },
                { icon: '💼', title: 'Self-Employed Solutions', desc: 'Alternative income verification and stated income programs designed for entrepreneurs and business owners.' },
                { icon: '🏠', title: 'Purchase Financing', desc: 'Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios.' },
                { icon: '💰', title: 'Refinancing & Equity', desc: 'Unlock your property&apos;s potential with strategic refinancing for debt consolidation or investment opportunities.' },
                { icon: '🔄', title: 'Private Lending', desc: 'Fast, flexible private mortgage solutions when traditional lending doesn&apos;t fit your timeline or situation.' }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card service-card"
                  style={{
                    borderRadius: '20px',
                    padding: '2rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1.5rem'
                  }}>
                    {service.icon}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{service.title}</h3>
                  <p style={{ color: 'rgba(248, 250, 252, 0.7)', lineHeight: '1.6' }}>{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculators" style={{ padding: '5rem 5%', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }} className="gradient-text">
                Advanced Mortgage Calculators
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(248, 250, 252, 0.8)' }}>
                Get personalized reports delivered to your inbox
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { icon: '💳', title: 'Payment Calculator', desc: 'Explore scenarios & amortization', type: 'payment' },
                { icon: '🏡', title: 'Affordability Analysis', desc: 'True purchasing power & stress test', type: 'affordability' },
                { icon: '🏗️', title: 'Construction Pro', desc: 'Progressive draws & cash flow', type: 'construction' },
                { icon: '📊', title: 'Investment ROI', desc: 'Cap rates & leverage strategies', type: 'investment' }
              ].map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => openCalculatorWithLead(calc.type)}
                  className="glass-card calc-card"
                  style={{
                    borderRadius: '15px',
                    padding: '2rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))' }}>
                    {calc.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{calc.title}</h3>
                  <p style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.9rem' }}>{calc.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '5rem 5%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }} className="gradient-text">
                Client Success Stories
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(248, 250, 252, 0.8)' }}>
                Real results for complex mortgage challenges
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card"
              style={{ borderRadius: '20px', padding: '3rem', margin: '1rem', position: 'relative' }}
            >
              <span style={{ fontSize: '4rem', color: 'var(--accent)', opacity: 0.3, position: 'absolute', top: '1rem', left: '2rem' }}>&ldquo;</span>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                Varun helped us navigate the MLI Select program for our 16-unit development. His expertise saved us over $200,000 in insurance premiums. The level of knowledge and attention to detail was exceptional.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  JD
                </div>
                <div>
                  <strong>John Davidson</strong>
                  <p style={{ color: 'rgba(248, 250, 252, 0.6)', fontSize: '0.9rem', margin: 0 }}>Developer, Surrey BC</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '5rem 5%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%)', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to Navigate Your Complex Mortgage?</h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(248, 250, 252, 0.8)', marginBottom: '2rem' }}>
              Join thousands of satisfied clients who&apos;ve achieved their property goals with expert guidance
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <a 
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '1rem 2.5rem',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.target as HTMLElement).style.boxShadow = '0 6px 30px rgba(245, 158, 11, 0.4)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.3)';
                }}
              >
                Start Application
              </a>
              <a 
                href="tel:604-593-1550"
                style={{
                  padding: '1rem 2.5rem',
                  background: 'transparent',
                  border: '2px solid var(--light)',
                  borderRadius: '50px',
                  color: 'var(--light)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.background = 'var(--light)';
                  (e.target as HTMLElement).style.color = 'var(--dark)';
                  (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.background = 'transparent';
                  (e.target as HTMLElement).style.color = 'var(--light)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                Call 604-593-1550
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '3rem 5%', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--glass-border)', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.2rem' }}>Kraft Mortgages</h3>
              <p style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                23+ years of excellence in complex mortgage solutions across British Columbia, Alberta, and Ontario.
              </p>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.1rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/about" style={{ color: 'rgba(248, 250, 252, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'var(--accent)'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(248, 250, 252, 0.7)'}>About Us</Link>
                <a href="#services" style={{ color: 'rgba(248, 250, 252, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'var(--accent)'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(248, 250, 252, 0.7)'}>Services</a>
                <a href="#calculators" style={{ color: 'rgba(248, 250, 252, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'var(--accent)'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(248, 250, 252, 0.7)'}>Calculators</a>
                <Link href="/learn" style={{ color: 'rgba(248, 250, 252, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'var(--accent)'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(248, 250, 252, 0.7)'}>Resources</Link>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.1rem' }}>Contact</h3>
              <div style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div>📞 604-593-1550</div>
                <div>📱 604-727-1579</div>
                <div>✉️ varun@kraftmortgages.ca</div>
                <div>🏢 #301 1688 152nd Street</div>
                <div>Surrey, BC V4A 4N2</div>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.1rem' }}>Licensed In</h3>
              <div style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div>✓ British Columbia</div>
                <div>✓ Alberta</div>
                <div>✓ Ontario</div>
                <div style={{ marginTop: '1rem' }}>FSRA License: #M08001935</div>
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
              className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
              style={{ backdropFilter: 'blur(4px)' }}
              onClick={() => setShowLeadForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card"
                style={{ borderRadius: '24px', padding: '2rem', maxWidth: '28rem', width: '100%' }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
                </h3>
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    value={leadData.name}
                    onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)'}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    value={leadData.email}
                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)'}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    value={leadData.phone}
                    onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)'}
                  />
                  <input
                    type="text"
                    placeholder="Loan Amount Needed (e.g. $500,000)"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    value={leadData.loanAmount}
                    onChange={(e) => setLeadData({...leadData, loanAmount: e.target.value})}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)'}
                  />
                  <textarea
                    placeholder="Tell us about your mortgage needs..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem',
                      resize: 'none'
                    }}
                    value={leadData.message}
                    onChange={(e) => setLeadData({...leadData, message: e.target.value})}
                    onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)'}
                    onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--glass-border)'}
                  />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.boxShadow = '0 6px 25px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                    }}
                  >
                    {selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                  </button>
                </form>
                <p style={{ fontSize: '0.75rem', color: 'rgba(248, 250, 252, 0.5)', marginTop: '1rem', textAlign: 'center' }}>
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