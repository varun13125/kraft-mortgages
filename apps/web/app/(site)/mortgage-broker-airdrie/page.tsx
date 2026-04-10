"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function AirdriePage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Airdrie, Alberta
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Airdrie's Top-Rated Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Just minutes north of Calgary, Airdrie is one of Alberta's fastest-growing cities. Kraft Mortgages helps families and investors take full advantage of this booming market with expert guidance and competitive rates.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Airdrie Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Airdrie's average home price is approximately $490,000, with single-family homes averaging around $530,000. Townhomes and duplexes in newer communities like Windsong and Reunion offer options in the $380,000 to $420,000 range, providing excellent value relative to nearby Calgary.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">One of Alberta's Fastest-Growing Cities</h3>
                                <p className="text-gray-400">With a population over 80,000 and annual growth rates consistently among the highest in Canada, Airdrie attracts young families drawn by affordable housing, excellent schools, and an easy commute to Calgary via the Queen Elizabeth II Highway.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Airdrie</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Many Airdrie residents commute to Calgary for work or run businesses locally. For self-employed buyers, we use bank statement programs, stated income options, and alternative documentation to secure approval regardless of traditional income verification challenges.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">New Construction Financing</h3>
                                <p className="text-gray-400">Airdrie is a builder's city, with new communities appearing regularly. We guide buyers through builder deposits, progress draw schedules, and completion financing for new builds, ensuring a smooth process from lot selection to move-in day.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Calgary Commuter Mortgages</h3>
                                <p className="text-gray-400">If you work in Calgary but live in Airdrie, you are not alone. We help commuters optimize their mortgage strategy — factoring in transportation costs, commute time, and the lower cost of Airdrie real estate to build a strong financial picture for lenders.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Airdrie Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Airdrie's rapid growth means its real estate market is always shifting. New builder incentive programs, evolving community amenity fees, and changing property tax structures all affect your total cost of ownership. A local broker tracks these factors and adjusts your mortgage strategy accordingly. We compare offers from over 50 lenders, including Alberta credit unions that understand the Airdrie market specifically.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How do builder incentives work for new homes in Airdrie?</h3>
                                <p className="text-gray-400">Builders often offer incentives like free upgrades, closing cost credits, or rate buy-downs. These can significantly affect your total cost. We review builder incentive packages alongside your mortgage options to make sure you are getting genuine value, not just marketing.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I get pre-approved before choosing a specific Airdrie community?</h3>
                                <p className="text-gray-400">Absolutely. We recommend getting pre-approved before you start touring new communities or resale homes. A pre-approval gives you a clear budget, locks in a rate hold for up to 120 days, and puts you in a stronger negotiating position.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is it worth buying in Airdrie instead of Calgary?</h3>
                                <p className="text-gray-400">For many families, yes. Airdrie offers similar community amenities to Calgary at significantly lower price points. The commute is manageable via Highway 2, and the savings on your mortgage can be substantial. We can help you run the numbers for your specific situation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Airdrie team today for a free consultation.</p>
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
