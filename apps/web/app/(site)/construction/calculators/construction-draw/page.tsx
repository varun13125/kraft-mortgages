"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Building, Calculator, DollarSign, Percent, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";

// Construction draw calculation logic
interface DrawSchedule {
  stage: string;
  percentage: number;
  amount: number;
  description: string;
  completed: boolean;
}

function calculateConstructionDraw({
  totalProjectCost,
  landValue,
  downPayment,
  interestRate,
  constructionPeriod, // in months
  customSchedule = false
}: {
  totalProjectCost: number;
  landValue: number;
  downPayment: number;
  interestRate: number;
  constructionPeriod: number;
  customSchedule?: boolean;
}) {
  const totalCost = totalProjectCost + landValue;
  const downPaymentAmount = totalCost * downPayment;
  const loanAmount = totalCost - downPaymentAmount;
  
  // Standard construction draw schedule
  const standardSchedule: Omit<DrawSchedule, 'amount' | 'completed'>[] = [
    { stage: "Land Purchase", percentage: 0, description: "Initial land acquisition" },
    { stage: "Foundation", percentage: 15, description: "Foundation and basement complete" },
    { stage: "Framing", percentage: 25, description: "Framing and roof structure complete" },
    { stage: "Lock-up", percentage: 40, description: "Exterior complete, windows/doors installed" },
    { stage: "Mechanical", percentage: 60, description: "Plumbing, electrical, HVAC rough-in" },
    { stage: "Drywall", percentage: 75, description: "Insulation and drywall complete" },
    { stage: "Flooring", percentage: 85, description: "Flooring, cabinets, fixtures installed" },
    { stage: "Final", percentage: 95, description: "Final inspections and occupancy permit" },
    { stage: "Completion", percentage: 100, description: "Project complete, convert to permanent" }
  ];
  
  // Calculate draw amounts
  const drawSchedule: DrawSchedule[] = standardSchedule.map((draw, index) => ({
    ...draw,
    amount: (draw.percentage / 100) * loanAmount,
    completed: false
  }));
  
  // Add land purchase amount to first draw if applicable
  if (landValue > 0) {
    drawSchedule[0].amount = Math.min(landValue, loanAmount);
  }
  
  // Calculate interest costs
  const monthlyRate = interestRate / 100 / 12;
  let cumulativeInterest = 0;
  let outstandingBalance = 0;
  
  // Simple interest calculation for construction loan
  // Assumes draws happen evenly throughout construction period
  const avgOutstandingBalance = loanAmount / 2;
  const totalInterestCost = avgOutstandingBalance * (interestRate / 100) * (constructionPeriod / 12);
  
  // Calculate fees
  const appraisalFee = 750;
  const legalFees = 1200;
  const inspectionFees = constructionPeriod * 150; // Per month
  const lenderFees = loanAmount * 0.005; // 0.5% of loan amount
  const totalFees = appraisalFee + legalFees + inspectionFees + lenderFees;
  
  // Calculate LTV ratios
  const loanToValue = (loanAmount / totalCost) * 100;
  const loanToCost = (loanAmount / totalProjectCost) * 100;
  
  return {
    totalCost,
    loanAmount,
    downPaymentAmount,
    drawSchedule,
    totalInterestCost,
    totalFees,
    monthlyInterestEstimate: totalInterestCost / constructionPeriod,
    loanToValue,
    loanToCost,
    qualifies: loanToValue <= 80 && downPayment >= 0.20,
    constructionPeriod
  };
}

