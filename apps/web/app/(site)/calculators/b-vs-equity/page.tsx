"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Info, ChevronDown, ChevronUp, Shield, FileText,
  AlertTriangle, HelpCircle, Building2, Landmark, TrendingDown, CheckCircle2, XCircle, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { useLiveRates } from "@/lib/useLiveRates";
import { liveBenchmark, liveRate, ratesAsOf, useLiveDefault, type LiveRateProduct } from "../_lib/liveRateDefaults";
import { LiveRateNote } from "../_lib/LiveRateNote";

type LoanPosition = "1st" | "2nd";
type CreditRange = "excellent" | "good" | "fair" | "poor";
type IncomeVerification = "bank-stmts" | "none" | "stated";

const creditMap: Record<CreditRange, { label: string; min: number; max: number }> = {
  excellent: { label: "Excellent (680+)", min: 680, max: 900 },
  good: { label: "Good (600–679)", min: 600, max: 679 },
  fair: { label: "Fair (500–599)", min: 500, max: 599 },
  poor: { label: "Poor (below 500)", min: 300, max: 499 },
};

// The April 2025 named-lender rate tables were removed (18 months stale, unsourced). The page now shows live
// benchmarks from /api/rates with an "as of" date. Equity-lender FIRST mortgages have no live benchmark, so the
// 1st-position default stays illustrative; 2nd position follows the live private-second benchmark.
const EQUITY_FIRST_ILLUSTRATIVE_RATE = 6.95;

/** B-lender fixed-rate benchmark closest to the chosen term. */
function altProductForTerm(term: number): LiveRateProduct {
  if (term <= 1) return "alt1Fixed";
  if (term === 2) return "alt2Fixed";
  if (term === 3) return "alt3Fixed";
  return "alt5Fixed";
}

const BENCHMARK_ROWS: { key: string; label: string }[] = [
  { key: "alt_1_year_fixed", label: "B-lender 1-year fixed" },
  { key: "alt_2_year_fixed", label: "B-lender 2-year fixed" },
  { key: "alt_3_year_fixed", label: "B-lender 3-year fixed" },
  { key: "alt_5_year_fixed", label: "B-lender 5-year fixed" },
  { key: "alt_bfs_stated_income", label: "B-lender stated income (self-employed)" },
  { key: "alt_heloc", label: "B-lender HELOC" },
  { key: "private_second", label: "Private 2nd mortgage" },
];

const faqs = [
  {
    q: "What is the main difference between B-lenders and equity lenders?",
    a: "B-lenders are licensed financial institutions that offer alternative lending with relaxed income requirements — they accept bank statements instead of tax returns but still verify your ability to make payments. Equity lenders (also called private lenders) lend primarily based on the property's equity, with minimal or no income verification. B-lender rates usually sit somewhat above bank rates, and equity-lender rates above B-lender rates; see the live benchmarks on this page for today's levels."
  },
  {
    q: "When should I choose equity lending over a B-lender?",
    a: "Equity lending makes sense when: your credit score is below 500, you have no income documentation at all, you need funds extremely quickly (days vs weeks), or your LTV exceeds 80%. If you have a credit score above 500, some income documentation (even bank statements), and LTV at or below 80%, a B-lender will almost always be cheaper."
  },
  {
    q: "Why do equity lenders charge more for second mortgages?",
    a: "A second mortgage is subordinate to the first — if the property goes into foreclosure, the first lender gets paid first. This means the second lender takes on significantly more risk, so the same lender typically charges a noticeably higher rate on a second than on a first, and a higher fee as well."
  },
  {
    q: "How do lender fees affect the total cost?",
    a: "A 1% fee on a $500,000 mortgage is $5,000 upfront. Over a 5-year term at 6.49% vs 6.95% (25-year amortization), the rate difference alone costs roughly $11,000 more in interest — more than double the fee. When comparing options, always look at total cost (interest + fees) over the full term, not just the rate."
  },
  {
    q: "Can I switch from an equity lender to a B-lender or A-lender later?",
    a: "Yes. Many borrowers use equity or B-lending as a bridge solution. Once your credit improves, your income documentation is in order, or you've built sufficient equity, you can refinance into a B-lender or even an A-lender at significantly lower rates. This is a common strategy and something a mortgage broker can plan for from day one."
  }
];

