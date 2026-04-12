"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Loader2 } from "lucide-react";

interface CalculatorResults {
  aMonthly: number;
  bMonthly: number;
  aInterest: number;
  bInterest: number;
  aTotalCost: number;
  bTotalCost: number;
  bFeeAmount: number;
  additionalTax: number;
  netSavings: number;
  bWins: boolean;
  investmentTaxSavings: number;
  monthlyDiff: number;
}

interface CalculatorInputs {
  mortgageAmount: number;
  propertyValue: number;
  aRate: number;
  bRate: number;
  term: number;
  amortization: number;
  province: string;
  additionalIncome: number;
  effectiveTaxRate: number;
  isInvestment: boolean;
  bFee: number;
}

interface PdfLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculatorResults;
  inputs: CalculatorInputs;
}

export default function PdfLeadModal({
  isOpen,
  onClose,
  results,
  inputs,
}: PdfLeadModalProps) {
  const [step, setStep] = useState<"form" | "downloading" | "done">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setStep("form");
    setLoading(false);
    setError("");
  }, []);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setLoading(true);
    setError("");

    try {
      // Submit lead to CRM
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `PDF Report Download — Self-Employed A vs B Calculator. Property Value: $${inputs.propertyValue.toLocaleString()}, Mortgage: $${inputs.mortgageAmount.toLocaleString()}`,
          source: "calculator-pdf-self-employed-a-vs-b",
          mortgageType: "Self-Employed",
          amount: inputs.mortgageAmount.toString(),
        }),
      });

      if (!res.ok) {
        console.error("Lead submission failed:", await res.text());
        // Don't block PDF on lead submission failure
      }

      // Generate and download PDF
      setStep("downloading");
      const { generateCalculatorReport } = await import(
        "./calculator-report/generateReport"
      );
      await generateCalculatorReport({
        userName: name,
        results,
        inputs,
      });
      setStep("done");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#1a1a2e] border border-gold-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            {/* Close button */}
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
                    Download Your Free Report
                  </h3>
                  <p className="text-sm text-gray-400">
                    Get a personalized PDF with your complete mortgage analysis
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                      placeholder="(604) 555-1234"
                    />
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

                  <p className="text-xs text-gray-500 text-center">
                    Your information is confidential. We&apos;ll only use it to
                    send your report and follow up if you&apos;d like.
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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                  <Download className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Your Report is Ready!
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Your report has been sent to your email! Check your downloads
                  folder.
                </p>
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
