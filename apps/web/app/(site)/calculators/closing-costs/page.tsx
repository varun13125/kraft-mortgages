"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, AlertTriangle, ArrowRight, Info, Home, Receipt,
  HelpCircle, ChevronDown, ChevronUp, Shield, FileText
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

type Province = "BC" | "AB" | "ON";

/* ── Land Transfer Tax ──────────────────────────────── */

function bcLTT(price: number, firstTime: boolean): number {
  // BC First-Time Home Buyers' Program (2025):
  // Full exemption: ≤ $500,000
  // Partial exemption: $500,001 - $536,000 (gradual phase-out)
  // No exemption: > $536,000
  if (firstTime && price <= 500000) return 0;
  if (firstTime && price <= 536000) {
    // Phase-out: 2% on amount over $500K, reduced proportionally
    const phaseOut = 1 - ((price - 500000) / 36000);
    return (price - 500000) * 0.02 * (1 - phaseOut);
  }
  // Standard BC Property Transfer Tax brackets:
  // 1% on first $200K, 2% on $200K-$2M, 3% over $2M
  let tax = 0;
  if (price <= 200000) tax = price * 0.01;
  else {
    tax = 200000 * 0.01 + Math.min(price - 200000, 1800000) * 0.02;
    if (price > 2000000) tax += (price - 2000000) * 0.03;
  }
  return tax;
}

function abLTT(): number {
  return 0; // Alberta has no provincial LTT (small title registration fee ~$50)
}

function onLTT(price: number): number {
  let tax = 0;
  if (price <= 55000) tax = price * 0.005;
  else if (price <= 250000) tax = 55000 * 0.005 + (price - 55000) * 0.01;
  else if (price <= 400000) tax = 55000 * 0.005 + 195000 * 0.01 + (price - 250000) * 0.015;
  else if (price <= 2000000) tax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + (price - 400000) * 0.02;
  else tax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + 1600000 * 0.02 + (price - 2000000) * 0.025;
  return tax;
}

function landTransferTax(price: number, province: Province, firstTime: boolean): number {
  if (province === "BC") return bcLTT(price, firstTime);
  if (province === "AB") return abLTT();
  return onLTT(price);
}

/* ── CMHC Premium ───────────────────────────────────── */

