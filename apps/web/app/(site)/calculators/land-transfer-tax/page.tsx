"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import {
  DollarSign, Calculator, Home, CheckCircle, AlertTriangle, ArrowRight, Receipt, Info
} from "lucide-react";
import Link from "next/link";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";

const PROVINCES = ["BC", "Alberta", "Ontario"] as const;
type Province = (typeof PROVINCES)[number];

function bcPTT(price: number): { brackets: { label: string; amount: number; rate: number }[]; total: number } {
  const brackets: { label: string; amount: number; rate: number }[] = [];
  let total = 0;

  if (price > 0) {
    const b1 = Math.min(price, 200000);
    const t1 = b1 * 0.01;
    if (b1 > 0) brackets.push({ label: "First $200,000", amount: t1, rate: 1.0 });
    total += t1;
  }
  if (price > 200000) {
    const b2 = Math.min(price - 200000, 1800000);
    const t2 = b2 * 0.02;
    if (b2 > 0) brackets.push({ label: "$200K – $2M", amount: t2, rate: 2.0 });
    total += t2;
  }
  if (price > 2000000) {
    const b3 = price - 2000000;
    const t3 = b3 * 0.03;
    if (b3 > 0) brackets.push({ label: "Over $2M", amount: t3, rate: 3.0 });
    total += t3;
  }

  return { brackets, total };
}

function ontLTT(price: number): { brackets: { label: string; amount: number; rate: number }[]; total: number } {
  const brackets: { label: string; amount: number; rate: number }[] = [];
  let total = 0;

  const tiers = [
    { upTo: 55000, rate: 0.005, label: "First $55,000" },
    { upTo: 250000, rate: 0.01, label: "$55K – $250K" },
    { upTo: 400000, rate: 0.015, label: "$250K – $400K" },
    { upTo: 2000000, rate: 0.02, label: "$400K – $2M" },
  ];
  let prev = 0;
  for (const t of tiers) {
    if (price > prev) {
      const slab = Math.min(price - prev, t.upTo - prev);
      const tax = slab * t.rate;
      if (slab > 0) brackets.push({ label: t.label, amount: tax, rate: t.rate * 100 });
      total += tax;
    }
    prev = t.upTo;
  }
  if (price > 2000000) {
    const slab = price - 2000000;
    const tax = slab * 0.025;
    if (slab > 0) brackets.push({ label: "Over $2M", amount: tax, rate: 2.5 });
    total += tax;
  }

  return { brackets, total };
}

function bcFTHRRebate(price: number): number {
  if (price <= 500000) return 1.0; // full exemption
  if (price <= 536000) return (536000 - price) / 36000;
  return 0;
}

function torontoMLTT(price: number): { brackets: { label: string; amount: number; rate: number }[]; total: number } {
  const brackets: { label: string; amount: number; rate: number }[] = [];
  let total = 0;

  const tiers = [
    { upTo: 55000, rate: 0.005, label: "First $55,000" },
    { upTo: 250000, rate: 0.01, label: "$55K – $250K" },
    { upTo: 400000, rate: 0.015, label: "$250K – $400K" },
    { upTo: 2000000, rate: 0.02, label: "$400K – $2M" },
  ];
  let prev = 0;
  for (const t of tiers) {
    if (price > prev) {
      const slab = Math.min(price - prev, t.upTo - prev);
      const tax = slab * t.rate;
      if (slab > 0) brackets.push({ label: t.label, amount: tax, rate: t.rate * 100 });
      total += tax;
    }
    prev = t.upTo;
  }
  if (price > 2000000) {
    const slab = price - 2000000;
    const tax = slab * 0.025;
    if (slab > 0) brackets.push({ label: "Over $2M", amount: tax, rate: 2.5 });
    total += tax;
  }
  return { brackets, total };
}

