"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ArrowRight, Info, HelpCircle, ChevronDown, ChevronUp,
  Building2, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock,
  DollarSign, FileText, BarChart3, Scale, Shield
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

type Province = "BC" | "AB" | "ON";
type LoanPosition = "1st" | "2nd";

const defaultTaxRates: Record<Province, number> = { BC: 20.5, AB: 30, ON: 43.4 };

function monthlyPayment(principal: number, annualRate: number, amortMonths: number): number {
  if (annualRate === 0) return principal / amortMonths;
  const r = annualRate / 100 / 12;
  return principal * (r * Math.pow(1 + r, amortMonths)) / (Math.pow(1 + r, amortMonths) - 1);
}

function totalInterest(principal: number, annualRate: number, amortMonths: number, termMonths: number): number {
  const mp = monthlyPayment(principal, annualRate, amortMonths);
  let balance = principal;
  let paid = 0;
  for (let i = 0; i < termMonths; i++) {
    const interest = balance * (annualRate / 100 / 12);
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
    a: "Most equity lenders lend up to 65-75% of the property value for first mortgages, and up to 85% combined LTV for second mortgages. Lower LTV means lower rates — for example, Antrim Investments offers 7.49% at 50-65% LTV vs 7.95% at 70-75% LTV. Having more equity in the property translates to better terms."
  },
  {
    q: "Why would I choose equity lending over an A-lender?",
    a: "Equity lending can be cheaper on an all-in basis when you factor in the personal income tax you'd owe on the extra declared income needed to qualify with an A-lender. It also offers faster closing (3-7 days vs 2-4 weeks), no income verification requirements, and more flexible qualification criteria. For self-employed borrowers, real estate investors, or time-sensitive purchases, equity lending often makes mathematical sense."
  }
];

