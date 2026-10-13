"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Info, HelpCircle, ChevronDown, ChevronUp,
  Building2, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock,
  DollarSign, FileText, BarChart3, Scale, Shield, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { useLiveRates } from "@/lib/useLiveRates";
import { liveRate, ratesAsOf, useLiveDefault } from "../_lib/liveRateDefaults";
import { LiveRateNote } from "../_lib/LiveRateNote";

// Equity-lender (private/MIC) FIRST mortgages have no benchmark in our live rate feed, so the 1st-position
// default stays illustrative. In 2nd position the default follows the live private-second benchmark.
const EQUITY_FIRST_ILLUSTRATIVE_RATE = 6.95;

type Province = "BC" | "AB" | "ON";
type LoanPosition = "1st" | "2nd";

// Combined federal + provincial marginal rates on ordinary income for 2026 (verified 2026-10-13), for taxable
// income of about $117K up to $140K (BC) / $154K (AB) / $150K (ON); ON includes surtax. Same defaults and
// sources as the Self-Employed A vs B calculator. (BC was once 20.5% — the federal bracket rate alone.)
const defaultTaxRates: Record<Province, number> = { BC: 38.29, AB: 36.0, ON: 43.41 };

// Canadian convention: semi-annual compounding, monthly rate = (1 + r/2)^(1/6) - 1 (same as lib/calc/payment.ts)
function monthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100 / 2, 1 / 6) - 1;
}

function monthlyPayment(principal: number, annualRate: number, amortMonths: number): number {
  if (principal <= 0 || amortMonths <= 0) return 0;
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / amortMonths;
  return principal * (r * Math.pow(1 + r, amortMonths)) / (Math.pow(1 + r, amortMonths) - 1);
}

function totalInterest(principal: number, annualRate: number, amortMonths: number, termMonths: number): number {
  const mp = monthlyPayment(principal, annualRate, amortMonths);
  let balance = principal;
  let paid = 0;
  for (let i = 0; i < termMonths; i++) {
    const interest = balance * monthlyRate(annualRate);
    paid += interest;
    balance -= (mp - interest);
    if (balance < 0) balance = 0;
  }
  return paid;
}

const faqs = [
  {
    q: "What's the difference between equity lending and private lending?",
    a: "Equity lending is a subset of private lending focused on the equity in your property. While all equity lenders are private lenders, not all private lenders are equity lenders. Equity lending specifically evaluates your loan-to-value ratio (LTV) rather than income or credit score. Private lending is the broader category that includes equity-based loans as well as other alternative lending structures."
  },
  {
    q: "Can I refinance from an equity lender to an A-lender later?",
    a: "Yes, and this is a common strategy. Many self-employed borrowers use equity lending to close quickly, then declare income for 1-2 years, build their credit profile, and refinance into an A-lender at a lower rate. This 'bridge' strategy can be particularly effective if you expect your income to grow or if you need to close a time-sensitive purchase."
  },
  {
    q: "Do equity lenders report to credit bureaus?",
    a: "Most equity lenders do not report to credit bureaus, which means on-time payments won't directly improve your credit score. However, they also typically don't report missed payments. If building credit is part of your strategy, you may want to maintain a small credit product that reports to bureaus alongside your equity loan."
  },
  {
    q: "What LTV do equity lenders typically require?",
    a: "Most equity lenders lend up to 65-75% of the property value for first mortgages, and up to 85% combined LTV for second mortgages. Lower LTV means lower rates: the same lender will typically price a 50% LTV loan noticeably below a 70–75% LTV loan, and fees follow the same pattern. Having more equity in the property translates to better terms."
  },
  {
    q: "Why would I choose equity lending over an A-lender?",
    a: "Equity lending can be cheaper on an all-in basis when you factor in the personal income tax you'd owe on the extra declared income needed to qualify with an A-lender. It also offers faster closing (3-7 days vs 2-4 weeks), no income verification requirements, and more flexible qualification criteria. For self-employed borrowers, real estate investors, or time-sensitive purchases, equity lending often makes mathematical sense."
  }
];

