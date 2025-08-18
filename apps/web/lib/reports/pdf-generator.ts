import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportData } from './templates/base-template';

export interface PDFGeneratorOptions {
  fileName?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  compress?: boolean;
}

export class PDFGenerator {
  private static instance: PDFGenerator;

  private constructor() {}

  static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  /**
   * Generate PDF from HTML element
   */
  async generateFromHTML(
    element: HTMLElement,
    options: PDFGeneratorOptions = {}
  ): Promise<Blob> {
    const {
      fileName = 'report.pdf',
      orientation = 'portrait',
      format = 'letter',
      compress = true
    } = options;

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = orientation === 'portrait' ? 210 : 297;
      const pageHeight = orientation === 'portrait' ? 297 : 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
        compress
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Return as Blob
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Generate PDF from React component (server-side compatible)
   */
  async generateFromData(
    reportType: 'affordability' | 'payment' | 'mli' | 'investment',
    data: ReportData,
    options: PDFGeneratorOptions = {}
  ): Promise<Blob> {
    const {
      fileName = `${reportType}-report.pdf`,
      orientation = 'portrait',
      format = 'letter',
      compress = true
    } = options;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
      compress
    });

    // Set font
    pdf.setFont('helvetica');

    // Add header
    this.addHeader(pdf, data);

    // Add content based on report type
    switch (reportType) {
      case 'affordability':
        this.addAffordabilityContent(pdf, data);
        break;
      case 'payment':
        this.addPaymentContent(pdf, data);
        break;
      case 'mli':
        this.addMLIContent(pdf, data);
        break;
      case 'investment':
        this.addInvestmentContent(pdf, data);
        break;
    }

    // Add footer
    this.addFooter(pdf);

