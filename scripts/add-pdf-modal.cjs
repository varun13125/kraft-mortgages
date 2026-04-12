#!/usr/bin/env node
/**
 * Add PDF lead capture to all remaining calculators.
 * Inserts: import, state, button, and PdfLeadModal component.
 */

const fs = require('fs');
const path = require('path');
const BASE = 'apps/web/app/(site)/calculators';

// For each calculator, we need to know the exact variables to reference in onGeneratePdf.
// The script will generate the code and write it.

function fmt(n) {
  return '"$" + Math.round(' + n + ').toLocaleString("en-CA")';
}

function pct(n) {
  return n + '.toFixed(1) + "%"';
}

// Template for the generic onGeneratePdf
function makeGenericModal(slug, source, title, subtitle, varsList, sectionsCode, eduContent, mortgageType, amountExpr) {
  return `            {/* PDF Report Download */}
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
                source="${source}"
                title="${title}"
                subtitle="${subtitle}"
                leadMessage="PDF Report Download — ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                mortgageType="${mortgageType}"
                amount={${amountExpr || '""'}.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "${title}",
                    calculatorName: "${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Calculator",
                    userName,
                    sections: ${sectionsCode},
                    educationalContent: ${JSON.stringify(eduContent || '')}
                  });
                }}
              />
            </div>`;
}

