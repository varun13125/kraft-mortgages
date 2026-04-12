"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Info, Home, Receipt,
  HelpCircle, ChevronDown, ChevronUp, PiggyBank, Wallet, Shield, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";

/* ── Down Payment Calculation ──────────────────────── */

function minDownPayment(price: number): number {
  if (price <= 500000) return price * 0.05;
  if (price <= 1000000) return 500000 * 0.05 + (price - 500000) * 0.10;
  return 500000 * 0.05 + 500000 * 0.10 + (price - 1000000) * 0.20;
}

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

/* ── FAQ ───────────────────────────────────────────── */

const faqs = [
  {
    q: "What is the minimum down payment in Canada?",
    a: "For homes up to $500,000, the minimum is 5%. Between $500,000 and $1,000,000, it's 5% on the first $500K and 10% on the portion above $500K. For homes over $1,000,000, the portion over $1M requires a 20% down payment. These rules apply to owner-occupied properties — investment properties typically require 20% minimum."
  },
  {
    q: "Can I use my RRSP for a down payment?",
    a: "Yes, through the Home Buyers' Plan (HBP), you can withdraw up to $60,000 from your RRSP tax-free to buy or build a qualifying home. You have up to 15 years to repay the withdrawal. Both you and your spouse can each withdraw $60,000, giving a couple up to $120,000 from RRSPs alone."
  },
  {
    q: "What is the FHSA and how much can I use?",
    a: "The First Home Savings Account (FHSA) lets you contribute up to $8,000 per year (lifetime max $40,000). Contributions are tax-deductible, and withdrawals for a qualifying home purchase are tax-free. You can combine FHSA withdrawals with the HBP for even more purchasing power."
  },
  {
    q: "Can my down payment be gifted?",
    a: "Yes, gifted down payments are allowed for owner-occupied properties from immediate family members (parents, grandparents, siblings). The lender will require a gift letter confirming the funds are a gift, not a loan. For investment properties, most lenders require the down payment to come from your own savings."
  },
  {
    q: "What happens if I put less than 20% down?",
    a: "If your down payment is less than 20%, you must pay CMHC mortgage insurance (or equivalent from Sagen or Canada Guaranty). The premium ranges from 4.0% (at 5% down) to 2.8% (at 15-19.99% down) and is typically added to your mortgage balance. This insurance protects the lender, not you."
  }
];

