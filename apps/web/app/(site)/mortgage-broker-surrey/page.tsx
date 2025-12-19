"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function SurreyPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Surrey, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Surrey's Top-Rated Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            For over a decade, Kraft Mortgages has been a dedicated partner to the Surrey community, helping families and investors navigate one of Canada's most dynamic real estate markets.
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
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Surrey</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Surrey's entrepreneurial spirit is booming. We specialize in stated income loans that showcase the true strength of your business.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Construction Loans</h3>
                                <p className="text-gray-400">With developments in Cloverdale and South Surrey, we have established relationships with lenders who specialize in construction financing.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Newcomer Mortgages</h3>
                                <p className="text-gray-400">Welcome to Surrey! We understand the unique documentation challenges faced by newcomers and guide you through the mortgage process.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Surrey Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            In a competitive market like Surrey, local expertise is your greatest advantage. Unlike a big bank, we have one priority: you. We leverage our strong relationships with a wide network of lenders—including local credit unions and private lenders who understand the nuances of Surrey's property values.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the minimum down payment for a home in Surrey?</h3>
                                <p className="text-gray-400">For most properties in Surrey, the minimum down payment is 5% of the purchase price for homes under $500,000. For homes between $500,000 and $999,999, it's 5% on the first $500,000 and 10% on the remainder.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How can I compete in popular Surrey neighbourhoods like Fleetwood or Guildford?</h3>
                                <p className="text-gray-400">In high-demand areas, a mortgage pre-approval is essential. It shows sellers you are a serious, qualified buyer. We can get you pre-approved quickly, allowing you to make a firm, confident offer.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Are there special mortgage considerations for agricultural zones of Surrey?</h3>
                                <p className="text-gray-400">Yes, properties in areas like Cloverdale or parts of South Surrey that are on agricultural land require specialized financing. We have experience with lenders who are comfortable with these property types.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Surrey team today for a free consultation.</p>
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