function cmhcPremium(downPayment: number, price: number): number {
  const loan = price - downPayment;
  if (downPayment >= price * 0.2) return 0; // 20%+ down, no CMHC
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

/* ── Property Tax Estimate ──────────────────────────── */

function estimatedPropertyTax(price: number, propertyType: string): number {
  const rates: Record<string, number> = { house: 0.005, condo: 0.004, townhouse: 0.0045 };
  return price * (rates[propertyType] || 0.005);
}

/* ── FAQ ───────────────────────────────────────────── */

const faqs = [
  {
    q: "How much are closing costs on average in BC?",
    a: "Closing costs in BC typically range from 1.5% to 4% of the purchase price. For a $700,000 home, expect to pay $10,500 to $28,000. The biggest variable is land transfer tax, which for first-time buyers on homes under $500,000 is fully exempt."
  },
  {
    q: "Does Alberta really have no land transfer tax?",
    a: "Correct — Alberta does not charge a provincial land transfer tax. Instead, there's a small title registration fee (approximately $50) and a mortgage registration fee. This makes Alberta one of the most affordable provinces for closing costs."
  },
  {
    q: "How do first-time home buyer programs help with closing costs?",
    a: "BC's First-Time Home Buyers' Program fully exempts land transfer tax on homes up to $500,000, with a partial exemption up to $536,000. Ontario offers a rebate of up to $4,000 for first-time buyers. These programs can save thousands at closing — check eligibility based on your province and purchase price."
  },
  {
    q: "Can I roll closing costs into my mortgage?",
    a: "Some closing costs like CMHC insurance premiums can be added to your mortgage balance. However, most costs (legal fees, inspections, land transfer tax) must be paid in cash on closing day. Budget for these separately to avoid last-minute surprises."
  },
  {
    q: "What's the difference between closing costs and a down payment?",
    a: "Your down payment is the portion of the home price you pay upfront (5% to 20%+). Closing costs are additional fees paid to various parties during the transaction — taxes, legal fees, inspections, insurance, etc. Both require cash, but they're separate. A common mistake is saving only for the down payment and forgetting closing costs."
  }
];

interface CostItem {
  label: string;
  amount: number;
  note?: string;
  highlight?: boolean;
}

export default function ClosingCostsPage() {
  const [purchasePrice, setPurchasePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [province, setProvince] = useState<Province>("BC");
  const [firstTime, setFirstTime] = useState(true);
  const [propertyType, setPropertyType] = useState<"house" | "condo" | "townhouse">("house");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const downPayment = (purchasePrice * downPaymentPct) / 100;

  const costs = useMemo((): CostItem[] => {
    const ltt = landTransferTax(purchasePrice, province, firstTime);
    const lttWithoutExemption = landTransferTax(purchasePrice, province, false);
    const cmhc = cmhcPremium(downPayment, purchasePrice);
    const legal = 2000;
    const inspection = 550;
    const titleInsurance = 325;
    const appraisal = 500;
    const propTax = estimatedPropertyTax(purchasePrice, propertyType);
    const utilities = 350;
    const moving = 1000;

    return [
      { label: "Land Transfer Tax", amount: ltt, note: province === "BC" && firstTime ? `First-time buyer savings: ${formatCurrency(lttWithoutExemption - ltt, 0)}` : undefined, highlight: firstTime && province === "BC" && ltt < lttWithoutExemption },
      { label: "Legal Fees", amount: legal },
      { label: "Home Inspection", amount: inspection },
      { label: "Title Insurance", amount: titleInsurance },
      { label: "Property Appraisal", amount: appraisal },
      ...(cmhc > 0 ? [{ label: "CMHC Insurance Premium", amount: cmhc, note: `${formatCurrency(downPaymentPct, 0)}% down — can be added to mortgage` }] : []),
      { label: "Property Tax Adjustment", amount: propTax, note: "Estimated annual property tax" },
      { label: "Utility Connections", amount: utilities },
      { label: "Moving Costs", amount: moving },
    ];
  }, [purchasePrice, downPaymentPct, province, firstTime, propertyType, downPayment]);

  const totalClosing = costs.reduce((s, c) => s + c.amount, 0);
  const totalCash = downPayment + totalClosing;

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
              <span className="text-gold-400">Closing Costs Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Receipt className="w-4 h-4" />
                Total Cost Breakdown
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Closing Costs</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Calculate all closing costs for your home purchase — land transfer tax, legal fees, CMHC, and more.
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
                    Purchase Details
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput
                      label="Home Purchase Price"
                      value={purchasePrice}
                      onChange={setPurchasePrice}
                      validation={{ min: 50000, max: 5000000 }}
                      type="currency"
                    />
                    <ValidatedSlider
                      label={`Down Payment (${downPaymentPct}%)`}
                      value={downPaymentPct}
                      onChange={setDownPaymentPct}
                      min={5}
                      max={50}
                      step={1}
                      formatValue={(v) => `${v}% (${formatCurrency(purchasePrice * v / 100, 0)})`}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
                      <div className="flex gap-2">
                        {(["BC", "AB", "ON"] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setProvince(p)}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                              province === p
                                ? "bg-gold-500 text-black border-gold-500"
                                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {p === "BC" ? "British Columbia" : p === "AB" ? "Alberta" : "Ontario"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                      <div className="flex gap-2">
                        {(["house", "condo", "townhouse"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setPropertyType(t)}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                              propertyType === t
                                ? "bg-gold-500 text-black border-gold-500"
                                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {t === "house" ? "House" : t === "condo" ? "Condo" : "Townhouse"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFirstTime(!firstTime)}
                        className={`w-12 h-6 rounded-full transition-all ${firstTime ? "bg-gold-500" : "bg-gray-600"} relative`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${firstTime ? "left-6" : "left-0.5"}`} />
                      </button>
                      <span className="text-sm text-gray-300">First-Time Home Buyer</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Total Closing Costs */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Total Closing Costs</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                    {formatCurrency(totalClosing, 0)}
                  </p>
                  <p className="text-sm text-gray-300">
                    {((totalClosing / purchasePrice) * 100).toFixed(1)}% of purchase price
                  </p>
                </div>

                {/* Total Cash Needed */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <p className="text-sm text-gray-400 mb-1">Total Cash Needed</p>
                  <p className="text-3xl font-bold text-gray-100 mb-3">
                    {formatCurrency(totalCash, 0)}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">Down Payment</span>
                      <span className="font-semibold text-gray-200">{formatCurrency(downPayment, 0)}</span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400 block text-xs">Closing Costs</span>
                      <span className="font-semibold text-gold-400">{formatCurrency(totalClosing, 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Breakdown */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-400" />
                    Cost Breakdown
                  </h4>
                  <div className="space-y-3">
                    {costs.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${item.highlight ? "text-gold-400 font-medium" : "text-gray-300"}`}>
                              {item.label}
                            </span>
                            {item.highlight && (
                              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">SAVINGS</span>
                            )}
                          </div>
                          {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                        </div>
                        <span className={`text-sm font-medium ${item.highlight ? "text-green-400" : "text-gray-200"}`}>
                          {item.amount === 0 ? "Exempt" : formatCurrency(item.amount, 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                    <span className="font-semibold text-gray-200">Total</span>
                    <span className="font-bold text-gold-400 text-lg">{formatCurrency(totalClosing, 0)}</span>
                  </div>
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

        {/* Info Box */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Understanding This Estimate</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Closing costs vary by lender, lawyer, and specific transaction details.</p>
                    <p>• This calculator uses average estimates — actual costs may be higher or lower.</p>
                    <p>• CMHC premiums shown can be added to your mortgage balance (not required in cash).</p>
                    <p>• Property tax estimates are based on provincial averages and may differ for your specific property.</p>
                    <p>• Toronto buyers should add the Municipal Land Transfer Tax (not included in this calculation).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Complete Guide to Closing Costs in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                When buying a home in Canada, closing costs are the fees and expenses paid on top of your purchase price and down payment. Many first-time buyers focus entirely on saving for a down payment and are caught off guard by closing costs that can add up to thousands of dollars. Understanding these costs before you make an offer is critical.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Closing Costs by Province</h3>

              <p><strong>British Columbia:</strong> BC charges land transfer tax (officially Property Transfer Tax) at 1% on the first $200,000, 2% up to $2,000,000, and 3% above that. The First-Time Home Buyers&apos; Program fully exempts homes priced at $500,000 or less, with partial exemptions up to $536,000. For a $700,000 home, expect about $12,000 in LTT without the exemption.</p>

              <p><strong>Alberta:</strong> Alberta is the only province without a land transfer tax. Instead, you pay a small title registration fee (approximately $50) and mortgage registration fee. This makes Alberta significantly more affordable for closing costs — often saving buyers $10,000 or more compared to BC or Ontario on equivalent purchases.</p>

              <p><strong>Ontario:</strong> Ontario has a tiered land transfer tax system starting at 0.5% on the first $55,000 and rising to 2.5% on amounts over $2,000,000. Toronto buyers pay an additional Municipal Land Transfer Tax (MLTT), effectively doubling the cost within city limits. First-time buyers can claim a rebate of up to $4,000.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">First-Time Home Buyer Programs</h3>
              <p>
                Each province offers programs to reduce closing costs for first-time buyers. BC&apos;s First-Time Home Buyers&apos; Program can save up to $13,000 in land transfer tax. Ontario&apos;s Land Transfer Tax refund provides up to $4,000. The federal First-Time Home Buyer Incentive (where available) can also reduce your mortgage amount, though the program has evolved over the years. Check current availability with your mortgage broker.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Tips to Prepare for Closing Costs</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Budget 1.5% to 4% of the purchase price</strong> for closing costs on top of your down payment.</li>
                <li><strong>Get a lawyer quote early</strong> — legal fees typically range from $1,500 to $3,000 but can vary.</li>
                <li><strong>Don&apos;t skip the home inspection</strong> — the $400-$800 cost can save you from expensive surprises.</li>
                <li><strong>Check your CMHC eligibility</strong> — if you can put 20% down, you avoid the premium entirely.</li>
                <li><strong>Apply for first-time buyer exemptions</strong> before closing — these savings are significant in BC and Ontario.</li>
                <li><strong>Keep a cash buffer</strong> — unexpected adjustments at closing can add $500 to $2,000.</li>
              </ul>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
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
