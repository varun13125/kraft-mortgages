"use client";
import { useMemo, useState } from "react";
import { estimateMliPremium } from "@/lib/calc/mli";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function MLISelect() {
  const [units, setUnits] = useState(24);
  const [price, setPrice] = useState(6500000);
  const [loan, setLoan] = useState(5200000);
  const [scores, setScores] = useState({ affordability: 65, energy: 58, accessibility: 62 });

  const result = useMemo(() => estimateMliPremium({ units, purchasePrice: price, loanAmount: loan, termYears: 10, scores }), [units, price, loan, scores]);

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">MLI Select Calculator</h2>
      <div className="mt-2"><ComplianceBanner feature="CALC_MLI" /></div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-gray-200">Units
          <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Purchase Price
          <input type="number" value={price} onChange={e=>setPrice(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Loan Amount
          <input type="number" value={loan} onChange={e=>setLoan(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(["affordability","energy","accessibility"] as const).map((k)=> (
          <label key={k} className="grid gap-1 capitalize text-gray-200">{k} score
            <input type="number" min={0} max={100} value={(scores as any)[k]}
              onChange={e=>setScores(s=>({ ...s, [k]: +e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
          </label>
        ))}
      </div>

      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 space-y-2">
        <div className="text-gray-200">Premium Rate (est.): <strong className="text-gold-500">{(result.rate*100).toFixed(2)}%</strong></div>
        <div className="text-gray-200">Premium Amount: <strong className="text-gold-500">${result.premium.toLocaleString()}</strong></div>
        <div className="text-gray-200">Pillars Attained: <strong className="text-gold-500">{result.attained.length ? result.attained.join(", ") : "None"}</strong></div>
        <p className="text-xs text-gray-400">Figures are estimates. Confirm with official CMHC tables before advising clients.</p>
      </div>
    </div>
  );
}
