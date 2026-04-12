"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Home, HelpCircle, ChevronDown, ChevronUp,
  AlertTriangle, Info, TrendingDown, Clock, DollarSign, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";

/* ── Mortgage Math ──────────────────────────────────── */
function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const faqs = [
  {
    q: "What is the break-even point when refinancing?",
    a: "The break-even point is the number of months it takes for your monthly savings to fully recover the upfront costs of refinancing. If your break-even is 18 months and you plan to stay in the home for 5+ years, refinancing likely makes sense. If you might move within a year, it probably doesn't."
  },
  {
    q: "What's the difference between IRD and 3-month interest penalty?",
    a: "Variable-rate mortgages typically carry a 3-month interest penalty (3 months of interest at your current rate). Fixed-rate mortgages use the Interest Rate Differential (IRD), which compares your rate to the lender's current rate for the remaining term. IRD penalties can be significantly higher — sometimes tens of thousands of dollars on large mortgages."
  },
  {
    q: "Can I negotiate my refinance costs?",
    a: "Yes. You can shop for lower legal fees, some lenders offer free appraisals or cash-back to cover closing costs, and you may be able to negotiate the penalty with your current lender. Rate-switch promotions at renewal time sometimes waive penalties entirely."
  },
  {
    q: "Should I break my mortgage mid-term or wait for renewal?",
    a: "If rates have dropped enough that your interest savings over the remaining term exceed the penalty plus closing costs, a mid-term break can be worth it. However, waiting for renewal means you pay no penalty. Compare the net savings from both options using this calculator."
  },
  {
    q: "How do I minimize my break-even time?",
    a: "Reduce upfront costs (negotiate legal/appraisal), get penalty estimates from your lender in writing before committing, choose a shorter new term to maximize monthly savings, and avoid rolling all costs into the new mortgage (this increases your balance and interest)."
  }
];

