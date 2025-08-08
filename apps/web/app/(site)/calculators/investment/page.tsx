"use client";
import { useState } from "react";
import { cashflow } from "@/lib/calc/investment";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function Investment() {
  const [price, setPrice] = useState(800000);
  const [down, setDown] = useState(200000);
  const [rate, setRate] = useState(5.45);
  const [years, setYears] = useState(25);
  const [rent, setRent] = useState(4200);
  const [vacancy, setVacancy] = useState(3);
  const [expenses, setExpenses] = useState(1200);
  const r = cashflow({ price, downPayment: down, ratePct: rate, amortYears: years, rentMonthly: rent, vacancyPct: vacancy, expensesMonthly: expenses });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-white">Investment Calculator</h1>
      <div className="mt-2"><ComplianceBanner feature="LEAD_FORM" /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-gray-200">Purchase Price <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={price} onChange={e=>setPrice(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Down Payment <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={down} onChange={e=>setDown(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Rate (APR %) <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Amortization (yrs) <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={years} onChange={e=>setYears(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Gross Rent (mo) <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={rent} onChange={e=>setRent(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Vacancy (%) <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={vacancy} onChange={e=>setVacancy(+e.target.value)} /></label>
        <label className="grid gap-1 text-gray-200">Expenses (mo) <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={expenses} onChange={e=>setExpenses(+e.target.value)} /></label>
      </div>
      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 space-y-1">
        <div className="text-gray-200">Monthly Payment: <strong className="text-white">${r.pmt.toFixed(2)}</strong></div>
        <div className="text-gray-200">NOI (mo): <strong className="text-white">${r.noi.toFixed(2)}</strong></div>
        <div className="text-gray-200">Cash Flow (mo): <strong className={r.cf>=0?"text-green-400":"text-red-400"}>${r.cf.toFixed(2)}</strong></div>
        <div className="text-gray-200">Cap Rate: <strong className="text-gold-500">{r.capRate.toFixed(2)}%</strong></div>
        <div className="text-gray-200">DSCR: <strong className="text-gold-500">{r.dscr.toFixed(2)}</strong></div>
      </div>
    </div>
  );
}
