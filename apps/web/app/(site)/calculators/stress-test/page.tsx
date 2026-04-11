"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, Shield, CheckCircle, AlertTriangle, HelpCircle,
  ChevronDown, ChevronUp, Home, DollarSign, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

/* ── Math ───────────────────────────────────────────── */
function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const STRESS_BUFFER = 2.0;
const MIN_QUALIFYING_RATE = 5.25;

const faqs = [
  {
    q: "What is Canada's mortgage stress test?",
    a: "The mortgage stress test requires all federally regulated lenders to qualify borrowers at a higher rate than their actual mortgage rate. As of 2025, you must qualify at either your contract rate plus 2% or the Bank of Canada's 5-year benchmark rate (floor of 5.25%) — whichever is higher. This ensures you can still afford your payments if rates rise."
  },
  {
    q: "Who needs to pass the stress test?",
    a: "All borrowers getting a mortgage from a federally regulated lender (banks, most credit unions, and trust companies) must pass the stress test. This applies to purchases, refinances, and switch-at-renewal (since 2023). Private lenders and some provincially regulated lenders are exempt but charge higher rates."
  },
  {
    q: "What are GDS and TDS ratios?",
    a: "GDS (Gross Debt Service) is the percentage of your gross income that goes to housing costs — mortgage payment, property tax, heating, and 50% of condo fees. The maximum is 39% for insured mortgages. TDS (Total Debt Service) includes all of that plus other debts (car loans, credit cards, student loans). The maximum TDS is 44%."
  },
  {
    q: "How can I improve my stress test results?",
    a: "Increase your down payment, pay off existing debts before applying, increase your income (co-signer, bonus income documentation), choose a lower purchase price, or opt for a shorter amortization (which may not help with qualification since payments are higher — but reduces risk). A mortgage broker can help you optimize your application."
  },
  {
    q: "Does the stress test apply at mortgage renewal?",
    a: "Since June 2023, borrowers switching lenders at renewal must pass the stress test again. Staying with your current lender at renewal does not require re-qualifying, which gives your existing lender a significant advantage. This makes it critical to compare your current lender's renewal offer with market rates."
  }
];

