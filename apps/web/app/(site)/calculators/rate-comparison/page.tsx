"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ChevronDown, ChevronUp, BarChart3, TrendingDown,
  ArrowRight, Percent, Info, AlertTriangle, Shield
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

const faqs = [
  {
    q: "How much does a 0.25% rate difference really save?",
    a: "On a $500,000 mortgage with 25-year amortization, dropping from 5.25% to 5.00% saves about $67/month and roughly $20,000 in interest over the amortization. Over a 5-year term, you save about $4,800 in interest. Small rate differences compound into significant savings over time."
  },
  {
    q: "Should I choose a fixed or variable rate?",
    a: "Fixed rates provide payment certainty — your mortgage payment stays the same for the entire term. Variable rates fluctuate with the Bank of Canada&apos;s policy rate. When rate spreads between fixed and variable are narrow (under 0.5%), fixed is often preferred. When the spread is wider, variable can save money if rates stay stable or decrease. Consider your risk tolerance and ability to handle payment increases."
  },
  {
    q: "When is the best time to lock in a rate?",
    a: "Most lenders offer rate holds of 90-120 days. If you find a competitive rate and are closing within that window, locking in protects you from rate increases. However, if rates are trending downward and you have time, a hold-and-watch strategy may work. Your mortgage broker can advise on market timing based on current conditions."
  },
  {
    q: "Why do different lenders offer different rates for the same term?",
    a: "Lenders price based on their cost of funds, risk appetite, and competitive positioning. Some lenders offer promotional rates for certain products (e.g., insured vs. insurable vs. conventional). Monoline lenders often beat bank rates, while big banks offer relationship perks. A mortgage broker has access to 30+ lenders and can find the best rate for your specific situation."
  },
  {
    q: "Can I negotiate my mortgage rate?",
    a: "Absolutely. The posted rate is almost never the best rate available. Having competing offers, a strong credit score (680+), and a reasonable loan-to-value ratio gives you leverage. Mortgage brokers negotiate on your behalf across multiple lenders, often securing rates 0.3-0.7% below bank posted rates."
  }
];

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function RateComparisonPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [amortization, setAmortization] = useState(25);
  const [term, setTerm] = useState(5);
  const [rate1, setRate1] = useState(4.79);
  const [rate2, setRate2] = useState(4.99);
  const [rate3, setRate3] = useState(5.29);
  const [rate4, setRate4] = useState(5.49);
  const [showRate3, setShowRate3] = useState(false);
  const [showRate4, setShowRate4] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rates = useMemo(() => {
    const all = [
      { label: "Rate 1", rate: rate1, color: "from-gold-400 to-amber-500" },
      { label: "Rate 2", rate: rate2, color: "from-blue-400 to-cyan-500" },
    ];
    if (showRate3) all.push({ label: "Rate 3", rate: rate3, color: "from-green-400 to-emerald-500" });
    if (showRate4) all.push({ label: "Rate 4", rate: rate4, color: "from-purple-400 to-violet-500" });

    return all.map(r => {
      const mp = monthlyPayment(loanAmount, r.rate, amortization);
      const totalPaidAmort = mp * amortization * 12;
      const totalInterestAmort = totalPaidAmort - loanAmount;
      const totalPaidTerm = mp * term * 12;
      const totalInterestTerm = totalPaidTerm - loanAmount;
      return { ...r, monthly: mp, totalInterestTerm, totalInterestAmort, totalPaidTerm, totalPaidAmort };
    });
  }, [loanAmount, amortization, term, rate1, rate2, rate3, rate4, showRate3, showRate4]);

  const lowestMonthly = Math.min(...rates.map(r => r.monthly));
  const highestMonthly = Math.max(...rates.map(r => r.monthly));
  const maxInterestTerm = Math.max(...rates.map(r => r.totalInterestTerm));
  const monthlySavings = highestMonthly - lowestMonthly;

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
              <span className="text-gold-400">Rate Comparison Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Percent className="w-4 h-4" />
                Compare Up to 4 Rates
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Mortgage Rate</span> Comparison
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See exactly how different mortgage rates impact your payments and total interest. Even 0.25% matters.
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
                    <ValidatedInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} validation={{ min: 50000, max: 3000000 }} type="currency" />
                    <ValidatedSlider label={`Amortization (${amortization} years)`} value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                    <ValidatedSlider label={`Term (${term} years)`} value={term} onChange={setTerm} min={1} max={10} step={1} formatValue={(v) => `${v} years`} />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-gold-400" />
                    Rate Inputs
                  </h2>
                  <div className="space-y-5">
                    <ValidatedSlider label={`Rate 1 (${rate1}%)`} value={rate1} onChange={setRate1} min={1} max={12} step={0.01} formatValue={(v) => `${v}%`} />
                    <ValidatedSlider label={`Rate 2 (${rate2}%)`} value={rate2} onChange={setRate2} min={1} max={12} step={0.01} formatValue={(v) => `${v}%`} />
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowRate3(!showRate3)} className={`w-12 h-6 rounded-full transition-all ${showRate3 ? "bg-gold-500" : "bg-gray-600"} relative`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${showRate3 ? "left-6" : "left-0.5"}`} />
                      </button>
                      <span className="text-sm text-gray-300">Rate 3</span>
                    </div>
                    {showRate3 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <ValidatedSlider label={`Rate 3 (${rate3}%)`} value={rate3} onChange={setRate3} min={1} max={12} step={0.01} formatValue={(v) => `${v}%`} />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowRate4(!showRate4)} className={`w-12 h-6 rounded-full transition-all ${showRate4 ? "bg-gold-500" : "bg-gray-600"} relative`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${showRate4 ? "left-6" : "left-0.5"}`} />
                      </button>
                      <span className="text-sm text-gray-300">Rate 4</span>
                    </div>
                    {showRate4 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <ValidatedSlider label={`Rate 4 (${rate4}%)`} value={rate4} onChange={setRate4} min={1} max={12} step={0.01} formatValue={(v) => `${v}%`} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Savings highlight */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Monthly Savings (Best vs Worst Rate)</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">{formatCurrency(monthlySavings, 0)}<span className="text-xl">/mo</span></p>
                  <p className="text-sm text-gray-300">Over your {term}-year term, that&apos;s {formatCurrency(monthlySavings * term * 12, 0)} in payment savings</p>
                </div>

                {/* Rate cards */}
                <div className="space-y-4">
                  {rates.map((r, i) => {
                    const isLowest = r.monthly === lowestMonthly;
                    return (
                      <div key={i} className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border ${isLowest ? "border-green-500/50" : "border-white/20"}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${r.color}`} />
                            <span className="font-semibold text-gray-200">{r.label}</span>
                            <span className="text-xl font-bold text-gray-100">{r.rate}%</span>
                            {isLowest && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">LOWEST</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Monthly Payment</p>
                            <p className="text-lg font-bold text-gray-100">{formatCurrency(r.monthly, 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Interest ({term}-yr term)</p>
                            <p className="text-lg font-bold text-gray-100">{formatCurrency(r.totalInterestTerm, 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Interest (full amortization)</p>
                            <p className="text-lg font-bold text-gray-100">{formatCurrency(r.totalInterestAmort, 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">vs. lowest rate</p>
                            <p className={`text-lg font-bold ${isLowest ? "text-green-400" : "text-amber-400"}`}>
                              {isLowest ? "Best" : `+${formatCurrency(r.monthly - lowestMonthly, 0)}/mo`}
                            </p>
                          </div>
                        </div>
                        {/* Visual bar */}
                        <div className="mt-4">
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(r.monthly / highestMonthly) * 100}%` }}
                              transition={{ duration: 0.8, delay: i * 0.15 }}
                              className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Your Best Rate
                  </Link>
                  <Link href="/calculators/payment" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Payment Calculator
                  </Link>
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
                <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding Rate Comparison</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Rates shown are for comparison only — actual rates depend on credit score, down payment, property type, and lender.</p>
                    <p>• Total interest over amortization assumes you renew at the same rate for each term (unlikely in practice).</p>
                    <p>• Payment difference calculations are approximate and don&apos;t account for prepayment privileges.</p>
                    <p>• Variable rate payments would change if the prime rate adjusts during the term.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">How Mortgage Rate Differences Impact Your Finances</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                When shopping for a mortgage, most Canadians focus on the monthly payment difference between rates. But the real impact of even small rate differences extends far beyond your monthly budget. A 0.25% difference on a $500,000 mortgage might save you $67 per month — but over a 25-year amortization, that&apos;s over $20,000 in interest savings. Understanding these numbers is critical to making an informed mortgage decision.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Why Even 0.25% Matters Thousands</h3>
              <p>
                Let&apos;s break down the math. On a $500,000 mortgage at 5.00% over 25 years, your monthly payment is approximately $2,908 and total interest is $372,400. Bump the rate to 5.25%, and you&apos;re paying $2,975/month with $392,500 in total interest. That 0.25% difference costs you an extra $67/month and $20,100 over the life of the mortgage. On a $750,000 mortgage, the same 0.25% costs over $30,000 in additional interest. This is why rate shopping matters — and why working with a broker who has access to 30+ lenders can save you thousands.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Fixed vs Variable Rate Considerations</h3>
              <p>
                Fixed-rate mortgages provide payment certainty. Your principal and interest payment stays the same for the entire term, making budgeting straightforward. Variable-rate mortgages fluctuate with the Bank of Canada&apos;s policy rate — when rates drop, your payment may decrease (or more goes to principal); when rates rise, your payment increases.
              </p>
              <p>
                Historically, variable rates have outperformed fixed rates over the long term in Canada. However, in a rising rate environment, the risk of payment shock is real. Consider your comfort level with potential increases. If a 1-2% rate rise would strain your budget, a fixed rate provides peace of mind.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When to Lock In Your Rate</h3>
              <p>
                Most lenders offer rate holds of 90-120 days at no cost. If you&apos;ve found a property or are close to closing, locking in a competitive rate protects you from market increases. In a rising rate environment, early rate locks can save thousands. In a falling rate environment, you might want to wait — but timing the market is risky. Your mortgage broker can provide guidance on current rate trends and recommend the optimal timing for your situation.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Tips for Getting Your Best Rate</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Use a mortgage broker</strong> — they have access to 30+ lenders and can find rates you won&apos;t find on your own.</li>
                <li><strong>Improve your credit score</strong> — borrowers with 680+ scores qualify for the best rates. Check your credit report before applying.</li>
                <li><strong>Increase your down payment</strong> — 20% or more eliminates CMHC insurance and can unlock better rates.</li>
                <li><strong>Compare at least 3-4 lenders</strong> — this calculator helps you see the impact of different rates on your specific loan.</li>
                <li><strong>Don&apos;t fixate only on rate</strong> — consider prepayment privileges, portability, and penalty structures when comparing lenders.</li>
                <li><strong>Get pre-approved</strong> — a pre-approval locks your rate for 90-120 days while you shop for a home.</li>
              </ul>

              <div className="mt-8">
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/mortgage-penalty" className="text-gold-400 hover:text-gold-300 underline">Mortgage Penalty Calculator</Link>
                {" · "}
                <Link href="/calculators/renewal" className="text-gold-400 hover:text-gold-300 underline">Renewal Calculator</Link>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">
                      {faq.a}
                    </motion.div>
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
