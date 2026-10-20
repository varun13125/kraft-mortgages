"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Building, CheckCircle, AlertTriangle, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { useLiveRates } from "@/lib/useLiveRates";
import { livePrime, ratesAsOf } from "@/components/calculators/liveRateDefaults";

interface BuilderProgram {
    name: string;
    lender: string;
    maxLTV: number; // max loan-to-cost
    minDownPayment: number;
    /** Illustrative spread over prime (construction loans are typically floating). */
    primeSpread: number;
    maxLoanAmount: number;
    features: string[];
    requirements: string[];
}

// Static prime used when the live rate feed is unavailable (Bank of Canada-linked prime, Oct 2026).
const FALLBACK_PRIME = 4.45;

const builderPrograms: BuilderProgram[] = [
    {
        name: "Prime Builder Program",
        lender: "Major Bank A",
        maxLTV: 75,
        minDownPayment: 25,
        primeSpread: 2.30, // 6.75% at prime 4.45%
        maxLoanAmount: 2000000,
        features: ["Fast approval (5-7 days)", "Flexible draw schedule", "Streamlined documentation"],
        requirements: ["2+ years experience", "3+ completed projects", "Strong credit (680+)"]
    },
    {
        name: "Emerging Builder",
        lender: "Credit Union B",
        maxLTV: 65,
        minDownPayment: 35,
        primeSpread: 2.80, // 7.25% at prime 4.45%
        maxLoanAmount: 1000000,
        features: ["New builder friendly", "Project mentorship", "Competitive rates"],
        requirements: ["1+ completed project", "Licensed contractor", "Detailed business plan"]
    },
    {
        name: "Custom Home Builder",
        lender: "Private Lender C",
        maxLTV: 80,
        minDownPayment: 20,
        primeSpread: 4.05, // 8.50% at prime 4.45%
        maxLoanAmount: 3000000,
        features: ["Higher LTV available", "Luxury home specialist", "Fast funding"],
        requirements: ["5+ years experience", "Portfolio of work", "Strong reserves"]
    },
    {
        name: "Spec Home Program",
        lender: "Regional Bank D",
        maxLTV: 70,
        minDownPayment: 30,
        primeSpread: 2.55, // 7.00% at prime 4.45%
        maxLoanAmount: 1500000,
        features: ["Pre-approved lots", "Bulk pricing available", "Marketing support"],
        requirements: ["3+ spec homes completed", "Pre-sale agreements", "Market analysis"]
    }
];

