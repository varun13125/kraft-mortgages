"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Building, Calculator, DollarSign, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CostToCompleteCalculator() {
    // Hard Costs
    const [landCost, setLandCost] = useState(200000);
    const [constructionCost, setConstructionCost] = useState(450000);
    const [landscaping, setLandscaping] = useState(25000);

    // Soft Costs
    const [permits, setPermits] = useState(15000);
    const [architecturalFees, setArchitecturalFees] = useState(35000);
    const [engineeringFees, setEngineeringFees] = useState(12000);
    const [legalFees, setLegalFees] = useState(8000);
    const [inspectionFees, setInspectionFees] = useState(5000);
    const [contingency, setContingency] = useState(10); // percentage

    // Funded/Equity
    const [equityInvested, setEquityInvested] = useState(150000);
    const [loanFunded, setLoanFunded] = useState(200000);

    // Calculations
    const hardCosts = landCost + constructionCost + landscaping;
    const softCosts = permits + architecturalFees + engineeringFees + legalFees + inspectionFees;
    const subtotal = hardCosts + softCosts;
    const contingencyAmount = subtotal * (contingency / 100);
    const totalProjectCost = subtotal + contingencyAmount;

    const totalFunded = equityInvested + loanFunded;
    const costToComplete = totalProjectCost - totalFunded;
    const percentComplete = (totalFunded / totalProjectCost) * 100;

    const isFullyFunded = costToComplete <= 0;

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
                            <span className="text-gold-400">Cost to Complete Calculator</span>
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
                                <span className="text-blue-400 font-semibold">Cost to Complete Calculator</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Project Funding Gap Analysis
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Calculate your remaining funding needs: (Hard Costs + Soft Costs + Contingency) - (Equity + Loan Funded)
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Hard Costs */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Building className="w-5 h-5 text-blue-400" />
                                    Hard Costs
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Land Cost</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={landCost}
                                                onChange={(e) => setLandCost(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Construction Cost</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={constructionCost}
                                                onChange={(e) => setConstructionCost(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Landscaping</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={landscaping}
                                                onChange={(e) => setLandscaping(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal:</span>
                                            <span className="font-bold text-blue-400">${hardCosts.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Soft Costs */}
                            <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-purple-400" />
                                    Soft Costs
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Permits & Fees</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={permits}
                                                onChange={(e) => setPermits(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Architectural Fees</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={architecturalFees}
                                                onChange={(e) => setArchitecturalFees(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Engineering Fees</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={engineeringFees}
                                                onChange={(e) => setEngineeringFees(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Legal Fees</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={legalFees}
                                                onChange={(e) => setLegalFees(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Inspection Fees</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={inspectionFees}
                                                onChange={(e) => setInspectionFees(Math.max(0, Number(e.target.value)))}
                                                className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-purple-400 transition-colors"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal:</span>
                                            <span className="font-bold text-purple-400">${softCosts.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Funding & Results */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                        Funding Sources
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Equity Invested</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                                <input
                                                    type="number"
                                                    value={equityInvested}
                                                    onChange={(e) => setEquityInvested(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Loan Already Funded</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                                <input
                                                    type="number"
                                                    value={loanFunded}
                                                    onChange={(e) => setLoanFunded(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-8 pr-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-green-400 transition-colors"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Contingency (%)</label>
                                            <input
                                                type="number"
                                                value={contingency}
                                                onChange={(e) => setContingency(Math.max(0, Math.min(25, Number(e.target.value))))}
                                                className="w-full px-4 py-3 min-h-[48px] bg-white/5 border border-white/20 rounded-lg focus:border-gold-400 transition-colors"
                                                min="0"
                                                max="25"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Result Card */}
                                <div className={`rounded-2xl p-6 border ${isFullyFunded ? 'bg-green-500/20 border-green-500/30' : 'bg-orange-500/20 border-orange-500/30'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {isFullyFunded ? (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <AlertTriangle className="w-6 h-6 text-orange-400" />
                                        )}
                                        <h4 className="font-semibold">{isFullyFunded ? 'Fully Funded!' : 'Cost to Complete'}</h4>
                                    </div>
                                    <div className={`text-4xl font-bold mb-2 ${isFullyFunded ? 'text-green-400' : 'text-orange-400'}`}>
                                        ${Math.abs(costToComplete).toLocaleString()}
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        {isFullyFunded ? 'Project is fully funded with surplus' : 'Additional funding required'}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Project Funded</span>
                                            <span className="font-semibold">{Math.min(100, percentComplete).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${isFullyFunded ? 'bg-green-400' : 'bg-orange-400'}`}
                                                style={{ width: `${Math.min(100, percentComplete)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Summary Table */}
                        <motion.div
                            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Project Budget Summary</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Hard Costs</span>
                                        <span className="font-semibold">${hardCosts.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Soft Costs</span>
                                        <span className="font-semibold">${softCosts.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Contingency ({contingency}%)</span>
                                        <span className="font-semibold">${contingencyAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 font-bold text-lg">
                                        <span>Total Project Cost</span>
                                        <span className="text-gold-400">${totalProjectCost.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Equity Invested</span>
                                        <span className="font-semibold text-green-400">${equityInvested.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Loan Funded</span>
                                        <span className="font-semibold text-green-400">${loanFunded.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/10">
                                        <span className="text-gray-400">Total Funded</span>
                                        <span className="font-semibold">${totalFunded.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 font-bold text-lg">
                                        <span>Remaining to Fund</span>
                                        <span className={costToComplete > 0 ? 'text-orange-400' : 'text-green-400'}>
                                            ${costToComplete.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <div className="mt-12 flex gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors"
                            >
                                Get Construction Financing
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
