"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  Calculator, ArrowRight, ChevronDown, ChevronUp, Home, TrendingUp,
  HelpCircle, Scale, DollarSign, BarChart3, Clock, AlertTriangle, Shield
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput, ValidatedSlider } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

const faqs = [
  {
    q: "Is it better to rent or buy in Canada right now?",
    a: "It depends on your timeline, market, and finances. In high-price markets like Vancouver or Toronto, renting can be cheaper in the short term when you factor in all homeownership costs. However, buying builds equity and long-term wealth. Use this calculator to find your personal break-even point — it's typically between 5 and 10 years."
  },
  {
    q: "What is the opportunity cost of a down payment?",
    a: "When you buy a home, your down payment is tied up in the property. If you rented instead, that same money could be invested in stocks, bonds, or other assets. For example, a $100,000 down payment invested at 6% annually would grow to about $179,000 over 10 years. This calculator factors that opportunity cost so you see the real trade-off."
  },
  {
    q: "How accurate is the break-even year calculation?",
    a: "The break-even estimate is based on the inputs you provide — appreciation rate, investment returns, and all costs. It's a projection, not a guarantee. Real estate markets can underperform or outperform expectations. We recommend running scenarios with conservative and optimistic assumptions to see a realistic range."
  },
  {
    q: "Does this calculator account for CMHC insurance?",
    a: "Yes. If your down payment is below 20%, the calculator automatically adds CMHC insurance to your mortgage balance. This increases your monthly payment and total interest — making buying less attractive relative to renting at lower down payments."
  },
  {
    q: "What hidden costs of homeownership do people forget?",
    a: "The most commonly overlooked costs are maintenance (budget 1-2% of home value per year), property tax increases, rising insurance premiums, and transaction costs when you eventually sell (real estate commissions of 3-7%). This calculator includes maintenance, property tax, and insurance — but actual costs can vary."
  }
];

