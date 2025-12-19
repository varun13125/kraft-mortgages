"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, TrendingUp, Home, Sun } from "lucide-react";

export default function KelownaPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Kelowna, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Kelowna's Trusted Mortgage Experts
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            From the beautiful shores of Okanagan Lake to the thriving downtown core, Kraft Mortgages is proud to serve the Kelowna community with tailored mortgage solutions.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                        >
                            Get Pre-Approved Today
                        </Link>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Kelowna</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Residential Mortgages</h3>
                                <p className="text-gray-400">Whether you're buying your first home near the Mission or a family home in Glenmore, we provide access to the best rates and terms.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Kelowna's economy is driven by entrepreneurs. We specialize in crafting applications that reflect the true income of self-employed individuals.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Investment Property Loans</h3>
                                <p className="text-gray-400">With a booming tourism industry and growing population, Kelowna is prime for real estate investment. We structure financing for rental and vacation properties.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Kelowna */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">The Okanagan Advantage</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            We understand the unique dynamics of the Okanagan real estate market—from waterfront properties to vineyard estates. Our local knowledge ensures you get the right mortgage for your Kelowna property goals.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Kelowna team today for a free consultation.</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/contact"
                                className="bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                            >
                                Book a Consultation
                            </Link>
                            <a
                                href="tel:+16045551234"
                                className="bg-white/10 border border-white/20 font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                Call Now
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
