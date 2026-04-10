"use client";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { MapPin, Phone, Building, Users, Briefcase, Home } from "lucide-react";

export default function VictoriaPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Hero */}
                <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6">
                            <MapPin className="w-4 h-4" />
                            Victoria, BC
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Victoria's Trusted Mortgage Brokerage
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            As BC's capital city, Victoria combines historic charm with a thriving modern economy. Kraft Mortgages brings deep expertise to one of Canada's most competitive island markets, helping buyers at every stage of the journey.
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
                        <h2 className="text-3xl font-bold mb-6 text-center">The Victoria Housing Market</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Home className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Average Home Price</h3>
                                <p className="text-gray-400">Victoria's benchmark home price sits around $900,000, with single-family homes in sought-after areas like Oak Bay and Fairfield exceeding $1.3 million. Condominiums in downtown Victoria and the Burnside area average approximately $550,000, offering a strong entry point for first-time buyers.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">A Capital City Market</h3>
                                <p className="text-gray-400">Greater Victoria's population of nearly 400,000 is bolstered by government, tech, and tourism sectors. Limited land availability on the southern tip of Vancouver Island keeps supply tight, supporting sustained price growth and making Victoria one of BC's most resilient markets.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Mortgage Services in Victoria</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Self-Employed Mortgages</h3>
                                <p className="text-gray-400">Victoria's tech scene and creative economy mean many buyers are entrepreneurs or freelancers. We specialize in mortgage programs that look beyond T4 income to qualify self-employed professionals at competitive rates.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Building className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Heritage & Character Homes</h3>
                                <p className="text-gray-400">Victoria's older neighbourhoods like James Bay, Fernwood, and Harris Green are filled with character homes. Financing these properties can involve unique appraisal considerations, and we know which lenders specialize in them.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <Users className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3">Retirement & Downsizing</h3>
                                <p className="text-gray-400">Victoria is Canada's quintessential retirement destination. We help downsizers unlock equity, transition to condos or townhomes, and structure financing that preserves financial flexibility through retirement years.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Local */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose a Local Victoria Mortgage Broker?</h2>
                        <p className="text-gray-300 text-lg text-center mb-8">
                            Victoria's market has its own rhythm — influenced by seasonal buying patterns, military relocations at CFB Esquimalt, university enrolment at UVic, and the steady influx of retirees from across Canada. A broker who understands these cycles can time your application, advise on neighbourhood trends, and connect you with lenders who are active in the Victoria market. We work for you, not for one bank.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 px-4 bg-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Is it harder to get a mortgage for a heritage home in Victoria?</h3>
                                <p className="text-gray-400">It can be. Some lenders are cautious about heritage-designated properties due to renovation restrictions and insurance requirements. We work with lenders experienced in Victoria's heritage inventory to ensure smooth financing.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">Can retirees qualify for a mortgage in Victoria?</h3>
                                <p className="text-gray-400">Yes. Lenders consider pension income, investment income, and RRSP withdrawals. We also explore reverse mortgages and home equity lines of credit for retirees who want to access their home equity without monthly payments.</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">When is the best time to buy in Victoria?</h3>
                                <p className="text-gray-400">The market typically slows in late fall and winter, which can mean less competition and more negotiating power. Spring brings renewed activity. However, timing your purchase around your personal readiness — with a pre-approval in hand — is more important than market timing.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">Contact our Victoria team today for a free consultation.</p>
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
