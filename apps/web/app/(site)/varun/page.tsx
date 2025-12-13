'use client'

import { motion } from 'framer-motion'
import Script from 'next/script'
import { Shield, Clock, Users, FileText, CheckCircle, Phone, Mail } from 'lucide-react'

export default function VarunLandingPage() {
    return (
        <main className="min-h-screen bg-black">
            {/* ========== HERO SECTION ========== */}
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black relative overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

                {/* Subtle gold accent orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 py-20 relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-8"
                    >
                        <span className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-6 py-2 text-gold-400 text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Licensed in BC, AB & ON • BCFSA #M08001935
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6"
                    >
                        <span className="text-zinc-100">Quick Response</span>
                        <br />
                        <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 bg-clip-text text-transparent">
                            Mortgage Consultation
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg sm:text-xl md:text-2xl text-zinc-400 text-center max-w-3xl mx-auto mb-12 px-4"
                    >
                        Fill out our form below and we'll call you back to discuss your mortgage needs — whether you're buying, refinancing, or renewing.
                    </motion.p>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-16 px-4"
                    >
                        <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                            <span className="text-sm sm:text-base">18+ Years Experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                            <span className="text-sm sm:text-base">Quick Response Time</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                            <span className="text-sm sm:text-base">No Obligation</span>
                        </div>
                    </motion.div>

                    {/* CTA Button - Scroll to Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-gray-900 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg"
                        >
                            Get Started →
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ========== HOW IT WORKS SECTION ========== */}
            <section className="py-20 bg-black relative">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                            How It Works
                        </span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8 hover:border-gold-500/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6 text-xl sm:text-2xl font-bold text-gray-900">
                                1
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-4">Fill Out the Form</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Share basic details about your mortgage needs. Takes less than 2 minutes.
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8 hover:border-gold-500/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6 text-xl sm:text-2xl font-bold text-gray-900">
                                2
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-4">We'll Reach Out</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Our team will contact you to discuss your situation and answer questions.
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8 hover:border-gold-500/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6 text-xl sm:text-2xl font-bold text-gray-900">
                                3
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-4">Get Expert Advice</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Receive personalized mortgage options tailored to your goals.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== GHL FORM SECTION ========== */}
            <section id="form-section" className="py-20 bg-gradient-to-b from-black via-zinc-900 to-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                                    Start Your Mortgage Journey
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl text-zinc-400">
                                Fill out the form below and we'll be in touch shortly.
                            </p>
                        </motion.div>

                        {/* GHL Form Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl"
                        >
                            {/* GHL Form Embed */}
                            <iframe
                                src="https://api.leadconnectorhq.com/widget/form/EWgpdDb4vZV81EZXxWHf"
                                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '0px', minHeight: '700px' }}
                                id="inline-EWgpdDb4vZV81EZXxWHf"
                                data-layout="{'id':'INLINE'}"
                                data-trigger-type="alwaysShow"
                                data-trigger-value=""
                                data-activation-type="alwaysActivated"
                                data-activation-value=""
                                data-deactivation-type="neverDeactivate"
                                data-deactivation-value=""
                                data-form-name="Mortgage Lead Capture"
                                data-height="undefined"
                                data-layout-iframe-id="inline-EWgpdDb4vZV81EZXxWHf"
                                data-form-id="EWgpdDb4vZV81EZXxWHf"
                                title="Mortgage Lead Capture"
                            />
                            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
                        </motion.div>

                        {/* Trust Note Below Form */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-center text-zinc-500 text-sm mt-8"
                        >
                            🔒 Your information is secure and will never be shared. No obligation.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ========== VALUE PROPOSITIONS SECTION ========== */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                            Why Work With Us?
                        </span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Value Prop 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-4 sm:gap-6"
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-3">Licensed & Experienced</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    BCFSA licensed broker with 18+ years helping Canadians secure mortgages across BC, Alberta, and Ontario.
                                </p>
                            </div>
                        </motion.div>

                        {/* Value Prop 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-4 sm:gap-6"
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-3">Quick Response</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    We aim to reach out within a few hours to discuss your needs and answer your questions.
                                </p>
                            </div>
                        </motion.div>

                        {/* Value Prop 3 */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-4 sm:gap-6"
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-3">Personalized Service</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Every client's situation is unique. We take time to understand your goals and find solutions that fit.
                                </p>
                            </div>
                        </motion.div>

                        {/* Value Prop 4 */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-4 sm:gap-6"
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-3">No Obligation</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Our consultation is free. Learn about your options with no pressure to commit.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== FAQ SECTION ========== */}
            <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                            Common Questions
                        </span>
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* FAQ 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8"
                        >
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-3">
                                How quickly will I hear from you?
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                We aim to reach out within a few hours during business hours (9 AM - 6 PM PT, Monday-Saturday). If you submit after hours, we'll contact you the next business day.
                            </p>
                        </motion.div>

                        {/* FAQ 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8"
                        >
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-3">
                                Is there any cost for the consultation?
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                No. The initial consultation is completely free with no obligation. We'll discuss your needs and provide guidance at no charge.
                            </p>
                        </motion.div>

                        {/* FAQ 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8"
                        >
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-3">
                                What information do I need to provide?
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Just the basics in our form: your name, contact info, income range, and what type of mortgage you're interested in. We'll gather additional details during our conversation.
                            </p>
                        </motion.div>

                        {/* FAQ 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8"
                        >
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-3">
                                Do you work with first-time homebuyers?
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Absolutely! We help first-time buyers navigate the process, explain programs available, and find the best rates. We'll walk you through each step.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="py-12 bg-black border-t border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-6">
                        {/* Logo/Brand */}
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-100">Kraft Mortgages</h3>
                            <p className="text-zinc-500 text-sm mt-2">Varun Chaudhry • Licensed Mortgage Broker</p>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                            <p className="text-zinc-400">
                                <a href="tel:+16047271579" className="hover:text-gold-400 transition-colors inline-flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    (604) 727-1579
                                </a>
                            </p>
                            <p className="text-zinc-400">
                                <a href="mailto:varun@kraftmortgages.ca" className="hover:text-gold-400 transition-colors inline-flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    varun@kraftmortgages.ca
                                </a>
                            </p>
                        </div>

                        {/* Legal */}
                        <div className="text-zinc-500 text-sm space-y-1">
                            <p>BCFSA License #M08001935</p>
                            <p>Licensed in British Columbia, Alberta, and Ontario</p>
                        </div>

                        {/* Links */}
                        <div className="flex justify-center gap-6 text-sm">
                            <a href="https://www.kraftmortgages.ca" className="text-zinc-500 hover:text-gold-400 transition-colors">
                                Main Website
                            </a>
                            <a href="https://www.kraftmortgages.ca/blog" className="text-zinc-500 hover:text-gold-400 transition-colors">
                                Blog
                            </a>
                        </div>

                        {/* Copyright */}
                        <p className="text-zinc-600 text-xs">
                            © {new Date().getFullYear()} Kraft Mortgages Canada Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
