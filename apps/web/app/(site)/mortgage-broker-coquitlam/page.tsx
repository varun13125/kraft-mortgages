"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function CoquitlamPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Coquitlam, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Coquitlam's Premier Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            The Tri-Cities is one of Metro Vancouver's most desirable places to live, and Coquitlam sits at its heart. Kraft Mortgages helps families, investors, and first-time buyers secure competitive financing in this rapidly growing market.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Coquitlam Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Coquitlam's benchmark home price is approximately $950,000, with townhomes averaging around $800,000 and condominiums near $600,000. Burquitlam and the Burke Mountain area have seen significant price growth as new developments transform these neighbourhoods.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">A City on the Rise</h3>
                                <p className="text-gray-400">With a population over 165,000 and the Evergreen SkyTrain extension connecting Burquitlam to the rest of Metro Vancouver, Coquitlam has become a magnet for young professionals and growing families seeking affordability without sacrificing transit access.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Coquitlam</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Coquitlam's diverse economy supports thousands of small business owners. We specialize in mortgages for entrepreneurs who may not fit traditional bank income requirements, using alternative qualification methods.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Pre-Sale Financing</h3>
                                <p className="text-gray-400">Burke Mountain and the Burquitlam-Lougheed corridor are hotbeds of new development. We guide buyers through pre-sale deposits, assignment contracts, and completion financing for brand-new homes.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Refinancing</h3>
                                <p className="text-gray-400">Whether you want to consolidate debt, access home equity for renovations, or secure a better rate before your term expires, we compare offers across dozens of lenders to find the refinancing solution that fits your goals.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Coquitlam Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Coquitlam's real estate landscape is constantly evolving, from the SkyTrain-driven densification around Burquitlam to the master-planned communities on Burke Mountain. A local broker understands these dynamics and how they affect property values and lender appetites. We shop across more than 50 lenders — banks, credit unions, and private — so you get options a single institution simply cannot offer.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does the Evergreen SkyTrain line affect Coquitlam property values?</h3>
                                <p className="text-gray-400">Properties within walking distance of SkyTrain stations, particularly around Burquitlam and Lincoln, command premiums. Transit proximity is a strong value driver and appeals to both owners and renters. We factor these trends into financing advice.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What do I need for a pre-sale assignment?</h3>
                                <p className="text-gray-400">Assignment financing requires the original purchase contract, developer consent, and the buyer's qualification. Not all lenders handle assignments. We work with those who do, structuring your financing so you can complete on time and on budget.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I buy a home in Coquitlam with less than 20% down?</h3>
                                <p className="text-gray-400">Yes. Properties under $1 million can be purchased with as little as 5% down. For homes priced between $500,000 and $999,999, the minimum down payment is 5% on the first $500,000 and 10% on the balance above that.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Coquitlam team today for a free consultation.</p>
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
