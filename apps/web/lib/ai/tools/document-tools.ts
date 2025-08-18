import { z } from "zod";
import { MortgageTool, ToolResult, MortgageType } from "./types";

// Document checklist for different mortgage types
const documentChecklists = {
  purchase: {
    required: [
      "Government-issued photo ID",
      "Proof of income (pay stubs, T4s, NOAs)",
      "Employment letter",
      "Down payment proof",
      "Purchase agreement",
      "MLS listing",
      "Bank statements (90 days)",
      "Credit bureau consent"
    ],
    conditional: [
      "Gift letter (if using gifted funds)",
      "Sale agreement (if selling current home)",
      "Divorce/separation agreement (if applicable)",
      "Child support documentation (if applicable)",
      "Rental income statements (if applicable)"
    ]
  },
  refinance: {
    required: [
      "Government-issued photo ID",
      "Proof of income (pay stubs, T4s, NOAs)",
      "Employment letter",
      "Current mortgage statement",
      "Property tax bill",
      "Home insurance policy",
      "Bank statements (90 days)",
      "Credit bureau consent"
    ],
    conditional: [
      "Home appraisal (may be required)",
      "Title insurance",
      "Condo documents (if applicable)",
      "Rental agreements (if investment property)"
    ]
  },
  renewal: {
    required: [
      "Current mortgage renewal offer",
      "Government-issued photo ID",
      "Updated income verification",
      "Property tax statement"
    ],
    conditional: [
      "Updated employment letter (if changed jobs)",
      "Updated financial statements (if self-employed)"
    ]
  }
};

// Document verification status checker
export const checkDocumentsTool: MortgageTool = {
  name: "check_documents",
  description: "Check required documents for mortgage application",
  parameters: z.object({
    mortgageType: z.enum(["purchase", "refinance", "renewal"]),
    situation: z.object({
      isFirstTimeBuyer: z.boolean().optional(),
      isSelfEmployed: z.boolean().optional(),
      hasGiftedFunds: z.boolean().optional(),
      isInvestmentProperty: z.boolean().optional(),
      hasCosigner: z.boolean().optional()
    }).optional()
  }),
  execute: async ({ mortgageType, situation = {} }) => {
    const checklist = documentChecklists[mortgageType as keyof typeof documentChecklists];
    const additionalDocs: string[] = [];

    // Add situation-specific documents
    if (situation.isSelfEmployed) {
      additionalDocs.push(
        "Business financial statements (2 years)",
        "Business registration documents",
        "GST/HST returns",
        "Contracts or invoices"
      );
    }

    if (situation.hasGiftedFunds) {
      additionalDocs.push(
        "Gift letter from donor",
        "Proof of donor's ability to gift",
        "Bank confirmation of gift deposit"
      );
    }

    if (situation.isInvestmentProperty) {
      additionalDocs.push(
        "Rental agreement or lease",
        "Rental income history",
        "Property management agreement (if applicable)"
      );
    }

    if (situation.hasCosigner) {
      additionalDocs.push(
        "Co-signer's ID and income documents",
        "Co-signer's credit bureau consent",
        "Co-signer's asset statements"
      );
    }

    const totalRequired = checklist.required.length + additionalDocs.length;
    
    return {
      success: true,
      data: {
        mortgageType,
        requiredDocuments: checklist.required,
        conditionalDocuments: checklist.conditional,
        situationSpecific: additionalDocs,
        totalDocuments: totalRequired,
        checklist: generateChecklist(checklist.required, additionalDocs, checklist.conditional)
      }
    };
  }
};

