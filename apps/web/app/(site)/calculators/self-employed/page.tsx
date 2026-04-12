"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { normalizedIncome } from "@/lib/calc/selfEmployed";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Briefcase, Calculator, DollarSign, ArrowRight, TrendingUp, FileText, Download } from "lucide-react";
import Link from "next/link";
import PdfLeadModal from "@/components/PdfLeadModal";

export default function SelfEmployed() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [y1, setY1] = useState(90000);
  const [y2, setY2] = useState(110000);
  const [y3, setY3] = useState(80000);
  const [addbacks, setAddbacks] = useState(15000);
  const r = normalizedIncome({ noa1:y2, noa2:y1, noa3:y3, addbacks });

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
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Self-Employed Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Briefcase className="w-4 h-4" />
                Self-Employed Income Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Self-Employed</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate your qualifying income for mortgage applications using Notice of Assessment and business addbacks.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Self-Employed Income Calculator</h2>
              
              <div className="mb-6">
            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-self-employed"
                title="Your Self-Employed Income Analysis"
                subtitle="Get a personalized PDF with your normalized income"
                leadMessage="PDF Report Download — Self-Employed Calculator"
                mortgageType="Self-Employed"
                amount=""
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Self-Employed Income Analysis",
                    calculatorName: "Self-Employed Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Latest Year NOA", value: "$" + Math.round(y2).toLocaleString("en-CA") },
                          { label: "Prior Year NOA", value: "$" + Math.round(y1).toLocaleString("en-CA") },
                          { label: "Two Years Ago NOA", value: "$" + Math.round(y3).toLocaleString("en-CA") },
                          { label: "Annual Addbacks", value: "$" + Math.round(addbacks).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Normalized Annual Income", value: "$" + Math.round(r.qualifyingIncome).toLocaleString("en-CA"), highlight: true },
                          { label: "3-Year Average", value: "$" + Math.round(r.threeYearAvg).toLocaleString("en-CA") },
                          { label: "Normalized Monthly", value: "$" + Math.round(r.qualifyingIncome / 12).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "Lenders average your last 2 years of NOA income. Addbacks like business-use-of-home and CCA can significantly increase qualifying income."
                  });
                }}
              />
            </div>
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Latest Year NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y2}
                    onChange={(e) => setY2(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Current year income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Prior Year NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y1}
                    onChange={(e) => setY1(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Previous year income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Two Years Ago NOA (Net Income)
                  </label>
                  <input
                    type="number"
                    value={y3}
                    onChange={(e) => setY3(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Two years ago income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Addbacks
                  </label>
                  <input
                    type="number"
                    value={addbacks}
                    onChange={(e) => setAddbacks(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Depreciation, CCA, etc."
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Income Analysis</h3>
                
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Qualifying Income</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${r.qualifyingIncome.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Lower of latest year or 2-year avg + addbacks</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">3-Year Average (Reference)</div>
                    <div className="text-2xl font-bold text-gold-400">
                      ${r.threeYearAvg.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Some lenders use for trend analysis</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-semibold text-blue-400">Income Calculation Method</div>
                      <div className="text-sm text-gray-400">
                        Lenders typically use the lower of the most recent year or 2-year average, plus acceptable addbacks.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Important:</strong> Different lenders use different calculation methods. Always confirm the specific approach with your lender. This is for educational purposes only.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-400 mb-3">Self-Employed Documentation Tips</h4>
                <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-blue-300 mb-2">A-Lender Documents</div>
                    <ul className="space-y-1 text-xs">
                      <li>• 2 years T1 Generals</li>
                      <li>• 2 years Notice of Assessment</li>
                      <li>• 2 years Financial statements</li>
                      <li>• Business license/registration</li>
                      <li>• Articles of incorporation</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gold-300 mb-2">B-Lender Documents</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>12 months business bank statements</strong></li>
                      <li>• Beacon score 500+</li>
                      <li>• Property appraisal</li>
                      <li>• No tax returns required</li>
                      <li>• No NOA required</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Common Addbacks</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Depreciation/CCA</li>
                      <li>• Personal use of business expenses</li>
                      <li>• One-time write-offs</li>
                      <li>• Non-cash expenses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href={"/calculators/affordability" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Affordability Calculator
                </Link>
                <Link 
                  href={"/private-lending/calculators/alternative-income" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Alternative Income
                </Link>
                <Link 
                  href={"/calculators" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  All Calculators
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}