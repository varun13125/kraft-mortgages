"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useLiveRates } from "@/lib/useLiveRates";
import { liveBenchmark, liveRate, ratesAsOf, type BenchmarkRow } from "../_lib/liveRateDefaults";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Info, ChevronDown, ChevronUp, FileText,
  AlertTriangle, Home, CreditCard, Layers, CheckCircle2, TrendingDown,
  Lightbulb, Shield, Banknote, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";

type FirstMortgageType = "a-lender" | "b-lender" | "equity";
type Purpose = "debt-consolidation" | "investment" | "renovation" | "purchase-property";

const purposeLabels: Record<Purpose, string> = {
  "debt-consolidation": "Debt Consolidation",
  "investment": "Investment",
  "renovation": "Renovation",
  "purchase-property": "Buy Another Property",
};

const faqs = [
  {
    q: "What's the main difference between refinancing, a HELOC, and a second mortgage?",
    a: "Refinancing replaces your entire first mortgage with a new, larger one — you get cash from the difference. A HELOC is a revolving line of credit secured against your home equity with interest-only payments. A second mortgage is a separate loan on top of your first mortgage, registered in second position. All three access equity but work very differently."
  },
  {
    q: "When is refinancing the best option?",
    a: "Refinancing makes sense when you can get a lower rate than your current mortgage, you need a large amount of cash, and you're comfortable resetting your amortization. It's also the best option when current rates are lower than when you got your original mortgage. The main downside is you'll pay a prepayment penalty to break your current mortgage."
  },
  {
    q: "When does a HELOC make more sense than refinancing?",
    a: "A HELOC is ideal when you need flexibility — you only pay interest on what you actually use, not the full approved amount. It's great for ongoing expenses like renovations or investment opportunities that unfold over time. You keep your existing first mortgage (no penalty), and many HELOCs allow interest-only payments which keeps monthly costs low."
  },
  {
    q: "Is a second mortgage ever better than refinancing?",
    a: "Yes, when you can't qualify for a refinance (credit issues, income documentation gaps, or high penalty on your first mortgage), a second mortgage lets you access equity without touching your first. It's also faster — second mortgages can close in days vs weeks for refinances. The trade-off is significantly higher rates and fees."
  },
  {
    q: "What hidden costs should I watch for?",
    a: "Refinancing has a prepayment penalty (3 months' interest or IRD — whichever is higher), plus legal fees (~$1,500), appraisal (~$500), and discharge fees. HELOCs may have setup fees (1–2% with some lenders), annual fees, and the rate is typically variable. Second mortgages have lender fees (1.5–4%), legal costs, and appraisal fees. Always ask for a total cost breakdown before proceeding."
  }
];

// Canadian fixed-rate convention: semi-annual compounding, monthly rate = (1 + r/2)^(1/6) - 1
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

// Interest paid over the next `months` months on an amortizing loan
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

const HORIZON_MONTHS = 60;
// Typical maximum combined LTVs: refinance & HELOC 80% (legal limit for uninsured lending; HELOC revolving
// portion max 65% under OSFI B-20); private/equity lenders often up to ~85%.
const MAX_LTV_INSTITUTIONAL = 80;
const MAX_LTV_PRIVATE = 85;
const MAX_HELOC_LTV = 65;
// No live benchmark exists for private/equity FIRST mortgages, so the equity-lender refinance rate is illustrative.
const EQUITY_REFI_ILLUSTRATIVE_RATE = 6.95;
// Fallback when the live B-lender HELOC benchmark (raw_benchmarks.alt_heloc) is unavailable.
const ALT_HELOC_FALLBACK_RATE = 8.49;

function fmtRange(b: BenchmarkRow | undefined): string {
  if (!b || b.lowest === undefined) return "—";
  return b.median !== undefined && b.median > b.lowest ? `${b.lowest.toFixed(2)}% (median ${b.median.toFixed(2)}%)` : `from ${b.lowest.toFixed(2)}%`;
}

