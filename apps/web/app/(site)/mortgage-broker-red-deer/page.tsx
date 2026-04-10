"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function RedDeerPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Red Deer, Alberta
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Red Deer's Trusted Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Positioned halfway between Calgary and Edmonton, Red Deer is central Alberta's economic hub. Kraft Mortgages offers expert mortgage guidance tailored to this dynamic, resource-driven market.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Red Deer Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Red Deer's average home price is approximately $400,000, making it one of the most affordable mid-sized cities in Alberta. Single-family homes average around $440,000, while condominiums offer entry points near $220,000 — exceptional value compared to BC markets.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Central Alberta's Hub</h3>
                                <p className="text-gray-400">With a population over 107,000 and growing satellite communities like Blackfalds and Lacombe, Red Deer benefits from Alberta's strong economy, diversified by healthcare, education, manufacturing, and logistics sectors.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Red Deer</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Red Deer's entrepreneurial community is significant. Whether you run an oilfield services company, a retail business, or a trades operation, we work with lenders who understand the income structures of Alberta's self-employed workforce.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Acreage & Rural Financing</h3>
                                <p className="text-gray-400">Central Alberta's acreage market is strong. We specialize in financing rural properties, hobby farms, and acreages with outbuildings — working with lenders who understand agricultural and rural property valuation.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">First-Time Buyer Programs</h3>
                                <p className="text-gray-400">Alberta's affordable prices mean many buyers can enter the market sooner. We help first-time buyers access the best rates, navigate mortgage default insurance, and take advantage of government programs and incentives.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Red Deer Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Red Deer's economy moves with the energy sector, but it is far more diversified than most people realize. A local broker understands how commodity price cycles affect employment and lending in central Alberta, and can advise on timing, rate selection, and term length accordingly. We compare rates and terms from banks, credit unions, and alternative lenders to make sure you are getting the best deal available — not just the one your bank is offering.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I buy a home in Red Deer with 5% down?</h3>
                                <p className="text-gray-400">Yes. For homes priced under $500,000, the minimum down payment is 5%. Given Red Deer's affordable prices, many first-time buyers can enter the market with as little as $20,000 down for a typical single-family home.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does the energy sector affect mortgage rates in Red Deer?</h3>
                                <p className="text-gray-400">Mortgage rates are set nationally by the Bank of Canada, not by local industry conditions. However, employment stability in the energy sector can affect your ability to qualify. We work with lenders who understand seasonal and contract-based income common in oil and gas.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is financing available for acreages around Red Deer?</h3>
                                <p className="text-gray-400">Yes. Rural properties, acreages, and hobby farms are financeable, though lenders may require larger down payments (typically 20-25%) depending on the property's zoning and income potential. We have relationships with lenders who specialize in rural Alberta properties.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Red Deer team today for a free consultation.</p>
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
