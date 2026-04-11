"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle,
  ArrowRight, Users, Shield, Info, HelpCircle, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

const faqs = [
  {
    q: "What is a good GDS ratio in Canada?",
    a: "CMHC and most lenders cap GDS at 32% for insured mortgages and 35% for conventional. A lower GDS (25-30%) gives you more financial breathing room. Some alternative lenders accept GDS up to 44%, but at higher interest rates."
  },
  {
    q: "What is a good TDS ratio in Canada?",
    a: "The standard TDS limit is 40% for CMHC-insured mortgages and 42-44% for conventional. A TDS below 35% is considered comfortable. If your TDS is above 42%, you may need to reduce existing debts, increase income, or work with an alternative lender."
  },
  {
    q: "Does CMHC use stress test rates for GDS/TDS calculations?",
    a: "Yes. CMHC requires the mortgage qualifying rate (minimum of contract rate + 2% or the Bank of Canada benchmark) for GDS/TDS calculations. This means your ratios will be higher than what your actual payments would be at the contracted rate."
  },
  {
    q: "How can I improve my debt service ratios?",
    a: "Pay down high-balance debts (especially credit cards and personal loans), increase your income, consider a co-applicant, choose a longer amortization to lower monthly payments, or reduce the purchase price. Even paying off a $5,000 credit card can meaningfully improve your TDS ratio."
  },
  {
    q: "Do all lenders use the same GDS/TDS limits?",
    a: "No. CMHC sets guidelines, but lenders can be more restrictive. Big banks often use 32/40 for insured. Monoline lenders may stretch to 35/42. Alternative and private lenders have their own criteria and often don't use standard ratios at all, focusing instead on equity and property value."
  }
];

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function cmhcPremium(downPayment: number, price: number): number {
  const loan = price - downPayment;
  if (downPayment >= price * 0.2) return 0;
  const ltv = loan / price;
  let rate: number;
  if (ltv <= 0.65) rate = 0.006;
  else if (ltv <= 0.75) rate = 0.015;
  else if (ltv <= 0.8) rate = 0.024;
  else if (ltv <= 0.85) rate = 0.028;
  else if (ltv <= 0.9) rate = 0.031;
  else if (ltv <= 0.95) rate = 0.04;
  else rate = 0.042;
  return loan * rate;
}

