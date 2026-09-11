"use client";
import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";

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
  // Capture UTM parameters from URL on load
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: params.get("utm_source") || "facebook-ad-qualify",
        utm_medium: params.get("utm_medium") || "cpc",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || "",
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

    // Composite rich message structure for Twenty CRM notes
    const parsedMessage = `
--- LEAD PRE-QUALIFICATION SYSTEM ---
• Selected Goal: ${form.mortgageType}
• Est. Property Value: $${form.propertyValue}
• Desired Loan Amount: $${form.loanAmount}
• Self-Reported Credit: ${form.creditScore}
• Employment Profile: ${form.employmentType}
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

      // Transition to active call ringing panel
      setStatus("calling");
    } catch (err) {
      console.error("Lead submission error:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-term-deep border border-term-line-dim px-5 py-4 text-term-text placeholder-term-text-mute focus:outline-none focus:border-term-gold transition-colors font-sans text-[15px] rounded-sm";
  const labelClass = "block font-mono text-[10px] text-term-gold tracking-[0.15em] mb-2 uppercase";

  return (
    <main className="min-h-screen bg-term-bg text-term-text font-sans text-sm leading-relaxed relative overflow-hidden">
      <div className="absolute inset-0 term-grid-bg opacity-10 pointer-events-none" />

      {/* Decorative Golden Ambient Aura */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-term-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-4 py-20 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 mb-5 font-mono text-[11px] text-term-gold tracking-[0.2em] border border-term-gold/20 px-3 py-1.5 rounded-full bg-term-deep/40">
            <span className="w-1.5 h-1.5 rounded-full bg-term-gold animate-pulse" />
            SECURE PORTAL · INSTANT PRE-QUALIFICATION
          </div>
          <h1 className="font-serif font-normal text-4xl sm:text-6xl leading-[1.0] tracking-[-0.03em] mb-4">
            Qualify for Your <em className="text-term-gold italic font-normal">Priority Rate.</em>
          </h1>
          <p className="text-[15px] text-term-text-dim max-w-[620px] mx-auto leading-relaxed">
            Get instant credit mapping, lock in BC's lowest rate options, and speak with Julia (our automated voice specialist) to finalize your priority file.
          </p>
        </div>

        {/* MAIN PANEL */}
        <div className="bg-term-deep/30 border border-term-line-dim backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative">
          
          {/* Top Border gold line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-term-gold/40 to-transparent" />

          {/* STATUS: ERROR */}
          {status === "error" && (
            <div className="text-center py-16">
              <div className="font-mono text-xs text-term-red tracking-widest mb-4">✕ DISPATCH FAILURE</div>
              <h2 className="font-serif text-3xl mb-4">System Routing Interrupted</h2>
              <p className="text-term-text-dim max-w-[480px] mx-auto mb-8">
                An issue occurred while queueing your outbound qualification call. Please call our office directly to secure your file.
              </p>
              <a href="tel:604-593-1550" className="bg-term-gold text-term-deep font-mono text-xs font-semibold px-8 py-4 tracking-widest hover:bg-term-gold-bright transition-colors rounded-sm inline-block">
                CALL 604-593-1550 NOW →
              </a>
              <button onClick={() => setStatus("idle")} className="block mx-auto mt-6 text-xs text-term-gold underline font-mono">
                RETRY PRE-QUALIFICATION
              </button>
            </div>
          )}

          {/* STATUS: CALLING (LIVELY PULSING WIDGET) */}
          {status === "calling" && (
            <div className="text-center py-12">
              
              {/* Pulse Ring Indicator */}
              <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-term-gold/10 animate-ping opacity-60" />
                <div className="absolute inset-4 rounded-full bg-term-gold/20 animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-term-deep border border-term-gold/50 flex items-center justify-center shadow-[0_0_30px_rgba(200,169,98,0.2)] z-10">
                  <span className="text-4xl animate-bounce">📞</span>
                </div>
              </div>

              <div className="font-mono text-[11px] text-term-gold tracking-[0.2em] mb-4 uppercase">
                Incoming Outbound Call Dispatched ({seconds}s)
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl mb-4">
                Julia is calling your phone <em className="text-term-gold italic font-normal">{form.phone}</em>
              </h2>
              <p className="text-[15px] text-term-text-dim max-w-[560px] mx-auto mb-10">
                Please answer when your phone rings. Julia is assigned to your profile to verify your mortgage details and secure your priority rates.
              </p>

              {/* Console steps tracker */}
              <div className="max-w-[480px] mx-auto bg-term-deep/70 border border-term-line-dim p-6 rounded-sm text-left space-y-3 font-mono text-xs text-term-text-dim">
                <div className="flex items-center gap-3">
                  <span className="text-term-green">✓</span>
                  <span>Facebook Ad Campaign parameters mapped</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 1 ? "text-term-green" : "text-term-text-mute animate-pulse"}>
                    {callCheckpoint >= 1 ? "✓" : "▶"}
                  </span>
                  <span className={callCheckpoint >= 1 ? "text-term-text" : "text-term-text-mute"}>
                    Lead registered in Twenty CRM database
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 2 ? "text-term-green" : "text-term-text-mute animate-pulse"}>
                    {callCheckpoint >= 2 ? "✓" : callCheckpoint >= 1 ? "▶" : "·"}
                  </span>
                  <span className={callCheckpoint >= 2 ? "text-term-text" : "text-term-text-mute"}>
                    Securing scenario outbound payload...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={callCheckpoint >= 3 ? "text-term-green" : "text-term-text-mute animate-pulse"}>
                    {callCheckpoint >= 3 ? "✓" : callCheckpoint >= 2 ? "▶" : "·"}
                  </span>
                  <span className={callCheckpoint >= 3 ? "text-term-text" : "text-term-text-mute animate-pulse"}>
                    {callCheckpoint >= 3 ? "Julia online: Calling phone line now!" : "Julia connecting..."}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-[13px] text-term-text-mute font-mono">
                Caller ID will display as Julia: <a href="tel:+16042003732" className="text-term-gold font-sans">+1 604-200-3732</a>
              </div>
            </div>
          )}

          {/* ACTIVE MULTI-STEP FORM */}
          {status === "idle" || status === "submitting" ? (
            <div>
              {/* PROGRESS BAR */}
              <div className="flex justify-between items-center mb-8 font-mono text-[10px] text-term-text-mute tracking-wider border-b border-term-line-dim pb-4">
                <span>STEP {step} OF 5</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 transition-colors ${
                        i <= step ? "bg-term-gold" : "bg-term-line-dim"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: GOAL */}
              {step === 1 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8">
                    What is your primary mortgage <em className="text-term-gold italic font-normal">goal?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGoalSelect(g.id)}
                        className="group text-left bg-term-deep/40 border border-term-line-dim p-6 hover:border-term-gold/60 transition-all hover:translate-y-[-2px] rounded-sm"
                      >
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{g.icon}</div>
                        <h3 className="font-serif text-lg text-term-text group-hover:text-term-gold transition-colors mb-2">{g.title}</h3>
                        <p className="text-[13px] text-term-text-dim">{g.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: VALUES */}
              {step === 2 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8">
                    Tell us about the property <em className="text-term-gold italic font-normal">value.</em>
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
                        className="w-1/3 bg-transparent border border-term-line-dim text-term-text font-mono text-[12px] py-4 tracking-widest hover:border-term-text transition-colors rounded-sm"
                      >
                        ← BACK
                      </button>
                      <button
                        disabled={!form.propertyValue || !form.loanAmount}
                        onClick={() => setStep(3)}
                        className="w-2/3 bg-term-gold text-term-deep font-mono text-[12px] font-semibold py-4 tracking-widest hover:bg-term-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
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
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8">
                    How would you estimate your <em className="text-term-gold italic font-normal">credit score?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CREDIT_SCORES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCreditSelect(c.id)}
                        className="group text-left bg-term-deep/40 border border-term-line-dim p-6 hover:border-term-gold/60 transition-all rounded-sm"
                      >
                        <h3 className="font-serif text-lg text-term-text group-hover:text-term-gold transition-colors mb-2">{c.label}</h3>
                        <p className="text-[13px] text-term-text-dim mb-1">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="mt-8 text-xs text-term-text-mute font-mono tracking-wider hover:text-term-text">
                    ← BACK TO PREVIOUS STEP
                  </button>
                </div>
              )}

              {/* STEP 4: EMPLOYMENT PROFILE */}
              {step === 4 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-8">
                    What is your primary <em className="text-term-gold italic font-normal">income source?</em>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {EMPLOYMENT_TYPES.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleEmploymentSelect(e.id)}
                        className="group text-left bg-term-deep/40 border border-term-line-dim p-6 hover:border-term-gold/60 transition-all rounded-sm"
                      >
                        <h3 className="font-serif text-lg text-term-text group-hover:text-term-gold transition-colors mb-2">{e.label}</h3>
                        <p className="text-[13px] text-term-text-dim mb-1">{e.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(3)} className="mt-8 text-xs text-term-text-mute font-mono tracking-wider hover:text-term-text">
                    ← BACK TO PREVIOUS STEP
                  </button>
                </div>
              )}

              {/* STEP 5: CONTACT INFORMATION */}
              {step === 5 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-2">
                    Verify Your Contact <em className="text-term-gold italic font-normal">Details.</em>
                  </h2>
                  <p className="text-[13px] text-term-text-dim mb-8">
                    Julia is standing by to place your priority qualification call.
                  </p>
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
                      <span className="text-[11px] text-term-text-mute font-mono block mt-1">
                        Must be a valid, ringable number (E.164 or 10-digit).
                      </span>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="w-1/3 bg-transparent border border-term-line-dim text-term-text font-mono text-[12px] py-4 tracking-widest hover:border-term-text transition-colors rounded-sm"
                      >
                        ← BACK
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting" || !form.firstName || !form.email || !form.phone}
                        className="w-2/3 bg-term-gold text-term-deep font-mono text-[12px] font-semibold py-4 tracking-widest hover:bg-term-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm shadow-[0_0_20px_rgba(200,169,98,0.2)]"
                      >
                        {status === "submitting" ? "DISPATCHING..." : "DISPATCH QUALIFICATION CALL →"}
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
          <div className="font-mono text-[10px] text-term-text-mute tracking-[0.15em] mb-8 uppercase">
            ⚡ CURRENT EST. MORTGAGE INTEREST RATES (SPRING 2026)
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-[900px] mx-auto mb-10">
            <div className="bg-term-deep/20 border border-term-line-dim p-5 text-center rounded-sm">
              <div className="text-[11px] font-mono text-term-text-mute tracking-wider mb-2">5-YEAR FIXED</div>
              <div className="text-3xl font-serif text-term-gold font-bold">4.64%</div>
              <div className="text-[11px] text-term-text-mute mt-1">O.A.C. Insured</div>
            </div>
            <div className="bg-term-deep/20 border border-term-line-dim p-5 text-center rounded-sm">
              <div className="text-[11px] font-mono text-term-text-mute tracking-wider mb-2">5-YEAR VARIABLE</div>
              <div className="text-3xl font-serif text-term-gold font-bold">6.10%</div>
              <div className="text-[11px] text-term-text-mute mt-1">BoC Prime - 1.10%</div>
            </div>
            <div className="bg-term-deep/20 border border-term-line-dim p-5 text-center rounded-sm">
              <div className="text-[11px] font-mono text-term-text-mute tracking-wider mb-2">MLI SELECT COMMERCIAL</div>
              <div className="text-3xl font-serif text-term-gold font-bold">4.25%</div>
              <div className="text-[11px] text-term-text-mute mt-1">Multi-family Insured</div>
            </div>
          </div>
          <p className="text-xs text-term-text-mute leading-relaxed font-mono">
            Lic. 12903 | Kraft Mortgages Canada Inc. | Surrey, BC
          </p>
        </div>

      </div>
    </main>
  );
}
