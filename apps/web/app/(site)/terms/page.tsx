import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Scale,
  Shield,
  FileText,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Gavel,
  BadgeAlert,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Kraft Mortgages Canada Inc.",
  description:
    "Terms of service and legal conditions for mortgage brokerage advisory services provided by Kraft Mortgages Canada Inc. across British Columbia, Alberta, and Ontario.",
  alternates: {
    canonical: "https://www.kraftmortgages.ca/terms",
  },
  openGraph: {
    title: "Terms of Service | Kraft Mortgages Canada Inc.",
    description:
      "Review the legal terms, disclaimers, user responsibilities, and regulatory framework governing Kraft Mortgages Canada Inc.",
    url: "https://www.kraftmortgages.ca/terms",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 8, 2026";

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
        {/* Breadcrumb Header */}
        <div className="border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Link href="/" className="hover:text-gold-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-gold-400 font-medium">Terms of Service</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-14 sm:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-6">
              <Scale className="w-3.5 h-3.5" />
              <span>Legal & Regulatory Framework</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5">
              Terms of <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              These Terms of Service govern your access to and use of the website, financial calculators, rate intelligence tools, and professional mortgage brokerage services provided by <strong>Kraft Mortgages Canada Inc.</strong>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Effective Date: {lastUpdated}
              </span>
              <span className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md">
                Jurisdiction: British Columbia, Canada
              </span>
            </div>
          </div>
        </section>

        {/* Main Content Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
            
            {/* Table of Contents Sticky Sidebar */}
            <aside className="hidden lg:block sticky top-28 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="font-mono text-xs uppercase tracking-wider text-gold-400 font-bold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Table of Contents
              </div>
              <ul className="space-y-2 text-xs text-slate-400 font-sans">
                <li><a href="#acceptance" className="hover:text-gold-300 transition-colors block py-1">1. Acceptance & Identity</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors block py-1">2. Brokerage Services Scope</a></li>
                <li><a href="#no-guarantee" className="hover:text-gold-300 transition-colors block py-1">3. No Guarantee of Approval/Rates</a></li>
                <li><a href="#user-responsibilities" className="hover:text-gold-300 transition-colors block py-1">4. User Responsibilities & Truth</a></li>
                <li><a href="#fees" className="hover:text-gold-300 transition-colors block py-1">5. Compensation & Service Agreements</a></li>
                <li><a href="#calculators" className="hover:text-gold-300 transition-colors block py-1">6. Calculators & AI Disclaimers</a></li>
                <li><a href="#liability" className="hover:text-gold-300 transition-colors block py-1">7. Limitation of Liability</a></li>
                <li><a href="#intellectual-property" className="hover:text-gold-300 transition-colors block py-1">8. Intellectual Property</a></li>
                <li><a href="#governing-law" className="hover:text-gold-300 transition-colors block py-1">9. Governing Law (BC, Canada)</a></li>
                <li><a href="#contact" className="hover:text-gold-300 transition-colors block py-1">10. Contact Information</a></li>
              </ul>
              <div className="mt-6 pt-5 border-t border-slate-800">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>View Privacy Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>

            {/* Document Content */}
            <article className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
              
              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Acceptance of Terms & Brokerage Identification
                  </h2>
                </div>
                <p className="mb-4">
                  By accessing, browsing, or utilizing the website located at <strong>kraftmortgages.ca</strong> (the &ldquo;Site&rdquo;), submitting an inquiry, utilizing our mortgage calculators, or engaging with our digital assistants and deal desk, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <p className="mb-4">
                  The Site is operated by <strong>Kraft Mortgages Canada Inc.</strong> (&ldquo;Kraft Mortgages&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a duly registered Canadian mortgage brokerage operating under the following regulatory licenses:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">British Columbia</div>
                    <div className="text-slate-300">BCFSA License #SR220230</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">Ontario</div>
                    <div className="text-slate-300">FSRA License #12918</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">Alberta</div>
                    <div className="text-slate-300">RECA License #LIC-00655428</div>
                  </div>
                </div>
                <p>
                  If you do not agree with any part of these Terms of Service, you must discontinue your use of our Site and services immediately.
                </p>
              </section>

              {/* Section 2 */}
              <section id="services" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Scope of Mortgage Brokerage Services
                  </h2>
                </div>
                <p className="mb-4">
                  Kraft Mortgages acts as an independent mortgage brokerage and financial intermediary between prospective borrowers and participating institutional and private lenders across Canada. Our professional services include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Residential Mortgages:</strong> Prime A-lender purchases, pre-approvals, refinances, renewals, and equity take-outs.</li>
                  <li><strong>Alternative & Self-Employed (BFS):</strong> Stated income and alternative documentation programs through regulated B-lenders (including Home Trust, Equitable Bank, and Haventree Bank).</li>
                  <li><strong>Commercial & Construction Financing:</strong> Commercial acquisition, land development, construction draw facilities, and mezzanine debt.</li>
                  <li><strong>CMHC MLI Select:</strong> Multi-unit residential financing underwriting (up to 50-year amortizations and 95% LTV).</li>
                  <li><strong>Private & Equity Lending:</strong> Short-term bridge loans, second mortgages, and asset-based equity facilities.</li>
                </ul>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-gold-400 block mb-1">Intermediary Classification:</strong>
                  Kraft Mortgages Canada Inc. functions as a broker and advisor, not an end lending institution, unless explicitly disclosed in writing under a designated private syndicate arrangement. All underwriting approvals, commitment contracts, and loan advances are issued directly by the participating lender.
                </div>
              </section>

              {/* Section 3 */}
              <section id="no-guarantee" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    No Guarantee of Approval, Interest Rates, or Loan Terms
                  </h2>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 mb-5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-2 text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    Crucial Lending & Rate Disclaimers (On Approved Credit - O.A.C.)
                  </div>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    All mortgage applications, rate quotes, and financing structures are strictly subject to individual credit qualification, property appraisal, debt-service ratio verification (GDS/TDS), and final underwriting approval by our partner lenders.
                  </p>
                </div>
                <p className="mb-4">
                  You expressly understand and acknowledge that:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Rate Volatility:</strong> Interest rates posted on this Site, rate tickers, blog posts, or provided via our digital voice assistants (Julia) represent current market benchmark estimates. Rates fluctuate in accordance with Bank of Canada policy rate announcements, Government of Canada bond yields, and individual lender rate changes. Published rates do not constitute a formal rate hold or guaranteed offer.
                  </li>
                  <li>
                    <strong>Lender Underwriting Discretion:</strong> The issuance of a pre-qualification estimate or pre-approval certificate does not guarantee funding. Final loan approval requires satisfactory property appraisal, legal title verification, and satisfaction of all lender subject conditions prior to closing.
                  </li>
                  <li>
                    <strong>No Fiduciary Warranty on Market Movements:</strong> Kraft Mortgages is not responsible for shifts in market interest rates or lender product withdrawals that occur between the time of your initial inquiry and the formal execution of a lender commitment.
                  </li>
                </ol>
              </section>

              {/* Section 4 */}
              <section id="user-responsibilities" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    User Responsibilities & Truth in Applications
                  </h2>
                </div>
                <p className="mb-4">
                  When submitting an inquiry, completing an online application (via Finmo or our Site), or transmitting documents to Kraft Mortgages, you warrant and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Complete Accuracy:</strong> All personal, employment, tax, asset, liability, and property information provided by you is truthful, accurate, complete, and up to date.</li>
                  <li><strong>Prohibition of Fraud:</strong> You will not submit forged, falsified, altered, or misleading documentation (such as falsified pay stubs, bank statements, or tax assessments). Doing so constitutes criminal mortgage fraud under the <em>Criminal Code of Canada</em> and will result in immediate termination of services and mandatory reporting to law enforcement and regulatory authorities.</li>
                  <li><strong>Notification of Material Changes:</strong> You agree to notify Kraft Mortgages immediately if your employment status, income, debt obligations, or credit standing changes prior to the funding date of your mortgage.</li>
                  <li><strong>Independent Legal Advice (ILA):</strong> You acknowledge that real estate and mortgage transactions carry significant legal and financial implications. You are responsible for retaining an independent real estate lawyer or notary public to review all closing documents and represent you during closing.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="fees" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Broker Compensation & Written Service Agreements
                  </h2>
                </div>
                <p className="mb-4">
                  In accordance with regulatory mandates issued by the British Columbia Financial Services Authority (BCFSA), the Real Estate Council of Alberta (RECA), and the Financial Services Regulatory Authority of Ontario (FSRA):
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Institutional Compensation:</strong> For standard residential prime A-lender mortgages, Kraft Mortgages is compensated directly by the lender via a referral commission upon successful funding. You pay no direct broker fee for these standard transactions.</li>
                  <li><strong>Alternative & Private Broker Fees:</strong> For specialized B-lender, private equity, commercial, or distressed debt solutions, a broker fee and/or lender commitment fee may apply. Any such fee will be fully and explicitly disclosed in writing on your <em>Written Service Agreement</em> and <em>Borrower Disclosure Statement</em> before submission or commitment.</li>
                  <li><strong>No Client Trust Funds Held:</strong> Kraft Mortgages adheres strictly to a policy of holding no client trust monies. All deposit funds, down payments, and mortgage advances flow directly through regulated solicitors, notaries public, or escrow trust accounts.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="calculators" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Website Calculators & AI Intelligence Disclaimers
                  </h2>
                </div>
                <p className="mb-4">
                  All interactive calculators (including mortgage payment, affordability, renewal, penalty, MLI Select, and commercial debt yield calculators) and AI conversational tools (including Julia / Thinkrr WebRTC) provided on this Site are intended solely for general illustrative, educational, and informational purposes.
                </p>
                <p className="mb-4">
                  Calculator outputs do not constitute a formal pre-approval, binding commitment, or appraisal of your borrowing capacity. Mathematical calculations are based on user inputs and standard amortization formulas and do not account for all ancillary costs (such as British Columbia Property Transfer Tax, municipal taxes, strata dues, or mortgage default insurance surcharges).
                </p>
              </section>

              {/* Section 7 */}
              <section id="liability" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Limitation of Liability & Disclaimer of Advice
                  </h2>
                </div>
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE CANADIAN LAW, KRAFT MORTGAGES CANADA INC., ITS PRINCIPAL BROKER, LICENSED MORTGAGE PROFESSIONALS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER ARISING OUT OF OR IN CONNECTION WITH:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Your access to, use of, or inability to access the Site or online tools;</li>
                  <li>Any inaccuracies, delays, errors, or omissions in rate benchmarking data;</li>
                  <li>Any underwriting decision, decline, processing delay, or condition imposed by a third-party lender;</li>
                  <li>Any technical malfunction, server interruption, transmission failure, or unauthorized data breach beyond our reasonable control.</li>
                </ul>
                <p>
                  <strong>No Legal or Tax Advice:</strong> Information published on this Site does not constitute legal, accounting, tax, or investment advice. You should consult a qualified Chartered Professional Accountant (CPA) or real estate attorney regarding your specific financial situation.
                </p>
              </section>

              {/* Section 8 */}
              <section id="intellectual-property" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Intellectual Property Rights
                  </h2>
                </div>
                <p className="mb-4">
                  All text, logos, designs, calculator algorithms, graphics, software, and audiovisual materials contained on this Site are the proprietary intellectual property of <strong>Kraft Mortgages Canada Inc.</strong> or its licensors, protected under Canadian and international copyright and trademark laws.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable license to access and view Site content for personal, non-commercial purposes. You may not copy, republish, scrape, reverse-engineer, or commercially exploit any material from this Site without our prior written consent.
                </p>
              </section>

              {/* Section 9 */}
              <section id="governing-law" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Governing Law & Jurisdiction
                  </h2>
                </div>
                <p className="mb-4">
                  These Terms of Service and any disputes arising out of or related to your use of the Site or our brokerage services shall be governed by, construed, and enforced in accordance with the laws of the <strong>Province of British Columbia</strong> and the federal laws of <strong>Canada</strong> applicable therein, without giving effect to conflict of law principles.
                </p>
                <p>
                  You irrevocably submit to the exclusive jurisdiction of the courts of British Columbia, located in the City of Vancouver or Surrey, to resolve any legal proceeding or dispute arising under these Terms.
                </p>
              </section>

              {/* Section 10 */}
              <section id="contact" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono text-xs font-bold">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Contact & Regulatory Inquiries
                  </h2>
                </div>
                <p className="mb-5">
                  If you have questions, feedback, or require clarification regarding these Terms of Service, please contact our executive brokerage office directly:
                </p>
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 grid sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div>
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold-400" />
                      Kraft Mortgages Canada Inc.
                    </h3>
                    <p className="text-slate-400 mb-1">Head Office: Suite 202 - 12725 80 Avenue, Surrey, BC V3W 3A6</p>
                    <p className="text-slate-400">Dealing Office: #301 - 1688 152nd Street, Surrey, BC V4A 4N2</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-400" />
                      Contact Channels
                    </h3>
                    <p className="text-slate-400 mb-1">Office Telephone: <a href="tel:604-593-1550" className="text-slate-200 hover:text-gold-400">604-593-1550</a></p>
                    <p className="text-slate-400 mb-1">Direct Mobile: <a href="tel:604-727-1579" className="text-slate-200 hover:text-gold-400">604-727-1579</a></p>
                    <p className="text-slate-400">Compliance Email: <a href="mailto:varun@kraftmortgages.ca" className="text-slate-200 hover:text-gold-400">varun@kraftmortgages.ca</a></p>
                  </div>
                </div>
              </section>

            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}