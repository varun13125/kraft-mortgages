"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Building, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Target } from "lucide-react";
import Link from "next/link";
import CalculatorPdfButton from "@/components/calculator-report/CalculatorPdfButton";
import { money, pct } from "@/components/calculator-report/reportFormat";

export default function CapRateCalculator() {
    const [netOperatingIncome, setNetOperatingIncome] = useState(150000);
    const [marketValue, setMarketValue] = useState(2500000);
    const [targetCapRate, setTargetCapRate] = useState(6.0);

    // Calculate Cap Rate
    const capRate = marketValue > 0 ? (netOperatingIncome / marketValue) * 100 : 0;

    // Calculate implied value based on target cap rate
    const impliedValue = targetCapRate > 0 ? netOperatingIncome / (targetCapRate / 100) : 0;

    // Calculate required NOI for target cap rate at current value
    const requiredNOI = marketValue * (targetCapRate / 100);

    // Warnings
    const isBelowMarket = capRate < 3;
    const isAboveMarket = capRate > 10;
    const isInRange = capRate >= 4 && capRate <= 8;
    // 3-4% and 8-10% are plausible but outside the typical band: show them neutrally (was a green box
    // with a warning icon)
    const isBorderline = !isBelowMarket && !isAboveMarket && !isInRange;
    const valueGap = impliedValue - marketValue;
    const valueGapLabel = Math.abs(valueGap) < 1 ? " (at target)" : valueGap > 0 ? " undervalued" : " overvalued";

    // Regional benchmarks
    const benchmarks = [
        { region: "Vancouver Metro", range: "3.5% - 5.0%" },
        { region: "Fraser Valley", range: "4.0% - 5.5%" },
        { region: "Calgary", range: "5.0% - 7.0%" },
        { region: "Edmonton", range: "5.5% - 7.5%" },
        { region: "BC Interior", range: "5.0% - 7.0%" },
    ];

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
                            <span className="text-purple-400">Cap Rate Calculator</span>
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
                                <Target className="w-5 h-5 text-purple-400" />
                                <span className="text-purple-400 font-semibold">Cap Rate Calculator</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                Capitalization Rate
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Cap Rate = (Net Operating Income ÷ Current Market Value) × 100
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <Building className="w-6 h-6 text-purple-400" />
                                    Property Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Net Operating Income (Annual)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <CalculatorNumberInput aria-label="Net Operating Income (Annual)" min={-1_000_000_000}
                                                type="number"
                                                value={netOperatingIncome}
                                                onChange={(e) => setNetOperatingIncome(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Current Market Value</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <CalculatorNumberInput aria-label="Current Market Value" min={1}
                                                type="number"
                                                value={marketValue}
                                                onChange={(e) => setMarketValue(Math.max(1, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Target Cap Rate (%)</label>
                                        <CalculatorNumberInput aria-label="Target Cap Rate (%)"
                                            type="number"
                                            value={targetCapRate}
                                            onChange={(e) => setTargetCapRate(Math.max(0.1, Math.min(20, Number(e.target.value))))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-xl focus:border-purple-400 transition-colors"
                                            min="0.1"
                                            max="20"
                                            step="0.1"
                                            inputMode="decimal"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Results */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Cap Rate Result */}
                                <div className={`rounded-2xl p-6 border ${isBelowMarket ? 'bg-yellow-500/20 border-yellow-500/30' :
                                        isAboveMarket ? 'bg-orange-500/20 border-orange-500/30' :
                                            isBorderline ? 'bg-white/10 border-white/20' :
                                            'bg-green-500/20 border-green-500/30'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {isInRange ? (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        ) : isBorderline ? (
                                            <Target className="w-6 h-6 text-purple-300" />
                                        ) : (
                                            <AlertTriangle className={`w-6 h-6 ${isBelowMarket ? 'text-yellow-400' : 'text-orange-400'}`} />
                                        )}
                                        <h4 className="font-semibold">Current Cap Rate</h4>
                                    </div>
                                    <div className={`text-5xl font-bold mb-2 ${isBelowMarket ? 'text-yellow-400' :
                                            isAboveMarket ? 'text-orange-400' :
                                                isBorderline ? 'text-purple-300' :
                                                'text-green-400'
                                        }`}>
                                        {capRate.toFixed(2)}%
                                    </div>

                                    {isBelowMarket && (
                                        <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                            <p className="text-yellow-300 text-sm flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span><strong>Warning:</strong> This cap rate is below 3%, which is below market average for most regions. Consider verifying the NOI or property value.</span>
                                            </p>
                                        </div>
                                    )}

                                    {isAboveMarket && (
                                        <div className="mt-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                            <p className="text-orange-300 text-sm flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span><strong>Note:</strong> Cap rate above 10% may indicate higher risk or value-add opportunity.</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Implied Values */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="font-semibold mb-4">Analysis at {targetCapRate}% Target</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-gray-400">Implied Property Value</span>
                                            <span className="font-bold text-purple-400">${Math.round(impliedValue).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-gray-400">Required NOI for Target</span>
                                            <span className="font-bold text-purple-400">${Math.round(requiredNOI).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-400">Value Gap</span>
                                            <span className={`font-bold ${Math.abs(valueGap) < 1 ? 'text-gray-300' : valueGap > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${Math.round(Math.abs(valueGap)).toLocaleString()}
                                                {valueGapLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Regional Benchmarks */}
                                <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                                    <h4 className="font-semibold mb-4 text-purple-300">Regional Cap Rate Benchmarks</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {benchmarks.map((b, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-400">{b.region}</span>
                                                <span className="font-semibold">{b.range}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">*Benchmarks are estimates and vary by property type and location</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA */}
                        <p className="mt-8 text-xs text-gray-400 text-center max-w-3xl mx-auto">
                            Estimates only. Use stabilized NOI (gross rent less vacancy and operating expenses; excludes debt service,
                            depreciation and capital expenditures). Cap rates vary by asset class, location and lease profile.
                        </p>
                        <CalculatorPdfButton
                            source="calculator-pdf-commercial-cap-rate"
                            title="Your Cap Rate Analysis"
                            subtitle="Get a personalized PDF with your cap rate and valuation analysis"
                            calculatorName="Commercial Cap Rate Calculator"
                            mortgageType="Commercial"
                            amount={marketValue}
                            getSections={() => [
                                {
                                    title: "Your Inputs",
                                    rows: [
                                        { label: "Net Operating Income (annual)", value: money(netOperatingIncome) },
                                        { label: "Current Market Value", value: money(marketValue) },
                                        { label: "Target Cap Rate", value: pct(targetCapRate) },
                                    ],
                                },
                                {
                                    title: "Your Results",
                                    rows: [
                                        { label: "Current Cap Rate", value: pct(capRate), highlight: true },
                                        { label: `Implied Value at ${targetCapRate}% Cap Rate`, value: money(impliedValue), highlight: true },
                                        { label: "Required NOI for Target Cap Rate", value: money(requiredNOI) },
                                        { label: "Value Gap vs. Market Value", value: `${money(Math.abs(valueGap))}${valueGapLabel}` },
                                    ],
                                },
                            ]}
                            educationalContent="Cap rate = stabilized NOI / value. Use stabilized NOI: gross rent less vacancy and operating expenses, excluding debt service, depreciation and capital expenditures. A lower cap rate means a higher price per dollar of income. Cap rates vary by asset class, location, lease profile and interest rates; regional ranges on the calculator page are estimates. Estimates only; not an appraisal."
                        />
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-purple-700 transition-colors"
                            >
                                Get Commercial Financing
                            </Link>
                            <Link
                                href="/commercial/calculators/noi-analysis"
                                className="bg-white/10 border border-white/20 font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Calculate NOI
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
