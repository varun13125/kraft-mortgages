const fs = require('fs');
const path = require('path');

const BASE = 'apps/web/app/(site)/calculators';

function addPdfModal(slug, importLine, stateLine, modalBlock, targetPattern) {
  const filePath = path.join(BASE, slug, 'page.tsx');
  let code = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Add import after last import
  const allImports = [...code.matchAll(/^import .+;$/gm)];
  const last = allImports[allImports.length - 1];
  const pos = last.index + last[0].length;
  code = code.slice(0, pos) + '\n' + importLine + code.slice(pos);
  
  // 2. Add state after component function opening
  const funcMatch = code.match(/export default function \w+/);
  const bodyStart = code.indexOf('\n', code.indexOf('{', funcMatch.index)) + 1;
  code = code.slice(0, bodyStart) + '  ' + stateLine + '\n' + code.slice(bodyStart);
  
  // 3. Add Download to lucide import
  const lucideMatch = code.match(/import \{([^}]+)\} from "lucide-react"/);
  if (lucideMatch && !lucideMatch[1].includes('Download')) {
    code = code.replace(lucideMatch[0], `import { ${lucideMatch[1].trim()}, Download } from "lucide-react"`);
  }
  
  // 4. Insert modal before target
  const targetIdx = code.indexOf(targetPattern);
  if (targetIdx === -1) throw new Error(`Target not found: ${targetPattern}`);
  const lineStart = code.lastIndexOf('\n', targetIdx) + 1;
  code = code.slice(0, lineStart) + modalBlock + '\n' + code.slice(lineStart);
  
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`OK: ${slug}`);
}