export default function BuilderProgramCalculator() {
    const [projectCost, setProjectCost] = useState(800000);
    const [downPayment, setDownPayment] = useState(200000);
    const [constructionMonths, setConstructionMonths] = useState(12);
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
    const { data: liveRates, loading: ratesLoading } = useLiveRates();
    const prime = livePrime(liveRates) ?? FALLBACK_PRIME;
    const primeIsLive = livePrime(liveRates) !== undefined;
    const rateFor = (program: BuilderProgram) => Math.round((prime + program.primeSpread) * 100) / 100;

    const downPaymentPercent = projectCost > 0 ? (downPayment / projectCost) * 100 : 0;
    const loanAmount = Math.max(0, projectCost - downPayment);
    // Loan-to-cost (construction lenders lend against total project cost)
    const ltv = projectCost > 0 ? (loanAmount / projectCost) * 100 : 0;

    // Filter eligible programs
    const eligiblePrograms = builderPrograms.filter(
        program => ltv <= program.maxLTV && loanAmount <= program.maxLoanAmount
    );

    // Calculate costs for each program
    const calculateProgramCosts = (program: BuilderProgram) => {
        const rate = rateFor(program);
        const avgBalance = loanAmount / 2; // Progressive draw average
        const totalInterest = avgBalance * (rate / 100) * (constructionMonths / 12);
        const monthlyInterest = constructionMonths > 0 ? totalInterest / constructionMonths : 0;
        return { rate, totalInterest, monthlyInterest };
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen">
                {/* Breadcrumb */}
                <section className="py-6 px-4 bg-gray-800/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-400 hover:text-gold-300 transition-colors">Home</Link>
                            <span className="text-gray-600">›</span>
                            <Link href="/construction" className="text-gray-400 hover:text-gold-300 transition-colors">Construction</Link>
                            <span className="text-gray-600">›</span>
                            <span className="text-gold-300">Builder Program Comparison</span>
                        </div>
                    </div>
                </section>

                {/* Hero */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 rounded-full mb-6">
                                <Building className="w-5 h-5 text-blue-400" />
                                <span className="text-blue-400 font-semibold">Builder Program Comparison</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Find Your Builder Program
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Compare construction financing programs from multiple lenders based on your project requirements.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Inputs */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold mb-8">Your Project Details</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Total Project Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <CalculatorNumberInput aria-label="Total Project Cost"
                                            type="number"
                                            value={projectCost}
                                            onChange={(e) => setProjectCost(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 transition-colors"
                                            inputMode="decimal"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Down Payment</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <CalculatorNumberInput aria-label="Down Payment"
                                            type="number"
                                            value={downPayment}
                                            onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 transition-colors"
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{downPaymentPercent.toFixed(1)}% of project</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Construction Period (months)</label>
                                    <CalculatorNumberInput aria-label="Construction Period (months)"
                                        type="number"
                                        value={constructionMonths}
                                        onChange={(e) => setConstructionMonths(Math.max(3, Math.min(24, Number(e.target.value))))}
                                        className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 transition-colors"
                                        min="3"
                                        max="24"
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-gray-400">Loan Amount</div>
                                    <div className="text-2xl font-bold text-gold-300">${loanAmount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-gray-400">Loan-to-Cost</div>
                                    <div className={`text-2xl font-bold ${ltv <= 75 ? 'text-green-400' : 'text-orange-400'}`}>
                                        {ltv.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-gray-400">Programs Available</div>
                                    <div className="text-2xl font-bold text-blue-400">
                                        {eligiblePrograms.length} of {builderPrograms.length}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Program Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {builderPrograms.map((program, index) => {
                                const isEligible = ltv <= program.maxLTV && loanAmount <= program.maxLoanAmount;
                                const costs = calculateProgramCosts(program);
                                const isSelected = selectedProgram === index;

                                return (
                                    <motion.div
                                        key={index}
                                        className={`rounded-2xl p-6 border cursor-pointer transition-all ${isSelected
                                                ? 'bg-gold-500/20 border-gold-500/50 ring-2 ring-gold-500/30'
                                                : isEligible
                                                    ? 'bg-white/10 border-white/20 hover:border-white/40'
                                                    : 'bg-gray-800/50 border-gray-700/50 opacity-60'
                                            }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        onClick={() => isEligible && setSelectedProgram(isSelected ? null : index)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{program.name}</h3>
                                                <p className="text-sm text-gray-400">{program.lender}</p>
                                            </div>
                                            {isEligible ? (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <AlertTriangle className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-gray-400">Max Loan-to-Cost</div>
                                                <div className="font-semibold">{program.maxLTV}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Interest Rate (est.)</div>
                                                <div className="font-semibold">{costs.rate.toFixed(2)}%</div>
                                                <div className="text-[11px] text-gray-400">Prime + {program.primeSpread.toFixed(2)}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Max Loan</div>
                                                <div className="font-semibold">${(program.maxLoanAmount / 1000000).toFixed(1)}M</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Est. Interest Cost</div>
                                                <div className="font-semibold text-red-300">${costs.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                            </div>
                                        </div>

                                        {isEligible && (
                                            <>
                                                <div className="mb-3">
                                                    <div className="text-xs text-gray-400 mb-1">Features</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {program.features.map((feature, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-400 mb-1">Requirements</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {program.requirements.map((req, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                                                {req}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {!isEligible && (
                                            <div className="text-sm text-gray-400">
                                                {ltv > program.maxLTV && `Loan-to-cost too high (max ${program.maxLTV}%)`}
                                                {loanAmount > program.maxLoanAmount && ` • Loan exceeds maximum`}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <p className="mt-8 text-xs text-gray-400 text-center max-w-3xl mx-auto">
                            Illustrative program profiles only — lender names, spreads and limits are examples, not current offers.
                            Rates are shown as prime + an illustrative spread, using {primeIsLive ? `today's prime of ${prime.toFixed(2)}%${ratesAsOf(liveRates) ? ` (as of ${ratesAsOf(liveRates)})` : ""}` : ratesLoading ? `a ${prime.toFixed(2)}% prime (loading today's rate)` : `an example prime of ${prime.toFixed(2)}% (live rates unavailable)`}.
                            Interest assumes a 50% average advance. New homes built for sale require third-party home warranty
                            coverage and builder licensing (BC Housing, Tarion in Ontario, Alberta New Home Buyer Protection).
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                            >
                                Get Pre-Approved
                            </Link>
                            <Link
                                href="/construction"
                                className="bg-white/10 border border-white/20 font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Back to Construction
                            </Link>
                        </div>
                    </div>
                </section>

                <ComplianceBanner feature="CALC_CONSTRUCTION" />
            </main>
        </>
    );
}
