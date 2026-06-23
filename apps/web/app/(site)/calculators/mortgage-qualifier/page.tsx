"use client";
import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { payment } from "@/lib/calc/payment";
import { cmhcPremium, cmhcPremiumRate, stressTestRate, QUALIFYING_RATIOS } from "@/lib/calc/cmhc";
import { CheckCircle, XCircle, DollarSign, TrendingDown, Info } from "lucide-react";
import { BUSINESS } from "@/lib/seo/business-config";

// Land transfer tax (simplified — BC/AB/ON)
function landTransferTax(price: number, province: string, isFirstTime: boolean): number {
  if (province === "AB") {
    const fee = 50 + Math.ceil(price / 5000);
    return isFirstTime ? 0 : Math.min(fee, 500);
  }
  if (province === "BC") {
    let tax: number;
    if (price <= 200000) tax = price * 0.01;
    else if (price <= 2000000) tax = 2000 + (price - 200000) * 0.02;
    else tax = 39800 + (price - 2000000) * 0.03;
    if (isFirstTime && price <= 835000) return 0;
    if (isFirstTime && price <= 860000) return tax * (1 - (price - 835000) / 25000);
    return tax;
  }
  // Ontario
  let tax: number;
  if (price <= 55000) tax = price * 0.005;
  else if (price <= 250000) tax = 275 + (price - 55000) * 0.01;
  else if (price <= 400000) tax = 2225 + (price - 250000) * 0.015;
  else if (price <= 2000000) tax = 4475 + (price - 400000) * 0.02;
  else tax = 36475 + (price - 2000000) * 0.025;
  if (isFirstTime) return Math.max(0, tax - 4475);
  return tax;
}

// Minimum down payment per Canadian rules
function minDownPayment(price: number): number {
  if (price <= 500000) return price * 0.05;
  if (price <= 1000000) return 25000 + (price - 500000) * 0.10;
  return price * 0.20; // $1M+ requires 20%
}