export default function StressTestPage() {
  const [purchasePrice, setPurchasePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [contractRate, setContractRate] = useState(4.79);
  const [amortYears, setAmortYears] = useState(25);
  const [propertyTax, setPropertyTax] = useState(3600);
  const [heat, setHeat] = useState(1200);
  const [condoFees, setCondoFees] = useState(0);
  const [otherDebts, setOtherDebts] = useState(500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const downPayment = (purchasePrice * downPaymentPct) / 100;
  const mortgage = purchasePrice - downPayment;
  const n = amortYears * 12;

  const stressRate = useMemo(() => Math.max(contractRate + STRESS_BUFFER, MIN_QUALIFYING_RATE), [contractRate]);
  const regularPayment = useMemo(() => monthlyPayment(mortgage, contractRate, n), [mortgage, contractRate, n]);
  const stressPayment = useMemo(() => monthlyPayment(mortgage, stressRate, n), [mortgage, stressRate, n]);

  const housingCosts = stressPayment + propertyTax / 12 + heat / 12 + condoFees / 12;
  const incomeNeededGDS = housingCosts * 12 / 0.39;
  const incomeNeededTDS = (housingCosts * 12 + otherDebts) / 0.44;
  const incomeNeeded = Math.max(incomeNeededGDS, incomeNeededTDS);

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Stress Test Calculator</span>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Shield className="w-4 h-4" />
                OSFI Qualification
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Stress Test</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">See if you qualify under Canada's mortgage stress test rules.</p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3"><Calculator className="w-6 h-6 text-gold-400" /> Property & Mortgage</h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} validation={{ min: 100000, max: 5000000 }} type="currency" />
                    <ValidatedSlider label={`Down Payment (${downPaymentPct}%)`} value={downPaymentPct} onChange={setDownPaymentPct} min={5} max={50} step={1} formatValue={(v) => `${v}% (${formatCurrency(purchasePrice * v / 100, 0)})`} />
                    <ValidatedInput label="Mortgage Rate" value={contractRate} onChange={setContractRate} validation={{ min: 1, max: 15 }} type="percent" />
                    <ValidatedSlider label={`Amortization (${amortYears} years)`} value={amortYears} onChange={setAmortYears} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><DollarSign className="w-6 h-6 text-gold-400" /> Monthly Obligations</h2>
                  <div className="space-y-6">
                    <ValidatedInput label="Annual Property Tax" value={propertyTax} onChange={setPropertyTax} validation={{ min: 0, max: 20000 }} type="currency" />
                    <ValidatedInput label="Annual Heating" value={heat} onChange={setHeat} validation={{ min: 0, max: 5000 }} type="currency" />
                    <ValidatedInput label="Monthly Condo Fees" value={condoFees} onChange={setCondoFees} validation={{ min: 0, max: 3000 }} type="currency" />
                    <ValidatedInput label="Monthly Other Debts" value={otherDebts} onChange={setOtherDebts} validation={{ min: 0, max: 10000 }} type="currency" />
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Income Needed to Qualify</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">{formatCurrency(incomeNeeded, 0)}/yr</p>
                  <p className="text-sm text-gray-300">Based on stress-tested payment at {stressRate.toFixed(2)}%</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold-400" /> Payment Comparison</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Your Rate</span>
                      <span className="font-semibold text-gray-200 text-lg">{contractRate}%</span>
                      <span className="block text-sm text-gray-300">{formatCurrency(regularPayment, 0)}/mo</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 block text-xs">Stress Test Rate</span>
                      <span className="font-semibold text-gold-400 text-lg">{stressRate.toFixed(2)}%</span>
                      <span className="block text-sm text-gold-300">{formatCurrency(stressPayment, 0)}/mo</span>
                    </div>
                  </div>
                  <div className="mt-4 bg-gold-500/10 rounded-lg p-3 border border-gold-500/20">
                    <span className="text-sm text-gold-300">Monthly budget impact: </span>
                    <span className="font-semibold text-gold-400">{formatCurrency(stressPayment - regularPayment, 0)}/mo more</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2"><Home className="w-5 h-5 text-gold-400" /> Qualification Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mortgage Amount</span>
                      <span className="text-gray-200 font-medium">{formatCurrency(mortgage, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Housing Costs (PITH + ½ condo)</span>
                      <span className="text-gray-200 font-medium">{formatCurrency(housingCosts, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Income Needed (GDS 39%)</span>
                      <span className="text-gray-200 font-medium">{formatCurrency(incomeNeededGDS, 0)}/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Income Needed (TDS 44%)</span>
                      <span className="text-gray-200 font-medium">{formatCurrency(incomeNeededTDS, 0)}/yr</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">Understanding This Calculation</h3>
                      <div className="space-y-1 text-sm text-blue-200">
                        <p>• Uses the 2025 OSFI qualifying rate: your rate + 2% (minimum 5.25%)</p>
                        <p>• GDS limit: 39% | TDS limit: 44% (insured mortgages)</p>
                        <p>• Other debts lower the income you can qualify with</p>
                        <p>• Actual qualification depends on credit score, employment, and lender criteria</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Get Pre-Approved</a>
                  <a href="tel:604-593-1550" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Call 604-593-1550</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Understanding Canada&apos;s Mortgage Stress Test</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>Canada&apos;s mortgage stress test was introduced in 2018 by the Office of the Superintendent of Financial Institutions (OSFI) to ensure borrowers could handle potential interest rate increases. The rule requires federally regulated lenders to qualify borrowers at a rate higher than their actual mortgage rate — either the contract rate plus 2 percentage points, or the Bank of Canada&apos;s five-year benchmark rate (currently 5.25%), whichever is higher.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How the Stress Test Protects Borrowers</h3>
              <p>The stress test acts as a financial safety net. If your contract rate is 4.79%, the stress test qualifies you as if your rate were 6.79% (or 5.25%, whichever is higher). This means you must prove you can afford payments at 6.79% — even though you&apos;ll actually pay 4.79%. If rates rise during your term, you have built-in breathing room. Without this buffer, a 2% rate increase on a $700,000 mortgage would add over $800/month to your payment.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">OSFI Rules and Recent Changes</h3>
              <p>In June 2023, OSFI extended the stress test to mortgage renewals when switching lenders. Previously, borrowers could switch to a new lender at renewal without re-qualifying. This change gave existing lenders significant leverage at renewal time. Borrowers staying with their current lender do not need to re-qualify, but those wanting to shop for a better rate at renewal must now pass the stress test at current rates — which may be higher than when they originally qualified.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Tips to Pass the Stress Test</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Increase your down payment</strong> — A lower mortgage means a lower stress-tested payment and lower income requirement.</li>
                <li><strong>Pay off debts before applying</strong> — Reducing car loans, credit card balances, and student loans lowers your TDS ratio.</li>
                <li><strong>Consider a co-signer or co-borrower</strong> — Combining incomes can help meet qualification thresholds.</li>
                <li><strong>Work with a mortgage broker</strong> — Brokers have access to 40+ lenders, some with more flexible qualifying criteria. Kraft Mortgages works with over 40 lending partners to find the right fit.</li>
                <li><strong>Document all income sources</strong> — Bonus income, overtime, rental income, and investment income can all be used if properly documented.</li>
              </ul>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/first-time-home-buyer" className="text-gold-400 hover:text-gold-300 underline">First-Time Home Buyer Calculator</Link>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{faq.a}</motion.div>
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
