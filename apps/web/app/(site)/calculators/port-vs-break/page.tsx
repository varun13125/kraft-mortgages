"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { payment } from "@/lib/calc/payment";
import { CheckCircle, XCircle, TrendingDown, TrendingUp, Info } from "lucide-react";

// Canadian fixed-rate convention: semi-annual compounding (same as lib/calc/payment.ts)
const monthlyRate = (ratePct: number) => Math.pow(1 + ratePct / 100 / 2, 1 / 6) - 1;

// Interest paid on an amortizing loan across consecutive rate segments (payment re-set at each rate change)
function interestOver(principal: number, segments: { ratePct: number; months: number }[], amortMonths: number): number {
  let balance = principal;
  let interest = 0;
  let elapsed = 0;
  for (const seg of segments) {
    if (seg.months <= 0) continue;
    const remaining = Math.max(1, amortMonths - elapsed);
    const pmt = payment({ principal: balance, annualRatePct: seg.ratePct, amortYears: remaining / 12, paymentsPerYear: 12 });
    const r = monthlyRate(seg.ratePct);
    for (let i = 0; i < seg.months && balance > 0; i++) {
      const it = balance * r;
      interest += it;
      balance = Math.max(0, balance + it - pmt);
    }
    elapsed += seg.months;
  }
  return interest;
}

const HORIZON_MONTHS = 60;

