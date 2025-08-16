"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, DollarSign, Calendar, Building, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
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
          a: "Developers and property owners building new multi-unit residential projects (5+ units) can apply. Projects must meet minimum scoring thresholds and commit to long-term affordability requirements."
        },
        {
          q: "What are the minimum requirements?",
          a: "Projects must achieve at least 50 points across the three categories (Affordability, Energy Efficiency, Accessibility) and maintain certain rent-to-income ratios for eligible tenants."
        }
      ]
    },
    {
      category: "Scoring & Tiers",
      icon: Building,
      questions: [
        {
          q: "How does the scoring system work?",
          a: "Projects earn points in three categories: Affordability (up to 50 points), Energy Efficiency (up to 30 points), and Accessibility (up to 20 points). Total points determine your tier level and benefits."
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
          a: "Premium discounts range from 5-10% for Tier 50, 15-20% for Tier 70, and up to 25% for Tier 100. On a $10M project, this could mean savings of $75K to $500K."
        },
        {
          q: "What loan-to-value ratios are available?",
          a: "MLI Select offers enhanced LTV ratios compared to standard CMHC programs. Higher tiers unlock progressively better leverage, reducing your equity requirements."
        },
        {
          q: "Are there extended amortization options?",
          a: "Yes, MLI Select projects can qualify for amortization periods up to 40 years, significantly improving cash flow compared to standard 25-year terms."
        }
      ]
    },
    {
      category: "Application Process",
      icon: Calendar,
      questions: [
        {
          q: "How long does the approval process take?",
          a: "Initial review typically takes 4-6 weeks. Higher tier applications (Tier 70+) receive priority processing, with Tier 100 projects getting expedited approval."
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
      <Navigation />
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