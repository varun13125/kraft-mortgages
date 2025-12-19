"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics/react";
import {
  Menu,
  X,
  Home,
  Calculator,
  Phone,
  ChevronDown,
  ArrowLeft,
  Building,
  TrendingUp,
  Hammer,
  Shield,
  Users,
  DollarSign,
  FileText
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [calculatorsDropdown, setCalculatorsDropdown] = useState(false);
  const [mliDropdown, setMliDropdown] = useState(false);
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
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
                  <div className="ml-3 pl-3 border-l border-gray-700 z-10 relative">
                    <div className="text-xs text-gold-400 font-semibold whitespace-nowrap">MLI Select Portal</div>
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setServicesDropdown(true)}
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {servicesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseEnter={() => setServicesDropdown(true)}
                      onMouseLeave={() => setServicesDropdown(false)}
                      className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-800 overflow-hidden z-50"
                    >
                      <div className="grid grid-cols-1 gap-1 p-2">
                        <Link
                          href="/residential"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-blue-400 transition-all rounded-lg"
                        >
                          <Home className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="font-semibold">Residential Lending</div>
                            <div className="text-xs text-gray-500">First-time buyers, refinancing, renewals</div>
                          </div>
                        </Link>
                        <Link
                          href="/equity-lending"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-all rounded-lg"
                        >
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          <div>
                            <div className="font-semibold">Equity Lending</div>
                            <div className="text-xs text-gray-500">Professional rates, institutional service</div>
                          </div>
                        </Link>
                        <Link
                          href="/construction"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-all rounded-lg"
                        >
                          <Hammer className="w-5 h-5 text-orange-400" />
                          <div>
                            <div className="font-semibold">Construction Financing</div>
                            <div className="text-xs text-gray-500">Progressive draws, builder programs</div>
                          </div>
                        </Link>
                        <Link
                          href="/commercial"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-all rounded-lg"
                        >
                          <Building className="w-5 h-5 text-purple-400" />
                          <div>
                            <div className="font-semibold">Commercial Lending</div>
                            <div className="text-xs text-gray-500">Multi-unit, office, retail, industrial</div>
                          </div>
                        </Link>
                        <Link
                          href="/private-lending"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-rose-400 transition-all rounded-lg"
                        >
                          <Shield className="w-5 h-5 text-rose-400" />
                          <div>
                            <div className="font-semibold">Private Lending</div>
                            <div className="text-xs text-gray-500">Alternative solutions, fast approvals</div>
                          </div>
                        </Link>
                        <Link
                          href="/mortgage-broker-surrey"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-all rounded-lg"
                        >
                          <Users className="w-5 h-5 text-teal-400" />
                          <div>
                            <div className="font-semibold">Surrey Mortgages</div>
                            <div className="text-xs text-gray-500">Local experts for Surrey, BC</div>
                          </div>
                        </Link>
                        <Link
                          href="/mortgage-broker-kelowna"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-all rounded-lg"
                        >
                          <Users className="w-5 h-5 text-teal-400" />
                          <div>
                            <div className="font-semibold">Kelowna Mortgages</div>
                            <div className="text-xs text-gray-500">Local experts for Kelowna, BC</div>
                          </div>
                        </Link>
                        <Link
                          href="/mortgage-broker-kamloops"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-all rounded-lg"
                        >
                          <Users className="w-5 h-5 text-teal-400" />
                          <div>
                            <div className="font-semibold">Kamloops Mortgages</div>
                            <div className="text-xs text-gray-500">Local experts for Kamloops, BC</div>
                          </div>
                        </Link>
                        <Link
                          href="/mortgage-broker-abbotsford"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-all rounded-lg"
                        >
                          <Users className="w-5 h-5 text-teal-400" />
                          <div>
                            <div className="font-semibold">Abbotsford Mortgages</div>
                            <div className="text-xs text-gray-500">Local experts for Abbotsford, BC</div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Calculators Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setCalculatorsDropdown(true)}
                  onMouseLeave={() => setCalculatorsDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Calculators
                  <ChevronDown className={`w-4 h-4 transition-transform ${calculatorsDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {calculatorsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseEnter={() => setCalculatorsDropdown(true)}
                      onMouseLeave={() => setCalculatorsDropdown(false)}
                      className="absolute top-full left-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-800 overflow-hidden z-50"
                    >
                      <Link
                        href="/calculators"
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all border-b border-gray-800"
                      >
                        <div className="font-semibold">All Calculators</div>
                        <div className="text-xs text-gray-500">Complete calculator suite</div>
                      </Link>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/calculators/affordability"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Affordability Calculator
                        </Link>
                        <Link
                          href="/calculators/payment"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Payment Calculator
                        </Link>
                        <Link
                          href="/calculators/investment"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Investment Calculator
                        </Link>
                        <Link
                          href="/calculators/self-employed"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Self-Employed Calculator
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MLI Select Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setMliDropdown(true)}
                  onMouseLeave={() => setMliDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  MLI Select
                  <ChevronDown className={`w-4 h-4 transition-transform ${mliDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mliDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseEnter={() => setMliDropdown(true)}
                      onMouseLeave={() => setMliDropdown(false)}
                      className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-800 overflow-hidden z-50"
                    >
                      <Link
                        href="/mli-select"
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all border-b border-gray-800"
                      >
                        <div className="font-semibold">MLI Portal Home</div>
                        <div className="text-xs text-gray-500">Overview and resources</div>
                      </Link>
                      <Link
                        href="/mli-select/calculators"
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all border-b border-gray-800"
                      >
                        <div className="font-semibold">All MLI Calculators</div>
                        <div className="text-xs text-gray-500">9 specialized tools</div>
                      </Link>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/mli-select/calculators/points"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Points & Tier Calculator
                        </Link>
                        <Link
                          href="/mli-select/calculators/premium"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          Premium Calculator
                        </Link>
                        <Link
                          href="/mli-select/calculators/dscr"
                          className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gold-400 transition-all rounded"
                        >
                          DSCR Calculator
                        </Link>
                      </div>
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
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Blog
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
                onClick={() => track('Book_Call_Click', { location: 'navbar_desktop' })}
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
            className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl lg:hidden"
            style={{ top: '64px' }}
          >
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>

              {/* Services Section */}
              <div>
                <div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <Building className="w-4 h-4" />
                  Services
                </div>
                <div className="ml-4 space-y-2">
                  <Link
                    href="/residential"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="w-4 h-4 text-blue-400" />
                    Residential Lending
                  </Link>
                  <Link
                    href="/equity-lending"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Equity Lending
                  </Link>
                  <Link
                    href="/construction"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-orange-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Hammer className="w-4 h-4 text-orange-400" />
                    Construction Financing
                  </Link>
                  <Link
                    href="/commercial"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Building className="w-4 h-4 text-purple-400" />
                    Commercial Lending
                  </Link>
                  <Link
                    href="/private-lending"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-rose-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 text-rose-400" />
                    Private Lending
                  </Link>
                </div>
              </div>

              {/* Calculators Section */}
              <div>
                <div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  Calculators
                </div>
                <div className="ml-4 space-y-2">
                  <Link
                    href="/calculators"
                    className="block px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Calculators
                  </Link>
                  <Link
                    href="/calculators/affordability"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-gold-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Affordability Calculator
                  </Link>
                  <Link
                    href="/calculators/payment"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-gold-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Payment Calculator
                  </Link>
                </div>
              </div>

              {/* MLI Select Section */}
              <div>
                <div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  MLI Select
                </div>
                <div className="ml-4 space-y-2">
                  <Link
                    href="/mli-select"
                    className="block px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    MLI Portal Home
                  </Link>
                  <Link
                    href="/mli-select/calculators"
                    className="block px-4 py-2 text-gray-300 hover:text-gold-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All MLI Calculators
                  </Link>
                  <Link
                    href="/mli-select/calculators/points"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-gold-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Points & Tier Calculator
                  </Link>
                  <Link
                    href="/mli-select/calculators/premium"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-gold-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Premium Calculator
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <Link
                  href="/about"
                  className="block px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-3 px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 text-lg text-gray-300 hover:text-gold-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="w-5 h-5" />
                  Contact
                </Link>
              </div>

              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 font-semibold rounded-lg text-center mx-4"
                onClick={() => { track('Book_Call_Click', { location: 'navbar_mobile' }); setMobileMenuOpen(false); }}
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