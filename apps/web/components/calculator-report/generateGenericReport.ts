// Named export: resolves to the constructor in both the browser ES build and the Node CJS build
// (a default import is the CJS module object under plain Node ESM).
import { jsPDF } from "jspdf";

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

/**
 * jsPDF's built-in Helvetica only covers WinAnsi (Latin-1 + a few typographic marks).
 * A single character outside that set (e.g. "≤" or "−") makes jsPDF switch the WHOLE
 * string to a 2-byte encoding, which prints as spaced-out garbage. Map the common ones
 * to ASCII and drop anything else that can't be rendered.
 */
const PDF_CHAR_MAP: Record<string, string> = {
  "≤": "<=",
  "≥": ">=",
  "−": "-",
  "‐": "-",
  "‑": "-",
  "→": "->",
  "←": "<-",
  "≈": "~",
  "≠": "!=",
  "✓": "",
  "✔": "",
  "✗": "x",
  "✕": "x",
  " ": " ", // thin space
  " ": " ", // narrow no-break space (fr-CA number formatting)
  "​": "", // zero-width space
};
// WinAnsi code points above Latin-1 that Helvetica can render
const WINANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");

export function pdfSafe(input: string | number | null | undefined): string {
  const s = input == null ? "" : String(input);
  let out = "";
  for (const ch of s) {
    const mapped = PDF_CHAR_MAP[ch];
    if (mapped !== undefined) {
      out += mapped;
      continue;
    }
    const cp = ch.codePointAt(0) ?? 0;
    if (cp === 0x0a || (cp >= 0x20 && cp <= 0x7e) || (cp >= 0xa0 && cp <= 0xff) || WINANSI_EXTRA.has(ch)) {
      out += ch;
    }
    // anything else (emoji, CJK, Gurmukhi, symbols) is dropped: it cannot be drawn with the core fonts
  }
  return out.replace(/ {2,}/g, " ");
}

