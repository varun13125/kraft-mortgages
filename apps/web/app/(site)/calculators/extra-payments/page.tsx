"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ArrowRight, HelpCircle, ChevronDown, ChevronUp,
  Info, TrendingDown, Clock, PiggyBank, Zap
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

/* ── Amortization helpers ───────────────────────────── */
interface YearRow {
  year: number;
  originalBalance: number;
  acceleratedBalance: number;
  originalInterest: number;
  acceleratedInterest: number;
}

function buildComparison(mortgage: number, rate: number, amortYears: number, extraMonthly: number, lumpSum: number, startYear: number): { originalTotalInterest: number; acceleratedTotalInterest: number; interestSaved: number; originalPayoffMonths: number; acceleratedPayoffMonths: number; table: YearRow[] } {
  const r = rate / 100 / 12;
  const n = amortYears * 12;
  const basePayment = r > 0 ? (mortgage * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : mortgage / n;

  // Original schedule
  let balO = mortgage;
  let intO = 0;
  // Accelerated schedule
  let balA = mortgage;
  let intA = 0;

  const table: YearRow[] = [];

  for (let yr = 1; yr <= amortYears; yr++) {
    let yearIntO = 0, yearIntA = 0;
    for (let m = 0; m < 12; m++) {
      // Original
      if (balO > 0) {
        const ip = balO * r;
        yearIntO += ip;
        intO += ip;
        const pp = Math.min(basePayment - ip, balO);
        balO -= pp;
      }
      // Accelerated
      if (balA > 0) {
        const ip = balA * r;
        yearIntA += ip;
        intA += ip;
        const extra = (yr >= startYear) ? extraMonthly : 0;
        const lump = (yr === startYear) ? lumpSum : 0;
        const totalPay = basePayment + extra + lump;
        const pp = Math.min(totalPay - ip, balA);
        balA -= pp;
        if (balA < 0) balA = 0;
      }
    }
    table.push({ year: yr, originalBalance: Math.max(balO, 0), acceleratedBalance: Math.max(balA, 0), originalInterest: yearIntO, acceleratedInterest: yearIntA });
    if (balO <= 0 && balA <= 0) break;
  }

  // Find payoff months (approximate)
  let payoffO = amortYears * 12, payoffA = amortYears * 12;
  let bO = mortgage, bA = mortgage;
  for (let m = 1; m <= amortYears * 12; m++) {
    if (bO > 0) {
      const pp = Math.min(basePayment - bO * r, bO);
      bO -= pp;
      if (bO <= 0) { payoffO = m; }
    }
    if (bA > 0) {
      const yr = Math.ceil(m / 12);
      const extra = (yr >= startYear) ? extraMonthly : 0;
      const lump = (yr === startYear && m === (startYear - 1) * 12 + 1) ? lumpSum : 0;
      const pp = Math.min(basePayment + extra + lump - bA * r, bA);
      bA -= pp;
      if (bA <= 0) { payoffA = m; }
    }
  }

  return { originalTotalInterest: intO, acceleratedTotalInterest: intA, interestSaved: intO - intA, originalPayoffMonths: payoffO, acceleratedPayoffMonths: payoffA, table };
}

const faqs = [
  {
    q: "What are prepayment privileges?",
    a: "Most Canadian mortgages allow you to make extra payments without penalty, up to a limit. Typical privileges include 15% to 20% of the original mortgage amount per year in lump sum payments, plus a payment increase of 15% to 100% of your regular payment. Check your mortgage contract for your specific limits."
  },
  {
    q: "Is it better to increase monthly payments or make lump sums?",
    a: "Monthly increases are automated and reduce principal every month, compounding savings over time. Lump sums offer flexibility — you pay when you have extra cash (bonuses, tax refunds). The math usually favours starting early with monthly increases, but the best strategy is whatever you can sustain consistently."
  },
  {
    q: "Do extra payments on a variable-rate mortgage work the same way?",
    a: "Yes. Extra payments reduce your principal balance regardless of whether you have a fixed or variable rate. However, some variable-rate products have more generous prepayment terms. Always check your specific mortgage contract before making large prepayments."
  },
  {
    q: "Can I get my extra payments back if I need them?",
    a: "No — mortgage prepayments are permanent. Once applied to your principal, that money is gone. Some lenders offer a \"re-advance\" feature on HELOCs or readvanceable mortgages, where you can borrow back against the equity you have built, but this is a new loan, not a refund."
  },
  {
    q: "How much interest do extra payments really save?",
    a: "The savings are significant. On a $500,000 mortgage at 5% over 25 years, an extra $200/month saves roughly $55,000 in interest and 4 years off your amortization. The earlier you start, the more you save — extra payments in year 1 save more than the same amount in year 15 because of how interest compounds."
  }
];

export default function ExtraPaymentsPage() {
  const [mortgage, setMortgage] = useState(500000);
  const [rate, setRate] = useState(5.0);
  const [amortYears, setAmortYears] = useState(25);
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [lumpSum, setLumpSum] = useState(5000);
  const [startYear, setStartYear] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const results = useMemo(() => buildComparison(mortgage, rate, amortYears, extraMonthly, lumpSum, startYear), [mortgage, rate, amortYears, extraMonthly, lumpSum, startYear]);

  const timeSavedMonths = results.originalPayoffMonths - results.acceleratedPayoffMonths;
  const timeSavedYears = Math.floor(timeSavedMonths / 12);
  const timeSavedRemMonths = timeSavedMonths % 12;

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Extra Payment Savings Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <PiggyBank className="w-4 h-4" />
                Interest Savings
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Extra Payment</span> Savings Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">See how much interest you can save and years you can knock off your mortgage.</p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Mortgage Details
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Mortgage Amount" value={mortgage} onChange={setMortgage} validation={{ min: 50000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Interest Rate" value={rate} onChange={setRate} validation={{ min: 0.5, max: 15 }} type="percent" />
                    <ValidatedSlider label={`Amortization (${amortYears} years)`} value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} formatValue={(v) => `${v} years`} />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-gold-400" />
                    Extra Payments
                  </h2>
                  <div className="space-y-6">
                    <ValidatedInput label="Extra Monthly Payment" value={extraMonthly} onChange={setExtraMonthly} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Annual Lump Sum" value={lumpSum} onChange={setLumpSum} validation={{ min: 0, max: 200000 }} type="currency" />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Extra Payments in Year</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 5, 10].map((y) => (
                          <button key={y} onClick={() => setStartYear(y)} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${startYear === y ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>Year {y}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Interest Saved</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">{formatCurrency(results.interestSaved, 0)}</p>
                  <p className="text-sm text-gray-300">{formatCurrency(results.originalTotalInterest, 0)} → {formatCurrency(results.acceleratedTotalInterest, 0)} total interest</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-gold-400" /> Time Saved</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Original Payoff</span>
                      <span className="font-semibold text-gray-200 text-xl">{results.originalPayoffMonths} months</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">New Payoff</span>
                      <span className="font-semibold text-green-400 text-xl">{results.acceleratedPayoffMonths} months</span>
                    </div>
                    <div className="col-span-2 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <span className="text-green-300 block text-xs">Time Off Mortgage</span>
                      <span className="font-bold text-green-400 text-2xl">{timeSavedYears > 0 ? `${timeSavedYears} year${timeSavedYears > 1 ? "s" : ""}` : ""}{timeSavedYears > 0 && timeSavedRemMonths > 0 ? " " : ""}{timeSavedRemMonths > 0 ? `${timeSavedRemMonths} month${timeSavedRemMonths > 1 ? "s" : ""}` : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 max-h-80 overflow-y-auto">
                  <h4 className="font-semibold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-gold-400" /> Year-by-Year Balance</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs">
                        <th className="text-left pb-2">Year</th>
                        <th className="text-right pb-2">Original Bal.</th>
                        <th className="text-right pb-2">Accelerated Bal.</th>
                        <th className="text-right pb-2">Int. Saved (Yr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.table.map((row) => (
                        <tr key={row.year} className="border-t border-white/5">
                          <td className="py-2 text-gray-300">{row.year}</td>
                          <td className="py-2 text-right text-gray-300">{formatCurrency(row.originalBalance, 0)}</td>
                          <td className="py-2 text-right text-green-400">{formatCurrency(row.acceleratedBalance, 0)}</td>
                          <td className="py-2 text-right text-gold-400">{formatCurrency(row.originalInterest - row.acceleratedInterest, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Talk to a Broker</a>
                  <a href="tel:604-593-1550" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Call 604-593-1550</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">How Extra Mortgage Payments Save You Money</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>Every extra dollar you put toward your mortgage principal directly reduces the amount of interest you pay over the life of the loan. Because mortgage interest compounds on the remaining balance, reducing that balance early has an outsized effect. An extra $200 per month on a $500,000 mortgage at 5% doesn&apos;t just save you $200 times 300 months — it can save you over $55,000 in interest and cut four years off your amortization.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Prepayment Privileges by Lender</h3>
              <p>Most Canadian mortgages allow some form of prepayment without penalty. The standard privilege allows you to increase your regular payment by 15% to 20% per year and make lump sum payments of 10% to 20% of the original mortgage amount annually. Some products, particularly those from monoline lenders, allow up to 100% payment increases. Always check your mortgage contract — exceeding these limits triggers the same penalty as a full refinance.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Lump Sum vs. Monthly Increase Strategy</h3>
              <p>A consistent monthly increase beats occasional lump sums for most borrowers because it attacks the principal every month without requiring discipline or windfalls. However, the two strategies can be combined: increase your monthly payment by what you can afford, then apply annual bonuses or tax refunds as lump sums. The compounding effect is remarkable — even small, consistent extra payments made in the early years of a mortgage generate significantly more savings than larger payments made near the end.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Compounding Power of Early Extra Payments</h3>
              <p>Consider this: on a 25-year mortgage, the first 5 years is where approximately 60% of your payments go toward interest. By making extra payments during these high-interest years, you dramatically reduce the balance on which future interest is calculated. An extra $100/month starting in year 1 is worth more than $200/month starting in year 10. The earlier you start, the more powerful the compounding effect.</p>

              <div className="mt-8">
                <Link href="/calculators/amortization" className="text-gold-400 hover:text-gold-300 underline">Amortization Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/refinance-break-even" className="text-gold-400 hover:text-gold-300 underline">Refinance Break-Even Calculator</Link>
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