export default function AVsEquityPage() {
  const [mortgageAmount, setMortgageAmount] = useState(600000);
  const [propertyValue, setPropertyValue] = useState(800000);
  const [loanPosition, setLoanPosition] = useState<LoanPosition>("1st");
  const [term, setTerm] = useState(2);
  const [amortization, setAmortization] = useState(25);
  const [aRate, setARate] = useState(4.49);
  const [eqRate, setEqRate] = useState(7.95);
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
  const investmentTaxSaving = isInvestment ? eqInterest * (marginalRate / 100) : 0;
  const aTotalAllIn = aInterest + additionalTax;
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
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Mortgage Amount Needed" value={mortgageAmount} onChange={setMortgageAmount} validation={{ min: 50000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Property Value" value={propertyValue} onChange={setPropertyValue} validation={{ min: 100000, max: 10000000 }} type="currency" />
                    <p className="text-xs text-gray-500">LTV: {ltv.toFixed(1)}% — {ltv <= 75 ? "✓ Within equity lending range" : "⚠ May require 2nd mortgage or additional equity"}</p>

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
                        <ValidatedInput label="A-Lender Rate (%)" value={aRate} onChange={setARate} validation={{ min: 1, max: 15 }} type="percentage" suffix="%" />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Equity Lender Settings
                      </h3>
                      <div className="space-y-4">
                        <ValidatedInput label="Equity Lender Rate (%)" value={eqRate} onChange={setEqRate} validation={{ min: 1, max: 20 }} type="percentage" suffix="%" />
                        <ValidatedInput label="Equity Lender Fee (%)" value={eqFee} onChange={setEqFee} validation={{ min: 0, max: 5 }} type="percentage" suffix="%" />
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
                        <ValidatedInput label="Your Marginal Tax Rate (%)" value={marginalRate} onChange={setMarginalRate} validation={{ min: 0, max: 55 }} type="percentage" suffix="%" />
                        <p className="text-xs text-gray-500">This is the extra income you&apos;d need to declare on your T1 to qualify with an A-lender.</p>
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
                      <span className="font-medium text-gray-100">+{formatCurrency(eqInterest - aInterest, 0)} (equity costs more)</span>
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
                        <span className="text-gray-300">Investment interest deduction</span>
                        <span className="font-medium text-green-400">-{formatCurrency(investmentTaxSaving, 0)}</span>
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
                      ? `Equity lending saves you ${formatCurrency(Math.abs(additionalTax), 0)} in personal income tax over ${term} years, which more than offsets the ${formatCurrency(eqInterest - aInterest, 0)} additional interest and ${formatCurrency(eqFeeAmount, 0)} lender fee. Net savings: ${formatCurrency(netDifference, 0)}.`
                      : `The A-lender path costs ${formatCurrency(aInterest, 0)} in interest but you avoid the ${formatCurrency(eqInterest - aInterest, 0)} additional interest cost. However, you'll owe ${formatCurrency(additionalTax, 0)} in income tax on declared income. Net difference: ${formatCurrency(netDifference, 0)}.`
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
                    <p>• Rates shown are based on current lender data from our database — actual rates vary by application.</p>
                    <p>• Tax calculations are estimates. Consult a CPA for your specific tax situation.</p>
                    <p>• Equity lender fees (lender/broker fees) may be partially or fully financed into the mortgage.</p>
                    <p>• Investment property interest deductibility depends on your specific situation — verify with your accountant.</p>
                    <p>• VWR Capital charges flat fees ($750-$5,750) rather than percentage-based fees — not reflected in the percentage input above.</p>
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
                The Canadian mortgage market has three tiers. A-lenders (banks, credit unions, monoline lenders like Marathon Mortgage and Neo Financial) offer the lowest rates — currently 3.74% to 5.99% — but require full income verification, strong credit scores (typically 680+), and standard qualification criteria including GDS/TDS ratios. B-lenders sit in the middle, offering slightly higher rates with more flexible qualification, but still generally require some form of income verification.
              </p>
              <p>
                Equity lenders operate on an entirely different model. They assess the property value, the loan amount relative to that value, and the exit strategy. Income verification is typically not required at all. Current equity lending rates range from approximately 5.99% to 9.99% depending on the lender, LTV, and province. Lender fees typically range from 1% to 3% of the loan amount, though some lenders like VWR Capital charge flat administrative fees ($750 to $5,750) rather than percentage-based fees — a significant cost advantage on larger mortgages.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Hidden Tax Cost of Qualifying with an A-Lender</h3>
              <p>
                Here&apos;s the insight most self-employed borrowers miss: qualifying with an A-lender may require declaring significantly more personal income on your tax returns. If your business nets $120,000 but you currently declare $60,000 after legitimate deductions, an A-lender might require you to declare $140,000 or more to qualify for the mortgage you need. That extra $80,000 of declared income isn&apos;t free — it comes with a real tax cost.
              </p>
              <p>
                In British Columbia, an additional $80,000 of declared income at a marginal rate of approximately 20.5% costs you $16,400 per year in personal income tax. Over a 2-year term, that&apos;s $32,800 in additional taxes. Over a 5-year term, it&apos;s $82,000. This tax cost must be factored into any comparison between A-lender and equity lending rates. When you see an A-lender at 4.49% vs an equity lender at 7.95%, the rate difference seems enormous — but the tax math often tells a different story.
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
                Consider a self-employed contractor purchasing an $800,000 property in Surrey, BC. They need a $600,000 mortgage and would need to declare an additional $80,000/year in income to qualify with an A-lender at 4.49%. Their BC marginal rate is approximately 20.5%.
              </p>
              <p>
                <strong>A-Lender Path:</strong> $600,000 at 4.49% over a 2-year term with 25-year amortization costs approximately $52,700 in interest. The additional income tax on $80,000 × 20.5% × 2 years = $32,800. Total all-in cost: approximately $85,500.
              </p>
              <p>
                <strong>Equity Lender Path (Antrim-style):</strong> $600,000 at 7.95% with a 1% fee ($6,000) over the same 2-year term costs approximately $94,400 in interest. Total all-in cost: approximately $100,400. In this scenario, the A-lender saves roughly $14,900 — but the self-employed borrower avoids declaring additional income and closes in days instead of weeks.
              </p>
              <p>
                Now consider the same borrower in Ontario with a 43.4% marginal rate: the tax on $80,000 × 43.4% × 2 years = $69,440. A-lender total: $122,140. Equity lender total: $100,400. In Ontario, equity lending saves approximately $21,740 over the 2-year term despite the much higher interest rate. This is the power of factoring in the full picture.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Equity Lending for Investment Properties: Interest Is Tax-Deductible</h3>
              <p>
                If the property is an investment (rental property or flip), the interest paid on an equity lender mortgage is generally tax-deductible as a business expense. This partially offsets the higher rate. At a 43.4% marginal rate in Ontario, the $94,400 in interest from the equity lender generates approximately $41,000 in tax savings — dramatically changing the comparison. Toggle the &quot;Investment Property&quot; option in the calculator above to see this impact.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Transition from Equity to A-Lender Later</h3>
              <p>
                Equity lending is often a strategic short-term solution. Here&apos;s a common transition path: (1) Use equity lending to close your purchase quickly, often within 3-7 business days. (2) Over the next 1-2 years, gradually declare more income on your tax returns, establish a consistent income pattern, and maintain your credit score. (3) When your equity lender term matures, refinance to an A-lender at a lower rate using your now-documented income. This strategy works especially well for self-employed borrowers whose businesses are growing and whose income trajectory is upward.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Top Equity Lenders in Canada: Antrim, VWR Capital, First Circle</h3>
              <p>
                <strong>Antrim Investments:</strong> One of Canada&apos;s most established equity lenders. First mortgage rates from 7.49% at lower LTVs (50-65%), 7.95% at 70-75% LTV. Standard 1% lender fee. No income verification required — qualification is based entirely on property equity and a professional appraisal. Available across Canada.
              </p>
              <p>
                <strong>VWR Capital:</strong> A unique player in the equity lending space because they charge flat administrative fees ($750 to $5,750 depending on province and LTV) rather than percentage-based fees. This can save borrowers thousands on larger mortgages. Rates are province and LTV-dependent.
              </p>
              <p>
                <strong>First Circle Financial:</strong> Offers competitive equity lending with a 1% fee on first mortgages and 1.5-2% on second mortgages. Flexible qualification criteria and reasonable turnaround times.
              </p>
              <p>
                <strong>Sequence Capital:</strong> Rates from 5.99% to 7.75% with a 1% lender fee — often among the lower-cost equity options. <strong>Secure Capital MIC:</strong> Rates from 6.99% to 9.99% with 2-3% fees. <strong>LCM Capital:</strong> First mortgages from 7.45% with a 1% fee.
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
          },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
        })}} />

        <ComplianceBanner feature="LEAD_FORM" />
      </main>
    </>
  );
}
