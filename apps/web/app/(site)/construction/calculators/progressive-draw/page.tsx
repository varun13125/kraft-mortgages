"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Building, Calculator, DollarSign, Percent, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { interestOnlyCost } from "@/lib/calc/construction";

export default function ProgressiveDrawCalculator() {
    const [totalLoanAmount, setTotalLoanAmount] = useState(600000);
    const [interestRate, setInterestRate] = useState(7.25);
    const [draws, setDraws] = useState([
        { month: 1, percentage: 15, description: "Foundation Complete" },
        { month: 3, percentage: 25, description: "Framing Complete" },
        { month: 5, percentage: 20, description: "Lock-up Stage" },
        { month: 7, percentage: 20, description: "Mechanical Rough-in" },
        { month: 9, percentage: 15, description: "Interior Finishing" },
        { month: 11, percentage: 5, description: "Final Completion" },
    ]);

    // Calculate interest on progressive draws.
    // Uses the shared interestOnlyCost helper (same as the AI construction tool) so both give
    // identical answers: interest-only on the advanced balance, a draw accrues interest from the
    // month it is advanced through the end of the project (month 12, or the last draw month if later).
    const calculateInterest = () => {
        const monthlyRate = interestRate / 100 / 12;
        let cumulativeDrawn = 0;
        const drawDetails: { month: number; drawnAmount: number; cumulativeBalance: number; monthlyInterest: number; description: string }[] = [];

        draws.forEach((draw) => {
            const drawAmount = (draw.percentage / 100) * totalLoanAmount;
            cumulativeDrawn += drawAmount;
            drawDetails.push({
                month: draw.month,
                drawnAmount: drawAmount,
                cumulativeBalance: cumulativeDrawn,
                monthlyInterest: cumulativeDrawn * monthlyRate,
                description: draw.description
            });
        });

        const { totalInterest, constructionPeriodMonths } = interestOnlyCost({
            draws: drawDetails.map(d => ({ month: d.month, amount: d.drawnAmount })),
            annualRatePct: interestRate,
        });

        return { totalInterest, drawDetails, finalBalance: cumulativeDrawn, constructionPeriodMonths };
    };

    const results = calculateInterest();
    const avgMonthlyInterest = results.constructionPeriodMonths > 0 ? results.totalInterest / results.constructionPeriodMonths : 0;

    // Validation
    const totalPercentage = draws.reduce((sum, d) => sum + d.percentage, 0);
    const isValid = totalPercentage === 100;

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
                            <span className="text-gold-300">Progressive Draw Calculator</span>
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
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <span className="text-blue-400 font-semibold">Progressive Draw Calculator</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Interest on Partial Draws
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Calculate your construction loan interest based on actual drawn amounts—not the total loan limit.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Inputs */}
                            <motion.div
                                className="space-y-8"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <Calculator className="w-6 h-6 text-gold-300" />
                                        Loan Details
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gold-300" />
                                                Total Loan Amount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                                <CalculatorNumberInput aria-label="Total Loan Amount"
                                                    type="number"
                                                    value={totalLoanAmount}
                                                    onChange={(e) => setTotalLoanAmount(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                                                    min="0"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-gold-300" />
                                                Interest Rate (%)
                                            </label>
                                            <CalculatorNumberInput aria-label="Interest Rate (%)"
                                                type="number"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(Math.max(0, Math.min(15, Number(e.target.value))))}
                                                className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                                                min="0"
                                                max="15"
                                                step="0.25"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Validation Warning */}
                                {!isValid && (
                                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        <span className="text-yellow-200">Draw percentages must total 100%. Current: {totalPercentage}%</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Results */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-green-400" />
                                        Interest Summary
                                    </h3>
                                    <div className="text-4xl font-bold text-green-400 mb-2">
                                        ${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        Total construction interest ({results.constructionPeriodMonths}-month project, interest-only on advanced funds)
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-white/20">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Avg Monthly Interest:</span>
                                            <span className="font-semibold">${avgMonthlyInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                                    <p className="text-blue-200 text-sm flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span><strong>Key Insight:</strong> You only pay interest on the amount actually drawn, not the full loan. This calculator shows your true carrying costs.</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Draw Schedule Table */}
                        <motion.div
                            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Draw Schedule & Interest Breakdown</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-3 px-2">Month</th>
                                            <th className="text-left py-3 px-2">Stage</th>
                                            <th className="text-right py-3 px-2">Draw %</th>
                                            <th className="text-right py-3 px-2">Draw Amount</th>
                                            <th className="text-right py-3 px-2">Running Balance</th>
                                            <th className="text-right py-3 px-2">Monthly Interest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.drawDetails.map((draw, index) => (
                                            <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                                                <td className="py-4 px-2 font-semibold">{draw.month}</td>
                                                <td className="py-4 px-2">{draw.description}</td>
                                                <td className="py-4 px-2 text-right">{draws[index].percentage}%</td>
                                                <td className="py-4 px-2 text-right text-gold-300">${Math.round(draw.drawnAmount).toLocaleString()}</td>
                                                <td className="py-4 px-2 text-right font-semibold">${Math.round(draw.cumulativeBalance).toLocaleString()}</td>
                                                <td className="py-4 px-2 text-right text-red-300">${draw.monthlyInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        <p className="mt-8 text-xs text-gray-400 text-center max-w-3xl mx-auto">
                            Estimates only. Interest is simple monthly interest on the cumulative advanced balance; each draw accrues interest
                            from its draw month to the end of the project. A statutory 10% lien holdback (BC Builders Lien Act, Ontario
                            Construction Act, Alberta Prompt Payment and Construction Lien Act) is usually retained from each advance, which can shift timing.
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
