"use client";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { CheckCircle, Calculator, DollarSign, Percent, Clock, Home, CreditCard, AlertTriangle, Download } from "lucide-react";
import Link from "next/link";
import PdfLeadModal from "@/components/PdfLeadModal";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { useLiveRates } from "@/lib/useLiveRates";
import { payment, principalFromPayment } from "@/lib/calc/payment";
import { cmhcPremiumRate as sharedCmhcPremiumRate, INSURED_PRICE_CAP } from "@/lib/calc/cmhc";
import { liveRate, purchaseRateProduct } from "../_lib/liveRateDefaults";
import { LiveRateNote } from "../_lib/LiveRateNote";

// Pre-approval calculation logic
function calculatePreApproval({
  grossIncome,
  monthlyDebts,
  downPayment,
  creditScore,
  heatingCosts = 150,
  propertyTax = 300,
  condoFees = 0,
  baseRate = 4.39,
  amortYears = 25,
}: {
  grossIncome: number;
  monthlyDebts: number;
  downPayment: number;
  creditScore: number;
  heatingCosts?: number;
  propertyTax?: number;
  condoFees?: number;
  /** Best live 5-year fixed rate; credit tiers are priced as spreads above it */
  baseRate?: number;
  /** 25 or 30. Insured 30-year amortization adds the 0.20% premium surcharge. */
  amortYears?: number;
}) {
  // Estimated contract rate by credit tier. Previously hardcoded at 5.49–6.89% (stale);
  // now the same spreads are applied on top of the live best 5-year fixed rate.
  let mortgageRate: number;

  if (creditScore >= 780) mortgageRate = baseRate;
  else if (creditScore >= 720) mortgageRate = baseRate + 0.2;
  else if (creditScore >= 680) mortgageRate = baseRate + 0.4;
  else if (creditScore >= 640) mortgageRate = baseRate + 0.7;
  else mortgageRate = baseRate + 1.4;

  // Correct Canadian stress test: max(contract rate + 2%, 5.25% floor) per OSFI B-20
  const stressTestRate = Math.max(mortgageRate + 2, 5.25);

  // CMHC insurance requirements
  const isHighRatio = downPayment < 0.20;
  const minDownPayment = downPayment >= 0.05 ? downPayment : 0.05;

  // Calculate maximum purchase price using stress test
  const monthlyIncome = grossIncome / 12;
  // GDS counts 50% of condo fees (CMHC guideline)
  const condoCounted = condoFees * 0.5;

  // GDS ratio calculation (max 39% for stress test)
  const maxGDS = monthlyIncome * 0.39;
  const availableForMortgage = maxGDS - heatingCosts - propertyTax - condoCounted;

  // TDS ratio calculation (max 44% for stress test)
  const maxTDS = monthlyIncome * 0.44;
  const availableForMortgageWithDebts = maxTDS - heatingCosts - propertyTax - condoCounted - monthlyDebts;

  // Use the lower of GDS or TDS available amount
  const maxMortgagePayment = Math.min(availableForMortgage, availableForMortgageWithDebts);

  if (maxMortgagePayment <= 0) {
    return {
      maxPurchasePrice: 0,
      maxMortgageAmount: 0,
      monthlyPayment: 0,
      gdsRatio: 0,
      tdsRatio: 0,
      qualifies: false,
      mortgageRate,
      stressTestRate,
      isHighRatio,
      cmhcPremium: 0,
      recommendation: "Income insufficient for qualification"
    };
  }

  // Maximum TOTAL loan (including any insurance premium) the qualifying payment supports
  // at the stress-test rate — Canadian semi-annual compounding, over the chosen amortization (was fixed at 25).
  const AMORT_YEARS = amortYears;
  const maxLoanAtStress = principalFromPayment({ monthlyPayment: maxMortgagePayment, annualRatePct: stressTestRate, amortYears: AMORT_YEARS });

  // The premium is part of the loan you qualify for (previously it was added ON TOP of the
  // qualifying maximum, so the real ratios exceeded 39/44 while the page said "qualifies").
  // > 25-year insured amortization adds the 0.20% surcharge (CMHC / Sagen / Canada Guaranty)
  const cmhcPremiumRate = isHighRatio ? sharedCmhcPremiumRate(minDownPayment * 100, AMORT_YEARS) : 0;
  let baseLoan = maxLoanAtStress / (1 + cmhcPremiumRate);
  let maxPurchasePrice = baseLoan / (1 - minDownPayment);

  // With less than 20% down the price is also capped by the minimum down payment rules
  // (5% to $500K, 10% above, 20% at $1.5M+ where insurance isn't available).
  let cappedByDownPayment = false;
  if (isHighRatio) {
    const priceCap = minDownPayment <= 0.05 + 1e-9 ? 500000
      : minDownPayment < 0.10 ? Math.min(25000 / (0.10 - minDownPayment), INSURED_PRICE_CAP - 1)
      : INSURED_PRICE_CAP - 1;
    if (maxPurchasePrice > priceCap) {
      maxPurchasePrice = priceCap;
      baseLoan = maxPurchasePrice * (1 - minDownPayment);
      cappedByDownPayment = true;
    }
  }

  const cmhcPremium = baseLoan * cmhcPremiumRate;
  const actualMortgageAmount = baseLoan + cmhcPremium;

  // Payment you'd actually make at the contract rate
  const monthlyPayment = payment({ principal: actualMortgageAmount, annualRatePct: mortgageRate, amortYears: AMORT_YEARS });

  // Qualifying ratios (lenders use the stress-test payment); at the maximum these sit at the limit
  const qualifyingPayment = payment({ principal: actualMortgageAmount, annualRatePct: stressTestRate, amortYears: AMORT_YEARS });
  const totalHousingCosts = qualifyingPayment + heatingCosts + propertyTax + condoCounted;
  const gdsRatio = (totalHousingCosts / monthlyIncome) * 100;
  const tdsRatio = ((totalHousingCosts + monthlyDebts) / monthlyIncome) * 100;

  const qualifies = maxPurchasePrice > 0 && gdsRatio <= 39 + 1e-6 && tdsRatio <= 44 + 1e-6;

  let recommendation = "";
  if (qualifies) {
    recommendation = cappedByDownPayment
      ? `Limited by the minimum down payment rules at ${(minDownPayment * 100).toFixed(0)}% down — a larger down payment would raise this.`
      : "Estimated maximum purchase price at the qualifying (stress test) rate.";
  } else if (gdsRatio > 39) {
    recommendation = "Reduce housing costs or increase income";
  } else if (tdsRatio > 44) {
    recommendation = "Pay down existing debts to improve qualification";
  }

  return {
    maxPurchasePrice,
    maxMortgageAmount: actualMortgageAmount,
    monthlyPayment,
    gdsRatio,
    tdsRatio,
    qualifies,
    mortgageRate,
    stressTestRate,
    isHighRatio,
    cmhcPremium,
    recommendation
  };
}

