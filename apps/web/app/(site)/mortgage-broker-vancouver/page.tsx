"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export default function VancouverPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Vancouver, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Vancouver's Trusted Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Navigating Vancouver's real estate market takes more than luck — it takes a mortgage broker who knows every neighbourhood, every lender, and every strategy to get you the best rate.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                        >
                            Get Pre-Approved Today
                        </Link>
                    </div>
                </section>

                {/* Market Overview */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">The Vancouver Mortgage Market</h2>
                        <p className="text-gray-300 text-lg mb-6">
                            Vancouver consistently ranks among the most expensive housing markets in Canada, with an average home price hovering around $1.2 million as of early 2025. The market spans an incredible range — from downtown condos starting under $600,000 to West Side detached homes that regularly sell for $3 million and beyond.
                        </p>
                        <p className="text-gray-300 text-lg mb-6">
                            What makes Vancouver unique is its diversity of property types and price points. East Vancouver has become one of the hottest markets in the country, attracting young families and investors alike with its character homes and rising condo developments. The corridor along the Burnaby border — areas like Renfrew-Collingwood and Victoria-Fraserview — offers relative value compared to the West Side while still delivering strong appreciation.
                        </p>
                        <p className="text-gray-300 text-lg">
                            Whether you are buying your first condo in Mount Pleasant, upgrading to a detached home in Kerrisdale, or investing in a rental property in East Van, having a mortgage broker who understands Vancouver's micro-markets is essential. Kraft Mortgages has been serving Vancouver families and investors for over 23 years, with access to 40+ lenders and $2 billion in funded mortgages.
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Vancouver</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">First-Time Buyer Programs</h3>
                                <p className="text-gray-400">Vancouver is tough for first-timers. We specialize in helping you maximize your purchasing power with the right combination of down payment strategies, pre-approval timing, and lender selection.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Investment Property Mortgages</h3>
                                <p className="text-gray-400">Vancouver is Canada's premier rental market. We work with lenders who understand the unique math of investment properties — from single-suite conversions to full multi-unit buildings.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">High-Ratio & Jumbo Mortgages</h3>
                                <p className="text-gray-400">From 5% down condos to multi-million dollar West Side purchases, we have lender relationships across the entire spectrum. Our volume gives us access to preferred rates at every price point.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Vancouver Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Vancouver's real estate market moves fast and rewards preparation. A local broker understands the difference between a Mount Pleasant condo and a False Creek townhouse — not just in price, but in how lenders view them. We know which lenders specialize in strata properties over 20 years old, which ones favour presale assignments, and which private lenders can close in days when you need speed. That neighbourhood-level knowledge translates directly into better rates, faster approvals, and fewer surprises at closing.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the minimum down payment to buy in Vancouver?</h3>
                                <p className="text-gray-400">For homes under $500,000, the minimum is 5%. For homes between $500,000 and $999,999, it is 5% on the first $500,000 and 10% on the remainder. For homes over $1 million, the minimum is 20%. Given Vancouver's average price, most buyers will need at least $60,000–$100,000 down.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I buy a Vancouver condo with less than 20% down?</h3>
                                <p className="text-gray-400">Yes, if the purchase price is under $1 million, you can put as little as 5% down. However, you will need mortgage default insurance (CMHC or private), and the strata must meet the lender's criteria — including financial health, age of the building, and any pending special assessments.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does the Vancouver vacancy tax affect my investment property mortgage?</h3>
                                <p className="text-gray-400">The Empty Homes Tax and BC Speculation and Vacancy Tax can impact your holding costs. We factor these into your debt service calculations to ensure you qualify with the right lender and are not caught off guard by additional tax obligations.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is it better to buy in East Van or along the Burnaby border?</h3>
                                <p className="text-gray-400">Both areas offer strong value relative to the West Side. East Vancouver neighbourhoods like Hastings-Sunrise and Grandview-Woodland have seen significant appreciation. Areas along the Burnaby border like Renfrew-Collingwood benefit from SkyTrain access. We can help you compare the numbers.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How fast can I get pre-approved in Vancouver's competitive market?</h3>
                                <p className="text-gray-400">We can provide a pre-approval within 24 hours — often the same day. In a market where multiple offers are common, having a firm pre-approval in hand can be the difference between winning and losing your dream home.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Make Your Move in Vancouver?</h2>
                        <p className="text-gray-400 mb-8">Get a free, no-obligation mortgage consultation. We respond within 24 hours.</p>
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
