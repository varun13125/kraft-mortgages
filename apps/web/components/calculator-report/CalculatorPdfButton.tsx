"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import PdfLeadModal from "@/components/PdfLeadModal";
import type { ReportSection } from "./generateGenericReport";

interface CalculatorPdfButtonProps {
  /** CRM source tag, e.g. "calculator-pdf-commercial-cap-rate" */
  source: string;
  /** Modal + report title, e.g. "Your Cap Rate Analysis" */
  title: string;
  subtitle?: string;
  /** Shown on the report cover, e.g. "Commercial Cap Rate Calculator" */
  calculatorName: string;
  leadMessage?: string;
  mortgageType?: string;
  amount?: number;
  /** Called at download time so the report reflects the current inputs. */
  getSections: () => ReportSection[];
  educationalContent?: string;
  className?: string;
}

/**
 * "Download Your Free Report (PDF)" button + lead capture modal — the same pattern as the
 * residential calculator pages (PdfLeadModal + generateGenericReport, loaded on demand).
 */
export default function CalculatorPdfButton({
  source,
  title,
  subtitle,
  calculatorName,
  leadMessage,
  mortgageType,
  amount,
  getSections,
  educationalContent,
  className,
}: CalculatorPdfButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className ?? "mt-8 max-w-xl mx-auto"}>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
      >
        <Download className="w-5 h-5" />
        Download Your Free Report (PDF)
      </motion.button>
      <PdfLeadModal
        isOpen={open}
        onClose={() => setOpen(false)}
        source={source}
        title={title}
        subtitle={subtitle}
        leadMessage={leadMessage ?? `PDF Report Download — ${calculatorName}`}
        mortgageType={mortgageType}
        amount={amount !== undefined && Number.isFinite(amount) ? String(Math.round(amount)) : undefined}
        onGeneratePdf={async (userName) => {
          const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
          generateGenericReport({
            title,
            calculatorName,
            userName,
            sections: getSections(),
            educationalContent,
          });
        }}
      />
    </div>
  );
}