// Document upload guide
export const documentUploadGuideTool: MortgageTool = {
  name: "document_upload_guide",
  description: "Provide guidance on document formats and upload requirements",
  parameters: z.object({
    documentType: z.string()
  }),
  execute: async ({ documentType }) => {
    const guides: Record<string, any> = {
      "income": {
        acceptedFormats: ["PDF", "JPG", "PNG"],
        maxSize: "10MB per file",
        tips: [
          "Ensure all pages are included",
          "Make sure text is clearly readable",
          "Include all pages of T4s or NOAs",
          "Recent pay stubs should be within 30 days"
        ]
      },
      "identification": {
        acceptedFormats: ["JPG", "PNG", "PDF"],
        maxSize: "5MB per file",
        tips: [
          "Both sides of ID if applicable",
          "Ensure photo and text are clear",
          "Not expired",
          "Driver's license or passport preferred"
        ]
      },
      "property": {
        acceptedFormats: ["PDF"],
        maxSize: "20MB per file",
        tips: [
          "Include all pages of purchase agreement",
          "MLS listing should show all details",
          "Property tax bills should be current year",
          "Include all schedules and amendments"
        ]
      },
      "financial": {
        acceptedFormats: ["PDF", "CSV"],
        maxSize: "10MB per file",
        tips: [
          "90 days of statements required",
          "All pages must be included",
          "Show account holder name and number",
          "Include all accounts (chequing, savings, investments)"
        ]
      }
    };

    const guide = guides[documentType.toLowerCase() as keyof typeof guides] || {
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: "10MB per file",
      tips: ["Ensure documents are clear and readable", "Include all pages"]
    };

    return {
      success: true,
      data: {
        documentType,
        ...guide,
        uploadProcess: [
          "Scan or photograph document clearly",
          "Save in accepted format",
          "Check file size is under limit",
          "Upload through secure portal",
          "Wait for confirmation of receipt"
        ]
      }
    };
  }
};

// Document timeline tracker
export const documentTimelineTool: MortgageTool = {
  name: "document_timeline",
  description: "Get timeline for document collection and processing",
  parameters: z.object({
    closingDate: z.string().optional(),
    mortgageType: z.enum(["purchase", "refinance", "renewal"])
  }),
  execute: async ({ closingDate, mortgageType }) => {
    const today = new Date();
    const closing = closingDate ? new Date(closingDate) : new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
    const daysToClosing = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const timelines = {
      purchase: {
        documentsNeeded: Math.max(45, daysToClosing - 15),
        appraisalBy: Math.max(30, daysToClosing - 10),
        conditionsClear: Math.max(21, daysToClosing - 7),
        finalReview: Math.max(7, daysToClosing - 3),
        fundingDay: Math.max(1, daysToClosing - 1)
      },
      refinance: {
        documentsNeeded: 30,
        appraisalBy: 21,
        conditionsClear: 14,
        finalReview: 7,
        fundingDay: 3
      },
      renewal: {
        documentsNeeded: 60,
        appraisalBy: 45,
        conditionsClear: 30,
        finalReview: 14,
        fundingDay: 7
      }
    };

    const timeline = timelines[mortgageType as keyof typeof timelines];
    
    return {
      success: true,
      data: {
        mortgageType,
        closingDate: closing.toISOString().split('T')[0],
        daysToClosing,
        timeline: {
          submitDocuments: `Within ${timeline.documentsNeeded} days`,
          propertyAppraisal: `Within ${timeline.appraisalBy} days`,
          clearConditions: `Within ${timeline.conditionsClear} days`,
          finalReview: `${timeline.finalReview} days before closing`,
          funding: `${timeline.fundingDay} day(s) before closing`
        },
        urgentActions: daysToClosing < 30 ? [
          "Submit all documents immediately",
          "Schedule property appraisal ASAP",
          "Respond to lender requests within 24 hours"
        ] : []
      }
    };
  }
};

// Helper function to generate a formatted checklist
function generateChecklist(required: string[], additional: string[], conditional: string[]): string {
  let checklist = "## Required Documents Checklist\n\n";
  
  checklist += "### Essential Documents:\n";
  required.forEach(doc => {
    checklist += `☐ ${doc}\n`;
  });
  
  if (additional.length > 0) {
    checklist += "\n### Additional Required (Based on Your Situation):\n";
    additional.forEach(doc => {
      checklist += `☐ ${doc}\n`;
    });
  }
  
  if (conditional.length > 0) {
    checklist += "\n### May Be Required:\n";
    conditional.forEach(doc => {
      checklist += `☐ ${doc}\n`;
    });
  }
  
  checklist += "\n### Tips for Document Submission:\n";
  checklist += "• Submit documents as soon as possible\n";
  checklist += "• Ensure all documents are current (within 30-90 days)\n";
  checklist += "• Include all pages of multi-page documents\n";
  checklist += "• Keep originals for your records\n";
  checklist += "• Use secure methods for transmission\n";
  
  return checklist;
}

export const documentTools = [
  checkDocumentsTool,
  documentUploadGuideTool,
  documentTimelineTool
];