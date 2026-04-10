// Deployment: April 10, 2026 - Twenty CRM Webhook Form
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Phone, Mail, Clock, MapPin, Award, DollarSign, Zap, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

export const dynamic = "force-dynamic";

const API_URL = "/api/contact";

const mortgageTypes = ["Purchase", "Refinance", "Renewal", "Pre-approval", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mortgageType: "",
    amount: "",
    message: "",
    _hp: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form._hp) return; // bot caught
    setStatus("loading");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "website-contact" }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Compact Hero Section */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-100 mb-3">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Contact</span> Us
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Get in touch with our mortgage specialists for personalized assistance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 lg:order-1"
              >
                <h2 className="text-2xl font-semibold text-gray-100 mb-6">Send us a Message</h2>

                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">Thank you!</h3>
                      <p className="text-gray-400">We&apos;ll be in touch within 24 hours.</p>
                    </motion.div>
                  ) : status === "error" ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">Something went wrong</h3>
                      <p className="text-gray-400 mb-4">Please call us at <a href="tel:604-593-1550" className="text-gold-400 hover:underline">604-593-1550</a>.</p>
                      <button onClick={() => setStatus("idle")} className="text-gold-400 hover:text-gold-300 underline text-sm">Try again</button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot */}
                      <input type="text" name="_hp" value={form._hp} onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className={labelClass}>First Name *</label>
                          <input id="firstName" required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className={inputClass} placeholder="John" />
                        </div>
                        <div>
                          <label htmlFor="lastName" className={labelClass}>Last Name</label>
                          <input id="lastName" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className={inputClass} placeholder="Doe" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>Email *</label>
                        <input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} placeholder="john@example.com" />
                      </div>

                      <div>
                        <label htmlFor="phone" className={labelClass}>Phone</label>
                        <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="604-123-4567" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="mortgageType" className={labelClass}>Mortgage Type</label>
                          <select id="mortgageType" value={form.mortgageType} onChange={(e) => setForm((f) => ({ ...f, mortgageType: e.target.value }))} className={inputClass}>
                            <option value="">Select...</option>
                            {mortgageTypes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="amount" className={labelClass}>Loan Amount</label>
                          <input id="amount" type="text" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className={inputClass} placeholder="$500,000" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className={labelClass}>Message</label>
                        <textarea id="message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className={inputClass + " resize-none"} placeholder="Tell us about your situation..." />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-amber-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 lg:order-2"
              >
                <h2 className="text-2xl font-semibold text-gray-100 mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <Phone className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100 mb-2">Phone</h3>
                      <p className="text-gray-400 mb-2">Call us for immediate assistance</p>
                      <a href="tel:604-593-1550" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold">
                        604-593-1550
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <Mail className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100 mb-2">Email</h3>
                      <p className="text-gray-400 mb-2">Send us your questions anytime</p>
                      <a href="mailto:varun@kraftmortgages.ca" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold">
                        varun@kraftmortgages.ca
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <Clock className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100 mb-2">Office Hours</h3>
                      <div className="text-gray-400">
                        <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                        <div>Saturday: 10:00 AM - 4:00 PM</div>
                        <div>Sunday: Closed</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <MapPin className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100 mb-2">Office Address</h3>
                      <a href="https://maps.google.com/?q=%23301+1688+152nd+Street+Surrey+BC+V4A+4N2" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors">
                        #301 - 1688 152nd Street<br />Surrey, BC V4A 4N2
                      </a>
                      <p className="text-gray-500 text-sm mt-2">Serving BC, AB &amp; ON</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Why Choose <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Kraft Mortgages?</span>
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { Icon: Award, title: "18+ Years Experience", desc: "Decades of expertise helping clients navigate complex mortgage solutions across Canada" },
                { Icon: DollarSign, title: "Competitive Rates", desc: "Access to exclusive rates and specialized programs like MLI Select for multi-unit properties" },
                { Icon: Zap, title: "Fast Processing", desc: "Streamlined application process with quick approvals and dedicated support" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 1) * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                    <item.Icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
