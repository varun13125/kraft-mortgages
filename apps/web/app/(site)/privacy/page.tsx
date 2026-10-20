
import { BUSINESS } from "@/lib/seo/business-config";
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { OG_DEFAULTS } from "@/lib/seo/og";
import {
  Shield,
  Lock,
  FileCheck,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
  Database,
  UserCheck,
  Scale,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Kraft Mortgages Canada Inc.",
  description:
    "Privacy policy and client data protection practices of Kraft Mortgages Canada Inc. under Canadian PIPEDA, British Columbia PIPA, and FINTRAC regulatory frameworks.",
  alternates: {
    canonical: "https://www.kraftmortgages.ca/privacy",
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Privacy Policy | Kraft Mortgages Canada Inc.",
    description:
      "Learn how Kraft Mortgages Canada Inc. collects, safeguards, and processes personal and financial information under Canadian privacy laws.",
    url: "https://www.kraftmortgages.ca/privacy",
  },
};

/*
 * Service providers that receive personal information through this website.
 * This list was rebuilt on 2026-10-13 from what the code actually does (see
 * DEVLOG/audit-2026-10/round2-frontend.md, BUG-015). It is a factual disclosure
 * draft and REQUIRES LEGAL REVIEW before it is relied on. When an integration is
 * added or removed, update this list in the same change.
 */
const SERVICE_PROVIDERS: { name: string; purpose: string; data: string }[] = [
  {
    name: "Vercel Inc.",
    purpose: "Hosts this website and provides privacy-friendly page analytics (Vercel Analytics).",
    data: "Every request to the site, including form submissions in transit; IP address, device and browser details.",
  },
  {
    name: "Google (Firebase / Google Cloud Firestore)",
    purpose: "Database for website enquiries, business-funding applications and backup copies of leads.",
    data: "The contact and enquiry details you submit through our forms.",
  },
  {
    name: "Twenty CRM and our integration receiver (hosted on our Hostinger VPS)",
    purpose: "Our client relationship management system and the automation that routes new enquiries into it.",
    data: "Contact details and enquiry details you submit for team follow-up, and call outcomes.",
  },
  {
    name: "Discord Inc.",
    purpose: "Internal alerts that tell our team a new enquiry has arrived.",
    data: "Name, email, phone number, enquiry details and, for chat or call leads, a summary of the conversation.",
  },
  {
    name: "Finmo",
    purpose: "Secure online mortgage application portal (the “Apply Now” links).",
    data: "Your full mortgage application and supporting documents.",
  },
  {
    name: "OpenRouter, Inc.",
    purpose: "Sends website chat messages to the AI model that writes the assistant’s reply. OpenRouter passes each request to a third-party model provider.",
    data: "Your chat messages and recent conversation context.",
  },
  {
    name: "Google (Gemini API) and NVIDIA (NVIDIA API)",
    purpose: "Back-up AI models for the website chat assistant when the primary model is unavailable.",
    data: "Your chat messages and recent conversation context.",
  },
  {
    name: "ElevenLabs",
    purpose: "Text-to-speech: reads the chat assistant’s replies aloud when you turn voice on.",
    data: "The text of the assistant’s replies.",
  },
  {
    name: "Thinkrr",
    purpose: "The website voice assistant (“Julia”), and automated AI phone calls to people who submit a Facebook or Instagram lead form.",
    data: "Voice audio, call recordings and transcripts, your name and phone number.",
  },
  {
    name: "Vapi",
    purpose: "Automated AI phone call (“Julia”) placed after you submit our contact or pre-qualification form during calling hours.",
    data: "Your name, phone number, email, mortgage type and requested amount, and the call audio and transcript.",
  },
  {
    name: "Twilio Inc.",
    purpose: "Our automated phone line and voicemail. Voicemail messages are recorded (you are told before recording starts).",
    data: "Your phone number, call details and voicemail recording.",
  },
  {
    name: "OpenAI",
    purpose: "Transcribes voicemail recordings to text (Whisper speech-to-text).",
    data: "Voicemail audio.",
  },
  {
    name: "Meta Platforms (Facebook / Instagram Lead Ads)",
    purpose: "If you fill in a lead form inside one of our Facebook or Instagram ads, Meta sends us your answers.",
    data: "The answers you gave in the ad form.",
  },
  {
    name: "Google Analytics and Segment (only when enabled)",
    purpose: "Website usage analytics.",
    data: "Pages visited, device and browser details, and cookie identifiers.",
  },
];

