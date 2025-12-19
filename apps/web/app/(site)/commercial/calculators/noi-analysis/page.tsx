"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Building, DollarSign, TrendingUp, AlertTriangle, CheckCircle, PieChart } from "lucide-react";
import Link from "next/link";

export default function NOIAnalysisCalculator() {
    // Income
    const [grossPotentialRent, setGrossPotentialRent] = useState(360000);
    const [otherIncome, setOtherIncome] = useState(12000);
    const [vacancyRate, setVacancyRate] = useState(5);

    // Operating Expenses
    const [propertyManagement, setPropertyManagement] = useState(28800);
    const [utilities, setUtilities] = useState(18000);
    const [insurance, setInsurance] = useState(15000);
    const [propertyTaxes, setPropertyTaxes] = useState(36000);
    const [maintenance, setMaintenance] = useState(18000);
    const [reserves, setReserves] = useState(7200);

    // Property Value (for ratios)
    const [propertyValue, setPropertyValue] = useState(3000000);

    // Calculations
    const grossPotentialIncome = grossPotentialRent + otherIncome;
    const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
    const effectiveGrossIncome = grossPotentialIncome - vacancyLoss;

    const totalOperatingExpenses = propertyManagement + utilities + insurance + propertyTaxes + maintenance + reserves;
    const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;

    // Ratios
    const capRate = (netOperatingIncome / propertyValue) * 100;
    const expenseRatio = (totalOperatingExpenses / effectiveGrossIncome) * 100;
    const grossRentMultiplier = propertyValue / grossPotentialRent;

    // Warnings
    const lowCapRate = capRate < 3;
    const highExpenseRatio = expenseRatio > 50;
    const negativeNOI = netOperatingIncome < 0;

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
                            <span className="text-purple-400">NOI Analysis Calculator</span>
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
                                <PieChart className="w-5 h-5 text-purple-400" />
                                <span className="text-purple-400 font-semibold">NOI Analysis Calculator</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                Net Operating Income
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Calculate NOI = Gross Operating Income - Operating Expenses (with vacancy adjustment)
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Income */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    Gross Income
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Annual Gross Rent</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={grossPotentialRent}
                                                onChange={(e) => setGrossPotentialRent(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Other Income (parking, laundry, etc.)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={otherIncome}
                                                onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Vacancy Rate (%)</label>
                                        <input
                                            type="number"
                                            value={vacancyRate}
                                            onChange={(e) => setVacancyRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                                            className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                            min="0"
                                            max="100"
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-white/20 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Gross Potential Income</span>
                                            <span className="font-semibold">${grossPotentialIncome.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Less: Vacancy Loss</span>
                                            <span className="text-red-400">-${vacancyLoss.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span>Effective Gross Income</span>
                                            <span className="text-green-400">${effectiveGrossIncome.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Expenses */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-red-400" />
                                    Operating Expenses
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Property Management</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={propertyManagement}
                                                onChange={(e) => setPropertyManagement(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Utilities</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={utilities}
                                                onChange={(e) => setUtilities(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Insurance</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={insurance}
                                                onChange={(e) => setInsurance(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Property Taxes</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={propertyTaxes}
                                                onChange={(e) => setPropertyTaxes(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Maintenance & Repairs</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={maintenance}
                                                onChange={(e) => setMaintenance(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Reserves</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={reserves}
                                                onChange={(e) => setReserves(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-red-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <div className="flex justify-between font-bold">
                                            <span>Total Expenses</span>
                                            <span className="text-red-400">${totalOperatingExpenses.toLocaleString()}</span>
                                        </div>
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
                                {/* NOI Result */}
                                <div className={`rounded-2xl p-6 border ${negativeNOI ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {negativeNOI ? (
                                            <AlertTriangle className="w-6 h-6 text-red-400" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        )}
                                        <h4 className="font-semibold">Net Operating Income</h4>
                                    </div>
                                    <div className={`text-4xl font-bold mb-2 ${negativeNOI ? 'text-red-400' : 'text-green-400'}`}>
                                        ${netOperatingIncome.toLocaleString()}
                                    </div>
                                    <p className="text-sm text-gray-300">Annual NOI before debt service</p>
                                </div>

                                {/* Property Value for Ratios */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <label className="block text-sm text-gray-400 mb-2">Property Value (for ratios)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={propertyValue}
                                            onChange={(e) => setPropertyValue(Math.max(1, Number(e.target.value)))}
                                            className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                            inputMode="decimal"
                                        />
                                    </div>
                                </div>

                                {/* Ratios */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="font-semibold mb-4">Key Ratios</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Cap Rate</span>
                                                <span className={`font-bold ${lowCapRate ? 'text-yellow-400' : 'text-purple-400'}`}>
                                                    {capRate.toFixed(2)}%
                                                </span>
                                            </div>
                                            {lowCapRate && (
                                                <div className="text-xs text-yellow-400 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Below 3% market average for this region
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Expense Ratio</span>
                                                <span className={`font-bold ${highExpenseRatio ? 'text-yellow-400' : 'text-purple-400'}`}>
                                                    {expenseRatio.toFixed(1)}%
                                                </span>
                                            </div>
                                            {highExpenseRatio && (
                                                <div className="text-xs text-yellow-400 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    High expense ratio (over 50%)
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Gross Rent Multiplier</span>
                                            <span className="font-bold text-purple-400">{grossRentMultiplier.toFixed(2)}x</span>
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
                                Get Commercial Financing
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