export default function RefinanceVsHelocVsSecondPage() {
  const { data: liveRates, bestHeloc, bestPrivateSecond } = useLiveRates();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [homeValue, setHomeValue] = useState(900000);
  const [firstBalance, setFirstBalance] = useState(500000);
  const [firstRate, setFirstRate] = useState(4.79);
  const [firstAmort, setFirstAmort] = useState(22);
  const [cashNeeded, setCashNeeded] = useState(150000);
  const [firstType, setFirstType] = useState<FirstMortgageType>("a-lender");
  const [purpose, setPurpose] = useState<Purpose>("debt-consolidation");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const equity = homeValue - firstBalance;
  const ltv = (firstBalance / homeValue) * 100;
  // Combined LTV after borrowing the cash — this is what lenders cap, not today's LTV
  const newLtv = ((firstBalance + cashNeeded) / homeValue) * 100;

  const results = useMemo(() => {
    const currentMonthly = calcMonthly(firstBalance, firstRate, firstAmort);
    const horizon = Math.min(HORIZON_MONTHS, firstAmort * 12);
    // Interest on the existing first mortgage if it stays in place (HELOC / second-mortgage options)
    const firstInterest5yr = interestOverMonths(firstBalance, firstRate, currentMonthly, horizon);

    // Option 1: Refinance (uninsured — insured refinancing isn't available, so use conventional pricing)
    const refiTotal = firstBalance + cashNeeded;
    const liveConv5 = liveRates?.benchmarks?.fixed_5yr?.conventional?.lowest_rate;
    const liveAlt5 = liveRates?.raw_benchmarks?.alt_5_year_fixed?.lowest_rate;
    let refiRate: number;
    if (firstType === "a-lender") refiRate = typeof liveConv5 === "number" ? liveConv5 : 4.39; // live conventional 5-yr benchmark
    else if (firstType === "b-lender") refiRate = typeof liveAlt5 === "number" ? liveAlt5 : 6.04; // live alternative 5-yr benchmark
    else refiRate = EQUITY_REFI_ILLUSTRATIVE_RATE;

    // Lender fees: B-lender ~1%; private/equity lenders typically 1–3% (2% used; broker fees extra)
    const refiFee = firstType === "b-lender" ? refiTotal * 0.01 : firstType === "equity" ? refiTotal * 0.02 : 0;
    // Penalty = 3 months' INTEREST (not full P+I payment). Interest = balance * rate / 12.
    const monthlyInterest = firstBalance * (firstRate / 100) / 12;
    const penalty = monthlyInterest * 3;
    const legalAppraisal = 2000;
    const refiMonthly = calcMonthly(refiTotal, refiRate, firstAmort);
    const refiInterest5yr = interestOverMonths(refiTotal, refiRate, refiMonthly, horizon);
    // 5-year cost = interest on ALL mortgage debt + fees/penalty (principal repaid is not a cost)
    const refiTotalCost5yr = refiInterest5yr + refiFee + penalty + legalAppraisal;
    const refiPaymentChange = refiMonthly - currentMonthly;
    const refiFeasible = newLtv <= (firstType === "equity" ? MAX_LTV_PRIVATE : MAX_LTV_INSTITUTIONAL);

    // Option 2: HELOC (interest-only, variable)
    const liveAltHeloc = liveRate(liveRates, "altHeloc");
    const helocRate = firstType === "a-lender" ? (bestHeloc || 4.95) : (liveAltHeloc ?? ALT_HELOC_FALLBACK_RATE);
    const helocMonthly = cashNeeded * (helocRate / 100) / 12; // interest-only
    // Most A-lender HELOCs have no setup fee; alternative-lender HELOCs often charge ~1–2%
    const helocFee = firstType === "a-lender" ? 0 : cashNeeded * 0.015;
    const helocSetupFee = 500; // legal / registration estimate
    const helocTotalCost5yr = firstInterest5yr + (helocMonthly * HORIZON_MONTHS) + helocFee + helocSetupFee;
    const combinedMonthly = currentMonthly + helocMonthly;
    const helocFeasible = newLtv <= MAX_LTV_INSTITUTIONAL && (cashNeeded / homeValue) * 100 <= MAX_HELOC_LTV;

    // Option 3: Second Mortgage (private/equity lender — typically interest-only)
    const secondRate = bestPrivateSecond || 7.99; // live verified private 2nd benchmark
    const secondMonthly = cashNeeded * (secondRate / 100) / 12; // interest-only
    const secondFee = cashNeeded * 0.02;
    const secondLegal = 1500;
    const secondTotalCost5yr = firstInterest5yr + (secondMonthly * HORIZON_MONTHS) + secondFee + secondLegal;
    const combinedSecondMonthly = currentMonthly + secondMonthly;
    const secondFeasible = newLtv <= MAX_LTV_PRIVATE;

    // Find cheapest among options that fit typical LTV limits
    const options = [
      { name: "Refinance", cost: refiTotalCost5yr, ok: refiFeasible },
      { name: "HELOC", cost: helocTotalCost5yr, ok: helocFeasible },
      { name: "Second Mortgage", cost: secondTotalCost5yr, ok: secondFeasible },
    ].filter(o => o.ok);
    options.sort((a, b) => a.cost - b.cost);
    const cheapest = options.length ? options[0].name : "None";

    return {
      currentMonthly,
      // Refi
      refiRate, refiMonthly, refiFee, penalty, legalAppraisal,
      refiTotalCost5yr, refiPaymentChange, refiFeasible,
      // HELOC
      helocRate, helocMonthly, helocFee, helocSetupFee, helocTotalCost5yr, combinedMonthly, helocFeasible,
      // Second
      secondRate, secondMonthly, secondFee, secondLegal, secondTotalCost5yr, combinedSecondMonthly, secondFeasible,
      cheapest,
    };
  }, [homeValue, firstBalance, firstRate, firstAmort, cashNeeded, firstType, newLtv, liveRates, bestHeloc, bestPrivateSecond]);

  const recommendation = useMemo(() => {
    const ltvText = `${newLtv.toFixed(1)}%`;
    if (newLtv > MAX_LTV_PRIVATE) return `At ${ltvText} combined LTV, most lenders won't lend — even private lenders usually stop around 85%. Consider borrowing less or speak with a broker about options.`;
    const aboveInstitutional = newLtv > MAX_LTV_INSTITUTIONAL;
    const privateFallback = `Second Mortgage — at ${ltvText} combined LTV you're above the 80% limit for refinances and HELOCs; some private lenders go to ~85% combined LTV at higher rates and fees.`;
    if (purpose === "debt-consolidation") {
      if (aboveInstitutional) return privateFallback;
      if (firstType === "a-lender") return "Refinance — consolidating at a lower rate saves the most over time. The penalty is a one-time cost you'll recover.";
      return "Refinance — even with a B-lender rate, rolling everything into one payment simplifies your finances and the rate is lower than a HELOC or second mortgage.";
    }
    if (!results.helocFeasible) return aboveInstitutional ? privateFallback : "Refinance or Second Mortgage — the amount exceeds the 65% LTV limit for a HELOC's revolving portion.";
    if (purpose === "investment") return "HELOC — interest-only payments keep monthly costs low while you deploy capital. The flexibility to draw and repay is ideal for investment cycles.";
    if (purpose === "renovation") return "HELOC — draw funds as needed during renovation rather than taking everything upfront. Interest-only payments during the project keep costs manageable.";
    return "HELOC or Second Mortgage — for purchasing another property, keeping your first mortgage intact avoids penalties and preserves your current rate.";
  }, [purpose, newLtv, firstType, results.helocFeasible]);

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
              <span className="text-gold-300">Refinance vs HELOC vs Second Mortgage</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-6">
                <Home className="w-4 h-4" />
                Equity Access Comparison
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Refinance vs HELOC vs Second Mortgage</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Three ways to access your home equity — compare total costs, monthly payments, and find the cheapest option for your situation.
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
                    Your Home Details
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
                source="calculator-pdf-refinance-vs-heloc-vs-second"
                title="Your Equity Options Comparison"
                subtitle="Get a personalized PDF comparing your equity access options"
                leadMessage="PDF Report Download — Refinance vs HELOC vs Second Calculator"
                mortgageType="Refinance"
                amount={homeValue.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Equity Options Comparison",
                    calculatorName: "Refinance vs HELOC vs Second Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Value", value: "$" + Math.round(homeValue).toLocaleString("en-CA") },
                          { label: "Current Balance", value: "$" + Math.round(firstBalance).toLocaleString("en-CA") },
                          { label: "Current Rate", value: firstRate + "%" },
                          { label: "Cash Needed", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Available Equity", value: "$" + Math.round(equity).toLocaleString("en-CA") },
                          { label: "LTV", value: ltv.toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "Refinance",
                        rows: [
                          { label: "New Payment", value: "$" + Math.round(results.refiMonthly).toLocaleString("en-CA") },
                          { label: "Payment Change", value: "$" + Math.round(results.refiPaymentChange).toLocaleString("en-CA") },
                          { label: "5-yr Interest + Fees", value: "$" + Math.round(results.refiTotalCost5yr).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "HELOC",
                        rows: [
                          { label: "Amount", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Rate", value: results.helocRate + "%" },
                          { label: "Monthly Interest Only", value: "$" + Math.round(results.helocMonthly).toLocaleString("en-CA") },
                          { label: "5-yr Interest + Fees (incl. 1st mortgage)", value: "$" + Math.round(results.helocTotalCost5yr).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Second Mortgage",
                        rows: [
                          { label: "Amount", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Rate", value: results.secondRate + "%" },
                          { label: "Monthly Payment (interest-only)", value: "$" + Math.round(results.secondMonthly).toLocaleString("en-CA") },
                          { label: "5-yr Interest + Fees (incl. 1st mortgage)", value: "$" + Math.round(results.secondTotalCost5yr).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Recommendation",
                        rows: [
                          { label: "Lowest Cost Option (within typical LTV limits)", value: results.cheapest, highlight: true },
                          { label: "Combined LTV After", value: newLtv.toFixed(1) + "%" },
                        ]
                      }
                    ],
                    educationalContent: "Each equity option has different costs and terms. Refinancing replaces your mortgage. HELOC offers flexible access. Second mortgage keeps your first intact."
                  });
                }}
              />
            </div>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Current Home Value" value={homeValue} onChange={setHomeValue} validation={{ min: 200000, max: 10000000 }} type="currency" />
                    <ValidatedInput label="Current First Mortgage Balance" value={firstBalance} onChange={setFirstBalance} validation={{ min: 50000, max: 9000000 }} type="currency" />
                    <ValidatedInput label="Current First Mortgage Rate (%)" value={firstRate} onChange={setFirstRate} validation={{ min: 2, max: 15 }} type="percentage" />
                    <ValidatedInput label="Remaining Amortization (years)" value={firstAmort} onChange={setFirstAmort} validation={{ min: 1, max: 30 }} type="number" />
                    <ValidatedInput label="Cash Needed" value={cashNeeded} onChange={setCashNeeded} validation={{ min: 10000, max: 5000000 }} type="currency" />

                    <div className="flex gap-2 sm:gap-4 text-sm">
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 block text-xs">Available Equity</span>
                        <span className={`font-semibold ${equity > 0 ? "text-green-400" : "text-red-400"}`}>{formatCurrency(equity, 0)}</span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 block text-xs">Current LTV</span>
                        <span className="font-semibold text-gray-200">{ltv.toFixed(1)}%</span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 block text-xs">LTV After Cash</span>
                        <span className={`font-semibold ${newLtv > MAX_LTV_INSTITUTIONAL ? "text-red-400" : "text-gray-200"}`}>{newLtv.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Mortgage Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([["a-lender", "A-Lender"], ["b-lender", "B-Lender"], ["equity", "Equity/Private"]] as [FirstMortgageType, string][]).map(([key, label]) => (
                          <button key={key} onClick={() => setFirstType(key)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${firstType === key ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Purpose</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(purposeLabels) as [Purpose, string][]).map(([key, label]) => (
                          <button key={key} onClick={() => setPurpose(key)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-left ${purpose === key ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
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
                {/* Current situation */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <p className="text-xs text-gray-400 font-semibold mb-1">CURRENT MONTHLY PAYMENT</p>
                  <p className="text-2xl font-bold text-gray-100">{formatCurrency(results.currentMonthly, 0)}/mo</p>
                  <p className="text-sm text-gray-400">on {formatCurrency(firstBalance, 0)} at {firstRate}%</p>
                </div>

                {/* Three-column comparison */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Refinance */}
                  <div className={`backdrop-blur-sm rounded-2xl p-5 border transition-all ${results.cheapest === "Refinance" ? "bg-green-500/10 border-green-500/40 ring-1 ring-green-500/30" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-gray-100">Refinance</span>
                      </div>
                      {results.cheapest === "Refinance" && <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">LOWEST COST</span>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">New Rate</span><span className="text-gray-200">{results.refiRate}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">New Monthly Payment</span><span className="text-gray-200">{formatCurrency(results.refiMonthly, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Payment Change</span><span className={results.refiPaymentChange > 0 ? "text-red-400" : "text-green-400"}>{results.refiPaymentChange > 0 ? "+" : ""}{formatCurrency(results.refiPaymentChange, 0)}/mo</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Prepayment Penalty</span><span className="text-amber-400">~{formatCurrency(results.penalty, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Lender Fee</span><span className="text-gray-300">{formatCurrency(results.refiFee, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Legal + Appraisal</span><span className="text-gray-300">{formatCurrency(results.legalAppraisal, 0)}</span></div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold"><span className="text-gray-300">5-yr Interest + Fees</span><span className="text-gray-100">{formatCurrency(results.refiTotalCost5yr, 0)}</span></div>
                      {!results.refiFeasible && <p className="text-xs text-red-400">Exceeds the typical {firstType === "equity" ? MAX_LTV_PRIVATE : MAX_LTV_INSTITUTIONAL}% maximum LTV for a refinance.</p>}
                    </div>
                  </div>

                  {/* HELOC */}
                  <div className={`backdrop-blur-sm rounded-2xl p-5 border transition-all ${results.cheapest === "HELOC" ? "bg-green-500/10 border-green-500/40 ring-1 ring-green-500/30" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-gray-100">HELOC</span>
                      </div>
                      {results.cheapest === "HELOC" && <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">LOWEST COST</span>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">HELOC Rate</span><span className="text-gray-200">{results.helocRate}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Interest-Only Payment</span><span className="text-gray-200">{formatCurrency(results.helocMonthly, 0)}/mo</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Combined Monthly</span><span className="text-gray-200">{formatCurrency(results.combinedMonthly, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Setup Fee + Legal (est.)</span><span className="text-gray-300">{formatCurrency(results.helocFee + results.helocSetupFee, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">First Mortgage</span><span className="text-green-400">No change (no penalty)</span></div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold"><span className="text-gray-300">5-yr Interest + Fees*</span><span className="text-gray-100">{formatCurrency(results.helocTotalCost5yr, 0)}</span></div>
                      {!results.helocFeasible && <p className="text-xs text-red-400">Exceeds typical HELOC limits (65% LTV revolving, 80% combined).</p>}
                    </div>
                  </div>

                  {/* Second Mortgage */}
                  <div className={`backdrop-blur-sm rounded-2xl p-5 border transition-all ${results.cheapest === "Second Mortgage" ? "bg-green-500/10 border-green-500/40 ring-1 ring-green-500/30" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-amber-400" />
                        <span className="font-bold text-gray-100">Second Mortgage</span>
                      </div>
                      {results.cheapest === "Second Mortgage" && <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">LOWEST COST</span>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">2nd Mortgage Rate</span><span className="text-gray-200">{results.secondRate}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Interest-Only Payment</span><span className="text-gray-200">{formatCurrency(results.secondMonthly, 0)}/mo</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Combined Monthly</span><span className="text-gray-200">{formatCurrency(results.combinedSecondMonthly, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Lender Fee + Legal</span><span className="text-gray-300">{formatCurrency(results.secondFee + results.secondLegal, 0)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">First Mortgage</span><span className="text-green-400">No change (no penalty)</span></div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold"><span className="text-gray-300">5-yr Interest + Fees*</span><span className="text-gray-100">{formatCurrency(results.secondTotalCost5yr, 0)}</span></div>
                      {!results.secondFeasible && <p className="text-xs text-red-400">Exceeds the ~85% combined LTV most private lenders allow.</p>}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400">*HELOC and second-mortgage totals include interest on your existing first mortgage, so all three options compare the same total debt. Principal repaid is not counted as a cost.</p>

                {/* Recommendation */}
                <div className="bg-gold-500/10 backdrop-blur-sm rounded-2xl p-5 border border-gold-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-gold-300" />
                    <span className="font-bold text-gold-300">Recommendation for {purposeLabels[purpose]}</span>
                  </div>
                  <p className="text-sm text-gray-300">{recommendation}</p>
                </div>

                {/* Keep in mind */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Keep in Mind
                  </h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• <strong className="text-gray-300">Refinance</strong> can reset your amortization (this estimate keeps your remaining amortization) — stretching it lowers payments but adds interest over the life of the loan.</p>
                    <p>• <strong className="text-gray-300">HELOC</strong> is flexible (draw and repay as needed) but rates are usually variable and can increase.</p>
                    <p>• <strong className="text-gray-300">Second mortgage</strong> is the most expensive per dollar borrowed but doesn&apos;t touch your first mortgage or trigger penalties.</p>
                  </div>
                </div>

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
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding These Estimates</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Refinance rates shown are blended estimates based on current market conditions for each lender type.</p>
                    <p>• A-lender refinance uses the live conventional 5-year benchmark (insured refinancing isn&apos;t available); A-lender HELOC uses the live HELOC benchmark. B-lender HELOC uses the live B-lender HELOC benchmark when available ({liveRate(liveRates, "altHeloc") !== undefined ? "live" : `${ALT_HELOC_FALLBACK_RATE}% fallback`}); the equity-lender refinance rate ({EQUITY_REFI_ILLUSTRATIVE_RATE}%) is illustrative because there is no live benchmark for private first mortgages.</p>
                    <p>• Second mortgage rate is the live private-second benchmark, modelled as interest-only. Private seconds usually renew yearly with renewal fees, and broker fees may apply — not included.</p>
                    <p>• Prepayment penalty estimate uses 3 months&apos; interest — actual penalty could be higher with IRD calculation.</p>
                    <p>• 5-year cost = interest on all mortgage debt plus fees and penalty, assuming rates stay constant (HELOCs are variable). Excludes property tax and insurance.</p>
                    <p>• Limits used: refinance and HELOC up to 80% combined LTV (HELOC revolving portion up to 65%); private lenders up to ~85%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Complete Guide: Three Ways to Access Your Home Equity</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Canadian homeowners have accumulated record equity in recent years. Whether you need cash for debt consolidation, home renovations, investments, or purchasing another property, your home equity can be a powerful financial tool. But how you access that equity matters — the wrong choice can cost you tens of thousands of dollars over the life of the loan. This guide breaks down the three main options: refinancing, HELOCs, and second mortgages.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Three Ways to Access Your Home Equity — Pros and Cons</h3>
              <p>
                <strong>Refinancing</strong> replaces your existing mortgage with a new, larger one. You receive the difference between your old balance and the new mortgage as cash. This is the most straightforward option and typically offers the lowest rate of the three, but you&apos;ll pay a prepayment penalty to break your current mortgage and your amortization resets.
              </p>
              <p>
                <strong>A HELOC (Home Equity Line of Credit)</strong> is a revolving credit facility secured against your home. You only pay interest on what you actually use, and many HELOCs offer interest-only payments. This makes it ideal for situations where you need flexibility — you can draw funds, repay them, and draw again. The trade-off is higher rates than a refinance and the variable rate risk.
              </p>
              <p>
                <strong>A second mortgage</strong> is a separate loan registered behind your first mortgage. It doesn&apos;t touch your existing mortgage at all — no penalty, no rate change, no amortization reset. This makes it the fastest option to arrange, sometimes closing in days. However, second mortgage rates are significantly higher{ratesAsOf(liveRates) && liveRate(liveRates, "privateSecond") !== undefined ? ` (private seconds in our live feed start at ${liveRate(liveRates, "privateSecond")!.toFixed(2)}% as of ${ratesAsOf(liveRates)}, and most files price above that)` : ""} and fees are steeper (commonly 1.5–4% of the loan amount).
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Refinancing Is the Right Choice</h3>
              <p>
                Refinancing shines when you can secure a lower rate than your current mortgage, you need a large lump sum, and the savings from the lower rate will offset the prepayment penalty over time. For example, if you&apos;re currently at 5.5% and can refinance at 4.2%, the rate savings on your entire mortgage balance can far exceed the penalty cost — especially if you&apos;re early in your term with a large balance.
              </p>
              <p>
                Refinancing also makes sense when you want to consolidate high-interest debt (credit cards, personal loans) into your mortgage at a much lower rate. A $30,000 credit card balance at 20% interest costs roughly $500/month. Rolled into a mortgage at 4.5% over 25 years, that same $30,000 adds only about $165/month — a significant monthly savings even after accounting for the longer amortization.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When a HELOC Makes More Sense</h3>
              <p>
                A HELOC is the best choice when flexibility is more important than getting the absolute lowest rate. Home renovations are a classic example — you might need $50,000 total but only $15,000 this month for the contractor&apos;s deposit, with the rest drawn over several months as work progresses. With a refinance, you&apos;d borrow the full $50,000 on day one and start paying interest on all of it. With a HELOC, you only pay interest on what you&apos;ve actually drawn.
              </p>
              <p>
                HELOCs also work well for investment opportunities where timing is uncertain. You can have the line approved and ready, then draw funds only when you find the right investment. Many investors maintain a HELOC as a standby facility, paying nothing when it&apos;s unused.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When a Second Mortgage Is Your Best Option</h3>
              <p>
                Second mortgages become the right choice when you can&apos;t qualify for a refinance or HELOC — perhaps because of credit issues, income documentation gaps, or a high penalty on your first mortgage. Since second mortgages are equity-based, the lender primarily cares about your property value and the equity cushion, not your credit score or income.
              </p>
              <p>
                Speed is another advantage. While a refinance might take 3–4 weeks and require a full application with income verification, a second mortgage through a private lender can often close in 3–7 business days with minimal documentation. This makes second mortgages popular for time-sensitive situations like tax arrears, foreclosure prevention, or urgent bridge financing.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Hidden Costs: Penalties, Fees, and Appraisal</h3>
              <p>
                Every option has costs beyond the interest rate. Refinancing triggers a prepayment penalty — typically the greater of three months&apos; interest or the Interest Rate Differential (IRD). On a $500,000 mortgage at 4.5%, three months&apos; interest is approximately $5,625, but an IRD calculation could be $10,000–$20,000+ if rates have dropped significantly since you signed.
              </p>
              <p>
                HELOCs may have setup fees (1–2% with some lenders, though many A-lender HELOCs are fee-free), annual administration fees ($50–$350/year), and potential appraisal costs. Second mortgages always come with lender fees (1.5–4% of the loan amount), plus legal fees and appraisal. On a $200,000 second mortgage at 2%, that&apos;s a $4,000 lender fee plus $1,500 in legal costs and $500 for an appraisal — $6,000 in upfront costs before you&apos;ve made a single payment.
              </p>

              <div className="mt-8">
                <Link href="/calculators" className="text-gold-300 hover:text-gold-300 underline">All Calculators</Link>
                {" · "}
                <Link href="/calculators/b-vs-equity" className="text-gold-300 hover:text-gold-300 underline">B-Lender vs Equity Calculator</Link>
                {" · "}
                <Link href="/calculators/closing-costs" className="text-gold-300 hover:text-gold-300 underline">Closing Costs Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Reference */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Today&apos;s Rate Benchmarks by Option</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Refinance (5-yr fixed)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-gray-400">A-Lender (conventional)</span><span className="text-gray-200 text-right">{fmtRange(liveBenchmark(liveRates, "5_year_fixed_conventional"))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-gray-400">B-Lender</span><span className="text-gray-200 text-right">{fmtRange(liveBenchmark(liveRates, "alt_5_year_fixed"))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-gray-400">Equity lender</span><span className="text-gray-200 text-right">Quote-based</span></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">HELOC (variable)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-gray-400">A-Lender</span><span className="text-gray-200 text-right">{fmtRange(liveBenchmark(liveRates, "heloc"))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-gray-400">B-Lender</span><span className="text-gray-200 text-right">{fmtRange(liveBenchmark(liveRates, "alt_heloc"))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-gray-400">Prime rate</span><span className="text-gray-200 text-right">{liveRate(liveRates, "prime") !== undefined ? `${liveRate(liveRates, "prime")!.toFixed(2)}%` : "—"}</span></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-bold text-amber-400 mb-3">Second Mortgage</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-gray-400">Private 2nd</span><span className="text-gray-200 text-right">{fmtRange(liveBenchmark(liveRates, "private_second"))}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-gray-400">Typical lender fee</span><span className="text-gray-200 text-right">1.5–4%</span></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">
              {ratesAsOf(liveRates) ? `From our live rate feed, as of ${ratesAsOf(liveRates)}: lowest advertised rate (and the median across lenders where available). ` : "Live benchmarks are loading or unavailable. "}Your rate depends on credit, LTV, property and fees. <Link href="/rates" className="text-gold-300 hover:text-gold-300 underline">See today&apos;s rates</Link> or contact us for current pricing.
            </p>
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
        <RelatedCalculators current="refinance-vs-heloc-vs-second" related={["refinance-break-even","mortgage-penalty","a-vs-equity"]} />
      </main>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Refinance vs HELOC vs Second Mortgage Calculator",
        "description": "Compare refinancing, HELOC, and second mortgage costs side by side when accessing home equity in Canada.",
        "url": "https://www.kraftmortgages.ca/calculators/refinance-vs-heloc-vs-second",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
        "provider": { "@type": "Organization", "name": "Kraft Mortgages", "telephone": "604-593-1550", "address": { "@type": "PostalAddress", "streetAddress": "#301 - 1688 152nd Street", "addressLocality": "Surrey", "addressRegion": "BC", "postalCode": "V4A 4N2", "addressCountry": "CA" } }
      })}} />
    </>
  );
}
