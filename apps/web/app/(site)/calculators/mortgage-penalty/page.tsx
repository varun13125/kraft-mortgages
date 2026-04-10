"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, AlertTriangle, ArrowRight, Info, Scale, Percent,
  Clock, HelpCircle, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency, formatPercentage } from "@/lib/utils/validation";

function ThreeMonthsInterest(balance: number, annualRate: number): number {
  return (balance * annualRate) / 12 * 3;
}

function IRD(
  contractRate: number,
  currentRate: number,
  balance: number,
  remainingMonths: number
): number {
  return (contractRate - currentRate) * balance * (remainingMonths / 12);
}

function MortgageTypeToggle({
  value,
  onChange,
}: {
  value: "fixed" | "variable";
  onChange: (v: "fixed" | "variable") => void;
}) {
  return (
    <div className="flex gap-2">
      {(["fixed", "variable"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
            value === t
              ? "bg-gold-500 text-black border-gold-500"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          {t === "fixed" ? "Fixed Rate" : "Variable Rate"}
        </button>
      ))}
    </div>
  );
}

const faqs = [
  {
    q: "How do I know if my mortgage penalty will use IRD or three months' interest?",
    a: "For variable-rate mortgages, lenders almost always charge three months' interest. For fixed-rate mortgages, most lenders calculate both the IRD and three months' interest, then charge the higher amount. Some lenders use more aggressive IRD calculations — check your mortgage contract for specifics."
  },
  {
    q: "Can I negotiate or reduce my mortgage penalty?",
    a: "Yes, in some cases. You can negotiate directly with your lender, especially if you're renewing with them. Some lenders offer penalty waivers during renewal. Porting your mortgage to a new property can also avoid the penalty entirely. A mortgage broker can help explore these options."
  },
  {
    q: "What is the posted rate and why does it matter for IRD?",
    a: "The posted rate is the lender's published rate for a term matching your remaining time. Many lenders use posted rates rather than discounted rates in the IRD calculation, which can significantly increase your penalty. This calculator uses the current posted rate you provide for the remaining term."
  },
  {
    q: "Is a mortgage penalty tax-deductible?",
    a: "If you're breaking your mortgage for an investment property, the penalty may be deductible against rental income. For a principal residence, mortgage penalties are generally not tax-deductible. Consult a tax professional for advice specific to your situation."
  },
  {
    q: "When does it make sense to break my mortgage despite the penalty?",
    a: "It can make sense if the interest savings from a lower rate outweigh the penalty over a reasonable timeframe — typically 12 to 24 months. For example, if your penalty is $8,000 but you'd save $400/month in interest, you'd break even in 20 months. Our calculator shows this break-even analysis."
  }
];

