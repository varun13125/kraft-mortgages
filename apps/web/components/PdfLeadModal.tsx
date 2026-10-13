"use client";

import { useState, useEffect, useCallback, useRef, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Loader2, AlertTriangle, Phone, CheckCircle } from "lucide-react";
import { BUSINESS } from "@/lib/seo/business-config";
import { WHATSAPP_LINK, WHATSAPP_PHONE_DISPLAY } from "@/components/icons/WhatsAppIcon";
import { CONSENT_TEXT, consentFields } from "@/lib/compliance/consent";

interface PdfLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; // e.g., "calculator-pdf-affordability"
  title: string;  // e.g., "Your Mortgage Analysis"
  subtitle?: string; // e.g., "Get a personalized PDF with your complete analysis"
  leadMessage?: string; // context for the lead CRM submission
  mortgageType?: string;
  amount?: string;
  onGeneratePdf: (userName: string) => void | Promise<void>;
}

/** Outcome of sending the lead to /api/contact. */
type LeadStatus = "idle" | "sending" | "sent" | "failed";

const LEAD_TIMEOUT_MS = 20000;

export default function PdfLeadModal({
  isOpen,
  onClose,
  source,
  title,
  subtitle,
  leadMessage,
  mortgageType,
  amount,
  onGeneratePdf,
}: PdfLeadModalProps) {
  const [step, setStep] = useState<"form" | "downloading" | "done">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // CASL / CRTC consent (BUG-005): both optional and NEVER pre-ticked. An automated AI call is only
  // placed by /api/contact when consentToCall === true.
  const [callConsent, setCallConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [callDispatched, setCallDispatched] = useState(false);
  const fieldId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [pdfFailed, setPdfFailed] = useState(false);
  // One manual retry of the lead submission is offered after a failure
  const [retryUsed, setRetryUsed] = useState(false);
  const leadSentRef = useRef(false);

  const resetForm = useCallback(() => {
    setStep("form");
    setLoading(false);
    setError("");
    setName("");
    setEmail("");
    setPhone("");
    setCallConsent(false);
    setMarketingConsent(false);
    setCallDispatched(false);
    setLeadStatus("idle");
    setPdfFailed(false);
    setRetryUsed(false);
    leadSentRef.current = false;
  }, []);

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /** POST the lead. Resolves true only when the server accepted it (2xx). Never throws. */
  const sendLead = useCallback(async (): Promise<boolean> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LEAD_TIMEOUT_MS);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: leadMessage || `PDF Report Download — ${title}. Source: ${source}`,
          source,
          mortgageType: mortgageType || "",
          amount: amount || "",
          ...consentFields(callConsent, marketingConsent),
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        // 400 (validation), 429 (rate limit), 5xx/502 (lead not recorded) — the lead did NOT go through
        console.error("Lead submission failed:", res.status);
        return false;
      }
      // Only say a call is coming when the server actually placed one
      const json = await res.json().catch(() => null);
      setCallDispatched(callConsent && json?.callDispatched === true);
      return true;
    } catch (err) {
      console.error("Lead submission failed:", err);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }, [name, email, phone, leadMessage, title, source, mortgageType, amount, callConsent, marketingConsent]);

  const generatePdf = useCallback(async () => {
    setStep("downloading");
    setPdfFailed(false);
    try {
      await onGeneratePdf(name);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPdfFailed(true);
    }
    setStep("done");
  }, [onGeneratePdf, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setLoading(true);
    setError("");

    // Don't send a duplicate lead if the user re-opens the form after a PDF error
    if (!leadSentRef.current) {
      setLeadStatus("sending");
      const ok = await sendLead();
      leadSentRef.current = ok;
      setLeadStatus(ok ? "sent" : "failed");
    }

    // The visitor still gets their report even if the lead could not be recorded
    await generatePdf();
    setLoading(false);
  };

  const handleRetryLead = async () => {
    if (retryUsed || leadSentRef.current) return;
    setRetryUsed(true);
    setLeadStatus("sending");
    const ok = await sendLead();
    leadSentRef.current = ok;
    setLeadStatus(ok ? "sent" : "failed");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#1a1a2e] border border-gold-500/30 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {step === "form" && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/20 mb-4">
                    <FileText className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {subtitle || "Get a personalized PDF with your complete mortgage analysis"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                      placeholder="(604) 555-0199"
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-3">
                      <input
                        id={`${fieldId}-consent-call`}
                        type="checkbox"
                        checked={callConsent}
                        onChange={(e) => setCallConsent(e.target.checked)}
                        className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-gold-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                      />
                      <label htmlFor={`${fieldId}-consent-call`} className="text-xs leading-relaxed text-gray-300 cursor-pointer">
                        {CONSENT_TEXT.call}
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        id={`${fieldId}-consent-marketing`}
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-gold-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                      />
                      <label htmlFor={`${fieldId}-consent-marketing`} className="text-xs leading-relaxed text-gray-300 cursor-pointer">
                        {CONSENT_TEXT.marketing}
                      </label>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold-500 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gold-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Get My Free Report
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400">
                    {CONSENT_TEXT.notice}{" "}
                    <Link href="/privacy" className="underline text-gray-300 hover:text-gold-400">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </div>
            )}

            {step === "downloading" && (
              <div className="p-8 text-center">
                <Loader2 className="w-12 h-12 text-gold-400 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Generating Your Report...
                </h3>
                <p className="text-sm text-gray-400">
                  Preparing your personalized mortgage analysis
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="p-8 text-center">
                {pdfFailed ? (
                  <>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      We couldn&apos;t create your PDF
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Something went wrong while building the report on your device.
                    </p>
                    <button
                      onClick={generatePdf}
                      className="mb-6 bg-gold-500 text-black font-semibold py-3 px-6 rounded-xl hover:bg-gold-400 transition-colors"
                    >
                      Try the download again
                    </button>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                      <Download className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      Your Report is Ready!
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Your PDF has been downloaded — check your downloads folder.
                    </p>
                  </>
                )}

                {leadStatus === "sent" && (
                  <p className="flex items-start gap-2 text-left text-sm text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6" role="status">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {callDispatched
                        ? "We've received your details. Our AI assistant is calling you now, as you requested."
                        : "We've received your details. A Kraft Mortgages advisor will follow up with you."}
                    </span>
                  </p>
                )}

                {leadStatus === "sending" && (
                  <p className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6" role="status">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending your details…
                  </p>
                )}

                {leadStatus === "failed" && (
                  <div className="text-left text-sm bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6" role="alert">
                    <p className="flex items-start gap-2 text-amber-200 font-semibold mb-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>We couldn&apos;t send your details to our team.</span>
                    </p>
                    <p className="text-gray-300 mb-3">
                      To talk to an advisor, call us at{" "}
                      <a href={`tel:${BUSINESS.telephone}`} className="text-gold-400 underline">
                        {BUSINESS.telephoneDisplay}
                      </a>{" "}
                      or WhatsApp{" "}
                      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline">
                        {WHATSAPP_PHONE_DISPLAY}
                      </a>
                      .
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!retryUsed && (
                        <button
                          onClick={handleRetryLead}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-gray-100 font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Try sending again
                        </button>
                      )}
                      <a
                        href={`tel:${BUSINESS.telephone}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-gold-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gold-400 transition-colors"
                      >
                        <Phone className="w-4 h-4" /> Call {BUSINESS.telephoneDisplay}
                      </a>
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="bg-gold-500 text-black font-semibold py-3 px-6 rounded-xl hover:bg-gold-400 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
