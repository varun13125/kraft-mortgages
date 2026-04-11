"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, HelpCircle, ChevronDown, ChevronUp, Info,
  Table, BarChart3
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
}

function buildSchedule(mortgage: number, rate: number, amortMonths: number, extraMonthly: number): ScheduleRow[] {
  const r = rate / 100 / 12;
  const basePayment = r > 0 ? (mortgage * r * Math.pow(1 + r, amortMonths)) / (Math.pow(1 + r, amortMonths) - 1) : mortgage / amortMonths;
  const rows: ScheduleRow[] = [];
  let balance = mortgage;
  let cumInt = 0;

  for (let m = 1; m <= amortMonths && balance > 0; m++) {
    const int = balance * r;
    const totalPay = Math.min(basePayment + extraMonthly, balance + int);
    const prin = totalPay - int;
    balance = Math.max(balance - prin, 0);
    cumInt += int;
    rows.push({ month: m, payment: totalPay, principal: prin, interest: int, balance, cumulativeInterest: cumInt });
  }
  return rows;
}

const faqs = [
  {
    q: "What does amortization mean?",
    a: "Amortization is the total length of time it takes to pay off your mortgage completely. In Canada, the maximum amortization for insured mortgages (less than 20% down) is 25 years. Uninsured mortgages (20%+ down) can go up to 30 years. The amortization determines your monthly payment — shorter amortization means higher payments but less total interest."
  },
  {
    q: "Should I choose a 25-year or 30-year amortization?",
    a: "A 25-year amortization saves significant interest — roughly $50,000 to $80,000 on a $500,000 mortgage at 5% compared to 30 years. However, the monthly payment is higher (about $300-$400 more). If you can comfortably afford the 25-year payment, it is the better financial choice. If cash flow is tight, start with 30 and make extra payments."
  },
  {
    q: "Can I change my amortization after getting my mortgage?",
    a: "You cannot extend your amortization when switching lenders at renewal (OSFI rules). However, you can shorten it by increasing your payment, making lump sum prepayments, or choosing a shorter amortization at renewal. Some lenders also allow you to adjust your payment frequency (bi-weekly accelerated) which effectively shortens the amortization."
  },
  {
    q: "What is the difference between amortization and mortgage term?",
    a: "Amortization is the total time to pay off the mortgage (25-30 years). Your term is the length of your current rate contract (typically 1-5 years). At the end of each term, you renew at a new rate but continue paying down the remaining amortization. This is why you may renew your mortgage 5-6 times over its life."
  },
  {
    q: "Why do I pay so much interest in the first years?",
    a: "In the early years, your balance is highest, so interest charges are highest. With a 5% rate on $500,000, your first month's interest is over $2,000. As you pay down principal, the interest portion shrinks and the principal portion grows — this is the amortization curve. By year 20 of a 25-year mortgage, the majority of your payment goes to principal."
  }
];