// Canadian convention: semi-annual compounding, monthly rate = (1 + r/2)^(1/6) - 1 (same as lib/calc/payment.ts)
function monthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100 / 2, 1 / 6) - 1;
}

function calcMonthly(principal: number, annualRate: number, amortYears: number): number {
  const n = amortYears * 12;
  if (principal <= 0 || n <= 0) return 0;
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Interest actually paid during the first `months` payments
function interestOverMonths(principal: number, annualRate: number, payment: number, months: number): number {
  const r = monthlyRate(annualRate);
  let balance = principal;
  let interest = 0;
  for (let i = 0; i < months && balance > 0; i++) {
    const it = balance * r;
    interest += it;
    balance = Math.max(0, balance + it - payment);
  }
  return interest;
}

export default function BvsEquityPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [mortgageAmount, setMortgageAmount] = useState(500000);
  const [propertyValue, setPropertyValue] = useState(750000);
  const [position, setPosition] = useState<LoanPosition>("1st");
  const [term, setTerm] = useState(5);
  const [amortization, setAmortization] = useState(25);
  const { data: liveRates } = useLiveRates();
  const ratesDate = ratesAsOf(liveRates);
  const bProduct = altProductForTerm(term);
  const [bRate, setBRate, bRateSource] = useLiveDefault(5.49, liveRate(liveRates, bProduct));
  const livePrivateSecond = liveRate(liveRates, "privateSecond");
  const [eRate, setERate, eRateSource] = useLiveDefault(
    EQUITY_FIRST_ILLUSTRATIVE_RATE,
    position === "2nd" ? livePrivateSecond : EQUITY_FIRST_ILLUSTRATIVE_RATE,
  );
  const benchmarkRows = BENCHMARK_ROWS.map((r) => ({ ...r, b: liveBenchmark(liveRates, r.key) })).filter((r) => r.b);
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
  // Interest paid during the term (the old "payments − full principal" was negative)
  const termMonths = Math.min(term, amortization) * 12;
  const bTotalInterest = interestOverMonths(mortgageAmount, bRate, bMonthly, termMonths);
  const eTotalInterest = interestOverMonths(mortgageAmount, eRate, eMonthly, termMonths);
  const bFees = mortgageAmount * (bFee / 100);
  const eFees = mortgageAmount * (eFee / 100);
  const bTotalCost = bTotalInterest + bFees;
  const eTotalCost = eTotalInterest + eFees;
  const difference = eTotalCost - bTotalCost;

  const pyramidTiers = [
    { label: "A-Lenders", desc: "Banks & credit unions — best rates, strictest rules", color: canQualifyB ? "text-gray-400" : "text-gray-400", bgColor: "bg-gray-600/30", borderColor: "border-gray-600/50", highlight: false },
    { label: "B-Lenders", desc: "Alternative lenders — bank statements OK, credit 500+", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/40", highlight: canQualifyB },
    { label: "Equity Lenders", desc: "Private lenders — equity-based, minimal docs", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/40", highlight: !canQualifyB },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-300 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-300 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-300">B-Lender vs Equity Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-6">
                <Landmark className="w-4 h-4" />
                Lender Comparison Tool
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">B-Lender vs Equity</span> Lending Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Compare B-lender and private equity lending side by side, starting from live Canadian rate benchmarks. See which option costs less — and why.
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
                    <Calculator className="w-6 h-6 text-gold-300" />
                    Mortgage Details
                  </h2>
            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-b-vs-equity"
                title="Your B-Lender vs Equity Lender Analysis"
                subtitle="Get a personalized PDF comparing B-lender and equity options"
                leadMessage="PDF Report Download — B Vs Equity"
                mortgageType="Alternative"
                amount={mortgageAmount.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your B-Lender vs Equity Lender Analysis",
                    calculatorName: "B Vs Equity Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: "$" + Math.round(mortgageAmount).toLocaleString("en-CA") },
                          { label: "Property Value", value: "$" + Math.round(propertyValue).toLocaleString("en-CA") },
                          { label: "B-Lender Rate", value: bRate + "%" },
                          { label: "Equity Rate", value: eRate + "%" },
                          { label: "Term", value: term + " years" },
                          { label: "LTV", value: ((mortgageAmount / propertyValue) * 100).toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "B-Lender",
                        rows: [
                          { label: "Monthly Payment", value: "$" + Math.round(bMonthly).toLocaleString("en-CA") },
                          { label: "Total Interest", value: "$" + Math.round(bTotalInterest).toLocaleString("en-CA") },
                          { label: "Fees", value: "$" + Math.round(bFees).toLocaleString("en-CA") },
                          { label: "Total Cost", value: "$" + Math.round(bTotalCost).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Equity Lender",
                        rows: [
                          { label: "Monthly Payment", value: "$" + Math.round(eMonthly).toLocaleString("en-CA") },
                          { label: "Total Interest", value: "$" + Math.round(eTotalInterest).toLocaleString("en-CA") },
                          { label: "Fees", value: "$" + Math.round(eFees).toLocaleString("en-CA") },
                          { label: "Total Cost", value: "$" + Math.round(eTotalCost).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "B-lenders offer competitive rates with flexible verification. Equity lenders provide maximum flexibility at higher rates."
                  });
                }}
              />
            </div>
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
                      <div>
                        <ValidatedInput label="B-Lender Rate (%)" value={bRate} onChange={setBRate} validation={{ min: 3, max: 15 }} type="percentage" />
                        <LiveRateNote data={liveRates} product={bProduct} source={bRateSource} />
                      </div>
                      <div>
                        <ValidatedInput label="Equity Lender Rate (%)" value={eRate} onChange={setERate} validation={{ min: 5, max: 18 }} type="percentage" />
                        {position === "2nd" && livePrivateSecond !== undefined
                          ? <LiveRateNote data={liveRates} product="privateSecond" source={eRateSource} />
                          : <p className="text-xs text-gray-300 mt-1.5">{eRateSource === "user" ? "" : "Illustrative (no live benchmark for private first mortgages). "}Enter the quote you received.</p>}
                      </div>
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
                      {canQualifyB ? "You May Qualify for a B-Lender" : "Explore Other Financing Options"}
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
                        <p className="text-xs text-gray-300">{tier.desc}</p>
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
                        <TrendingDown className="w-5 h-5 text-gold-300" />
                        <span className="font-semibold text-gray-200">Cost Comparison</span>
                      </div>
                      <p className="text-lg text-gray-300">
                        {difference >= 0 ? (
                          <>Equity lending costs <span className="text-red-400 font-bold">{formatCurrency(difference, 0)}</span> more over the {term}-year term.</>
                        ) : (
                          <>Equity lending costs <span className="text-green-400 font-bold">{formatCurrency(Math.abs(difference), 0)}</span> less over the {term}-year term with these rates and fees.</>
                        )}
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
                      <p className="text-xs text-gray-400 mb-2">What to expect ({position} mortgage):</p>
                      <div className="space-y-1 text-sm text-gray-300">
                        {position === "2nd" && livePrivateSecond !== undefined && ratesDate
                          ? <p>• Private second mortgages in our live feed start at {livePrivateSecond.toFixed(2)}% (as of {ratesDate}); most files price above that.</p>
                          : <p>• Equity-lender rates depend mainly on LTV, location and property type. Lower LTV gets better pricing.</p>}
                        <p>• Lender fees are commonly 1–3% on a first mortgage and higher on a second; some lenders charge a flat fee instead.</p>
                        <p>• Terms are usually 1–2 years, often interest-only. Plan your exit (refinance or sale) from day one.</p>
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
                    <p>• This calculator provides estimates only — actual costs depend on the specific lender and deal structure. Both options are modelled as amortizing loans with semi-annual compounding; many equity lenders are interest-only with 1–2 year terms and renewal fees.</p>
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
                <strong>B-lenders</strong> (also called alternative lenders) are licensed financial institutions that bridge the gap between banks and private lenders. Companies like Bridgewater Bank, Home Trust, and Equitable Bank offer rates typically about 0.5–2% above bank rates (more for weaker credit) but with significantly more flexible qualification criteria. Most B-lenders accept bank statements instead of tax returns to verify income, and some accept stated income. They typically require a minimum Beacon score of 500 and loan-to-value ratios at or below 80%.
              </p>
              <p>
                <strong>Equity lenders</strong> (private lenders and mortgage investment corporations) operate at the bottom of the hierarchy. They lend primarily based on the property&apos;s value and the equity cushion — not your income or credit score. This makes them the most accessible option but also the most expensive, with rates that vary widely by lender, position (1st or 2nd) and risk profile.
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
                This risk difference shows up clearly in the pricing. The same equity lender will usually quote a noticeably higher rate for a second mortgage than for a first, and a higher lender fee as well. Always compare the all-in cost (interest plus fees) over the time you expect to keep the loan.
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
                Let&apos;s say you need $500,000 with a property worth $750,000 (66.7% LTV), 25-year amortization, and you qualify for both B-lender and equity options. At a B-lender rate of 5.49%, your monthly payment is approximately $3,049. Over 5 years, you&apos;d pay about $128,800 in interest plus a 1% fee ($5,000), for a total cost of about $133,800. At an equity lender rate of 6.95%, your monthly payment rises to approximately $3,487. Over the same 5 years, interest totals about $164,100 plus fees ($5,000), for a total of about $169,100. The difference? Roughly $35,300 more with the equity lender over 5 years — the price of minimal documentation and potentially a week faster closing. (Many equity lenders are interest-only and use shorter 1–2 year terms, which changes the math.)
              </p>

              <div className="mt-8">
                <Link href="/calculators" className="text-gold-300 hover:text-gold-300 underline">All Calculators</Link>
                {" · "}
                <Link href="/calculators/refinance-vs-heloc-vs-second" className="text-gold-300 hover:text-gold-300 underline">Refinance vs HELOC vs Second Mortgage Calculator</Link>
                {" · "}
                <Link href="/calculators/self-employed-a-vs-b" className="text-gold-300 hover:text-gold-300 underline">Self-Employed A vs B Lender Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lender Rate Tables */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Today&apos;s B-Lender &amp; Private Rate Benchmarks</h2>
            {benchmarkRows.length > 0 ? (
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-white/5 text-gray-400"><th className="text-left p-3">Product</th><th className="text-right p-3">Lowest</th><th className="text-right p-3">Median</th><th className="text-right p-3 hidden sm:table-cell">Lenders</th></tr></thead>
                  <tbody>
                    {benchmarkRows.map((r) => (
                      <tr key={r.key} className="border-t border-white/5">
                        <td className="p-3 text-gray-200">{r.label}</td>
                        <td className="text-right p-3 text-gray-300">{r.b!.lowest!.toFixed(2)}%</td>
                        <td className="text-right p-3 text-gray-300">{r.b!.median !== undefined ? `${r.b!.median.toFixed(2)}%` : "—"}</td>
                        <td className="text-right p-3 text-gray-400 hidden sm:table-cell">{r.b!.lenderCount ?? "—"}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-white/5">
                      <td className="p-3 text-gray-200">Equity-lender 1st mortgage</td>
                      <td colSpan={3} className="text-right p-3 text-gray-400">Quote-based (no live benchmark)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-400">Live benchmarks are loading or unavailable. <Link href="/rates" className="text-gold-300 hover:text-gold-300 underline">See today&apos;s rates</Link> or contact us for current pricing.</p>
            )}
            <p className="text-xs text-gray-400 text-center mt-4">
              {ratesDate ? `From our live rate feed, as of ${ratesDate}. ` : ""}Lowest and median advertised rates across the lenders in our feed. Your rate depends on credit, LTV, property type, location and fees. Contact us for current pricing.
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-gray-400 mb-8">
          Rates shown are estimated starting rates for comparison purposes. Actual rates vary based on credit, LTV, property type, and location. Contact a broker to confirm rates for your specific situation.
        </p>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-gray-200 pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-gold-300 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
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
        <RelatedCalculators current="b-vs-equity" related={["self-employed-a-vs-b","a-vs-equity","refinance-vs-heloc-vs-second"]} />
      </main>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "B-Lender vs Equity Lending Calculator",
        "description": "Compare B-lender and private equity lending costs side by side, with live Canadian rate benchmarks.",
        "url": "https://www.kraftmortgages.ca/calculators/b-vs-equity",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
        "provider": { "@type": "Organization", "name": "Kraft Mortgages", "telephone": "604-593-1550", "address": { "@type": "PostalAddress", "streetAddress": "#301 - 1688 152nd Street", "addressLocality": "Surrey", "addressRegion": "BC", "postalCode": "V4A 4N2", "addressCountry": "CA" } }
      })}} />
    </>
  );
}
