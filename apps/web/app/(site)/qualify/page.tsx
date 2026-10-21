"use client";
import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLiveRates } from "@/lib/useLiveRates";
import { ShieldCheck, Sparkles, CheckCircle2, Moon, Clock, PhoneCall, ArrowLeft } from "lucide-react";
import { getCallingHoursStatus, type CallingHoursStatus } from "@/lib/businessHours";
import { ConsentCheckboxes } from "@/components/ConsentCheckboxes";
import { consentFields } from "@/lib/compliance/consent";

// (Removed `export const dynamic = "force-dynamic"`: route segment config is
// meaningless on a client page, and nothing here needs per-request rendering —
// query params are read in useEffect.)

const API_URL = "/api/contact";

const GOALS = [
  { id: "Purchase", title: "Buying a Home", desc: "Get qualified to make a winning offer with priority rates.", icon: "🏡" },
  { id: "Refinance", title: "Refinancing", desc: "Lower payments, consolidate debt, or cashout home equity.", icon: "💰" },
  { id: "Renewal", title: "Renewing Mortgage", desc: "Lock in rates before your current term expires.", icon: "📅" },
  { id: "Private Lending", title: "Alternative / Private", desc: "Get funded quickly when traditional banks say no.", icon: "🤝" },
];

const CREDIT_SCORES = [
  { id: "Excellent (720+)", label: "Excellent (720+)", desc: "Best premium interest rates available." },
  { id: "Good (650-719)", label: "Good (650-719)", desc: "Competitive institutional financing." },
  { id: "Fair (600-649)", label: "Fair (600-649)", desc: "B-lender & alternative options." },
  { id: "Alternative Support", label: "Need Help (<600)", desc: "Private funding & credit rebuild paths." },
];

const EMPLOYMENT_TYPES = [
  { id: "Salaried / Full-Time", label: "Salaried / Full-Time", desc: "Standard T4 income verification." },
  { id: "Self-Employed", label: "Self-Employed", desc: "Stated income or business bank statements." },
  { id: "Business Owner", label: "Business Owner", desc: "Incorporated or sole-proprietor business income." },
  { id: "Other", label: "Other Income", desc: "Rental, investment, pension, or commission." },
];

