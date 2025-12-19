"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Building, DollarSign, TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Calculator } from "lucide-react";
import Link from "next/link";

export default function RefinanceCalculator() {
    // Current Mortgage
    const [currentBalance, setCurrentBalance] = useState(400000);
    const [currentRate, setCurrentRate] = useState(5.75);
    const [remainingTerm, setRemainingTerm] = useState(36); // months
    const [originalTerm, setOriginalTerm] = useState(60); // months (for IRD)

    // New Mortgage
    const [newRate, setNewRate] = useState(4.79);
    const [newAmortization, setNewAmortization] = useState(25);

    // Calculator Type
    const [penaltyType, setPenaltyType] = useState<'3month' | 'ird' | 'both'>('both');

    // Refinance Costs
    const [legalFees, setLegalFees] = useState(1500);
    const [appraisalFee, setAppraisalFee] = useState(500);
    const [dischargeFee, setDischargeFee] = useState(350);

    // Calculate 3-month interest penalty
    const threeMonthPenalty = currentBalance * (currentRate / 100 / 12) * 3;

    // Calculate IRD penalty
    const rateDifferential = Math.max(0, currentRate - newRate);
    const irdPenalty = currentBalance * (rateDifferential / 100 / 12) * remainingTerm;

    // Use higher penalty (typical lender approach)
    const penalty = Math.max(threeMonthPenalty, irdPenalty);
    const selectedPenalty = penaltyType === '3month' ? threeMonthPenalty : penaltyType === 'ird' ? irdPenalty : penalty;

    // Total refinance costs
    const totalCosts = selectedPenalty + legalFees + appraisalFee + dischargeFee;

    // Monthly payment calculations
    const currentMonthlyPayment = (() => {
        const monthlyRate = currentRate / 100 / 12;
        const months = remainingTerm;
        return (currentBalance * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    })();

    const newMonthlyPayment = (() => {
        const monthlyRate = newRate / 100 / 12;
        const months = newAmortization * 12;
        return (currentBalance * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    })();

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : Infinity;
    const fiveYearSavings = (monthlySavings * 60) - totalCosts;

    const isWorthRefinancing = breakEvenMonths < remainingTerm && monthlySavings > 0;

    return (
        <>
            <Navigation />
            <main className="min-h-screen mt-16">
                {/* Breadcrumb */}
                <section className="py-6 px-4 bg-gray-800/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">Home</Link>
                            <span className="text-gray-600">›</span>
                            <Link href="/commercial" className="text-gray-400 hover:text-purple-400 transition-colors">Commercial</Link>
                            <span className="text-gray-600">›</span>
                            <span className="text-purple-400">Refinance Calculator</span>
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
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/20 rounded-full mb-6">
                                <RefreshCw className="w-5 h-5 text-purple-400" />
                                <span className="text-purple-400 font-semibold">Refinance Calculator</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                Break-Even Analysis
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Calculate your penalty, monthly savings, and time to break even on a commercial refinance.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Current Mortgage */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Building className="w-5 h-5 text-red-400" />
                                    Current Mortgage
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Outstanding Balance</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={currentBalance}
                                                onChange={(e) => setCurrentBalance(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Current Interest Rate (%)</label>
                                        <input
                                            type="number"
                                            value={currentRate}
                                            onChange={(e) => setCurrentRate(Math.max(0, Number(e.target.value)))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                            step="0.01"
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Remaining Term (months)</label>
                                        <input
                                            type="number"
                                            value={remainingTerm}
                                            onChange={(e) => setRemainingTerm(Math.max(1, Number(e.target.value)))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-6 mt-8 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-green-400" />
                                    New Mortgage
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">New Interest Rate (%)</label>
                                        <input
                                            type="number"
                                            value={newRate}
                                            onChange={(e) => setNewRate(Math.max(0, Number(e.target.value)))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                            step="0.01"
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Amortization (years)</label>
                                        <select
                                            value={newAmortization}
                                            onChange={(e) => setNewAmortization(Number(e.target.value))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                        >
                                            <option value={20}>20 Years</option>
                                            <option value={25}>25 Years</option>
                                            <option value={30}>30 Years</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Penalty Type Toggle */}
                                <div className="mt-6">
                                    <label className="block text-sm text-gray-400 mb-2">Penalty Calculation</label>
                                    <div className="flex gap-2">
                                        {(['3month', 'ird', 'both'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setPenaltyType(type)}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${penaltyType === type
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                {type === '3month' ? '3-Month' : type === 'ird' ? 'IRD' : 'Higher of Both'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Results */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Penalty Breakdown */}
                                <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                                    <h4 className="font-semibold mb-4 text-red-300 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Penalty Calculation
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-gray-400">3-Month Interest</span>
                                            <span className={`font-semibold ${penaltyType === '3month' || (penaltyType === 'both' && threeMonthPenalty >= irdPenalty) ? 'text-red-400' : ''}`}>
                                                ${threeMonthPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-gray-400">IRD Penalty</span>
                                            <span className={`font-semibold ${penaltyType === 'ird' || (penaltyType === 'both' && irdPenalty > threeMonthPenalty) ? 'text-red-400' : ''}`}>
                                                ${irdPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 font-bold text-lg">
                                            <span>Selected Penalty</span>
                                            <span className="text-red-400">${selectedPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Costs */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="font-semibold mb-4">Refinance Costs</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Penalty</span>
                                            <span>${selectedPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Legal Fees</span>
                                            <span>${legalFees.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Appraisal</span>
                                            <span>${appraisalFee.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Discharge Fee</span>
                                            <span>${dischargeFee.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-t border-white/20 font-bold">
                                            <span>Total Costs</span>
                                            <span className="text-red-400">${totalCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Break-Even Result */}
                                <div className={`rounded-2xl p-6 border ${isWorthRefinancing ? 'bg-green-500/20 border-green-500/30' : 'bg-yellow-500/20 border-yellow-500/30'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {isWorthRefinancing ? (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                        )}
                                        <h4 className="font-semibold">{isWorthRefinancing ? 'Refinancing Makes Sense' : 'Consider Carefully'}</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-sm text-gray-400">Monthly Savings</div>
                                            <div className={`text-2xl font-bold ${monthlySavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Break-Even</div>
                                            <div className="text-2xl font-bold text-purple-400">
                                                {breakEvenMonths === Infinity ? 'N/A' : `${breakEvenMonths} months`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/20">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">5-Year Net Savings</span>
                                            <span className={`font-bold text-xl ${fiveYearSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${fiveYearSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 flex gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-purple-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-purple-400 transition-colors"
                            >
                                Get Refinance Quote
                            </Link>
                            <Link
                                href="/commercial"
                                className="bg-white/10 border border-white/20 font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Back to Commercial
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