function cmhcPremium(downPayment: number, price: number): number {
  const loan = price - downPayment;
  if (downPayment >= price * 0.2) return 0;
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

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function RentVsBuyPage() {
  const [homePrice, setHomePrice] = useState(700000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(5.0);
  const [amortization, setAmortization] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [appreciation, setAppreciation] = useState(3.0);
  const [investmentReturn, setInvestmentReturn] = useState(6.0);
  const [propertyTaxYear, setPropertyTaxYear] = useState(4200);
  const [maintenanceYear, setMaintenanceYear] = useState(4200);
  const [insuranceYear, setInsuranceYear] = useState(1800);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const results = useMemo(() => {
    const down = homePrice * downPaymentPct / 100;
    const cmhc = cmhcPremium(down, homePrice);
    const loan = homePrice - down + cmhc;
    const mortgage = monthlyPayment(loan, mortgageRate, amortization);
    const monthlyTax = propertyTaxYear / 12;
    const monthlyMaint = maintenanceYear / 12;
    const monthlyIns = insuranceYear / 12;
    const buyMonthly = mortgage + monthlyTax + monthlyMaint + monthlyIns;

    const investableCash = down + cmhc;
    const rentInvestmentMonthly = investableCash > 0
      ? ((buyMonthly - monthlyRent) > 0 ? 0 : (monthlyRent - buyMonthly) + (investableCash * investmentReturn / 100 / 12))
      : 0;

    const years = [5, 10, 15, 20, 25];
    const buyCosts: number[] = [];
    const rentCosts: number[] = [];
    const buyNetWorth: number[] = [];
    const rentNetWorth: number[] = [];

    let breakEvenYear: number | null = null;

    for (let y = 1; y <= 25; y++) {
      // Buying costs
      const buyCostY = buyMonthly * 12 * y;
      buyCosts.push(buyCostY);

      // Renting costs
      const rentCostY = monthlyRent * 12 * y;
      rentCosts.push(rentCostY);

      // Buy net worth: home equity (appreciated value minus remaining mortgage)
      const appreciatedValue = homePrice * Math.pow(1 + appreciation / 100, y);
      let remainingMortgage = loan;
      for (let m = 0; m < y * 12; m++) {
        const interest = remainingMortgage * mortgageRate / 100 / 12;
        const principalPaid = mortgage - interest;
        remainingMortgage = Math.max(0, remainingMortgage - principalPaid);
      }
      buyNetWorth.push(appreciatedValue - remainingMortgage);

      // Rent net worth: invested down payment + monthly savings
      let rentPortfolio = investableCash;
      for (let m = 0; m < y * 12; m++) {
        rentPortfolio += Math.max(0, monthlyRent - buyMonthly);
        rentPortfolio *= (1 + investmentReturn / 100 / 12);
      }
      rentNetWorth.push(rentPortfolio);

      // Break-even: cumulative buy cost <= cumulative rent cost
      if (breakEvenYear === null && buyCostY <= rentCostY) {
        breakEvenYear = y;
      }
    }

    return {
      down, cmhc, loan, mortgage, buyMonthly,
      monthlyTax, monthlyMaint, monthlyIns,
      years: years.map(y => ({
        year: y,
        buyCost: buyCosts[y - 1],
        rentCost: rentCosts[y - 1],
        buyNW: buyNetWorth[y - 1],
        rentNW: rentNetWorth[y - 1]
      })),
      breakEvenYear,
      investableCash
    };
  }, [homePrice, downPaymentPct, mortgageRate, amortization, monthlyRent, appreciation, investmentReturn, propertyTaxYear, maintenanceYear, insuranceYear]);

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
              <span className="text-gold-400">Rent vs Buy Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Scale className="w-4 h-4" />
                Side-by-Side Comparison
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Rent vs Buy</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Compare the true cost of renting versus buying — including hidden costs, opportunity cost, and long-term net worth.
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
                    <Home className="w-6 h-6 text-gold-400" />
                    Home Purchase Details
                  </h2>
                  <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Home Purchase Price" value={homePrice} onChange={setHomePrice} validation={{ min: 100000, max: 5000000 }} type="currency" />
                    <ValidatedSlider label={`Down Payment (${downPaymentPct}%)`} value={downPaymentPct} onChange={setDownPaymentPct} min={5} max={50} step={1} formatValue={(v) => `${v}% (${formatCurrency(homePrice * v / 100, 0)})`} />
                    <ValidatedSlider label={`Mortgage Rate (${mortgageRate}%)`} value={mortgageRate} onChange={setMortgageRate} min={0.5} max={12} step={0.1} formatValue={(v) => `${v}%`} />
                    <ValidatedSlider label={`Amortization (${amortization} years)`} value={amortization} onChange={setAmortization} min={5} max={30} step={5} formatValue={(v) => `${v} years`} />
                    <ValidatedSlider label={`Annual Appreciation (${appreciation}%)`} value={appreciation} onChange={setAppreciation} min={0} max={10} step={0.5} formatValue={(v) => `${v}%`} />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-gold-400" />
                    Ongoing Costs & Rent
                  </h2>
                  <div className="space-y-6">
                    <ValidatedInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} validation={{ min: 500, max: 10000 }} type="currency" />
                    <ValidatedInput label="Property Tax / Year" value={propertyTaxYear} onChange={setPropertyTaxYear} validation={{ min: 0, max: 30000 }} type="currency" />
                    <ValidatedInput label="Maintenance / Year" value={maintenanceYear} onChange={setMaintenanceYear} validation={{ min: 0, max: 30000 }} type="currency" />
                    <ValidatedInput label="Home Insurance / Year" value={insuranceYear} onChange={setInsuranceYear} validation={{ min: 0, max: 10000 }} type="currency" />
                    <ValidatedSlider label={`Investment Return (${investmentReturn}%)`} value={investmentReturn} onChange={setInvestmentReturn} min={0} max={12} step={0.5} formatValue={(v) => `${v}% (down payment opportunity cost)`} />
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {/* Monthly Comparison */}
                <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                  <p className="text-sm text-gold-300 font-medium mb-4">Monthly Cost Comparison</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Buying (total monthly)</p>
                      <p className="text-2xl font-bold text-gold-400">{formatCurrency(results.buyMonthly, 0)}</p>
                      <p className="text-xs text-gray-500 mt-1">Mortgage {formatCurrency(results.mortgage, 0)} + tax + maint + ins</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Renting</p>
                      <p className="text-2xl font-bold text-gray-100">{formatCurrency(monthlyRent, 0)}</p>
                      <p className="text-xs text-gray-500 mt-1">Monthly rent payment</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300">
                      {results.buyMonthly > monthlyRent ? (
                        <>Buying costs <span className="text-amber-400 font-semibold">{formatCurrency(results.buyMonthly - monthlyRent, 0)}/mo more</span> than renting</>
                      ) : (
                        <>Buying costs <span className="text-green-400 font-semibold">{formatCurrency(monthlyRent - results.buyMonthly, 0)}/mo less</span> than renting</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Break-even */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <p className="text-sm text-gray-400">Break-Even Year</p>
                  </div>
                  {results.breakEvenYear ? (
                    <p className="text-3xl font-bold text-green-400">Year {results.breakEvenYear}</p>
                  ) : (
                    <p className="text-xl font-semibold text-amber-400">Beyond 25 years (or never)</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">When cumulative buying costs fall below cumulative renting costs</p>
                </div>

                {/* Multi-year comparison */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gold-400" />
                    Multi-Year Comparison
                  </h4>
                  <div className="space-y-3">
                    {results.years.map((y) => {
                      const winner = y.buyNW > y.rentNW ? "buy" : "rent";
                      return (
                        <div key={y.year} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 w-16">Year {y.year}</span>
                          <div className="flex gap-4 flex-1">
                            <div className="flex-1">
                              <span className="text-gray-400 text-xs">Buy NW</span>
                              <span className={`block font-medium ${winner === "buy" ? "text-green-400" : "text-gray-300"}`}>{formatCurrency(y.buyNW, 0)}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-400 text-xs">Rent NW</span>
                              <span className={`block font-medium ${winner === "rent" ? "text-blue-400" : "text-gray-300"}`}>{formatCurrency(y.rentNW, 0)}</span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${winner === "buy" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                            {winner === "buy" ? "Buy" : "Rent"} wins
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Down payment opportunity cost note */}
                {results.cmhc > 0 && (
                  <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-300 font-medium mb-1">CMHC Insurance Included</p>
                        <p className="text-xs text-blue-200">With {downPaymentPct}% down, CMHC adds {formatCurrency(results.cmhc, 0)} to your mortgage. Increasing to 20% eliminates this cost entirely.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">
                    Get Pre-Approved
                  </Link>
                  <Link href="/calculators/payment" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">
                    Payment Calculator
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">The Complete Rent vs Buy Decision Guide for Canadians</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                The rent vs buy debate is one of the most consequential financial decisions Canadians face. It&apos;s not just about comparing a mortgage payment to rent — it&apos;s about understanding the full picture of costs, opportunity costs, tax implications, and your personal timeline. This guide breaks down every factor so you can make an informed decision.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Renting Makes Sense</h3>
              <p>
                Renting offers flexibility that homeownership cannot match. If you plan to move within 3-5 years, the transaction costs of buying and selling (real estate commissions, legal fees, land transfer tax) often wipe out any equity gains. Renting also shields you from unexpected maintenance costs — a $15,000 roof repair is your landlord&apos;s problem. In expensive markets like Vancouver and Toronto, renting can be significantly cheaper on a monthly basis when you account for property tax, insurance, and maintenance.
              </p>
              <p>
                Renting also means your capital isn&apos;t concentrated in a single asset. Your down payment can be diversified across stocks, bonds, and other investments. Historically, a balanced portfolio has produced competitive long-term returns compared to residential real estate in many Canadian markets.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">When Buying Makes Sense</h3>
              <p>
                Homeownership provides forced savings through mortgage paydown, potential appreciation, and the stability of knowing your housing costs are largely fixed (especially with a fixed-rate mortgage). In markets with strong long-term appreciation trends, buying early can result in substantial wealth accumulation. The key is holding long enough — typically 7-10 years — for appreciation and equity to overcome transaction costs.
              </p>
              <p>
                There are also qualitative benefits: the freedom to renovate, no landlord restrictions on pets or decor, and the psychological security of owning your home. For families planning to stay put, these non-financial factors carry significant weight.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Hidden Costs of Homeownership</h3>
              <p>
                New homeowners often underestimate ongoing costs. Budget 1-2% of your home&apos;s value annually for maintenance and repairs. Property taxes rise over time. Home insurance costs more than renter&apos;s insurance. Then there are the big-ticket items: roof replacement ($8,000-$15,000), furnace replacement ($4,000-$8,000), and landscaping. When selling, expect to pay 3-7% in real estate commissions alone.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">The Opportunity Cost of Your Down Payment</h3>
              <p>
                This is the factor most rent vs buy analyses ignore. When you put $140,000 down on a $700,000 home (20%), that money is locked in real estate. If you invested that same amount at a 6% return instead, it would grow to approximately $251,000 over 10 years. The question isn&apos;t just &quot;what will my home be worth in 10 years&quot; — it&apos;s &quot;what would my down payment be worth if invested elsewhere?&quot; Our calculator factors this in automatically.
              </p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">How to Use This Calculator Effectively</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Run multiple scenarios</strong> — try different appreciation rates (conservative 2%, moderate 4%, optimistic 6%) to see how sensitive your break-even is to market performance.</li>
                <li><strong>Be honest about maintenance costs</strong> — many buyers budget $0, which skews results. Use 1.5% of home value as a reasonable estimate.</li>
                <li><strong>Consider your investment return realistically</strong> — a diversified portfolio has historically returned 6-8% annually before inflation, but past performance doesn&apos;t guarantee future results.</li>
                <li><strong>Factor in your personal timeline</strong> — if you might move in under 7 years, renting often wins even in appreciating markets.</li>
                <li><strong>Check your break-even year</strong> — this is the most actionable number. If it&apos;s within your expected holding period, buying is likely the better financial choice.</li>
              </ul>

              <div className="mt-8">
                <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Mortgage Payment Calculator</Link>
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
    </>
  );
}