export default function DebtServiceRatioPage() {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [coApplicantIncome, setCoApplicantIncome] = useState(0);
  const [calcMethod, setCalcMethod] = useState<"manual" | "auto">("manual");
  const [manualMortgage, setManualMortgage] = useState(2500);
  const [homePrice, setHomePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(5.0);
  const [amortization, setAmortization] = useState(25);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(350);
  const [monthlyHeating, setMonthlyHeating] = useState(100);
  const [condoFees, setCondoFees] = useState(0);
  const [carPayment, setCarPayment] = useState(0);
  const [creditCards, setCreditCards] = useState(0);
  const [studentLoans, setStudentLoans] = useState(0);
  const [otherDebts, setOtherDebts] = useState(0);
  const [otherMortgages, setOtherMortgages] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const results = useMemo(() => {
    const totalIncome = annualIncome + coApplicantIncome;
    const monthlyIncome = totalIncome / 12;

    let mortgagePayment: number;
    if (calcMethod === "auto") {
      const down = homePrice * downPaymentPct / 100;
      const cmhc = cmhcPremium(down, homePrice);
      const loan = homePrice - down + cmhc;
      mortgagePayment = monthlyPayment(loan, mortgageRate, amortization);
    } else {
      mortgagePayment = manualMortgage;
    }

    const halfCondo = condoFees / 2;
    const housingCosts = mortgagePayment + monthlyPropertyTax + monthlyHeating + halfCondo;
    const totalDebts = housingCosts + carPayment + creditCards + studentLoans + otherDebts + otherMortgages;

    const gds = monthlyIncome > 0 ? (housingCosts / monthlyIncome) * 100 : 0;
    const tds = monthlyIncome > 0 ? (totalDebts / monthlyIncome) * 100 : 0;

    // CMHC max qualifying: GDS 32%, TDS 40% for insured; 35%/42% conventional
    const maxGdsHousing = monthlyIncome * 0.32;
    const maxTdsHousing = monthlyIncome * 0.40 - (carPayment + creditCards + studentLoans + otherDebts + otherMortgages);
    const maxHousing = Math.min(maxGdsHousing, maxTdsHousing);

    // Estimate max mortgage from max housing budget
    const nonMortgageHousing = monthlyPropertyTax + monthlyHeating + halfCondo;
    const maxMonthlyMortgage = Math.max(0, maxHousing - nonMortgageHousing);
    // Rough reverse calc: M = P * r(1+r)^n / ((1+r)^n - 1), solve for P
    const r = 5.34 / 100 / 12; // stress test rate approx
    const n = amortization * 12;
    const stressTestRate = 5.34;
    const cmhcMaxMortgage = maxMonthlyMortgage > 0
      ? maxMonthlyMortgage * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
      : 0;

    const gdsPass = gds <= 32;
    const tdsPass = tds <= 40;
    const conventionalGdsPass = gds <= 35;
    const conventionalTdsPass = tds <= 42;

    return {
      totalIncome, monthlyIncome, mortgagePayment, housingCosts, totalDebts,
      gds, tds, halfCondo, gdsPass, tdsPass,
      conventionalGdsPass, conventionalTdsPass,
      cmhcMaxMortgage, maxMonthlyMortgage
    };
  }, [annualIncome, coApplicantIncome, calcMethod, manualMortgage, homePrice, downPaymentPct, mortgageRate, amortization, monthlyPropertyTax, monthlyHeating, condoFees, carPayment, creditCards, studentLoans, otherDebts, otherMortgages]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Debt Service Ratio Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Shield className="w-4 h-4" />
                CMHC Qualification Check
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Debt Service Ratio</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Calculate your GDS and TDS ratios. See if you meet CMHC qualification thresholds and your maximum mortgage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Inputs */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-gold-400" />
                    Income
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Your Annual Gross Income" value={annualIncome} onChange={setAnnualIncome} validation={{ min: 20000, max: 1000000 }} type="currency" />
                    <ValidatedInput label="Co-Applicant Annual Gross Income" value={coApplicantIncome} onChange={setCoApplicantIncome} validation={{ min: 0, max: 1000000 }} type="currency" />
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                      Combined monthly income: <span className="text-gold-400 font-semibold">{formatCurrency(results.monthlyIncome, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-gold-400" />
                    Housing Costs
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-2 mb-2">
                      {(["manual", "auto"] as const).map((m) => (
                        <button key={m} onClick={() => setCalcMethod(m)} className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all border ${calcMethod === m ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                          {m === "manual" ? "Enter Payment" : "Calculate from Purchase"}
                        </button>
                      ))}
                    </div>
                    {calcMethod === "manual" ? (
                      <ValidatedInput label="Monthly Mortgage Payment" value={manualMortgage} onChange={setManualMortgage} validation={{ min: 0, max: 15000 }} type="currency" />
                    ) : (
                      <div className="space-y-4">
                        <ValidatedInput label="Home Purchase Price" value={homePrice} onChange={setHomePrice} validation={{ min: 100000, max: 5000000 }} type="currency" />
                        <ValidatedSlider label={`Down Payment (${downPaymentPct}%)`} value={downPaymentPct} onChange={setDownPaymentPct} min={5} max={50} step={1} formatValue={(v) => `${v}%`} />
                        <ValidatedSlider label={`Mortgage Rate (${mortgageRate}%)`} value={mortgageRate} onChange={setMortgageRate} min={1} max={12} step={0.1} formatValue={(v) => `${v}%`} />
                        <ValidatedSlider label={`Amortization (${amortization} years)`} value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                      </div>
                    )}
                    <ValidatedInput label="Monthly Property Tax" value={monthlyPropertyTax} onChange={setMonthlyPropertyTax} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Monthly Heating Cost" value={monthlyHeating} onChange={setMonthlyHeating} validation={{ min: 0, max: 1000 }} type="currency" />
                    <ValidatedInput label="Monthly Condo Fees (50% counted)" value={condoFees} onChange={setCondoFees} validation={{ min: 0, max: 3000 }} type="currency" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-gold-400" />
                    Other Monthly Debts
                  </h2>
                  <div className="space-y-5">
                    <ValidatedInput label="Car Loan / Lease" value={carPayment} onChange={setCarPayment} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Credit Card Minimum Payments" value={creditCards} onChange={setCreditCards} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Student Loan Payments" value={studentLoans} onChange={setStudentLoans} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Other Debts" value={otherDebts} onChange={setOtherDebts} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Other Mortgages" value={otherMortgages} onChange={setOtherMortgages} validation={{ min: 0, max: 10000 }} type="currency" />
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* GDS */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${results.gdsPass ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Gross Debt Service (GDS)</p>
                      <p className={`text-4xl sm:text-5xl font-bold ${results.gdsPass ? "text-green-400" : "text-red-400"}`}>{results.gds.toFixed(1)}%</p>
                    </div>
                    {results.gdsPass ? <CheckCircle className="w-10 h-10 text-green-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">Housing Costs</span>
                      <span className="font-semibold text-gray-200">{formatCurrency(results.housingCosts, 0)}/mo</span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">CMHC Limit</span>
                      <span className="font-semibold text-gray-200">32%</span>
                    </div>
                  </div>
                  {/* Visual bar */}
                  <div className="mt-4">
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(results.gds / 50 * 100, 100)}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${results.gdsPass ? "bg-green-500" : "bg-red-500"}`} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>0%</span>
                      <span className="text-green-400">32% CMHC limit</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>

                {/* TDS */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${results.tdsPass ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Debt Service (TDS)</p>
                      <p className={`text-4xl sm:text-5xl font-bold ${results.tdsPass ? "text-green-400" : "text-red-400"}`}>{results.tds.toFixed(1)}%</p>
                    </div>
                    {results.tdsPass ? <CheckCircle className="w-10 h-10 text-green-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">Total Debts</span>
                      <span className="font-semibold text-gray-200">{formatCurrency(results.totalDebts, 0)}/mo</span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">CMHC Limit</span>
                      <span className="font-semibold text-gray-200">40%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(results.tds / 55 * 100, 100)}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${results.tdsPass ? "bg-green-500" : "bg-red-500"}`} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>0%</span>
                      <span className="text-green-400">40% CMHC limit</span>
                      <span>55%</span>
                    </div>
                  </div>
                </div>

                {/* Conventional limits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-gold-400" />
                    Conventional (20%+ Down) Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className={`rounded-lg p-3 ${results.conventionalGdsPass ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      <span className="text-gray-400 block text-xs">GDS ≤ 35%</span>
                      <span className={`font-semibold ${results.conventionalGdsPass ? "text-green-400" : "text-red-400"}`}>{results.conventionalGdsPass ? "PASS" : "FAIL"}</span>
                    </div>
                    <div className={`rounded-lg p-3 ${results.conventionalTdsPass ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      <span className="text-gray-400 block text-xs">TDS ≤ 42%</span>
                      <span className={`font-semibold ${results.conventionalTdsPass ? "text-green-400" : "text-red-400"}`}>{results.conventionalTdsPass ? "PASS" : "FAIL"}</span>
                    </div>
                  </div>
                </div>

                {/* Max qualifying mortgage */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">CMHC Maximum Qualifying Mortgage</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gold-400">{formatCurrency(results.cmhcMaxMortgage, 0)}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on {amortization}-year amortization, assuming 5.34% stress test rate</p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Pre-Approved
                  </Link>
                  <Link href="/calculators/affordability" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Affordability Calculator
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Understanding GDS and TDS Ratios in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Two of the most important numbers in Canadian mortgage qualification are your Gross Debt Service (GDS) and Total Debt Service (TDS) ratios. These ratios determine whether you qualify for a mortgage, how much you can borrow, and what interest rate you&apos;ll be offered. Understanding them before you apply can save you time, money, and disappointment.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What Is GDS (Gross Debt Service)?</h3>
              <p>
                Your GDS ratio measures the percentage of your gross monthly income that goes toward housing costs. Housing costs include your mortgage payment (principal + interest), property taxes, heating costs, and 50% of condo fees if applicable. For CMHC-insured mortgages (less than 20% down payment), the GDS limit is 32%. For conventional mortgages (20%+ down), most lenders allow up to 35%.
              </p>
              <p>
                <strong>Formula:</strong> GDS = (Mortgage Payment + Property Tax + Heating + 50% Condo Fees) ÷ Gross Monthly Income × 100
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What Is TDS (Total Debt Service)?</h3>
              <p>
                Your TDS ratio includes everything in your GDS calculation plus all other monthly debt obligations: car payments, credit card minimums, student loans, lines of credit, child support, and any other mortgages. The CMHC limit is 40% for insured mortgages and 42% for conventional. Some lenders stretch to 44% for strong applicants. TDS is the stricter measure because it accounts for your entire debt picture.
              </p>
              <p>
                <strong>Formula:</strong> TDS = (Housing Costs + All Other Debts) ÷ Gross Monthly Income × 100
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">CMHC Qualification Ratios</h3>
              <p>
                The Canada Mortgage and Housing Corporation sets the standard qualification ratios used by most lenders. For CMHC-insured mortgages, you must have a GDS of 32% or less and a TDS of 40% or less. These ratios are calculated using the mortgage qualifying rate (the higher of your contract rate + 2% or the Bank of Canada benchmark rate), not your actual contracted rate. This stress test ensures you can afford payments even if rates rise.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Improve Your Ratios</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Pay down existing debts</strong> — Even eliminating a $300/month car payment can dramatically improve your TDS ratio and unlock a higher mortgage amount.</li>
                <li><strong>Increase your income</strong> — A co-applicant, raise, or side income can make a significant difference. Lenders use gross income, so include all sources.</li>
                <li><strong>Choose a longer amortization</strong> — Spreading payments over 30 years instead of 25 lowers your monthly payment, improving both GDS and TDS.</li>
                <li><strong>Reduce the purchase price</strong> — A lower mortgage payment directly improves your ratios. Sometimes a $50,000 price reduction is the difference between qualifying and not.</li>
                <li><strong>Consolidate debts</strong> — Rolling high-interest debts into a lower-rate consolidation loan can reduce your monthly obligations.</li>
                <li><strong>Consider a larger down payment</strong> — More money down means a smaller mortgage and lower payments.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What Lenders Actually Look For</h3>
              <p>
                While GDS and TDS are the standard benchmarks, lenders consider additional factors: your credit score (ideally 680+ for best rates), employment stability (2+ years in the same field), the property type and location, your down payment source (savings vs. gifted), and your overall financial picture. A strong application with slightly elevated ratios may still be approved, while a borderline ratio with weak credit history will likely be declined. This is where a mortgage broker adds value — they know which lenders are flexible on which criteria.
              </p>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/stress-test" className="text-gold-400 hover:text-gold-300 underline">Stress Test Calculator</Link>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">
                      {faq.a}
                    </motion.div>
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
