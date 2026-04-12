"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, ArrowRight, Info, Home, Shield,
  HelpCircle, ChevronDown, ChevronUp, DollarSign, AlertTriangle, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";

/* ── CMHC Premium Rates (2025) ─────────────────────── */

function cmhcCalc(downPaymentPct: number, mortgageAmount: number): { rate: number; premium: number; tier: string } {
  if (downPaymentPct >= 20) return { rate: 0, premium: 0, tier: "No insurance required" };
  let rate: number;
  let tier: string;
  if (downPaymentPct >= 15) { rate = 0.028; tier = "15.00% – 19.99%"; }
  else if (downPaymentPct >= 10) { rate = 0.031; tier = "10.00% – 14.99%"; }
  else if (downPaymentPct >= 5) { rate = 0.04; tier = "5.00% – 9.99%"; }
  else { rate = 0.042; tier = "Under 5.00%"; }
  return { rate, premium: mortgageAmount * rate, tier };
}

function monthlyPayment(principal: number, annualRate: number, amortYears: number): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 12;
  const n = amortYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ── FAQ ───────────────────────────────────────────── */

const faqs = [
  {
    q: "What is CMHC mortgage insurance?",
    a: "CMHC (Canada Mortgage and Housing Corporation) mortgage default insurance protects lenders if a borrower defaults on their mortgage. It's required when your down payment is less than 20% of the home's purchase price. The premium is paid by the borrower (you), not the lender, and is typically added to your mortgage balance."
  },
  {
    q: "What are the current CMHC premium rates in 2025?",
    a: "As of 2025, CMHC premiums are: 4.0% for 5-9.99% down, 3.1% for 10-14.99% down, 2.8% for 15-19.99% down, and $0 (no insurance) for 20% or more down. These rates apply to the mortgage amount, not the home price."
  },
  {
    q: "How is CMHC different from Sagen and Canada Guaranty?",
    a: "CMHC, Sagen (formerly Genworth), and Canada Guaranty are the three mortgage default insurers in Canada. All three offer similar coverage and are required by law to have comparable premium rates. Your lender typically chooses which insurer to use. The rates are standardized, so the cost is the same regardless of which insurer is selected."
  },
  {
    q: "Can I avoid paying CMHC insurance?",
    a: "Yes — if you put 20% or more down on your home purchase, mortgage default insurance is not required. This is called a conventional mortgage. The trade-off is that you need more cash upfront, but you save on the insurance premium (which can be $15,000 to $40,000+ on typical mortgages) and avoid higher monthly payments."
  },
  {
    q: "What is the $1.5 million CMHC insured cap?",
    a: "As of 2024, CMHC will only insure mortgages on homes valued at $1.5 million or less. If you're buying a home over $1.5 million with less than 20% down, you cannot get CMHC insurance — most lenders will require you to increase your down payment to 20% for properties above this threshold. Some alternative lenders may have workarounds, but at higher rates."
  },
  {
    q: "Should I pay CMHC upfront or add it to my mortgage?",
    a: "You can pay the CMHC premium upfront in cash or add it to your mortgage. Adding it is more common (over 90% of borrowers do this) because it preserves your cash. However, adding it means you pay interest on the premium over the life of your mortgage. On a $30,000 premium at 5% over 25 years, that's roughly $22,000 in additional interest."
  }
];

