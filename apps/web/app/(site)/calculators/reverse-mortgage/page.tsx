"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { Info, Clock, TrendingUp } from "lucide-react";

// Illustrative reverse-mortgage lending limits by age of the YOUNGEST borrower.
// Lenders (HomeEquity Bank CHIP, Equitable Bank) cap at up to ~55% of appraised value; the actual % also
// depends on property type, location and the lender's current rates. The old version jumped from ~16%
// at 64 to the 55% maximum at 65. These points are mid-range industry illustrations, not a lender table.
const AGE_LTV_POINTS: [number, number][] = [
  [55, 0.175], [60, 0.225], [65, 0.30], [70, 0.35], [75, 0.45], [80, 0.485], [85, 0.525], [95, 0.55],
];

function maxLtvForAge(age: number): number {
  if (age < AGE_LTV_POINTS[0][0]) return 0; // must be 55+
  for (let i = 1; i < AGE_LTV_POINTS.length; i++) {
    const [a1, l1] = AGE_LTV_POINTS[i];
    if (age <= a1) {
      const [a0, l0] = AGE_LTV_POINTS[i - 1];
      return l0 + (l1 - l0) * ((age - a0) / (a1 - a0));
    }
  }
  return AGE_LTV_POINTS[AGE_LTV_POINTS.length - 1][1];
}

export default function ReverseMortgagePage() {
  const [homeValue, setHomeValue] = useState(800000);
  const [borrowerAge, setBorrowerAge] = useState(70);
  const [interestRate, setInterestRate] = useState(7.74); // CHIP typical rate
  const [yearsProjected, setYearsProjected] = useState(15);
  const [existingDebt, setExistingDebt] = useState(0);

  const safeValue = Math.max(1, homeValue);
  const maxLtv = maxLtvForAge(borrowerAge);
  const maxLoan = safeValue * maxLtv;
  // Any existing mortgage/HELOC must be paid off from the reverse mortgage proceeds
  const safeDebt = Math.max(0, existingDebt || 0);
  const netCash = Math.max(0, maxLoan - safeDebt);
  const debtTooHigh = safeDebt > maxLoan;
  const maxMonthly = netCash > 0 ? (netCash / yearsProjected / 12) : 0;

  // Project remaining equity over time — interest compounds on the full balance (semi-annual compounding,
  // the Canadian convention). Assumes the full amount is advanced on day one.
  let balance = maxLoan;
  const annualGrowth = Math.pow(1 + interestRate / 100 / 2, 2);
  const yearlyBalance: { year: number; balance: number; equity: number }[] = [];
  for (let y = 1; y <= yearsProjected; y++) {
    balance *= annualGrowth;
    const equity = Math.max(0, safeValue - balance);
    yearlyBalance.push({ year: y, balance: Math.round(balance), equity: Math.round(equity) });
  }
  const finalEquity = yearlyBalance[yearlyBalance.length - 1]?.equity || 0;
  const equityPct = (finalEquity / safeValue) * 100;

  return (
    <>
      <CalculatorSchema name="Reverse Mortgage Calculator" description="Calculate how much tax-free cash you can access from your home equity with a Canadian reverse mortgage (CHIP). See your borrowing limit and remaining equity over time." url="/calculators/reverse-mortgage" />
      <Navigation />
      <main className="min-h-screen bg-slate-950 pb-16">
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 border border-gold-500/30 mb-5">
              Equity Release Tool
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-4">
              Reverse Mortgage <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Calculator</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Access tax-free cash from your home equity without selling. See how much you can borrow and what equity remains over time.
            </p>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            {/* INPUTS */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 pb-4">Your Situation</h2>
              <ValidatedInput label="Home Value" type="currency" value={homeValue} onChange={setHomeValue} validation={{ min: 100000, max: 10000000, message: "Current estimated home value" }} />
              <ValidatedSlider label="Youngest Borrower Age" value={borrowerAge} onChange={(v) => setBorrowerAge(Math.round(v))} min={55} max={95} step={1} formatValue={(v) => Math.round(v) + " years"} />
              <ValidatedSlider label="Interest Rate" value={interestRate} onChange={setInterestRate} min={4} max={12} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
              <ValidatedSlider label="Projection Period" value={yearsProjected} onChange={(v) => setYearsProjected(Math.round(v))} min={5} max={30} step={1} formatValue={(v) => Math.round(v) + " years"} />
              <ValidatedInput label="Existing Mortgage / HELOC Balance" type="currency" value={existingDebt} onChange={setExistingDebt} validation={{ min: 0, max: 10000000, message: "Must be paid off from the reverse mortgage" }} />

              <div className="flex items-start gap-2 p-3 bg-gray-800/40 rounded-lg text-xs text-gray-400">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gold-400" />
                <span>Canadian reverse mortgages (like CHIP) are available to homeowners aged 55+. The loan is repaid when you sell or move out. No monthly payments required — interest compounds on the balance.</span>
              </div>
            </div>

            {/* RESULTS */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gold-600/20 p-6 lg:sticky lg:top-24 lg:self-start relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="mb-6 pb-6 border-b border-gray-700/50">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Estimated Tax-Free Cash Available</div>
                  <div className="text-4xl sm:text-5xl font-bold text-gold-400 leading-none">${Math.round(netCash).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    ~{(maxLtv * 100).toFixed(0)}% of home value at age {borrowerAge} (${Math.round(maxLoan).toLocaleString()})
                    {safeDebt > 0 ? ` less $${Math.round(safeDebt).toLocaleString()} existing debt` : ""}
                  </div>
                  {debtTooHigh && (
                    <div className="text-xs text-amber-300 mt-2">Your existing debt is more than the estimated limit — it must be fully repaid from the proceeds, so you may not qualify without paying it down.</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">As Lump Sum</div>
                    <div className="text-xl font-bold text-gray-200">${Math.round(netCash).toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">As Monthly Income</div>
                    <div className="text-xl font-bold text-gray-200">${Math.round(maxMonthly).toLocaleString()}<span className="text-xs text-gray-400">/mo</span></div>
                    <div className="text-[10px] text-gray-500 mt-1">spread over {yearsProjected} yrs, before interest</div>
                  </div>
                </div>

                {/* Equity projection */}
                <div className="rounded-xl border border-gray-700/50 p-4 mb-6">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-3">Equity After {yearsProjected} Years</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-gold-400">${finalEquity.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">({equityPct.toFixed(0)}% of home value)</span>
                  </div>
                  <div className="space-y-1.5">
                    {yearlyBalance.filter((_, i) => i % 5 === 4 || i === yearlyBalance.length - 1).map((row) => (
                      <div key={row.year} className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 w-12">Yr {row.year}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-700 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400" style={{ width: `${Math.max(0, (row.equity / safeValue) * 100)}%` }} />
                        </div>
                        <span className="text-gray-300 w-20 text-right">${row.equity.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-950/20 border border-amber-700/30 rounded-lg text-xs text-amber-200/80 mb-6">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>Estimates only. The borrowing % by age is illustrative — your actual limit depends on the lender, your property type and location (up to ~55% of value). Reverse mortgage interest compounds, so your debt grows over time; the projection assumes the full amount is advanced on day one at a constant rate and no home appreciation. Setup, legal and appraisal fees apply, and rates are typically higher than regular mortgages.</span>
                </div>

                <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all text-center shadow-lg shadow-gold-500/20">
                  Speak with a Broker
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          <RelatedCalculators current="reverse-mortgage" related={["refinance-cashout", "refinance-break-even", "investment", "payment"]} />
        </div>
      </main>
    </>
  );
}
