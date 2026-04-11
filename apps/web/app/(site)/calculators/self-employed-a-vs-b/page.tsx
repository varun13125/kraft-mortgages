"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, AlertTriangle, Info, Building, TrendingUp,
  HelpCircle, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Users, DollarSign
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

type Province = "BC" | "AB" | "ON";

/* ── Marginal tax rates by province ─────────────── */
const marginalTaxRates: Record<Province, number> = {
  BC: 38.29,
  AB: 36.0,
  ON: 43.41,
};

const faqs = [
  {
    q: "Will a B-lender mortgage hurt my credit?",
    a: "No. B-lender mortgages are reported to credit bureaus just like any other mortgage. Making timely payments on a B-lender mortgage can actually improve your credit score. The mortgage appears on your credit report identically to a bank mortgage — there is no \"B-lender\" label that signals lower quality to future lenders."
  },
  {
    q: "Can I switch from a B-lender to an A-lender later?",
    a: "Yes. Many self-employed borrowers use a B-lender for their first term, then refinance with an A-lender at renewal once their business income stabilizes or their tax situation changes. This is a common and well-understood strategy in the mortgage industry. A good broker will build this transition plan into your initial strategy."
  },
  {
    q: "Do B-lenders report to credit bureaus?",
    a: "Yes, major B-lenders like HomeTrust, Equitable Bank, and ICICI report to both Equifax and TransUnion. Your payment history is tracked the same way as with any bank. This means on-time payments help build your credit, and missed payments have the same negative impact."
  },
  {
    q: "What's the maximum LTV for B-lenders?",
    a: "Most B-lenders lend up to 80% loan-to-value (LTV) for conventional mortgages. Some may go slightly higher to 85% in specific situations, but 80% is the standard. This means you need a minimum 20% down payment for B-lender financing, compared to as low as 5% with an A-lender for insured mortgages."
  },
  {
    q: "How are B-lender rates determined?",
    a: "B-lender rates are based on several factors: the Bank of Canada benchmark rate, the lender's cost of funds, the risk profile of the borrower, the property type and LTV, and the loan amount. Rates typically sit 1.5-3% above A-lender rates. Shopping with a mortgage broker who has access to multiple B-lenders ensures you get the most competitive rate available for your situation."
  }
];

