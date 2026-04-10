"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function LethbridgePage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Lethbridge, Alberta
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Lethbridge's Premier Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Southern Alberta's largest city combines small-town affordability with big-city amenities. Kraft Mortgages helps Lethbridge buyers — from university students to ranching families — find the right mortgage at the right price.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                        >
                            Get Pre-Approved Today
                        </Link>
                    </div>
                </section>

                {/* City Context */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">The Lethbridge Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Lethbridge offers some of the best housing affordability in Alberta. The average home price is approximately $365,000, with single-family homes around $400,000 and condominiums available near $200,000. These prices make homeownership achievable for many families and young professionals.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Southern Alberta's Anchor</h3>
                                <p className="text-gray-400">With a population exceeding 105,000 and the University of Lethbridge driving a steady influx of students and staff, Lethbridge is the economic and cultural centre of southern Alberta. Agriculture, healthcare, and education form a diversified employment base.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Lethbridge</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Southern Alberta's agricultural and small business economy means many buyers have income that does not fit standard T4 categories. We work with lenders offering stated income, bank statement, and alternative qualification programs.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Rural & Acreage Financing</h3>
                                <p className="text-gray-400">Surrounded by some of Canada's most productive farmland, Lethbridge buyers often seek rural properties. We arrange financing for acreages, hobby farms, and agricultural properties through specialized lenders who understand rural Alberta.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Investment Properties</h3>
                                <p className="text-gray-400">Strong rental demand from university students and young workers makes Lethbridge an attractive investment market. We help investors structure financing for single-family rentals, duplexes, and small multi-unit properties.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Lethbridge Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Lethbridge is not Calgary or Edmonton — and that is a strength. The market moves differently here, property types vary widely from urban condos to quarter-section acreages, and local lenders like First Calgary Financial and community credit unions play a bigger role. We understand the southern Alberta landscape and leverage a wide network of lenders to secure terms that reflect the true opportunity this market offers.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the minimum down payment to buy in Lethbridge?</h3>
                                <p className="text-gray-400">With average prices well under $500,000, most homes in Lethbridge qualify for a 5% minimum down payment. That means you could enter the market with as little as $18,000 for a $365,000 home, plus closing costs.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I get a mortgage for farmland near Lethbridge?</h3>
                                <p className="text-gray-400">Yes, though agricultural land financing differs from residential mortgages. We work with Farm Credit Canada and private agricultural lenders to arrange financing for farmland purchases. Income from farming operations is factored into qualification differently than employment income.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is Lethbridge a good market for rental property investment?</h3>
                                <p className="text-gray-400">Absolutely. Low purchase prices combined with consistent demand from U of L students, healthcare workers, and young families create favourable conditions for cash-flow-positive rental properties. We can help you model returns and structure appropriate financing.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Lethbridge team today for a free consultation.</p>
                        <div className="flex gap-4 justify-center">
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
