"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ChevronDown,
  Lock,
  FileCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Eye,
  Scale,
  CreditCard,
  FileSearch,
} from "lucide-react";
import Navigation from "@/components/Navigation";

const faqData = [
  {
    question: "Why does a mortgage broker need to verify my identity under FINTRAC?",
    answer:
      "Under federal Canadian law (PCMLTFA), mortgage brokerages are designated reporting entities. Legally mandated to verify identity to safeguard against identity theft, mortgage fraud, and money laundering.",
  },
  {
    question: "What is a Written Service Agreement, and why is it mandatory?",
    answer:
      "Critical consumer-protection document required by provincial frameworks like RECA. Clearly defines scope of services, agency classification, mutual obligations, and broker fee structures before personal data collection, credit pulls, or lender submissions.",
  },
  {
    question: "How does Kraft Mortgages Canada Inc. protect my private financial documents?",
    answer:
      "Physical records securely cataloged and locked at national head office in Surrey, BC. Digital data vaulted behind enterprise-grade encrypted, firewalled servers. Strict internal privacy audits in alignment with Section 44 mandates.",
  },
];

const provincialStandards = [
  {
    province: "British Columbia",
    licenseLabel: "BCFSA #SR220230",
    items: [
      "No Client Trust Funds Held policy — client funds are never held by the brokerage",
      "Dual Agency prohibition — clear, single-agency representation for every client",
      "Full transparency on all lender compensation and broker fee disclosures",
    ],
  },
  {
    province: "Alberta",
    licenseLabel: "RECA LIC-00655428",
    items: [
      "Mandatory Written Service Agreements before any data collection or credit pulls",
      "Explicit agency classification disclosed prior to engagement",
      "Detailed scope-of-services and fee-structure documentation required by law",
    ],
  },
  {
    province: "Ontario",
    licenseLabel: "FSRA #12918",
    items: [
      "Comprehensive suitability assessments for every mortgage recommendation",
      "Material Risk Disclosures for alternative, private, and complex mortgage products",
      "Strict compliance with Ontario's Financial Services Regulatory Authority standards",
    ],
  },
];

