import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, calculatorType, loanAmount, message } = data;

    // Generate report based on calculator type
    const generateReport = (type: string) => {
      switch (type) {
        case 'payment':
          return {
            title: 'Mortgage Payment Analysis Report',
            content: `
              <h2>Personalized Payment Analysis for ${name}</h2>
              <p>Based on your loan amount of $${loanAmount}, here's your comprehensive payment breakdown:</p>
              
              <h3>Payment Scenarios</h3>
              <ul>
                <li><strong>25-year amortization:</strong> Estimated monthly payment</li>
                <li><strong>30-year amortization:</strong> Lower monthly payments with more interest</li>
                <li><strong>Bi-weekly payments:</strong> Save thousands in interest</li>
              </ul>

              <h3>Next Steps</h3>
              <p>Our mortgage specialists will contact you within 24 hours to discuss:</p>
              <ul>
                <li>Pre-approval options</li>
                <li>Rate shopping strategies</li>
                <li>Optimal payment structure for your goals</li>
              </ul>
            `
          };
        
        case 'affordability':
          return {
            title: 'Home Affordability Assessment',
            content: `
              <h2>Affordability Analysis for ${name}</h2>
              <p>Discover your true purchasing power with our comprehensive assessment.</p>
              
              <h3>Key Factors We'll Analyze</h3>
              <ul>
                <li>Gross Debt Service (GDS) ratio calculation</li>
                <li>Total Debt Service (TDS) ratio analysis</li>
                <li>Stress test qualification at higher rates</li>
                <li>Down payment optimization strategies</li>
              </ul>

              <h3>Your Personalized Consultation</h3>
              <p>We'll provide specific recommendations based on your situation.</p>
            `
          };

        case 'construction':
          return {
            title: 'Construction Financing Blueprint',
            content: `
              <h2>Construction Financing Strategy for ${name}</h2>
              <p>Your comprehensive guide to construction mortgage success.</p>
              
              <h3>Progressive Draw Schedule</h3>
              <ul>
                <li>Foundation and framing advances</li>
                <li>Lock-up and mechanical draws</li>
                <li>Completion and final inspection</li>
              </ul>

              <h3>Expert Guidance Included</h3>
              <ul>
                <li>Builder qualification requirements</li>
                <li>Holdback management</li>
                <li>Conversion to permanent financing</li>
                <li>Cost overrun protection strategies</li>
              </ul>
            `
          };

        case 'investment':
          return {
            title: 'Investment Property ROI Analysis',
            content: `
              <h2>Investment Analysis for ${name}</h2>
              <p>Maximize your real estate investment returns with professional analysis.</p>
              
              <h3>Key Metrics We Calculate</h3>
              <ul>
                <li>Cap rate optimization</li>
                <li>Cash-on-cash returns</li>
                <li>Leverage strategies</li>
                <li>Tax implications and benefits</li>
              </ul>

              <h3>Portfolio Growth Strategy</h3>
              <p>Learn how to build a profitable real estate portfolio with expert guidance.</p>
            `
          };

        default:
          return {
            title: 'Mortgage Analysis Report',
            content: 'Comprehensive mortgage analysis based on your specific needs.'
          };
      }
    };

    const report = generateReport(calculatorType);

    // In a real implementation, you'd send this via email service like SendGrid, Mailgun, etc.
    // For now, we'll simulate the email sending
    console.log('Sending report email to:', email);
    console.log('Report content:', report);

    // Here you would integrate with your email service:
    // await sendEmail({
    //   to: email,
    //   subject: report.title,
    //   html: report.content
    // });

    // Also save the lead to your database
    // await saveLeadToDatabase(data);

    return NextResponse.json({ 
      success: true, 
      message: 'Report generated and sent successfully' 
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}