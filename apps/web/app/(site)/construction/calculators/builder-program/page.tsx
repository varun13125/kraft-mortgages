"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Building, CheckCircle, AlertTriangle, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

interface BuilderProgram {
    name: string;
    lender: string;
    maxLTV: number;
    minDownPayment: number;
    interestRate: number;
    maxLoanAmount: number;
    features: string[];
    requirements: string[];
}

const builderPrograms: BuilderProgram[] = [
    {
        name: "Prime Builder Program",
        lender: "Major Bank A",
        maxLTV: 75,
        minDownPayment: 25,
        interestRate: 6.75,
        maxLoanAmount: 2000000,
        features: ["Fast approval (5-7 days)", "Flexible draw schedule", "No builder insurance required"],
        requirements: ["2+ years experience", "3+ completed projects", "Strong credit (680+)"]
    },
    {
        name: "Emerging Builder",
        lender: "Credit Union B",
        maxLTV: 65,
        minDownPayment: 35,
        interestRate: 7.25,
        maxLoanAmount: 1000000,
        features: ["New builder friendly", "Project mentorship", "Competitive rates"],
        requirements: ["1+ completed project", "Licensed contractor", "Detailed business plan"]
    },
    {
        name: "Custom Home Builder",
        lender: "Private Lender C",
        maxLTV: 80,
        minDownPayment: 20,
        interestRate: 8.50,
        maxLoanAmount: 3000000,
        features: ["Higher LTV available", "Luxury home specialist", "Fast funding"],
        requirements: ["5+ years experience", "Portfolio of work", "Strong reserves"]
    },
    {
        name: "Spec Home Program",
        lender: "Regional Bank D",
        maxLTV: 70,
        minDownPayment: 30,
        interestRate: 7.00,
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

    const downPaymentPercent = (downPayment / projectCost) * 100;
    const loanAmount = projectCost - downPayment;
    const ltv = (loanAmount / projectCost) * 100;

    // Filter eligible programs
    const eligiblePrograms = builderPrograms.filter(
        program => ltv <= program.maxLTV && loanAmount <= program.maxLoanAmount
    );

    // Calculate costs for each program
    const calculateProgramCosts = (program: BuilderProgram) => {
        const monthlyRate = program.interestRate / 100 / 12;
        const avgBalance = loanAmount / 2; // Progressive draw average
        const totalInterest = avgBalance * (program.interestRate / 100) * (constructionMonths / 12);
        const monthlyInterest = totalInterest / constructionMonths;
        return { totalInterest, monthlyInterest };
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Breadcrumb */}
                <section className="py-6 px-4 bg-gray-800/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
                            <span className="text-gray-600">›</span>
                            <Link href="/construction" className="text-gray-400 hover:text-gold-400 transition-colors">Construction</Link>
                            <span className="text-gray-600">›</span>
                            <span className="text-gold-400">Builder Program Comparison</span>
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
                                        <input
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
                                        <input
                                            type="number"
                                            value={downPayment}
                                            onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 transition-colors"
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{downPaymentPercent.toFixed(1)}% of project</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Construction Period (months)</label>
                                    <input
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
                                    <div className="text-2xl font-bold text-gold-400">${loanAmount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-gray-400">Loan-to-Value</div>
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
                                                <AlertTriangle className="w-6 h-6 text-gray-500" />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-gray-500">Max LTV</div>
                                                <div className="font-semibold">{program.maxLTV}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Interest Rate</div>
                                                <div className="font-semibold">{program.interestRate}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Max Loan</div>
                                                <div className="font-semibold">${(program.maxLoanAmount / 1000000).toFixed(1)}M</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Est. Interest Cost</div>
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
                                            <div className="text-sm text-gray-500">
                                                {ltv > program.maxLTV && `LTV too high (max ${program.maxLTV}%)`}
                                                {loanAmount > program.maxLoanAmount && ` • Loan exceeds maximum`}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="mt-12 flex gap-4 justify-center">
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
