import jsPDF from "jspdf";

const NAVY = "#142341";
const GOLD = "#C8A962";
const WHITE = "#FFFFFF";
const LIGHT_BG = "#F8F9FC";
const TEXT_DARK = "#2D3748";
const TEXT_GRAY = "#718096";

export interface ReportSection {
  title: string;
  rows: { label: string; value: string; highlight?: boolean }[];
}

export interface GenericReportConfig {
  title: string;
  calculatorName: string;
  userName: string;
  date?: string;
  sections: ReportSection[];
  educationalContent?: string;
}

function addHeader(doc: jsPDF) {
  doc.setFillColor(NAVY);
  doc.rect(0, 0, 210, 12, "F");
  doc.setFillColor(GOLD);
  doc.rect(0, 12, 210, 1.5, "F");
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const h = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    `Kraft Mortgages Canada Inc.  |  604-593-1550  |  kraftmortgages.ca  |  Page ${pageNum} of ${totalPages}`,
    105, h - 12, { align: "center" }
  );
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(20, h - 18, 190, h - 18);
}

function addCoverPage(doc: jsPDF, config: GenericReportConfig) {
  const margin = 20;
  const contentW = 170;
  addHeader(doc);

  doc.setFillColor(NAVY);
  doc.roundedRect(margin, 50, contentW, 60, 4, 4, "F");
  doc.setFillColor(GOLD);
  doc.rect(margin + 10, 55, contentW - 20, 1, "F");

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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  doc.text("Your Personalized", 105, 130, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(config.title, 105, 140, { align: "center" });

  doc.setDrawColor(GOLD);
  doc.setLineWidth(1);
  doc.line(75, 148, 135, 148);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(TEXT_DARK);
  doc.text(`Prepared for: ${config.userName}`, 105, 160, { align: "center" });

  const today = config.date || new Date().toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.setFontSize(10);
  doc.setTextColor(TEXT_GRAY);
  doc.text(today, 105, 168, { align: "center" });
  doc.text(config.calculatorName, 105, 178, { align: "center" });

  doc.setFillColor(LIGHT_BG);
  doc.roundedRect(margin, 200, contentW, 25, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    "CONFIDENTIAL — This report is prepared for informational purposes only and does not constitute financial or mortgage advice.",
    105, 209, { align: "center", maxWidth: 160 }
  );
  doc.text(
    "Actual rates, terms, and costs may vary. Consult a licensed mortgage broker for personalized guidance.",
    105, 215, { align: "center", maxWidth: 160 }
  );
}

function addContactPage(doc: jsPDF, pageNum: number, totalPages: number) {
  addHeader(doc);
  const margin = 20;
  const contentW = 170;
  let y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(NAVY);
  doc.text("Ready to Move Forward?", margin, y);
  y += 8;
  doc.setDrawColor(GOLD);
  doc.line(margin, y, margin + 50, y);
  y += 12;

  const steps = [
    "Schedule a free consultation with Kraft Mortgages — we'll review your situation at no cost.",
    "Provide your documentation (bank statements, ID, property details).",
    "We'll shop your deal across our network of 40+ lenders to find your best rate and terms.",
    "Receive your mortgage commitment and close with confidence.",
  ];

  steps.forEach((step, i) => {
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

  doc.setFillColor(NAVY);
  doc.roundedRect(margin, y, contentW, 70, 4, 4, "F");
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

  [
    "Varun Chaudhry — Senior Mortgage Broker",
    "#301 - 1688 152nd Street, Surrey, BC V4A 4N2",
    "Phone: 604-593-1550  |  Mobile: 604-727-1579",
    "Email: varun@kraftmortgages.ca",
    "Website: kraftmortgages.ca",
  ].forEach((line, i) => {
    doc.text(line, margin + 10, y + 36 + i * 6);
  });

  y += 80;

  doc.setFillColor(GOLD);
  doc.roundedRect(margin + 20, y, contentW - 40, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(NAVY);
  doc.text("Book Your Free Consultation Today", 105, y + 11, { align: "center" });

  y += 28;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(TEXT_GRAY);
  doc.text(
    "This report is generated based on the inputs provided and is for informational purposes only. It does not constitute a mortgage approval, rate guarantee, or financial advice. Actual mortgage terms, rates, and costs vary based on creditworthiness, property type, and lender requirements. Please consult a licensed mortgage broker for personalized advice. Kraft Mortgages Canada Inc. is licensed by the BC Financial Services Authority (BCFSA).",
    105, y, { align: "center", maxWidth: 170 }
  );

  addFooter(doc, pageNum, totalPages);
}

export function generateGenericReport(config: GenericReportConfig) {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = 20;
  const contentW = 170;

  // Build all pages first, then set correct page numbers
  addCoverPage(doc, config);

  // Content pages
  let y = 22;
  doc.addPage();
  addHeader(doc);

  for (const section of config.sections) {
    const sectionHeight = 15 + section.rows.length * 8;

    if (y + sectionHeight > 270) {
      doc.addPage();
      addHeader(doc);
      y = 22;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(NAVY);
    doc.text(section.title, margin, y);
    y += 3;
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 45, y);
    y += 8;

    section.rows.forEach((row, i) => {
      if (y > 268) {
        doc.addPage();
        addHeader(doc);
        y = 22;
      }

      if (row.highlight) {
        doc.setFillColor("#FFFBEB");
        doc.roundedRect(margin, y - 3, contentW, 8, 2, 2, "F");
        doc.setDrawColor(GOLD);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y - 3, contentW, 8, 2, 2, "S");
      } else if (i % 2 === 0) {
        doc.setFillColor(LIGHT_BG);
        doc.rect(margin, y - 3, contentW, 8, "F");
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(TEXT_DARK);
      doc.text(row.label, margin + 5, y + 2);
      doc.setFont("helvetica", row.highlight ? "bold" : "normal");
      doc.text(row.value, margin + contentW - 5, y + 2, { align: "right" });
      y += 8;
    });

    y += 5;
  }

  // Educational content
  if (config.educationalContent) {
    if (y > 200) {
      doc.addPage();
      addHeader(doc);
      y = 22;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(NAVY);
    doc.text("Key Insights", margin, y);
    y += 3;
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 35, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);

    const lines = doc.splitTextToSize(config.educationalContent, contentW - 10);
    for (const line of lines) {
      if (y > 268) {
        doc.addPage();
        addHeader(doc);
        y = 22;
      }
      doc.text(line, margin + 5, y);
      y += 5;
    }
  }

  // Contact page
  doc.addPage();
  const totalPages = doc.getNumberOfPages();

  addContactPage(doc, totalPages, totalPages);

  // Now go back and add footers to all pages (except the last which already has it)
  // We need to add footers to pages 1 through totalPages-1
  // Problem: jsPDF renders pages sequentially. The cover page doesn't have a footer yet.
  // We'll need to handle this differently — add footers as we go, or accept the cover has no footer.

  // For now, let's add footers to all pages using the set approach
  // Actually, the simplest way: iterate pages and add footer overlay
  for (let p = 1; p < totalPages; p++) {
    doc.setPage(p);
    addFooter(doc, p, totalPages);
  }

  doc.save(
    `kraft-mortgages-${config.calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${config.userName.replace(/\s+/g, "-").toLowerCase()}.pdf`
  );
}

export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

export function fmtNum(n: number, decimals = 0): string {
  return n.toFixed(decimals);
}
