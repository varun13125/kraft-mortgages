"use client";

import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Building, 
  ArrowRight,
  Globe,
  Calendar,
  Linkedin,
  Phone,
  Mail,
  Send
} from "lucide-react";

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  company_website: string;
  business_owner_with_linkedin: string;
  business_type: string;
  how_long_in_business: string;
  average_monthly_revenue: string;
  funding_amount: string;
  purpose_of_funding: string;
  other_purpose: string;
  when_are_funds_needed: string;
  notes: string;
}

const businessTypes = ["Sole Proprietorship", "Partnership", "Corporation", "Other"];
const linkedinOptions = ["Yes", "No"];
const businessDurationOptions = [
  "Less than a year",
  "Under 10 years",
  "Over 10 years",
  "I don't currently own a small business"
];
const monthlyRevenueOptions = [
  "$10,000 < Revenue < $50,000",
  "$50,000 < Revenue < $100,000",
  "Revenue > $100,000"
];
const fundingPurposeOptions = [
  "Business Expansion",
  "Working Capital",
  "Equipment Purchase",
  "Inventory Purchase",
  "Debt Consolidation",
  "Other"
];
const urgencyOptions = [
  "Immediate (1-7 days)",
  "Within 21 days",
  "1-3 months",
  "Over 3 months"
];

