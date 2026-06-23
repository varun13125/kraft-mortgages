"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { payment } from "@/lib/calc/payment";
import { TrendingUp, DollarSign, Info } from "lucide-react";

export default function RefinanceCashOutPage() {
  const [homeValue, setHomeValue] = useState(900000);
  const [currentBalance, setCurrentBalance] = useState(280000);
  const [newRate, setNewRate] = useState(5.19);
  const [newAmortYears, setNewAmortYears] = useState(25);
  const [maxLtvPct, setMaxLtvPct] = useState(80); // conventional max is 80%; insured refi up to 90%

  const safeValue = Math.max(1, homeValue);
  const safeBalance = Math.max(0, currentBalance);
  const maxLoan = safeValue * (maxLtvPct / 100);
  const availableEquity = Math.max(0, maxLoan - safeBalance);
  const cashOut = availableEquity;

  const newMortgage = safeBalance + cashOut;
  const currentPayment = payment({ principal: safeBalance, annualRatePct: newRate, amortYears: newAmortYears, paymentsPerYear: 12 });
  const newPayment = payment({ principal: newMortgage, annualRatePct: newRate, amortYears: newAmortYears, paymentsPerYear: 12 });
  const paymentDiff = newPayment - currentPayment;
  const ltvAfter = (newMortgage / safeValue) * 100;
  const equityRemaining = safeValue - newMortgage;

  return (
    <>
      <CalculatorSchema name="Refinance Cash-Out Calculator" description="Calculate how much equity you can access through a refinance. See your max cash-out at 80% LTV and the new monthly payment." url="/calculators/refinance-cashout" />
      <Navigation />
      <main className="min-h-screen bg-slate-950 pb-16">
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 border border-gold-500/30 mb-5">
              Refinance Tool
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-4">
              Refinance <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Cash-Out</span> Calculator
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Find out how much equity you can access from your home and what the new monthly payment looks like.
            </p>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            {/* INPUTS */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 pb-4">Your Home & Mortgage</h2>
              <ValidatedInput label="Current Home Value" type="currency" value={homeValue} onChange={setHomeValue} validation={{ min: 100000, max: 10000000, message: "Estimated current market value" }} />
              <ValidatedInput label="Current Mortgage Balance" type="currency" value={currentBalance} onChange={setCurrentBalance} validation={{ min: 0, max: 10000000, message: "What you still owe" }} />

              <div className="pt-4 border-t border-gray-700/50 space-y-4">
                <h2 className="text-xl font-semibold text-gray-100">New Mortgage Terms</h2>
                <ValidatedSlider label="New Interest Rate" value={newRate} onChange={setNewRate} min={0.5} max={10} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
                <ValidatedSlider label="New Amortization" value={newAmortYears} onChange={(v) => setNewAmortYears(Math.round(v))} min={5} max={30} step={1} formatValue={(v) => Math.round(v) + " years"} />
                <ValidatedSlider label="Max Loan-to-Value (LTV)" value={maxLtvPct} onChange={(v) => setMaxLtvPct(Math.round(v))} min={65} max={80} step={1} formatValue={(v) => Math.round(v) + "%"} />
                <p className="text-xs text-gray-500">Conventional refinance max is 80% LTV. Insured refinances can reach 90% but require CMHC insurance.</p>
              </div>

              <ComplianceBanner feature="LEAD_FORM" />
            </div>

            {/* RESULTS */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gold-600/20 p-6 lg:sticky lg:top-24 lg:self-start relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                {/* Hero result */}
                <div className="mb-6 pb-6 border-b border-gray-700/50">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Available Cash-Out</div>
                  <div className="text-5xl font-bold text-gold-400 leading-none">${Math.round(cashOut).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-2">at {maxLtvPct}% LTV · {cashOut > 0 ? "you can access this much" : "no equity available at this LTV"}</div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-700/50"><span className="text-sm text-gray-300">Home Value</span><span className="text-gray-100 font-medium">${Math.round(safeValue).toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50"><span className="text-sm text-gray-300">Max Loan ({maxLtvPct}% LTV)</span><span className="text-gray-100 font-medium">${Math.round(maxLoan).toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50"><span className="text-sm text-gray-300">Current Balance</span><span className="text-gray-100 font-medium">${Math.round(safeBalance).toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50"><span className="text-sm text-gray-300 font-semibold">Cash Available</span><span className="text-gold-400 font-bold text-lg">${Math.round(cashOut).toLocaleString()}</span></div>
                </div>

                {/* New payment */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">New Monthly Payment</div>
                    <div className="text-2xl font-bold text-gold-400">${Math.round(newPayment).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">was ${Math.round(currentPayment).toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">LTV After Refinance</div>
                    <div className="text-2xl font-bold text-gray-200">{ltvAfter.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500 mt-1">${Math.round(equityRemaining).toLocaleString()} equity left</div>
                  </div>
                </div>

                {cashOut > 0 && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/40 mb-6">
                    <span className="text-sm text-gray-300">Payment Increase</span>
                    <span className="text-lg font-bold text-amber-400">+${Math.round(paymentDiff).toLocaleString()}/mo</span>
                  </div>
                )}

                <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all text-center shadow-lg shadow-gold-500/20">
                  Start Refinance Application
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          <RelatedCalculators current="refinance-cashout" related={["refinance-break-even", "refinance-vs-heloc-vs-second", "equity-lending", "payment"]} />
        </div>
      </main>
    </>
  );
}
