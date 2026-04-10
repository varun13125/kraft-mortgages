"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function WindsorPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Windsor, Ontario
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Windsor's Trusted Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            As one of Canada's most affordable major cities, Windsor offers an exceptional opportunity for homebuyers and investors. Kraft Mortgages brings expert mortgage guidance to help you make the most of this border city market.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Windsor Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Windsor remains one of Canada's most affordable housing markets, with the average home price around $520,000. Single-family homes in desirable neighbourhoods like South Windsor and Riverside average approximately $580,000, while entry-level properties and condominiums can be found well under $400,000.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">A Resurgent Economy</h3>
                                <p className="text-gray-400">With a metropolitan population of over 340,000, Windsor's economy is experiencing a renaissance. The EV battery gigafactory investments, a revitalized downtown, and the University of Windsor are driving renewed demand for housing across all segments.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Windsor</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Windsor's small business community is diverse — from manufacturing contractors to hospitality operators. We specialize in mortgage programs for self-employed borrowers, using alternative documentation to get you approved at competitive rates.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Investment Properties</h3>
                                <p className="text-gray-400">Windsor's affordability makes it one of Canada's strongest rental property markets by cap rate. With U of Windsor students, cross-border workers, and automotive sector employees driving consistent rental demand, investors find excellent cash-flow opportunities here.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Newcomer Mortgages</h3>
                                <p className="text-gray-400">Windsor has long been a gateway for new Canadians, particularly from South Asia and the Middle East. We understand the unique documentation and credit-building challenges newcomers face and connect you with lenders who have dedicated newcomer programs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Windsor Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Windsor's market is shaped by factors unique to a border city — cross-border employment, US-dollar income considerations, and economic cycles tied to the automotive industry. A local broker understands how these elements affect your mortgage qualification and which lenders are most active in southwestern Ontario. We shop across dozens of lenders to secure the best rate and terms for your specific situation.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I qualify for a mortgage if I earn US dollars working in Detroit?</h3>
                                <p className="text-gray-400">Yes, but the process requires documentation of your US income and employment. Lenders convert US income to Canadian dollars for qualification purposes. We work with lenders experienced in cross-border income scenarios to ensure your application is properly structured.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is Windsor a good market for first-time home buyers?</h3>
                                <p className="text-gray-400">Excellent. Windsor's affordable prices mean first-time buyers can often purchase a detached home — something increasingly difficult in Toronto or Vancouver. With 5% down, many buyers in Windsor can enter the market for a total investment under $30,000 including closing costs.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How are the EV battery plant investments affecting Windsor's housing market?</h3>
                                <p className="text-gray-400">Major investments from Stellantis and LG are creating thousands of high-paying jobs, driving population growth and housing demand. This economic momentum is expected to support price appreciation, making Windsor an attractive market for both owner-occupiers and investors.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Windsor team today for a free consultation.</p>
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
