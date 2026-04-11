"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ArrowRight, Info, ChevronDown, ChevronUp, Shield, FileText,
  AlertTriangle, HelpCircle, Building2, Landmark, TrendingDown, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

type LoanPosition = "1st" | "2nd";
type CreditRange = "excellent" | "good" | "fair" | "poor";
type IncomeVerification = "bank-stmts" | "none" | "stated";

const creditMap: Record<CreditRange, { label: string; min: number; max: number }> = {
  excellent: { label: "Excellent (680+)", min: 680, max: 900 },
  good: { label: "Good (600–679)", min: 600, max: 679 },
  fair: { label: "Fair (500–599)", min: 500, max: 599 },
  poor: { label: "Poor (below 500)", min: 300, max: 499 },
};

const bLenderData = [
  { name: "Bridgewater Bank", rate: "4.99–6.04%", fee: "1%", ltv: "80%", beacon: "550+" },
  { name: "National Bank Optimum Mortgage", rate: "4.89–5.99%", fee: "1%", ltv: "80%", beacon: "500+" },
  { name: "Equitable Bank", rate: "6.44–8.14%", fee: "$995 setup", ltv: "varies", beacon: "—" },
  { name: "Home Trust", rate: "7.49–14.49%", fee: "1–2%", ltv: "80%", beacon: "—" },
  { name: "CMLS AVEO", rate: "N/S", fee: "$350-450", ltv: "80%", beacon: "—" },
  { name: "B2B Bank", rate: "N/S", fee: "varies", ltv: "50–75%", beacon: "—" },
];

const equityLenderData = [
  { name: "Capital Direct", first: "4.89–6.39%", second: "7.49–8.59%", fee: "1% / 2.5%" },
  { name: "Neighbourhood Holdings", first: "5.80–9.25%", second: "N/S", fee: "1% (open) / 0 (closed)" },
  { name: "Vault Capital", first: "5.25–7.25%", second: "N/S", fee: "1–2%" },
  { name: "Sequence Capital", first: "5.99–7.75%", second: "N/S", fee: "1%" },
  { name: "Antrim Investments", first: "6.95–7.49%", second: "8.95–10.95%", fee: "1% / 2%" },
  { name: "VWR Capital", first: "Province-based", second: "Province-based", fee: "$750–$5,750" },
  { name: "Secure Capital MIC", first: "6.99–9.99%", second: "N/S", fee: "2–3% / 3–4%" },
  { name: "LCM Capital", first: "7.45%+", second: "10.45%+", fee: "1% / 1.5%" },
  { name: "First Circle Financial", first: "N/S", second: "N/S", fee: "1% / 1.5–2%" },
];

const faqs = [
  {
    q: "What is the main difference between B-lenders and equity lenders?",
    a: "B-lenders are licensed financial institutions that offer alternative lending with relaxed income requirements — they accept bank statements instead of tax returns but still verify your ability to make payments. Equity lenders (also called private lenders) lend primarily based on the property's equity, with minimal or no income verification. B-lender rates are typically 5–9%, while equity lender rates range from 4.89–11%+."
  },
  {
    q: "When should I choose equity lending over a B-lender?",
    a: "Equity lending makes sense when: your credit score is below 500, you have no income documentation at all, you need funds extremely quickly (days vs weeks), or your LTV exceeds 80%. If you have a credit score above 500, some income documentation (even bank statements), and LTV at or below 80%, a B-lender will almost always be cheaper."
  },
  {
    q: "Why do equity lenders charge more for second mortgages?",
    a: "A second mortgage is subordinate to the first — if the property goes into foreclosure, the first lender gets paid first. This means the second lender takes on significantly more risk. For example, Antrim charges 7.49–7.95% on first mortgages but 8.95–10.95% on seconds, and their fee doubles from 1% to 2%."
  },
  {
    q: "How do lender fees affect the total cost?",
    a: "A 1% fee on a $500,000 mortgage is $5,000 upfront. Over a 5-year term at 6.49% vs 6.95%, the rate difference alone costs roughly $12,000 more in interest — far more than the fee. When comparing options, always look at total cost (interest + fees) over the full term, not just the rate."
  },
  {
    q: "Can I switch from an equity lender to a B-lender or A-lender later?",
    a: "Yes. Many borrowers use equity or B-lending as a bridge solution. Once your credit improves, your income documentation is in order, or you've built sufficient equity, you can refinance into a B-lender or even an A-lender at significantly lower rates. This is a common strategy and something a mortgage broker can plan for from day one."
  }
];

