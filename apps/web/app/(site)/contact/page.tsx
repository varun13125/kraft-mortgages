"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const API_URL = "/api/contact";
const mortgageTypes = ["Purchase", "Refinance", "Renewal", "Pre-approval", "Construction", "MLI Select", "Private Lending", "Other"];

const CONTACT_INFO = [
  {
    label: "PHONE",
    content: (
      <>
        <a href="tel:604-593-1550" className="hover:text-term-text transition-colors">604-593-1550</a> (Office)
        <br />
        <a href="tel:604-727-1579" className="hover:text-term-text transition-colors">604-727-1579</a> (Mobile)
      </>
    ),
  },
  {
    label: "EMAIL",
    content: (
      <>
        <a href="mailto:varun@kraftmortgages.ca" className="hover:text-term-text transition-colors">varun@kraftmortgages.ca</a>
        <br />
        <a href="mailto:gursharan@kraftmortgages.ca" className="hover:text-term-text transition-colors">gursharan@kraftmortgages.ca</a>
      </>
    ),
  },
  {
    label: "OFFICE HOURS",
    content: "Mon–Fri: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 4:00 PM\nSun: Closed",
  },
  {
    label: "ADDRESS",
    content: (
      <>
        <a
          href="https://maps.google.com/?q=%23301+1688+152nd+Street+Surrey+BC+V4A+4N2"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-term-text transition-colors"
        >
          #301 1688 152nd Street<br />Surrey, BC V4A 4N2
        </a>
      </>
    ),
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mortgageType: "",
    amount: "",
    message: "",
    _hp: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form._hp) return;
    setStatus("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "website-contact" }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-term-bg border border-term-line-dim px-4 py-3 text-term-text placeholder-term-text-mute focus:outline-none focus:border-term-gold/50 transition-colors font-sans text-sm";
  const labelClass = "block font-mono text-[10px] text-term-gold tracking-[0.1em] mb-2 uppercase";

  return (
    <>
      <Navigation />
      <main className="bg-term-bg text-term-text font-sans text-sm leading-relaxed">

        {/* ──── HERO ──── */}
        <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 term-grid-bg opacity-20 pointer-events-none" />
          <div className="max-w-[1400px] mx-auto relative">
            <div className="flex items-center gap-2.5 mb-7 font-mono text-[11px] text-term-gold tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-term-green shadow-[0_0_8px_rgba(95,179,128,0.8)]" />
              §01 · CONTACT · LIVE
            </div>
            <h1 className="font-serif font-normal text-5xl sm:text-7xl leading-[0.9] tracking-[-0.04em] mb-6">
              Get in <em className="text-term-gold italic font-normal">Touch.</em>
            </h1>
            <p className="text-lg text-term-text-dim max-w-[640px] leading-relaxed">
              Speak directly with our mortgage specialists. Free consultations, same-day pre-approvals.
            </p>
          </div>
        </section>

        {/* ──── MAIN CONTENT ──── */}
        <section className="pb-20 px-4 sm:px-8">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_400px] gap-px bg-term-line-dim">

            {/* Contact Form */}
            <div className="bg-term-bg p-8 sm:p-10">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-6">
                SEND A MESSAGE
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="font-mono text-[11px] text-term-green tracking-[0.15em] mb-4">✓ MESSAGE SENT</div>
                  <h3 className="font-serif text-2xl mb-3">Thank you!</h3>
                  <p className="text-term-text-dim">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : status === "error" ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="font-mono text-[11px] text-term-red tracking-[0.15em] mb-4">✕ ERROR</div>
                  <h3 className="font-serif text-2xl mb-3">Something went wrong</h3>
                  <p className="text-term-text-dim mb-4">
                    Please call us at <a href="tel:604-593-1550" className="text-term-gold hover:underline">604-593-1550</a>.
                  </p>
                  <button onClick={() => setStatus("idle")} className="text-term-gold hover:underline font-mono text-xs">
                    TRY AGAIN →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text" name="_hp" value={form._hp}
                    onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
                    className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First Name *</label>
                      <input id="firstName" required value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        className={inputClass} placeholder="John" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last Name</label>
                      <input id="lastName" value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        className={inputClass} placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>Email *</label>
                    <input id="email" type="email" required value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass} placeholder="john@example.com" />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone</label>
                    <input id="phone" type="tel" value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className={inputClass} placeholder="604-123-4567" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mortgageType" className={labelClass}>Mortgage Type</label>
                      <select id="mortgageType" value={form.mortgageType}
                        onChange={(e) => setForm((f) => ({ ...f, mortgageType: e.target.value }))}
                        className={inputClass}>
                        <option value="">Select...</option>
                        {mortgageTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="amount" className={labelClass}>Loan Amount</label>
                      <input id="amount" type="text" value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                        className={inputClass} placeholder="$500,000" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Message</label>
                    <textarea id="message" rows={5} value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className={inputClass + " resize-none"} placeholder="Tell us about your situation..." />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-term-gold text-term-deep font-mono text-[13px] font-semibold tracking-[0.1em] px-7 py-4 hover:bg-term-gold-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "SENDING..." : "SEND MESSAGE →"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="bg-term-deep p-8 sm:p-10">
              <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-8">
                CONTACT INFO
              </div>
              <div className="space-y-8">
                {CONTACT_INFO.map((info) => (
                  <div key={info.label}>
                    <div className="font-mono text-[10px] text-term-text-mute tracking-[0.12em] mb-2">{info.label}</div>
                    <div className="text-[13px] text-term-text-dim leading-relaxed whitespace-pre-line">
                      {info.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Apply */}
              <div className="mt-10 pt-8 border-t border-term-line-dim">
                <div className="font-mono text-[10px] text-term-text-mute tracking-[0.12em] mb-3">PREFER TO APPLY ONLINE?</div>
                <a
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-term-gold text-term-deep font-mono text-[12px] font-semibold tracking-[0.1em] px-5 py-3 hover:bg-term-gold-bright transition-colors"
                >
                  START APPLICATION →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ──── WHY CONTACT US ──── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-term-line-dim bg-term-deep">
          <div className="max-w-[1400px] mx-auto">
            <div className="font-mono text-[11px] text-term-gold tracking-[0.15em] mb-2">
              §03 · WHY KRAFT MORTGAGES
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[-0.02em] mb-12">
              Why Clients <em className="text-term-gold italic">Choose Us.</em>
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-term-line-dim">
              {[
                { num: "01", title: "23+ Years Experience", body: "Decades of expertise helping clients navigate complex mortgage solutions across Canada." },
                { num: "02", title: "Competitive Rates", body: "Access to exclusive rates and specialized programs like MLI Select across 30+ lenders." },
                { num: "03", title: "Fast Processing", body: "Streamlined application process with quick approvals and dedicated support." },
              ].map((item) => (
                <div key={item.num} className="bg-term-bg p-8 border-t-2 border-t-term-gold">
                  <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-5">{item.num}</div>
                  <h3 className="font-serif text-xl tracking-[-0.02em] mb-3">{item.title}</h3>
                  <p className="text-[13px] text-term-text-dim leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