export default function DownPaymentPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [homePrice, setHomePrice] = useState(700000);
  const [downPaymentOverride, setDownPaymentOverride] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [customDown, setCustomDown] = useState<number | null>(null);

  const downPayment = customDown ?? minDownPayment(homePrice);
  const downPct = (downPayment / homePrice) * 100;
  const needsInsurance = downPayment < homePrice * 0.2;
  const cmhc = cmhcPremium(downPayment, homePrice);
  const mortgageAmount = homePrice - downPayment;
  const totalMortgage = mortgageAmount + cmhc;
  const cashToClose = downPayment + (needsInsurance ? cmhc : 0);
  const cmhcPctOfPrice = needsInsurance ? (cmhc / homePrice) * 100 : 0;

  const useCustom = customDown !== null;

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
              <span className="text-gold-400">Down Payment Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Wallet className="w-4 h-4" />
                Down Payment Planning
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Down Payment</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Calculate your minimum down payment, CMHC insurance, and total cash needed to close on a home in Canada.
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
                    Home Details
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
                source="calculator-pdf-down-payment"
                title="Your Down Payment Analysis"
                subtitle="Get a personalized PDF with your down payment breakdown"
                leadMessage="PDF Report Download — Down Payment"
                mortgageType="Purchase"
                amount={homePrice.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Down Payment Analysis",
                    calculatorName: "Down Payment Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: "$" + Math.round(homePrice).toLocaleString("en-CA") },
                          { label: "Down Payment", value: downPct.toFixed(1) + "% (" + "$" + Math.round(downPayment).toLocaleString("en-CA") + ")" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Mortgage Amount", value: "$" + Math.round(mortgageAmount).toLocaleString("en-CA"), highlight: true },
                          { label: "CMHC Required?", value: needsInsurance ? "Yes" : "No" },
                          { label: "CMHC Premium", value: needsInsurance ? "$" + Math.round(cmhc).toLocaleString("en-CA") : "N/A" },
                          { label: "Total Mortgage", value: "$" + Math.round(totalMortgage).toLocaleString("en-CA"), highlight: true },
                          { label: "Cash to Close", value: "$" + Math.round(cashToClose).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "The minimum down payment is 5% on the first $500K and 10% above. Under 20% requires CMHC insurance."
                  });
                }}
              />
            </div>
                                    <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput
                      label="Home Purchase Price"
                      value={homePrice}
                      onChange={setHomePrice}
                      validation={{ min: 100000, max: 5000000 }}
                      type="currency"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Down Payment Mode</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCustomDown(null)}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                            !useCustom
                              ? "bg-gold-500 text-black border-gold-500"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          Minimum Required
                        </button>
                        <button
                          onClick={() => setCustomDown(downPayment)}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                            useCustom
                              ? "bg-gold-500 text-black border-gold-500"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          Custom Amount
                        </button>
                      </div>
                    </div>
                    {useCustom && (
                      <ValidatedInput
                        label="Your Down Payment"
                        value={customDown!}
                        onChange={setCustomDown}
                        validation={{ min: 0, max: homePrice }}
                        type="currency"
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Cash to Close */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">Total Cash Needed to Close</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                    {formatCurrency(cashToClose, 0)}
                  </p>
                  <p className="text-sm text-gray-300">
                    {downPct.toFixed(1)}% of {formatCurrency(homePrice, 0)}
                  </p>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-gold-400" />
                    How Your Home Is Financed
                  </h4>
                  <div className="flex rounded-lg overflow-hidden h-10 mb-4">
                    <div
                      className="bg-gold-500 flex items-center justify-center text-xs font-bold text-black"
                      style={{ width: `${Math.max(downPct, 3)}%` }}
                    >
                      {downPct >= 8 ? `${downPct.toFixed(1)}%` : ""}
                    </div>
                    {needsInsurance && cmhc > 0 && (
                      <div
                        className="bg-red-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${Math.max(cmhcPctOfPrice, 1.5)}%` }}
                      >
                        {cmhcPctOfPrice >= 3 ? `${cmhcPctOfPrice.toFixed(1)}%` : ""}
                      </div>
                    )}
                    <div className="bg-blue-500 flex-1 flex items-center justify-center text-xs font-bold text-white">
                      Mortgage
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-sm bg-gold-500" />
                      <span className="text-gray-300">Down Payment</span>
                      <span className="ml-auto font-semibold text-gray-200">{formatCurrency(downPayment, 0)}</span>
                    </div>
                    {needsInsurance && cmhc > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm bg-red-500" />
                        <span className="text-gray-300">CMHC Insurance</span>
                        <span className="ml-auto font-semibold text-gray-200">{formatCurrency(cmhc, 0)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-sm bg-blue-500" />
                      <span className="text-gray-300">Mortgage Amount</span>
                      <span className="ml-auto font-semibold text-gray-200">{formatCurrency(mortgageAmount, 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Detail Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <span className="text-gray-400 block text-xs mb-1">Minimum Down Payment</span>
                    <span className="text-xl font-bold text-gray-100">{formatCurrency(minDownPayment(homePrice), 0)}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <span className="text-gray-400 block text-xs mb-1">Mortgage Insurance</span>
                    <span className="text-xl font-bold text-gray-100">{needsInsurance ? formatCurrency(cmhc, 0) : "Not Required"}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <span className="text-gray-400 block text-xs mb-1">Total Mortgage</span>
                    <span className="text-xl font-bold text-gray-100">{formatCurrency(totalMortgage, 0)}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <span className="text-gray-400 block text-xs mb-1">Insurance Required?</span>
                    <span className={`text-xl font-bold ${needsInsurance ? "text-amber-400" : "text-green-400"}`}>
                      {needsInsurance ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {/* Down Payment Rule Breakdown */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold text-sm mb-3 text-gray-300">How Your Minimum Was Calculated</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    {homePrice > 1000000 && (
                      <div className="flex justify-between">
                        <span>20% on amount over $1,000,000</span>
                        <span>{formatCurrency(Math.min(homePrice - 1000000, homePrice) * 0.20, 0)}</span>
                      </div>
                    )}
                    {homePrice > 500000 && (
                      <div className="flex justify-between">
                        <span>10% on ${formatCurrency(Math.min(homePrice, 1000000) - Math.min(homePrice, 500000), 0)} ($500K–$1M portion)</span>
                        <span>{formatCurrency((Math.min(homePrice, 1000000) - 500000) * 0.10, 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>5% on first $500,000</span>
                      <span>{formatCurrency(Math.min(homePrice, 500000) * 0.05, 0)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-gray-200">
                      <span>Minimum Down Payment</span>
                      <span>{formatCurrency(minDownPayment(homePrice), 0)}</span>
                    </div>
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
                <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Down Payment Sources & Programs</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p><strong>RRSP Home Buyers&apos; Plan:</strong> Withdraw up to $60,000 tax-free. 15-year repayment period.</p>
                    <p><strong>FHSA:</strong> Up to $8,000/year, $40,000 lifetime. Tax-deductible contributions, tax-free withdrawal.</p>
                    <p><strong>Gifted Down Payment:</strong> Immediate family can gift funds with a signed gift letter.</p>
                    <p><strong>Builder Incentives:</strong> Some developers offer cash back or bonus incentives toward closing costs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Complete Guide to Down Payments in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Your down payment is the upfront cash portion you pay toward purchasing a home. The remaining balance is financed through a mortgage. In Canada, the minimum down payment you need depends on the purchase price of the property, with tiered rules that change at $500,000 and $1,000,000 thresholds.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Canada&apos;s Down Payment Rules (2024–2025)</h3>
              <p>
                For homes priced at $500,000 or below, the minimum down payment is 5% of the purchase price. For homes between $500,000 and $1,000,000, you need 5% on the first $500,000 and 10% on the amount between $500,000 and $1,000,000. For homes exceeding $1,000,000, the portion above $1,000,000 requires a minimum of 20% down. This means a $1,200,000 home requires at least $195,000 down (5% on the first $500K + 10% on the next $500K + 20% on the remaining $200K).
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The $1,000,000 Threshold</h3>
              <p>
                The $1M threshold is significant because it creates a substantial jump in required cash. A home at $999,000 needs $74,900 down, while one at $1,001,000 needs $77,700 — and that gap widens fast. At $1.5M, you need $200,000. This is one reason why the Canadian mortgage market has a natural price ceiling around $1M for first-time buyers without significant savings or family help.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">CMHC Mortgage Insurance</h3>
              <p>
                When your down payment is less than 20%, mortgage default insurance (commonly called CMHC insurance) is mandatory. The premium ranges from 4.0% at 5% down to 2.8% at 15-19.99% down, calculated on the mortgage amount. This premium is typically added to your mortgage balance, so you don&apos;t need to pay it in cash — but it does increase your total mortgage and monthly payments. The insurance protects the lender if you default, not you.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Strategies to Build Your Down Payment Faster</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>RRSP Home Buyers&apos; Plan (HBP):</strong> Withdraw up to $60,000 from your RRSP tax-free. A couple can access $120,000 combined. You have 15 years to repay.</li>
                <li><strong>First Home Savings Account (FHSA):</strong> Contribute up to $8,000/year ($40,000 lifetime). Contributions are tax-deductible like an RRSP, and qualifying withdrawals are tax-free like a TFSA.</li>
                <li><strong>TFSA Savings:</strong> Use Tax-Free Savings Account room to grow your down payment savings tax-free over time.</li>
                <li><strong>Gifted Down Payments:</strong> Parents, grandparents, or siblings can gift funds. You&apos;ll need a signed gift letter for the lender.</li>
                <li><strong>Builder Incentives:</strong> New construction developers sometimes offer purchase incentives, closing cost credits, or bonus structures.</li>
                <li><strong>Automate Savings:</strong> Set up automatic transfers to a dedicated savings account right after each payday.</li>
              </ul>

              <p>
                With 23 years of experience and over $2 billion in funded mortgages, Kraft Mortgages helps buyers across BC, Alberta, and Ontario navigate down payment strategies and find the best mortgage solutions. Call us at <a href="tel:604-593-1550" className="text-gold-400 hover:text-gold-300">604-593-1550</a> or visit our office at #301 - 1688 152nd Street, Surrey, BC.
              </p>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/cmhc-insurance" className="text-gold-400 hover:text-gold-300 underline">CMHC Insurance Calculator</Link>
                {" · "}
                <Link href="/calculators/closing-costs" className="text-gold-400 hover:text-gold-300 underline">Closing Costs Calculator</Link>
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

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Down Payment Calculator Canada",
              "description": "Calculate your minimum down payment, CMHC insurance, and total cash needed to close on a home in Canada.",
              "url": "https://www.kraftmortgages.ca/calculators/down-payment",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CAD"
              },
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