// 1. INVESTMENT
addPdfModal('investment',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-investment"
                title="Your Investment Property Analysis"
                subtitle="Get a personalized PDF with your investment analysis"
                leadMessage="PDF Report Download — Investment Calculator"
                mortgageType="Investment"
                amount={price.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Investment Property Analysis",
                    calculatorName: "Investment Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Property Value", value: "$" + Math.round(price).toLocaleString("en-CA") },
                          { label: "Down Payment", value: "$" + Math.round(down).toLocaleString("en-CA") },
                          { label: "Mortgage Rate", value: rate + "%" },
                          { label: "Monthly Rent", value: "$" + Math.round(rent).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Cash Flow", value: "$" + Math.round(r.cf).toLocaleString("en-CA"), highlight: true },
                          { label: "Cap Rate", value: r.capRate.toFixed(2) + "%", highlight: true },
                          { label: "DSCR", value: r.dscr.toFixed(2) },
                          { label: "NOI", value: "$" + Math.round(r.noi).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "A good investment typically has positive cash flow, DSCR >= 1.2, and cap rate >= 4%. Lenders focus heavily on DSCR."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

// 2. LAND TRANSFER TAX
addPdfModal('land-transfer-tax',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-land-transfer-tax"
                title="Your Land Transfer Tax Estimate"
                subtitle="Get a personalized PDF with your LTT details"
                leadMessage="PDF Report Download — Land Transfer Tax Calculator"
                mortgageType="Purchase"
                amount={purchasePrice.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Land Transfer Tax Estimate",
                    calculatorName: "Land Transfer Tax Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Purchase Price", value: "$" + Math.round(purchasePrice).toLocaleString("en-CA") },
                          { label: "Province", value: province },
                          { label: "First-Time Buyer?", value: isFirstTime ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "Tax Results",
                        rows: [
                          { label: "Provincial LTT", value: "$" + Math.round(results.tax).toLocaleString("en-CA"), highlight: true },
                          ...(results.mltt ? [{ label: "Municipal LTT", value: "$" + Math.round(results.mltt.total).toLocaleString("en-CA") }] : []),
                          { label: "Rebate", value: "$" + Math.round(results.rebate).toLocaleString("en-CA") },
                          { label: "Total Owing", value: "$" + Math.round(results.totalOwing).toLocaleString("en-CA"), highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Land transfer tax is a one-time fee paid when you purchase property. Rates vary by province. First-time buyers may qualify for rebates."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

// 3. REFINANCE VS HELOC VS SECOND
addPdfModal('refinance-vs-heloc-vs-second',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-refinance-vs-heloc-vs-second"
                title="Your Equity Options Comparison"
                subtitle="Get a personalized PDF comparing your equity access options"
                leadMessage="PDF Report Download — Refinance vs HELOC vs Second Calculator"
                mortgageType="Refinance"
                amount={homeValue.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Equity Options Comparison",
                    calculatorName: "Refinance vs HELOC vs Second Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Value", value: "$" + Math.round(homeValue).toLocaleString("en-CA") },
                          { label: "Current Balance", value: "$" + Math.round(firstBalance).toLocaleString("en-CA") },
                          { label: "Current Rate", value: firstRate + "%" },
                          { label: "Cash Needed", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Available Equity", value: "$" + Math.round(equity).toLocaleString("en-CA") },
                          { label: "LTV", value: ltv.toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "Refinance",
                        rows: [
                          { label: "New Payment", value: "$" + Math.round(results.refiMonthly).toLocaleString("en-CA") },
                          { label: "Payment Change", value: "$" + Math.round(results.refiPaymentChange).toLocaleString("en-CA") },
                          { label: "Total Cost (5yr)", value: "$" + Math.round(results.refiTotalCost5yr).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "HELOC",
                        rows: [
                          { label: "Amount", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Rate", value: results.helocRate + "%" },
                          { label: "Monthly Interest Only", value: "$" + Math.round(results.helocMonthly).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Second Mortgage",
                        rows: [
                          { label: "Amount", value: "$" + Math.round(cashNeeded).toLocaleString("en-CA") },
                          { label: "Rate", value: results.secondRate + "%" },
                          { label: "Monthly Payment", value: "$" + Math.round(results.secondMonthly).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Recommendation",
                        rows: [
                          { label: "Lowest Cost Option", value: results.cheapest, highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Each equity option has different costs and terms. Refinancing replaces your mortgage. HELOC offers flexible access. Second mortgage keeps your first intact."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

// 4. SELF-EMPLOYED
addPdfModal('self-employed',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-self-employed"
                title="Your Self-Employed Income Analysis"
                subtitle="Get a personalized PDF with your normalized income"
                leadMessage="PDF Report Download — Self-Employed Calculator"
                mortgageType="Self-Employed"
                amount=""
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Self-Employed Income Analysis",
                    calculatorName: "Self-Employed Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Latest Year NOA", value: "$" + Math.round(y2).toLocaleString("en-CA") },
                          { label: "Prior Year NOA", value: "$" + Math.round(y1).toLocaleString("en-CA") },
                          { label: "Two Years Ago NOA", value: "$" + Math.round(y3).toLocaleString("en-CA") },
                          { label: "Annual Addbacks", value: "$" + Math.round(addbacks).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Normalized Annual Income", value: "$" + Math.round(r.qualifyingIncome).toLocaleString("en-CA"), highlight: true },
                          { label: "3-Year Average", value: "$" + Math.round(r.threeYearAvg).toLocaleString("en-CA") },
                          { label: "Normalized Monthly", value: "$" + Math.round(r.qualifyingIncome / 12).toLocaleString("en-CA") },
                        ]
                      }
                    ],
                    educationalContent: "Lenders average your last 2 years of NOA income. Addbacks like business-use-of-home and CCA can significantly increase qualifying income."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

// 5. RENEWAL
addPdfModal('renewal',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-renewal"
                title="Your Mortgage Renewal Analysis"
                subtitle="Get a personalized PDF with your renewal comparison"
                leadMessage="PDF Report Download — Renewal Calculator"
                mortgageType="Renewal"
                amount={balance.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Mortgage Renewal Analysis",
                    calculatorName: "Renewal Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Current Balance", value: "$" + Math.round(balance).toLocaleString("en-CA") },
                          { label: "Current Rate", value: currentRate + "%" },
                          { label: "Months Remaining", value: String(monthsLeft) },
                          { label: "Market Rate", value: marketRate + "%" },
                          { label: "Prepayment Penalty", value: "$" + Math.round(penalty).toLocaleString("en-CA") },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Current Payment", value: "$" + Math.round(currPay).toLocaleString("en-CA") },
                          { label: "New Payment", value: "$" + Math.round(newPay).toLocaleString("en-CA"), highlight: true },
                          { label: "Monthly Savings", value: "$" + Math.round(monthlySavings).toLocaleString("en-CA") },
                          { label: "Break-Even Months", value: String(breakEvenMonths) },
                          { label: "Worth Switching?", value: worthSwitching ? "Yes" : "Consider waiting", highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Always shop around at renewal. A broker can negotiate better rates across 40+ lenders at no cost."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

// 6. PRE-APPROVAL
addPdfModal('pre-approval',
  'import PdfLeadModal from "@/components/PdfLeadModal";',
  'const [showPdfModal, setShowPdfModal] = useState(false);',
  `            {/* PDF Report Download */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowPdfModal(true)}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-semibold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Download className="w-5 h-5" />
                Download Your Free Report (PDF)
              </motion.button>
              <PdfLeadModal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                source="calculator-pdf-pre-approval"
                title="Your Pre-Approval Estimate"
                subtitle="Get a personalized PDF with your pre-qualification details"
                leadMessage="PDF Report Download — Pre-Approval Calculator"
                mortgageType="Pre-Approval"
                amount={grossIncome.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Pre-Approval Estimate",
                    calculatorName: "Pre-Approval Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Gross Annual Income", value: "$" + Math.round(grossIncome).toLocaleString("en-CA") },
                          { label: "Down Payment", value: "$" + Math.round(downPayment).toLocaleString("en-CA") },
                          { label: "Monthly Debts", value: "$" + Math.round(monthlyDebts).toLocaleString("en-CA") },
                          { label: "Credit Score", value: String(creditScore) },
                        ]
                      },
                      {
                        title: "Pre-Approval Results",
                        rows: [
                          { label: "Max Purchase Price", value: "$" + Math.round(results.maxPurchasePrice).toLocaleString("en-CA"), highlight: true },
                          { label: "Max Mortgage Amount", value: "$" + Math.round(results.maxMortgageAmount).toLocaleString("en-CA") },
                          { label: "Monthly Payment", value: "$" + Math.round(results.monthlyPayment).toLocaleString("en-CA") },
                          { label: "GDS Ratio", value: results.gdsRatio.toFixed(1) + "%" },
                          { label: "TDS Ratio", value: results.tdsRatio.toFixed(1) + "%" },
                          { label: "Qualifies?", value: results.qualifies ? "Yes" : "No", highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Pre-approval gives you a clear picture of your purchasing power before you start house hunting. A mortgage broker can get you pre-approved across multiple lenders."
                  });
                }}
              />
            </div>`,
  '<ComplianceBanner feature="LEAD_FORM" />'
);

console.log("\nAll 6 re-patched.");