const patches = [
  // AFFORDABILITY
  {
    slug: 'affordability',
    modal: makeGenericModal('affordability', 'calculator-pdf-affordability', 'Your Affordability Analysis',
      'Get a personalized PDF with your affordability analysis',
      'income,debts,propTax,heat,condoFees,rate,principal,monthlyPI,housingAnnual,gds,tds,pass,qualRate',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Annual Income", value: ${fmt('income')} },
                          { label: "Annual Debts", value: ${fmt('debts')} },
                          { label: "Property Tax (annual)", value: ${fmt('propTax')} },
                          { label: "Heating (annual)", value: ${fmt('heat')} },
                          { label: "Condo Fees (monthly)", value: ${fmt('condoFees')} },
                          { label: "Interest Rate", value: rate + "%" },
                          { label: "Qualifying Rate (Stress Test)", value: qualRate + "%" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Maximum Mortgage Amount", value: ${fmt('principal')}, highlight: true },
                          { label: "Monthly P&I Payment", value: ${fmt('monthlyPI')} },
                          { label: "Annual Housing Costs", value: ${fmt('housingAnnual')} },
                          { label: "GDS Ratio", value: ${pct('gds')} + " (max 39%)" },
                          { label: "TDS Ratio", value: ${pct('tds')} + " (max 44%)" },
                          { label: "Passes Affordability Test", value: pass ? "Yes" : "No", highlight: true },
                        ]
                      }
                    ]`,
      "Your Gross Debt Service (GDS) ratio shows what percentage of your income goes to housing costs. The Total Debt Service (TDS) ratio includes all debts. Most lenders require GDS ≤ 39% and TDS ≤ 44%. If you don't pass, consider reducing debts, increasing your down payment, or exploring alternative lending options.",
      'Mortgage', 'principal'
    ),
    targetLine: '                <ComplianceBanner feature="LEAD_FORM" />',
    // Insert BEFORE this line (the first ComplianceBanner in results area)
  },
  // PAYMENT
  {
    slug: 'payment',
    modal: makeGenericModal('payment', 'calculator-pdf-payment', 'Your Payment Analysis',
      'Get a personalized PDF with your payment breakdown',
      'principal,rate,years,monthly,acceleratedBiweekly,annualSavings',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('principal')} },
                          { label: "Interest Rate", value: rate + "%" },
                          { label: "Amortization", value: years + " years" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Payment", value: ${fmt('monthly')}, highlight: true },
                          { label: "Accelerated Biweekly", value: ${fmt('acceleratedBiweekly')} },
                          { label: "Annual Savings (Biweekly)", value: ${fmt('annualSavings')} },
                          { label: "Total Paid (Monthly, over amortization)", value: ${fmt('monthly * years * 12')} },
                        ]
                      }
                    ]`,
      "Switching from monthly to accelerated biweekly payments can save you thousands in interest and help you pay off your mortgage years faster.",
      'Mortgage', 'principal'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // RENT VS BUY
  {
    slug: 'rent-vs-buy',
    modal: makeGenericModal('rent-vs-buy', 'calculator-pdf-rent-vs-buy', 'Your Rent vs Buy Analysis',
      'Get a personalized PDF with your rent vs buy comparison',
      'homePrice,downPaymentPct,mortgageRate,amortization,monthlyRent,appreciation,investmentReturn,results',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: ${fmt('homePrice')} },
                          { label: "Down Payment", value: downPaymentPct + "%" },
                          { label: "Mortgage Rate", value: mortgageRate + "%" },
                          { label: "Monthly Rent", value: ${fmt('monthlyRent')} },
                          { label: "Appreciation Rate", value: appreciation + "%/yr" },
                          { label: "Investment Return", value: investmentReturn + "%/yr" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Cost of Buying", value: ${fmt('results.buyMonthly')}, highlight: true },
                          { label: "Monthly Rent", value: ${fmt('monthlyRent')} },
                          { label: "Monthly Difference", value: ${fmt('Math.abs(results.buyMonthly - monthlyRent)')} },
                          { label: "Mortgage Amount", value: ${fmt('results.mortgage')} },
                          ...(results.breakEvenYear ? [{ label: "Break-Even Year", value: "Year " + results.breakEvenYear, highlight: true }] : []),
                        ]
                      }
                    ]`,
      "The rent vs buy decision depends on more than just monthly costs. Consider long-term wealth building through home equity, flexibility of renting, and your personal goals.",
      'Purchase', 'homePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // STRESS TEST
  {
    slug: 'stress-test',
    modal: makeGenericModal('stress-test', 'calculator-pdf-stress-test', 'Your Stress Test Analysis',
      'Get a personalized PDF with your stress test results',
      'purchasePrice,downPaymentPct,contractRate,amortYears,propertyTax,heat,condoFees,otherDebts,stressRate,regularPayment,stressPayment,incomeNeededGDS,incomeNeededTDS',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Purchase Price", value: ${fmt('purchasePrice')} },
                          { label: "Down Payment", value: downPaymentPct + "%" },
                          { label: "Contract Rate", value: contractRate + "%" },
                          { label: "Stress Test Rate", value: stressRate.toFixed(2) + "%" },
                          { label: "Amortization", value: amortYears + " years" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Payment (Contract Rate)", value: ${fmt('regularPayment')} },
                          { label: "Monthly Payment (Stress Test)", value: ${fmt('stressPayment')}, highlight: true },
                          { label: "Monthly Increase", value: ${fmt('stressPayment - regularPayment')} },
                          { label: "Income Needed (GDS)", value: ${fmt('incomeNeededGDS')} + "/yr", highlight: true },
                          { label: "Income Needed (TDS)", value: ${fmt('incomeNeededTDS')} + "/yr" },
                        ]
                      }
                    ]`,
      "The mortgage stress test ensures you can afford your payments if rates rise. You must qualify at the higher of your contract rate + 2% or 5.25%.",
      'Mortgage', 'purchasePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // PRE-APPROVAL (special - uses preApprovalCalc function)
  {
    slug: 'pre-approval',
    modal: makeGenericModal('pre-approval', 'calculator-pdf-pre-approval', 'Your Pre-Approval Estimate',
      'Get a personalized PDF with your pre-qualification details',
      'grossIncome,downPayment,heatingCosts,propertyTax,condoFees,monthlyDebts,mortgageType',
      `(() => {
                      const r = preApprovalCalc({ grossIncome, downPayment, heatingCosts, propertyTax, condoFees, monthlyDebts, mortgageType });
                      return [
                        {
                          title: "Your Inputs",
                          rows: [
                            { label: "Gross Annual Income", value: ${fmt('grossIncome')} },
                            { label: "Down Payment", value: ${fmt('downPayment')} },
                            { label: "Monthly Debts", value: ${fmt('monthlyDebts')} },
                            { label: "Mortgage Type", value: mortgageType },
                          ]
                        },
                        {
                          title: "Pre-Approval Results",
                          rows: [
                            { label: "Max Mortgage Amount", value: ${fmt('r.maxMortgageAmount')}, highlight: true },
                            { label: "Monthly Payment", value: ${fmt('r.monthlyPayment')} },
                            { label: "GDS Ratio", value: (r.gdsRatio * 100).toFixed(1) + "%" },
                            { label: "TDS Ratio", value: (r.tdsRatio * 100).toFixed(1) + "%" },
                            { label: "Passes?", value: r.pass ? "Yes" : "No", highlight: true },
                          ]
                        }
                      ];
                    })()`,
      "Pre-approval gives you a clear picture of your purchasing power before you start house hunting. A mortgage broker can get you pre-approved across multiple lenders.",
      'Pre-Approval', 'grossIncome'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // REFINANCE BREAK-EVEN
  {
    slug: 'refinance-break-even',
    modal: makeGenericModal('refinance-break-even', 'calculator-pdf-refinance-break-even', 'Your Refinance Break-Even Analysis',
      'Get a personalized PDF with your refinance analysis',
      'currentBalance,currentRate,currentPayment,remainingMonths,newRate,newTermYears,legalFees,appraisalFees,penaltyEstimate,results',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Current Balance", value: ${fmt('currentBalance')} },
                          { label: "Current Rate", value: currentRate + "%" },
                          { label: "Current Payment", value: ${fmt('currentPayment')} },
                          { label: "Remaining Term", value: Math.round(remainingMonths / 12) + " years" },
                          { label: "New Rate", value: newRate + "%" },
                          { label: "Penalty Estimate", value: ${fmt('penaltyEstimate')} },
                          { label: "Legal + Appraisal", value: ${fmt('legalFees + appraisalFees')} },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "New Monthly Payment", value: ${fmt('results.newPayment')}, highlight: true },
                          { label: "Monthly Savings", value: ${fmt('results.monthlySavings')} },
                          { label: "Break-Even", value: results.breakEvenMonths === Infinity ? "Never" : results.breakEvenMonths + " months", highlight: true },
                          { label: "Interest Saved", value: ${fmt('results.interestSaved')} },
                          { label: "Net Savings", value: ${fmt('results.netSavings')}, highlight: true },
                        ]
                      }
                    ]`,
      "A refinance makes sense when your monthly savings recoup the switching costs within a reasonable timeframe — typically under 24 months.",
      'Refinance', 'currentBalance'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // MORTGAGE PENALTY
  {
    slug: 'mortgage-penalty',
    modal: makeGenericModal('mortgage-penalty', 'calculator-pdf-mortgage-penalty', 'Your Mortgage Penalty Estimate',
      'Get a personalized PDF with your penalty breakdown',
      'balance,contractRate,remainingMonths,mortgageType,currentPostedRate,results,monthlyInterestSaved',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Balance", value: ${fmt('balance')} },
                          { label: "Contract Rate", value: contractRate + "%" },
                          { label: "Remaining Term", value: remainingMonths + " months" },
                          { label: "Mortgage Type", value: mortgageType === "fixed" ? "Fixed" : "Variable" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Estimated Penalty", value: ${fmt('results.penalty')}, highlight: true },
                          { label: "Penalty Type", value: results.type },
                          ...(monthlyInterestSaved > 0 ? [{ label: "Monthly Interest Saved", value: ${fmt('monthlyInterestSaved')} }] : []),
                        ]
                      }
                    ]`,
      "Variable-rate mortgages typically carry a 3-month interest penalty. Fixed-rate mortgages use the Interest Rate Differential (IRD), which can be significantly higher.",
      'Mortgage', 'balance'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // CMHC INSURANCE
  {
    slug: 'cmhc-insurance',
    modal: makeGenericModal('cmhc-insurance', 'calculator-pdf-cmhc-insurance', 'Your CMHC Insurance Analysis',
      'Get a personalized PDF with your CMHC breakdown',
      'homePrice,downPaymentPct,mortgageRate,amortization,downPayment,baseMortgage,rate,premium,tier,totalMortgage,needsInsurance,monthlyBase,monthlyWithCMHC,monthlyImpact,interestCostOfCMHC',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: ${fmt('homePrice')} },
                          { label: "Down Payment", value: downPaymentPct + "% (" + ${fmt('downPayment')} + ")" },
                          { label: "Mortgage Rate", value: mortgageRate + "%" },
                          { label: "Amortization", value: amortization + " years" },
                        ]
                      },
                      {
                        title: "CMHC Details",
                        rows: [
                          { label: "Base Mortgage", value: ${fmt('baseMortgage')} },
                          { label: "Premium Rate", value: (rate * 100).toFixed(2) + "%" },
                          { label: "CMHC Premium", value: ${fmt('premium')}, highlight: true },
                          { label: "Premium Tier", value: tier },
                          { label: "Total Mortgage (with CMHC)", value: ${fmt('totalMortgage')}, highlight: true },
                          { label: "Insurance Required?", value: needsInsurance ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "Payment Impact",
                        rows: [
                          { label: "Monthly (without CMHC)", value: ${fmt('monthlyBase')} },
                          { label: "Monthly (with CMHC)", value: ${fmt('monthlyWithCMHC')} },
                          { label: "Monthly Increase", value: ${fmt('monthlyImpact')} },
                          { label: "Interest Cost of CMHC", value: ${fmt('interestCostOfCMHC')} },
                        ]
                      }
                    ]`,
      "CMHC mortgage loan insurance is required when your down payment is less than 20%. The premium is added to your mortgage and ranges from 4% to 15% of the loan amount.",
      'Purchase', 'homePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // FIRST-TIME HOME BUYER
  {
    slug: 'first-time-home-buyer',
    modal: makeGenericModal('first-time-home-buyer', 'calculator-pdf-first-time-home-buyer', 'Your First-Time Home Buyer Report',
      'Get a personalized PDF with your first-time buyer analysis',
      'purchasePrice,savings,province,isNewBuild,isCouple,marginalRate,results',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Purchase Price", value: ${fmt('purchasePrice')} },
                          { label: "Savings/Down Payment", value: ${fmt('savings')} },
                          { label: "Province", value: province },
                          { label: "Marginal Tax Rate", value: marginalRate + "%" },
                          { label: "Is Couple?", value: isCouple ? "Yes" : "No" },
                          { label: "New Build?", value: isNewBuild ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "First-Time Buyer Benefits",
                        rows: [
                          { label: "HBP Withdrawal", value: ${fmt('results.hbpWithdrawal || 0')}, highlight: true },
                          { label: "FHSA Tax Savings", value: ${fmt('results.fhsaTaxSavings || 0')} },
                          { label: "LTT Savings", value: ${fmt('results.lttSavings || 0')} },
                          { label: "GST Rebate", value: ${fmt('results.gstRebate || 0')} },
                        ]
                      },
                      {
                        title: "Mortgage Summary",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('results.mortgageAmount || 0')}, highlight: true },
                          { label: "CMHC Premium", value: ${fmt('results.cmhcPremium || 0')} },
                          { label: "Gap to Purchase", value: ${fmt('results.gap || 0')} },
                        ]
                      }
                    ]`,
      "First-time home buyers have access to the Home Buyers' Plan (RRSP withdrawal), FHSA ($40K tax-free), and provincial land transfer tax rebates.",
      'First-Time Buyer', 'purchasePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // CLOSING COSTS
  {
    slug: 'closing-costs',
    modal: `            {/* PDF Report Download */}
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
                source="calculator-pdf-closing-costs"
                title="Your Closing Costs Estimate"
                subtitle="Get a personalized PDF with your closing costs breakdown"
                leadMessage="PDF Report Download — Closing Costs Calculator"
                mortgageType="Purchase"
                amount={purchasePrice.toString()}
                onGeneratePdf={async (userName) => {
                  const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
                  generateGenericReport({
                    title: "Your Closing Costs Estimate",
                    calculatorName: "Closing Costs Calculator",
                    userName,
                    sections: [
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Purchase Price", value: "$" + Math.round(purchasePrice).toLocaleString("en-CA") },
                          { label: "Down Payment", value: downPaymentPct + "% (" + "$" + Math.round(downPayment).toLocaleString("en-CA") + ")" },
                          { label: "Province", value: province },
                          { label: "First-Time Buyer?", value: firstTime ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "Closing Costs Breakdown",
                        rows: costs.map(c => ({
                          label: c.name,
                          value: "$" + Math.round(c.amount).toLocaleString("en-CA"),
                          highlight: c.name.toLowerCase().includes("total") || c.name.toLowerCase().includes("land transfer"),
                        }))
                      }
                    ],
                    educationalContent: "Closing costs typically range from 1.5% to 4% of the purchase price. Always budget for these on top of your down payment."
                  });
                }}
              />
            </div>`,
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // LAND TRANSFER TAX
  {
    slug: 'land-transfer-tax',
    modal: `            {/* PDF Report Download */}
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
                          { label: "First-Time Buyer?", value: firstTime ? "Yes" : "No" },
                        ]
                      },
                      {
                        title: "Tax Results",
                        rows: [
                          { label: "Provincial LTT", value: "$" + Math.round(provincialTax).toLocaleString("en-CA"), highlight: true },
                          ...(municipalTax > 0 ? [{ label: "Municipal LTT", value: "$" + Math.round(municipalTax).toLocaleString("en-CA") }] : []),
                          { label: "First-Time Buyer Rebate", value: "$" + Math.round(rebate).toLocaleString("en-CA") },
                          { label: "Total Tax Payable", value: "$" + Math.round(totalTax).toLocaleString("en-CA"), highlight: true },
                        ]
                      }
                    ],
                    educationalContent: "Land transfer tax is a one-time fee paid when you purchase property. Rates vary by province. First-time buyers may qualify for rebates."
                  });
                }}
              />
            </div>`,
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // DOWN PAYMENT
  {
    slug: 'down-payment',
    modal: makeGenericModal('down-payment', 'calculator-pdf-down-payment', 'Your Down Payment Analysis',
      'Get a personalized PDF with your down payment breakdown',
      'homePrice,downPayment,downPct,needsInsurance,cmhc,mortgageAmount,totalMortgage,cashToClose',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: ${fmt('homePrice')} },
                          { label: "Down Payment", value: downPct.toFixed(1) + "% (" + ${fmt('downPayment')} + ")" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('mortgageAmount')}, highlight: true },
                          { label: "CMHC Required?", value: needsInsurance ? "Yes" : "No" },
                          { label: "CMHC Premium", value: needsInsurance ? ${fmt('cmhc')} : "N/A" },
                          { label: "Total Mortgage", value: ${fmt('totalMortgage')}, highlight: true },
                          { label: "Cash to Close", value: ${fmt('cashToClose')} },
                        ]
                      }
                    ]`,
      "The minimum down payment is 5% on the first $500K and 10% above. Under 20% requires CMHC insurance.",
      'Purchase', 'homePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // AMORTIZATION
  {
    slug: 'amortization',
    modal: makeGenericModal('amortization', 'calculator-pdf-amortization', 'Your Amortization Schedule',
      'Get a personalized PDF with your amortization details',
      'mortgage,rate,amortYears,extraMonthly,totalPaid,totalInterest,actualMonths',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('mortgage')} },
                          { label: "Interest Rate", value: rate + "%" },
                          { label: "Amortization", value: amortYears + " years" },
                          { label: "Extra Monthly", value: ${fmt('extraMonthly')} },
                        ]
                      },
                      {
                        title: "Summary",
                        rows: [
                          { label: "Total Paid", value: ${fmt('totalPaid')}, highlight: true },
                          { label: "Total Interest", value: ${fmt('totalInterest')}, highlight: true },
                          { label: "Actual Payoff", value: actualMonths + " months" },
                          { label: "Interest as % of Total", value: ((totalInterest / totalPaid) * 100).toFixed(1) + "%" },
                        ]
                      }
                    ]`,
      "In early years, most of your payment goes toward interest. Extra payments go directly to principal, dramatically reducing total interest.",
      'Mortgage', 'mortgage'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // REQUIRED INCOME
  {
    slug: 'required-income',
    modal: makeGenericModal('required-income', 'calculator-pdf-required-income', 'Your Required Income Analysis',
      'Get a personalized PDF with your income requirements',
      'homePrice,downPaymentPct,mortgageRate,amortization,downPayment,totalMortgage,isInsured,stRate,actualMonthly,stMonthly,incomeNeededGDS,incomeNeededTDS,minIncome',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Price", value: ${fmt('homePrice')} },
                          { label: "Down Payment", value: downPaymentPct + "%" },
                          { label: "Mortgage Rate", value: mortgageRate + "%" },
                          { label: "Stress Test Rate", value: stRate.toFixed(2) + "%" },
                          { label: "Amortization", value: amortization + " years" },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Required Income (GDS)", value: ${fmt('incomeNeededGDS')} + "/yr" },
                          { label: "Required Income (TDS)", value: ${fmt('incomeNeededTDS')} + "/yr" },
                          { label: "Minimum Required", value: ${fmt('minIncome')} + "/yr", highlight: true },
                          { label: "Total Mortgage", value: ${fmt('totalMortgage')} },
                          { label: "Monthly Payment (Actual)", value: ${fmt('actualMonthly')} },
                          { label: "Monthly Payment (Stress Test)", value: ${fmt('stMonthly')} },
                        ]
                      }
                    ]`,
      "This shows the minimum income needed to qualify for a specific purchase. Lenders use the stress test rate for qualification.",
      'Purchase', 'homePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // DEBT SERVICE RATIO
  {
    slug: 'debt-service-ratio',
    modal: makeGenericModal('debt-service-ratio', 'calculator-pdf-debt-service-ratio', 'Your Debt Service Ratio Analysis',
      'Get a personalized PDF with your DSR results',
      'annualIncome,coApplicantIncome,homePrice,results',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Total Annual Income", value: ${fmt('annualIncome + coApplicantIncome')} },
                          { label: "Monthly Housing", value: ${fmt('results.housingCosts')} },
                          { label: "Total Monthly Debts", value: ${fmt('results.totalDebts')} },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "GDS Ratio", value: results.gds.toFixed(1) + "%", highlight: true },
                          { label: "GDS Limit", value: (results.gdsLimit * 100) + "%" },
                          { label: "TDS Ratio", value: results.tds.toFixed(1) + "%", highlight: true },
                          { label: "TDS Limit", value: (results.tdsLimit * 100) + "%" },
                          { label: "Max Mortgage", value: ${fmt('results.maxMortgage')}, highlight: true },
                        ]
                      }
                    ]`,
      "Your GDS and TDS ratios are key metrics lenders use to assess affordability. Exceeding limits doesn't mean you can't get a mortgage — alternative lenders may have flexible requirements.",
      'Mortgage', 'homePrice'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // RATE COMPARISON
  {
    slug: 'rate-comparison',
    modal: makeGenericModal('rate-comparison', 'calculator-pdf-rate-comparison', 'Your Rate Comparison Report',
      'Get a personalized PDF with your rate comparison',
      'loanAmount,amortization,term,rates,monthlySavings',
      `(() => {
                      return [
                        {
                          title: "Loan Details",
                          rows: [
                            { label: "Loan Amount", value: ${fmt('loanAmount')} },
                            { label: "Amortization", value: amortization + " years" },
                            { label: "Term", value: term + " years" },
                          ]
                        },
                        ...rates.map(r => ({
                          title: r.label,
                          rows: [
                            { label: "Rate", value: r.rate + "%" },
                            { label: "Monthly Payment", value: "$" + Math.round(r.monthlyPayment).toLocaleString("en-CA"), highlight: true },
                            { label: "Total Interest (Term)", value: "$" + Math.round(r.totalInterestTerm).toLocaleString("en-CA") },
                            { label: "Total Paid (Term)", value: "$" + Math.round(r.totalPaidTerm).toLocaleString("en-CA") },
                          ]
                        })),
                        {
                          title: "Savings",
                          rows: [
                            { label: "Monthly Savings (best vs worst)", value: ${fmt('monthlySavings')} },
                            { label: "5-Year Savings", value: ${fmt('monthlySavings * term * 12')} },
                          ]
                        }
                      ];
                    })()`,
      "Even a 0.25% rate difference on a $500K mortgage saves ~$7,500 over 5 years. Always compare rates from multiple lenders.",
      'Mortgage', 'loanAmount'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // INVESTMENT
  {
    slug: 'investment',
    modal: makeGenericModal('investment', 'calculator-pdf-investment', 'Your Investment Property Analysis',
      'Get a personalized PDF with your investment analysis',
      'downPaymentPct,rate,amortization,rent,propertyValue,r',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Property Value", value: ${fmt('propertyValue')} },
                          { label: "Down Payment", value: downPaymentPct + "%" },
                          { label: "Mortgage Rate", value: rate + "%" },
                          { label: "Monthly Rent", value: ${fmt('rent')} },
                        ]
                      },
                      {
                        title: "Your Results",
                        rows: [
                          { label: "Monthly Cash Flow", value: ${fmt('r.cf')}, highlight: true },
                          { label: "Cap Rate", value: r.capRate.toFixed(2) + "%", highlight: true },
                          { label: "DSCR", value: r.dscr.toFixed(2) },
                          { label: "NOI", value: ${fmt('r.noi')} },
                          { label: "Good Investment?", value: r.cf > 0 && r.dscr >= 1.2 && r.capRate >= 4 ? "Yes" : "Review needed" },
                        ]
                      }
                    ]`,
      "A good investment typically has positive cash flow, DSCR ≥ 1.2, and cap rate ≥ 4%. Lenders focus heavily on DSCR.",
      'Investment', 'propertyValue'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // CONSTRUCTION PRO
  {
    slug: 'construction-pro',
    modal: makeGenericModal('construction-pro', 'calculator-pdf-construction-pro', 'Your Construction Cost Report',
      'Get a personalized PDF with your construction financing details',
      'draws,rate,result,totalProjectCost',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Construction Rate", value: rate + "%" },
                          { label: "Total Project Cost", value: ${fmt('totalProjectCost')} },
                          { label: "Number of Draws", value: String(draws.length) },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Total Interest Cost", value: ${fmt('result')}, highlight: true },
                        ]
                      }
                    ]`,
      "Construction financing uses draw-based payments where you only pay interest on amounts drawn at each stage.",
      'Construction', 'totalProjectCost'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // EXTRA PAYMENTS
  {
    slug: 'extra-payments',
    modal: makeGenericModal('extra-payments', 'calculator-pdf-extra-payments', 'Your Extra Payments Analysis',
      'Get a personalized PDF with your extra payments impact',
      'mortgage,rate,amortYears,extraMonthly,lumpSum,startYear,comparison',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('mortgage')} },
                          { label: "Interest Rate", value: rate + "%" },
                          { label: "Amortization", value: amortYears + " years" },
                          { label: "Extra Monthly", value: ${fmt('extraMonthly')} },
                          { label: "Lump Sum", value: ${fmt('lumpSum')} },
                          { label: "Start Year", value: "Year " + startYear },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Interest Saved", value: ${fmt('comparison.interestSaved')}, highlight: true },
                          { label: "Original Total Interest", value: ${fmt('comparison.originalTotalInterest')} },
                          { label: "Accelerated Total Interest", value: ${fmt('comparison.acceleratedTotalInterest')} },
                          { label: "Original Payoff", value: comparison.originalPayoffMonths + " months" },
                          { label: "Accelerated Payoff", value: comparison.acceleratedPayoffMonths + " months", highlight: true },
                          { label: "Time Saved", value: (comparison.originalPayoffMonths - comparison.acceleratedPayoffMonths) + " months" },
                        ]
                      }
                    ]`,
      "Extra payments go directly to principal. Even $200/month extra can save tens of thousands and cut years off your mortgage.",
      'Mortgage', 'mortgage'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // RENEWAL
  {
    slug: 'renewal',
    modal: makeGenericModal('renewal', 'calculator-pdf-renewal', 'Your Mortgage Renewal Analysis',
      'Get a personalized PDF with your renewal comparison',
      'currentBalance,currentRate,currentTerm,marketRate,penalty,currPay,newPay,monthlySavings,breakEvenMonths,worthSwitching',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Current Balance", value: ${fmt('currentBalance')} },
                          { label: "Current Rate", value: currentRate + "%" },
                          { label: "Current Term", value: currentTerm + " years" },
                          { label: "Market Rate", value: marketRate + "%" },
                          { label: "Prepayment Penalty", value: ${fmt('penalty')} },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Current Payment", value: ${fmt('currPay')} },
                          { label: "New Payment", value: ${fmt('newPay')}, highlight: true },
                          { label: "Monthly Savings", value: ${fmt('monthlySavings')} },
                          { label: "Break-Even Months", value: String(breakEvenMonths) },
                          { label: "Worth Switching?", value: worthSwitching ? "Yes" : "Consider waiting", highlight: true },
                        ]
                      }
                    ]`,
      "Always shop around at renewal — don't just sign the renewal letter. A broker can negotiate better rates across 40+ lenders at no cost.",
      'Renewal', 'currentBalance'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // REFINANCE VS HELOC VS SECOND
  {
    slug: 'refinance-vs-heloc-vs-second',
    modal: makeGenericModal('refinance-vs-heloc-vs-second', 'calculator-pdf-refinance-vs-heloc-vs-second', 'Your Equity Options Comparison',
      'Get a personalized PDF comparing your equity access options',
      'homeValue,firstBalance,firstRate,firstAmort,firstType,cashNeeded,equity,ltv,results',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Home Value", value: ${fmt('homeValue')} },
                          { label: "Current Balance", value: ${fmt('firstBalance')} },
                          { label: "Current Rate", value: firstRate + "%" },
                          { label: "Cash Needed", value: ${fmt('cashNeeded')} },
                          { label: "Available Equity", value: ${fmt('equity')} },
                          { label: "Current LTV", value: ltv.toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "Refinance",
                        rows: [
                          { label: "New Payment", value: ${fmt('results.refiMonthly')} },
                          { label: "Payment Change", value: "$" + Math.round(results.refiPaymentChange).toLocaleString("en-CA") },
                          { label: "Total Interest", value: ${fmt('results.refiTotalInterest')} },
                        ]
                      },
                      {
                        title: "HELOC",
                        rows: [
                          { label: "Amount", value: ${fmt('results.helocAmount')} },
                          { label: "Rate", value: results.helocRate + "%" },
                          { label: "Monthly Interest Only", value: ${fmt('results.helocMonthlyInterest')} },
                        ]
                      },
                      {
                        title: "Second Mortgage",
                        rows: [
                          { label: "Amount", value: ${fmt('results.secondAmount')} },
                          { label: "Rate", value: results.secondRate + "%" },
                          { label: "Monthly Payment", value: ${fmt('results.secondMonthly')} },
                        ]
                      }
                    ]`,
      "Each equity option has different costs and terms. Refinancing replaces your mortgage. HELOC offers flexible access. Second mortgage keeps your first intact.",
      'Refinance', 'homeValue'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // BC SPECULATION TAX
  {
    slug: 'bc-speculation-tax',
    modal: makeGenericModal('bc-speculation-tax', 'calculator-pdf-bc-speculation-tax', 'Your BC Speculation Tax Report',
      'Get a personalized PDF with your SVT details',
      'assessedValue,ownership,occupancy,region,taxRate,taxAmount,exempt,reason',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Assessed Value", value: ${fmt('assessedValue')} },
                          { label: "Ownership", value: ownership },
                          { label: "Occupancy", value: occupancy },
                          { label: "Region", value: region },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Tax Rate", value: (taxRate * 100) + "%" },
                          { label: "Annual Tax", value: ${fmt('taxAmount')}, highlight: true },
                          { label: "Exempt?", value: exempt ? "Yes" : "No" },
                          ...(reason ? [{ label: "Reason", value: reason }] : []),
                        ]
                      }
                    ]`,
      "The BC SVT ranges from 0.5% to 2% of assessed value in designated areas. Exemptions exist for principal residences and long-term rentals.",
      'BC Tax', 'assessedValue'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // SELF-EMPLOYED
  {
    slug: 'self-employed',
    modal: makeGenericModal('self-employed', 'calculator-pdf-self-employed', 'Your Self-Employed Income Analysis',
      'Get a personalized PDF with your normalized income',
      'y2,y1,y3,addbacks,r',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Latest Year NOA", value: ${fmt('y2')} },
                          { label: "Prior Year NOA", value: ${fmt('y1')} },
                          { label: "Two Years Ago NOA", value: ${fmt('y3')} },
                          { label: "Annual Addbacks", value: ${fmt('addbacks')} },
                        ]
                      },
                      {
                        title: "Results",
                        rows: [
                          { label: "Normalized Annual Income", value: ${fmt('r')}, highlight: true },
                          { label: "Normalized Monthly", value: ${fmt('r / 12')} },
                        ]
                      }
                    ]`,
      "Lenders average your last 2 years of NOA income. Addbacks like business-use-of-home and CCA can significantly increase qualifying income.",
      'Self-Employed', ''
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // B VS EQUITY
  {
    slug: 'b-vs-equity',
    modal: makeGenericModal('b-vs-equity', 'calculator-pdf-b-vs-equity', 'Your B-Lender vs Equity Lender Analysis',
      'Get a personalized PDF comparing B-lender and equity options',
      'mortgageAmount,propertyValue,bRate,eRate,amortization,term,bFee,eFee,canQualifyB,bMonthly,eMonthly,bTotalInterest,eTotalInterest,bFees,eFees,bTotalCost,eTotalCost',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('mortgageAmount')} },
                          { label: "Property Value", value: ${fmt('propertyValue')} },
                          { label: "B-Lender Rate", value: bRate + "%" },
                          { label: "Equity Rate", value: eRate + "%" },
                          { label: "Term", value: term + " years" },
                          { label: "LTV", value: ((mortgageAmount / propertyValue) * 100).toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "B-Lender",
                        rows: [
                          { label: "Monthly Payment", value: ${fmt('bMonthly')} },
                          { label: "Total Interest", value: ${fmt('bTotalInterest')} },
                          { label: "Fees", value: ${fmt('bFees')} },
                          { label: "Total Cost", value: ${fmt('bTotalCost')} },
                        ]
                      },
                      {
                        title: "Equity Lender",
                        rows: [
                          { label: "Monthly Payment", value: ${fmt('eMonthly')} },
                          { label: "Total Interest", value: ${fmt('eTotalInterest')} },
                          { label: "Fees", value: ${fmt('eFees')} },
                          { label: "Total Cost", value: ${fmt('eTotalCost')} },
                        ]
                      }
                    ]`,
      "B-lenders offer competitive rates with flexible verification. Equity lenders provide maximum flexibility at higher rates.",
      'Alternative', 'mortgageAmount'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
  // A VS EQUITY
  {
    slug: 'a-vs-equity',
    modal: makeGenericModal('a-vs-equity', 'calculator-pdf-a-vs-equity', 'Your A-Lender vs Equity Lender Analysis',
      'Get a personalized PDF comparing bank and equity options',
      'mortgageAmount,propertyValue,aRate,eqRate,term,amortization,eqFee,aMonthly,eqMonthly,aInterest,eqInterest,eqFeeAmount,additionalTax,investmentTaxSaving,isInvestment,ltv',
      `[
                      {
                        title: "Your Inputs",
                        rows: [
                          { label: "Mortgage Amount", value: ${fmt('mortgageAmount')} },
                          { label: "Property Value", value: ${fmt('propertyValue')} },
                          { label: "A-Lender Rate", value: aRate + "%" },
                          { label: "Equity Rate", value: eqRate + "%" },
                          { label: "Term", value: term + " years" },
                          { label: "LTV", value: ltv.toFixed(1) + "%" },
                        ]
                      },
                      {
                        title: "Comparison",
                        rows: [
                          { label: "A-Lender Monthly", value: ${fmt('aMonthly')} },
                          { label: "Equity Monthly", value: ${fmt('eqMonthly')} },
                          { label: "A-Lender Interest", value: ${fmt('aInterest')} },
                          { label: "Equity Interest", value: ${fmt('eqInterest')} },
                          { label: "Equity Fee", value: ${fmt('eqFeeAmount')} },
                          { label: "Additional Tax Cost", value: ${fmt('additionalTax')} },
                          ...(isInvestment && investmentTaxSaving > 0 ? [{ label: "Investment Tax Savings", value: ${fmt('investmentTaxSaving')} }] : []),
                        ]
                      }
                    ]`,
      "This comparison helps self-employed borrowers decide between bank and equity lending. Consider total cost including fees and tax implications.",
      'Alternative', 'mortgageAmount'
    ),
    targetLine: '<ComplianceBanner feature="LEAD_FORM" />',
  },
];

