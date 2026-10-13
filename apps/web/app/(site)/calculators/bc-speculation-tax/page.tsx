"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Calculator, HelpCircle, ChevronDown, ChevronUp, AlertTriangle,
  Info, Building, CheckCircle, XCircle, Download } from "lucide-react";
import Link from "next/link";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { formatCurrency } from "@/lib/utils/validation";
import PdfLeadModal from "@/components/PdfLeadModal";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";

type Ownership = "citizen" | "pr" | "other";
type Occupancy = "principal" | "rental" | "vacant" | "shortterm";

// SVT rates by tax year (gov.bc.ca "Tax rates", verified Oct 2026). "high" applies to foreign
// owners and untaxed worldwide earners (incl. satellite families); "low" to other Canadian
// citizens / permanent residents. The tax year is the calendar year of use; it's paid the next July.
const SVT_RATES: Record<number, { high: number; low: number }> = {
  2025: { high: 2, low: 0.5 },
  2026: { high: 3, low: 1 },
  2027: { high: 4, low: 1 },
};
const TAX_YEARS = [2025, 2026, 2027] as const;

function svtRate(ownership: Ownership, untaxedWorldwideEarner: boolean, taxYear: number): number {
  const rates = SVT_RATES[taxYear] ?? SVT_RATES[2026];
  if (ownership === "other" || untaxedWorldwideEarner) return rates.high;
  return rates.low;
}

function isExempt(ownership: Ownership, occupancy: Occupancy, region: string, untaxedWorldwideEarner: boolean): { exempt: boolean; reason: string } {
  if (region === "outside") return { exempt: true, reason: "The property is outside the SVT taxable areas, so the tax doesn't apply" };
  if (occupancy === "principal") {
    // Principal-residence exemption: Canadian citizen/PR, BC resident for income tax, not an untaxed worldwide earner
    if (ownership !== "other" && !untaxedWorldwideEarner) return { exempt: true, reason: "Principal residence exemption applies (Canadian citizen/PR, BC tax resident)" };
    return { exempt: false, reason: "The principal residence exemption isn't available to foreign owners or untaxed worldwide earners (incl. satellite families)" };
  }
  if (occupancy === "rental") return { exempt: true, reason: "Tenancy exemption: rented to qualifying tenants for at least 6 months of the year" };
  return { exempt: false, reason: "SVT applies at your ownership rate" };
}

const faqs = [
  { q: "What is the BC Speculation and Vacancy Tax (SVT)?", a: "The SVT is an annual tax on residential properties in designated areas of BC, aimed at addressing housing affordability. It targets vacant or underused homes, foreign owners, and untaxed worldwide earners (including satellite families). Rates are rising: for the 2026 tax year it is 3% of assessed value for foreign owners and untaxed worldwide earners and 1% for other Canadian citizens and permanent residents (2% / 0.5% for 2025; 4% / 1% from 2027)." },
  { q: "Who has to pay the SVT?", a: "Owners in a taxable area who don't qualify for an exemption. Most BC residents who live in their home as a principal residence, or rent it to qualifying tenants for at least 6 months of the year, are exempt. The tax applies in Metro Vancouver, the Capital Regional District, and designated municipalities including Abbotsford, Chilliwack, Mission, Kelowna, West Kelowna, Kamloops, Nanaimo, Squamish, Vernon, Penticton and several Vancouver Island communities." },
  { q: "Am I a satellite family?", a: "A satellite family is generally a household that declares less than 50% of its total combined income on Canadian tax returns. Satellite families fall under the 'untaxed worldwide earner' category, which pays the highest rate and cannot claim the principal residence exemption — even if the owner is a Canadian citizen or permanent resident." },
  { q: "How do I declare for SVT?", a: "Every residential property owner in a designated SVT area must complete an annual declaration. The BC government sends declaration letters in January/February. You can also declare online through the SVT self-service portal. If you don't declare, the property is taxed at the highest rate until you do." },
  { q: "What is the deadline for SVT declarations?", a: "The annual SVT declaration deadline is typically March 31. Late declarations may still be accepted but you risk being assessed at the highest rate. Check the BC government SVT website for current year deadlines." }
];