export default function PortVsBreakPage() {
  const [currentBalance, setCurrentBalance] = useState(350000);
  const [currentRate, setCurrentRate] = useState(2.89);
  const [remainingAmortYears, setRemainingAmortYears] = useState(22);
  const [monthsLeftInTerm, setMonthsLeftInTerm] = useState(18);
  const [newRate, setNewRate] = useState(5.19);
  const [newAmortYears, setNewAmortYears] = useState(25);
  const [newHomePrice, setNewHomePrice] = useState(800000);
  const [additionalMortgage, setAdditionalMortgage] = useState(300000);
  const [portFee, setPortFee] = useState(500);
  const [blendRate, setBlendRate] = useState(4.25);
  const [mortgageType, setMortgageType] = useState<"fixed" | "variable">("fixed");

  const safeBalance = Math.max(1, currentBalance);
  const safeAmort = Math.max(1, remainingAmortYears);
  const safeAdditional = Math.max(0, additionalMortgage);
  const totalLoan = safeBalance + safeAdditional;
  const newAmortMonths = newAmortYears * 12;

  // OPTION A: Port with blend-and-increase — one blended rate on the combined balance for the rest of
  // your current term, then renewal at the new rate (assumption) for the remainder of the 5-year window.
  const totalPortMonthly = payment({ principal: totalLoan, annualRatePct: blendRate, amortYears: newAmortYears, paymentsPerYear: 12 });
  // Alternative structure some lenders use: existing portion stays at your rate, new money at today's rate
  const existingPortionPayment = payment({ principal: safeBalance, annualRatePct: currentRate, amortYears: safeAmort, paymentsPerYear: 12 });
  const newMoneyPayment = safeAdditional > 0 ? payment({ principal: safeAdditional, annualRatePct: newRate, amortYears: newAmortYears, paymentsPerYear: 12 }) : 0;
  const twoPartMonthly = existingPortionPayment + newMoneyPayment;
  const weightedRate = (safeBalance * currentRate + safeAdditional * newRate) / totalLoan;
  const blendMonths = Math.min(Math.max(0, monthsLeftInTerm), HORIZON_MONTHS);
  const portInterest5yr = interestOver(totalLoan, [
    { ratePct: blendRate, months: blendMonths },
    { ratePct: newRate, months: HORIZON_MONTHS - blendMonths },
  ], newAmortMonths);
  // 5-year cost = interest paid + fees (principal repaid is not a cost)
  const portTotalCost5yr = portInterest5yr + portFee;

  // OPTION B: Break (pay penalty, get entirely new mortgage)
  // Penalty: variable = 3 months' interest; fixed = greater of 3 months' interest or IRD
  const monthlyInterest = safeBalance * (currentRate / 100) / 12;
  const threeMonthsInterest = monthlyInterest * 3;
  // Simplified IRD: (contract rate − comparison rate) × balance × months left / 12 — only when your rate is HIGHER.
  // Uses the new rate as the comparison rate; big banks using posted rates can charge much more.
  const ird = mortgageType === "fixed" && currentRate > newRate
    ? (currentRate - newRate) / 100 * safeBalance * (Math.max(0, monthsLeftInTerm) / 12)
    : 0;
  const penalty = Math.max(threeMonthsInterest, ird);
  const breakPayment = payment({ principal: totalLoan, annualRatePct: newRate, amortYears: newAmortYears, paymentsPerYear: 12 });
  const breakInterest5yr = interestOver(totalLoan, [{ ratePct: newRate, months: HORIZON_MONTHS }], newAmortMonths);
  const breakTotalCost5yr = breakInterest5yr + penalty;

  const monthlyDiff = totalPortMonthly - breakPayment; // positive = port costs more monthly
  const totalDiff = portTotalCost5yr - breakTotalCost5yr;
  const breakWins = totalDiff > 0; // positive means port costs more → break is cheaper

  return (
    <>
      <CalculatorSchema name="Port vs Break Calculator" description="Should you port your existing mortgage or break it and get a new one? Compare costs including penalties and blended rates." url="/calculators/port-vs-break" />
      <Navigation />
      <main className="min-h-screen bg-slate-950 pb-16">
        {/* Hero */}
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 border border-gold-500/30 mb-5">
              Renewal & Refinance Tool
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-4">
              Port vs <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Break</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Moving or upsizing? Compare the cost of porting your existing mortgage (keeping your rate) vs breaking it for a new one.
            </p>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            {/* INPUTS */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 pb-4">Current Mortgage</h2>
              <ValidatedInput label="Current Mortgage Balance" type="currency" value={currentBalance} onChange={setCurrentBalance} validation={{ min: 1, max: 10000000, message: "Enter your current balance" }} />
              <ValidatedSlider label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} min={0.5} max={10} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
              <ValidatedSlider label="Remaining Amortization" value={remainingAmortYears} onChange={(v) => setRemainingAmortYears(Math.round(v))} min={1} max={30} step={1} formatValue={(v) => Math.round(v) + " years"} />
              <ValidatedSlider label="Months Left in Term" value={monthsLeftInTerm} onChange={(v) => setMonthsLeftInTerm(Math.round(v))} min={1} max={60} step={1} formatValue={(v) => Math.round(v) + " months"} />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Mortgage Type</label>
                <div className="flex gap-2">
                  {(["fixed", "variable"] as const).map((t) => (
                    <button key={t} onClick={() => setMortgageType(t)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all border ${mortgageType === t ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                      {t === "fixed" ? "Fixed Rate" : "Variable Rate"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50 space-y-4">
                <h2 className="text-xl font-semibold text-gray-100">New Mortgage (If Breaking)</h2>
                <ValidatedSlider label="New Interest Rate" value={newRate} onChange={setNewRate} min={0.5} max={10} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
                <ValidatedSlider label="New Amortization" value={newAmortYears} onChange={(v) => setNewAmortYears(Math.round(v))} min={5} max={30} step={1} formatValue={(v) => Math.round(v) + " years"} />
                <ValidatedInput label="Additional Mortgage Needed (Upsize)" type="currency" value={additionalMortgage} onChange={setAdditionalMortgage} validation={{ min: 0, max: 5000000, message: "Additional amount needed for new home" }} />
              </div>

              <div className="pt-4 border-t border-gray-700/50 space-y-4">
                <h2 className="text-xl font-semibold text-gray-100">Port-Specific Costs</h2>
                <ValidatedInput label="Port/Transfer Fee" type="currency" value={portFee} onChange={setPortFee} validation={{ min: 0, max: 5000, message: "Lender's port/transfer fee" }} />
                <ValidatedSlider label="Blended Rate (if porting)" value={blendRate} onChange={setBlendRate} min={0.5} max={10} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
                <p className="text-xs text-gray-500">Use the blended rate your lender quotes. A simple weighted average of your current rate and the new rate is {weightedRate.toFixed(2)}% — lenders often blend using their own rates, so quotes can be higher.</p>
              </div>
            </div>

            {/* RESULTS */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gold-600/20 p-6 lg:sticky lg:top-24 lg:self-start relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                {/* Verdict */}
                <div className={`rounded-xl p-5 mb-6 ${breakWins ? "bg-emerald-950/30 border border-emerald-600/30" : "bg-sky-950/30 border border-sky-600/30"}`}>
                  <div className="flex items-center gap-3">
                    {breakWins ? <TrendingUp className="w-7 h-7 text-emerald-400" /> : <CheckCircle className="w-7 h-7 text-sky-400" />}
                    <div>
                      <div className="text-lg font-bold text-gray-100">
                        {breakWins ? "Breaking saves you money" : "Porting is likely better"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {breakWins
                          ? `Breaking costs $${Math.round(Math.abs(totalDiff)).toLocaleString()} less over 5 years`
                          : `Porting costs $${Math.round(Math.abs(totalDiff)).toLocaleString()} less over 5 years`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side-by-side */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`rounded-lg p-4 border ${!breakWins ? "border-emerald-600/30 bg-emerald-950/20" : "border-gray-700/50 bg-gray-800/40"}`}>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Option A: Port</div>
                    <div className="text-xl font-bold text-gray-100">${Math.round(totalPortMonthly).toLocaleString()}<span className="text-xs text-gray-400">/mo</span></div>
                    <div className="text-xs text-gray-500 mt-1">Blended {blendRate.toFixed(2)}% on ${Math.round(totalLoan).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Split structure: ~${Math.round(twoPartMonthly).toLocaleString()}/mo</div>
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700/30">5-yr interest + fees: ${Math.round(portTotalCost5yr).toLocaleString()}</div>
                  </div>
                  <div className={`rounded-lg p-4 border ${breakWins ? "border-emerald-600/30 bg-emerald-950/20" : "border-gray-700/50 bg-gray-800/40"}`}>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Option B: Break</div>
                    <div className="text-xl font-bold text-gray-100">${Math.round(breakPayment).toLocaleString()}<span className="text-xs text-gray-400">/mo</span></div>
                    <div className="text-xs text-gray-500 mt-1">New rate entirely</div>
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700/30">5-yr interest + penalty: ${Math.round(breakTotalCost5yr).toLocaleString()}</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="rounded-xl border border-gray-700/50 p-4 mb-6">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-3">Penalty to Break</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-300">3 Months&apos; Interest</span><span className="text-gray-100">${Math.round(threeMonthsInterest).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Interest Rate Differential (est.)</span><span className="text-gray-100">{mortgageType === "variable" ? "N/A (variable)" : `$${Math.round(ird).toLocaleString()}`}</span></div>
                    <div className="flex justify-between pt-2 border-t border-gray-700/50 font-semibold"><span className="text-gray-200">Estimated Penalty</span><span className="text-gold-400">${Math.round(penalty).toLocaleString()}</span></div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Fixed-rate lenders usually charge the greater of 3 months&apos; interest or the IRD; variable-rate mortgages usually 3 months&apos; interest. This IRD uses the new rate as the comparison rate — banks using posted rates can charge significantly more. Get a written quote from your lender.</span>
                  </div>
                </div>

                {/* Monthly diff */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/40 mb-6">
                  <span className="text-sm text-gray-300">Monthly Difference</span>
                  <span className={`text-lg font-bold ${monthlyDiff > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {monthlyDiff > 0 ? "+" : ""}${Math.round(Math.abs(monthlyDiff)).toLocaleString()}/mo
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4">Estimates only. Costs compare interest paid over 5 years plus fees/penalty (semi-annual compounding). Assumes the blended rate applies until your current term ends, then renews at the new rate.</p>

                <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all text-center shadow-lg shadow-gold-500/20">
                  Talk to a Broker
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          <RelatedCalculators current="port-vs-break" related={["renewal", "mortgage-penalty", "refinance-break-even", "rate-comparison"]} />
        </div>
      </main>
    </>
  );
}