export default function ConstructionDrawCalculator() {
  const [totalProjectCost, setTotalProjectCost] = useState(450000);
  const [landValue, setLandValue] = useState(150000);
  const [downPayment, setDownPayment] = useState(0.25); // 25%
  const [interestRate, setInterestRate] = useState(7.25);
  const [constructionPeriod, setConstructionPeriod] = useState(12);
  const [selectedStage, setSelectedStage] = useState(0);

  const results = calculateConstructionDraw({
    totalProjectCost,
    landValue,
    downPayment,
    interestRate,
    constructionPeriod
  });

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
              <span className="text-gold-400">Construction Draw Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
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
                <span className="text-blue-400 font-semibold">Construction Draw Calculator</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                Construction-to-Permanent Financing
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Calculate your construction loan draws, interest costs, and timeline for your building project with our comprehensive calculator.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Construction Project Details
                  </h2>

                  <div className="space-y-6">
                    {/* Total Project Cost */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4 text-gold-400" />
                        Construction Cost (excluding land)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={totalProjectCost}
                          onChange={(e) => setTotalProjectCost(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="100000"
                          max="2000000"
                          step="10000"
                        />
                      </div>
                    </div>

                    {/* Land Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        Land Value
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max="1000000"
                          step="5000"
                        />
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-gold-400" />
                        Down Payment ({(downPayment * 100).toFixed(0)}%)
                      </label>
                      <input
                        type="range"
                        min="0.20"
                        max="0.50"
                        step="0.01"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>20%</span>
                        <span className="font-semibold text-gold-400">{(downPayment * 100).toFixed(0)}%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-gold-400" />
                        Construction Interest Rate
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full pr-8 pl-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="5.0"
                          max="12.0"
                          step="0.25"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                      </div>
                    </div>

                    {/* Construction Period */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold-400" />
                        Construction Period ({constructionPeriod} months)
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="24"
                        value={constructionPeriod}
                        onChange={(e) => setConstructionPeriod(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>6 months</span>
                        <span className="font-semibold text-gold-400">{constructionPeriod} months</span>
                        <span>24 months</span>
                      </div>
                    </div>
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
                {/* Loan Summary */}
                <div className={`backdrop-blur-sm rounded-2xl p-8 border ${results.qualifies ? 'bg-green-500/20 border-green-500/30' : 'bg-yellow-500/20 border-yellow-500/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {results.qualifies ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    )}
                    <h3 className="text-xl font-bold">Construction Loan</h3>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${results.qualifies ? 'text-green-400' : 'text-yellow-400'}`}>
                    ${results.loanAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-300">
                    Total loan amount (LTV: {results.loanToValue.toFixed(1)}%)
                  </p>
                </div>

                {/* Project Summary */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Project Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300 block">Total Project Cost</span>
                      <span className="font-semibold text-lg">${results.totalCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Down Payment</span>
                      <span className="font-semibold text-lg">${results.downPaymentAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Construction Period</span>
                      <span className="font-semibold text-lg">{constructionPeriod} months</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Interest Rate</span>
                      <span className="font-semibold text-lg">{interestRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Cost Breakdown</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Interest Cost</span>
                      <span className="font-semibold text-red-300">${results.totalInterestCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monthly Interest (avg)</span>
                      <span className="font-semibold">${results.monthlyInterestEstimate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fees & Closing Costs</span>
                      <span className="font-semibold">${results.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3 flex justify-between">
                      <span className="text-gray-300">Total Project Cost</span>
                      <span className="font-semibold text-gold-400">
                        ${(results.totalCost + results.totalInterestCost + results.totalFees).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="flex gap-4">
                  <Link 
                    href="/contact"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center"
                  >
                    Get Pre-Approved
                  </Link>
                  <Link 
                    href="/construction"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Draw Schedule */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Construction Draw Schedule</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-2">Stage</th>
                      <th className="text-right py-3 px-2">Progress</th>
                      <th className="text-right py-3 px-2">Draw Amount</th>
                      <th className="text-left py-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.drawSchedule.map((draw, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              index === 0 ? 'bg-gold-500 text-black' : 'bg-white/20 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{draw.stage}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right font-semibold">
                          {draw.percentage}%
                        </td>
                        <td className="py-4 px-2 text-right font-semibold text-gold-400">
                          ${draw.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-300">
                          {draw.description}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Construction Loan Requirements</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Minimum 20-25% down payment required for construction loans</p>
                    <p>• Detailed construction plans and permits must be approved</p>
                    <p>• Licensed contractor with proper insurance required</p>
                    <p>• Interest-only payments during construction phase</p>
                    <p>• Automatic conversion to permanent mortgage upon completion</p>
                    <p>• Regular inspections required before each draw release</p>
                    <p>• Construction must be completed within agreed timeline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ComplianceBanner feature="CALC_CONSTRUCTION" />
      </main>
    </>
  );
}