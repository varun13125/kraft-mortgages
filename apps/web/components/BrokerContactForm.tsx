"use client";
import { useState, type FormEvent } from "react";
import { consentFields, CONSENT_TEXT } from "@/lib/compliance/consent";

/** First-party profile form; all inquiries use the same verified Twenty pipeline. */
export default function BrokerContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setStatus("idle");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message"), _hp: form.get("_hp"), source: "website-broker-profile", ...consentFields(false, false) }),
        signal: AbortSignal.timeout(45000),
      });
      const receipt = await response.json();
      if (!response.ok || receipt.success !== true) throw new Error("Request not recorded");
      setStatus("success");
    } catch { setStatus("error"); }
    finally { setBusy(false); }
  }
  if (status === "success") return <div role="status" className="rounded-xl border border-white/15 p-6 text-center"><h3 className="font-serif text-2xl text-white">Thank you.</h3><p className="mt-2 text-sm text-slate-300">Your request is saved for our team to follow up.</p></div>;
  const input = "mt-1 min-h-11 w-full rounded-lg border border-slate-600 bg-[#111820] p-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#c3a477]";
  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-sm text-slate-200" htmlFor="broker-name">Name *<input id="broker-name" name="name" autoComplete="name" required maxLength={200} className={input}/></label>
    <label className="block text-sm text-slate-200" htmlFor="broker-email">Email *<input id="broker-email" name="email" type="email" autoComplete="email" required maxLength={254} className={input}/></label>
    <label className="block text-sm text-slate-200" htmlFor="broker-phone">Phone (optional)<input id="broker-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={input}/></label>
    <label className="block text-sm text-slate-200" htmlFor="broker-message">How can we help?<textarea id="broker-message" name="message" rows={3} maxLength={5000} className={input}/></label>
    <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"/>
    <p className="text-xs leading-relaxed text-slate-400">{CONSENT_TEXT.notice} <a href="/privacy" className="underline">Privacy Policy</a>.</p>
    {status === "error" && <p role="alert" className="text-sm text-amber-200">We couldn’t record your request. Please retry or <a href="/contact" className="underline">contact our team</a>.</p>}
    <button disabled={busy} className="min-h-11 w-full rounded-lg bg-[#c3a477] p-3 font-medium text-[#111820] disabled:opacity-60">{busy ? "Sending…" : "Request a consultation"}</button>
  </form>;
}
