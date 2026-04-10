"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, TreePine } from "lucide-react";

export default function LangleyPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Langley, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Langley's Trusted Mortgage Broker
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            From acreage properties to Willowbrook townhomes, Kraft Mortgages has been helping Langley families and farmers find the right mortgage for over 23 years.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Langley Mortgage Market</h2>
                        <p className="text-gray-300 text-lg mb-6">
                            Langley offers some of the best value in Metro Vancouver, with an average home price around $850,000 as of early 2025. The Township of Langley and the City of Langley together form one of the region's fastest-growing communities, attracting families, farmers, and investors who want more space without leaving the metro area.
                        </p>
                        <p className="text-gray-300 text-lg mb-6">
                            What sets Langley apart is its incredible property diversity. In Willowbrook and the Langley City core, you will find modern townhomes and condos priced well below Vancouver and Burnaby equivalents. The Murrayville and Brookswood neighbourhoods offer established single-family communities with mature trees and larger lots. And then there is Langley's agricultural land — acreages, hobby farms, and working equestrian properties that require specialized mortgage knowledge.
                        </p>
                        <p className="text-gray-300 text-lg">
                            Fort Langley, the birthplace of British Columbia, adds a historic charm that draws both residents and tourists. Properties in this area range from restored heritage homes to new infill developments. The Fraser Highway corridor and upcoming SkyTrain extension (the Surrey-Langley SkyTrain project) are already influencing property values, making Langley one of the most compelling markets in the region for both homeowners and investors.
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Langley</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <TreePine className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Acreage & Farm Financing</h3>
                                <p className="text-gray-400">Langley's Agricultural Land Reserve (ALR) properties require specialized lenders. We have deep experience with rural mortgages, hobby farm financing, and equestrian property loans.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">First-Time Buyer Programs</h3>
                                <p className="text-gray-400">Langley's lower price point makes it one of the best places in Metro Vancouver for first-time buyers. We help you maximize incentives like the RRSP Home Buyers' Plan and First-Time Home Buyer Incentive.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Langley has a thriving small business community. We offer stated income and alternative documentation mortgages for entrepreneurs, contractors, and gig workers who do not fit traditional bank criteria.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Langley Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Langley's property types are far more diverse than most people realize. A half-acre in Brookswood is financed differently than a condo in Willowbrook, and a working farm on ALR land follows entirely different rules. Big banks often struggle with rural properties and acreages — they are unfamiliar with well and septic inspections, agricultural zoning, and the unique appraisal challenges of hobby farms. Kraft Mortgages works with lenders who specialize in exactly these situations. We have been financing Langley properties for over two decades and understand the local market from the ground up.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I get a mortgage for an acreage property in Langley?</h3>
                                <p className="text-gray-400">Yes, but acreage properties require specialized lenders. The key factors are the size of the property, whether it is on the Agricultural Land Reserve (ALR), and the value split between the house and the land. We work with several lenders who actively finance rural Langley properties.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How will the Surrey-Langley SkyTrain affect property values?</h3>
                                <p className="text-gray-400">The SkyTrain extension along Fraser Highway is expected to significantly boost property values in the corridor. Areas like Langley City Centre and Willoughby are already seeing increased developer interest. We can help you time your purchase to maximize value.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the difference between buying in Langley City and Township of Langley?</h3>
                                <p className="text-gray-400">Both share the same postal code and mortgage market, but they have different municipal governments, zoning bylaws, and development plans. Langley City is more urban and densifying, while the Township is more suburban and rural. Both offer excellent opportunities depending on your goals.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Are there first-time buyer incentives specific to Langley?</h3>
                                <p className="text-gray-400">The federal and provincial programs (RRSP Home Buyers' Plan, BC First-Time Home Buyer Program, GST rebate) apply in Langley just as they do elsewhere. Langley's lower prices mean these incentives go further here than in Vancouver or Burnaby.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does well and septic affect mortgage approval?</h3>
                                <p className="text-gray-400">Properties on well water and septic systems (common in rural Langley areas like Aldergrove and parts of Brookswood) require additional inspections and may affect which lenders you can use. We know which lenders are comfortable with these systems and can streamline the approval process.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Buy in Langley?</h2>
                        <p className="text-gray-400 mb-8">From your first townhome to a dream acreage — we have the right mortgage for you.</p>
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
