"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { cashflow } from "@/lib/calc/investment";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { TrendingUp, Calculator, DollarSign, ArrowRight, Building, Percent, AlertTriangle, CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import PdfLeadModal from "@/components/PdfLeadModal";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { useLiveRates } from "@/lib/useLiveRates";
import { liveRate, useLiveDefault } from "../_lib/liveRateDefaults";
import { LiveRateNote } from "../_lib/LiveRateNote";

export default function Investment() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [price, setPrice] = useState(800000);
  const [down, setDown] = useState(200000);
  // Rentals are uninsured (20%+ down) → conventional 5-yr fixed from the live feed. Rental pricing is often
  // a little higher than owner-occupied, so the note asks for the actual quote.
  const { data: liveRates } = useLiveRates();
  const [rate, setRate, rateSource] = useLiveDefault(5.45, liveRate(liveRates, "fixed5Conventional"));
  const [years, setYears] = useState(25);
  const [rent, setRent] = useState(4200);
  const [vacancy, setVacancy] = useState(3);
  const [expenses, setExpenses] = useState(1200);
  const [closingCosts, setClosingCosts] = useState(15000);

  const r = cashflow({
    price,
    downPayment: down,
    ratePct: rate,
    amortYears: years,
    rentMonthly: rent,
    vacancyPct: vacancy,
    expensesMonthly: expenses,
    closingCosts
  });

  const hasMortgage = r.pmt > 0;
  // Rental (non-owner-occupied) properties need at least 20% down — default insurance isn't available
  const downPct = price > 0 ? (down / price) * 100 : 0;
  const belowRentalMinimum = price > 0 && downPct < 20;
  const isGoodInvestment = r.cf > 0 && (!hasMortgage || r.dscr >= 1.2) && r.capRate >= 4;

  return (
    <>
      <Navigation />
      <CalculatorSchema name="Investment Property Calculator" description="Analyze cap rates, DSCR, and cash flow for real estate investment properties." url="/calculators/investment" />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-300 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-300 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-300">Investment Calculator</span>
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
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-6">
                <TrendingUp className="w-4 h-4" />
                Investment Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Investment</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Analyze rental property cash flow, cap rates, and debt service coverage ratios for informed investment decisions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-5 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Investment Property Analysis</h2>

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
                source="calculator-pdf-investment"
                title="Your Investment Property Analysis"
                subtitle="Get a personalized PDF with your investment analysis"
                leadMessage="PDF Report Download — Investment Calculator"
                mortgageType="Investment"
                amount={price.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Investment Property Analysis",
                    calculatorName: "Investment Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Property Value", value: "$" + Math.round(price).toLocaleString("en-CA") },
                          { label: "Down Payment", value: "$" + Math.round(down).toLocaleString("en-CA") },
                          { label: "Mortgage Rate", value: rate + "%" },
                          { label: "Monthly Rent", value: "$" + Math.round(rent).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Cash Flow", value: "$" + Math.round(r.cf).toLocaleString("en-CA"), highlight: true },
                          { label: "Cap Rate", value: r.capRate.toFixed(2) + "%", highlight: true },
                          { label: "DSCR", value: hasMortgage ? r.dscr.toFixed(2) : "N/A (no mortgage)" },
                          { label: "Cash-on-Cash Return", value: r.cashOnCash.toFixed(2) + "%" },
                          { label: "NOI", value: "$" + Math.round(r.noi).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "A good investment typically has positive cash flow, DSCR >= 1.2, and cap rate >= 4%. Lenders focus heavily on DSCR."
                  });
                }}
              />
            </div>
                <ComplianceBanner feature="LEAD_FORM" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Purchase Price
                  </label>
                  <CalculatorNumberInput aria-label="Purchase Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Down Payment
                  </label>
                  <CalculatorNumberInput aria-label="Down Payment"
                    type="number"
                    value={down}
                    onChange={(e) => setDown(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Interest Rate (%)
                  </label>
                  <CalculatorNumberInput aria-label="Interest Rate (%)" max={100}
                    type="number"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                  <LiveRateNote data={liveRates} product="fixed5Conventional" source={rateSource} suffix=" (rental rates are often slightly higher)" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Amortization (Years)
                  </label>
                  <select aria-label="Amortization (Years)"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Gross Rent
                  </label>
                  <CalculatorNumberInput aria-label="Monthly Gross Rent"
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <CalculatorNumberInput aria-label="Vacancy Rate (%)"
                    type="number"
                    value={vacancy}
                    onChange={(e) => setVacancy(Math.min(100, Math.max(0, Number(e.target.value))))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Closing Costs (one-time)
                  </label>
                  <CalculatorNumberInput aria-label="Closing Costs (one-time)"
                    type="number"
                    value={closingCosts}
                    onChange={(e) => setClosingCosts(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Land transfer tax, legal, inspection"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monthly Operating Expenses
                  </label>
                  <CalculatorNumberInput aria-label="Monthly Operating Expenses"
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Property taxes, insurance, maintenance, etc."
                  />
                </div>
              </div>

              {belowRentalMinimum && (
                <div className="mb-6 p-4 rounded-lg border bg-orange-500/10 border-orange-500/30 text-sm text-orange-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Your down payment is {downPct.toFixed(1)}% of the price. Rental (non-owner-occupied) properties generally require at least 20% down because mortgage default insurance isn&apos;t available for them. Owner-occupied 2–4 unit homes have different rules.</span>
                </div>
              )}

              {/* Results */}
              <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Investment Analysis</h3>

                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                    <div className="text-2xl font-bold text-red-400">
                      ${r.pmt.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-400">Principal & Interest</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Net Operating Income</div>
                    <div className="text-2xl font-bold text-gold-300">
                      ${r.noi.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-400">Monthly NOI</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cash Flow</div>
                    <div className={`text-2xl font-bold ${r.cf >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${r.cf.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-gray-400">Monthly net cash</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cap Rate</div>
                    <div className="text-2xl font-bold text-gold-300">
                      {r.capRate.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">Annual NOI ÷ price</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">DSCR</div>
                    <div className={`text-2xl font-bold ${!hasMortgage || r.dscr >= 1.2 ? 'text-green-400' : 'text-orange-400'}`}>
                      {hasMortgage ? r.dscr.toFixed(2) : "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">{hasMortgage ? "NOI ÷ mortgage payment" : "No mortgage"}</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Cash-on-Cash</div>
                    <div className={`text-2xl font-bold ${r.cashOnCash >= 0 ? 'text-gold-300' : 'text-red-400'}`}>
                      {r.cashOnCash.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">Annual cash flow ÷ cash invested</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isGoodInvestment ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-3">
                    {isGoodInvestment ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <div className={`font-semibold ${isGoodInvestment ? 'text-green-400' : 'text-orange-400'}`}>
                        {isGoodInvestment ? 'Strong Investment Potential' : 'Investment Requires Review'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isGoodInvestment
                          ? `Positive cash flow with ${r.capRate.toFixed(1)}% cap rate${hasMortgage ? ` and ${r.dscr.toFixed(2)} DSCR` : ""}`
                          : 'Consider adjusting purchase price, down payment, or rental income'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  <strong>Note:</strong> Estimates only, before income tax. Cash flow excludes capital expenditures/major repairs, rent growth and appreciation; closing costs are used only for cash-on-cash return. Lenders may qualify rental income differently (e.g. 50% add-back or rental offset). Consult a financial advisor for comprehensive investment planning.
                </div>
              </div>

              {/* Educational Content */}
              <div className="bg-gold-500/10 rounded-xl p-6 mb-6 border border-gold-500/20">
                <h4 className="text-lg font-semibold text-gold-300 mb-3">Investment Metrics Explained</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">Cap Rate (Capitalization Rate)</div>
                    <p>Annual NOI divided by property value. Higher cap rates indicate better returns but may come with higher risk.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 mb-2">DSCR (Debt Service Coverage Ratio)</div>
                    <p>NOI divided by mortgage payments. Lenders typically require DSCR ≥ 1.20 for investment properties.</p>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href={"/calculators/payment" as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </Link>
                <Link
                  href="/mli-select/calculators/dscr"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/30 transition-colors"
                >
                  <Percent className="w-4 h-4" />
                  DSCR Calculator
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
        <RelatedCalculators current="investment" related={["payment","rate-comparison","rent-vs-buy","debt-service-ratio"]} />
      </main>
    </>
  );
}