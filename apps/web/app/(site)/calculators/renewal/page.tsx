"use client";
import { useState } from "react";
import { payment } from "@/lib/calc/payment";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function Renewal() {
  const [balance, setBalance] = useState(450000);
  const [monthsLeft, setMonthsLeft] = useState(36);
  const [currentRate, setCurrentRate] = useState(5.89);
  const [marketRate, setMarketRate] = useState(5.19);
  const [penalty, setPenalty] = useState(2500);

  const currPay = payment({ principal: balance, annualRatePct: currentRate, amortYears: Math.ceil(monthsLeft/12), paymentsPerYear: 12 });
  const newPay = payment({ principal: balance, annualRatePct: marketRate, amortYears: Math.ceil(monthsLeft/12), paymentsPerYear: 12 });
  const monthlySavings = currPay - newPay;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(penalty / monthlySavings) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-white">Renewal Optimizer</h2>
      <div className="mt-2"><ComplianceBanner feature="LEAD_FORM" /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-gray-200">Remaining Balance
          <input type="number" value={balance} onChange={e=>setBalance(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Months Remaining
          <input type="number" value={monthsLeft} onChange={e=>setMonthsLeft(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Current Rate (APR %)
          <input type="number" step="0.01" value={currentRate} onChange={e=>setCurrentRate(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Market Rate (APR %)
          <input type="number" step="0.01" value={marketRate} onChange={e=>setMarketRate(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Estimated Penalty ($)
          <input type="number" value={penalty} onChange={e=>setPenalty(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="rounded-2xl p-4 bg-gray-800 border border-gray-700 space-y-2">
        <div className="text-gray-200">Current Monthly: <strong className="text-white">${currPay.toFixed(2)}</strong></div>
        <div className="text-gray-200">New Monthly (if switch): <strong className="text-white">${newPay.toFixed(2)}</strong></div>
        <div className="text-gray-200">Monthly Savings: <strong className="text-gold-400">${monthlySavings.toFixed(2)}</strong></div>
        <div className="text-gray-200">Break‑even: <strong className="text-white">{breakEvenMonths} months</strong></div>
        <p className="text-xs text-gray-400">Penalties vary by lender and term; confirm with your lender. Educational use only.</p>
      </div>
    </div>
  );
}