    return pdf.output('blob');
  }

  private addHeader(pdf: jsPDF, data: ReportData) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Company name and logo area
    pdf.setFontSize(24);
    pdf.setTextColor(31, 41, 55); // Dark gray
    pdf.text('Kraft Mortgages', 20, 25);
    
    // Contact info
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128); // Gray
    pdf.text('604-593-1550 | info@kraftmortgages.ca', pageWidth - 20, 20, { align: 'right' });
    pdf.text('www.kraftmortgages.ca', pageWidth - 20, 25, { align: 'right' });
    
    // Add gold line
    pdf.setDrawColor(212, 175, 55); // Gold color
    pdf.setLineWidth(0.5);
    pdf.line(20, 30, pageWidth - 20, 30);
    
    // Report title
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text(data.title, 20, 40);
    
    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated: ${new Date(data.generatedDate).toLocaleDateString()}`, 20, 46);
    
    // Client info box
    pdf.setFillColor(249, 250, 251); // Light gray background
    pdf.rect(20, 50, pageWidth - 40, 25, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Prepared For:', 25, 58);
    
    pdf.setFontSize(10);
    pdf.text(`Name: ${data.clientInfo.name}`, 25, 64);
    pdf.text(`Email: ${data.clientInfo.email}`, 25, 70);
    
    if (data.clientInfo.phone) {
      pdf.text(`Phone: ${data.clientInfo.phone}`, pageWidth / 2, 64);
    }
    if (data.clientInfo.province) {
      pdf.text(`Province: ${data.clientInfo.province}`, pageWidth / 2, 70);
    }
  }

  private addFooter(pdf: jsPDF) {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Add line
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      'This report is confidential and intended solely for the recipient.',
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
    pdf.text(
      `© ${new Date().getFullYear()} Kraft Mortgages. All rights reserved.`,
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
  }

  private addAffordabilityContent(pdf: jsPDF, data: any) {
    let yPosition = 85;
    
    // Key results
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Affordability Assessment Results', 20, yPosition);
    yPosition += 10;
    
    // Add content boxes
    this.addInfoBox(pdf, 20, yPosition, 'Maximum Purchase Price', 
      this.formatCurrency(data.calculationData.results.maxPurchase), '#D4AF37');
    
    this.addInfoBox(pdf, 110, yPosition, 'Maximum Mortgage', 
      this.formatCurrency(data.calculationData.results.maxMortgage), '#3B82F6');
    
    yPosition += 35;
    
    // Add details table
    this.addTable(pdf, 20, yPosition, 'Financial Information', [
      ['Annual Income', this.formatCurrency(data.calculationData.income)],
      ['Monthly Debts', this.formatCurrency(data.calculationData.debts)],
      ['Down Payment', this.formatCurrency(data.calculationData.downPayment)],
      ['Interest Rate', `${data.calculationData.rate}%`],
      ['GDS Ratio', `${data.calculationData.results.gds.toFixed(2)}%`],
      ['TDS Ratio', `${data.calculationData.results.tds.toFixed(2)}%`]
    ]);
  }

  private addPaymentContent(pdf: jsPDF, data: any) {
    let yPosition = 85;
    
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Mortgage Payment Calculation', 20, yPosition);
    yPosition += 10;
    
    // Payment amounts
    this.addInfoBox(pdf, 20, yPosition, 'Monthly Payment', 
      this.formatCurrency(data.calculationData.results.monthlyPayment), '#D4AF37');
    
    if (data.calculationData.results.biweeklyPayment) {
      this.addInfoBox(pdf, 110, yPosition, 'Bi-Weekly Payment', 
        this.formatCurrency(data.calculationData.results.biweeklyPayment), '#10B981');
    }
    
    yPosition += 35;
    
    // Add details
    this.addTable(pdf, 20, yPosition, 'Mortgage Details', [
      ['Principal Amount', this.formatCurrency(data.calculationData.principal)],
      ['Interest Rate', `${data.calculationData.rate}%`],
      ['Amortization', `${data.calculationData.amortization} years`],
      ['Total Interest', this.formatCurrency(data.calculationData.results.totalInterest)],
      ['Total Payments', this.formatCurrency(data.calculationData.results.totalPayments)]
    ]);
  }

  private addMLIContent(pdf: jsPDF, data: any) {
    let yPosition = 85;
    
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('MLI Select Analysis', 20, yPosition);
    yPosition += 10;
    
    // MLI amounts
    this.addInfoBox(pdf, 20, yPosition, 'MLI Premium', 
      this.formatCurrency(data.calculationData.premiumAmount), '#D4AF37');
    
    this.addInfoBox(pdf, 110, yPosition, 'Total Mortgage', 
      this.formatCurrency(data.calculationData.totalMortgage), '#3B82F6');
    
    yPosition += 35;
    
    // Add details
    this.addTable(pdf, 20, yPosition, 'MLI Details', [
      ['Purchase Price', this.formatCurrency(data.calculationData.purchasePrice)],
      ['Down Payment', `${this.formatCurrency(data.calculationData.downPayment)} (${data.calculationData.downPaymentPercent}%)`],
      ['Premium Rate', `${data.calculationData.premiumRate}%`],
      ['Loan-to-Value', `${data.calculationData.ltv}%`]
    ]);
  }

  private addInvestmentContent(pdf: jsPDF, data: any) {
    let yPosition = 85;
    
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Investment Property Analysis', 20, yPosition);
    yPosition += 10;
    
    // Key metrics
    const cashFlowColor = data.calculationData.analysis.cashFlow > 0 ? '#10B981' : '#EF4444';
    this.addInfoBox(pdf, 20, yPosition, 'Monthly Cash Flow', 
      this.formatCurrency(data.calculationData.analysis.cashFlow), cashFlowColor);
    
    this.addInfoBox(pdf, 110, yPosition, 'Cap Rate', 
      `${data.calculationData.analysis.capRate.toFixed(2)}%`, '#3B82F6');
    
    yPosition += 35;
    
    // Property details
    this.addTable(pdf, 20, yPosition, 'Investment Metrics', [
      ['Purchase Price', this.formatCurrency(data.calculationData.propertyDetails.purchasePrice)],
      ['Monthly Rent', this.formatCurrency(data.calculationData.rentalIncome.monthlyRent)],
      ['Total Expenses', this.formatCurrency(data.calculationData.expenses.totalMonthly)],
      ['NOI', this.formatCurrency(data.calculationData.analysis.noi)],
      ['DSCR', data.calculationData.analysis.dscr.toFixed(2)],
      ['Cash-on-Cash', `${data.calculationData.analysis.cashOnCash.toFixed(2)}%`]
    ]);
  }

  private addInfoBox(pdf: jsPDF, x: number, y: number, label: string, value: string, color: string) {
    // Draw box
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(color);
    pdf.setLineWidth(0.5);
    pdf.rect(x, y, 80, 25, 'FD');
    
    // Add text
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(label, x + 40, y + 8, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(color);
    pdf.text(value, x + 40, y + 17, { align: 'center' });
  }

  private addTable(pdf: jsPDF, x: number, y: number, title: string, rows: string[][]) {
    pdf.setFontSize(12);
    pdf.setTextColor(31, 41, 55);
    pdf.text(title, x, y);
    y += 7;
    
    pdf.setFontSize(10);
    rows.forEach(row => {
      pdf.setTextColor(107, 114, 128);
      pdf.text(row[0], x, y);
      pdf.setTextColor(31, 41, 55);
      pdf.text(row[1], x + 100, y, { align: 'right' });
      y += 6;
    });
    
    return y;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, fileName: string = 'report.pdf') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Convert PDF blob to base64
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const pdfGenerator = PDFGenerator.getInstance();