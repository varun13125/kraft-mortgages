"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ArrowRight, Info, Home, DollarSign,
  HelpCircle, ChevronDown, ChevronUp, Shield, TrendingUp, Users
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

/* ── Helpers ───────────────────────────────────────── */

function cmhcPremium(downPayment: number, price: number): number {
  if (downPayment >= price * 0.2) return 0;
  const loan = price - downPayment;
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

function monthlyPayment(principal: number, annualRate: number, amortYears: number): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 12;
  const n = amortYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function stressTestRate(contractRate: number): number {
  return Math.max(contractRate + 2, 5.25);
}

/* ── FAQ ───────────────────────────────────────────── */

const faqs = [
  {
    q: "What is GDS and how is it calculated?",
    a: "GDS (Gross Debt Service) ratio is the percentage of your gross monthly income used to cover housing costs: mortgage payment + property taxes + heating + 50% of condo fees (if applicable). For insured mortgages (less than 20% down), the maximum GDS is 32%. For conventional mortgages (20%+ down), it's 35%."
  },
  {
    q: "What is TDS and how is it different from GDS?",
    a: "TDS (Total Debt Service) ratio includes everything in GDS plus all other monthly debt obligations: car payments, credit card minimums, student loans, personal loans, child support, and any other fixed monthly debts. For insured mortgages the max TDS is 40%, for conventional it's 42%. TDS is typically the binding constraint for borrowers with existing debt."
  },
  {
    q: "What counts as income for mortgage qualification?",
    a: "Lenders consider gross annual income including base salary, guaranteed overtime, bonuses (usually averaged over 2 years), commission income, rental income (typically 50-100% net), investment income, and pension income. Self-employed borrowers use averaged net income from tax returns (usually 2-3 years). Part-time and contract income may qualify after 2 years of consistent earnings."
  },
  {
    q: "How does the stress test affect required income?",
    a: "The stress test requires you to qualify at the higher of your contract rate + 2% or 5.25%. This means your monthly payment used for qualification is higher than your actual payment, which increases the income needed. For a $500K mortgage at 4.79%, you'd qualify at 6.79% instead — making the qualifying payment roughly $300-400/month higher."
  },
  {
    q: "How can I improve my qualifying power?",
    a: "Strategies include: paying down existing debts to lower your TDS, increasing your down payment to reduce the mortgage (and potentially avoid CMHC), using the stress test rate for pre-qualification so there are no surprises, consolidating high-interest debt into a lower payment, adding a co-signer or joint applicant, and ensuring all qualifying income is documented properly."
  }
];

export default function RequiredIncomePage() {
  const [homePrice, setHomePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(4.79);
  const [amortization, setAmortization] = useState(25);
  const [propertyTax, setPropertyTax] = useState(350);
  const [heating, setHeating] = useState(120);
  const [condoFees, setCondoFees] = useState(0);
  const [otherDebts, setOtherDebts] = useState(400);
  const [tab, setTab] = useState<"income" | "maxMortgage">("income");
  const [userIncome, setUserIncome] = useState(100000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const downPayment = homePrice * downPaymentPct / 100;
  const baseMortgage = homePrice - downPayment;
  const cmhc = cmhcPremium(downPayment, homePrice);
  const totalMortgage = baseMortgage + cmhc;
  const isInsured = downPaymentPct < 20;

  const maxGDS = isInsured ? 0.32 : 0.35;
  const maxTDS = isInsured ? 0.40 : 0.42;

  const stRate = stressTestRate(mortgageRate);
  const stMonthly = monthlyPayment(totalMortgage, stRate, amortization);
  const actualMonthly = monthlyPayment(totalMortgage, mortgageRate, amortization);

  const condoHalf = condoFees * 0.5;
  const housingCosts = stMonthly + propertyTax + heating + condoHalf;
  const totalDebt = housingCosts + otherDebts;

  const annualIncomeGDS = housingCosts / maxGDS * 12;
  const annualIncomeTDS = totalDebt / maxTDS * 12;
  const requiredAnnualIncome = Math.max(annualIncomeGDS, annualIncomeTDS);
  const requiredMonthlyIncome = requiredAnnualIncome / 12;
  const gdsPct = (housingCosts / requiredMonthlyIncome) * 100;
  const tdsPct = (totalDebt / requiredMonthlyIncome) * 100;

  // Inverse: max mortgage for given income
  const userMonthlyIncome = userIncome / 12;
  const maxHousing = userMonthlyIncome * maxGDS;
  const maxTotalDebt = userMonthlyIncome * maxTDS;
  const availableForHousing = Math.min(maxHousing, maxTotalDebt - otherDebts);
  const nonMortgageHousing = propertyTax + heating + condoHalf;
  const maxQualifyingPayment = Math.max(availableForHousing - nonMortgageHousing, 0);
  const maxQualifyingMortgage = maxQualifyingPayment > 0
    ? maxQualifyingPayment * (Math.pow(1 + stRate / 12, amortization * 12) - 1) / ((stRate / 12) * Math.pow(1 + stRate / 12, amortization * 12))
    : 0;

  const gdsLimiting = annualIncomeGDS >= annualIncomeTDS;

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
              <span className="text-gold-400">Required Income Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <TrendingUp className="w-4 h-4" />
                Mortgage Qualification
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Required Income</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Find out the minimum income needed to qualify for a mortgage — or see how much mortgage you can afford on your salary.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tab Toggle */}
        <section className="pb-4 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 rounded-xl p-1 flex border border-white/20">
              <button
                onClick={() => setTab("income")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tab === "income" ? "bg-gold-500 text-black" : "text-gray-300 hover:text-gray-100"
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-1" />
                Income Needed
              </button>
              <button
                onClick={() => setTab("maxMortgage")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tab === "maxMortgage" ? "bg-gold-500 text-black" : "text-gray-300 hover:text-gray-100"
                }`}
              >
                <Home className="w-4 h-4 inline mr-1" />
                Max Mortgage
              </button>
            </div>
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
                    <Calculator className="w-6 h-6 text-gold-400" />
                    {tab === "income" ? "Property & Financing Details" : "Your Financial Details"}
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput
                      label="Home Purchase Price"
                      value={homePrice}
                      onChange={setHomePrice}
                      validation={{ min: 100000, max: 3000000 }}
                      type="currency"
                    />
                    <ValidatedSlider
                      label={`Down Payment (${downPaymentPct}%)`}
                      value={downPaymentPct}
                      onChange={setDownPaymentPct}
                      min={5}
                      max={35}
                      step={1}
                      formatValue={(v) => `${v}% (${formatCurrency(homePrice * v / 100, 0)})`}
                    />
                    <ValidatedInput
                      label="Mortgage Rate (%)"
                      value={mortgageRate}
                      onChange={setMortgageRate}
                      validation={{ min: 0.5, max: 15 }}
                      type="percentage"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amortization</label>
                      <div className="flex gap-2">
                        {[25, 30].map((y) => (
                          <button
                            key={y}
                            onClick={() => setAmortization(y)}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                              amortization === y
                                ? "bg-gold-500 text-black border-gold-500"
                                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {y} Years
                          </button>
                        ))}
                      </div>
                    </div>
                    <ValidatedInput
                      label="Property Tax (/month)"
                      value={propertyTax}
                      onChange={setPropertyTax}
                      validation={{ min: 0, max: 2000 }}
                      type="currency"
                    />
                    <ValidatedInput
                      label="Heating Costs (/month)"
                      value={heating}
                      onChange={setHeating}
                      validation={{ min: 0, max: 500 }}
                      type="currency"
                    />
                    <ValidatedInput
                      label="Condo Fees (/month, optional)"
                      value={condoFees}
                      onChange={setCondoFees}
                      validation={{ min: 0, max: 3000 }}
                      type="currency"
                    />
                    <ValidatedInput
                      label="Other Monthly Debts"
                      value={otherDebts}
                      onChange={setOtherDebts}
                      validation={{ min: 0, max: 10000 }}
                      type="currency"
                    />
                    {tab === "maxMortgage" && (
                      <ValidatedInput
                        label="Your Gross Annual Income"
                        value={userIncome}
                        onChange={setUserIncome}
                        validation={{ min: 30000, max: 500000 }}
                        type="currency"
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {tab === "income" ? (
                  <>
                    {/* Required Income */}
                    <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                      <p className="text-sm text-gold-300 font-medium mb-1">Minimum Gross Annual Income</p>
                      <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                        {formatCurrency(requiredAnnualIncome, 0)}
                      </p>
                      <p className="text-sm text-gray-300">
                        {formatCurrency(requiredMonthlyIncome, 0)}/month gross · Limited by {gdsLimiting ? "GDS" : "TDS"} ratio
                      </p>
                    </div>

                    {/* Ratio Breakdown */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gold-400" />
                        GDS / TDS Breakdown
                      </h4>
                      <div className="space-y-4">
                        {/* GDS */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">GDS ({(maxGDS * 100).toFixed(0)}% max)</span>
                            <span className={`font-semibold ${gdsPct > maxGDS * 100 ? "text-red-400" : "text-gray-200"}`}>
                              {gdsPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${gdsPct > maxGDS * 100 ? "bg-red-500" : "bg-gold-500"}`}
                              style={{ width: `${Math.min(gdsPct, 100)}%` }}
                            />
                          </div>
                          <div className="mt-2 space-y-1 text-xs text-gray-400">
                            <div className="flex justify-between">
                              <span>Mortgage (stress test)</span>
                              <span>{formatCurrency(stMonthly, 0)}/mo</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Property Tax</span>
                              <span>{formatCurrency(propertyTax, 0)}/mo</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Heating</span>
                              <span>{formatCurrency(heating, 0)}/mo</span>
                            </div>
                            {condoFees > 0 && (
                              <div className="flex justify-between">
                                <span>Condo Fees (50%)</span>
                                <span>{formatCurrency(condoHalf, 0)}/mo</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold text-gray-200">
                              <span>Total Housing</span>
                              <span>{formatCurrency(housingCosts, 0)}/mo</span>
                            </div>
                          </div>
                        </div>

                        {/* TDS */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">TDS ({(maxTDS * 100).toFixed(0)}% max)</span>
                            <span className={`font-semibold ${tdsPct > maxTDS * 100 ? "text-red-400" : "text-gray-200"}`}>
                              {tdsPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${tdsPct > maxTDS * 100 ? "bg-red-500" : "bg-blue-500"}`}
                              style={{ width: `${Math.min(tdsPct, 100)}%` }}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                              <span>Other Debts</span>
                              <span>{formatCurrency(otherDebts, 0)}/mo</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-200">
                              <span>Total All Debts</span>
                              <span>{formatCurrency(totalDebt, 0)}/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Actual Payment</span>
                        <span className="text-xl font-bold text-gray-100">{formatCurrency(actualMonthly, 0)}/mo</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Stress Test Payment</span>
                        <span className="text-xl font-bold text-amber-400">{formatCurrency(stMonthly, 0)}/mo</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Stress Test Rate</span>
                        <span className="text-xl font-bold text-gray-100">{stRate.toFixed(2)}%</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Mortgage Type</span>
                        <span className="text-xl font-bold text-gray-100">{isInsured ? "Insured" : "Conventional"}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Max Mortgage */}
                    <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                      <p className="text-sm text-gold-300 font-medium mb-1">Maximum Qualifying Mortgage</p>
                      <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                        {formatCurrency(maxQualifyingMortgage, 0)}
                      </p>
                      <p className="text-sm text-gray-300">
                        On {formatCurrency(userIncome, 0)} annual income at {stRate.toFixed(2)}% qualifying rate
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-gold-400" />
                        What You Can Afford
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Max qualifying mortgage</span>
                          <span className="font-semibold text-gold-400">{formatCurrency(maxQualifyingMortgage, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">+ Down payment ({downPaymentPct}%)</span>
                          <span className="font-semibold text-gray-200">{formatCurrency(downPayment, 0)}</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 flex justify-between">
                          <span className="font-semibold text-gray-200">Max home price</span>
                          <span className="font-bold text-gold-400 text-lg">{formatCurrency(maxQualifyingMortgage + downPayment, 0)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Based on {formatCurrency(userIncome, 0)} gross annual income, {downPaymentPct}% down, {amortization}-year amortization, {mortgageRate}% rate
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Max Monthly Housing</span>
                        <span className="text-xl font-bold text-gray-100">{formatCurrency(Math.min(maxHousing, maxTotalDebt - otherDebts), 0)}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Qualifying Rate</span>
                        <span className="text-xl font-bold text-gray-100">{stRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </>
                )}

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

        {/* Info Box */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding This Calculator</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Qualifying ratios: GDS {isInsured ? "32%" : "35%"} max, TDS {isInsured ? "40%" : "42%"} max.</p>
                    <p>• Stress test rate: higher of contract rate + 2% or 5.25% — this is what lenders use for qualification.</p>
                    <p>• Heating costs default to $120/month (average). Property tax defaults to $350/month.</p>
                    <p>• 50% of condo fees are included in GDS calculation per CMHC guidelines.</p>
                    <p>• Actual qualification depends on credit score, employment history, and lender-specific criteria.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">How Much Income Do You Need to Buy a Home in Canada?</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                One of the most important questions when buying a home is: &quot;Do I earn enough?&quot; Lenders in Canada use two key ratios — GDS and TDS — to determine whether your income supports the mortgage you&apos;re applying for. This calculator shows you exactly how much gross annual income you need based on current CMHC qualifying rules and the federal stress test.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">GDS vs TDS: What Lenders Look For</h3>
              <p>
                The <strong>Gross Debt Service (GDS)</strong> ratio measures what percentage of your gross monthly income goes toward housing costs: mortgage payment, property taxes, heating, and half of condo fees (if applicable). For insured mortgages (less than 20% down), GDS must not exceed 32%. For conventional mortgages, the limit is 35%.
              </p>
              <p>
                The <strong>Total Debt Service (TDS)</strong> ratio adds all other monthly obligations on top of housing costs — car loans, credit card payments, student loans, personal loans, and child support payments. TDS is capped at 40% for insured mortgages and 42% for conventional. TDS is often the binding constraint for borrowers with significant existing debt.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Stress Test Impact</h3>
              <p>
                Since 2018, all insured mortgages and most conventional mortgages must qualify at the Bank of Canada&apos;s stress test rate — the higher of your contract rate plus 2 percentage points or 5.25%. This means if your actual mortgage rate is 4.79%, you must qualify as if the rate were 6.79%. The stress test adds approximately $300-500/month to the qualifying payment on a typical mortgage, increasing the income needed by $10,000 to $20,000 per year.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What Counts as Income</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Base salary:</strong> Full-time guaranteed income — most straightforward to qualify with.</li>
                <li><strong>Overtime & bonus:</strong> Typically averaged over 2 years; must be consistent and documented.</li>
                <li><strong>Commission:</strong> Averaged over 2 years with T4s or NOAs to verify.</li>
                <li><strong>Rental income:</strong> Usually 50% of net rental income added to qualifying income (some lenders use 100% with offset).</li>
                <li><strong>Self-employed:</strong> Based on net income from Line 15000 of tax returns, averaged over 2-3 years.</li>
                <li><strong>Investment & pension:</strong> Can qualify if consistent and documented.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Improve Your Qualifying Power</h3>
              <p>
                If the calculator shows you need more income than you have, there are several strategies. First, pay down existing debts — reducing a $400/month car payment to $0 can increase your qualifying power by roughly $80,000 in mortgage amount. Second, increase your down payment, which reduces the mortgage and potentially eliminates CMHC (shifting you to more lenient conventional ratios). Third, consider a longer amortization (30 years) to lower the monthly payment. Fourth, a co-signer or joint applicant adds their income to the qualification. Finally, shop around — some lenders have flexibility on ratios, especially for borrowers with strong credit or unique income structures.
              </p>

              <p>
                Kraft Mortgages has helped thousands of Canadian homebuyers understand their qualification. With 23 years of experience and over $2 billion in funded mortgages, we know how to structure your application for success. Call <a href="tel:604-593-1550" className="text-gold-400 hover:text-gold-300">604-593-1550</a> or visit us at #301 - 1688 152nd Street, Surrey, BC.
              </p>

              <div className="mt-8">
                <Link href="/calculators/debt-service-ratio" className="text-gold-400 hover:text-gold-300 underline">Debt Service Ratio Calculator</Link>
                {" · "}
                <Link href="/calculators/stress-test" className="text-gold-400 hover:text-gold-300 underline">Stress Test Calculator</Link>
                {" · "}
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
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
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-gray-200 pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Required Income Calculator Canada",
              "description": "Calculate the minimum income needed to qualify for a mortgage in Canada. Includes GDS/TDS ratios, stress test, and reverse mortgage qualification.",
              "url": "https://www.kraftmortgages.ca/calculators/required-income",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
              "provider": {
                "@type": "Organization",
                "name": "Kraft Mortgages",
                "telephone": "604-593-1550",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "#301 - 1688 152nd Street",
                  "addressLocality": "Surrey",
                  "addressRegion": "BC",
                  "postalCode": "V4A 4N2",
                  "addressCountry": "CA"
                }
              }
            })
          }}
        />
      </main>
    </>
  );
}
