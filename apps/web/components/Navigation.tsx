"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Calculator, Phone, ChevronDown, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMLISection = pathname?.includes('/mli-select');
  const isCalculator = pathname?.includes('/calculators');

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-800' 
          : 'bg-gray-900/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center gap-4">
              {/* Back Button for Calculator Pages */}
              {isCalculator && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => window.history.back()}
                  className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700 transition-all group"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gold-400 transition-colors" />
                </motion.button>
              )}
              
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <Image 
                  src="/kraft-logo-dark.png" 
                  alt="Kraft Mortgages" 
                  width={200} 
                  height={50} 
                  className="h-10 w-auto group-hover:scale-105 transition-transform duration-200"
                  priority
                />
                {isMLISection && (
                  <div className="ml-3 pl-3 border-l border-gray-700">
                    <div className="text-xs text-gold-400 font-semibold">MLI Select Portal</div>
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              
              {/* MLI Select Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  MLI Select
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-800 overflow-hidden"
                    >
                      <Link 
                        href="/mli-select" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="font-semibold">MLI Portal Home</div>
                        <div className="text-xs text-gray-500">Overview and resources</div>
                      </Link>
                      <Link 
                        href="/mli-select/calculators" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="font-semibold">All Calculators</div>
                        <div className="text-xs text-gray-500">9 interactive tools</div>
                      </Link>
                      <div className="border-t border-gray-800 my-2"></div>
                      <Link 
                        href="/mli-select/calculators/points" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Points & Tier Calculator
                      </Link>
                      <Link 
                        href="/mli-select/calculators/eligibility-checklist" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Eligibility Checklist
                      </Link>
                      <Link 
                        href="/mli-select/calculators/scenario-compare" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Scenario Compare
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link 
                href="/about" 
                className="px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
              >
                About
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
              
              {/* CTA Button */}
              <motion.a 
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 font-semibold rounded-lg shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all"
              >
                Apply Now
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl md:hidden"
            style={{ top: '64px' }}
          >
            <div className="p-6 space-y-4">
              <Link 
                href="/" 
                className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/mli-select" 
                className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                MLI Select Portal
              </Link>
              <Link 
                href="/mli-select/calculators" 
                className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calculators
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <a 
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 font-semibold rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Navigation Bar for Calculator Pages */}
      {isCalculator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 bg-gray-800/90 backdrop-blur-md border-b border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4 overflow-x-auto">
                <Link 
                  href="/mli-select" 
                  className="text-sm text-gray-400 hover:text-gold-400 transition-colors whitespace-nowrap"
                >
                  MLI Portal
                </Link>
                <span className="text-gray-600">›</span>
                <Link 
                  href="/mli-select/calculators" 
                  className="text-sm text-gray-400 hover:text-gold-400 transition-colors whitespace-nowrap"
                >
                  All Calculators
                </Link>
                {pathname?.includes('/points') && (
                  <>
                    <span className="text-gray-600">›</span>
                    <span className="text-sm text-gold-400 whitespace-nowrap">Points & Tier</span>
                  </>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/mli-select/calculators/scenario-compare" 
                  className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-gold-400 transition-all"
                >
                  Compare
                </Link>
                <Link 
                  href="/mli-select/calculators/eligibility-checklist" 
                  className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-gold-400 transition-all"
                >
                  Checklist
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed navigation */}
      <div className={isCalculator ? "h-28" : "h-16"}></div>
    </>
  );
}