export default function AmortizationPage() {
  const [mortgage, setMortgage] = useState(500000);
  const [rate, setRate] = useState(5.0);
  const [amortYears, setAmortYears] = useState(25);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schedule = useMemo(() => buildSchedule(mortgage, rate, amortYears * 12, extraMonthly), [mortgage, rate, amortYears, extraMonthly]);

  const totalPaid = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const actualMonths = schedule.length;

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
              <span className="text-gold-400">Amortization Calculator</span>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Table className="w-4 h-4" />
                Full Schedule
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Amortization</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">See every payment broken down into principal and interest.</p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Inputs - narrow */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-2 space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><Calculator className="w-6 h-6 text-gold-400" /> Mortgage Details</h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Mortgage Amount" value={mortgage} onChange={setMortgage} validation={{ min: 50000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Interest Rate" value={rate} onChange={setRate} validation={{ min: 0.5, max: 15 }} type="percentage" />
                    <ValidatedSlider label={`Amortization (${amortYears} years)`} value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} formatValue={(v) => `${v} years`} />
                    <ValidatedInput label="Extra Monthly Payment (optional)" value={extraMonthly} onChange={setExtraMonthly} validation={{ min: 0, max: 5000 }} type="currency" />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/30">
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-gold-400" /> Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly Payment</span>
                      <span className="font-semibold text-gray-200">{formatCurrency(schedule[0]?.payment || 0, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Interest</span>
                      <span className="font-semibold text-gold-400">{formatCurrency(totalInterest, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Cost</span>
                      <span className="font-semibold text-gray-200">{formatCurrency(totalPaid, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payoff Time</span>
                      <span className="font-semibold text-gray-200">{Math.floor(actualMonths / 12)}y {actualMonths % 12}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Interest as % of Principal</span>
                      <span className="font-semibold text-gold-400">{((totalInterest / mortgage) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Get Pre-Approved</a>
                  <a href="tel:604-593-1550" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Call 604-593-1550</a>
                </div>
              </motion.div>

              {/* Schedule Table - wider */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-h-[700px] overflow-y-auto">
                  <h4 className="font-semibold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-gold-400" /> Amortization Schedule</h4>
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-900/95">
                      <tr className="text-gray-400 text-xs">
                        <th className="text-left pb-2">Month</th>
                        <th className="text-right pb-2">Payment</th>
                        <th className="text-right pb-2">Principal</th>
                        <th className="text-right pb-2">Interest</th>
                        <th className="text-right pb-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.slice(0, showAll ? undefined : 60).map((row) => (
                        <tr key={row.month} className="border-t border-white/5">
                          <td className="py-1.5 text-gray-400">{row.month}</td>
                          <td className="py-1.5 text-right text-gray-300">{formatCurrency(row.payment, 0)}</td>
                          <td className="py-1.5 text-right text-green-400">{formatCurrency(row.principal, 0)}</td>
                          <td className="py-1.5 text-right text-red-400">{formatCurrency(row.interest, 0)}</td>
                          <td className="py-1.5 text-right text-gray-300">{formatCurrency(row.balance, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!showAll && schedule.length > 60 && (
                    <button onClick={() => setShowAll(true)} className="w-full mt-4 py-2 text-sm text-gold-400 hover:text-gold-300 border border-gold-500/30 rounded-lg">
                      Show all {schedule.length} payments
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Understanding Mortgage Amortization</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>Amortization is the process of gradually paying off your mortgage over time through regular payments. Each payment is split between interest (the cost of borrowing) and principal (reducing your loan balance). In the early years, most of your payment goes to interest. As the balance shrinks, more of each payment goes to principal — this shift is called the amortization curve.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">25-Year vs 30-Year Amortization</h3>
              <p>The amortization length has a massive impact on your total cost. On a $500,000 mortgage at 5%, a 25-year amortization results in a monthly payment of approximately $2,910 and total interest of about $373,000. Stretching to 30 years drops the payment to about $2,668 but increases total interest to roughly $460,000 — that is $87,000 more in interest for the convenience of lower monthly payments. If you can afford the 25-year payment, it almost always makes financial sense.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Impact of Shorter Amortization</h3>
              <p>Going shorter than 25 years — say 20 or 15 years — amplifies savings further but requires significantly higher payments. A 20-year amortization on $500,000 at 5% means payments around $3,280 and total interest of about $287,000, saving roughly $86,000 versus 25 years. A 15-year amortization pushes payments to about $3,940 but total interest drops to approximately $209,000. The trade-off is always monthly cash flow versus long-term savings.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Choose Your Amortization</h3>
              <p>Start with the longest amortization that qualifies you, then use prepayment privileges to pay it down faster. This gives you the safety net of a lower required payment while still benefitting from aggressive repayment when your budget allows. For insured mortgages, 25 years is the maximum, so this decision is already made for most first-time buyers. If you have 20% or more down, the 30-year option gives flexibility — but always run the numbers to see the true cost of that extra 5 years.</p>

              <div className="mt-8">
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/extra-payments" className="text-gold-400 hover:text-gold-300 underline">Extra Payment Savings Calculator</Link>
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