function addHeader(doc: jsPDF) {
  doc.setFillColor(NAVY);
  doc.rect(0, 0, 210, 12, "F");
  doc.setFillColor(GOLD);
  doc.rect(0, 12, 210, 1.5, "F");
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const h = doc.internal.pageSize.height;
  doc.setFont("helvetica", "normal");
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
  // The cover already says "Your Personalized", so drop a leading "Your" from the title
  // ("Your Personalized / Your Cap Rate Analysis" read twice). Shrink long titles to fit.
  const title = pdfSafe(config.title).replace(/^your\s+/i, "");
  let titleSize = 22;
  while (titleSize > 14 && doc.getTextWidth(title) > contentW) {
    titleSize -= 1;
    doc.setFontSize(titleSize);
  }
  doc.text(title, 105, 140, { align: "center" });

  doc.setDrawColor(GOLD);
  doc.setLineWidth(1);
  doc.line(75, 148, 135, 148);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(TEXT_DARK);
  doc.text(`Prepared for: ${pdfSafe(config.userName)}`, 105, 160, { align: "center", maxWidth: contentW });

  const today = config.date || new Date().toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.setFontSize(10);
  doc.setTextColor(TEXT_GRAY);
  doc.text(pdfSafe(today), 105, 168, { align: "center" });
  doc.text(pdfSafe(config.calculatorName), 105, 178, { align: "center" });

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

// Row layout (mm). Labels wrap within the space the right-aligned value leaves free.
const ROW_FONT_SIZE = 9;
const ROW_MIN_H = 8;
const ROW_LINE_H = 4;
const ROW_PAD_X = 5;
const ROW_GAP = 6;
const PAGE_BOTTOM = 272; // keep clear of the footer rule at h - 18 (279mm on A4)

interface RowLayout {
  labelLines: string[];
  valueLines: string[];
  height: number;
  highlight: boolean;
}

function layoutRow(doc: jsPDF, row: ReportSection["rows"][number], contentW: number): RowLayout {
  const inner = contentW - ROW_PAD_X * 2;
  const label = pdfSafe(row.label);
  const value = pdfSafe(row.value);

  doc.setFontSize(ROW_FONT_SIZE);
  doc.setFont("helvetica", row.highlight ? "bold" : "normal");
  // Values keep their natural width up to 45% of the row, then wrap too.
  const valueMax = inner * 0.45;
  const valueLines: string[] = doc.getTextWidth(value) > valueMax
    ? doc.splitTextToSize(value, valueMax)
    : [value];
  const valueW = Math.max(...valueLines.map((l) => doc.getTextWidth(l)), 0);

  doc.setFont("helvetica", "normal");
  const labelW = Math.max(inner * 0.3, inner - valueW - ROW_GAP);
  const labelLines: string[] = doc.splitTextToSize(label, labelW);

  const lines = Math.max(labelLines.length, valueLines.length, 1);
  return {
    labelLines,
    valueLines,
    height: Math.max(ROW_MIN_H, ROW_MIN_H + (lines - 1) * ROW_LINE_H),
    highlight: !!row.highlight,
  };
}

/** Builds the report document (no download). Safe to call outside the browser. */
export function buildGenericReport(config: GenericReportConfig): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = 20;
  const contentW = 170;

  // Build all pages first, then set correct page numbers
  addCoverPage(doc, config);

  // Content pages
  let y = 22;
  doc.addPage();
  addHeader(doc);

  const newPage = () => {
    doc.addPage();
    addHeader(doc);
    y = 22;
  };

  for (const section of config.sections) {
    const rows = section.rows.map((row) => layoutRow(doc, row, contentW));
    const sectionHeight = 11 + rows.reduce((sum, r) => sum + r.height, 0);
    const firstRowH = rows[0]?.height ?? ROW_MIN_H;
    // Keep a section together when it fits on one page; otherwise at least keep the title with its first row.
    if (y + sectionHeight > PAGE_BOTTOM && (sectionHeight <= PAGE_BOTTOM - 22 || y + 11 + firstRowH > PAGE_BOTTOM)) {
      newPage();
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(NAVY);
    doc.text(pdfSafe(section.title), margin, y);
    y += 3;
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 45, y);
    y += 8;

    rows.forEach((row, i) => {
      if (y - 3 + row.height > PAGE_BOTTOM) newPage();
      const top = y - 3;

      if (row.highlight) {
        doc.setFillColor("#FFFBEB");
        doc.roundedRect(margin, top, contentW, row.height, 2, 2, "F");
        doc.setDrawColor(GOLD);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, top, contentW, row.height, 2, 2, "S");
      } else if (i % 2 === 0) {
        doc.setFillColor(LIGHT_BG);
        doc.rect(margin, top, contentW, row.height, "F");
      }

      doc.setFontSize(ROW_FONT_SIZE);
      doc.setTextColor(TEXT_DARK);
      doc.setFont("helvetica", "normal");
      doc.text(row.labelLines, margin + ROW_PAD_X, top + 5, { lineHeightFactor: ROW_LINE_H / (ROW_FONT_SIZE * 0.3528) });
      doc.setFont("helvetica", row.highlight ? "bold" : "normal");
      doc.text(row.valueLines, margin + contentW - ROW_PAD_X, top + 5, {
        align: "right",
        lineHeightFactor: ROW_LINE_H / (ROW_FONT_SIZE * 0.3528),
      });
      y += row.height;
    });

    y += 5;
  }

  // Educational content
  if (config.educationalContent) {
    if (y > 200) newPage();

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

    const lines: string[] = doc.splitTextToSize(pdfSafe(config.educationalContent), contentW - 10);
    for (const line of lines) {
      if (y > 268) {
        newPage();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(TEXT_DARK);
      }
      doc.text(line, margin + 5, y);
      y += 5;
    }
  }

  // Contact page
  doc.addPage();
  const totalPages = doc.getNumberOfPages();
  addContactPage(doc, totalPages, totalPages);

  // Footers on every other page (the contact page already has one)
  for (let p = 1; p < totalPages; p++) {
    doc.setPage(p);
    addFooter(doc, p, totalPages);
  }
  doc.setPage(totalPages);

  return doc;
}

/** Download file name: no path separators or other characters browsers reject. */
export function genericReportFileName(config: Pick<GenericReportConfig, "calculatorName" | "userName">): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `kraft-mortgages-${slug(config.calculatorName) || "calculator"}-${slug(config.userName) || "report"}.pdf`;
}

export function generateGenericReport(config: GenericReportConfig) {
  const doc = buildGenericReport(config);
  doc.save(genericReportFileName(config));
}

export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

export function fmtNum(n: number, decimals = 0): string {
  return n.toFixed(decimals);
}