export default function BCSpeculationTaxPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [assessedValue, setAssessedValue] = useState(1000000);
  const [ownership, setOwnership] = useState<Ownership>("citizen");
  const [occupancy, setOccupancy] = useState<Occupancy>("principal");
  const [region, setRegion] = useState("metro-van");
  const [untaxedWorldwideEarner, setUntaxedWorldwideEarner] = useState(false);
  const [taxYear, setTaxYear] = useState<number>(2026);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { taxRate, taxAmount, exempt, reason } = useMemo(() => {
    const exemption = isExempt(ownership, occupancy, region, untaxedWorldwideEarner);
    if (exemption.exempt) return { taxRate: 0, taxAmount: 0, exempt: true, reason: exemption.reason };
    const rate = svtRate(ownership, untaxedWorldwideEarner, taxYear);
    return { taxRate: rate, taxAmount: assessedValue * (rate / 100), exempt: false, reason: exemption.reason };
  }, [assessedValue, ownership, occupancy, region, untaxedWorldwideEarner, taxYear]);

  return (
    <>
      <Navigation />
      <CalculatorSchema name="BC Speculation & Vacancy Tax Calculator" description="Calculate BC speculation and vacancy tax liability based on ownership status." url="/calculators/bc-speculation-tax" />

      <main className="min-h-screen mt-16">
        <section className="py-6 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link>
              <span className="text-gray-600">›</span>
              <Link href="/calculators" className="text-gray-400 hover:text-gold-400 transition-colors">Calculators</Link>
              <span className="text-gray-600">›</span>
              <span className="text-gold-400">BC Speculation & Vacancy Tax</span>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                <Building className="w-4 h-4" />
                BC Property Tax
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">BC Speculation & Vacancy</span> Tax Calculator
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Estimate your BC SVT based on ownership type, occupancy, and property value.</p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3"><Calculator className="w-6 h-6 text-gold-400" /> Property Details</h2>
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
                source="calculator-pdf-bc-speculation-tax"
                title="Your BC Speculation Tax Report"
                subtitle="Get a personalized PDF with your SVT details"
                leadMessage="PDF Report Download — Bc Speculation Tax"
                mortgageType="BC Tax"
                amount={assessedValue.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your BC Speculation Tax Report",
                    calculatorName: "Bc Speculation Tax Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Assessed Value", value: "$" + Math.round(assessedValue).toLocaleString("en-CA") },
                          { label: "Ownership", value: ownership },
                          { label: "Occupancy", value: occupancy },
                          { label: "Region", value: region },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Tax Year", value: String(taxYear) },
                          { label: "Untaxed Worldwide Earner?", value: untaxedWorldwideEarner ? "Yes" : "No" },
                          { label: "Tax Rate", value: taxRate + "%" },
                          { label: "Annual Tax", value: "$" + Math.round(taxAmount).toLocaleString("en-CA"), highlight: true },
                          { label: "Exempt?", value: exempt ? "Yes" : "No" },
                          ...(reason ? [{ label: "Reason", value: reason }] : []),
                        ]
                      }
                    ],
                    educationalContent: "For the 2026 tax year the BC SVT is 3% of assessed value for foreign owners and untaxed worldwide earners and 1% for other Canadian citizens and permanent residents, in designated areas. Exemptions exist for principal residences (Canadian citizens/PRs who are BC tax residents) and qualifying long-term rentals."
                  });
                }}
              />
            </div>
                                    <ComplianceBanner feature="LEAD_FORM" />
                  <div className="space-y-6">
                    <ValidatedInput label="Assessed Property Value" value={assessedValue} onChange={setAssessedValue} validation={{ min: 100000, max: 10000000 }} type="currency" />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Ownership Type</label>
                      <div className="space-y-2">
                        {([
                          { val: "citizen" as const, label: "Canadian Citizen" },
                          { val: "pr" as const, label: "Permanent Resident" },
                          { val: "other" as const, label: "Foreign Owner / Other" }
                        ]).map(({ val, label }) => (
                          <button key={val} onClick={() => setOwnership(val)} className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all border text-left ${ownership === val ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {label}
                            <span className="block text-xs opacity-70 mt-0.5">
                              {val === "other"
                                ? `${SVT_RATES[taxYear].high}% for the ${taxYear} tax year`
                                : `${SVT_RATES[taxYear].low}% for ${taxYear} if not exempt (${SVT_RATES[taxYear].high}% if an untaxed worldwide earner)`}
                            </span>
                          </button>
                        ))}
                      </div>
                      <label className="flex items-start gap-3 mt-3 cursor-pointer">
                        <input type="checkbox" checked={untaxedWorldwideEarner} onChange={(e) => setUntaxedWorldwideEarner(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-gold-500" />
                        <span className="text-sm text-gray-300">Untaxed worldwide earner / satellite family <span className="block text-xs text-gray-500">Less than 50% of household income reported on Canadian tax returns</span></span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tax Year (calendar year of use)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {TAX_YEARS.map((y) => (
                          <button key={y} onClick={() => setTaxYear(y)} className={`py-3 px-2 rounded-xl font-semibold text-sm transition-all border ${taxYear === y ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Occupancy Status</label>
                      <div className="space-y-2">
                        {([
                          { val: "principal" as const, label: "Principal Residence" },
                          { val: "rental" as const, label: "Long-Term Rental (6+ months of the year)" },
                          { val: "vacant" as const, label: "Vacant / Unoccupied" },
                          { val: "shortterm" as const, label: "Short-Term Rental (Airbnb)" }
                        ]).map(({ val, label }) => (
                          <button key={val} onClick={() => setOccupancy(val)} className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${occupancy === val ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {([
                          { val: "metro-van", label: "Metro Vancouver" },
                          { val: "capital", label: "Victoria / CRD" },
                          { val: "kelowna", label: "Kelowna / West Kelowna" },
                          { val: "other", label: "Other designated area" },
                          { val: "outside", label: "Outside SVT areas" }
                        ]).map(({ val, label }) => (
                          <button key={val} onClick={() => setRegion(val)} className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all border ${region === val ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Other designated areas include Abbotsford, Chilliwack, Mission, Kamloops, Nanaimo, Squamish, Vernon, Penticton, Courtenay, Comox and more — check the BC government&apos;s taxable-areas map.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
                {exempt ? (
                  <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-green-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-sm text-green-300 font-medium">You Are Likely Exempt</p>
                        <p className="text-2xl font-bold text-green-400">$0 / year</p>
                      </div>
                    </div>
                    <p className="text-sm text-green-200">{reason}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-gold-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold-500/30">
                      <p className="text-sm text-gold-300 font-medium mb-1">Estimated SVT</p>
                      <p className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2">{formatCurrency(taxAmount, 0)}/year</p>
                      <p className="text-sm text-gray-300">Effective rate: {taxRate}% of assessed value</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <span className="text-gray-400 block text-xs">Assessed Value</span>
                          <span className="font-semibold text-gray-200">{formatCurrency(assessedValue, 0)}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <span className="text-gray-400 block text-xs">SVT Rate</span>
                          <span className="font-semibold text-gold-400">{taxRate}%</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <span className="text-gray-400 block text-xs">Monthly Equivalent</span>
                          <span className="font-semibold text-gray-200">{formatCurrency(taxAmount / 12, 0)}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <span className="text-gray-400 block text-xs">Status</span>
                          <span className="font-semibold text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Not Exempt</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className={`rounded-2xl p-6 border ${exempt ? "bg-green-500/10 border-green-500/30" : "bg-blue-500/10 border-blue-500/30"}`}>
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`w-6 h-6 mt-0.5 flex-shrink-0 ${exempt ? "text-green-400" : "text-blue-400"}`} />
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${exempt ? "text-green-300" : "text-blue-300"}`}>{exempt ? "Exemption Details" : "Important Information"}</h3>
                      <div className="space-y-1 text-sm text-blue-200">
                        <p>• This calculator provides estimates only. Final SVT amounts are determined by the BC government.</p>
                        <p>• All property owners in SVT zones must file an annual declaration regardless of exemption status.</p>
                        <p>• The Empty Homes Tax in Vancouver is separate from the provincial SVT.</p>
                        <p>• Satellite family determination depends on income sources — consult a tax professional.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors text-center">Talk to a Broker</a>
                  <a href="tel:604-593-1550" className="flex-1 bg-white/10 border border-white/20 font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors text-center">Call 604-593-1550</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">Understanding BC&apos;s Speculation and Vacancy Tax</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>The BC Speculation and Vacancy Tax (SVT) is an annual tax introduced in 2018 by the provincial government to discourage housing speculation and encourage property owners to make their homes available to BC residents. It applies to residential properties in designated zones across British Columbia, primarily in high-demand urban areas where housing affordability has become a significant concern.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Who Pays and Who Is Exempt?</h3>
              <p>The vast majority of BC residents are exempt from the SVT. If you are a Canadian citizen or permanent resident who is a BC tax resident, own a home in a designated area and it is your principal residence, you owe nothing. Owners who rent the property to qualifying tenants for at least 6 months of the year are also exempt. Owners without an exemption pay a rate that depends on who they are: for the 2026 tax year, 3% for foreign owners and untaxed worldwide earners (including satellite families) and 1% for other Canadian citizens and permanent residents. Those rates were 2% and 0.5% through 2025, and the higher rate rises to 4% for 2027.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Designated Areas</h3>
              <p>The SVT applies in Metro Vancouver, the Capital Regional District (Greater Victoria), and designated municipalities including Abbotsford, Chilliwack, Mission, Kelowna, West Kelowna, Lake Country, Peachland, Kamloops, Vernon, Penticton, Summerland, Salmon Arm, Squamish, Nanaimo, Lantzville, Parksville, Qualicum Beach, Courtenay, Comox, Cumberland, Duncan, North Cowichan, Ladysmith and Lake Cowichan. If your property is outside these areas, you are not subject to the SVT. However, some municipalities have their own vacancy taxes (like Vancouver&apos;s Empty Homes Tax), which are separate from the provincial SVT.</p>

              <h3 className="text-2xl font-semibold text-gray-100 mt-8">Declaration and Deadlines</h3>
              <p>Every residential property owner in an SVT-designated area must complete an annual declaration. The BC government mails declaration packages in January and February each year, and you can also complete the declaration online. The typical deadline is March 31. Even if you are exempt, you must still file. If you don&apos;t declare, your property is assessed at the highest rate until you complete the declaration.</p>

              <div className="mt-8">
                <Link href="/calculators/closing-costs" className="text-gold-400 hover:text-gold-300 underline">Closing Costs Calculator</Link>
                {" · "}
                <Link href="/calculators/payment" className="text-gold-400 hover:text-gold-300 underline">Payment Calculator</Link>
                {" · "}
                <Link href="/calculators/land-transfer-tax" className="text-gold-400 hover:text-gold-300 underline">Land Transfer Tax Calculator</Link>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{faq.a}</motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <ComplianceBanner feature="LEAD_FORM" />
        <RelatedCalculators current="bc-speculation-tax" related={["affordability","land-transfer-tax","closing-costs"]} />
      </main>
    </>
  );
}