export default function MortgagePenaltyPage() {
  const [balance, setBalance] = useState(400000);
  const [contractRate, setContractRate] = useState(5.49);
  const [remainingMonths, setRemainingMonths] = useState(24);
  const [mortgageType, setMortgageType] = useState<"fixed" | "variable">("fixed");
  const [currentPostedRate, setCurrentPostedRate] = useState(4.49);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const results = useMemo(() => {
    const threeMo = ThreeMonthsInterest(balance, contractRate / 100);

    if (mortgageType === "variable") {
      return { penalty: threeMo, threeMonths: threeMo, ird: 0, type: "3 Months Interest" };
    }

    const ird = IRD(contractRate / 100, currentPostedRate / 100, balance, remainingMonths);
    const penalty = Math.max(threeMo, ird);
    return {
      penalty,
      threeMonths: threeMo,
      ird,
      type: ird > threeMo ? "IRD (Interest Rate Differential)" : "3 Months Interest",
      breakEvenMonths:
        ird > threeMo && contractRate / 100 > currentPostedRate / 100
          ? Math.ceil(ird / ((contractRate / 100 - currentPostedRate / 100) * balance / 12))
          : null,
    };
  }, [balance, contractRate, remainingMonths, mortgageType, currentPostedRate]);

  const monthlyInterestSaved =
    mortgageType === "fixed"
      ? (contractRate / 100 - currentPostedRate / 100) * balance / 12
      : 0;

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
              <span className="text-gold-400">Mortgage Penalty Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Scale className="w-4 h-4" />
                Break Cost Analysis
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Mortgage Penalty</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Estimate your mortgage break penalty — IRD, three months' interest, and break-even analysis.
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
                    <ValidatedInput
                      label="Current Mortgage Balance"
                      value={balance}
                      onChange={setBalance}
                      validation={{ min: 10000, max: 5000000 }}
                      type="currency"
                    />
                    <ValidatedSlider
                      label={`Contract Interest Rate (${formatPercentage(contractRate)})`}
                      value={contractRate}
                      onChange={setContractRate}
                      min={1.0}
                      max={12.0}
                      step={0.01}
                      formatValue={(v) => `${v.toFixed(2)}%`}
                    />
                    <ValidatedSlider
                      label={`Remaining Term (${remainingMonths} months)`}
                      value={remainingMonths}
                      onChange={setRemainingMonths}
                      min={1}
                      max={120}
                      step={1}
                      formatValue={(v) => `${v} mo`}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Mortgage Type</label>
                      <MortgageTypeToggle value={mortgageType} onChange={setMortgageType} />
                    </div>
                    {mortgageType === "fixed" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div className="relative">
                          <ValidatedSlider
                            label={`Current Posted Rate for Remaining Term (${formatPercentage(currentPostedRate)})`}
                            value={currentPostedRate}
                            onChange={setCurrentPostedRate}
                            min={1.0}
                            max={12.0}
                            step={0.01}
                            formatValue={(v) => `${v.toFixed(2)}%`}
                          />
                          <div className="flex items-start gap-2 mt-2 text-xs text-gray-400 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                            <Info className="w-3.5 h-3.5 mt-0.5 text-blue-400 flex-shrink-0" />
                            <span>This is the lender&apos;s current posted rate for a term matching your remaining months. Check your lender&apos;s website or call them directly.</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Penalty Amount */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Estimated Penalty</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                    {formatCurrency(results.penalty, 0)}
                  </p>
                  <p className="text-sm text-gray-300">
                    Based on <strong>{results.type}</strong> calculation
                  </p>
                </div>

                {/* Comparison (fixed only) */}
                {mortgageType === "fixed" && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-gold-400" />
                      Penalty Comparison
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`rounded-lg p-4 ${results.type.includes("IRD") ? "bg-red-500/20 border border-red-500/30" : "bg-white/5"}`}>
                        <span className="text-xs text-gray-300 block mb-1">IRD Penalty</span>
                        <span className="text-xl font-bold">{formatCurrency(results.ird, 0)}</span>
                        {results.type.includes("IRD") && (
                          <span className="text-xs text-red-400 block mt-1">← Lender uses this</span>
                        )}
                      </div>
                      <div className={`rounded-lg p-4 ${!results.type.includes("IRD") ? "bg-red-500/20 border border-red-500/30" : "bg-white/5"}`}>
                        <span className="text-xs text-gray-300 block mb-1">3 Months Interest</span>
                        <span className="text-xl font-bold">{formatCurrency(results.threeMonths, 0)}</span>
                        {!results.type.includes("IRD") && (
                          <span className="text-xs text-red-400 block mt-1">← Lender uses this</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Lenders charge the greater of these two amounts.</p>
                  </div>
                )}

                {/* Break-Even Analysis */}
                {mortgageType === "fixed" && results.breakEvenMonths && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gold-400" />
                      Break-Even Analysis
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Based on your penalty of <strong>{formatCurrency(results.penalty, 0)}</strong>, you would need to save{" "}
                      <strong>{formatCurrency(monthlyInterestSaved, 0)}/month</strong> in interest to break even in{" "}
                      <strong className="text-gold-400">{results.breakEvenMonths} months</strong>.
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all"
                        style={{ width: `${Math.min((results.breakEvenMonths / remainingMonths) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Break-even</span>
                      <span>Term end</span>
                    </div>
                  </div>
                )}

                {/* Months of Interest Equivalent */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-3">Equivalent Interest</h4>
                  <p className="text-gray-300 text-sm">
                    Your penalty equals{" "}
                    <strong className="text-gold-400">
                      {(results.penalty / ((balance * contractRate / 100) / 12)).toFixed(1)} months
                    </strong>{" "}
                    of regular mortgage interest payments.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Expert Advice
                  </Link>
                  <Link href="/calculators/payment" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Payment Calculator
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
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Important Disclaimer</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• This calculator provides estimates only — actual penalties depend on your lender&apos;s specific calculation method.</p>
                    <p>• Some lenders use &quot;discounted rate&quot; IRD calculations which can result in higher penalties.</p>
                    <p>• Always request a formal payoff statement from your lender before making decisions.</p>
                    <p>• A mortgage broker can often negotiate better terms or find alternatives to breaking your mortgage.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">How Mortgage Penalties Work in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Breaking your mortgage before the term ends is more common than many homeowners realize. Whether you&apos;re selling your home, refinancing to access equity, or switching to a better rate, understanding your mortgage penalty is essential to making an informed financial decision.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Variable vs. Fixed Rate Penalties</h3>
              <p>
                The type of mortgage you have determines how your penalty is calculated. Variable-rate mortgages typically charge three months&apos; interest — a straightforward calculation based on your current balance and rate. Fixed-rate mortgages, however, can be significantly more complex and often more expensive to break.
              </p>
              <p>
                For fixed-rate mortgages, lenders calculate both the three months&apos; interest penalty and the Interest Rate Differential (IRD), then charge whichever is higher. The IRD accounts for the difference between your contract rate and the lender&apos;s current rate for a term matching your remaining time.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Understanding the IRD Calculation</h3>
              <p>
                The Interest Rate Differential is designed to compensate the lender for the interest income they&apos;ll lose when you break your contract early. The basic formula is:
              </p>
              <p className="bg-white/5 rounded-lg p-4 font-mono text-sm">
                IRD = (Contract Rate − Current Posted Rate) × Remaining Balance × Remaining Months ÷ 12
              </p>
              <p>
                For example, if you have a $400,000 mortgage at 5.49% with 24 months remaining, and the current 2-year posted rate is 4.49%, your IRD would be: (0.0549 − 0.0449) × $400,000 × 2 = <strong>$8,000</strong>.
              </p>
              <p>
                Some lenders use a more aggressive calculation that factors in the original rate discount you received, which can significantly increase the penalty. Always ask your lender exactly how they calculate the IRD.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Tips to Minimize Your Mortgage Penalty</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Port your mortgage:</strong> If you&apos;re buying a new home, you can often transfer your existing mortgage without paying a penalty.</li>
                <li><strong>Time your break strategically:</strong> Penalties decrease as your term progresses. Waiting until closer to renewal can save thousands.</li>
                <li><strong>Negotiate with your lender:</strong> Some lenders will reduce penalties, especially if you&apos;re renewing with them.</li>
                <li><strong>Make a lump-sum payment first:</strong> If your mortgage allows prepayments, reduce the balance before breaking to lower the penalty.</li>
                <li><strong>Blend and extend:</strong> Some lenders offer a blended rate that combines your current rate with a new one, avoiding the penalty entirely.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Refinancing Makes Sense Despite the Penalty</h3>
              <p>
                Even with a penalty, refinancing can be worthwhile if the long-term savings outweigh the upfront cost. Consider refinancing if you can secure a rate at least 0.5% lower than your current rate with more than 18 months remaining on your term. The break-even point — where cumulative interest savings exceed the penalty — is the key metric to evaluate.
              </p>
              <p>
                Use our mortgage penalty calculator above to estimate your break-even timeline. If the break-even falls within your remaining term or within a reasonable timeframe (typically under 24 months), refinancing may be a smart move.
              </p>
              <p>
                A licensed mortgage broker can help you compare options, negotiate with lenders, and find the best path forward — whether that means refinancing, blending, or waiting until renewal.
              </p>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/renewal" className="text-gold-400 hover:text-gold-300 underline">Renewal Calculator</Link>
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
      </main>
    </>
  );
}