function calcMonthly(principal: number, annualRate: number, amortYears: number): number {
  if (annualRate === 0) return principal / (amortYears * 12);
  const r = annualRate / 100 / 12;
  const n = amortYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function BvsEquityPage() {
  const [mortgageAmount, setMortgageAmount] = useState(500000);
  const [propertyValue, setPropertyValue] = useState(750000);
  const [position, setPosition] = useState<LoanPosition>("1st");
  const [term, setTerm] = useState(5);
  const [amortization, setAmortization] = useState(25);
  const [bRate, setBRate] = useState(5.49);
  const [eRate, setERate] = useState(6.95);
  const [bFee, setBFee] = useState(1.0);
  const [eFee, setEFee] = useState(1.0);
  const [creditRange, setCreditRange] = useState<CreditRange>("good");
  const [incomeVerification, setIncomeVerification] = useState<IncomeVerification>("bank-stmts");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ltv = (mortgageAmount / propertyValue) * 100;

  const canQualifyB = useMemo(() => {
    const creditOk = creditMap[creditRange].min >= 500;
    const ltvOk = ltv <= 80;
    const incomeOk = incomeVerification === "bank-stmts" || incomeVerification === "stated";
    return creditOk && ltvOk && incomeOk;
  }, [creditRange, ltv, incomeVerification]);

  const bMonthly = calcMonthly(mortgageAmount, bRate, amortization);
  const eMonthly = calcMonthly(mortgageAmount, eRate, amortization);
  const bTotalInterest = bMonthly * term * 12 - mortgageAmount;
  const eTotalInterest = eMonthly * term * 12 - mortgageAmount;
  const bFees = mortgageAmount * (bFee / 100);
  const eFees = mortgageAmount * (eFee / 100);
  const bTotalCost = bTotalInterest + bFees;
  const eTotalCost = eTotalInterest + eFees;
  const difference = eTotalCost - bTotalCost;

  const pyramidTiers = [
    { label: "A-Lenders", desc: "Banks & credit unions — best rates, strictest rules", color: canQualifyB ? "text-gray-500" : "text-gray-500", bgColor: "bg-gray-600/30", borderColor: "border-gray-600/50", highlight: false },
    { label: "B-Lenders", desc: "Alternative lenders — bank statements OK, credit 500+", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/40", highlight: canQualifyB },
    { label: "Equity Lenders", desc: "Private lenders — equity-based, minimal docs", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/40", highlight: !canQualifyB },
  ];

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
              <span className="text-gold-400">B-Lender vs Equity Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Landmark className="w-4 h-4" />
                Lender Comparison Tool
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">B-Lender vs Equity</span> Lending Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Compare B-lender and private equity lending side by side with real Canadian lender rates. See which option costs less — and why.
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
                    <Calculator className="w-6 h-6 text-gold-400" />
                    Mortgage Details
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Mortgage Amount Needed" value={mortgageAmount} onChange={setMortgageAmount} validation={{ min: 50000, max: 5000000 }} type="currency" />
                    <ValidatedInput label="Property Value" value={propertyValue} onChange={setPropertyValue} validation={{ min: 100000, max: 10000000 }} type="currency" />
                    <div className="flex gap-4 text-sm">
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 block text-xs">LTV Ratio</span>
                        <span className={`font-semibold ${ltv > 80 ? "text-red-400" : "text-green-400"}`}>{ltv.toFixed(1)}%</span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 block text-xs">Equity</span>
                        <span className="font-semibold text-gray-200">{formatCurrency(propertyValue - mortgageAmount, 0)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Loan Position</label>
                      <div className="flex gap-2">
                        {(["1st", "2nd"] as const).map((p) => (
                          <button key={p} onClick={() => { setPosition(p); setEFee(p === "2nd" ? 2.0 : 1.0); }}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${position === p ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {p === "1st" ? "1st Mortgage" : "2nd Mortgage"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ValidatedSlider label={`Term (${term} years)`} value={term} onChange={setTerm} min={1} max={5} step={1} formatValue={(v) => `${v} year${v > 1 ? "s" : ""}`} />
                    <ValidatedSlider label={`Amortization (${amortization} years)`} value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                    <div className="grid grid-cols-2 gap-4">
                      <ValidatedInput label="B-Lender Rate (%)" value={bRate} onChange={setBRate} validation={{ min: 3, max: 15 }} type="percentage" />
                      <ValidatedInput label="Equity Lender Rate (%)" value={eRate} onChange={setERate} validation={{ min: 5, max: 18 }} type="percentage" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <ValidatedInput label="B-Lender Fee (%)" value={bFee} onChange={setBFee} validation={{ min: 0, max: 5 }} type="percentage" />
                      <ValidatedInput label="Equity Lender Fee (%)" value={eFee} onChange={setEFee} validation={{ min: 0, max: 5 }} type="percentage" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Credit Score Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(creditMap) as [CreditRange, typeof creditMap.excellent][]).map(([key, val]) => (
                          <button key={key} onClick={() => setCreditRange(key)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${creditRange === key ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {val.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Income Verification</label>
                      <div className="flex flex-col gap-2">
                        {([["bank-stmts", "Yes — Bank Statements"], ["none", "No Documentation"], ["stated", "Stated Income"]] as [IncomeVerification, string][]).map(([key, label]) => (
                          <button key={key} onClick={() => setIncomeVerification(key)}
                            className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all border text-left ${incomeVerification === key ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Qualification Status */}
                <div className={`backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${canQualifyB ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {canQualifyB ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-amber-400" />}
                    <h3 className="text-lg font-bold text-gray-100">
                      {canQualifyB ? "You May Qualify for a B-Lender" : "Equity Lending Is Your Best Option"}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Credit: {creditMap[creditRange].label} {creditMap[creditRange].min >= 500 ? "✓" : "✗ (need 500+)"}</p>
                    <p>• LTV: {ltv.toFixed(1)}% {ltv <= 80 ? "✓" : "✗ (need ≤80%)"}</p>
                    <p>• Income docs: {incomeVerification === "bank-stmts" ? "Bank statements ✓" : incomeVerification === "stated" ? "Stated income ✓" : "None ✗"}</p>
                  </div>
                </div>

                {/* Pyramid */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold mb-4 text-center text-gray-200">Canadian Lending Hierarchy</h4>
                  <div className="flex flex-col items-center gap-2">
                    {pyramidTiers.map((tier, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                        className={`w-full rounded-xl p-4 border-2 text-center transition-all ${tier.bgColor} ${tier.borderColor} ${tier.highlight ? "ring-2 ring-gold-400 shadow-lg shadow-gold-500/20" : ""}`}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className={`font-bold ${tier.color}`}>{tier.label}</span>
                          {tier.highlight && <span className="text-[10px] bg-gold-500 text-black px-2 py-0.5 rounded-full font-bold">YOUR FIT</span>}
                        </div>
                        <p className="text-xs text-gray-400">{tier.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {canQualifyB ? (
                  <>
                    {/* Side-by-side comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/30">
                        <p className="text-xs text-blue-400 font-semibold mb-1">B-LENDER</p>
                        <p className="text-2xl font-bold text-gray-100 mb-4">{formatCurrency(bTotalCost, 0)}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400">Monthly Payment</span><span className="text-gray-200">{formatCurrency(bMonthly, 0)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Interest ({term}yr)</span><span className="text-gray-200">{formatCurrency(bTotalInterest, 0)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Lender Fee</span><span className="text-gray-200">{formatCurrency(bFees, 0)}</span></div>
                        </div>
                      </div>
                      <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl p-5 border border-amber-500/30">
                        <p className="text-xs text-amber-400 font-semibold mb-1">EQUITY LENDER</p>
                        <p className="text-2xl font-bold text-gray-100 mb-4">{formatCurrency(eTotalCost, 0)}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400">Monthly Payment</span><span className="text-gray-200">{formatCurrency(eMonthly, 0)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Interest ({term}yr)</span><span className="text-gray-200">{formatCurrency(eTotalInterest, 0)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Lender Fee</span><span className="text-gray-200">{formatCurrency(eFees, 0)}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Difference */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingDown className="w-5 h-5 text-gold-400" />
                        <span className="font-semibold text-gray-200">Cost Comparison</span>
                      </div>
                      <p className="text-lg text-gray-300">
                        Equity lending costs <span className="text-red-400 font-bold">{formatCurrency(difference, 0)}</span> more over the {term}-year term.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        However, equity lending requires less documentation and faster approval — sometimes closing in days vs weeks.
                      </p>
                    </div>
                  </>
                ) : (
                  /* No B-lender: equity recommendation */
                  <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
                    <h4 className="font-bold text-amber-300 mb-3">Equity Lending Recommendation</h4>
                    <p className="text-sm text-gray-300 mb-4">
                      Based on your inputs, equity lending is your most accessible option. Here&apos;s why:
                    </p>
                    <div className="space-y-2 text-sm text-gray-300">
                      {creditMap[creditRange].min < 500 && <p>• Credit below 500 — most B-lenders require a minimum 500 Beacon score</p>}
                      {ltv > 80 && <p>• LTV of {ltv.toFixed(1)}% exceeds the 80% maximum for most B-lenders</p>}
                      {incomeVerification === "none" && <p>• No income documentation — equity lenders lend on property value, not income</p>}
                    </div>
                    <div className="mt-4 bg-white/5 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Estimated equity lender rates for your situation ({position} mortgage):</p>
                      <div className="space-y-1 text-sm">
                        <p>• Antrim: {position === "1st" ? "7.49–7.95%" : "8.95–10.95%"} ({position === "1st" ? "1%" : "2%"} fee)</p>
                        <p>• LCM Capital: {position === "1st" ? "7.45%+" : "10.45%+"} ({position === "1st" ? "1%" : "1.5%"} fee)</p>
                        <p>• Secure Capital MIC: 6.99–9.99% ({position === "1st" ? "2–3%" : "3–4%"} fee)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Expert Advice
                  </Link>
                  <Link href="/calculators" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    All Calculators
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
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding This Comparison</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Rates shown are based on current lender data and may change. Always confirm with your broker.</p>
                    <p>• B-lender qualification depends on more than just credit score and LTV — property type, location, and exit strategy all matter.</p>
                    <p>• Lender fees are typically deducted from the advance (you receive less than the face amount).</p>
                    <p>• This calculator provides estimates only — actual costs depend on the specific lender and deal structure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">B-Lenders vs Equity Lenders — Complete Guide</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What Is the Difference Between B-Lenders and Equity Lenders?</h3>
              <p>
                The Canadian mortgage market operates on a three-tier system. At the top are A-lenders — major banks and credit unions that offer the lowest rates but have the strictest qualification requirements. When you don&apos;t fit the A-lender box (perhaps you&apos;re self-employed, have recent credit issues, or need an unusual property type), you move to the next tier.
              </p>
              <p>
                <strong>B-lenders</strong> (also called alternative lenders) are licensed financial institutions that bridge the gap between banks and private lenders. Companies like Bridgewater Bank, Home Trust, and Equitable Bank offer rates typically 1–4% above bank rates but with significantly more flexible qualification criteria. Most B-lenders accept bank statements instead of tax returns to verify income, and some accept stated income. They typically require a minimum Beacon score of 500 and loan-to-value ratios at or below 80%.
              </p>
              <p>
                <strong>Equity lenders</strong> (private lenders and mortgage investment corporations) operate at the bottom of the hierarchy. They lend primarily based on the property&apos;s value and the equity cushion — not your income or credit score. This makes them the most accessible option but also the most expensive, with rates ranging from 7% to over 14% depending on the lender, position, and risk profile.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Does Equity Lending Make Sense Over B-Lending?</h3>
              <p>
                Despite the higher cost, equity lending is the right choice in several situations. If your credit score is below 500, you won&apos;t qualify for any B-lender — equity lending may be your only option. If you have no income documentation whatsoever (not even bank statements), equity lenders don&apos;t care about your income. If you need funds in days rather than weeks, equity lenders can often close within 48–72 hours compared to 2–4 weeks for B-lenders. And if your LTV exceeds 80%, most B-lenders won&apos;t touch the deal, but some equity lenders will go higher.
              </p>
              <p>
                Many borrowers use equity lending as a short-term bridge. They take an equity mortgage to solve an immediate problem (tax arrears, urgent renovation, time-sensitive purchase), then refinance into a B-lender or A-lender once their situation improves. A good mortgage broker will build this exit strategy into the plan from day one.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Understanding 1st vs 2nd Mortgage Rates</h3>
              <p>
                One of the biggest factors affecting your cost is whether the mortgage is in first or second position. A first mortgage has priority — if the property is sold or foreclosed, the first lender gets paid first. A second mortgage is subordinate, meaning the second lender takes on significantly more risk.
              </p>
              <p>
                This risk difference shows up clearly in the rates. Antrim Investments charges 7.49–7.95% for first mortgages but 8.95–10.95% for seconds — a 1.5–3% premium. Their fee doubles from 1% to 2%. LCM Capital charges 7.45%+ for firsts but 10.45%+ for seconds. The pattern is consistent across all equity lenders: expect to pay 2–4% more for a second mortgage.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How Lender Fees Affect Your Total Cost</h3>
              <p>
                Lender fees are easy to underestimate because they&apos;re quoted as a percentage rather than a dollar amount. A &quot;1% fee&quot; on a $500,000 mortgage is $5,000 — and that&apos;s on top of your interest payments. Some equity lenders charge 3–4% on second mortgages, which means $15,000–$20,000 in fees alone on a $500,000 deal.
              </p>
              <p>
                Importantly, lender fees are typically deducted from the mortgage advance. If you need $500,000 and the lender charges a 2% fee ($10,000), the mortgage will be registered for approximately $510,000 so you net $500,000 after the fee is deducted. This means you&apos;re paying interest on a slightly larger amount than you actually receive.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Real Example: $500,000 Mortgage Over 5 Years</h3>
              <p>
                Let&apos;s say you need $500,000 with a property worth $750,000 (66.7% LTV), 25-year amortization, and you qualify for both B-lender and equity options. At a B-lender rate of 5.49%, your monthly payment is approximately $3,358. Over 5 years, you&apos;d pay about $101,500 in interest plus a 1% fee ($5,000), for a total cost of $106,500. At an equity lender rate of 6.95%, your monthly payment rises to approximately $3,457. Over the same 5 years, interest totals about $107,400 plus fees ($5,000), for a total of $112,400. The difference? Roughly $5,900 more with the equity lender over 5 years — but with minimal documentation and potentially a week faster closing.
              </p>

              <div className="mt-8">
                <Link href="/calculators" className="text-gold-400 hover:text-gold-300 underline">All Calculators</Link>
                {" · "}
                <Link href="/calculators/refinance-vs-heloc-vs-second" className="text-gold-400 hover:text-gold-300 underline">Refinance vs HELOC vs Second Mortgage Calculator</Link>
                {" · "}
                <Link href="/calculators/self-employed-a-vs-b" className="text-gold-400 hover:text-gold-300 underline">Self-Employed A vs B Lender Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lender Rate Tables */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Current B-Lender & Equity Lender Rates</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">B-Lenders</h3>
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-white/5 text-gray-400"><th className="text-left p-3">Lender</th><th className="text-right p-3">Rate</th><th className="text-right p-3">Fee</th><th className="text-right p-3">LTV</th></tr></thead>
                    <tbody>
                      {bLenderData.map((l, i) => (
                        <tr key={i} className="border-t border-white/5"><td className="p-3 text-gray-200">{l.name}</td><td className="text-right p-3 text-gray-300">{l.rate}</td><td className="text-right p-3 text-gray-300">{l.fee}</td><td className="text-right p-3 text-gray-300">{l.ltv}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-4">Equity Lenders</h3>
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-white/5 text-gray-400"><th className="text-left p-3">Lender</th><th className="text-right p-3">1st Rate</th><th className="text-right p-3">2nd Rate</th><th className="text-right p-3">Fee</th></tr></thead>
                    <tbody>
                      {equityLenderData.map((l, i) => (
                        <tr key={i} className="border-t border-white/5"><td className="p-3 text-gray-200">{l.name}</td><td className="text-right p-3 text-gray-300">{l.first}</td><td className="text-right p-3 text-gray-300">{l.second}</td><td className="text-right p-3 text-gray-300">{l.fee}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">Rates current as of April 2025. Subject to change. Contact us for current pricing.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
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

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "B-Lender vs Equity Lending Calculator",
        "description": "Compare B-lender and private equity lending costs side by side with real Canadian lender rates.",
        "url": "https://www.kraftmortgages.ca/calculators/b-vs-equity",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
        "provider": { "@type": "Organization", "name": "Kraft Mortgages", "telephone": "604-593-1550", "address": { "@type": "PostalAddress", "streetAddress": "#301 - 1688 152nd Street", "addressLocality": "Surrey", "addressRegion": "BC", "postalCode": "V4A 4N2", "addressCountry": "CA" } },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "142" }
      })}} />
    </>
  );
}
