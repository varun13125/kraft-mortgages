"use client";
import { useState } from "react";
import { normalizedIncome } from "@/lib/calc/selfEmployed";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function SelfEmployed() {
  const [y1, setY1] = useState(90000);
  const [y2, setY2] = useState(110000);
  const [y3, setY3] = useState(80000);
  const [addbacks, setAddbacks] = useState(15000);
  const r = normalizedIncome({ noa1:y2, noa2:y1, noa3:y3, addbacks });

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">Self-Employed Income Calculator</h2>
      <div className="mt-2"><ComplianceBanner feature="LEAD_FORM" /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-gray-200">NOA (Latest Year)
          <input type="number" value={y2} onChange={e=>setY2(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">NOA (Prior Year)
          <input type="number" value={y1} onChange={e=>setY1(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">NOA (Two Years Ago)
          <input type="number" value={y3} onChange={e=>setY3(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Addbacks
          <input type="number" value={addbacks} onChange={e=>setAddbacks(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>
      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 space-y-1">
        <div className="text-gray-200">Qualifying Income (est.): <strong className="text-gold-500">${r.qualifyingIncome.toFixed(0)}/yr</strong></div>
        <div className="text-gray-200">3‑Year Avg (info): <strong className="text-gold-500">${r.threeYearAvg.toFixed(0)}/yr</strong></div>
        <p className="text-xs text-gray-400">Confirm lender method. Educational only.</p>
      </div>
    </div>
  );
}
