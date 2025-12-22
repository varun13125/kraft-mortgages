// Deployment: December 19, 2025 - GHL Form Embed
"use client";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Script from "next/script";
import { Phone, Mail, Clock, MapPin, Award, DollarSign, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
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
                <Phone className="w-4 h-4" />
                Contact Our Experts
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Contact</span> Us
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Get in touch with our mortgage specialists for personalized assistance and expert guidance on your mortgage needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8"
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
                      <h3 className="text-lg font-medium text-gray-100 mb-2">Service Areas</h3>
                      <div className="text-gray-400">
                        <div>British Columbia</div>
                        <div>Alberta</div>
                        <div>Ontario</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* GHL Form Embed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 overflow-hidden"
              >
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">Send us a Message</h2>
                <div className="w-full" style={{ minHeight: '740px' }}>
                  <iframe
                    src="https://api.leadconnectorhq.com/widget/form/EWgpdDb4vZV81EZXxWHf"
                    style={{ width: '100%', height: '740px', border: 'none', borderRadius: '8px' }}
                    id="inline-EWgpdDb4vZV81EZXxWHf"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Mortgage Lead Capture"
                    data-height="740"
                    data-layout-iframe-id="inline-EWgpdDb4vZV81EZXxWHf"
                    data-form-id="EWgpdDb4vZV81EZXxWHf"
                    title="Mortgage Lead Capture"
                  />
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                  <Award className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">18+ Years Experience</h3>
                <p className="text-gray-400">
                  Decades of expertise helping clients navigate complex mortgage solutions across Canada
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Competitive Rates</h3>
                <p className="text-gray-400">
                  Access to exclusive rates and specialized programs like MLI Select for multi-unit properties
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Fast Processing</h3>
                <p className="text-gray-400">
                  Streamlined application process with quick approvals and dedicated support
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* GHL Form Embed Script */}
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </>
  );
}