export default function QualifyPage() {
  const { data, best5YrFixed, best3YrFixed, best5YrVariable, bestHeloc, bestPrivateSecond, isToday } = useLiveRates();
  const [requestedTerm, setRequestedTerm] = useState("");
  const [callingStatus, setCallingStatus] = useState<CallingHoursStatus | null>(null);
  const [preferredCallback, setPreferredCallback] = useState("");

  // Capture UTM parameters and calling hours status on load
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  useEffect(() => {
    // Check calling hours in Pacific Time
    const status = getCallingHoursStatus();
    setCallingStatus(status);
    setPreferredCallback(status.nextAvailableTime);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const term = params.get("term") || params.get("product") || "";
      if (term) setRequestedTerm(term);
      setUtmParams({
        utm_source: params.get("utm_source") || "facebook-ad-qualify",
        utm_medium: params.get("utm_medium") || "cpc",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || term,
      });
    }
  }, []);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mortgageType: "",
    propertyValue: "",
    loanAmount: "",
    creditScore: "",
    employmentType: "",
    _hp: "",
  });

  // "received" = submitted during calling hours but the server did not place the
  // AI call (repeat number within 24h, dialer unavailable, etc.). Previously the
  // page showed "Julia is calling your phone" regardless.
  const [status, setStatus] = useState<"idle" | "submitting" | "calling" | "completed" | "received" | "error">("idle");
  // Consent (BUG-005, owner decision 2026-10-13): Julia (automated AI call) calls ONLY
  // if the visitor ticks the call box. Both boxes are optional and start unticked.
  const [callConsent, setCallConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [callCheckpoint, setCallCheckpoint] = useState(0);

  // Live dialing animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "calling") {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Handle checkpoints for the live calling widget
  useEffect(() => {
    if (status === "calling") {
      const t1 = setTimeout(() => setCallCheckpoint(1), 1200); // CRM sync
      const t2 = setTimeout(() => setCallCheckpoint(2), 2400); // Outbound queue
      const t3 = setTimeout(() => setCallCheckpoint(3), 4200); // Live call dialing
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setCallCheckpoint(0);
    }
  }, [status]);

  const handleGoalSelect = (goalId: string) => {
    setForm((f) => ({ ...f, mortgageType: goalId }));
    setStep(2);
  };

  const handleCreditSelect = (creditId: string) => {
    setForm((f) => ({ ...f, creditScore: creditId }));
    setStep(4);
  };

  const handleEmploymentSelect = (empId: string) => {
    setForm((f) => ({ ...f, employmentType: empId }));
    setStep(5);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form._hp) return;
    
    setStatus("submitting");

    const isAfterHours = callingStatus ? !callingStatus.isOpen : false;
    const scheduledTime = preferredCallback || callingStatus?.nextAvailableTime || "Tomorrow at 9:15 AM PT";

    // Composite rich message structure for Twenty CRM notes
    const parsedMessage = `
--- LEAD PRE-QUALIFICATION SYSTEM ---
• Selected Goal: ${form.mortgageType}
• Est. Property Value: $${form.propertyValue}
• Desired Loan Amount: $${form.loanAmount}
• Self-Reported Credit: ${form.creditScore}
• Employment Profile: ${form.employmentType}
• Calling Timing: ${isAfterHours ? `🌙 Follow-up requested (preferred: ${scheduledTime})` : `⚡ Live Dial Allowed (${callingStatus?.currentPtTime || "PT"})`}
• Automated AI Call Consent: ${callConsent ? "YES (box ticked)" : "NO — human follow-up only"}
• Source Attribution: ${utmParams.utm_source} / Campaign: ${utmParams.utm_campaign}
    `.trim();

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      mortgageType: form.mortgageType,
      amount: `$${form.loanAmount}`,
      message: parsedMessage,
      source: utmParams.utm_source,
      afterHours: isAfterHours,
      preferredCallTime: scheduledTime,
      ...utmParams,
      ...consentFields(callConsent, marketingConsent),
    };

    try {
      // Fire lead capture webhook and Thinkrr agent trigger API
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      // The server is authoritative on calling hours and on whether the AI call
      // was actually dispatched (it enforces quiet hours and 1 auto-dial/24h).
      let serverAfterHours: boolean | undefined;
      let callDispatched: boolean | undefined;
      try {
        const json = await res.json();
        if (typeof json?.isAfterHours === "boolean") serverAfterHours = json.isAfterHours;
        if (typeof json?.callDispatched === "boolean") callDispatched = json.callDispatched;
      } catch {
        // Non-JSON success body: fall back to the client-side calling-hours check.
      }

      // Trigger client-side Meta Pixel tracking if available
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          value: parseFloat(form.loanAmount.replace(/,/g, "")) || 0,
          currency: "CAD",
          content_name: form.mortgageType,
          lead_source: utmParams.utm_source,
        });
      }

      // Transition on what the server actually did (it enforces consent, calling
      // hours and 1 auto-dial/24h). Only claim "Julia is calling" when it says so.
      if (callDispatched === true) {
        setStatus("calling");
      } else if (callConsent && (serverAfterHours ?? isAfterHours)) {
        setStatus("completed"); // request saved for team follow-up; no confirmed callback queue
      } else {
        setStatus("received"); // no automated call: a broker follows up
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-[#0d1829] border-2 border-slate-700/80 px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25 transition-all font-sans text-base font-medium rounded-md shadow-inner";
  const labelClass = "block font-mono text-xs font-semibold text-[#f3d275] tracking-[0.12em] mb-2 uppercase";

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-[#070e1a] text-slate-100 font-sans text-sm leading-relaxed relative overflow-hidden pt-20 sm:pt-24">
        <div className="absolute inset-0 term-grid-bg opacity-10 pointer-events-none" />

        {/* Decorative Golden Ambient Aura */}
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#d4af37]/10 blur-[140px] pointer-events-none" />

        <div className="max-w-[1000px] mx-auto px-4 py-8 sm:py-12 relative z-10">
          
          {/* Top Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-8 text-xs font-mono">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#f3d275] transition-colors bg-[#0c1626]/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Homepage</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/rates"
                className="text-slate-400 hover:text-[#f3d275] transition-colors bg-[#0c1626]/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-sm hidden sm:inline-block"
              >
                Compare All Rates →
              </Link>
              <Link
                href="/calculators"
                className="text-slate-400 hover:text-[#f3d275] transition-colors bg-[#0c1626]/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-sm"
              >
                Calculators →
              </Link>
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 mb-4 font-mono text-xs font-semibold text-[#f3d275] tracking-[0.2em] border border-[#d4af37]/30 px-4 py-1.5 rounded-full bg-[#0c1626]/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              MORTGAGE INQUIRY · PERSONAL FOLLOW-UP
            </div>

            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Leave an inquiry for review</span>
            </div>

          <h1 className="font-serif font-normal text-4xl sm:text-6xl leading-[1.0] tracking-[-0.03em] mb-4 text-white">
            Explore Your <em className="text-[#f3d275] italic font-normal">Mortgage Options.</em>
          </h1>
          {requestedTerm && (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#0c1626] border border-[#d4af37]/40 text-[#f3d275] text-xs font-mono shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#f3d275]" />
              {/* Submitting this form does not lock or hold a rate (see Terms). */}
              <span className="text-slate-300">Rate Inquiry For:</span>
              <strong className="text-white font-bold">{requestedTerm}</strong>
            </div>
          )}
          <p className="text-base text-slate-200 max-w-[620px] mx-auto leading-relaxed">
            Share your credit profile and mortgage goals for our team to review. Your submission does not start an automated call.
          </p>
          <p className="text-xs text-slate-400 max-w-[580px] mx-auto mt-2 leading-relaxed">
            ⚡ <em>Beta Notice: Voice calling is currently experimental AI beta. Speech recognition may occasionally mishear phrases; every file is independently validated by our licensed human mortgage team.</em>
          </p>
        </div>

        {/* MAIN PANEL */}
        <div className="bg-[#0a1424]/90 border border-slate-700/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-xl relative">
          
          {/* Top Border gold line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-t-xl" />

          {/* STATUS: ERROR */}
          {status === "error" && (
            <div className="text-center py-16">
              <div className="font-mono text-xs text-red-400 tracking-widest mb-4 font-bold">✕ DISPATCH FAILURE</div>
              <h2 className="font-serif text-3xl mb-4 text-white">System Routing Interrupted</h2>
              <p className="text-slate-300 max-w-[480px] mx-auto mb-8">
                An issue occurred while queueing your outbound qualification call. Please call our office directly to secure your file.
              </p>
              <a href="tel:604-593-1550" className="bg-[#d4af37] text-[#070e1a] font-mono text-xs font-bold px-8 py-4 tracking-widest hover:bg-[#f3d275] transition-colors rounded-md inline-block shadow-md">
                CALL 604-593-1550 NOW →
              </a>
              <button onClick={() => setStatus("idle")} className="block mx-auto mt-6 text-xs text-[#f3d275] underline font-mono font-semibold">
                RETRY PRE-QUALIFICATION
              </button>
            </div>
          )}

          {/* STATUS: CALLING (LIVELY PULSING WIDGET) */}
          {status === "calling" && (
            <div className="text-center py-12">
              
              {/* Pulse Ring Indicator */}
              <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#d4af37]/10 animate-ping opacity-60" />
                <div className="absolute inset-4 rounded-full bg-[#d4af37]/20 animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-[#0b1528] border border-[#d4af37]/60 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] z-10">
                  <span className="text-4xl animate-bounce">📞</span>
                </div>
              </div>

              <div className="font-mono text-xs text-[#f3d275] tracking-[0.2em] mb-4 uppercase font-semibold">
                Incoming Outbound Call Dispatched ({seconds}s)
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-white">
                Julia is calling your phone <em className="text-[#f3d275] italic font-normal">{form.phone}</em>
              </h2>
              <p className="text-base text-slate-200 max-w-[560px] mx-auto mb-10">
                Please answer when your phone rings. Julia will confirm your mortgage details so a licensed broker can review your options.
              </p>

              {/* Console steps tracker */}
              <div className="max-w-[480px] mx-auto bg-[#070e1a]/90 border border-slate-700/80 p-6 rounded-lg text-left space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Facebook Ad Campaign parameters mapped</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 1 ? "text-emerald-400 font-bold" : "text-slate-400 animate-pulse"}>
                    {callCheckpoint >= 1 ? "✓" : "▶"}
                  </span>
                  <span className={callCheckpoint >= 1 ? "text-white font-medium" : "text-slate-400"}>
                    Lead registered in Twenty CRM database
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 2 ? "text-emerald-400 font-bold" : "text-slate-400 animate-pulse"}>
                    {callCheckpoint >= 2 ? "✓" : callCheckpoint >= 1 ? "▶" : "·"}
                  </span>
                  <span className={callCheckpoint >= 2 ? "text-white font-medium" : "text-slate-400"}>
                    Securing scenario outbound payload...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 3 ? "text-emerald-400 font-bold" : "text-slate-400 animate-pulse"}>
                    {callCheckpoint >= 3 ? "✓" : callCheckpoint >= 2 ? "▶" : "·"}
                  </span>
                  <span className={callCheckpoint >= 3 ? "text-emerald-300 font-bold" : "text-slate-400 animate-pulse"}>
                    {callCheckpoint >= 3 ? "Julia online: Calling phone line now!" : "Julia connecting..."}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-sm text-slate-300 font-mono">
                Caller ID will display as Julia: <a href="tel:+16043595993" className="text-[#f3d275] font-sans font-bold hover:underline">+1 (604) 359-5993</a>
              </div>

              <div className="mt-5 p-3.5 rounded-lg bg-[#070e1a]/90 border border-slate-700/80 max-w-[480px] mx-auto text-xs text-slate-400 text-left leading-relaxed">
                🤖 <strong className="text-slate-200">AI Voice Assistant (Beta):</strong> Julia is an automated conversational voice specialist. If speech is delayed or audio is interrupted, don&apos;t worry — our human advisory team receives your full scenario transcript and will follow up directly.
              </div>
            </div>
          )}

          {/* STATUS: COMPLETED (AFTER-HOURS PRIORITY RATE LOCK CONFIRMATION) */}
          {status === "completed" && (
            <div className="text-center py-10 max-w-[640px] mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3d275] text-xs font-mono font-semibold">
                <Moon className="w-3.5 h-3.5 text-[#f3d275]" />
                <span>AFTER-HOURS REQUEST RECEIVED</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-white">
                Your Request Is <em className="text-[#f3d275] italic font-normal">Saved.</em>
              </h2>

              <p className="text-base text-slate-200 mb-8 leading-relaxed">
                Thank you, <strong className="text-white font-semibold">{form.firstName}</strong>. Because your request was submitted outside our live dialing window ({callingStatus?.currentPtTime || "Pacific Time"}), your request is saved for team follow-up during business hours. A callback time is not confirmed.
              </p>

              {/* Scheduled Appointment Card */}
              <div className="bg-[#070e1a]/95 border-2 border-slate-700 p-6 rounded-xl text-left space-y-4 mb-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preferred follow-up window</span>
                    </div>
                    <div className="text-xl font-mono font-bold text-emerald-300">
                      {preferredCallback || callingStatus?.nextAvailableTime || "Tomorrow at 9:15 AM PT"}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center sm:justify-end gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#f3d275]" />
                      <span>Incoming Caller ID</span>
                    </div>
                    <div className="text-base font-mono font-bold text-[#f3d275]">+1 (604) 359-5993</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1 font-mono">
                  <div>
                    <span className="text-slate-400">Target Product: </span>
                    <span className="text-white font-medium">{form.mortgageType || requestedTerm || "Mortgage"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Loan Amount: </span>
                    <span className="text-white font-medium">${form.loanAmount || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Property Value: </span>
                    <span className="text-white font-medium">${form.propertyValue || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Registered Phone: </span>
                    <span className="text-white font-medium">{form.phone}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 mb-6 text-xs text-slate-300 leading-relaxed font-sans text-left">
                💡 <strong>Need urgent assistance right now?</strong> If you have an urgent financing deadline or contract of purchase expiring today, call or text senior broker <strong className="text-white">Varun Chaudhry</strong> directly at <a href="tel:604-593-1550" className="text-[#f3d275] font-bold underline">604-593-1550</a>.
              </div>

              <button
                onClick={() => {
                  setStatus("idle");
                  setStep(1);
                }}
                className="text-xs font-mono text-slate-400 hover:text-white underline transition-colors"
              >
                ← Start Another Qualification Scenario
              </button>
            </div>
          )}

          {/* STATUS: RECEIVED (no automated call placed: call box not ticked, repeat
              number within 24h, dialer unavailable, or after hours without call consent) */}
          {status === "received" && (
            <div className="text-center py-10 max-w-[640px] mx-auto" role="status">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-white">
                Thank you, <em className="text-[#f3d275] italic font-normal">{form.firstName || "there"}.</em>
              </h2>
              <p className="text-base text-slate-200 mb-8 leading-relaxed">
                Your details have been received. We&apos;ll be in touch shortly.
              </p>
              <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 mb-6 text-xs text-slate-300 leading-relaxed font-sans text-left">
                💡 <strong>Need help right away?</strong> Call or text senior broker <strong className="text-white">Varun Chaudhry</strong> at{" "}
                <a href="tel:+16045931550" className="text-[#f3d275] font-bold underline">604-593-1550</a>.
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setStep(1);
                }}
                className="text-xs font-mono text-slate-400 hover:text-white underline transition-colors"
              >
                ← Start Another Qualification Scenario
              </button>
            </div>
          )}

          {/* ACTIVE MULTI-STEP FORM */}
          {status === "idle" || status === "submitting" ? (
            <div>
              {/* PROGRESS BAR */}
              <div className="flex justify-between items-center mb-8 font-mono text-xs font-semibold text-slate-300 tracking-wider border-b border-slate-800 pb-4">
                <span className="text-[#f3d275]">STEP {step} OF 5</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-8 rounded-full transition-colors ${
                        i <= step ? "bg-[#d4af37]" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: GOAL */}
              {step === 1 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-white">
                    What is your primary mortgage <em className="text-[#f3d275] italic font-normal">goal?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGoalSelect(g.id)}
                        className="group text-left bg-[#0c1626]/80 border border-slate-700/80 hover:border-[#d4af37] p-6 transition-all hover:translate-y-[-2px] rounded-lg shadow-sm"
                      >
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{g.icon}</div>
                        <h3 className="font-serif text-lg text-white group-hover:text-[#f3d275] transition-colors mb-1.5">{g.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{g.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: VALUES */}
              {step === 2 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-white">
                    Tell us about the property <em className="text-[#f3d275] italic font-normal">value.</em>
                  </h2>
                  <div className="space-y-6 max-w-[540px] mx-auto py-4">
                    <div>
                      <label htmlFor="q-property-value" className={labelClass}>Estimated Property Value ($) *</label>
                      <input
                        id="q-property-value" inputMode="numeric"
                        type="text"
                        required
                        value={form.propertyValue}
                        onChange={(e) => setForm((f) => ({ ...f, propertyValue: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 750,000"
                      />
                    </div>
                    <div>
                      <label htmlFor="q-loan-amount" className={labelClass}>Desired Mortgage Loan Amount ($) *</label>
                      <input
                        id="q-loan-amount" inputMode="numeric"
                        type="text"
                        required
                        value={form.loanAmount}
                        onChange={(e) => setForm((f) => ({ ...f, loanAmount: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 500,000"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono text-xs font-semibold py-4 px-6 tracking-widest rounded-md transition-colors"
                      >
                        ← BACK
                      </button>
                      <button
                        disabled={!form.propertyValue || !form.loanAmount}
                        onClick={() => setStep(3)}
                        className="w-2/3 bg-[#d4af37] hover:bg-[#f3d275] text-[#070e1a] font-mono text-xs font-bold py-4 px-6 tracking-widest transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-md shadow-lg shadow-[#d4af37]/20"
                      >
                        NEXT STEP →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CREDIT PROFILE */}
              {step === 3 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-white">
                    How would you estimate your <em className="text-[#f3d275] italic font-normal">credit score?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CREDIT_SCORES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCreditSelect(c.id)}
                        className="group text-left bg-[#0c1626]/80 border border-slate-700/80 hover:border-[#d4af37] p-6 transition-all hover:translate-y-[-2px] rounded-lg shadow-sm"
                      >
                        <h3 className="font-serif text-lg text-white group-hover:text-[#f3d275] transition-colors mb-1.5">{c.label}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-1">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="mt-8 text-xs text-slate-400 hover:text-white font-mono tracking-wider transition-colors inline-flex items-center gap-1 font-semibold">
                    ← BACK TO PREVIOUS STEP
                  </button>
                </div>
              )}

              {/* STEP 4: EMPLOYMENT PROFILE */}
              {step === 4 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-white">
                    What is your primary <em className="text-[#f3d275] italic font-normal">income source?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {EMPLOYMENT_TYPES.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleEmploymentSelect(e.id)}
                        className="group text-left bg-[#0c1626]/80 border border-slate-700/80 hover:border-[#d4af37] p-6 transition-all hover:translate-y-[-2px] rounded-lg shadow-sm"
                      >
                        <h3 className="font-serif text-lg text-white group-hover:text-[#f3d275] transition-colors mb-1.5">{e.label}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-1">{e.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(3)} className="mt-8 text-xs text-slate-400 hover:text-white font-mono tracking-wider transition-colors inline-flex items-center gap-1 font-semibold">
                    ← BACK TO PREVIOUS STEP
                  </button>
                </div>
              )}

              {/* STEP 5: CONTACT INFORMATION */}
              {step === 5 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-white">
                    Verify Your Contact <em className="text-[#f3d275] italic font-normal">Details.</em>
                  </h2>
                  <p className="text-sm text-slate-300 mb-6">
                    Leave the contact details you would like our team to use when following up.
                  </p>

                  <p className="mb-6 max-w-[540px] mx-auto text-sm leading-relaxed text-slate-300">
                    Submit your message for the Kraft Mortgages team. Julia can also take a voice message through the guidance menu. There is no live office transfer or automatic appointment booking.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5 max-w-[540px] mx-auto text-left">
                    <input
                      type="text" name="_hp" value={form._hp}
                      onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
                      className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="q-first-name" className={labelClass}>First Name *</label>
                        <input
                          id="q-first-name" autoComplete="given-name"
                          type="text" required value={form.firstName}
                          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                          className={inputClass} placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="q-last-name" className={labelClass}>Last Name</label>
                        <input
                          id="q-last-name" autoComplete="family-name"
                          type="text" value={form.lastName}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                          className={inputClass} placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="q-email" className={labelClass}>Email Address *</label>
                      <input
                        id="q-email" autoComplete="email"
                        type="email" required value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputClass} placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="q-phone" className={labelClass}>Phone Number *</label>
                      <input
                        id="q-phone" autoComplete="tel" aria-describedby="q-phone-hint"
                        type="tel" required value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputClass} placeholder="e.g. +1 604-123-4567"
                      />
                      <span id="q-phone-hint" className="text-xs text-slate-400 font-mono block mt-1.5 font-medium">
                        Must be a valid, ringable number (E.164 or 10-digit).
                      </span>
                    </div>

                    {/* Optional consent (BUG-005): unticked by default. Julia calls ONLY if
                        the call box is ticked; the server enforces this too. */}
                    <ConsentCheckboxes
                      idPrefix="qualify"
                      call={{ checked: callConsent, onChange: setCallConsent }}
                      marketing={{ checked: marketingConsent, onChange: setMarketingConsent }}
                    >
                      See our <Link href="/privacy" className="underline hover:text-[#f3d275]">Privacy Policy</Link>.
                    </ConsentCheckboxes>

                    {/* Preferred Callback Time (Active when after-hours) */}
                    {callingStatus && !callingStatus.isOpen && (
                      <div>
                        <label htmlFor="q-callback-time" className={labelClass}>Preferred Callback Time</label>
                        <select
                          id="q-callback-time"
                          value={preferredCallback}
                          onChange={(e) => setPreferredCallback(e.target.value)}
                          className="w-full bg-[#0d1829] border-2 border-slate-700/80 px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25 transition-all font-sans text-sm font-medium rounded-md shadow-inner"
                        >
                          <option value={callingStatus.nextAvailableTime} className="bg-[#0d1829] text-white">
                            ⚡ {callingStatus.nextAvailableTime} (Fastest Priority)
                          </option>
                          <option value="Morning (9:30 AM – 11:30 AM PT)" className="bg-[#0d1829] text-white">
                            Morning (9:30 AM – 11:30 AM PT)
                          </option>
                          <option value="Early Afternoon (12:00 PM – 2:30 PM PT)" className="bg-[#0d1829] text-white">
                            Early Afternoon (12:00 PM – 2:30 PM PT)
                          </option>
                          <option value="Late Afternoon (3:00 PM – 5:30 PM PT)" className="bg-[#0d1829] text-white">
                            Late Afternoon (3:00 PM – 5:30 PM PT)
                          </option>
                          <option value="Evening (6:00 PM – 7:30 PM PT)" className="bg-[#0d1829] text-white">
                            Evening (6:00 PM – 7:30 PM PT)
                          </option>
                        </select>
                        <span className="text-xs text-slate-400 font-mono block mt-1.5 font-medium">
                          {callConsent
                            ? "We will record this preferred window for the team to confirm."
                            : "This is a preferred window for our team to confirm; no appointment is booked."}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="w-1/3 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono text-xs font-semibold py-4 px-6 tracking-widest rounded-md transition-colors"
                      >
                        ← BACK
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting" || !form.firstName || !form.email || !form.phone}
                        className="w-2/3 bg-[#d4af37] hover:bg-[#f3d275] text-[#070e1a] font-mono text-xs font-bold py-4 px-6 tracking-widest transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-md shadow-lg shadow-[#d4af37]/25"
                      >
                        {status === "submitting"
                          ? "SUBMITTING..."
                          : !callConsent
                          ? "SUBMIT MY DETAILS →"
                          : callingStatus && !callingStatus.isOpen
                          ? "SUBMIT & QUEUE CALLBACK →"
                          : "SUBMIT & CALL ME NOW →"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : null}

        </div>

        {/* RATE ACCORDION / TRUST SIGNALS */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-300 tracking-[0.12em] mb-6 uppercase bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/40 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {/* Only claim "updated today" when the live rate feed actually returned today's data */}
            <span>{isToday ? "CURRENT VERIFIED MORTGAGE RATES • UPDATED TODAY" : "INDICATIVE MORTGAGE RATES • SUBJECT TO CHANGE"}</span>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 max-w-[1000px] mx-auto mb-10">
            <div className="bg-[#0c1626]/90 border border-slate-700/80 hover:border-[#d4af37]/60 transition-colors p-5 text-center rounded-lg shadow-md">
              <div className="text-xs font-mono font-semibold text-slate-300 tracking-wider mb-2">5-YEAR FIXED</div>
              <div className="text-3xl font-serif text-[#f3d275] font-bold">
                {best5YrFixed ? `${best5YrFixed.toFixed(2)}%` : "4.39%"}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1.5">O.A.C. Insured</div>
            </div>

            <div className="bg-[#0c1626]/90 border border-slate-700/80 hover:border-[#d4af37]/60 transition-colors p-5 text-center rounded-lg shadow-md">
              <div className="text-xs font-mono font-semibold text-slate-300 tracking-wider mb-2">3-YEAR FIXED</div>
              <div className="text-3xl font-serif text-[#f3d275] font-bold">
                {best3YrFixed ? `${best3YrFixed.toFixed(2)}%` : "4.34%"}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1.5">Most Popular Term</div>
            </div>

            <div className="bg-[#0c1626]/90 border border-slate-700/80 hover:border-[#d4af37]/60 transition-colors p-5 text-center rounded-lg shadow-md">
              <div className="text-xs font-mono font-semibold text-slate-300 tracking-wider mb-2">5-YEAR VARIABLE</div>
              <div className="text-3xl font-serif text-[#f3d275] font-bold">
                {best5YrVariable ? `${best5YrVariable.toFixed(2)}%` : "3.44%"}
              </div>
              <div className="text-xs text-emerald-400 font-mono font-semibold mt-1.5">
                {data?.benchmarks?.variable_5yr?.insured?.lowest_spread || "Prime - 1.01%"}
              </div>
            </div>

            <div className="bg-[#0c1626]/90 border border-slate-700/80 hover:border-[#d4af37]/60 transition-colors p-5 text-center rounded-lg shadow-md">
              <div className="text-xs font-mono font-semibold text-slate-300 tracking-wider mb-2">HELOC / EQUITY</div>
              <div className="text-3xl font-serif text-[#f3d275] font-bold">
                {bestHeloc ? `${bestHeloc.toFixed(2)}%` : "4.95%"}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1.5">1st Position Line of Credit</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">
            FSRA Licence #12918 | BCFSA Licensed | Kraft Mortgages Canada Inc. | Surrey, BC
          </p>
        </div>

      </div>
    </main>
    {/* Brokerage licence/legal footer (BUG-017). Sits below the whole funnel
        (form + rate cards), so it never interrupts the multi-step flow. */}
    <Footer />
    </>
  );
}