export default function CMHCInsurancePage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [homePrice, setHomePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(4.79);
  const [amortization, setAmortization] = useState(25);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const downPayment = homePrice * downPaymentPct / 100;
  const baseMortgage = homePrice - downPayment;
  const { rate, premium, tier } = cmhcCalc(downPaymentPct, baseMortgage);
  const totalMortgage = baseMortgage + premium;
  const needsInsurance = downPaymentPct < 20;

  const monthlyBase = monthlyPayment(baseMortgage, mortgageRate / 100, amortization);
  const monthlyWithCMHC = monthlyPayment(totalMortgage, mortgageRate / 100, amortization);
  const monthlyImpact = monthlyWithCMHC - monthlyBase;

  const totalInterestBase = (monthlyBase * amortization * 12) - baseMortgage;
  const totalInterestWithCMHC = (monthlyWithCMHC * amortization * 12) - totalMortgage;
  const interestCostOfCMHC = totalInterestWithCMHC - totalInterestBase;

  const premiumPctOfHome = homePrice > 0 ? (premium / homePrice) * 100 : 0;

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
              <span className="text-gold-400">CMHC Insurance Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Shield className="w-4 h-4" />
                Mortgage Insurance
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">CMHC Insurance</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Calculate your CMHC mortgage insurance premium, see monthly impact, and compare paying upfront vs. adding to your mortgage.
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
                source="calculator-pdf-cmhc-insurance"
                title="Your CMHC Insurance Analysis"
                subtitle="Get a personalized PDF with your CMHC breakdown"
                leadMessage="PDF Report Download — Cmhc Insurance"
                mortgageType="Purchase"
                amount={homePrice.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your CMHC Insurance Analysis",
                    calculatorName: "Cmhc Insurance Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: "$" + Math.round(homePrice).toLocaleString("en-CA") },
                          { label: "Down Payment", value: downPaymentPct + "% (" + "$" + Math.round(downPayment).toLocaleString("en-CA") + ")" },
                          { label: "Mortgage Rate", value: mortgageRate + "%" },
                          { label: "Amortization", value: amortization + " years" },
                        ]
                      },
                      {
                        title: "CMHC Details",
                        rows: [
                          { label: "Base Mortgage", value: "$" + Math.round(baseMortgage).toLocaleString("en-CA") },
                          { label: "Premium Rate", value: (rate * 100).toFixed(2) + "%" },
                          { label: "CMHC Premium", value: "$" + Math.round(premium).toLocaleString("en-CA"), highlight: true },
                          { label: "Premium Tier", value: tier },
                          { label: "Total Mortgage (with CMHC)", value: "$" + Math.round(totalMortgage).toLocaleString("en-CA"), highlight: true },
                          { label: "Insurance Required?", value: needsInsurance ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "Payment Impact",
                        rows: [
                          { label: "Monthly (without CMHC)", value: "$" + Math.round(monthlyBase).toLocaleString("en-CA") },
                          { label: "Monthly (with CMHC)", value: "$" + Math.round(monthlyWithCMHC).toLocaleString("en-CA") },
                          { label: "Monthly Increase", value: "$" + Math.round(monthlyImpact).toLocaleString("en-CA") },
                          { label: "Interest Cost of CMHC", value: "$" + Math.round(interestCostOfCMHC).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "CMHC mortgage loan insurance is required when your down payment is less than 20%. The premium is added to your mortgage and ranges from 4% to 15% of the loan amount."
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
                      validation={{ min: 100000, max: 3000000 }}
                      type="currency"
                    />
                    <ValidatedSlider
                      label={`Down Payment (${downPaymentPct}%)`}
                      value={downPaymentPct}
                      onChange={setDownPaymentPct}
                      min={5}
                      max={25}
                      step={0.5}
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
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Premium */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-1">CMHC Insurance Premium</p>
                  <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">
                    {needsInsurance ? formatCurrency(premium, 0) : "Not Required"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {needsInsurance ? `Tier: ${tier} down · Rate: ${(rate * 100).toFixed(1)}%` : "Down payment is 20% or more — conventional mortgage"}
                  </p>
                </div>

                {!needsInsurance && (
                  <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-300 mb-2">No CMHC Insurance Needed</h4>
                        <p className="text-sm text-green-200">With {downPaymentPct}% down, you qualify for a conventional mortgage with no mortgage default insurance. You&apos;re saving {formatCurrency(premium || cmhcCalc(19.99, baseMortgage).premium, 0)} compared to someone with similar down payment.</p>
                      </div>
                    </div>
                  </div>
                )}

                {needsInsurance && (
                  <>
                    {/* Monthly Impact */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gold-400" />
                        Monthly Payment Impact
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Monthly payment (no CMHC)</span>
                          <span className="font-semibold text-gray-200">{formatCurrency(monthlyBase, 0)}/mo</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Monthly payment (with CMHC added)</span>
                          <span className="font-semibold text-gold-400">{formatCurrency(monthlyWithCMHC, 0)}/mo</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-300">Monthly increase from CMHC</span>
                          <span className="font-bold text-amber-400">+{formatCurrency(monthlyImpact, 0)}/mo</span>
                        </div>
                      </div>
                    </div>

                    {/* Upfront vs Added */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-gold-400" />
                        Pay Upfront vs. Add to Mortgage
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <span className="text-xs text-gray-400 block mb-1">Pay Upfront</span>
                          <span className="text-lg font-bold text-gray-100">{formatCurrency(premium, 0)}</span>
                          <p className="text-xs text-gray-400 mt-1">One-time cash payment</p>
                          <p className="text-xs text-gray-400">Interest cost: $0</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <span className="text-xs text-gray-400 block mb-1">Add to Mortgage</span>
                          <span className="text-lg font-bold text-gray-100">{formatCurrency(premium, 0)}</span>
                          <p className="text-xs text-gray-400 mt-1">Added to loan balance</p>
                          <p className="text-xs text-amber-400">Extra interest: {formatCurrency(interestCostOfCMHC, 0)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Loan-to-Value</span>
                        <span className="text-xl font-bold text-gray-100">{(100 - downPaymentPct).toFixed(1)}%</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <span className="text-gray-400 block text-xs mb-1">Total Mortgage</span>
                        <span className="text-xl font-bold text-gray-100">{formatCurrency(totalMortgage, 0)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Pre-Approved
                  </Link>
                  <Link href="/calculators/down-payment" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Down Payment Calculator
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Understanding CMHC Mortgage Insurance in Canada</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                CMHC mortgage default insurance is a requirement for any home purchase in Canada where the down payment is less than 20% of the purchase price. Also known as mortgage loan insurance, it protects the lender — not you — in case you default on your mortgage payments. While you pay the premium, the coverage benefits the lender by reducing their risk, which in turn allows Canadians to buy homes with as little as 5% down.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How CMHC Premiums Are Calculated (2025 Rates)</h3>
              <p>
                CMHC premiums are calculated as a percentage of your mortgage amount (not the home price). The rate depends on your down payment percentage: 5.00–9.99% down carries a 4.0% premium, 10.00–14.99% down is 3.1%, 15.00–19.99% down is 2.8%, and 20% or more requires no insurance. For example, on a $700,000 home with 10% down ($70,000), your mortgage is $630,000 and the CMHC premium is $19,530 (3.1% of $630,000).
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">CMHC vs Sagen vs Canada Guaranty</h3>
              <p>
                Canada has three mortgage default insurers: CMHC (a federal Crown corporation), Sagen (formerly Genworth Canada, privately owned), and Canada Guaranty (also private). All three are legally required to offer comparable rates and coverage. Your lender chooses which insurer to use, and the cost to you is effectively the same regardless. CMHC is the largest and most well-known, but all three provide equivalent protection.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The $1.5 Million Insured Cap</h3>
              <p>
                Effective 2024, CMHC only insures mortgages on homes valued at $1.5 million or less. This means if you&apos;re buying a home above $1.5 million, you must put at least 20% down regardless — there is no insured mortgage option. For homes between $1M and $1.5M, CMHC insurance is available but the 20% rule on the portion over $1M means you still need substantial cash. This policy change has affected buyers in high-priced markets like Vancouver and Toronto.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Paying Upfront vs. Adding to Your Mortgage</h3>
              <p>
                You have two options for paying the CMHC premium: upfront in cash or added to your mortgage balance. Over 90% of borrowers choose to add it because it preserves cash for other closing costs. However, this means you pay interest on the premium amount for the entire amortization period. On a $20,000 premium at 5% over 25 years, the total interest cost is approximately $15,000. Paying upfront avoids this extra cost but requires more cash at closing.
              </p>

              <p>
                Kraft Mortgages has been helping Canadian homebuyers navigate CMHC requirements for over 23 years. With $2 billion in funded mortgages, we understand how to structure your deal to minimize insurance costs. Call <a href="tel:604-593-1550" className="text-gold-400 hover:text-gold-300">604-593-1550</a> or visit us at #301 - 1688 152nd Street, Surrey, BC.
              </p>

              <div className="mt-8">
                <Link href="/calculators/down-payment" className="text-gold-400 hover:text-gold-300 underline">Down Payment Calculator</Link>
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
              "name": "CMHC Insurance Calculator Canada",
              "description": "Calculate your CMHC mortgage insurance premium, see monthly impact, and compare paying upfront vs adding to your mortgage.",
              "url": "https://www.kraftmortgages.ca/calculators/cmhc-insurance",
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
