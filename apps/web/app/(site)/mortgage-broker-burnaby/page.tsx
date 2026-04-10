"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, Train } from "lucide-react";

export default function BurnabyPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Burnaby, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Burnaby's Premier Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            From the high-rise towers of Metrotown to the family-friendly streets of Edmonds, Kraft Mortgages has been helping Burnaby buyers secure the best rates for over two decades.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Burnaby Mortgage Market</h2>
                        <p className="text-gray-300 text-lg mb-6">
                            Burnaby has emerged as one of Metro Vancouver's most desirable cities, with an average home price around $950,000 as of early 2025. Its strategic location between Vancouver and Surrey, combined with extensive SkyTrain connectivity, makes it a magnet for both homeowners and investors.
                        </p>
                        <p className="text-gray-300 text-lg mb-6">
                            Metrotown remains the tallest and densest neighbourhood in BC outside downtown Vancouver, with thousands of condo units ranging from entry-level one-bedrooms to luxury penthouses. The Brentwood area has experienced a massive transformation, with new condo developments commanding premium prices thanks to the Brentwood Town Centre SkyTrain station. Further south, Edmonds offers a quieter, more affordable alternative with excellent transit access and a growing retail scene.
                        </p>
                        <p className="text-gray-300 text-lg">
                            The SFU area atop Burnaby Mountain provides a unique sub-market — a mix of university-adjacent condos, faculty housing, and single-family homes in the surrounding UniverCity community. Whether you are a first-time buyer looking at a Metrotown studio or a growing family exploring the detached homes near Deer Lake, Kraft Mortgages has the lender relationships and local knowledge to find your best mortgage solution.
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Burnaby</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Condo & Presale Financing</h3>
                                <p className="text-gray-400">Burnaby's skyline is built on new developments. We specialize in presale assignment financing and condo mortgages, navigating strata reviews and builder requirements with ease.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Train className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Transit-Oriented Purchases</h3>
                                <p className="text-gray-400">Properties near SkyTrain stations command premium prices and attract investors. We work with lenders who value transit proximity in their property assessments.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">First-Time Home Buyer Plans</h3>
                                <p className="text-gray-400">Burnaby offers more entry-level options than Vancouver. We help first-timers take advantage of RRSP Home Buyers' Plan, GST rebates, and the First-Time Home Buyer Incentive where applicable.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Burnaby Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Burnaby is not one market — it is several. A Metrotown condo and a South Burnaby detached home require entirely different lending approaches. We understand that Burnaby strata corporations have their own quirks, that SFU-area properties come with unique zoning considerations, and that the Edmonds corridor is rapidly appreciating. This local insight means we can match you with lenders who know and value Burnaby real estate, getting you better terms than a one-size-fits-all bank approach.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the average condo price in Metrotown?</h3>
                                <p className="text-gray-400">As of early 2025, the benchmark condo price in the Metrotown area is approximately $650,000–$800,000 depending on size, age, and building amenities. Newer towers with premium finishes tend to sit at the higher end.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I assign my Burnaby presale contract?</h3>
                                <p className="text-gray-400">Presale assignments are possible but depend on the builder's policies. Some Burnaby developers allow assignments after a certain percentage is paid, while others restrict them entirely. We have experience with assignment financing and can guide you through the process.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is it easier to get a mortgage in Burnaby than Vancouver?</h3>
                                <p className="text-gray-400">The qualification criteria are the same nationally, but Burnaby's lower average price point means your dollar goes further. A $950,000 Burnaby home may require a smaller mortgage than a comparable Vancouver property, making it easier to meet debt service ratios.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What are the best Burnaby neighbourhoods for investment properties?</h3>
                                <p className="text-gray-400">Metrotown, Brentwood, and Edmonds all offer strong rental demand thanks to SkyTrain access. Lougheed Town Centre is also emerging as an investment hotspot with new developments and transit expansion planned.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does SFU proximity affect property values?</h3>
                                <p className="text-gray-400">Properties near SFU benefit from consistent rental demand — both from students and faculty. The UniverCity development has created a planned community with strong property values and stable occupancy rates, making it attractive to both owner-occupiers and investors.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Buy in Burnaby?</h2>
                        <p className="text-gray-400 mb-8">Get a free mortgage consultation tailored to Burnaby's market.</p>
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
