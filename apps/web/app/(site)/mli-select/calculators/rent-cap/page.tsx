"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import Card from "@/components/mli/Card";
import { rentCapFromMedian } from "@/lib/mli/calcs";

export default function RentCapPage() {
  const [medianIncome, setMedianIncome] = useState(65000);
  const [actualRent, setActualRent] = useState(1800);

  const maxRent = rentCapFromMedian(medianIncome);
  const compliance = actualRent <= maxRent;

  return (
    <main className="min-h-screen">
      <section className="py-20 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Rent Cap Calculator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Calculate the MLI Select affordable rent limit: 30% of the median renter household income for your market
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Market Inputs">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Median Renter Household Income — annual ($)</label>
                  <CalculatorNumberInput aria-label="Median Renter Household Income — annual ($)" min={1}
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-500"
                    type="number"
                    value={medianIncome}
                    onChange={e=>setMedianIncome(+e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Use CMHC&apos;s published median renter income for the project&apos;s market (not overall household income).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Proposed Monthly Rent ($)</label>
                  <CalculatorNumberInput aria-label="Proposed Monthly Rent ($)"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder-gray-500"
                    type="number"
                    value={actualRent}
                    onChange={e=>setActualRent(+e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card title="Compliance Results">
              <div className="space-y-6">
                <div className="p-5 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20">
                  <div className="text-sm font-medium text-gray-400 mb-1">Maximum Allowable Rent</div>
                  <div className="text-3xl font-bold text-blue-400">${maxRent.toFixed(0)}</div>
                  <div className="text-xs text-gray-400 mt-1">30% of median renter income ÷ 12 (per unit, per month)</div>
                </div>

                <div className={`p-5 rounded-xl border ${compliance ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20' : 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20'}`}>
                  <div className="text-sm font-medium text-gray-400 mb-1">Compliance Status</div>
                  <div className={`text-2xl font-bold ${compliance ? 'text-green-400' : 'text-red-400'}`}>
                    {compliance ? 'COMPLIANT' : 'OVER LIMIT'}
                  </div>
                  {!compliance && (
                    <div className="text-sm text-red-400 mt-2">
                      Exceeds by ${(actualRent - maxRent).toFixed(0)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}