export default function SelfEmployedAVsBPage() {
  const [mortgageAmount, setMortgageAmount] = useState(500000);
  const [propertyValue, setPropertyValue] = useState(750000);
  const [aRate, setARate] = useState(4.99);
  const [bRate, setBRate] = useState(7.49);
  const [term, setTerm] = useState(5);
  const [amortization, setAmortization] = useState(25);
  const [province, setProvince] = useState<Province>("BC");
  const [additionalIncome, setAdditionalIncome] = useState(60000);
  const [taxRate, setTaxRate] = useState(38.29);
  const [isInvestment, setIsInvestment] = useState(false);
  const [bFee, setBFee] = useState(1);
  const [autoTax, setAutoTax] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const effectiveTaxRate = autoTax ? marginalTaxRates[province] : taxRate;

  const results = useMemo(() => {
    const aMonthlyRate = aRate / 100 / 12;
    const bMonthlyRate = bRate / 100 / 12;
    const totalPayments = amortization * 12;

    const aMonthly = mortgageAmount * (aMonthlyRate * Math.pow(1 + aMonthlyRate, totalPayments)) / (Math.pow(1 + aMonthlyRate, totalPayments) - 1);
    const bMonthly = mortgageAmount * (bMonthlyRate * Math.pow(1 + bMonthlyRate, totalPayments)) / (Math.pow(1 + bMonthlyRate, totalPayments) - 1);

    const aTotalPaid = aMonthly * term * 12;
    const bTotalPaid = bMonthly * term * 12;
    const aInterest = aTotalPaid - mortgageAmount;
    const bInterest = bTotalPaid - mortgageAmount;

    const bFeeAmount = mortgageAmount * (bFee / 100);
    const additionalTax = additionalIncome * (effectiveTaxRate / 100) * term;

    const aTotalCost = aInterest + additionalTax;
    const bTotalCost = bInterest + bFeeAmount;

    let investmentTaxSavings = 0;
    if (isInvestment) {
      investmentTaxSavings = bInterest * (effectiveTaxRate / 100);
    }

    const netSavings = aTotalCost - (bTotalCost - investmentTaxSavings);
    const bWins = netSavings > 0;

    return {
      aMonthly, bMonthly, aInterest, bInterest, aTotalCost, bTotalCost,
      bFeeAmount, additionalTax, netSavings, bWins, investmentTaxSavings,
      monthlyDiff: Math.abs(aMonthly - bMonthly),
    };
  }, [mortgageAmount, aRate, bRate, term, amortization, additionalIncome, effectiveTaxRate, isInvestment, bFee]);

  const maxTotalCost = Math.max(results.aTotalCost, results.bTotalCost);

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
              <span className="text-gold-400">Self-Employed: A-Lender vs B-Lender</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Users className="w-4 h-4" />
                Self-Employed Borrower Tool
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-blue-500">A-Lender</span>
                {" vs "}
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">B-Lender</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Discover the true cost of qualifying at a bank vs. using business bank statements. The numbers might surprise you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Insight Banner */}
        <section className="px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-gold-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gold-300 mb-2">The Hidden Tax Trap</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Declaring extra income to qualify at a bank means paying taxes on that income for every year of your mortgage term. 
                    For a $500K mortgage, declaring $60K more income at 38% marginal tax costs <strong className="text-gold-300">$114,000 in taxes over 5 years</strong> — 
                    often far more than the higher interest on a B-lender. This calculator shows you the real math.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Inputs */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-gold-400" />
                Enter Your Details
              </h2>
              <ComplianceBanner feature="LEAD_FORM" />
              <div className="grid sm:grid-cols-2 gap-6">
                <ValidatedInput label="Mortgage Amount Needed" value={mortgageAmount} onChange={setMortgageAmount} validation={{ min: 50000, max: 5000000 }} type="currency" />
                <ValidatedInput label="Property Value" value={propertyValue} onChange={setPropertyValue} validation={{ min: 100000, max: 10000000 }} type="currency" />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
                  <div className="flex gap-2">
                    {(["BC", "AB", "ON"] as const).map((p) => (
                      <button key={p} onClick={() => { setProvince(p); setAutoTax(true); }}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${province === p ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                        {p === "BC" ? "British Columbia" : p === "AB" ? "Alberta" : "Ontario"}
                      </button>
                    ))}
                  </div>
                </div>
                <ValidatedInput label={`Additional Income to Qualify ($/year)`} value={additionalIncome} onChange={setAdditionalIncome} validation={{ min: 0, max: 500000 }} type="currency" />
                <ValidatedInput label="A-Lender Rate (%)" value={aRate} onChange={setARate} validation={{ min: 1, max: 15 }} type="percentage" />
                <ValidatedInput label="B-Lender Rate (%)" value={bRate} onChange={setBRate} validation={{ min: 1, max: 15 }} type="percentage" />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Marginal Tax Rate ({effectiveTaxRate.toFixed(2)}%)</label>
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setAutoTax(!autoTax)}
                      className={`w-12 h-6 rounded-full transition-all ${autoTax ? "bg-gold-500" : "bg-gray-600"} relative`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${autoTax ? "left-6" : "left-0.5"}`} />
                    </button>
                    <span className="text-xs text-gray-400">Auto-estimate from province</span>
                  </div>
                  {!autoTax && (
                    <ValidatedSlider label="" value={taxRate} onChange={setTaxRate} min={20} max={55} step={0.5} formatValue={(v) => `${v}%`} />
                  )}
                </div>
                <ValidatedSlider label={`Term (${term} years)`} value={term} onChange={setTerm} min={1} max={10} step={1} formatValue={(v) => `${v} years`} />
                <ValidatedSlider label={`Amortization (${amortization} years)`} value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                <ValidatedInput label="B-Lender Fee (%)" value={bFee} onChange={setBFee} validation={{ min: 0, max: 3 }} type="percentage" />
                <div className="flex items-center gap-3 py-2">
                  <button onClick={() => setIsInvestment(!isInvestment)}
                    className={`w-12 h-6 rounded-full transition-all ${isInvestment ? "bg-gold-500" : "bg-gray-600"} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isInvestment ? "left-6" : "left-0.5"}`} />
                  </button>
                  <span className="text-sm text-gray-300">Investment Property</span>
                </div>
              </div>
            </motion.div>

            {/* Recommendation Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
              className={`rounded-2xl p-6 sm:p-8 border mb-10 text-center ${results.bWins ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40" : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/40"}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {results.bWins ? <TrendingUp className="w-6 h-6 text-green-400" /> : <CheckCircle className="w-6 h-6 text-blue-400" />}
                <span className={`text-lg font-bold ${results.bWins ? "text-green-300" : "text-blue-300"}`}>
                  {results.bWins ? "B-Lender Saves You Money" : "A-Lender Is More Affordable"}
                </span>
              </div>
              <p className={`text-3xl sm:text-4xl font-bold mb-1 ${results.bWins ? "text-green-400" : "text-blue-400"}`}>
                {formatCurrency(Math.abs(results.netSavings), 0)}
              </p>
              <p className="text-sm text-gray-400">
                {results.bWins
                  ? `B-lender saves you ${formatCurrency(Math.abs(results.netSavings), 0)} over the ${term}-year term`
                  : `A-lender saves you ${formatCurrency(Math.abs(results.netSavings), 0)} over the ${term}-year term`}
                {isInvestment && results.bWins && results.investmentTaxSavings > 0 && (
                  <span className="block mt-1 text-green-300/80">+ {formatCurrency(results.investmentTaxSavings, 0)} in investment property tax savings</span>
                )}
              </p>
            </motion.div>

            {/* Two-Column Comparison */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* A-Lender */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-300">A-Lender (Bank)</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Monthly Payment</span><span className="font-semibold text-gray-200">{formatCurrency(results.aMonthly, 0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Total Interest ({term}yr)</span><span className="font-semibold text-gray-200">{formatCurrency(results.aInterest, 0)}</span></div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between"><span className="text-gray-400 text-sm">Extra Income Tax on Declared Income</span><span className="font-semibold text-red-400">{formatCurrency(results.additionalTax, 0)}</span></div>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(additionalIncome, 0)}/yr × {effectiveTaxRate.toFixed(1)}% × {term}yr</p>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between">
                    <span className="font-semibold text-gray-200">Total Cost Over Term</span>
                    <span className="text-xl font-bold text-blue-400">{formatCurrency(results.aTotalCost, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly tax burden</span>
                    <span className="text-gray-400">{formatCurrency(results.additionalTax / 12 / term, 0)}/mo</span>
                  </div>
                </div>
              </motion.div>

              {/* B-Lender */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-gold-400" />
                  <h3 className="text-xl font-bold text-gold-300">B-Lender (Alternative)</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Monthly Payment</span><span className="font-semibold text-gray-200">{formatCurrency(results.bMonthly, 0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Total Interest ({term}yr)</span><span className="font-semibold text-gray-200">{formatCurrency(results.bInterest, 0)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">B-Lender Fee ({bFee}%)</span>
                    <span className="font-semibold text-gray-200">{formatCurrency(results.bFeeAmount, 0)}</span>
                  </div>
                  {isInvestment && results.investmentTaxSavings > 0 && (
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <div className="flex justify-between"><span className="text-green-300 text-sm">Tax Savings (Interest Deductible)</span><span className="font-semibold text-green-400">-{formatCurrency(results.investmentTaxSavings, 0)}</span></div>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-4 flex justify-between">
                    <span className="font-semibold text-gray-200">Total Cost Over Term</span>
                    <span className="text-xl font-bold text-gold-400">{formatCurrency(results.bTotalCost - (isInvestment ? results.investmentTaxSavings : 0), 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly difference vs A-lender</span>
                    <span className={results.bMonthly > results.aMonthly ? "text-red-400" : "text-green-400"}>
                      {results.bMonthly > results.aMonthly ? "+" : "-"}{formatCurrency(results.monthlyDiff, 0)}/mo
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Visual Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-10">
              <h3 className="text-lg font-bold mb-6 text-center text-gray-200">Total Cost Comparison Over {term}-Year Term</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-300 font-medium">A-Lender (Bank)</span>
                    <span className="text-blue-300 font-semibold">{formatCurrency(results.aTotalCost, 0)}</span>
                  </div>
                  <div className="h-10 bg-gray-800 rounded-xl overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(results.aTotalCost / maxTotalCost) * 100}%` }}
                      transition={{ duration: 1, delay: 0.4 }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gold-300 font-medium">B-Lender (Alternative)</span>
                    <span className="text-gold-300 font-semibold">{formatCurrency(results.bTotalCost - (isInvestment ? results.investmentTaxSavings : 0), 0)}</span>
                  </div>
                  <div className="h-10 bg-gray-800 rounded-xl overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((results.bTotalCost - (isInvestment ? results.investmentTaxSavings : 0)) / maxTotalCost) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-xl" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-6 text-sm text-gray-400">
                {results.bWins ? (
                  <span className="text-green-400 font-medium">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    B-Lender is cheaper by {formatCurrency(results.netSavings, 0)}
                  </span>
                ) : (
                  <span className="text-blue-400 font-medium">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    A-Lender is cheaper by {formatCurrency(Math.abs(results.netSavings), 0)}
                  </span>
                )}
              </div>
            </motion.div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                Get Expert Advice
              </Link>
              <Link href="/calculators" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                All Calculators
              </Link>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Complete Guide: Self-Employed Mortgage Financing in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <h3 className="text-2xl font-semibold text-gray-100 mt-8">What is a B-Lender?</h3>
              <p>
                In Canada&apos;s mortgage market, lenders are categorized into tiers based on their risk appetite and qualification requirements. <strong>A-lenders</strong> include major banks (RBC, TD, Scotiabank), credit unions, and trust companies that follow strict lending guidelines. <strong>B-lenders</strong> — such as HomeTrust, Equitable Bank, ICICI Bank Canada, and dozens of others — operate in the alternative lending space. They serve borrowers who don&apos;t fit the conventional bank mold but are still creditworthy. There is also a <strong>C-lender</strong> (private lending) tier for higher-risk scenarios, but B-lenders occupy a sweet spot: institutional-quality lending with more flexible qualification criteria.
              </p>
              <p>
                B-lenders are regulated, professional institutions. They fund mortgages through investor pools or their own balance sheets, charge higher rates to compensate for the additional risk, and typically charge a lender fee (0.5% to 2% of the mortgage amount) at closing. These fees are disclosed upfront and are a standard part of alternative lending.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Why B-Lenders Use Bank Statements, Not Tax Returns</h3>
              <p>
                Here&apos;s the core insight that most self-employed borrowers miss: banks qualify you based on your <strong>CRA-declared personal income</strong>, while B-lenders qualify you based on your <strong>actual business cash flow</strong>. For a bank, if your T1 General shows $80,000 of personal income, that&apos;s what they use — regardless of whether your business actually generated $200,000. Many self-employed Canadians minimize their taxable income through legitimate deductions (business expenses, RRSP contributions, income splitting). This is smart tax planning, but it creates a problem when you need a mortgage.
              </p>
              <p>
                B-lenders solve this by looking at 12 months of business bank statements. They analyze your actual deposits and cash flow to determine your real earning capacity. No tax returns, no NOAs, no income declarations needed. If your business consistently deposits $10,000/month, a B-lender sees a $120,000/year income — even if your tax return shows $60,000.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Hidden Cost of A-Lender Qualification for Self-Employed Borrowers</h3>
              <p>
                This is the tax trap that catches thousands of self-employed Canadians every year. To qualify for a larger mortgage at a bank, you may need to declare significantly more personal income than you currently do. The problem? <strong>You pay tax on that declared income for every year you hold the mortgage.</strong>
              </p>
              <p>
                Consider a concrete example: You need a $500,000 mortgage. Your current declared income is $80,000, but to qualify you need to show $140,000. That&apos;s $60,000 in additional declared income per year. At a 38% marginal tax rate in BC, that&apos;s $22,800 per year in extra taxes — or <strong>$114,000 over a 5-year term</strong>. And here&apos;s the critical point: you pay this tax whether or not the bank actually lends to you. Once you declare the income, CRA expects their share.
              </p>
              <p>
                Meanwhile, the same mortgage with a B-lender at 7.49% (vs 4.99% at a bank) costs roughly $62,500 more in interest over 5 years, plus a $5,000 lender fee. Total B-lender premium: $67,500. The tax savings by going with the B-lender: $46,500 — and you keep your business capital working for you instead of sending it to CRA.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When B-Lending Makes Mathematical Sense</h3>
              <p>B-lending typically makes sense when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The income gap is large</strong> — You need to declare more than $30,000/year in additional income to qualify at a bank. The larger the gap, the more taxes you pay, and the better B-lending looks.</li>
                <li><strong>Your marginal tax rate is high</strong> — Higher income provinces (ON, BC) mean more tax per dollar declared. At 43% in Ontario, the tax trap is even deeper.</li>
                <li><strong>You have 20%+ down payment</strong> — B-lenders typically require 80% maximum LTV, so you need at least 20% equity. This is the main constraint.</li>
                <li><strong>You plan to refinance later</strong> — If your income situation will improve in 1-3 years (business growth, tax restructuring), a B-lender mortgage can be a bridge strategy.</li>
                <li><strong>It&apos;s an investment property</strong> — B-lender interest becomes tax-deductible for rental properties, further improving the math.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When an A-Lender Is Still the Better Choice</h3>
              <p>B-lending isn&apos;t always the answer. An A-lender (bank) is better when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The income gap is small</strong> — If you only need to declare an extra $10,000-$20,000/year, the additional tax burden may be less than the B-lender rate premium. Use this calculator to find your breakeven point.</li>
                <li><strong>You already declare enough income</strong> — If your current tax returns support the mortgage you need, there&apos;s no tax trap. Take the lower bank rate.</li>
                <li><strong>You have less than 20% down</strong> — B-lenders typically can&apos;t do insured mortgages (below 80% LTV). If you only have 5-15% down, an A-lender is often your only institutional option.</li>
                <li><strong>You want the absolute lowest rate</strong> — Even with the tax savings, some borrowers prioritize the lowest possible monthly payment for cash flow reasons.</li>
                <li><strong>Long-term holding plans</strong> — If you plan to stay in this mortgage for 10+ years at high balances, the compounding rate difference may eventually outweigh the one-time tax savings.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Investment Property Bonus: B-Lender Interest Is Tax-Deductible</h3>
              <p>
                For investment properties, there&apos;s an additional advantage to B-lending: <strong>mortgage interest on rental properties is tax-deductible against rental income</strong>. Since B-lender rates are higher, you deduct more interest, generating larger tax savings. A $500,000 B-lender mortgage at 7.49% generates approximately $187,250 in interest over 5 years. At a 38% marginal rate, that&apos;s roughly $71,155 in tax deductions — savings that partially offset the higher interest rate.
              </p>
              <p>
                This creates a counterintuitive but mathematically sound result: for investment properties, the after-tax cost of a B-lender mortgage can be significantly closer to an A-lender than the headline rates suggest. Toggle the investment property switch in this calculator to see the exact impact for your situation.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Real Example Walkthrough</h3>
              <p>
                Meet Sarah, a self-employed consultant in Vancouver. She wants to buy a $750,000 condo with 20% down ($150,000), needing a $600,000 mortgage. Her business nets $180,000/year, but her accountant optimizes her personal declarations to $70,000. To qualify at a bank for $600K, she needs to show $130,000 in personal income — an extra $60,000/year.
              </p>
              <p>
                <strong>A-Lender path:</strong> 4.99% rate, monthly payment $3,514. Total interest over 5 years: $110,840. Additional tax on $60K declared income at BC&apos;s ~38% rate: $22,800 × 5 = $114,000. <strong>Total cost over term: $224,840.</strong>
              </p>
              <p>
                <strong>B-Lender path:</strong> 7.49% rate, monthly payment $4,396. Total interest over 5 years: $163,760. Lender fee at 1%: $6,000. <strong>Total cost over term: $169,760.</strong>
              </p>
              <p>
                <strong>Result:</strong> B-lender saves Sarah <strong>$55,080 over the 5-year term</strong>. She pays $882 more per month, but saves over $55K in total by not over-declaring income. At renewal, if her income situation has changed, she can refinance to an A-lender.
              </p>
              <p className="text-sm text-gray-500 italic">
                Note: This example uses illustrative rates and is simplified for clarity. Actual costs vary based on your specific situation. Consult a licensed mortgage broker for personalized advice.
              </p>

              <div className="mt-8">
                <Link href="/calculators/self-employed" className="text-gold-400 hover:text-gold-300 underline">Self-Employed Income Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/investment" className="text-gold-400 hover:text-gold-300 underline">Investment Property Calculator</Link>
              </div>
            </div>
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
