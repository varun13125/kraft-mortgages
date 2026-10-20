"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { DollarSign, Calculator, Home, CheckCircle, ArrowRight, Gift, PiggyBank, Landmark, Shield, Building, Percent, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency, formatPercentage } from "@/lib/utils/validation";
import { cmhcPremiumRate, minimumDownPayment, isInsurable } from "@/lib/calc/cmhc";
import { landTransferTax } from "@/lib/calc/landTransferTax";
import PdfLeadModal from "@/components/PdfLeadModal";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { useLiveRates } from "@/lib/useLiveRates";
import { maxQualifyingLoan, maxPurchasePrice, stressTestRate } from "@/lib/calc/affordability";
import { liveRate } from "../_lib/liveRateDefaults";

// Assumptions for the "estimated max purchase price" hint (this page has no tax/heat/debt inputs)
const HINT_PROPERTY_TAX_MONTHLY = 300;
const HINT_HEAT_MONTHLY = 150;
const HINT_AMORT_YEARS = 25;
const HINT_FALLBACK_RATE = 4.39;

const PROVINCES = ["BC", "Alberta", "Ontario"] as const;
type Province = (typeof PROVINCES)[number];

// Shared CMHC schedule (rate as a decimal; below the 5% minimum it isn't insurable — flagged in the UI)
function calcCMHCPremium(downPaymentPct: number): number {
  return cmhcPremiumRate(downPaymentPct);
}

// Shared LTT helper: BC exemption covers only the first $500K (max $8,000) up to $835K,
// phasing out at $860K; Ontario refund max $4,000; Alberta has no LTT (land titles fees only).
function calcLandTransferTax(price: number, province: Province, isFirstTime: boolean): { tax: number; rebate: number } {
  if (province === "Alberta") return { tax: 0, rebate: 0 };
  const r = landTransferTax({ price, province: province === "BC" ? "BC" : "ON", firstTime: isFirstTime });
  return { tax: r.provincialTax, rebate: r.provincialRelief };
}

function calcGSTRebate(price: number, isNewBuild: boolean): number {
  if (!isNewBuild || !(price > 0)) return 0;
  // Existing federal GST new housing rebate: 36% of GST (max $6,300) to $350K, phased out by $450K
  let newHousingRebate = 0;
  if (price <= 350000) newHousingRebate = price * 0.05 * 0.36;
  else if (price < 450000) newHousingRebate = 6300 * (450000 - price) / 100000;
  // First-Time Home Buyers' GST rebate (Bill C-4, Royal Assent Mar 12, 2026): full GST (max $50,000) on new
  // homes up to $1M, phased out linearly to $0 at $1.5M. It tops up the new housing rebate. Agreements of
  // purchase and sale on or after Mar 20, 2025 and before 2031; construction started before 2031 and
  // substantially complete before 2036. Sources (checked 2026-10-13): Finance Canada news release
  // 2025-05-27; CRA Excise and GST/HST News No. 122 (2026-04-24); LEGISinfo Bill C-4 (45-1).
  const fullGst = Math.min(price * 0.05, 50000);
  let firstTimeRebate = 0;
  if (price <= 1000000) firstTimeRebate = fullGst;
  else if (price < 1500000) firstTimeRebate = fullGst * (1500000 - price) / 500000;
  return Math.max(newHousingRebate, firstTimeRebate);
}

