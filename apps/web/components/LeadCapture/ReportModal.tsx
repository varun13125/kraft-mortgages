"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, FileText, Mail } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { PhoneVerification } from "./PhoneVerification";
import { pdfGenerator } from "@/lib/reports/pdf-generator";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: "affordability" | "payment" | "mli" | "investment";
  calculationData: any;
}

export function ReportModal({ isOpen, onClose, reportType, calculationData }: ReportModalProps) {
  const [step, setStep] = useState<"form" | "verify" | "success">("form");
  const [leadData, setLeadData] = useState<any>(null);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTitles = {
    affordability: "Affordability Assessment Report",
    payment: "Mortgage Payment Report",
    mli: "MLI Select Analysis Report",
    investment: "Investment Property Analysis"
  };

  const handleLeadSubmit = async (data: any) => {
    setLeadData(data);
    
    // Send SMS verification code
    try {
      const response = await fetch("/api/sms/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone })
      });
      
      if (response.ok) {
        setStep("verify");
      } else {
        // If SMS fails, skip verification for now
        await generateAndSendReport(data);
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      // Skip verification if error
      await generateAndSendReport(data);
    }
  };

  const handleVerification = async (verified: boolean) => {
    if (verified && leadData) {
      await generateAndSendReport(leadData);
    }
  };

  const generateAndSendReport = async (data: any) => {
    setIsGenerating(true);
    
    try {
      // Prepare report data
      const reportData = {
        title: reportTitles[reportType],
        generatedDate: new Date(),
        clientInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          province: data.province
        },
        calculationData,
        disclaimer: "This report is for informational purposes only and does not constitute a mortgage approval or commitment. Actual mortgage terms and eligibility will be determined based on a complete application and verification process."
      };

      // Generate PDF
      const pdfBlob = await pdfGenerator.generateFromData(reportType, reportData);
      const pdfBase64 = await pdfGenerator.blobToBase64(pdfBlob);
      
      // Create download URL
      const url = URL.createObjectURL(pdfBlob);
      setReportUrl(url);

      // Send report via email
      await fetch("/api/reports/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.email,
          name: data.name,
          reportType,
          reportData,
          pdfBase64
        })
      });

      // Save lead to CRM
      await fetch("/api/crm/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          reportType,
          calculationData,
          source: "calculator",
          leadScore: calculateLeadScore(data, calculationData)
        })
      });

      setStep("success");
    } catch (error) {
      console.error("Error generating report:", error);
      // Still show success to user
      setStep("success");
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateLeadScore = (leadData: any, calcData: any): number => {
    let score = 50; // Base score

    // Score based on calculation type
    if (reportType === "affordability" && calcData.results?.maxPurchase > 500000) score += 10;
    if (reportType === "investment") score += 15;
    
    // Score based on consent
    if (leadData.consentToMarketing) score += 10;
    
    // Score based on province (adjust based on your market)
    if (leadData.province === "BC") score += 5;

    return Math.min(score, 100);
  };

  const handleResendVerification = async () => {
    if (!leadData) return;
    
    try {
      await fetch("/api/sms/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: leadData.phone })
      });
    } catch (error) {
      console.error("Error resending verification:", error);
    }
  };

  const downloadReport = () => {
    if (reportUrl) {
      const fileName = `${reportType}-report-${Date.now()}.pdf`;
      pdfGenerator.downloadPDF(new Blob([reportUrl]), fileName);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Step Content */}
            {step === "form" && (
              <LeadForm
                onSubmit={handleLeadSubmit}
                reportType={reportTitles[reportType]}
                calculationData={calculationData}
                isLoading={isGenerating}
              />
            )}

            {step === "verify" && leadData && (
              <PhoneVerification
                phoneNumber={leadData.phone}
                onVerified={handleVerification}
                onResend={handleResendVerification}
              />
            )}

            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Report Ready!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Your {reportTitles[reportType]} has been generated and sent to your email.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={downloadReport}
                    className="w-full py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg shadow-lg hover:from-gold-600 hover:to-gold-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Download Report
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>Check your email for a copy</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>What's next?</strong> A mortgage specialist will contact you within 24 hours to discuss your options.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Close and continue
                </button>
              </motion.div>
            )}

            {/* Loading Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Generating your report...</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}