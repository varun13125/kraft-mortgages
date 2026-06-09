import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export default function TrustAssuranceCard() {
  return (
    <div className="trust-assurance-card rounded-xl border border-blue-200 bg-blue-50/60 backdrop-blur-sm p-5 sm:p-6 my-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 border border-blue-200">
            <Shield className="w-5 h-5 text-blue-700" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Regulatory Transparency
            </span>
          </div>

          <p className="text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-slate-800">
              Kraft Mortgages Canada Inc.
            </span>{" "}
            is fully licensed by{" "}
            <span className="font-medium text-slate-800">
              BCFSA, RECA, and FSRA
            </span>
            . All files are processed in absolute compliance with the federal{" "}
            <span className="font-medium text-slate-800">
              Proceeds of Crime (Money Laundering) and Terrorist Financing Act
              (PCMLTFA)
            </span>
            . Read our comprehensive{" "}
            <Link
              href="/compliance-security"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 underline decoration-blue-300 decoration-2 underline-offset-2 hover:text-blue-900 hover:decoration-blue-600 transition-colors"
            >
              Compliance, Security &amp; Consumer Protection Hub
              <svg
                className="w-3 h-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>{" "}
            to discover how your confidential information is protected under{" "}
            <span className="font-medium text-slate-800">
              Section 44 regulations
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