export default function PrivacyPolicyPage() {
  // Last substantive revision: processor and data-flow disclosure (BUG-015).
  const lastUpdated = "October 13, 2026";
  const lastUpdatedIso = "2026-10-13";

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
        {/* Breadcrumb Header */}
        <div className="border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Link href="/" className="hover:text-gold-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-gold-400 font-medium">Privacy Policy</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-14 sm:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>Canadian PIPEDA & BC PIPA Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5">
              Privacy <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              At <strong>Kraft Mortgages Canada Inc.</strong>, protecting the confidentiality, integrity, and security of your personal and financial information is our highest professional duty. This Privacy Policy outlines how we collect, use, share, and protect your information.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Last Updated: <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
              </span>
              <span className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md">
                Governing Legislation: PIPEDA / BC PIPA / PCMLTFA (FINTRAC)
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
                <FileCheck className="w-4 h-4" />
                Privacy Topics
              </div>
              <ul className="space-y-2 text-xs text-slate-400 font-sans">
                <li><a href="#overview" className="hover:text-gold-300 transition-colors block py-1">1. Commitment & Scope</a></li>
                <li><a href="#collection" className="hover:text-gold-300 transition-colors block py-1">2. Information We Collect</a></li>
                <li><a href="#purposes" className="hover:text-gold-300 transition-colors block py-1">3. How Information is Used</a></li>
                <li><a href="#sharing" className="hover:text-gold-300 transition-colors block py-1">4. How & With Whom We Share</a></li>
                <li><a href="#service-providers" className="hover:text-gold-300 transition-colors block py-1 pl-3">Service Providers</a></li>
                <li><a href="#cross-border" className="hover:text-gold-300 transition-colors block py-1 pl-3">Processing Outside Canada</a></li>
                <li><a href="#consent" className="hover:text-gold-300 transition-colors block py-1">5. Consent & Withdrawal</a></li>
                <li><a href="#retention" className="hover:text-gold-300 transition-colors block py-1">6. Data Retention (7 Years)</a></li>
                <li><a href="#security" className="hover:text-gold-300 transition-colors block py-1">7. Security Safeguards</a></li>
                <li><a href="#rights" className="hover:text-gold-300 transition-colors block py-1">8. Your Rights Under Law</a></li>
                <li><a href="#digital" className="hover:text-gold-300 transition-colors block py-1">9. Cookies, Storage & AI Tools</a></li>
                <li><a href="#privacy-officer" className="hover:text-gold-300 transition-colors block py-1">10. Privacy Officer Contact</a></li>
              </ul>
              <div className="mt-6 pt-5 border-t border-slate-800">
                <Link
                  href="/terms"
                  className="flex items-center justify-between text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>View Terms of Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>

            {/* Document Content */}
            <article className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
              
              {/* Section 1 */}
              <section id="overview" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Our Commitment to Privacy & Legal Scope
                  </h2>
                </div>
                <p className="mb-4">
                  <strong>Kraft Mortgages Canada Inc.</strong> (&ldquo;Kraft Mortgages&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a licensed Canadian mortgage brokerage operating in British Columbia (BCFSA #SR220230), Ontario (FSRA #12918), and Alberta (RECA #LIC-00655428).
                </p>
                <p className="mb-4">
                  We collect, hold, use, and disclose personal and financial information in strict adherence to Canadian federal and provincial privacy legislation, including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">Federal (Canada)</div>
                    <div className="text-slate-300">PIPEDA (Personal Information Protection and Electronic Documents Act)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">British Columbia</div>
                    <div className="text-slate-300">BC PIPA (Personal Information Protection Act)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">Anti-Money Laundering (AML)</div>
                    <div className="text-slate-300">PCMLTFA / FINTRAC Client Verification Standards</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-gold-400 font-bold mb-1">Alberta & Ontario</div>
                    <div className="text-slate-300">Alberta PIPA & Ontario FSRA Compliance Regulations</div>
                  </div>
                </div>
                <p>
                  This policy applies to all prospective, current, and former clients who submit mortgage applications, request rate quotes, or interact with our staff, our website forms, our online intake portal (Finmo), our website chat and voice assistants, or our automated phone calls.
                </p>
              </section>

              {/* Section 2 */}
              <section id="collection" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Personal and Financial Information We Collect
                  </h2>
                </div>
                <p className="mb-4">
                  Due to the nature of mortgage underwriting and federal lending guidelines (OSFI B-20), we collect comprehensive personal and financial information directly from you and authorized third parties:
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">1. Identification & Contact Details</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Full legal name, alias, date of birth, current residential address, previous residential history (minimum 3 years), phone numbers, email addresses, and citizenship/residency status.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">2. Government Photo ID & Verification Records</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Driver&apos;s license, Canadian passport, permanent resident card, or provincial photo ID card as mandated under the <em>Proceeds of Crime (Money Laundering) and Terrorist Financing Act</em> (PCMLTFA) to verify identity and mitigate fraud.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">3. Financial, Income & Employment Records</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Employer names, job titles, tenure, pay stubs, letters of employment, T4 tax slips, Canada Revenue Agency (CRA) Notices of Assessment (NOAs), bank account statements, and business financial statements / T2 corporate tax returns for self-employed (BFS) borrowers.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">4. Credit Bureau Reports & History</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Credit scores, credit card balances, automotive loans, lines of credit, collections, consumer proposals, or bankruptcy histories obtained from <strong>Equifax Canada</strong> and <strong>TransUnion Canada</strong> upon your express consent.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">5. Social Insurance Number (SIN)</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Providing your SIN is strictly <strong>optional</strong>. If provided with your consent, it is utilized solely to ensure accurate credit bureau matching and avoid file confusion with individuals having similar names and dates of birth.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">6. Property & Real Estate Documentation</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Contracts of purchase and sale, property tax assessments, municipal notices, current mortgage payout statements, MLS listings, independent appraisals, and lease agreements/rent rolls for multi-unit properties.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">7. Information You Give Us Through This Website, Chat, and Calls</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      What you enter in our contact, pre-qualification, business-funding and report forms (for example name, email, phone number, mortgage goal, property value, loan amount, an estimated credit range and employment type); the messages you type to our chat assistant; what you say to our voice assistant or on an automated call, including recordings and transcripts; voicemail messages; and the answers you give in our Facebook or Instagram ad forms.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <h3 className="font-bold text-white text-sm mb-1 text-gold-400">8. Technical Information</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      IP address (used to protect our forms and AI tools from abuse), device and browser type, pages visited, and the advertising campaign that brought you to the site (UTM parameters).
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="purposes" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Purposes for Collecting and Using Your Information
                  </h2>
                </div>
                <p className="mb-4">
                  Kraft Mortgages collects and processes your personal information solely for legitimate, reasonable business purposes associated with mortgage brokering:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Underwriting & Affordability Analysis:</strong> Calculating borrowing capacity, GDS/TDS debt service ratios, and compliance with the OSFI B-20 mortgage stress test.</li>
                  <li><strong>Lender Packaging & Submission:</strong> Compiling and submitting formal mortgage applications to chartered banks, credit unions, monoline lenders, alternative B-lenders, or private investors.</li>
                  <li><strong>Mortgage Default Insurance:</strong> Applying for high-ratio mortgage default insurance with CMHC, Sagen, or Canada Guaranty for loans with less than 20% down payment.</li>
                  <li><strong>FINTRAC & Legal Compliance:</strong> Fulfilling mandatory Canadian anti-money laundering client identification and record-keeping regulations.</li>
                  <li><strong>Client Advisory & Ongoing Service:</strong> Providing status updates during the mortgage application process, advising on maturity dates, renewal options, and refinancing strategies.</li>
                  <li><strong>Responding to Website Enquiries:</strong> Recording your enquiry in our CRM, alerting our team, and calling you back, including the automated AI call described in Section 9 when you submit a form during calling hours.</li>
                  <li><strong>Website Chat and Voice Assistants:</strong> Generating answers to your questions and, if you share contact details in the chat, passing them to our team so a broker can follow up.</li>
                  <li><strong>Security and Site Improvement:</strong> Preventing spam and abuse of our forms and AI tools, and understanding how the site is used.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="sharing" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    How and With Whom We Share Your Information
                  </h2>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-gold-500/30 mb-5">
                  <strong className="text-gold-400 block mb-1">Our Strict No-Sale Commitment:</strong>
                  Kraft Mortgages Canada Inc. <strong>never sells, rents, leases, or trades</strong> your personal, credit, or financial information to third-party marketing companies, lead brokers, or external advertising networks.
                </div>
                <p className="mb-4">
                  Your information is shared strictly on a confidential need-to-know basis with:
                </p>
                <ol className="list-decimal pl-6 space-y-3 mb-4">
                  <li>
                    <strong>Prospective Lenders:</strong> Regulated Schedule I & II Canadian banks, credit unions, trust companies, mortgage investment corporations (MICs), and private lending partners who evaluate your loan file.
                  </li>
                  <li>
                    <strong>Mortgage Default Insurers:</strong> Canada Mortgage and Housing Corporation (CMHC), Sagen Financial Corporation, and Canada Guaranty Mortgage Insurance Company.
                  </li>
                  <li>
                    <strong>Credit Reporting Agencies:</strong> Equifax Canada and TransUnion Canada to conduct credit inquiries as authorized by your signed credit consent.
                  </li>
                  <li>
                    <strong>Closing & Legal Professionals:</strong> Your retained real estate lawyer or notary public, certified property appraisers, and title insurance companies (e.g., FCT, Stewart Title).
                  </li>
                  <li>
                    <strong>Regulatory & Law Enforcement Bodies:</strong> BCFSA, RECA, FSRA, FINTRAC, or judicial bodies when compelled by law, court order, or official statutory inquiry.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Technology companies that run parts of our website, phone systems, and client records on our behalf, listed below. They may use your information only to provide their service to us.
                  </li>
                </ol>

                <h3 id="service-providers" className="scroll-mt-28 text-lg font-bold text-white mt-8 mb-3">
                  Service Providers That Process Information for Us
                </h3>
                <p className="mb-4">
                  These are the outside services that receive personal information through our website, chat assistant, voice assistant, automated calls, and lead handling:
                </p>
                <ul className="space-y-3 mb-6">
                  {SERVICE_PROVIDERS.map((p) => (
                    <li key={p.name} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="font-bold text-white text-sm mb-1">{p.name}</div>
                      <p className="text-xs sm:text-sm text-slate-300 mb-1">{p.purpose}</p>
                      <p className="text-xs sm:text-sm text-slate-400">
                        <span className="text-slate-300 font-medium">Information involved:</span> {p.data}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mb-4 text-sm text-slate-400">
                  We may also use AI services (such as OpenAI or Anthropic) internally to help draft general website articles. Those drafting tools are not given the details of your enquiry, chat, or calls.
                </p>

                <h3 id="cross-border" className="scroll-mt-28 text-lg font-bold text-white mt-8 mb-3">
                  Processing Outside Canada
                </h3>
                <p className="mb-4">
                  Most of the service providers listed above are based in, or store data in, the <strong>United States</strong>, and some (for example, the AI model providers that OpenRouter forwards chat messages to) may process data in other countries. While your information is outside Canada it is subject to the laws of that country and may be accessible to its courts, law enforcement, and national security authorities. If you would rather not have your information processed this way, please call or email us instead of using the chat, voice assistant, or online forms.
                </p>
              </section>

              {/* Section 5 */}
              <section id="consent" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Client Consent & Your Right to Withdraw
                  </h2>
                </div>
                <p className="mb-4">
                  We collect your information based on express written consent obtained through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Written Service Agreements (mandated by provincial frameworks such as RECA);</li>
                  <li>Finmo secure digital mortgage application intake portals;</li>
                  <li>Signed Credit Bureau Authorization forms;</li>
                  <li>The optional consent checkboxes on our website forms: one for an automated AI phone call about your enquiry, and one for marketing emails and text messages (mortgage tips, rate updates and offers). Both are unticked unless you tick them, and we keep a record of your choices.</li>
                </ul>
                <p className="mb-4">
                  Submitting a website form lets us respond to that enquiry. We send marketing messages only if you ticked the marketing box, and you can unsubscribe at any time by replying STOP, using the unsubscribe link, or contacting us.
                </p>
                <p className="mb-4">
                  <strong>Withdrawing Consent:</strong> You have the legal right under PIPEDA and BC PIPA to withdraw your consent to our collection, use, or disclosure of your personal information at any time, subject to legal or contractual restrictions.
                </p>
                <p className="text-xs text-slate-400">
                  <em>Note: Withdrawing consent during an active mortgage application will impede our ability to obtain lender approval and may result in the termination of the underwriting process.</em>
                </p>
              </section>

              {/* Section 6 */}
              <section id="retention" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Data Retention Mandates (Seven-Year Statutory Period)
                  </h2>
                </div>
                <p className="mb-4">
                  As a regulated financial entity in British Columbia, Alberta, and Ontario, Kraft Mortgages Canada Inc. is legally required by provincial mortgage brokerage regulators (BCFSA, RECA, FSRA) and federal anti-money laundering legislation (FINTRAC) to retain complete client files, credit reports, and transaction records for a minimum statutory period of:
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono my-4">
                  <span className="text-2xl font-extrabold text-gold-400">Seven (7) Years</span>
                  <span className="block text-xs text-slate-400 mt-1">from the date of file funding, completion, or decline</span>
                </div>
                <p>
                  Upon expiration of the mandatory regulatory retention period, all physical records are shredded via certified secure document destruction services, and electronic data is permanently deleted using cryptographic erasure standards.
                </p>
              </section>

              {/* Section 7 */}
              <section id="security" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Security Safeguards & Digital Vaulting
                  </h2>
                </div>
                <p className="mb-4">
                  We employ rigorous physical, technological, and administrative safeguards designed to protect sensitive financial records against loss, theft, unauthorized access, copying, disclosure, or alteration:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 my-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Lock className="w-4 h-4 text-emerald-400 mb-2" />
                    <div className="text-white font-bold mb-1">In-Transit Encryption</div>
                    <div className="text-slate-400">End-to-end TLS 1.3 cryptographic transport protocols.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Database className="w-4 h-4 text-emerald-400 mb-2" />
                    <div className="text-white font-bold mb-1">At-Rest Vaulting</div>
                    <div className="text-slate-400">AES-256 cloud encryption with multi-factor authentication (MFA).</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Building2 className="w-4 h-4 text-emerald-400 mb-2" />
                    <div className="text-white font-bold mb-1">Physical Security</div>
                    <div className="text-slate-400">Locked, fire-rated physical archives at our Surrey, BC head office.</div>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="rights" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Your Rights Under Canadian Privacy Law (PIPEDA / BC PIPA)
                  </h2>
                </div>
                <p className="mb-4">
                  As an individual residing in British Columbia or Canada, you possess statutory privacy rights:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Right to Access:</strong> You may submit a written request to inspect or receive a copy of your personal records held in our brokerage files.</li>
                  <li><strong>Right to Correction:</strong> If you believe any personal or financial information held by us is inaccurate, out of date, or incomplete, you may request that it be corrected or updated.</li>
                  <li><strong>Right to Inquire:</strong> You have the right to be informed about how your information has been used and to which lenders or parties it has been disclosed.</li>
                </ul>
                <p>
                  We will respond to all verified access and correction requests within thirty (30) business days, in accordance with Section 30 of the British Columbia <em>Personal Information Protection Act</em>.
                </p>
              </section>

              {/* Section 9 */}
              <section id="digital" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Cookies, Browser Storage, Analytics, & AI Tools
                  </h2>
                </div>
                <p className="mb-4">
                  <strong>Analytics:</strong> We use Vercel Analytics, which reports aggregated page-view statistics. If we turn on Google Analytics or Segment, those services set cookies and receive the pages you visit and your device and browser details.
                </p>
                <p className="mb-4">
                  <strong>Storage on your device:</strong> The site saves a few items in your browser&apos;s local storage: your chat conversation (so it is still there if you reload the page; it is deleted automatically 30 days after your last message, and you can delete it at any time with the chat&apos;s &ldquo;Clear chat&rdquo; button), your province and language preferences, and a random identifier for this browser. This information stays on your device unless you send it to us.
                </p>
                <p className="mb-4">
                  <strong>AI chat assistant:</strong> The chat assistant is an AI, not a person. The messages you type are sent to the AI model providers listed in Section 4 (OpenRouter, and Google Gemini or NVIDIA as back-ups) to generate replies. If you include an email address or phone number in the chat, it is sent to our CRM and to our team&apos;s lead alert so a broker can contact you. We keep a short, temporary log of recent chat questions on our server, with email addresses and phone numbers removed, to check the quality of the answers; it is cleared when the server restarts. Please do not enter your SIN, banking details, or passwords in the chat.
                </p>
                <p className="mb-4">
                  <strong>Voice features:</strong> If you turn on voice in the chat, the assistant&apos;s replies are converted to speech by ElevenLabs, and your spoken questions are converted to text by your web browser&apos;s built-in speech recognition (some browsers, such as Google Chrome, send the audio to their own servers for this). Our website voice assistant, Julia, is provided by Thinkrr; conversations with it are recorded and transcribed, and you are told this before the call connects.
                </p>
                <p className="mb-4">
                  <strong>Automated phone calls:</strong> If you tick &ldquo;Yes, call me now&rdquo; on our contact or pre-qualification form, an AI voice assistant (Julia, provided by Vapi) may call the phone number you gave us to confirm your details; we do not place this call if the box is left unticked. If you submit outside our calling hours, the call waits until calling hours resume. People who submit a lead form in one of our Facebook or Instagram ads may receive a similar AI call provided by Thinkrr. These calls may be recorded and transcribed, and a summary may be added to your enquiry in our CRM. You can ask us at any time to stop calling you.
                </p>
                <p className="mb-4">
                  <strong>Voicemail:</strong> Calls to our automated line can leave a voicemail. Twilio records the message (you are told before recording starts) and OpenAI&apos;s Whisper service converts it to text so our team can respond.
                </p>
              </section>

              {/* Section 10 */}
              <section id="privacy-officer" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Privacy Officer & Regulatory Contact Information
                  </h2>
                </div>
                <p className="mb-5">
                  If you have questions, concerns, or wish to exercise your rights under Canadian privacy legislation, please contact our designated Privacy Officer:
                </p>
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 grid sm:grid-cols-2 gap-6 text-xs sm:text-sm mb-6">
                  <div>
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      Designated Privacy Officer
                    </h3>
                    <p className="text-slate-300 font-semibold mb-1">{BUSINESS.principalBroker} — Principal Broker</p>
                    <p className="text-slate-400 mb-1">Kraft Mortgages Canada Inc.</p>
                    <p className="text-slate-400">Head Office: Suite 202 - 12725 80 Avenue, Surrey, BC V3W 3A6</p>
                    <p className="text-slate-400">Dealing Office: #301 - 1688 152nd Street, Surrey, BC V4A 4N2</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      Direct Privacy Channels
                    </h3>
                    <p className="text-slate-400 mb-1">Privacy Email: <a href="mailto:privacy@kraftmortgages.ca" className="text-slate-200 hover:text-gold-400 font-medium">privacy@kraftmortgages.ca</a></p>
                    <p className="text-slate-400 mb-1">Contact Email: <a href="mailto:info@kraftmortgages.ca" className="text-slate-200 hover:text-gold-400 font-medium">info@kraftmortgages.ca</a></p>
                    <p className="text-slate-400 mb-1">Head Office Phone: <a href="tel:604-593-1550" className="text-slate-200 hover:text-gold-400">604-593-1550</a></p>
                    <p className="text-slate-400">Mobile Desk: <a href="tel:604-727-1579" className="text-slate-200 hover:text-gold-400">604-727-1579</a></p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <p className="mb-2"><strong>External Privacy Commissioner Contacts:</strong></p>
                  <p className="mb-1">
                    If our Privacy Officer cannot resolve your concern, you have the right to contact the <strong>Office of the Information and Privacy Commissioner for British Columbia (OIPC BC)</strong> at <a href="https://www.oipc.bc.ca" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">www.oipc.bc.ca</a> or the <strong>Office of the Privacy Commissioner of Canada (OPC)</strong> at <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">www.priv.gc.ca</a>.
                  </p>
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