// Process each calculator
let count = 0;
let errors = [];

for (const patch of patches) {
  const filePath = path.join(BASE, patch.slug, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    errors.push(`${patch.slug}: file not found`);
    continue;
  }
  
  let code = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has PDF modal
  if (code.includes('PdfLeadModal') || code.includes('showPdfModal')) {
    console.log(`SKIP: ${patch.slug} (already has PDF modal)`);
    continue;
  }
  
  // 1. Add import after last import statement
  const allImports = [...code.matchAll(/^import .+;$/gm)];
  if (allImports.length === 0) {
    errors.push(`${patch.slug}: no imports found`);
    continue;
  }
  const lastImport = allImports[allImports.length - 1];
  const insertAfter = lastImport.index + lastImport[0].length;
  
  code = code.slice(0, insertAfter) + '\nimport PdfLeadModal from "@/components/PdfLeadModal";' + code.slice(insertAfter);
  
  // 2. Add state at beginning of component function body
  const funcMatch = code.match(/export default function \w+/);
  if (!funcMatch) {
    errors.push(`${patch.slug}: no component function`);
    continue;
  }
  const funcBodyStart = code.indexOf('\n', code.indexOf('{', funcMatch.index)) + 1;
  code = code.slice(0, funcBodyStart) + '  const [showPdfModal, setShowPdfModal] = useState(false);\n' + code.slice(funcBodyStart);
  
  // 3. Check if Download icon is imported, if not add it
  if (!code.includes('Download') || !code.match(/import.*\bDownload\b.*from.*lucide/)) {
    // Add Download to the lucide import
    const lucideImport = code.match(/import \{([^}]+)\} from "lucide-react"/);
    if (lucideImport) {
      const icons = lucideImport[1].trim();
      code = code.replace(
        lucideImport[0],
        `import { ${icons}, Download } from "lucide-react"`
      );
    }
  }
  
  // 4. Insert modal + button before target line (first ComplianceBanner)
  const targetIdx = code.indexOf(patch.targetLine);
  if (targetIdx === -1) {
    errors.push(`${patch.slug}: target line not found`);
    continue;
  }
  
  // Find the line start for proper indentation
  const lineStart = code.lastIndexOf('\n', targetIdx) + 1;
  const indent = code.slice(lineStart, targetIdx);
  
  code = code.slice(0, lineStart) + patch.modal + '\n' + indent + code.slice(lineStart);
  
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`OK: ${patch.slug}`);
  count++;
}

console.log(`\n${count} calculators patched, ${errors.length} errors`);
if (errors.length > 0) {
  errors.forEach(e => console.log(`  ERROR: ${e}`));
}