export default function MortgageQualifierPage() {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [homePrice, setHomePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [interestRate, setInterestRate] = useState(5.49);
  const [amortization, setAmortization] = useState(25);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(3600);
  const [heatingMonthly, setHeatingMonthly] = useState(150);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState(0);
  const [province, setProvince] = useState("BC");
  const [isFirstTime, setIsFirstTime] = useState(true);

  const totalIncome = annualIncome + partnerIncome;
  const safeIncome = Math.max(1, totalIncome);

  const baseLoan = Math.max(0, homePrice - downPayment);
  const downPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const needsInsurance = downPct < 20;
  const cmhc = needsInsurance ? cmhcPremium(homePrice, downPayment) : 0;
  const insuredLoan = baseLoan + cmhc;
  const qualRate = stressTestRate(interestRate);
  const monthlyPayment = payment({ principal: insuredLoan, annualRatePct: qualRate, amortYears: amortization, paymentsPerYear: 12 });
  const actualPayment = payment({ principal: insuredLoan, annualRatePct: interestRate, amortYears: amortization, paymentsPerYear: 12 });

  const monthlyPropertyTax = propertyTaxAnnual / 12;
  const housingMonthly = monthlyPayment + monthlyPropertyTax + heatingMonthly + (condoFeesMonthly * 0.5);
  const totalDebtMonthly = housingMonthly + monthlyDebts;
  const gds = (housingMonthly * 12 / (safeIncome)) * 100;
  const tds = (totalDebtMonthly * 12 / (safeIncome)) * 100;
  const gdsPass = gds <= QUALIFYING_RATIOS.GDS_MAX;
  const tdsPass = tds <= QUALIFYING_RATIOS.TDS_MAX;
  const qualifies = gdsPass && tdsPass;

  const minDown = minDownPayment(homePrice);
  const downPaymentOk = downPayment >= minDown;
  const ltt = landTransferTax(homePrice, province, isFirstTime);
  const closingCostsEst = homePrice * 0.015; // legal, inspection, etc
  const totalCashNeeded = downPayment + ltt + closingCostsEst;

  // Max purchase price (reverse-calc from TDS)
  const maxHousingMonthly = (safeIncome / 12) * (QUALIFYING_RATIOS.TDS_MAX / 100) - monthlyDebts;
  const maxPaymentMonthly = Math.max(0, maxHousingMonthly - monthlyPropertyTax - heatingMonthly - (condoFeesMonthly * 0.5));
  const rMonthly = Math.pow(1 + qualRate / 200, 1 / 6) - 1;
  const n = amortization * 12;
  const maxInsuredLoan = maxPaymentMonthly > 0 && rMonthly > 0 ? maxPaymentMonthly * ((1 - Math.pow(1 + rMonthly, -n)) / rMonthly) : 0;
  const maxDownBased = downPayment;
  const maxPurchaseRough = maxInsuredLoan > 0 ? (maxInsuredLoan - (needsInsurance ? cmhcPremium(maxInsuredLoan + maxDownBased, maxDownBased) : 0)) + maxDownBased : 0;

  return (
    <>
      <CalculatorSchema name="Mortgage Qualifier Calculator" description="Find out if you qualify to buy a specific home. Combines stress test, CMHC insurance, GDS/TDS ratios, and down payment rules in one tool." url="/calculators/mortgage-qualifier" />
      <Navigation />
      <main className="min-h-screen bg-slate-950 pb-16">
        {/* Hero */}
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 border border-gold-500/30 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
              Qualification Tool
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-4">
              Can I afford this <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">home?</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Enter your income and the home you want. We&apos;ll calculate whether you qualify using the real Canadian stress test, CMHC insurance, and lender ratios — all in one place.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            {/* INPUTS */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 pb-4">Your Financial Picture</h2>

              {/* Income */}
              <div className="space-y-4">
                <div className="text-sm text-gold-400 uppercase tracking-wider font-medium">Income</div>
                <ValidatedInput label="Your Annual Income (Before Tax)" type="currency" value={annualIncome} onChange={setAnnualIncome} validation={{ min: 0, max: 10000000, message: "Enter your gross annual income" }} />
                <ValidatedInput label="Co-Applicant Income (Optional)" type="currency" value={partnerIncome} onChange={setPartnerIncome} validation={{ min: 0, max: 10000000, message: "Enter co-applicant gross annual income" }} />
                <ValidatedInput label="Monthly Debt Payments" type="currency" value={monthlyDebts} onChange={setMonthlyDebts} validation={{ min: 0, max: 10000, message: "Car loans, credit cards, student loans (monthly)" }} help="Car loans, credit cards, student loans, child support (monthly total)" />
              </div>

              {/* Property */}
              <div className="space-y-4 pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gold-400 uppercase tracking-wider font-medium">The Home</div>
                <ValidatedInput label="Purchase Price" type="currency" value={homePrice} onChange={setHomePrice} validation={{ min: 50000, max: 10000000, message: "Enter the home's purchase price" }} />
                <ValidatedInput label="Down Payment" type="currency" value={downPayment} onChange={setDownPayment} validation={{ min: 0, max: 10000000, message: "Enter your down payment" }} help={`Minimum required: $${Math.round(minDown).toLocaleString()} (${minDown < homePrice * 0.05 ? "5%" : minDown < homePrice * 0.2 ? "tiered" : "20%"})`} />

                {downPayment < minDown && (
                  <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-sm">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    Down payment is below the legal minimum of ${Math.round(minDown).toLocaleString()}.
                  </div>
                )}

                <ValidatedSlider label="Interest Rate" value={interestRate} onChange={setInterestRate} min={0.5} max={10} step={0.01} formatValue={(v) => v.toFixed(2) + "%"} />
                <ValidatedSlider label="Amortization Period" value={amortization} onChange={(v) => setAmortization(Math.round(v))} min={5} max={30} step={1} formatValue={(v) => Math.round(v) + " years"} />
              </div>

              {/* Property Costs */}
              <div className="space-y-4 pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gold-400 uppercase tracking-wider font-medium">Property Costs</div>
                <ValidatedInput label="Annual Property Tax" type="currency" value={propertyTaxAnnual} onChange={setPropertyTaxAnnual} validation={{ min: 0, max: 50000, message: "Estimated annual property tax" }} />
                <ValidatedInput label="Monthly Heating" type="currency" value={heatingMonthly} onChange={setHeatingMonthly} validation={{ min: 0, max: 1000, message: "Monthly heating cost" }} />
                <ValidatedInput label="Monthly Condo Fees (if applicable)" type="currency" value={condoFeesMonthly} onChange={setCondoFeesMonthly} validation={{ min: 0, max: 2000, message: "Monthly condo fees" }} />
              </div>

              {/* Province + First-time */}
              <div className="space-y-4 pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gold-400 uppercase tracking-wider font-medium">Location & Status</div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Province</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["BC", "AB", "ON"].map((p) => (
                      <button key={p} onClick={() => setProvince(p)} className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${province === p ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-gray-600 text-gray-400 hover:border-gray-500"}`}>
                        {p === "BC" ? "British Columbia" : p === "AB" ? "Alberta" : "Ontario"}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isFirstTime} onChange={(e) => setIsFirstTime(e.target.checked)} className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-gold-500 focus:ring-gold-500/50" />
                  <span className="text-sm text-gray-300">I am a first-time home buyer</span>
                </label>
              </div>

              <ComplianceBanner feature="LEAD_FORM" />
            </div>

            {/* RESULTS */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gold-600/20 p-6 lg:sticky lg:top-24 lg:self-start relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Verdict */}
              <div className={`relative rounded-xl p-5 mb-6 ${qualifies ? "bg-emerald-950/30 border border-emerald-600/30" : "bg-red-950/30 border border-red-700/40"}`}>
                <div className="flex items-center gap-3">
                  {qualifies ? (
                    <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className={`text-lg font-bold ${qualifies ? "text-emerald-300" : "text-red-300"}`}>
                      {qualifies ? "You likely qualify!" : "Not quite there yet"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {qualifies
                        ? `Based on a ${qualRate.toFixed(2)}% qualifying rate and 39/44 GDS/TDS ratios.`
                        : "See what needs to change below — it might be closer than you think."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Numbers */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Monthly Payment</div>
                    <div className="text-2xl font-bold text-gold-400">${Math.round(actualPayment).toLocaleString()}<span className="text-sm text-gray-400">/mo</span></div>
                    <div className="text-xs text-gray-500 mt-1">at {interestRate.toFixed(2)}% contract rate</div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Qualifying Payment</div>
                    <div className="text-2xl font-bold text-gray-200">${Math.round(monthlyPayment).toLocaleString()}<span className="text-sm text-gray-400">/mo</span></div>
                    <div className="text-xs text-gray-500 mt-1">at {qualRate.toFixed(2)}% stress test</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">CMHC Insurance</div>
                    <div className="text-xl font-bold text-gray-200">{needsInsurance ? `$${Math.round(cmhc).toLocaleString()}` : "$0"}</div>
                    <div className="text-xs text-gray-500 mt-1">{needsInsurance ? `${(cmhcPremiumRate(downPct) * 100).toFixed(1)}% premium` : "20%+ down (conventional)"}</div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Mortgage</div>
                    <div className="text-xl font-bold text-gray-200">${Math.round(insuredLoan).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{needsInsurance ? "includes CMHC" : "no insurance"}</div>
                  </div>
                </div>
              </div>

              {/* Ratio bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">GDS Ratio (Housing Costs)</span>
                    <span className={gdsPass ? "text-emerald-400" : "text-red-400"}>{gds.toFixed(1)}% <span className="text-gray-500">/ 39%</span></span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-700 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${gdsPass ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(gds / 39 * 100, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">TDS Ratio (All Debts)</span>
                    <span className={tdsPass ? "text-emerald-400" : "text-red-400"}>{tds.toFixed(1)}% <span className="text-gray-500">/ 44%</span></span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-700 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${tdsPass ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(tds / 44 * 100, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Cash needed */}
              <div className="rounded-xl border border-gray-700/50 p-4 mb-6">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-3">Cash Needed at Closing</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-300">Down Payment</span><span className="text-gray-100">${Math.round(downPayment).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-300">Land Transfer Tax {isFirstTime && ltt === 0 && "(exempt)"}</span><span className="text-gray-100">${Math.round(ltt).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-300">Legal, Inspection, etc.</span><span className="text-gray-100">${Math.round(closingCostsEst).toLocaleString()}</span></div>
                  <div className="flex justify-between pt-2 border-t border-gray-700/50 font-semibold"><span className="text-gray-200">Total Cash Needed</span><span className="text-gold-400">${Math.round(totalCashNeeded).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Max purchase estimate */}
              {maxPurchaseRough > 0 && (
                <div className="rounded-xl border border-gold-600/20 bg-gold-500/5 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-gold-400" />
                    <span className="text-sm text-gold-400 font-medium uppercase tracking-wider">Your Max Purchase Price</span>
                  </div>
                  <div className="text-2xl font-bold text-gold-400">${Math.round(maxPurchaseRough).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Estimated max home price at your income, debts, and down payment</div>
                </div>
              )}

              {/* CTA */}
              <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all text-center shadow-lg shadow-gold-500/20">
                Get Pre-Approved
              </a>
              <p className="text-xs text-gray-500 text-center mt-3">Same-day pre-approval with a licensed broker</p>
            </div>
          </div>
        </section>

        {/* Educational content */}
        <section className="px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-4 text-gray-400 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-100">How Mortgage Qualification Works in Canada</h2>
            <p>
              Canadian mortgage qualification uses three key checks: the <strong className="text-gray-200">stress test</strong> (you must qualify at your contract rate + 2% or 5.25%, whichever is higher), <strong className="text-gray-200">GDS ratio</strong> (housing costs must be ≤39% of gross income), and <strong className="text-gray-200">TDS ratio</strong> (all debts + housing must be ≤44% of gross income). If your down payment is less than 20%, CMHC insurance is added to your mortgage — which increases the loan amount you must qualify for.
            </p>
            <p>
              This calculator applies all three rules simultaneously. The green/red verdict tells you whether a lender would likely approve this purchase based on the numbers you entered. For a precise pre-approval with actual lender rates, <Link href="/contact" className="text-gold-400 hover:underline">contact our team</Link>.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          <RelatedCalculators current="mortgage-qualifier" related={["affordability", "stress-test", "cmhc-insurance", "down-payment", "debt-service-ratio"]} />
        </div>
      </main>
    </>
  );
}
