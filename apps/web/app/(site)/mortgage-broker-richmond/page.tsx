"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home, Globe } from "lucide-react";

export default function RichmondPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Richmond, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Richmond's Go-To Mortgage Broker
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Richmond is one of Canada's most diverse and dynamic real estate markets. Kraft Mortgages brings 23+ years of experience, multilingual service, and deep lender relationships to every Richmond transaction.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Richmond Mortgage Market</h2>
                        <p className="text-gray-300 text-lg mb-6">
                            Richmond's average home price sits around $1 million as of early 2025, making it one of Metro Vancouver's most significant real estate markets. The city's unique position — an island municipality connected to Vancouver by bridge, adjacent to YVR airport, and home to one of Canada's largest immigrant communities — creates a mortgage landscape unlike any other in BC.
                        </p>
                        <p className="text-gray-300 text-lg mb-6">
                            Richmond attracts buyers from around the world. Its vibrant Chinese, South Asian, and Filipino communities have shaped neighbourhoods that range from the luxury homes of Broadmoor and Terra Nova to the high-density condo corridor along No. 3 Road. Steveston, Richmond's historic waterfront village, offers a charming mix of heritage homes, townhouses, and newer developments that command premium prices.
                        </p>
                        <p className="text-gray-300 text-lg">
                            Investment activity in Richmond remains strong, driven by the city's proximity to the airport, excellent transit, and consistent rental demand. Many clients come to us with international income, foreign credit histories, or unique financial structures that big banks struggle to accommodate. Kraft Mortgages specializes in these situations — connecting newcomers and investors with lenders who understand Richmond's market and its buyers.
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Richmond</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Globe className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Newcomer & Immigrant Mortgages</h3>
                                <p className="text-gray-400">Richmond is home to one of Canada's largest newcomer populations. We specialize in helping recent immigrants navigate Canadian mortgage requirements, including foreign income verification and alternative credit programs.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Investment Property Financing</h3>
                                <p className="text-gray-400">Richmond's strong rental market and international buyer interest make it an investor favourite. We work with lenders who understand multi-property portfolios and can structure financing for growing portfolios.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Steveston & Waterfront Properties</h3>
                                <p className="text-gray-400">Waterfront and heritage-area properties in Steveston have unique appraisal and insurance considerations. We know which lenders are comfortable with these specialized property types.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Richmond Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Richmond's real estate market is shaped by international forces — immigration policy, foreign buyer taxes, cross-border income, and global capital flows. A local broker who works in Richmond every day understands how these factors affect your mortgage options. We have relationships with lenders who are experienced with international buyers, foreign income documentation, and the specific property types that define Richmond — from new-build condos in City Centre to waterfront homes in Steveston.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can I get a mortgage in Richmond with foreign income?</h3>
                                <p className="text-gray-400">Yes, several lenders offer programs for newcomers and borrowers with foreign income. The documentation requirements vary — some accept foreign tax returns and bank statements, while others require a Canadian employment history. We match you with the right lender for your situation.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Does the foreign buyer tax apply to mortgages?</h3>
                                <p className="text-gray-400">The foreign buyer surtax is a property transfer tax matter, separate from mortgage qualification. However, it does affect your total closing costs, which we factor into your financing plan. Canadian citizens and permanent residents are typically exempt.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">What is the average condo price in Richmond City Centre?</h3>
                                <p className="text-gray-400">Richmond's City Centre (the No. 3 Road corridor) has a benchmark condo price around $600,000–$750,000 as of early 2025, depending on size, age, and proximity to the Canada Line.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is Richmond a good market for rental property investment?</h3>
                                <p className="text-gray-400">Richmond consistently ranks among the top rental markets in Metro Vancouver due to its proximity to YVR, strong immigrant inflow, and Canada Line transit access. Cap rates are competitive, and vacancy rates remain low.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">How does flood risk affect mortgage approval in Richmond?</h3>
                                <p className="text-gray-400">Richmond is below sea level in many areas, which can affect insurance requirements. Some lenders have stricter policies for properties in designated flood zones. We work with lenders experienced with Richmond's geography to ensure smooth approvals.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Buy in Richmond?</h2>
                        <p className="text-gray-400 mb-8">Whether you are a newcomer, investor, or growing family — we are here to help.</p>
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
