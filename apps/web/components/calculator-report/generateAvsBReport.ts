import jsPDF from "jspdf";

const NAVY = "#142341";
const GOLD = "#C8A962";
const WHITE = "#FFFFFF";
const LIGHT_BG = "#F8F9FC";
const TEXT_DARK = "#2D3748";
const TEXT_GRAY = "#718096";

interface Results {
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

interface Inputs {
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

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const h = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    `Kraft Mortgages Canada Inc.  |  604-593-1550  |  kraftmortgages.ca  |  Page ${pageNum} of ${totalPages}`,
    105,
    h - 12,
    { align: "center" }
  );
  // Gold line above footer
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(20, h - 18, 190, h - 18);
}

function addHeader(doc: jsPDF) {
  // Navy bar at top
  doc.setFillColor(NAVY);
  doc.rect(0, 0, 210, 12, "F");
  // Gold accent line
  doc.setFillColor(GOLD);
  doc.rect(0, 12, 210, 1.5, "F");
}

export async function generateCalculatorReport({
  userName,
  results,
  inputs,
}: {
  userName: string;
  results: Results;
  inputs: Inputs;
}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - 2 * margin;
  let y = 20;
  const totalPages = 4;

  // ══════════════════════════════════════════
  // PAGE 1 — COVER
  // ══════════════════════════════════════════
  addHeader(doc);

  // Navy logo area
  doc.setFillColor(NAVY);
  doc.roundedRect(margin, 50, contentW, 60, 4, 4, "F");

  // Gold accent inside navy box
  doc.setFillColor(GOLD);
  doc.rect(margin + 10, 55, contentW - 20, 1, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(WHITE);
  doc.text("KRAFT MORTGAGES", 105, 73, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(GOLD);
  doc.text("CANADA INC.", 105, 82, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor("#CBD5E0");
  doc.text("23 Years Experience  ·  $2 Billion+ Funded", 105, 92, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  doc.text("Your Personalized", 105, 130, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text("Mortgage Analysis Report", 105, 140, { align: "center" });

  // Gold divider
  doc.setDrawColor(GOLD);
  doc.setLineWidth(1);
  doc.line(75, 148, 135, 148);

  // User info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(TEXT_DARK);
  doc.text(`Prepared for: ${userName}`, 105, 160, { align: "center" });

  const today = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.setTextColor(TEXT_GRAY);
  doc.text(today, 105, 168, { align: "center" });

  doc.setFontSize(10);
  doc.text("Self-Employed A-Lender vs B-Lender Calculator", 105, 178, { align: "center" });

  // Confidentiality
  doc.setFillColor(LIGHT_BG);
  doc.roundedRect(margin, 200, contentW, 25, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    "CONFIDENTIAL — This report is prepared for informational purposes only and does not constitute financial or mortgage advice.",
    105,
    209,
    { align: "center", maxWidth: 160 }
  );
  doc.text(
    "Actual rates, terms, and costs may vary. Consult a licensed mortgage broker for personalized guidance.",
    105,
    215,
    { align: "center", maxWidth: 160 }
  );

  addFooter(doc, 1, totalPages);

  // ══════════════════════════════════════════
  // PAGE 2 — CALCULATOR RESULTS
  // ══════════════════════════════════════════
  doc.addPage();
  addHeader(doc);
  y = 22;

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NAVY);
  doc.text("Your Calculator Results", margin, y);
  y += 8;

  // Gold underline
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 50, y);
  y += 10;

  // Inputs summary box
  doc.setFillColor(LIGHT_BG);
  doc.roundedRect(margin, y, contentW, 38, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(NAVY);
  doc.text("Your Inputs", margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK);

  const inputItems = [
    `Mortgage Amount: ${fmt(inputs.mortgageAmount)}`,
    `Property Value: ${fmt(inputs.propertyValue)}`,
    `Province: ${inputs.province}`,
    `A-Lender Rate: ${inputs.aRate}%`,
    `B-Lender Rate: ${inputs.bRate}%`,
    `Term: ${inputs.term} years`,
    `Amortization: ${inputs.amortization} years`,
    `Additional Income: ${fmt(inputs.additionalIncome)}/yr`,
    `Tax Rate: ${inputs.effectiveTaxRate.toFixed(1)}%`,
    `B-Lender Fee: ${inputs.bFee}%`,
    inputs.isInvestment ? "Investment Property: Yes" : "Investment Property: No",
  ];

  inputItems.forEach((item, i) => {
    const col = i < 6 ? 0 : 1;
    const row = col === 0 ? i : i - 6;
    doc.text(item, margin + 5 + col * 85, y + 14 + row * 4);
  });
  y += 44;

  // Comparison table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(NAVY);
  doc.text("Side-by-Side Comparison", margin, y);
  y += 8;

  // Table header
  doc.setFillColor(NAVY);
  doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");
  doc.setFontSize(10);
  doc.setTextColor(WHITE);
  doc.text("Metric", margin + 5, y + 7);
  doc.text("A-Lender (Bank)", margin + 80, y + 7, { align: "center" });
  doc.text("B-Lender (Alternative)", margin + 140, y + 7, { align: "center" });
  y += 10;

  const rows = [
    { label: "Monthly Payment", a: fmt(results.aMonthly), b: fmt(results.bMonthly) },
    { label: `Total Interest (${inputs.term}yr)`, a: fmt(results.aInterest), b: fmt(results.bInterest) },
    { label: "Extra Tax on Declared Income", a: fmt(results.additionalTax), b: "—" },
    { label: `B-Lender Fee (${inputs.bFee}%)`, a: "N/A", b: fmt(results.bFeeAmount) },
  ];

  if (inputs.isInvestment && results.investmentTaxSavings > 0) {
    rows.push({
      label: "Investment Tax Savings",
      a: "N/A",
      b: `-${fmt(results.investmentTaxSavings)}`,
    });
  }

  rows.forEach((row, i) => {
    const bg = i % 2 === 0 ? WHITE : LIGHT_BG;
    doc.setFillColor(bg);
    doc.rect(margin, y, contentW, 8, "F");
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);
    doc.text(row.label, margin + 5, y + 5.5);
    doc.text(row.a, margin + 80, y + 5.5, { align: "center" });
    doc.text(row.b, margin + 140, y + 5.5, { align: "center" });
    y += 8;
  });

  // Total cost row — highlighted
  y += 2;
  const winnerBg = results.bWins ? "#ECFDF5" : "#EBF8FF";
  const winnerText = results.bWins ? "#065F46" : "#1E40AF";
  doc.setFillColor(winnerBg);
  doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 12, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(NAVY);
  doc.text("Total Cost Over Term", margin + 5, y + 8);
  doc.setTextColor("#1E40AF");
  doc.text(fmt(results.aTotalCost), margin + 80, y + 8, { align: "center" });
  doc.setTextColor("#B45309");
  doc.text(
    fmt(results.bTotalCost - (inputs.isInvestment ? results.investmentTaxSavings : 0)),
    margin + 140,
    y + 8,
    { align: "center" }
  );
  y += 18;

  // Winner callout
  doc.setFillColor(results.bWins ? "#ECFDF5" : "#EBF8FF");
  doc.roundedRect(margin, y, contentW, 20, 3, 3, "F");
  doc.setDrawColor(results.bWins ? "#10B981" : "#3B82F6");
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentW, 20, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(winnerText);
  doc.text(
    results.bWins
      ? "B-Lender Saves You Money!"
      : "A-Lender Is More Affordable!",
    105,
    y + 8,
    { align: "center" }
  );
  doc.setFontSize(12);
  doc.text(
    `Net savings: ${fmt(Math.abs(results.netSavings))} over ${inputs.term} years`,
    105,
    y + 15,
    { align: "center" }
  );

  addFooter(doc, 2, totalPages);

  // ══════════════════════════════════════════
  // PAGE 3 — WHAT YOU NEED TO APPLY
  // ══════════════════════════════════════════
  doc.addPage();
  addHeader(doc);
  y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NAVY);
  doc.text("What You Need to Apply", margin, y);
  y += 8;
  doc.setDrawColor(GOLD);
  doc.line(margin, y, margin + 50, y);
  y += 10;

  // A-Lender column
  const colW = (contentW - 10) / 2;
  const col1X = margin;
  const col2X = margin + colW + 10;

  // A-Lender header
  doc.setFillColor("#EBF8FF");
  doc.roundedRect(col1X, y, colW, 12, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#1E40AF");
  doc.text("A-Lender (Bank)", col1X + 5, y + 8);

  // B-Lender header
  doc.setFillColor("#FFFBEB");
  doc.roundedRect(col2X, y, colW, 12, 3, 3, "F");
  doc.setTextColor("#B45309");
  doc.text("B-Lender (Alternative)", col2X + 5, y + 8);
  y += 16;

  const aDocs = [
    "2 years personal T1 Generals (tax returns)",
    "Notice of Assessment (NOA) for 2 years",
    "Beacon score 680+",
    "GDS/TDS ratio within limits (39%/44%)",
    "Property appraisal",
    "Employment letter or business registration",
    "Proof of down payment (90-day history)",
  ];

  const bDocs = [
    "12 months business bank statements",
    "Beacon score 500+ (some accept lower)",
    "No GDS/TDS limits (most lenders)",
    "Property appraisal",
    "No tax returns or NOAs required",
    "Lender fee (0.5–2% of mortgage)",
    "Photo ID",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  aDocs.forEach((item) => {
    doc.setFillColor("#EBF8FF");
    doc.circle(col1X + 8, y + 3, 1.5, "F");
    doc.setTextColor(TEXT_DARK);
    doc.text(item, col1X + 12, y + 4, { maxWidth: colW - 16 });
    y += 7;
  });

  y -= 7 * aDocs.length;

  bDocs.forEach((item) => {
    doc.setFillColor("#FFFBEB");
    doc.circle(col2X + 8, y + 3, 1.5, "F");
    doc.setTextColor(TEXT_DARK);
    doc.text(item, col2X + 12, y + 4, { maxWidth: colW - 16 });
    y += 7;
  });

  y = Math.max(y, 100) + 10;

  // Addbacks section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(NAVY);
  doc.text("Common Addbacks for Self-Employed Income", margin, y);
  y += 3;
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 80, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    "When qualifying with a lender, certain business expenses can be \"added back\" to your net income:",
    margin,
    y,
    { maxWidth: contentW }
  );
  y += 8;

  const addbacks = [
    "Business use of home (portion of rent/mortgage, utilities, insurance)",
    "Capital Cost Allowance (CCA) — depreciation on equipment and vehicles",
    "Non-recurring or one-time expenses (legal fees, moving costs)",
    "Employer health tax (where applicable)",
    "Life insurance premiums (business-related)",
    "Vehicle expenses (portion used for business that exceeds CCA)",
    "RRSP contributions (sometimes added back, depending on lender)",
  ];

  addbacks.forEach((item) => {
    doc.setFillColor(GOLD);
    doc.circle(margin + 4, y + 3, 1.5, "F");
    doc.setTextColor(TEXT_DARK);
    doc.text(item, margin + 8, y + 4, { maxWidth: contentW - 12 });
    y += 6;
  });

  addFooter(doc, 3, totalPages);

  // ══════════════════════════════════════════
  // PAGE 4 — NEXT STEPS + CONTACT
  // ══════════════════════════════════════════
  doc.addPage();
  addHeader(doc);
  y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NAVY);
  doc.text("Ready to Move Forward?", margin, y);
  y += 8;
  doc.setDrawColor(GOLD);
  doc.line(margin, y, margin + 50, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);

  const steps = [
    "Schedule a free consultation with Kraft Mortgages — we'll review your situation at no cost.",
    "Provide your documentation (bank statements, ID, property details).",
    "We'll shop your deal across our network of 40+ lenders to find your best rate and terms.",
    "Receive your mortgage commitment and close with confidence.",
  ];

  steps.forEach((step, i) => {
    // Step number circle
    doc.setFillColor(NAVY);
    doc.circle(margin + 6, y + 3, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(WHITE);
    doc.text(`${i + 1}`, margin + 6, y + 4.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT_DARK);
    doc.text(step, margin + 15, y + 4, { maxWidth: contentW - 20 });
    y += 14;
  });

  y += 10;

  // Contact card
  doc.setFillColor(NAVY);
  doc.roundedRect(margin, y, contentW, 70, 4, 4, "F");

  // Gold accent
  doc.setFillColor(GOLD);
  doc.rect(margin + 5, y + 5, 50, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(WHITE);
  doc.text("Kraft Mortgages", margin + 10, y + 18);
  doc.setFontSize(11);
  doc.setTextColor(GOLD);
  doc.text("Canada Inc.", margin + 10, y + 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#CBD5E0");

  const contactLines = [
    "Varun Chaudhry — Senior Mortgage Broker",
    "#301 - 1688 152nd Street, Surrey, BC V4A 4N2",
    "Phone: 604-593-1550  |  Mobile: 604-727-1579",
    "Email: varun@kraftmortgages.ca",
    "Website: kraftmortgages.ca",
  ];

  contactLines.forEach((line, i) => {
    doc.text(line, margin + 10, y + 36 + i * 6);
  });

  y += 80;

  // CTA
  doc.setFillColor(GOLD);
  doc.roundedRect(margin + 20, y, contentW - 40, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(NAVY);
  doc.text("Book Your Free Consultation Today", 105, y + 11, { align: "center" });

  y += 28;

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    "This report is generated based on the inputs provided and is for informational purposes only. It does not constitute a mortgage approval, rate guarantee, or financial advice. Actual mortgage terms, rates, and costs vary based on creditworthiness, property type, and lender requirements. Please consult a licensed mortgage broker for personalized advice. Kraft Mortgages Canada Inc. is licensed by the BC Financial Services Authority (BCFSA). Rates shown are estimated starting rates for comparison purposes.",
    105,
    y,
    { align: "center", maxWidth: 170 }
  );

  addFooter(doc, 4, totalPages);

  // Save
  doc.save(
    `kraft-mortgages-report-${userName.replace(/\s+/g, "-").toLowerCase()}.pdf`
  );
}
