"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Building, DollarSign, TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Calculator } from "lucide-react";
import Link from "next/link";
import { refinanceBreakEven } from "./refinanceMath";
import CalculatorPdfButton from "@/components/calculator-report/CalculatorPdfButton";
import { money, pct } from "@/components/calculator-report/reportFormat";

export default function RefinanceCalculator() {
    // Current Mortgage
    const [currentBalance, setCurrentBalance] = useState(400000);
    const [currentRate, setCurrentRate] = useState(5.75);
    const [remainingTerm, setRemainingTerm] = useState(36); // months left in the current TERM (drives penalty)
    const [remainingAmortization, setRemainingAmortization] = useState(22); // years left to pay off the loan

    // New Mortgage — example rate (no public commercial benchmark in the live feed; pricing is deal-specific)
    const [newRate, setNewRate] = useState(4.79);
    const [newAmortization, setNewAmortization] = useState(25);

    // Calculator Type
    const [penaltyType, setPenaltyType] = useState<'3month' | 'ird' | 'both'>('both');

    // Refinance Costs
    const [legalFees, setLegalFees] = useState(1500);
    const [appraisalFee, setAppraisalFee] = useState(500);
    const [dischargeFee, setDischargeFee] = useState(350);

    // Penalty (3-month interest / IRD approximation), costs, payments (semi-annual compounding) and
    // break-even — shared helper, same rules as the AI refinance break-even tool.
    const {
        threeMonthPenalty,
        irdPenalty,
        penalty: selectedPenalty,
        totalCosts,
        currentMonthlyPayment,
        newMonthlyPayment,
        monthlySavings,
        breakEvenMonths,
        fiveYearSavings,
        isWorthRefinancing,
    } = refinanceBreakEven({
        currentBalance,
        currentRate,
        remainingTermMonths: remainingTerm,
        remainingAmortizationYears: remainingAmortization,
        newRate,
        newAmortizationYears: newAmortization,
        penaltyType,
        legalFees,
        appraisalFee,
        dischargeFee,
    });

    return (
        <>
            <Navigation />
            <main className="min-h-screen">
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
                                Calculate your penalty, payment reduction, and time to break even on a commercial refinance.
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
                                            <CalculatorNumberInput aria-label="Outstanding Balance"
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
                                        <CalculatorNumberInput aria-label="Current Interest Rate (%)" max={100}
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
                                        <CalculatorNumberInput aria-label="Remaining Term (months)" max={120}
                                            type="number"
                                            value={remainingTerm}
                                            onChange={(e) => setRemainingTerm(Math.max(1, Number(e.target.value)))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Remaining Amortization (years)</label>
                                        <CalculatorNumberInput aria-label="Remaining Amortization (years)" max={50} min={1}
                                            type="number"
                                            value={remainingAmortization}
                                            onChange={(e) => setRemainingAmortization(Math.max(1, Math.min(40, Number(e.target.value))))}
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
                                        <CalculatorNumberInput aria-label="New Interest Rate (%)" max={100}
                                            type="number"
                                            value={newRate}
                                            onChange={(e) => setNewRate(Math.max(0, Number(e.target.value)))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                            step="0.01"
                                            inputMode="decimal"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Example rate — commercial pricing is quoted per deal. Enter the rate you&apos;ve been offered.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Amortization (years)</label>
                                        <select aria-label="Amortization (years)"
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
                                    <div className="flex flex-wrap gap-2">
                                        {(['3month', 'ird', 'both'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setPenaltyType(type)}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${penaltyType === type
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                {type === '3month' ? '3-Month' : type === 'ird' ? 'IRD' : 'Higher of Both'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Refinance fees (previously fixed, no inputs) */}
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {([
                                        ['Legal Fees', legalFees, setLegalFees],
                                        ['Appraisal', appraisalFee, setAppraisalFee],
                                        ['Discharge Fee', dischargeFee, setDischargeFee],
                                    ] as const).map(([label, value, setter]) => (
                                        <div key={label}>
                                            <label className="block text-sm text-gray-400 mb-1">{label}</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                                <CalculatorNumberInput aria-label={label}
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => setter(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-7 pr-3 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                                            <div className="text-sm text-gray-400">Monthly Payment Reduction</div>
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

                        <p className="mt-8 text-xs text-gray-400 text-center max-w-3xl mx-auto">
                            Estimates only. Payments use Canadian semi-annual compounding. Monthly savings compare your current payment
                            (remaining amortization) with the new payment; choosing a longer new amortization lowers the payment partly by
                            extending the payoff period. The IRD shown uses the new rate as the comparison rate — get a written penalty quote
                            from your lender. Legal, appraisal and discharge fees are typical estimates.
                        </p>

                        <CalculatorPdfButton
                            source="calculator-pdf-commercial-refinance"
                            title="Your Commercial Refinance Analysis"
                            subtitle="Get a personalized PDF with your penalty, savings and break-even analysis"
                            calculatorName="Commercial Refinance Calculator"
                            mortgageType="Commercial Refinance"
                            amount={currentBalance}
                            getSections={() => [
                                {
                                    title: "Your Inputs",
                                    rows: [
                                        { label: "Outstanding Balance", value: money(currentBalance) },
                                        { label: "Current Interest Rate", value: pct(currentRate) },
                                        { label: "Remaining Term", value: `${remainingTerm} months` },
                                        { label: "Remaining Amortization", value: `${remainingAmortization} years` },
                                        { label: "New Interest Rate", value: pct(newRate) },
                                        { label: "New Amortization", value: `${newAmortization} years` },
                                        { label: "Penalty Method", value: penaltyType === '3month' ? "3 months' interest" : penaltyType === 'ird' ? "IRD (approximation)" : "Higher of 3-month / IRD" },
                                        { label: "Legal + Appraisal + Discharge Fees", value: money(legalFees + appraisalFee + dischargeFee) },
                                    ],
                                },
                                {
                                    title: "Your Results",
                                    rows: [
                                        { label: "3 Months' Interest", value: money(threeMonthPenalty) },
                                        { label: "IRD (approximation)", value: money(irdPenalty) },
                                        { label: "Penalty Used", value: money(selectedPenalty) },
                                        { label: "Total Refinance Costs", value: money(totalCosts), highlight: true },
                                        { label: "Current Monthly Payment", value: money(currentMonthlyPayment) },
                                        { label: "New Monthly Payment", value: money(newMonthlyPayment) },
                                        { label: "Monthly Payment Reduction", value: money(monthlySavings), highlight: true },
                                        { label: "Break-Even", value: breakEvenMonths === Infinity ? "Not recovered within five years" : `${breakEvenMonths} months`, highlight: true },
                                        { label: "5-Year Net Savings", value: money(fiveYearSavings) },
                                    ],
                                },
                            ]}
                            educationalContent="A refinance pays off when interest savings recover the penalty and fees before your current term would have ended. Net savings compare interest and cash-paid fees over the same horizon. Rates are held constant for the estimate; extending amortization is not counted as a saving. Payments use Canadian semi-annual compounding. The IRD shown uses the new rate as the comparison rate; lenders use their own comparison rate, so get a written penalty quote. A longer new amortization lowers the payment partly by extending the payoff period. Estimates only; not a commitment to lend."
                        />

                        {/* CTA */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-purple-700 transition-colors"
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