export default function FirstTimeHomeBuyer() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(550000);
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [savings, setSavings] = useState(55000);
  const [province, setProvince] = useState<Province>("BC");
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [isCouple, setIsCouple] = useState(false);
  const [marginalRate, setMarginalRate] = useState(28);
  const { data: liveRates } = useLiveRates();
  // Insured 5-yr fixed (first-time buyers with < 20% down); falls back to an illustrative rate
  const hintRate = liveRate(liveRates, "fixed5Insured") ?? HINT_FALLBACK_RATE;

  const results = useMemo(() => {
    // FHSA: tax savings based on ANNUAL contribution cap ($8K/yr), not lifetime limit
    const fhsaAnnualContrib = Math.min(8000, savings);
    const fhsaMaxLifetime = 40000;
    const fhsaYearsNeeded = fhsaAnnualContrib > 0 ? Math.ceil(Math.min(savings, fhsaMaxLifetime) / fhsaAnnualContrib) : 0;
    const fhsaContributed = Math.min(savings, fhsaMaxLifetime);
    // Tax savings on everything contributed (max $8K/yr, $40K lifetime) — matches the
    // "contributed over N years" label (it previously showed only one year's deduction)
    const fhsaTaxSavings = fhsaContributed * (marginalRate / 100);

    // HBP
    const hbpLimit = isCouple ? 120000 : 60000;
    const hbpWithdrawal = Math.min(savings, hbpLimit);
    const hbpRepaymentYears = 15;
    const hbpAnnualRepayment = hbpWithdrawal / hbpRepaymentYears;
    const hbpMonthlyRepayment = hbpAnnualRepayment / 12;

    // Land Transfer Tax
    const ltt = calcLandTransferTax(purchasePrice, province, true);
    const lttNoRebate = calcLandTransferTax(purchasePrice, province, false);
    const lttSavings = ltt.rebate;

    // GST Rebate
    const gstRebate = calcGSTRebate(purchasePrice, isNewBuild);

    // CMHC
    const downPaymentPct = (savings / purchasePrice) * 100;
    const cmhcPremiumRate = calcCMHCPremium(downPaymentPct);
    const mortgageAmount = purchasePrice - savings;
    const cmhcPremium = cmhcPremiumRate > 0 ? mortgageAmount * cmhcPremiumRate : 0;
    const minDown = minimumDownPayment(purchasePrice);
    const belowMinimumDown = downPaymentPct < 20 && !isInsurable(purchasePrice, savings);

    // Rough max purchase price from income + savings at 39% GDS / 44% TDS (stress-tested, premium financed)
    const hintMaxLoan = maxQualifyingLoan({
      incomeAnnual: annualIncome, otherDebtsMonthly: 0,
      nonMortgageHousingMonthly: HINT_PROPERTY_TAX_MONTHLY + HINT_HEAT_MONTHLY,
      contractRatePct: hintRate, amortYears: HINT_AMORT_YEARS,
    });
    const maxPriceHint = maxPurchasePrice({ down: savings, maxLoan: hintMaxLoan, amortYears: HINT_AMORT_YEARS });

    // Total
    const totalIncentiveValue = fhsaTaxSavings + lttSavings + gstRebate;

    // Effective down payment
    const effectiveDown = savings + totalIncentiveValue;

    return {
      fhsaTaxSavings, fhsaContributed, fhsaYearsNeeded, fhsaAnnualContrib,
      hbpWithdrawal, hbpMonthlyRepayment, hbpRepaymentYears,
      lttSavings, ltt: ltt.tax - ltt.rebate,
      gstRebate,
      cmhcPremium, cmhcPremiumRate, minDown, belowMinimumDown, downPaymentPct,
      totalIncentiveValue, effectiveDown, mortgageAmount, maxPriceHint,
    };
  }, [purchasePrice, annualIncome, savings, province, isNewBuild, isCouple, marginalRate, hintRate]);

  return (
    <>
      <Navigation />
      <CalculatorSchema name="First-Time Home Buyer Calculator" description="Calculate down payment requirements, FHSA tax savings, and first-time buyer incentives." url="/calculators/first-time-home-buyer" />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-300 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-300 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-300">First-Time Home Buyer Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-6">
                <Gift className="w-4 h-4" />
                First-Time Buyer Programs
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">First-Time Home Buyer</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Discover every program, rebate, and incentive available to first-time home buyers across Canada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Inputs */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-gold-300" />
                  Your Details
                </h2>
                <div className="space-y-6">
                  <ValidatedInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} validation={{ min: 100000, max: 5000000 }} type="currency" />
                  <ValidatedInput
                    label="Annual Household Income"
                    value={annualIncome}
                    onChange={setAnnualIncome}
                    validation={{ min: 30000, max: 1000000 }}
                    type="currency"
                    help={results.maxPriceHint.price > 0
                      ? `Rough max purchase price with this income and your savings: ${formatCurrency(results.maxPriceHint.price, 0)}${results.maxPriceHint.limitedBy === "downPayment" ? " (capped by the minimum down payment)" : ""}. Assumes 39% GDS / 44% TDS at the ${stressTestRate(hintRate).toFixed(2)}% qualifying rate, 25-year amortization, $${HINT_PROPERTY_TAX_MONTHLY}/mo property tax, $${HINT_HEAT_MONTHLY}/mo heat and no other debts. Use the Mortgage Qualifier for a full check.`
                      : undefined}
                  />
                  <ValidatedInput label="Total Savings for Down Payment" value={savings} onChange={setSavings} validation={{ min: 5000, max: 2000000 }} type="currency" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <Home className="w-5 h-5 text-gold-300" />
                  Property Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
                    <div className="flex rounded-xl overflow-hidden border border-white/20">
                      {PROVINCES.map((p) => (
                        <button key={p} onClick={() => setProvince(p)}
                          className={`flex-1 py-3 text-sm font-semibold transition-colors ${province === p ? "bg-gold-500 text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <button onClick={() => setIsNewBuild(!isNewBuild)}
                      className={`rounded-xl p-4 border text-left transition-all ${isNewBuild ? "border-gold-500 bg-gold-500/10" : "border-white/20 bg-white/5"}`}>
                      <Building className="w-5 h-5 mb-2 text-gold-300" />
                      <div className="text-sm font-semibold text-gray-200">{isNewBuild ? "✓ New Build" : "New Build"}</div>
                    </button>
                    <button onClick={() => setIsCouple(!isCouple)}
                      className={`rounded-xl p-4 border text-left transition-all ${isCouple ? "border-gold-500 bg-gold-500/10" : "border-white/20 bg-white/5"}`}>
                      <CheckCircle className="w-5 h-5 mb-2 text-gold-300" />
                      <div className="text-sm font-semibold text-gray-200">{isCouple ? "✓ Couple" : "Single"}</div>
                    </button>
                  </div>
                  <ValidatedSlider label={`Marginal Tax Rate (${marginalRate}%)`} value={marginalRate} onChange={setMarginalRate} min={15} max={55} step={1} formatValue={(v) => `${v}%`} />
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
              {/* Total */}
              <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-gold-300" />
                  <span className="text-sm text-gold-300 font-medium">Total Program Savings</span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gold-300 mb-2">
                  {formatCurrency(results.totalIncentiveValue, 0)}
                </div>
                <p className="text-sm text-gray-400">Combined value of all eligible programs and rebates</p>
              </div>

              {/* Breakdown */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 space-y-5">
                <h4 className="font-semibold flex items-center gap-2"><PiggyBank className="w-5 h-5 text-gold-300" /> Program Breakdown</h4>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <div><div className="font-medium">FHSA Tax Savings</div><div className="text-xs text-gray-400">{formatCurrency(results.fhsaContributed, 0)} contributed over {results.fhsaYearsNeeded} yr{results.fhsaYearsNeeded > 1 ? "s" : ""}</div></div>
                  <span className="font-semibold text-green-400">+{formatCurrency(results.fhsaTaxSavings, 0)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <div><div className="font-medium">HBP Withdrawal (RRSP)</div><div className="text-xs text-gray-400">{formatCurrency(results.hbpWithdrawal, 0)} available · {formatCurrency(results.hbpMonthlyRepayment, 0)}/mo repayment</div></div>
                  <span className="font-semibold text-blue-400">{formatCurrency(results.hbpWithdrawal, 0)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <div><div className="font-medium">Land Transfer Tax Savings</div><div className="text-xs text-gray-400">First-time buyer rebate ({province})</div></div>
                  <span className="font-semibold text-green-400">+{formatCurrency(results.lttSavings, 0)}</span>
                </div>

                {isNewBuild && (
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <div><div className="font-medium">GST Rebate</div><div className="text-xs text-gray-400">First-time buyer GST rebate on a new home (agreements signed Mar 20, 2025 – Dec 31, 2030; confirm eligibility with CRA)</div></div>
                    <span className="font-semibold text-green-400">+{formatCurrency(results.gstRebate, 0)}</span>
                  </div>
                )}

                {results.belowMinimumDown && (
                  <div className="py-3 border-b border-white/10 text-sm text-red-300">
                    Your savings ({results.downPaymentPct.toFixed(1)}%) are below the minimum down payment of {formatCurrency(results.minDown, 0)} for this price{purchasePrice >= 1500000 ? " — homes $1.5M+ need 20% down" : ""}.
                  </div>
                )}

                {results.cmhcPremium > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <div><div className="font-medium">CMHC Premium</div><div className="text-xs text-gray-400">{formatPercentage(results.cmhcPremiumRate * 100, 2)} of mortgage ({formatCurrency(results.mortgageAmount, 0)})</div></div>
                    <span className="font-semibold text-red-400">-{formatCurrency(results.cmhcPremium, 0)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <div><div className="font-medium">Savings + Program Benefits</div><div className="text-xs text-gray-400">Not all of this is cash at closing — LTT relief lowers closing costs, FHSA refunds arrive at tax time, and GST rebates are usually credited by the builder</div></div>
                  <span className="font-semibold text-gold-300">{formatCurrency(results.effectiveDown, 0)}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Get Pre-Approved</Link>
                <Link href="/calculators/affordability" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Affordability Calculator</Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Complete Guide to First-Time Home Buyer Programs in Canada</h2>

            <p className="text-gray-300 leading-relaxed mb-4">
              Buying your first home is one of the most significant financial decisions you&apos;ll ever make. The Canadian government and provinces offer several programs designed to make homeownership more accessible. Understanding these programs can save you thousands of dollars and help you enter the housing market sooner than you thought possible.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">First Home Savings Account (FHSA)</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The FHSA is arguably the most powerful savings tool for first-time home buyers in Canada. It combines the best features of an RRSP and TFSA: your contributions are tax-deductible (like an RRSP), and withdrawals for a qualifying home purchase are completely tax-free (like a TFSA). You can contribute up to $8,000 per year with a lifetime limit of $40,000. The account has a 15-year carrying period, meaning you must use it for a home purchase or transfer it to an RRSP or RRIF within that timeframe.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Key benefit:</strong> If you&apos;re in a 30% marginal tax bracket and contribute the full $8,000 annually, you&apos;ll receive approximately $2,400 in tax refunds each year — money you can reinvest or add to your down payment savings.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">Home Buyers&apos; Plan (HBP)</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Home Buyers&apos; Plan lets you withdraw up to $60,000 ($120,000 for couples) from your RRSP to put toward your first home purchase. You have 15 years to repay the withdrawal, with annual minimum payments starting the second year after withdrawal. This program is especially powerful when combined with the FHSA, as you can use FHSA contributions to build your RRSP, then withdraw through the HBP.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">Land Transfer Tax Rebates by Province</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>British Columbia:</strong> Under the First Time Home Buyers&apos; Program (since April 1, 2024), qualifying buyers pay no Property Transfer Tax on the first $500,000 of homes valued up to $835,000 — a saving of up to $8,000. The exemption phases out between $835,000 and $860,000. Newly built homes up to $1.1 million may qualify for a separate new-home exemption.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Alberta:</strong> Alberta does not have a provincial land transfer tax. Instead, Land Titles registration fees apply: $50 plus $5 per $5,000 of property value for the transfer, and the same formula on the mortgage amount (about $550 each on $500,000). There is no first-time buyer exemption.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Ontario:</strong> First-time buyers receive a refund of up to $4,000 on the Ontario Land Transfer Tax, which eliminates the provincial tax on the first $368,333 of the purchase price. Buyers in Toronto can also claim a municipal rebate of up to $4,475.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">GST/HST Rebate on New Homes</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              First-time buyers of a newly built home can now recover the full 5% GST (up to $50,000) on homes priced up to $1 million, with the rebate phasing out between $1 million and $1.5 million (First-Time Home Buyers&apos; GST Rebate, law since March 2026, for agreements of purchase and sale signed on or after March 20, 2025 and before 2031). It tops up the older new housing rebate (36% of the GST, max $6,300, for homes under $450,000). Ontario also offers a rebate of up to $80,000 of the provincial portion of HST for first-time buyers of new homes. Confirm eligibility with your builder or the CRA.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">CMHC Mortgage Loan Insurance</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              If your down payment is less than 20% of the purchase price, you&apos;ll need CMHC mortgage loan insurance (or equivalent from a private insurer). This protects the lender if you default on your mortgage. The minimum down payment is 5% on the first $500,000 and 10% on the portion between $500,000 and $1,500,000. Premiums range from 2.8% to 4.0% of the mortgage amount depending on your down payment percentage.
            </p>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">Step-by-Step Guide for First-Time Buyers</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
              <li>Determine your budget using an affordability calculator</li>
              <li>Open an FHSA and maximize contributions for tax savings</li>
              <li>Build your RRSP for HBP withdrawal flexibility</li>
              <li>Get pre-approved for a mortgage</li>
              <li>Research first-time buyer rebates in your province</li>
              <li>Factor closing costs (typically 1.5-4% of purchase price)</li>
              <li>Work with a mortgage broker to find the best rate</li>
              <li>Close on your new home and claim all eligible rebates</li>
            </ol>

            <h3 className="text-2xl font-semibold text-gold-300 mt-8 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-200">Can I use both the FHSA and the HBP together?</h4>
                <p className="text-gray-400">Yes! These programs are completely independent. You can use your FHSA for tax-free savings, contribute to an RRSP and withdraw through the HBP, and potentially access both for the same home purchase.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">What counts as a first-time home buyer?</h4>
                <p className="text-gray-400">Generally, you qualify if you haven&apos;t owned a home that was your principal residence in the current year or any of the preceding four years. Some programs have additional criteria.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">How much do I need for a down payment?</h4>
                <p className="text-gray-400">The minimum is 5% on the first $500,000 and 10% on the portion above $500,000 up to $1.5M. For a $500,000 home, that&apos;s $25,000. For a $750,000 home, you&apos;d need $50,000.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">When should I open an FHSA?</h4>
                <p className="text-gray-400">As soon as possible! The FHSA has an annual contribution limit of $8,000 and unused room carries forward. Starting early maximizes your tax savings and compounding growth.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">What happens if I don&apos;t buy a home?</h4>
                <p className="text-gray-400">FHSA funds can be transferred to an RRSP or RRIF tax-free. HBP withdrawals must be repaid to your RRSP over 15 years or they&apos;ll be taxed as income.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/calculators/affordability" className="text-gold-300 hover:text-gold-300 underline">Affordability Calculator</Link>
              <Link href="/calculators/stress-test" className="text-gold-300 hover:text-gold-300 underline">Stress Test Calculator</Link>
              <Link href="/calculators/closing-costs" className="text-gold-300 hover:text-gold-300 underline">Closing Costs Calculator</Link>
              <Link href="/calculators/payment" className="text-gold-300 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
            </div>
          </div>
        </section>

            {/* PDF Report Download */}
            <div className="mt-4 mb-8 px-4 max-w-6xl mx-auto">
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
                source="calculator-pdf-first-time-home-buyer"
                title="Your First-Time Home Buyer Report"
                subtitle="Get a personalized PDF with your first-time buyer analysis"
                leadMessage="PDF Report Download — First Time Home Buyer"
                mortgageType="First-Time Buyer"
                amount={purchasePrice.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your First-Time Home Buyer Report",
                    calculatorName: "First Time Home Buyer Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Purchase Price", value: "$" + Math.round(purchasePrice).toLocaleString("en-CA") },
                          { label: "Savings/Down Payment", value: "$" + Math.round(savings).toLocaleString("en-CA") },
                          { label: "Province", value: province },
                          { label: "Marginal Tax Rate", value: marginalRate + "%" },
                          { label: "Is Couple?", value: isCouple ? "Yes" : "No" },
                          { label: "New Build?", value: isNewBuild ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "First-Time Buyer Benefits",
                        rows: [
                          { label: "HBP Withdrawal", value: "$" + Math.round(results.hbpWithdrawal || 0).toLocaleString("en-CA"), highlight: true },
                          { label: "FHSA Tax Savings", value: "$" + Math.round(results.fhsaTaxSavings || 0).toLocaleString("en-CA") },
                          { label: "LTT Savings", value: "$" + Math.round(results.lttSavings || 0).toLocaleString("en-CA") },
                          { label: "GST Rebate", value: "$" + Math.round(results.gstRebate || 0).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Mortgage Summary",
                        rows: [
                          { label: "Mortgage Amount", value: "$" + Math.round(results.mortgageAmount || 0).toLocaleString("en-CA"), highlight: true },
                          { label: "CMHC Premium", value: "$" + Math.round(results.cmhcPremium || 0).toLocaleString("en-CA") },
                          { label: "Down Payment %", value: results.downPaymentPct.toFixed(1) + "%" + (results.belowMinimumDown ? " (below the $" + Math.round(results.minDown).toLocaleString("en-CA") + " minimum)" : "") },
                        ]
                      }
                    ],
                    educationalContent: "First-time home buyers have access to the Home Buyers' Plan (RRSP withdrawal), FHSA ($40K tax-free), and provincial land transfer tax rebates."
                  });
                }}
              />
            </div>
                <ComplianceBanner feature="LEAD_FORM" />
        <RelatedCalculators current="first-time-home-buyer" related={["affordability","down-payment","land-transfer-tax","closing-costs","stress-test"]} />
      </main>
    </>
  );
}