export default function PreApprovalCalculator() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [grossIncome, setGrossIncome] = useState(85000);
  const [monthlyDebts, setMonthlyDebts] = useState(800);
  const [downPayment, setDownPayment] = useState(0.10); // 10%
  const [creditScore, setCreditScore] = useState(720);
  const [heatingCosts, setHeatingCosts] = useState(150);
  const [propertyTax, setPropertyTax] = useState(300);
  const [condoFees, setCondoFees] = useState(0);
  const [amortYears, setAmortYears] = useState(25);
  const { data: liveRates, best5YrFixed } = useLiveRates();
  // Base rate for the credit tiers: insured 5-yr fixed below 20% down; with 20%+ down the insurable rate
  // (25-yr) or conventional rate (30-yr). Was always the insured rate.
  const rateProduct = purchaseRateProduct(downPayment * 100, 0, amortYears);
  const baseRate = liveRate(liveRates, rateProduct) ?? best5YrFixed;

  const results = calculatePreApproval({
    grossIncome,
    monthlyDebts,
    downPayment,
    creditScore,
    heatingCosts,
    propertyTax,
    condoFees,
    baseRate,
    amortYears,
  });
  const fmt0 = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString("en-CA") : "—");

  return (
    <>
      <Navigation />
      <CalculatorSchema name="Mortgage Pre-Approval Calculator" description="Estimate your maximum mortgage amount and purchase price based on income, debts, and credit." url="/calculators/pre-approval" />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-300 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-300 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-300">Pre-Approval Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Pre-Approval Calculator</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
                Mortgage Pre-Approval
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get an instant estimate of how much you can qualify for with our pre-approval calculator using current stress test requirements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-gold-300" />
                    Income & Financial Details
                  </h2>

                  <div className="space-y-6">
                    {/* Gross Annual Income */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gold-300" />
                        Gross Annual Income
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <CalculatorNumberInput aria-label="Gross Annual Income"
                          type="number"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="30000"
                          max="500000"
                          step="5000"
                        />
                      </div>
                    </div>

                    {/* Monthly Debt Payments */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gold-300" />
                        Monthly Debt Payments
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <CalculatorNumberInput aria-label="Monthly Debt Payments"
                          type="number"
                          value={monthlyDebts}
                          onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max="5000"
                          step="50"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Credit cards, loans, car payments</p>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold-300" />
                        Down Payment ({(downPayment * 100).toFixed(0)}%)
                      </label>
                      <input aria-label="Down Payment ( %)"
                        type="range"
                        min="0.05"
                        max="0.35"
                        step="0.01"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>5%</span>
                        <span className="font-semibold text-gold-300">{(downPayment * 100).toFixed(0)}%</span>
                        <span>35%</span>
                      </div>
                    </div>

                    {/* Amortization */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold-300" />
                        Amortization
                      </label>
                      <div className="flex gap-2">
                        {[25, 30].map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setAmortYears(y)}
                            aria-pressed={amortYears === y}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all border ${amortYears === y ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                          >
                            {y} Years
                          </button>
                        ))}
                      </div>
                      {amortYears > 25 && downPayment < 0.2 && (
                        <p className="text-xs text-amber-300 mt-2">
                          With less than 20% down, a 30-year amortization is only available to first-time buyers and buyers of new builds, and adds 0.20% to the insurance premium rate.
                        </p>
                      )}
                      {amortYears > 25 && downPayment >= 0.2 && (
                        <p className="text-xs text-gray-400 mt-2">30-year amortization with 20%+ down is a conventional (uninsured) mortgage, usually priced slightly higher.</p>
                      )}
                    </div>

                    {/* Credit Score */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gold-300" />
                        Credit Score
                      </label>
                      <input aria-label="Credit Score"
                        type="range"
                        min="600"
                        max="900"
                        value={creditScore}
                        onChange={(e) => setCreditScore(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>600</span>
                        <span className="font-semibold text-gold-300">{creditScore}</span>
                        <span>900</span>
                      </div>
                    </div>

                    {/* Housing Costs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Monthly Heating</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <CalculatorNumberInput aria-label="Monthly Heating"
                            type="number"
                            value={heatingCosts}
                            onChange={(e) => setHeatingCosts(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 text-sm bg-white/5 border border-white/20 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors"
                            min="50"
                            max="500"
                            step="25"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Property Tax</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <CalculatorNumberInput aria-label="Property Tax"
                            type="number"
                            value={propertyTax}
                            onChange={(e) => setPropertyTax(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 text-sm bg-white/5 border border-white/20 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors"
                            min="100"
                            max="1000"
                            step="50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Condo Fees */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Condo Fees (if applicable)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <CalculatorNumberInput aria-label="Condo Fees (if applicable)"
                          type="number"
                          value={condoFees}
                          onChange={(e) => setCondoFees(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-colors"
                          min="0"
                          max="800"
                          step="25"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Pre-Approval Amount */}
                <div className={`backdrop-blur-sm rounded-2xl p-8 border ${results.qualifies ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {results.qualifies ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <h3 className="text-xl font-bold">Estimated Maximum Purchase Price</h3>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${results.qualifies ? 'text-green-400' : 'text-red-400'}`}>
                    ${fmt0(results.maxPurchasePrice)}
                  </div>
                  <p className={`text-sm ${results.qualifies ? 'text-green-200' : 'text-red-200'}`}>
                    {results.recommendation}
                  </p>
                </div>

                {/* Mortgage Details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Mortgage Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300 block">Mortgage Amount</span>
                      <span className="font-semibold text-lg">${fmt0(results.maxMortgageAmount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Monthly Payment</span>
                      <span className="font-semibold text-lg">${fmt0(results.monthlyPayment)}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">Est. Rate (by credit tier)</span>
                      <span className="font-semibold text-lg">{results.mortgageRate.toFixed(2)}%</span>
                    </div>
                    <div className="col-span-2 -mt-2">
                      <LiveRateNote data={liveRates} product={rateProduct} source={liveRate(liveRates, rateProduct) !== undefined ? "live" : "fallback"} suffix={results.mortgageRate > baseRate ? ` + ${(results.mortgageRate - baseRate).toFixed(2)}% illustrative credit-tier spread` : ""} />
                    </div>
                    <div>
                      <span className="text-gray-300 block">Stress Test Rate</span>
                      <span className="font-semibold text-lg">{results.stressTestRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Debt Service Ratios */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Debt Service Ratios</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Qualifying GDS (max 39%)</span>
                        <span className={`font-semibold ${results.gdsRatio <= 39 ? 'text-green-400' : 'text-red-400'}`}>
                          {results.gdsRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${results.gdsRatio <= 39 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(results.gdsRatio / 39 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Qualifying TDS (max 44%)</span>
                        <span className={`font-semibold ${results.tdsRatio <= 44 ? 'text-green-400' : 'text-red-400'}`}>
                          {results.tdsRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${results.tdsRatio <= 44 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(results.tdsRatio / 44 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CMHC Insurance */}
                {results.isHighRatio && (
                  <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-yellow-300">CMHC Insurance Required</h4>
                    </div>
                    <p className="text-sm text-yellow-200 mb-2">
                      Down payment less than 20% requires mortgage insurance
                    </p>
                    <div className="text-lg font-semibold text-yellow-400">
                      ${fmt0(results.cmhcPremium)} premium (added to the mortgage)
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="flex gap-4">
                  <Link
                    href="/contact"
                    className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center"
                  >
                    Get Pre-Approved
                  </Link>
                  <Link
                    href="/calculators/affordability"
                    className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    Affordability
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">About Pre-Approval</h3>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>• Qualifies you at the stress test rate of {results.stressTestRate.toFixed(2)}% (estimated rate + 2%, minimum 5.25%) over a {amortYears}-year amortization</p>
                    <p>• Estimated rates are based on today&apos;s best 5-year fixed rate plus an illustrative credit-score adjustment</p>
                    <p>• Pre-approval is valid for 90-120 days depending on the lender</p>
                    <p>• Actual rates and approval are subject to credit and income verification</p>
                    <p>• CMHC insurance is required for down payments under 20%</p>
                    <p>• Property appraisal and other conditions will apply to final approval</p>
                  </div>
                </div>
              </div>
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
                source="calculator-pdf-pre-approval"
                title="Your Pre-Approval Estimate"
                subtitle="Get a personalized PDF with your pre-qualification details"
                leadMessage="PDF Report Download — Pre-Approval Calculator"
                mortgageType="Pre-Approval"
                amount={grossIncome.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Pre-Approval Estimate",
                    calculatorName: "Pre-Approval Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Gross Annual Income", value: "$" + Math.round(grossIncome).toLocaleString("en-CA") },
                          { label: "Down Payment", value: (downPayment * 100).toFixed(0) + "% ($" + fmt0(results.maxPurchasePrice * downPayment) + " at max price)" },
                          { label: "Monthly Debts", value: "$" + Math.round(monthlyDebts).toLocaleString("en-CA") },
                          { label: "Credit Score", value: String(creditScore) },
                          { label: "Amortization", value: amortYears + " years" },
                        ]
                      },
                      {
                        title: "Pre-Approval Results",
                        rows: [
                          { label: "Max Purchase Price", value: "$" + Math.round(results.maxPurchasePrice).toLocaleString("en-CA"), highlight: true },
                          { label: "Max Mortgage Amount", value: "$" + Math.round(results.maxMortgageAmount).toLocaleString("en-CA") },
                          { label: "Monthly Payment", value: "$" + Math.round(results.monthlyPayment).toLocaleString("en-CA") },
                          { label: "GDS Ratio", value: results.gdsRatio.toFixed(1) + "%" },
                          { label: "TDS Ratio", value: results.tdsRatio.toFixed(1) + "%" },
                          { label: "Qualifies?", value: results.qualifies ? "Yes" : "No", highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Pre-approval gives you a clear picture of your purchasing power before you start house hunting. A mortgage broker can get you pre-approved across multiple lenders."
                  });
                }}
              />
            </div>
        <ComplianceBanner feature="LEAD_FORM" />
        <RelatedCalculators current="pre-approval" related={["affordability","stress-test","required-income","down-payment","cmhc-insurance"]} />
      </main>
    </>
  );
}