export default function RefinanceBreakEvenPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(450000);
  const [currentRate, setCurrentRate] = useState(5.89);
  const [currentPayment, setCurrentPayment] = useState(2850);
  const [remainingMonths, setRemainingMonths] = useState(240);
  const [newRate, setNewRate] = useState(4.49);
  const [newTermYears, setNewTermYears] = useState(5);
  const [legalFees, setLegalFees] = useState(1500);
  const [appraisalFees, setAppraisalFees] = useState(500);
  const [penaltyEstimate, setPenaltyEstimate] = useState(8000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const results = useMemo(() => {
    const newTermMonths = newTermYears * 12;
    const newPayment = monthlyPayment(currentBalance, newRate, newTermMonths);
    const monthlySavings = currentPayment - newPayment;
    const totalCosts = legalFees + appraisalFees + penaltyEstimate;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : Infinity;
    const breakEvenYears = breakEvenMonths / 12;

    // Interest remaining on current path
    const totalCurrentInterest = (currentPayment * remainingMonths) - currentBalance;
    // Interest on new mortgage
    const totalNewInterest = (newPayment * newTermMonths) - currentBalance;
    const interestSaved = totalCurrentInterest - totalNewInterest;
    const netSavings = interestSaved - totalCosts;

    return { newPayment, monthlySavings, totalCosts, breakEvenMonths, breakEvenYears, interestSaved, netSavings };
  }, [currentBalance, currentRate, currentPayment, remainingMonths, newRate, newTermYears, legalFees, appraisalFees, penaltyEstimate]);

  const makesSense = results.monthlySavings > 0 && results.breakEvenMonths !== Infinity;

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
              <span className="text-gold-400">Refinance Break-Even Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <TrendingDown className="w-4 h-4" />
                Refinance Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Refinance Break-Even</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Should you refinance? Calculate your break-even point, interest savings, and net benefit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Inputs */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Current Mortgage
                  </h2>
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
                source="calculator-pdf-refinance-break-even"
                title="Your Refinance Break-Even Analysis"
                subtitle="Get a personalized PDF with your refinance analysis"
                leadMessage="PDF Report Download — Refinance Break Even"
                mortgageType="Refinance"
                amount={currentBalance.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Refinance Break-Even Analysis",
                    calculatorName: "Refinance Break Even Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Current Balance", value: "$" + Math.round(currentBalance).toLocaleString("en-CA") },
                          { label: "Current Rate", value: currentRate + "%" },
                          { label: "Current Payment", value: "$" + Math.round(currentPayment).toLocaleString("en-CA") },
                          { label: "Remaining Term", value: Math.round(remainingMonths / 12) + " years" },
                          { label: "New Rate", value: newRate + "%" },
                          { label: "Penalty Estimate", value: "$" + Math.round(penaltyEstimate).toLocaleString("en-CA") },
                          { label: "Legal + Appraisal", value: "$" + Math.round(legalFees + appraisalFees).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "New Monthly Payment", value: "$" + Math.round(results.newPayment).toLocaleString("en-CA"), highlight: true },
                          { label: "Monthly Savings", value: "$" + Math.round(results.monthlySavings).toLocaleString("en-CA") },
                          { label: "Break-Even", value: results.breakEvenMonths === Infinity ? "Never" : results.breakEvenMonths + " months", highlight: true },
                          { label: "Interest Saved", value: "$" + Math.round(results.interestSaved).toLocaleString("en-CA") },
                          { label: "Net Savings", value: "$" + Math.round(results.netSavings).toLocaleString("en-CA"), highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "A refinance makes sense when your monthly savings recoup the switching costs within a reasonable timeframe — typically under 24 months."
                  });
                }}
              />
            </div>
                                    <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Current Mortgage Balance" value={currentBalance} onChange={setCurrentBalance} validation={{ min: 10000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} validation={{ min: 0.5, max: 15 }} type="percentage" />
                    <ValidatedInput label="Current Monthly Payment" value={currentPayment} onChange={setCurrentPayment} validation={{ min: 500, max: 20000 }} type="currency" />
                    <ValidatedInput label="Remaining Amortization (months)" value={remainingMonths} onChange={setRemainingMonths} validation={{ min: 12, max: 360 }} type="number" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-gold-400" />
                    New Mortgage & Costs
                  </h2>
                  <div className="space-y-6">
                    <ValidatedInput label="New Interest Rate" value={newRate} onChange={setNewRate} validation={{ min: 0.5, max: 15 }} type="percentage" />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Term</label>
                      <div className="flex gap-2">
                        {[3, 5, 7, 10].map((y) => (
                          <button key={y} onClick={() => setNewTermYears(y)} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${newTermYears === y ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {y} Year{y > 1 ? "s" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ValidatedInput label="Legal Fees" value={legalFees} onChange={setLegalFees} validation={{ min: 0, max: 10000 }} type="currency" />
                    <ValidatedInput label="Appraisal Fee" value={appraisalFees} onChange={setAppraisalFees} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Estimated Penalty" value={penaltyEstimate} onChange={setPenaltyEstimate} validation={{ min: 0, max: 100000 }} type="currency" />
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Monthly Savings</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                    {formatCurrency(results.monthlySavings, 0)}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formatCurrency(results.newPayment, 0)}/mo new vs {formatCurrency(currentPayment, 0)}/mo current
                  </p>
                </div>

                {/* Break Even */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold-400" />
                    Break-Even Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Total Refinance Costs</span>
                      <span className="font-semibold text-gray-200 text-xl">{formatCurrency(results.totalCosts, 0)}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Break-Even</span>
                      <span className={`font-semibold text-xl ${results.breakEvenMonths < 24 ? "text-green-400" : "text-amber-400"}`}>
                        {results.breakEvenMonths === Infinity ? "N/A" : `${results.breakEvenMonths} mo (${results.breakEvenYears.toFixed(1)} yr)`}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Interest Saved</span>
                      <span className="font-semibold text-green-400 text-xl">{formatCurrency(results.interestSaved, 0)}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Net Savings</span>
                      <span className={`font-semibold text-xl ${results.netSavings > 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatCurrency(results.netSavings, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-2xl p-6 sm:p-8 border ${makesSense && results.netSavings > 0 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`w-6 h-6 mt-0.5 flex-shrink-0 ${makesSense && results.netSavings > 0 ? "text-green-400" : "text-red-400"}`} />
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${makesSense && results.netSavings > 0 ? "text-green-300" : "text-red-300"}`}>
                        {makesSense && results.netSavings > 0 ? "Refinancing Looks Worthwhile" : "Refinancing May Not Be Beneficial"}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {makesSense && results.netSavings > 0
                          ? `You'd recover your costs in ${results.breakEvenMonths} months and save ${formatCurrency(results.netSavings, 0)} net over the new term.`
                          : results.monthlySavings <= 0
                            ? "Your new rate doesn't produce monthly savings. Consider a lower rate or keeping your current mortgage."
                            : `With ${results.breakEvenMonths} months to break even, the savings may not justify the disruption. Consider waiting for renewal.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Get Refinance Options</a>
                  <a href="tel:604-593-1550" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Call 604-593-1550</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">When Does Refinancing Make Sense?</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>Refinancing your mortgage means replacing your existing loan with a new one — typically at a lower interest rate or with different terms. While the prospect of a lower monthly payment is appealing, refinancing comes with upfront costs that must be weighed against the potential savings. The break-even point is the critical metric: it tells you how many months of reduced payments it takes to recover what you spent to refinance.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Understanding Refinance Penalties</h3>
              <p>The biggest barrier to mid-term refinancing is the penalty your current lender charges. For variable-rate mortgages, this is typically the equivalent of three months of interest. For fixed-rate mortgages, lenders use the Interest Rate Differential (IRD), which compares your contract rate to their current rate for a similar term. The IRD can be significantly more expensive — sometimes $15,000 to $25,000 on larger mortgages.</p>
              <p>Always request a penalty quote from your current lender before committing to a refinance. Lenders are required by law to provide this within a few business days. Some penalties are negotiable, especially if you have a strong payment history and are willing to escalate to a retention specialist.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Common Refinancing Mistakes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Ignoring the break-even calculation</strong> — Refinancing $10,000 in costs to save $80/month means you need 125 months (over 10 years) just to break even.</li>
                <li><strong>Rolling costs into the new mortgage</strong> — This increases your principal and erodes savings. Pay costs in cash whenever possible.</li>
                <li><strong>Extending the amortization</strong> — Lower payments from a longer amortization feel good but cost more in total interest.</li>
                <li><strong>Not shopping multiple lenders</strong> — Rate differences of 0.15% to 0.30% between lenders translate to thousands in savings over a term.</li>
                <li><strong>Refinancing too close to renewal</strong> — If you are within 6 months of renewal, the penalty savings of waiting often outweigh refinancing immediately.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Minimize Break-Even Time</h3>
              <p>The fastest path to break-even is to minimize costs and maximize monthly savings. Negotiate legal fees (typical range $1,200 to $2,000), ask your new lender about appraisal waivers or credits, and consider a slightly shorter new term — a 3-year fixed at a competitive rate can sometimes save more than a 5-year term when rate differentials are large. The key is to compare the total cost of each scenario, not just the monthly payment.</p>
              <p>With 23 years of experience and over $2 billion in funded mortgages, Kraft Mortgages has helped thousands of homeowners evaluate refinancing decisions. We compare offers from 40+ lenders to find the best rate and terms for your specific situation.</p>

              <div className="mt-8">
                <Link href="/calculators/mortgage-penalty" className="text-gold-400 hover:text-gold-300 underline">Mortgage Penalty Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/closing-costs" className="text-gold-400 hover:text-gold-300 underline">Closing Costs Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-gray-200 pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-gold-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{faq.a}</motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <ComplianceBanner feature="LEAD_FORM" />
      </main>
    </>
  );
}