export default function ComplianceSecurityPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleFaqKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq(index);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "FAQPage",
                  mainEntity: faqData.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                },
                {
                  "@type": "LocalBusiness",
                  name: "Kraft Mortgages Canada Inc.",
                  description:
                    "Licensed mortgage brokerage serving British Columbia, Alberta, and Ontario with compliance-first consumer protection standards.",
                  url: "https://www.kraftmortgages.ca",
                  telephone: "+1-604-593-1550",
                  email: "varun@kraftmortgages.ca",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Suite 202 - 12725 80 Avenue",
                    addressLocality: "Surrey",
                    addressRegion: "BC",
                    postalCode: "V3W 3A6",
                    addressCountry: "CA",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 49.1427,
                    longitude: -122.8037,
                  },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Mortgage Licensing & Compliance",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "BCFSA Licensed Mortgage Brokerage",
                          description: "License #SR220230 — British Columbia Financial Services Authority",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "RECA Licensed Mortgage Brokerage",
                          description: "License #LIC-00655428 — Real Estate Council of Alberta",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "FSRA Licensed Mortgage Brokerage",
                          description: "License #12918 — Financial Services Regulatory Authority of Ontario",
                        },
                      },
                    ],
                  },
                },
              ],
            }),
          }}
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#0A192F" }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 px-4 sm:px-6 py-20 md:py-28 max-w-7xl mx-auto"
          >
            <div className="text-center">
              <img
                src="/kraft-logo-placeholder.png"
                alt="Kraft Mortgages Canada Inc."
                className="mx-auto mb-8 h-12 w-auto"
                width={200}
                height={48}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-900/30 border border-gold-700/50 text-gold-200 text-sm font-medium mb-8"
              >
                <Shield className="w-4 h-4" />
                <span>Compliance-First Mortgage Advisory</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
              >
                Compliance, Security &amp;&nbsp;
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Consumer Protection
                </span>{" "}
                Hub
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Upholding the Highest Legal, Regulatory, and Anti-Money Laundering Standards across Canada.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-400 max-w-4xl mx-auto mb-10 leading-relaxed"
              >
                Kraft Mortgages Canada Inc. operates under tri-provincial licensure — licensed by the British Columbia
                Financial Services Authority (BCFSA), the Real Estate Council of Alberta (RECA), and the Financial
                Services Regulatory Authority of Ontario (FSRA). Our operational transparency and rigorous compliance
                framework ensure every client interaction meets the highest legal and regulatory standards. Our National
                Head Office in Surrey, BC, serves as the centralized hub for compliance oversight, privacy governance,
                and anti-money laundering operations.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 text-sm text-gray-300"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-gold-400" />
                  BCFSA #SR220230
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-gold-400" />
                  RECA LIC-00655428
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-gold-400" />
                  FSRA #12918
                </span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FINTRAC Identity Verification Section */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: "#F8F9FA" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-700/30 text-red-300 text-sm font-medium mb-6">
                <Eye className="w-4 h-4" />
                <span>FINTRAC Compliance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Federal Identity Verification Under{" "}
                <span className="text-[#0A192F]">PCMLTFA</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kraft Mortgages Canada Inc. is a designated Reporting Entity under the Proceeds of Crime
                (Money Laundering) and Terrorist Financing Act (PCMLTFA). Federal law requires us to verify
                the identity of every client before providing mortgage services. The following three methods are
                legally approved for remote client onboarding.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Government-Issued Photo ID with Digital Forensic Document Validation",
                  description:
                    "Client presents a valid government-issued photo identification document. Document undergoes digital forensic validation to confirm authenticity, detect tampering, and verify security features. Combined with a biometric liveness/selfie test to confirm the client is the rightful holder of the identification.",
                  icon: FileSearch,
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  number: "02",
                  title: "Credit File Method",
                  description:
                    "Verification is completed by matching the client's legal name, residential address, and date of birth against an active Canadian credit bureau file that has been in continuous existence for a minimum of three years. This method leverages established credit history as a reliable identity anchor.",
                  icon: CreditCard,
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  number: "03",
                  title: "Dual-Process Method",
                  description:
                    "Identity is confirmed by cross-referencing two separate, independent, and reliable data sources. Each source must confirm the client's existence and identity, providing dual-layer verification that satisfies federal regulatory requirements for client onboarding.",
                  icon: FileCheck,
                  color: "from-amber-500 to-orange-600",
                },
              ].map((method, i) => (
                <motion.div
                  key={method.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`bg-gradient-to-r ${method.color} p-6`}>
                    <div className="flex items-center gap-3 mb-2">
                      <method.icon className="w-6 h-6 text-white" />
                      <span className="text-white/70 text-sm font-semibold tracking-wider uppercase">
                        Method {method.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug">{method.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Transparency & Beneficial Ownership */}
        <section className="py-20 px-4 sm:px-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/10 border border-[#0A192F]/20 text-[#0A192F] text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span>Corporate Transparency</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Beneficial Ownership &amp; Corporate{" "}
                <span className="text-[#0A192F]">Due Diligence</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kraft Mortgages Canada Inc. conducts mandatory Beneficial Ownership checks on all corporate
                structures to ensure full compliance with federal and provincial anti-money laundering regulations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0A192F] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ownership Identification</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Every corporate client is subject to a comprehensive Beneficial Ownership verification",
                    "Must identify every natural person who controls or owns 25% or more of voting shares or operational units",
                    "Identification includes full legal name, date of birth, residential address, and citizenship",
                    "Shareholding structures, trust arrangements, and nominee relationships are fully documented",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0A192F] flex items-center justify-center">
                    <Scale className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Real-Time Verification</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "High-risk federal corporations are verified in real-time against the Corporations Canada database",
                    "Cross-referencing against OFSI sanctions lists and PEP databases",
                    "Enhanced due diligence triggers for politically exposed persons and high-risk jurisdictions",
                    "Ongoing monitoring of corporate structures for changes in beneficial ownership",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Provincial Consumer Protection Standards */}
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-900/20 border border-gold-700/30 text-gold-700 text-sm font-medium mb-6">
                <Scale className="w-4 h-4" />
                <span>Provincial Standards</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Provincial{" "}
                <span className="text-[#0A192F]">Consumer Protection</span> Standards
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Each province in which we operate enforces distinct consumer protection regulations.
                Kraft Mortgages strictly adheres to — and in many cases exceeds — the minimum standards
                required in each jurisdiction.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {provincialStandards.map((province, i) => (
                <motion.div
                  key={province.province}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-[#0A192F] p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-gold-400" />
                      <span className="text-gold-300 text-xs font-semibold tracking-wider uppercase">
                        {province.licenseLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{province.province}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      {province.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 leading-relaxed text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / SEO Accordion */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: "#F8F9FA" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/10 border border-[#0A192F]/20 text-[#0A192F] text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Compliance &amp; Security{" "}
                <span className="text-[#0A192F]">Questions</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Answers to common questions about our regulatory obligations, consumer protection standards,
                and data security practices.
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    onKeyDown={(e) => handleFaqKeyDown(e, index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:ring-inset"
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Head Office Footer */}
        <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "#0A192F" }}>
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Questions About Compliance or Your Rights?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                Our Principal Broker &amp; Designated Compliance Officer is available to address any questions
                regarding our regulatory obligations, your consumer protection rights, or our data security practices.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <Building2 className="w-5 h-5 text-gold-400" />
                  <span className="text-sm font-medium text-white">Varun Chaudhry</span>
                  <span className="text-xs text-gray-400">Principal Broker &amp; Compliance Officer</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5 text-gold-400" />
                  <span className="text-sm text-center">Suite 202 - 12725 80 Avenue</span>
                  <span className="text-xs text-gray-400">Surrey, BC V3W 3A6</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <a href="tel:+16045931550" className="text-sm hover:text-gold-400 transition-colors">
                    604-593-1550
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <Mail className="w-5 h-5 text-gold-400" />
                  <a
                    href="mailto:varun@kraftmortgages.ca"
                    className="text-sm hover:text-gold-400 transition-colors"
                  >
                    varun@kraftmortgages.ca
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-[#0A192F] font-semibold rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
