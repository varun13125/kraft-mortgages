"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, TrendingUp, Home, Wheat } from "lucide-react";

export default function AbbotsfordPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Abbotsford, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Abbotsford's Trusted Mortgage Experts
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Nestled in the heart of the Fraser Valley, Abbotsford is a community rich in opportunity. Kraft Mortgages provides expert mortgage services to farmers, entrepreneurs, and families.
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
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Abbotsford</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Residential Mortgages</h3>
                                <p className="text-gray-400">Whether you're looking for a home in the city or a property with more space, we offer mortgage solutions tailored to the Abbotsford market.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">The Fraser Valley's economy is built by entrepreneurs. We offer specialized mortgage products designed for the self-employed.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Wheat className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Agricultural Mortgages</h3>
                                <p className="text-gray-400">We have experience with lenders who specialize in financing for agricultural properties and large acreages in the Abbotsford area.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Abbotsford team today for a free consultation.</p>
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
