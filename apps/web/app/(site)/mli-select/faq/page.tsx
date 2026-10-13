"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, DollarSign, Calendar, Building, Users } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      category: "Program Basics",
      icon: HelpCircle,
      questions: [
        {
          q: "What is CMHC MLI Select?",
          a: "MLI Select is CMHC's premium multi-unit residential insurance program that provides enhanced terms and premium discounts for projects that achieve affordability, energy efficiency, and accessibility goals through a point-based scoring system."
        },
        {
          q: "Who is eligible for MLI Select?",
          a: "Owners and developers of new or existing rental projects with 5+ units (50+ for retirement homes) — standard rental, SRO, supportive and retirement housing; student housing qualifies through energy efficiency and accessibility only. Projects must score at least 50 points."
        },
        {
          q: "What are the minimum requirements?",
          a: "Projects must achieve at least 50 points from any combination of Affordability, Energy Efficiency and Accessibility commitments. Affordability is optional — if chosen, the affordable units' rents must stay at or below 30% of median renter income for at least 10 years."
        }
      ]
    },
    {
      category: "Scoring & Tiers",
      icon: Building,
      questions: [
        {
          q: "How does the scoring system work?",
          a: "Projects earn points in three categories: Affordability (50 / 70 / 100 points, plus 30 bonus points for a 20+ year commitment), Energy Efficiency (20 / 35 / 50 points) and Accessibility (20 / 30 points). Total points (minimum 50) determine your tier and benefits."
        },
        {
          q: "What are the tier thresholds?",
          a: "Tier 50: 50-69 points, Tier 70: 70-99 points, Tier 100: 100+ points. Higher tiers unlock greater premium discounts and enhanced lending terms."
        },
        {
          q: "Can I improve my tier after initial approval?",
          a: "Yes, you can enhance your project design to achieve a higher tier, but changes must be approved by CMHC before construction begins."
        }
      ]
    },
    {
      category: "Financial Benefits",
      icon: DollarSign,
      questions: [
        {
          q: "How much can I save on insurance premiums?",
          a: "CMHC discounts the premium (base rate plus surcharges) by 10% at 50 points, 20% at 70 points and 30% at 100 points. Under CMHC's July 2025 premium grid that is roughly $60K–$250K on a $10M insured loan, depending on LTV, loan purpose and amortization."
        },
        {
          q: "What loan-to-value ratios are available?",
          a: "New construction: up to 95% loan-to-cost at 50, 70 or 100 points. Existing properties: up to 85% loan-to-value at 50 points and up to 95% at 70+ points (residential component; non-residential space is capped at 75%)."
        },
        {
          q: "Are there extended amortization options?",
          a: "Yes — up to 40 years at 50 points, 45 years at 70 points and 50 years at 100 points (never beyond the property's remaining economic life). CMHC adds a premium surcharge of 0.25% for each 5 years beyond 25."
        }
      ]
    },
    {
      category: "Application Process",
      icon: Calendar,
      questions: [
        {
          q: "How long does the approval process take?",
          a: "Timelines vary with the lender, CMHC volumes and file completeness — plan for several weeks from a complete submission. CMHC does not publish faster processing for higher tiers; a complete, well-documented package is the best way to avoid delays."
        },
        {
          q: "What documentation is required?",
          a: "You'll need detailed architectural plans, energy efficiency reports, affordability commitments, accessibility specifications, and financial projections. Our team helps compile the complete package."
        },
        {
          q: "Can I apply before finalizing my design?",
          a: "We recommend preliminary consultation during design phase to optimize your point scoring. Formal application requires substantially complete plans and specifications."
        }
      ]
    },
    {
      category: "Working with Kraft Mortgages",
      icon: Users,
      questions: [
        {
          q: "Why choose Kraft Mortgages for MLI Select?",
          a: "We're MLI Select specialists with deep program knowledge, having successfully navigated dozens of applications. Our expertise can optimize your scoring and streamline approval."
        },
        {
          q: "Do you help with project design optimization?",
          a: "Absolutely. We work with your architects and consultants to maximize point scoring within your budget, ensuring you achieve the highest viable tier."
        },
        {
          q: "What's your success rate with MLI Select applications?",
          a: "We maintain a 98% approval rate on submitted MLI Select applications, with most clients achieving their target tier or better through our optimization process."
        }
      ]
    }
  ];

  return (
    <>
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "MLI Select", href: "/mli-select" },
              { label: "FAQ" }
            ]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                CMHC • MLI Select
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Questions</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Common questions and answers about CMHC MLI Select program, scoring, benefits, and the application process.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                    <category.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-100">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openFAQ === globalIndex;

                    return (
                      <div
                        key={faqIndex}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-100 pr-4">{faq.q}</h3>
                          <ChevronDown 
                            className={`w-5 h-5 text-gold-400 transition-transform flex-shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-700/50"
                            >
                              <div className="p-6 pt-4">
                                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Still Have <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Questions?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Our MLI Select specialists are here to help guide you through the process.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                >
                  Schedule Consultation
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  Call 604-593-1550
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}