export default function BusinessFundingPage() {
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    company_website: "",
    business_owner_with_linkedin: "Yes",
    business_type: "Corporation",
    how_long_in_business: "Over 10 years",
    average_monthly_revenue: "Revenue > $100,000",
    funding_amount: "",
    purpose_of_funding: "Business Expansion",
    other_purpose: "",
    when_are_funds_needed: "Within 21 days",
    notes: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/business-funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "There was a problem submitting your application. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setStatus("error");
      setErrorMessage("Network error. Please try again or contact us directly.");
    }
  };

  const inputClass =
    "w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all duration-200";
  const selectClass =
    "w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all duration-200 appearance-none cursor-pointer";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-transparent">
        {/* Hero Header */}
        <section className="py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
                <Briefcase className="w-4 h-4" />
                Small Business Lending
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                Flexible <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Business Funding</span> Solutions
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Secure growth capital, purchase equipment, or optimize working capital. Complete our streamlined funding request below to receive custom offers within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form and Referral Section */}
        <section className="pb-24 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              
              {/* Application Form Column (Left) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-8"
              >
                <BorderRotate
                  animationMode="auto-rotate"
                  animationSpeed={8}
                  borderRadius={16}
                  borderWidth={2}
                  backgroundColor="#1f293750"
                  className="w-full p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden"
                  gradientColors={{
                    primary: '#584827',
                    secondary: '#c7a03c',
                    accent: '#f9de90'
                  }}
                >
                  <h2 className="text-2xl font-bold text-gray-100 mb-6 bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Zap className="w-6 h-6 text-gold-400" />
                    Apply for Working Capital
                  </h2>

                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                      >
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/40">
                          <CheckCircle className="w-10 h-10 text-green-400 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-3">Application Received!</h3>
                        <p className="text-gray-400 max-w-md">
                          Thank you for choosing Kraft Mortgages. A lending specialist will audit your financials and follow up within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form 
                        key="form" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onSubmit={handleSubmit} 
                        className="space-y-6"
                      >
                        {/* Section 1: Contact Information */}
                        <div>
                          <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
                            1. Personal details
                          </h3>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="first_name" className={labelClass}>First Name *</label>
                              <div className="relative">
                                <input 
                                  id="first_name" 
                                  required 
                                  value={form.first_name} 
                                  onChange={(e) => handleInputChange("first_name", e.target.value)} 
                                  className={inputClass} 
                                  placeholder="John" 
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="last_name" className={labelClass}>Last Name *</label>
                              <div className="relative">
                                <input 
                                  id="last_name" 
                                  required 
                                  value={form.last_name} 
                                  onChange={(e) => handleInputChange("last_name", e.target.value)} 
                                  className={inputClass} 
                                  placeholder="Doe" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2 mt-4">
                            <div>
                              <label htmlFor="email" className={labelClass}>Email Address *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Mail className="w-5 h-5" />
                                </span>
                                <input 
                                  id="email" 
                                  type="email" 
                                  required 
                                  value={form.email} 
                                  onChange={(e) => handleInputChange("email", e.target.value)} 
                                  className={`${inputClass} pl-10`} 
                                  placeholder="john@example.com" 
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Phone className="w-5 h-5" />
                                </span>
                                <input 
                                  id="phone" 
                                  type="tel" 
                                  required 
                                  value={form.phone} 
                                  onChange={(e) => handleInputChange("phone", e.target.value)} 
                                  className={`${inputClass} pl-10`} 
                                  placeholder="+1-555-123-4567" 
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Business Information */}
                        <div className="pt-4">
                          <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
                            2. Business Profile
                          </h3>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="business_name" className={labelClass}>Business Name *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Building className="w-5 h-5" />
                                </span>
                                <input 
                                  id="business_name" 
                                  required 
                                  value={form.business_name} 
                                  onChange={(e) => handleInputChange("business_name", e.target.value)} 
                                  className={`${inputClass} pl-10`} 
                                  placeholder="Doe Enterprises" 
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="company_website" className={labelClass}>Company Website</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Globe className="w-5 h-5" />
                                </span>
                                <input 
                                  id="company_website" 
                                  value={form.company_website} 
                                  onChange={(e) => handleInputChange("company_website", e.target.value)} 
                                  className={`${inputClass} pl-10`} 
                                  placeholder="https://doeenterprises.com" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2 mt-4">
                            <div>
                              <label htmlFor="business_type" className={labelClass}>Business Entity Type</label>
                              <div className="relative">
                                <select
                                  id="business_type"
                                  value={form.business_type}
                                  onChange={(e) => handleInputChange("business_type", e.target.value)}
                                  className={selectClass}
                                >
                                  {businessTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="business_owner_with_linkedin" className={labelClass}>Are you on LinkedIn?</label>
                              <div className="relative">
                                <select
                                  id="business_owner_with_linkedin"
                                  value={form.business_owner_with_linkedin}
                                  onChange={(e) => handleInputChange("business_owner_with_linkedin", e.target.value)}
                                  className={selectClass}
                                >
                                  {linkedinOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                  ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2 mt-4">
                            <div>
                              <label htmlFor="how_long_in_business" className={labelClass}>Time in Business</label>
                              <div className="relative">
                                <select
                                  id="how_long_in_business"
                                  value={form.how_long_in_business}
                                  onChange={(e) => handleInputChange("how_long_in_business", e.target.value)}
                                  className={selectClass}
                                >
                                  {businessDurationOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                  ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="average_monthly_revenue" className={labelClass}>Average Monthly Revenue</label>
                              <div className="relative">
                                <select
                                  id="average_monthly_revenue"
                                  value={form.average_monthly_revenue}
                                  onChange={(e) => handleInputChange("average_monthly_revenue", e.target.value)}
                                  className={selectClass}
                                >
                                  {monthlyRevenueOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                  ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Funding Parameters */}
                        <div className="pt-4">
                          <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
                            3. Funding Needs
                          </h3>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="funding_amount" className={labelClass}>Desired Funding Amount ($) *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <DollarSign className="w-5 h-5" />
                                </span>
                                <input 
                                  id="funding_amount" 
                                  required 
                                  type="number"
                                  value={form.funding_amount} 
                                  onChange={(e) => handleInputChange("funding_amount", e.target.value)} 
                                  className={`${inputClass} pl-10`} 
                                  placeholder="250000" 
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="when_are_funds_needed" className={labelClass}>When are funds needed?</label>
                              <div className="relative">
                                <select
                                  id="when_are_funds_needed"
                                  value={form.when_are_funds_needed}
                                  onChange={(e) => handleInputChange("when_are_funds_needed", e.target.value)}
                                  className={selectClass}
                                >
                                  {urgencyOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                  ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label htmlFor="purpose_of_funding" className={labelClass}>Purpose of Funding</label>
                            <div className="relative">
                              <select
                                id="purpose_of_funding"
                                value={form.purpose_of_funding}
                                onChange={(e) => handleInputChange("purpose_of_funding", e.target.value)}
                                className={selectClass}
                              >
                                {fundingPurposeOptions.map(o => (
                                  <option key={o} value={o}>{o}</option>
                                ))}
                              </select>
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                            </div>
                          </div>

                          {/* Conditional field for Other purpose */}
                          {form.purpose_of_funding === "Other" && (
                            <div className="mt-4">
                              <label htmlFor="other_purpose" className={labelClass}>Please specify other purpose *</label>
                              <input 
                                id="other_purpose" 
                                required 
                                value={form.other_purpose} 
                                onChange={(e) => handleInputChange("other_purpose", e.target.value)} 
                                className={inputClass} 
                                placeholder="E.g. Marketing campaign, Tax payment" 
                              />
                            </div>
                          )}

                          <div className="mt-4">
                            <label htmlFor="notes" className={labelClass}>Additional Notes / Comments</label>
                            <textarea 
                              id="notes" 
                              rows={4}
                              value={form.notes} 
                              onChange={(e) => handleInputChange("notes", e.target.value)} 
                              className={inputClass} 
                              placeholder="Looking for funding to expand operations and hire new staff." 
                            />
                          </div>
                        </div>

                        {/* Error Notice */}
                        {status === "error" && (
                          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-red-200">{errorMessage}</div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-gray-900 font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          >
                            {status === "loading" ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting Application...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Submit Application
                              </>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </BorderRotate>
              </motion.div>

              {/* Referral Path Column (Right) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-4 space-y-6"
              >
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold-400" />
                    Funding Highlights
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-300">
                    <li className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Fast approvals:</strong> Get qualified offers and decisions in as little as 24 hours.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Low paperwork:</strong> Minimal documentation required to start checking your offers.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Multiple structures:</strong> Term loans, lines of credit, and merchant cash advances.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gold-400" />
                    Need Immediate Help?
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Have questions about our business lending solutions or qualification criteria? Connect with a specialist directly.
                  </p>
                  <div className="space-y-3 text-sm">
                    <a href="tel:604-593-1550" className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors">
                      <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                      604-593-1550
                    </a>
                    <a href="mailto:varun@kraftmortgages.ca" className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors">
                      <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                      varun@kraftmortgages.ca
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