export default function LandTransferTax() {
  const [purchasePrice, setPurchasePrice] = useState(650000);
  const [province, setProvince] = useState<Province>("BC");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isToronto, setIsToronto] = useState(false);

  const results = useMemo(() => {
    if (province === "Alberta") {
      const fee = 50 + Math.ceil(purchasePrice / 5000);
      return {
        tax: 0, fee, totalOwing: fee,
        brackets: [{ label: "Registration Fee", amount: fee, rate: 0 }],
        rebate: 0, savings: 0, mltt: null,
      };
    }

    if (province === "BC") {
      const calc = bcPTT(purchasePrice);
      let rebate = 0;
      if (isFirstTime) {
        rebate = calc.total * bcFTHRRebate(purchasePrice);
      }
      return {
        tax: calc.total, fee: 0, totalOwing: calc.total - rebate,
        brackets: calc.brackets,
        rebate, savings: rebate, mltt: null,
      };
    }

    // Ontario
    const calc = ontLTT(purchasePrice);
    const ftRebate = isFirstTime ? Math.min(calc.total, 4475) : 0;

    let mltt = null;
    if (isToronto) {
      mltt = torontoMLTT(purchasePrice);
    }

    return {
      tax: calc.total, fee: 0, totalOwing: calc.total - ftRebate + (mltt?.total ?? 0),
      brackets: calc.brackets,
      rebate: ftRebate, savings: ftRebate, mltt,
    };
  }, [purchasePrice, province, isFirstTime, isToronto]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">Land Transfer Tax Calculator</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Receipt className="w-4 h-4" />
                Closing Cost Estimation
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Land Transfer Tax</span> Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate land transfer tax for BC, Alberta, and Ontario with first-time buyer rebates.
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
                  <Calculator className="w-6 h-6 text-gold-400" />
                  Property Details
                </h2>
                <div className="space-y-6">
                  <ValidatedInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} validation={{ min: 50000, max: 10000000 }} type="currency" />

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

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/20">
                    <div>
                      <div className="font-medium text-gray-200">First-Time Home Buyer</div>
                      <div className="text-xs text-gray-400">Qualify for rebate programs</div>
                    </div>
                    <button onClick={() => setIsFirstTime(!isFirstTime)}
                      className={`w-12 h-6 rounded-full transition-colors ${isFirstTime ? "bg-gold-500" : "bg-gray-600"} relative`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isFirstTime ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>

                  {province === "Ontario" && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/20">
                      <div>
                        <div className="font-medium text-gray-200">Toronto (Additional MLTT)</div>
                        <div className="text-xs text-gray-400">Municipal Land Transfer Tax</div>
                      </div>
                      <button onClick={() => setIsToronto(!isToronto)}
                        className={`w-12 h-6 rounded-full transition-colors ${isToronto ? "bg-gold-500" : "bg-gray-600"} relative`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isToronto ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
              {/* Main result */}
              <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Receipt className="w-6 h-6 text-gold-400" />
                  <span className="text-sm text-gold-300 font-medium">
                    {province === "Alberta" ? "Registration Fee" : "Land Transfer Tax"}
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gold-400 mb-1">
                  {formatCurrency(results.totalOwing, 0)}
                </div>
                {province === "Alberta" && (
                  <p className="text-sm text-gray-400">Alberta has no land transfer tax — only a small registration fee</p>
                )}
              </div>

              {/* First-time buyer savings */}
              {isFirstTime && results.savings > 0 && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-300">First-Time Buyer Savings</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">{formatCurrency(results.savings, 0)}</div>
                  <p className="text-xs text-green-200 mt-1">
                    Without this rebate, you would pay {formatCurrency(results.totalOwing + results.savings, 0)}
                  </p>
                </div>
              )}

              {/* Bracket breakdown */}
              {province !== "Alberta" && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Tax Bracket Breakdown</h4>
                  <div className="space-y-3">
                    {results.brackets.map((b, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                        <div>
                          <div className="text-sm text-gray-300">{b.label}</div>
                          <div className="text-xs text-gray-500">{b.rate}%</div>
                        </div>
                        <span className="font-semibold">{formatCurrency(b.amount, 0)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 font-bold border-t border-gold-500/30">
                      <span className="text-gold-400">Subtotal</span>
                      <span className="text-gold-400">{formatCurrency(results.tax, 0)}</span>
                    </div>
                    {isFirstTime && results.rebate > 0 && (
                      <div className="flex justify-between items-center pt-1 text-green-400">
                        <span>First-Time Buyer Rebate</span>
                        <span>-{formatCurrency(results.rebate, 0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Toronto MLTT */}
              {results.mltt && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h4 className="font-semibold mb-4">Toronto Municipal Land Transfer Tax</h4>
                  <div className="text-2xl font-bold text-gold-400 mb-3">{formatCurrency(results.mltt.total, 0)}</div>
                  {results.mltt.brackets.map((b, i) => (
                    <div key={i} className="flex justify-between py-1 text-sm text-gray-400">
                      <span>{b.label}</span>
                      <span>{formatCurrency(b.amount, 0)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment info */}
              <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-200">
                    <strong className="text-blue-300">When is it due?</strong>
                    <p className="mt-1">Land transfer tax is typically due on your closing date. Your lawyer or notary will arrange payment from the proceeds of your sale. Budget for this cost early in your home search.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Get Pre-Approved</Link>
                <Link href="/calculators/closing-costs" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Closing Costs Calculator</Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Land Transfer Tax in Canada: Complete Province-by-Province Guide</h2>

            <p className="text-gray-300 leading-relaxed mb-4">
              Land transfer tax (also called property transfer tax in BC or land registration fee in Alberta) is one of the largest closing costs you&apos;ll face when purchasing a home. It&apos;s a one-time tax or fee paid to the provincial government when you register the transfer of property. Understanding how much you&apos;ll owe helps you budget accurately and avoid surprises at closing.
            </p>

            <h3 className="text-2xl font-semibold text-gold-400 mt-8 mb-4">British Columbia Property Transfer Tax</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              BC charges a Property Transfer Tax (PTT) based on tiered brackets: 1% on the first $200,000, 2% between $200,000 and $2,000,000, and 3% on the portion over $2,000,000. An additional 2% applies to properties over $3,000,000 for foreign entities and satellite families (exempt for Canadian citizens and permanent residents living in BC).
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>First-Time Home Buyers&apos; Program:</strong> First-time buyers in BC may be fully exempt from the PTT on homes up to $500,000. A partial exemption applies for homes between $500,000 and $536,000. To qualify, you must be a Canadian citizen or permanent resident, have lived in BC for at least 12 months, have never owned an interest in a principal residence anywhere, and the home must be your principal residence.
            </p>

            <h3 className="text-2xl font-semibold text-gold-400 mt-8 mb-4">Alberta Land Registration</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Alberta is one of the few provinces that does not charge a land transfer tax. Instead, you pay a modest land titles registration fee. The base fee is approximately $50 plus a small additional amount based on property value. This makes Alberta an attractive option for buyers looking to minimize closing costs. However, it&apos;s worth noting that Alberta has periodically proposed introducing a land transfer tax, so it&apos;s important to stay informed about potential changes.
            </p>

            <h3 className="text-2xl font-semibold text-gold-400 mt-8 mb-4">Ontario Land Transfer Tax</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Ontario&apos;s Land Transfer Tax uses five progressive brackets: 0.5% on the first $55,000, 1.0% from $55,000 to $250,000, 1.5% from $250,000 to $400,000, 2.0% from $400,000 to $2,000,000, and 2.5% on amounts over $2,000,000.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>First-Time Buyer Rebate:</strong> Ontario provides a rebate of up to $4,475 for first-time home buyers, which effectively eliminates the tax on the first $368,333 of the purchase price. You must be at least 18 years old, occupy the home as your principal residence within 9 months of closing, and neither you nor your spouse can have owned a home anywhere in the world.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Toronto MLTT:</strong> If you&apos;re buying in Toronto, you pay an additional Municipal Land Transfer Tax with the same bracket structure as the provincial tax. First-time buyers in Toronto may be eligible for a separate municipal rebate of up to $4,475.
            </p>

            <h3 className="text-2xl font-semibold text-gold-400 mt-8 mb-4">When Is Land Transfer Tax Due?</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Land transfer tax must be paid on or before your closing date. Your lawyer or notary public will typically arrange payment from the mortgage proceeds or your available funds. Failure to pay on time can result in penalties and interest charges. It&apos;s important to include this cost in your closing budget, as it typically ranges from a few hundred dollars (Alberta) to tens of thousands of dollars (BC or Ontario on expensive properties).
            </p>

            <h3 className="text-2xl font-semibold text-gold-400 mt-8 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-200">Can land transfer tax be added to my mortgage?</h4>
                <p className="text-gray-400">Generally, no. Land transfer tax must be paid at closing and cannot typically be rolled into your mortgage. Some lenders may offer cash-back products that could help cover this cost.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">Do I pay land transfer tax on a resale home?</h4>
                <p className="text-gray-400">Yes, land transfer tax applies to both new construction and resale properties. The GST rebate for new homes is a separate benefit.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">What if I&apos;m buying with someone who has owned a home before?</h4>
                <p className="text-gray-400">In most provinces, if any buyer on title has owned a home before, the first-time buyer rebate may not be available. BC and Ontario have specific rules — check with your mortgage broker.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">Is land transfer tax deductible on my taxes?</h4>
                <p className="text-gray-400">For investment properties, land transfer tax can be added to the property&apos;s cost base (reducing capital gains when sold). For principal residences, it is not tax-deductible.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">How do I pay land transfer tax?</h4>
                <p className="text-gray-400">Your lawyer or notary handles the payment on closing day from the funds you provide. You don&apos;t need to deal with the government directly — it&apos;s included in your closing statement.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/calculators/closing-costs" className="text-gold-400 hover:text-gold-300 underline">Closing Costs Calculator</Link>
              <Link href="/calculators/affordability" className="text-gold-400 hover:text-gold-300 underline">Affordability Calculator</Link>
              <Link href="/calculators/first-time-home-buyer" className="text-gold-400 hover:text-gold-300 underline">First-Time Home Buyer Calculator</Link>
            </div>
          </div>
        </section>

        <ComplianceBanner feature="LEAD_FORM" />
      </main>
    </>
  );
}