export default function AVsEquityPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [mortgageAmount, setMortgageAmount] = useState(600000);
  const [propertyValue, setPropertyValue] = useState(800000);
  const [loanPosition, setLoanPosition] = useState<LoanPosition>("1st");
  const [term, setTerm] = useState(2);
  const [amortization, setAmortization] = useState(25);
  const { data: liveRates } = useLiveRates();
  const ratesDate = ratesAsOf(liveRates);
  // A-lender default = conventional 5-yr fixed (uninsured; best5YrFixed is the insured rate)
  const liveConventional5 = liveRate(liveRates, "fixed5Conventional");
  const [aRate, setARate, aRateSource] = useLiveDefault(4.49, liveConventional5);
  const livePrivateSecond = liveRate(liveRates, "privateSecond");
  const [eqRate, setEqRate, eqRateSource] = useLiveDefault(
    EQUITY_FIRST_ILLUSTRATIVE_RATE,
    loanPosition === "2nd" ? livePrivateSecond : EQUITY_FIRST_ILLUSTRATIVE_RATE,
  );
  const [province, setProvince] = useState<Province>("BC");
  const [additionalIncome, setAdditionalIncome] = useState(80000);
  const [marginalRate, setMarginalRate] = useState(defaultTaxRates.BC);
  const [isInvestment, setIsInvestment] = useState(false);
  const [eqFee, setEqFee] = useState(1.0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const termMonths = term * 12;
  const amortMonths = amortization * 12;
  const ltv = (mortgageAmount / propertyValue) * 100;

  const aMonthly = useMemo(() => monthlyPayment(mortgageAmount, aRate, amortMonths), [mortgageAmount, aRate, amortMonths]);
  const eqMonthly = useMemo(() => monthlyPayment(mortgageAmount, eqRate, amortMonths), [mortgageAmount, eqRate, amortMonths]);
  const aInterest = useMemo(() => totalInterest(mortgageAmount, aRate, amortMonths, termMonths), [mortgageAmount, aRate, amortMonths, termMonths]);
  const eqInterest = useMemo(() => totalInterest(mortgageAmount, eqRate, amortMonths, termMonths), [mortgageAmount, eqRate, amortMonths, termMonths]);
  const eqFeeAmount = mortgageAmount * (eqFee / 100);
  const additionalTax = additionalIncome * (marginalRate / 100) * term;
  // Rental-property interest is deductible on BOTH paths — apply it to each (was equity-only, biasing the result)
  const investmentTaxSaving = isInvestment ? eqInterest * (marginalRate / 100) : 0;
  const aInvestmentTaxSaving = isInvestment ? aInterest * (marginalRate / 100) : 0;
  const aTotalAllIn = aInterest + additionalTax - aInvestmentTaxSaving;
  const eqTotalAllIn = eqInterest + eqFeeAmount - investmentTaxSaving;
  const netDifference = aTotalAllIn - eqTotalAllIn;
  const savingsLabel = netDifference > 0 ? "Equity lending is cheaper" : "A-lender is cheaper";

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
              <span className="text-gold-400">A-Lender vs Equity Lending</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Scale className="w-4 h-4" />
                Self-Employed Cost Comparison
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">A-Lender vs Equity</span> Lending
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                For self-employed borrowers: see the true all-in cost including hidden income tax. Which option actually saves more?
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
                    Loan Details
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
                source="calculator-pdf-a-vs-equity"
                title="Your A-Lender vs Equity Lender Analysis"
                subtitle="Get a personalized PDF comparing bank and equity options"
                leadMessage="PDF Report Download — A Vs Equity"
                mortgageType="Alternative"
                amount={mortgageAmount.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your A-Lender vs Equity Lender Analysis",
                    calculatorName: "A Vs Equity Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: "$" + Math.round(mortgageAmount).toLocaleString("en-CA") },
                          { label: "Property Value", value: "$" + Math.round(propertyValue).toLocaleString("en-CA") },
                          { label: "A-Lender Rate", value: aRate + "%" },
                          { label: "Equity Rate", value: eqRate + "%" },
                          { label: "Term", value: term + " years" },
                          { label: "LTV", value: ltv.toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "Comparison",
                        rows: [
                          { label: "A-Lender Monthly", value: "$" + Math.round(aMonthly).toLocaleString("en-CA") },
                          { label: "Equity Monthly", value: "$" + Math.round(eqMonthly).toLocaleString("en-CA") },
                          { label: "A-Lender Interest", value: "$" + Math.round(aInterest).toLocaleString("en-CA") },
                          { label: "Equity Interest", value: "$" + Math.round(eqInterest).toLocaleString("en-CA") },
                          { label: "Equity Fee", value: "$" + Math.round(eqFeeAmount).toLocaleString("en-CA") },
                          { label: "Additional Tax Cost", value: "$" + Math.round(additionalTax).toLocaleString("en-CA") },
                          ...(isInvestment && investmentTaxSaving > 0 ? [{ label: "Investment Tax Savings (Equity)", value: "$" + Math.round(investmentTaxSaving).toLocaleString("en-CA") }, { label: "Investment Tax Savings (A-Lender)", value: "$" + Math.round(aInvestmentTaxSaving).toLocaleString("en-CA") }] : []),
                          { label: "Net Difference (A minus Equity)", value: "$" + Math.round(netDifference).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "This comparison helps self-employed borrowers decide between bank and equity lending. Consider total cost including fees and tax implications."
                  });
                }}
              />
            </div>
                                    <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Mortgage Amount Needed" value={mortgageAmount} onChange={setMortgageAmount} validation={{ min: 50000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Property Value" value={propertyValue} onChange={setPropertyValue} validation={{ min: 100000, max: 10000000 }} type="currency" />
                    <p className="text-xs text-gray-500">LTV: {ltv.toFixed(1)}% — {ltv <= 75 ? "✓ Within typical equity lending range" : "⚠ Above the ~65–75% most equity lenders allow on a 1st mortgage"}</p>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Loan Position</label>
                      <div className="flex gap-2">
                        {(["1st", "2nd"] as const).map((p) => (
                          <button key={p} onClick={() => { setLoanPosition(p); setEqFee(p === "1st" ? 1.0 : 2.0); }}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${loanPosition === p ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {p === "1st" ? "1st Mortgage" : "2nd Mortgage"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Term (years)</label>
                        <ValidatedSlider label="Term" value={term} onChange={setTerm} min={1} max={5} step={1} formatValue={(v) => `${v} year${v > 1 ? "s" : ""}`} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amortization (years)</label>
                        <ValidatedSlider label="Amortization" value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" /> A-Lender Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <ValidatedInput label="A-Lender Rate (%)" value={aRate} onChange={setARate} validation={{ min: 1, max: 15 }} type="percentage" />
                          <LiveRateNote data={liveRates} product="fixed5Conventional" source={aRateSource} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Equity Lender Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <ValidatedInput label="Equity Lender Rate (%)" value={eqRate} onChange={setEqRate} validation={{ min: 1, max: 20 }} type="percentage" />
                          {loanPosition === "2nd" && livePrivateSecond !== undefined
                            ? <LiveRateNote data={liveRates} product="privateSecond" source={eqRateSource} />
                            : <p className="text-xs text-gray-400 mt-1.5">{eqRateSource === "user" ? "" : "Illustrative equity-lender rate (no live benchmark for private first mortgages). "}Equity-lender rates depend mostly on LTV, location and exit strategy. Enter the quote you received.</p>}
                        </div>
                        <ValidatedInput label="Equity Lender Fee (%)" value={eqFee} onChange={setEqFee} validation={{ min: 0, max: 5 }} type="percentage" />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold-400" /> Tax Impact (Self-Employed)
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
                          <div className="flex gap-2">
                            {(["BC", "AB", "ON"] as const).map((p) => (
                              <button key={p} onClick={() => { setProvince(p); setMarginalRate(defaultTaxRates[p]); }}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${province === p ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                        <ValidatedInput label="Additional Income Needed to Qualify ($/year)" value={additionalIncome} onChange={setAdditionalIncome} validation={{ min: 0, max: 500000 }} type="currency" />
                        <ValidatedInput label="Your Marginal Tax Rate (%)" value={marginalRate} onChange={setMarginalRate} validation={{ min: 0, max: 55 }} type="percentage" />
                        <p className="text-xs text-gray-500">This is the extra income you&apos;d need to declare on your T1 to qualify with an A-lender. Province defaults are 2026 combined marginal rates for about $117K–$140K of income. Enter your own. For incorporated owners, the true cost is usually lower (personal vs corporate tax).</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsInvestment(!isInvestment)}
                          className={`w-12 h-6 rounded-full transition-all ${isInvestment ? "bg-gold-500" : "bg-gray-600"} relative`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isInvestment ? "left-6" : "left-0.5"}`} />
                        </button>
                        <span className="text-sm text-gray-300">Investment Property (interest may be tax-deductible)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Summary Banner */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${netDifference > 0 ? "bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/30" : "bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-500/30"}`}>
                  <p className="text-sm font-medium mb-1">{savingsLabel}</p>
                  <p className={`text-4xl sm:text-5xl font-bold mb-2 ${netDifference > 0 ? "text-emerald-400" : "text-blue-400"}`}>
                    {formatCurrency(Math.abs(netDifference), 0)}
                  </p>
                  <p className="text-sm text-gray-300">
                    over the {term}-year term
                  </p>
                </div>

                {/* Two Column Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* A-Lender */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4" /> A-Lender Path
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400 block text-xs">Monthly Payment</span>
                        <span className="font-semibold text-gray-100">{formatCurrency(aMonthly, 0)}/mo</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-xs">Interest ({term} years)</span>
                        <span className="font-semibold text-gray-100">{formatCurrency(aInterest, 0)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <span className="text-gray-400 block text-xs">Income Tax on Declared Income</span>
                        <span className="font-semibold text-red-400">{formatCurrency(additionalTax, 0)}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{formatCurrency(additionalIncome, 0)}/yr × {marginalRate}% × {term} yrs</p>
                      </div>
                      {isInvestment && aInvestmentTaxSaving > 0 && (
                        <div className="bg-green-500/10 rounded-lg p-2">
                          <span className="text-gray-400 block text-xs">Interest Deductibility Savings</span>
                          <span className="font-semibold text-green-400">-{formatCurrency(aInvestmentTaxSaving, 0)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400"><XCircle className="w-3 h-3" /> 2 years T1 Generals & NOAs</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400"><XCircle className="w-3 h-3" /> Credit score 680+</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" /> 2-4 weeks to close</div>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <span className="text-gray-400 block text-xs">Total All-In Cost</span>
                        <span className="text-lg font-bold text-blue-300">{formatCurrency(aTotalAllIn, 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Equity Lender */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <h4 className="font-bold text-emerald-300 mb-4 flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4" /> Equity Lender Path
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400 block text-xs">Monthly Payment</span>
                        <span className="font-semibold text-gray-100">{formatCurrency(eqMonthly, 0)}/mo</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-xs">Interest ({term} years)</span>
                        <span className="font-semibold text-gray-100">{formatCurrency(eqInterest, 0)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <span className="text-gray-400 block text-xs">Lender Fee ({eqFee}%)</span>
                        <span className="font-semibold text-amber-400">{formatCurrency(eqFeeAmount, 0)}</span>
                      </div>
                      {isInvestment && investmentTaxSaving > 0 && (
                        <div className="bg-green-500/10 rounded-lg p-2">
                          <span className="text-gray-400 block text-xs">Interest Deductibility Savings</span>
                          <span className="font-semibold text-green-400">-{formatCurrency(investmentTaxSaving, 0)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400"><CheckCircle2 className="w-3 h-3 text-green-400" /> No income verification</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400"><CheckCircle2 className="w-3 h-3 text-green-400" /> Property appraisal only</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3 text-green-400" /> 3-7 business days</div>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <span className="text-gray-400 block text-xs">Total All-In Cost</span>
                        <span className="text-lg font-bold text-emerald-300">{formatCurrency(eqTotalAllIn, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gold-400" />
                    Detailed Comparison
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Interest cost difference</span>
                      <span className="font-medium text-gray-100">{eqInterest >= aInterest ? "+" : "-"}{formatCurrency(Math.abs(eqInterest - aInterest), 0)} (equity costs {eqInterest >= aInterest ? "more" : "less"})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Income tax saved with equity</span>
                      <span className="font-medium text-green-400">-{formatCurrency(additionalTax, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Equity lender fee</span>
                      <span className="font-medium text-amber-400">+{formatCurrency(eqFeeAmount, 0)}</span>
                    </div>
                    {isInvestment && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Extra interest deduction with equity (net of A-lender&apos;s)</span>
                        <span className="font-medium text-green-400">-{formatCurrency(investmentTaxSaving - aInvestmentTaxSaving, 0)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-200">Net difference</span>
                      <span className={`font-bold text-lg ${netDifference >= 0 ? "text-emerald-400" : "text-blue-400"}`}>
                        {netDifference >= 0 ? "+" : ""}{formatCurrency(netDifference, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Time savings</span>
                      <span>~{Math.max(1, Math.round(21 / 5))}x faster with equity (5 days vs 3 weeks)</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-2xl p-6 border ${netDifference > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className={`w-5 h-5 ${netDifference > 0 ? "text-emerald-400" : "text-blue-400"}`} />
                    {netDifference > 0 ? "Equity Lending Is More Cost-Effective" : "A-Lender Is More Cost-Effective"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {netDifference > 0
                      ? `Equity lending saves you ${formatCurrency(Math.abs(netDifference), 0)} net over ${term} years. The ${formatCurrency(additionalTax, 0)} tax saving on declared income more than offsets the ${formatCurrency(eqInterest - aInterest, 0)} additional interest and ${formatCurrency(eqFeeAmount, 0)} lender fee.`
                      : `The A-lender path is ${formatCurrency(Math.abs(netDifference), 0)} cheaper over ${term} years: the ${formatCurrency(eqInterest - aInterest, 0)} of extra equity-lender interest plus the ${formatCurrency(eqFeeAmount, 0)} lender fee outweigh the ${formatCurrency(additionalTax, 0)} of income tax on the extra declared income.`
                    }
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Expert Analysis
                  </a>
                  <a href="tel:604-593-1550"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Call 604-593-1550
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding This Comparison</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• The A-lender default follows our live rate feed; the equity-lender default is illustrative. Actual rates vary by application.</p>
                    <p>• Tax calculations are estimates. Consult a CPA for your specific tax situation.</p>
                    <p>• Equity lender fees (lender/broker fees) may be partially or fully financed into the mortgage.</p>
                    <p>• Investment property interest deductibility depends on your specific situation — verify with your accountant.</p>
                    <p>• Some equity lenders charge a flat administrative fee instead of a percentage. Convert it to a percentage of the loan for the input above.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">A-Lender vs Equity Lending: The Complete Guide for Self-Employed Canadians</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What is Equity Lending? Understanding the Landscape</h3>
              <p>
                Equity lending in Canada refers to mortgage financing that is primarily based on the equity you hold in a property, rather than your personal income or credit score. Equity lenders — which include mortgage investment corporations (MICs), private lending funds, and individual private lenders — evaluate your loan-to-value ratio (LTV) as the primary qualification criteria. If you have sufficient equity in the property (typically 25-50%), you can secure financing regardless of your employment status, income documentation, or credit history.
              </p>
              <p>
                For self-employed Canadians, contractors, and business owners, equity lending has become an increasingly important tool. Traditional A-lenders (major banks and credit unions) require documented income through T1 Generals, Notices of Assessment, and often 2+ years of consistent income history. Many self-employed individuals legitimately minimize their taxable income through business deductions — but this same strategy can disqualify them from A-lender financing.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How Equity Lenders Differ from A-Lenders and B-Lenders</h3>
              <p>
                The Canadian mortgage market has three tiers. A-lenders (banks, credit unions and monoline lenders) offer the lowest rates{ratesDate && liveConventional5 !== undefined ? ` (as of ${ratesDate}, conventional 5-year fixed rates in our live feed start at ${liveConventional5.toFixed(2)}%)` : ""}, see <Link href="/rates" className="text-gold-400 hover:text-gold-300 underline">today&apos;s rates</Link>, but they require full income verification, strong credit scores (typically 680+), and standard qualification criteria including GDS/TDS ratios. B-lenders sit in the middle, offering slightly higher rates with more flexible qualification, but still generally require some form of income verification.
              </p>
              <p>
                Equity lenders operate on an entirely different model. They assess the property value, the loan amount relative to that value, and the exit strategy. Income verification is typically not required at all. Equity-lender rates sit above A- and B-lender rates and vary widely by lender, LTV, property type and province{ratesDate && livePrivateSecond !== undefined ? ` (for reference, the lowest private second-mortgage rate in our live feed is ${livePrivateSecond.toFixed(2)}% as of ${ratesDate})` : ""}. Lender fees are commonly 1% to 3% of the loan amount, and some lenders charge a flat administrative fee instead, which can be cheaper on larger mortgages. Ask us for current quotes from several equity lenders.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Hidden Tax Cost of Qualifying with an A-Lender</h3>
              <p>
                Here&apos;s the insight most self-employed borrowers miss: qualifying with an A-lender may require declaring significantly more personal income on your tax returns. If your business nets $120,000 but you currently declare $60,000 after legitimate deductions, an A-lender might require you to declare $140,000 or more to qualify for the mortgage you need. That extra $80,000 of declared income isn&apos;t free — it comes with a real tax cost.
              </p>
              <p>
                In British Columbia, raising declared income from $60,000 to $140,000 means the extra $80,000 is taxed at combined federal and provincial rates of roughly 28% to 40% — about 32% on average, or roughly $25,600 per year. Over a 2-year term, that&apos;s about $51,300 in additional taxes. Over a 5-year term, it&apos;s about $128,000. This tax cost must be factored into any comparison between A-lender and equity lending rates. When you see an A-lender at 4.49% vs an equity lender at 6.95%, the rate difference seems enormous — but the tax math often tells a different story.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Equity Lending Makes Mathematical Sense</h3>
              <p>
                Equity lending makes mathematical sense when the all-in cost — higher interest plus lender fees — is less than the A-lender&apos;s interest plus the income tax you&apos;d owe on additional declared income. Use the calculator above to model your specific situation. As a general rule, equity lending tends to favour borrowers who:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Would need to declare significantly more income to qualify with an A-lender</li>
                <li>Have a high marginal tax rate (Ontario at 43.4%, BC at up to 53.5%)</li>
                <li>Need to close quickly (time-sensitive purchases, competitive markets)</li>
                <li>Plan to refinance to an A-lender within 1-3 years as their situation improves</li>
                <li>Are purchasing investment properties where the higher interest may be tax-deductible</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Real Example: $600,000 Self-Employed Purchase Comparison</h3>
              <p>
                Consider a self-employed contractor purchasing an $800,000 property in Surrey, BC. They need a $600,000 mortgage and would need to declare an additional $80,000/year in income (from $60,000 to $140,000) to qualify with an A-lender at 4.49%. In BC that extra income is taxed at roughly 32% on average.
              </p>
              <p>
                <strong>A-Lender Path:</strong> $600,000 at 4.49% over a 2-year term with 25-year amortization costs approximately $52,200 in interest. The additional income tax on $80,000 × ~32% × 2 years ≈ $51,300. Total all-in cost: approximately $103,500.
              </p>
              <p>
                <strong>Equity Lender Path:</strong> $600,000 at 6.95% with a 1% fee ($6,000) over the same 2-year term costs approximately $81,000 in interest. Total all-in cost: approximately $87,000. In this scenario, equity lending comes out roughly $16,500 ahead — and the borrower closes in days instead of weeks. (Lower equity-lender rates are usually only available at lower LTVs, around 50%.)
              </p>
              <p>
                Now consider the same borrower in Ontario at a 43.4% marginal rate: the tax on $80,000 × 43.4% × 2 years = $69,440. A-lender total: about $121,700. Equity lender total: about $87,000. In Ontario, equity lending saves approximately $34,700 over the 2-year term despite the higher interest rate. This is the power of factoring in the full picture.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Equity Lending for Investment Properties: Interest Is Tax-Deductible</h3>
              <p>
                If the property is an investment (rental property or flip), mortgage interest is generally tax-deductible — with either lender. At a 43.4% marginal rate in Ontario, the roughly $81,000 of equity-lender interest is worth about $35,100 in tax savings, while the A-lender&apos;s $52,200 would be worth about $22,700, so the deduction narrows the gap by roughly $12,500. Toggle the &quot;Investment Property&quot; option in the calculator above to see this impact.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Transition from Equity to A-Lender Later</h3>
              <p>
                Equity lending is often a strategic short-term solution. Here&apos;s a common transition path: (1) Use equity lending to close your purchase quickly, often within 3-7 business days. (2) Over the next 1-2 years, gradually declare more income on your tax returns, establish a consistent income pattern, and maintain your credit score. (3) When your equity lender term matures, refinance to an A-lender at a lower rate using your now-documented income. This strategy works especially well for self-employed borrowers whose businesses are growing and whose income trajectory is upward.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Choosing an Equity Lender: What Drives the Rate and Fees</h3>
              <p>
                Equity lenders in Canada range from large national mortgage investment corporations (MICs) to regional private funds and individual lenders. Their pricing changes often, so we don&apos;t publish lender-by-lender rate tables here. What moves your rate and fee:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>LTV:</strong> the biggest factor. Pricing steps up as LTV rises, and most lenders stop at about 65–75% on a first mortgage.</li>
                <li><strong>Position:</strong> second mortgages cost more than firsts because the lender ranks behind the first-mortgage holder.</li>
                <li><strong>Location and property type:</strong> urban detached homes get the best terms; rural, unusual or mixed-use properties cost more or are declined.</li>
                <li><strong>Fee structure:</strong> most charge a percentage fee (commonly 1–3%); some charge a flat administrative fee, which favours larger loans. Compare the all-in cost, not just the rate.</li>
                <li><strong>Term and exit:</strong> equity loans are usually 1–2 year terms, often interest-only. A clear exit plan (refinance to an A- or B-lender, or a sale) gets better pricing.</li>
              </ul>
              <p>
                We compare several equity lenders for each file. <Link href="/contact" className="text-gold-400 hover:text-gold-300 underline">Contact us</Link> for current quotes, or see <Link href="/rates" className="text-gold-400 hover:text-gold-300 underline">today&apos;s A-lender and private-second benchmarks</Link>.
              </p>

              <div className="mt-8">
                <Link href="/calculators/closing-costs" className="text-gold-400 hover:text-gold-300 underline">Closing Costs Calculator</Link>
                {" · "}
                <Link href="/calculators/self-employed-a-vs-b" className="text-gold-400 hover:text-gold-300 underline">Self-Employed: A vs B Lender</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-gray-500 mb-8">
          Rates shown are estimated starting rates for comparison purposes. Actual rates vary based on credit, LTV, property type, and location. Contact a broker to confirm rates for your specific situation.
        </p>

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

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "A-Lender vs Equity Lending Calculator",
          "description": "Compare A-lender mortgages vs equity lending costs for self-employed borrowers in Canada. See the hidden tax impact and find out which option saves more.",
          "url": "https://www.kraftmortgages.ca/calculators/a-vs-equity",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
          "provider": {
            "@type": "MortgageBroker",
            "name": "Kraft Mortgages",
            "telephone": "604-593-1550",
            "address": { "@type": "PostalAddress", "streetAddress": "#301 - 1688 152nd Street", "addressLocality": "Surrey", "addressRegion": "BC", "postalCode": "V4A 4N2", "addressCountry": "CA" }
          }
        })}} />

        <ComplianceBanner feature="LEAD_FORM" />
        <RelatedCalculators current="a-vs-equity" related={["self-employed-a-vs-b","b-vs-equity","refinance-vs-heloc-vs-second"]} />
      </main>
    </>
  );
}
