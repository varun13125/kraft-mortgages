"use client";
import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useLiveRates } from "@/lib/useLiveRates";
import { ShieldCheck, Sparkles, CheckCircle2, Moon, Clock, PhoneCall, ArrowLeft } from "lucide-react";
import { getCallingHoursStatus, type CallingHoursStatus } from "@/lib/businessHours";

export const dynamic = "force-dynamic";

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
  const { data, best5YrFixed, best3YrFixed, best5YrVariable, bestHeloc, bestPrivateSecond } = useLiveRates();
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

  const [status, setStatus] = useState<"idle" | "submitting" | "calling" | "completed" | "error">("idle");
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
• Calling Timing: ${isAfterHours ? `🌙 After-Hours Queue (Scheduled: ${scheduledTime})` : `⚡ Live Dial Allowed (${callingStatus?.currentPtTime || "PT"})`}
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
      ...utmParams
    };

    try {
      // Fire lead capture webhook and Thinkrr agent trigger API
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      // Trigger client-side Meta Pixel tracking if available
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          value: parseFloat(form.loanAmount.replace(/,/g, "")) || 0,
          currency: "CAD",
          content_name: form.mortgageType,
          lead_source: utmParams.utm_source,
        });
      }

      // Transition based on calling hours guardrail
      if (isAfterHours) {
        setStatus("completed");
      } else {
        setStatus("calling");
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
      <main className="min-h-screen bg-[#070e1a] text-slate-100 font-sans text-sm leading-relaxed relative overflow-hidden pt-20 sm:pt-24">
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
            <div className="inline-flex items-center gap-2.5 mb-5 font-mono text-xs font-semibold text-[#f3d275] tracking-[0.2em] border border-[#d4af37]/30 px-4 py-1.5 rounded-full bg-[#0c1626]/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              SECURE PORTAL · INSTANT PRE-QUALIFICATION
            </div>
          <h1 className="font-serif font-normal text-4xl sm:text-6xl leading-[1.0] tracking-[-0.03em] mb-4 text-white">
            Qualify for Your <em className="text-[#f3d275] italic font-normal">Priority Rate.</em>
          </h1>
          {requestedTerm && (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#0c1626] border border-[#d4af37]/40 text-[#f3d275] text-xs font-mono shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#f3d275]" />
              <span className="text-slate-300">Locking Rate For:</span>
              <strong className="text-white font-bold">{requestedTerm}</strong>
              <span className="text-emerald-400 font-semibold">• Live Verified Feed</span>
            </div>
          )}
          <p className="text-base text-slate-200 max-w-[620px] mx-auto leading-relaxed">
            Get instant credit mapping, lock in BC's lowest rate options, and speak with Julia (our automated voice specialist) to finalize your priority file.
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
                Please answer when your phone rings. Julia is assigned to your profile to verify your mortgage details and secure your priority rates.
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
                <span>AFTER-HOURS PRIORITY FILE LOCKED</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-white">
                Your Rate & File Are <em className="text-[#f3d275] italic font-normal">Reserved.</em>
              </h2>

              <p className="text-base text-slate-200 mb-8 leading-relaxed">
                Thank you, <strong className="text-white font-semibold">{form.firstName}</strong>. Because your request was submitted outside our live dialing window ({callingStatus?.currentPtTime || "Pacific Time"}), your priority qualification call is queued for our next available business window.
              </p>

              {/* Scheduled Appointment Card */}
              <div className="bg-[#070e1a]/95 border-2 border-slate-700 p-6 rounded-xl text-left space-y-4 mb-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Scheduled Priority Call</span>
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
                      <label className={labelClass}>Estimated Property Value ($) *</label>
                      <input
                        type="text"
                        required
                        value={form.propertyValue}
                        onChange={(e) => setForm((f) => ({ ...f, propertyValue: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 750,000"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Desired Mortgage Loan Amount ($) *</label>
                      <input
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
                    {callingStatus && !callingStatus.isOpen
                      ? `Lock in your priority rate file. Julia will place your qualification call on ${callingStatus.nextAvailableTime}.`
                      : "Julia is standing by to place your priority qualification call right now."}
                  </p>

                  {/* Calling Hours Guardrail Status Banner */}
                  {callingStatus && !callingStatus.isOpen ? (
                    <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-left max-w-[540px] mx-auto">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                        <Moon className="w-3.5 h-3.5 text-amber-300" />
                        <span>AFTER-HOURS GUARDRAIL ACTIVE • {callingStatus.currentPtTime}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        To respect Canadian telecommunications quiet hours, automated phone calls are paused overnight. Your priority rate is locked immediately upon submitting, and Julia will place your call on <strong>{callingStatus.nextAvailableTime}</strong>.
                      </p>
                    </div>
                  ) : callingStatus?.isOpen ? (
                    <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-left max-w-[540px] mx-auto flex items-center gap-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-300 font-mono font-medium">
                        <strong>LIVE DIAL ACTIVE ({callingStatus.currentPtTime}):</strong> Julia will call your phone immediately upon submission.
                      </span>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-5 max-w-[540px] mx-auto text-left">
                    <input
                      type="text" name="_hp" value={form._hp}
                      onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
                      className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>First Name *</label>
                        <input
                          type="text" required value={form.firstName}
                          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                          className={inputClass} placeholder="John"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input
                          type="text" value={form.lastName}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                          className={inputClass} placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input
                        type="email" required value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputClass} placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input
                        type="tel" required value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputClass} placeholder="e.g. +1 604-123-4567"
                      />
                      <span className="text-xs text-slate-400 font-mono block mt-1.5 font-medium">
                        Must be a valid, ringable number (E.164 or 10-digit).
                      </span>
                    </div>

                    {/* Preferred Callback Time (Active when after-hours) */}
                    {callingStatus && !callingStatus.isOpen && (
                      <div>
                        <label className={labelClass}>Preferred Callback Time</label>
                        <select
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
                          Julia will dial you during this window from +1 (604) 359-5993.
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
                          ? "DISPATCHING..."
                          : callingStatus && !callingStatus.isOpen
                          ? "LOCK PRIORITY RATE & QUEUE CALLBACK →"
                          : "DISPATCH QUALIFICATION CALL →"}
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
            <span>CURRENT VERIFIED MORTGAGE RATES • UPDATED TODAY</span>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 max-w-[1000px] mx-auto mb-10">
            <div className="bg-[#0c1626]/90 border border-slate-700/80 hover:border-[#d4af37]/60 transition-colors p-5 text-center rounded-lg shadow-md">
              <div className="text-xs font-mono font-semibold text-slate-300 tracking-wider mb-2">5-YEAR FIXED</div>
              <div className="text-3xl font-serif text-[#f3d275] font-bold">
                {best5YrFixed ? `${best5YrFixed.toFixed(2)}%` : "4.44%"}
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
    </>
  );
}
