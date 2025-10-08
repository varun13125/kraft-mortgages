export interface EmailTemplateData {
  recipientName?: string;
  calculatorType?: string;
  calculationResults?: any;
  reportUrl?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  brokerName?: string;
  brokerEmail?: string;
  brokerPhone?: string;
  companyName?: string;
  unsubscribeUrl?: string;
  [key: string]: any;
}

// Base template wrapper with Kraft Mortgages branding
const getBaseTemplate = (content: string, data: EmailTemplateData): string => {
  const recipientName = data.recipientName || 'Valued Client';
  const unsubscribeUrl = data.unsubscribeUrl || 'https://kraftmortgages.ca/unsubscribe';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kraft Mortgages</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333333; 
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #D4AF37, #B8941F);
            padding: 30px 40px; 
            text-align: center;
        }
        .logo { 
            color: white; 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 8px;
        }
        .tagline { 
            color: rgba(255,255,255,0.9); 
            font-size: 14px;
        }
        .content { 
            padding: 40px;
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #2c3e50;
        }
        .cta-button { 
            display: inline-block; 
            background: #D4AF37; 
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600; 
            margin: 20px 0;
        }
        .cta-button:hover { 
            background: #B8941F; 
        }
        .contact-info { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 6px; 
            margin: 20px 0;
        }
        .footer { 
            background: #2c3e50; 
            color: white; 
            padding: 30px 40px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer a { 
            color: #D4AF37; 
            text-decoration: none; 
        }
        .social-links { 
            margin: 20px 0; 
        }
        .social-links a { 
            color: #D4AF37; 
            text-decoration: none; 
            margin: 0 10px; 
        }
        @media (max-width: 600px) {
            .container { margin: 0 10px; }
            .header, .content, .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">KRAFT MORTGAGES</div>
            <div class="tagline">Your Trusted Mortgage Partner</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${recipientName},</div>
            ${content}
        </div>
        
        <div class="footer">
            <div><strong>Varun Chaudhry</strong> | Licensed Mortgage Broker</div>
            <div>BCFSA License #M08001935</div>
            <div style="margin: 15px 0;">
                📞 <a href="tel:+16045931550">604-593-1550</a> | 
                📧 <a href="mailto:varun@kraftmortgages.ca">varun@kraftmortgages.ca</a>
            </div>
            <div>301-1688 152nd Street, Surrey, BC V4A 4N2</div>
            
            <div class="social-links">
                <a href="https://linkedin.com/company/kraft-mortgages">LinkedIn</a> |
                <a href="https://kraftmortgages.ca">Website</a>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                <div>© 2024 Kraft Mortgages Canada Inc. All rights reserved.</div>
                <div style="margin-top: 10px;">
                    <a href="${unsubscribeUrl}" style="color: #95a5a6;">Unsubscribe</a> | 
                    <a href="https://kraftmortgages.ca/privacy" style="color: #95a5a6;">Privacy Policy</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// Welcome email for new leads
export const welcomeEmailTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Thank you for your interest in mortgage services with Kraft Mortgages! I'm excited to help you navigate your mortgage journey.</p>
    
    <p>As a licensed mortgage broker with over 23 years of experience, I specialize in helping clients across British Columbia, Alberta, and Ontario secure the best mortgage solutions for their unique needs.</p>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #D4AF37;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">🏠 What's Next?</h3>
        <ul style="color: #5d6d7e; margin-left: 20px;">
            <li>I'll review your information and mortgage needs</li>
            <li>We'll schedule a consultation to discuss your options</li>
            <li>I'll shop the market for your best rates and terms</li>
            <li>We'll guide you through the entire process</li>
        </ul>
    </div>
    
    <p><strong>Ready to get started?</strong> Book a free consultation or give me a call directly.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Book Free Consultation</a>
    </div>
    
    <div class="contact-info">
        <h4 style="color: #2c3e50; margin-bottom: 10px;">Get in Touch</h4>
        <p><strong>Call/Text:</strong> <a href="tel:+16045931550" style="color: #D4AF37;">604-593-1550</a></p>
        <p><strong>Email:</strong> <a href="mailto:varun@kraftmortgages.ca" style="color: #D4AF37;">varun@kraftmortgages.ca</a></p>
        <p><strong>Licensed in:</strong> BC, AB, ON</p>
    </div>
    
    <p>I look forward to helping you achieve your homeownership goals!</p>
    
    <p>Best regards,<br>
    <strong>Varun Chaudhry</strong><br>
    Licensed Mortgage Broker</p>
  `;
  
  return getBaseTemplate(content, data);
};

// Calculator report email
export const calculatorReportTemplate = (data: EmailTemplateData): string => {
  const calculatorType = data.calculatorType || 'mortgage calculation';
  const reportUrl = data.reportUrl || '#';
  
  const content = `
    <p>Thank you for using our ${calculatorType} tool! Your personalized mortgage report is ready for download.</p>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Your ${calculatorType} Report</h3>
        <p style="color: #5d6d7e; margin-bottom: 20px;">Professional analysis tailored to your financial situation</p>
        <a href="${reportUrl}" class="cta-button">Download Your Report</a>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #D4AF37;">
        <h4 style="color: #856404; margin-bottom: 10px;">💡 Next Steps</h4>
        <ul style="color: #856404; margin-left: 20px;">
            <li>Review your personalized mortgage options</li>
            <li>Consider different scenarios and payment structures</li>
            <li>Book a consultation to discuss the results</li>
            <li>Get pre-approved to strengthen your offer</li>
        </ul>
    </div>
    
    <p>Have questions about your results? I'm here to help explain the numbers and explore your best mortgage options.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Schedule Consultation</a>
    </div>
    
    <p><strong>Remember:</strong> These calculations are estimates. Let's discuss your specific situation to ensure you get the most accurate information and best possible rates.</p>
  `;
  
  return getBaseTemplate(content, data);
};

// Appointment confirmation email
export const appointmentConfirmationTemplate = (data: EmailTemplateData): string => {
  const appointmentDate = data.appointmentDate || 'TBD';
  const appointmentTime = data.appointmentTime || 'TBD';
  
  const content = `
    <p>Great! Your mortgage consultation is confirmed. I'm looking forward to discussing your mortgage needs and helping you find the perfect solution.</p>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #155724; margin-bottom: 15px;">📅 Appointment Confirmed</h3>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
        <p style="margin: 5px 0;"><strong>Duration:</strong> 30-45 minutes</p>
        <p style="margin: 5px 0;"><strong>Format:</strong> Phone/Video Call</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">📋 To Prepare for Our Call</h4>
        <ul style="color: #5d6d7e; margin-left: 20px;">
            <li>Gather your employment information (T4s, pay stubs)</li>
            <li>Know your down payment amount</li>
            <li>Have property details ready (if you've found one)</li>
            <li>List your monthly expenses and debts</li>
            <li>Prepare any questions about the mortgage process</li>
        </ul>
    </div>
    
    <p>During our consultation, we'll cover:</p>
    <ul style="margin: 15px 0 15px 20px; color: #5d6d7e;">
        <li>Your mortgage qualification and affordability</li>
        <li>Current market rates and product options</li>
        <li>Pre-approval process and timeline</li>
        <li>Next steps in your home buying journey</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Reschedule if Needed</a>
    </div>
    
    <p><strong>Need to reach me before our call?</strong></p>
    <p>📞 <a href="tel:+16045931550" style="color: #D4AF37;">604-593-1550</a><br>
    📧 <a href="mailto:varun@kraftmortgages.ca" style="color: #D4AF37;">varun@kraftmortgages.ca</a></p>
  `;
  
  return getBaseTemplate(content, data);
};

// Follow-up email for leads who haven't responded
export const followUpEmailTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>I wanted to follow up on your recent mortgage inquiry. I know choosing a mortgage broker is an important decision, and I'm here to answer any questions you might have.</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #D4AF37;">
        <h3 style="color: #856404; margin-bottom: 15px;">🤝 Why Choose Kraft Mortgages?</h3>
        <ul style="color: #856404; margin-left: 20px;">
            <li><strong>23+ Years Experience:</strong> Deep industry knowledge and relationships</li>
            <li><strong>Multi-Province Licensed:</strong> BC, AB, and ON coverage</li>
            <li><strong>Best Rate Guarantee:</strong> We shop 50+ lenders for you</li>
            <li><strong>No Fees to You:</strong> Lenders pay our commission</li>
            <li><strong>Full Service:</strong> From pre-approval to closing</li>
        </ul>
    </div>
    
    <p>Whether you're a first-time buyer, looking to refinance, or need specialized financing (self-employed, investment property, etc.), I've helped thousands of clients just like you.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Book Free 15-Minute Call</a>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="color: #2c3e50; margin-bottom: 10px;">💬 Quick Questions?</h4>
        <p style="color: #5d6d7e;">Feel free to reply to this email or call me directly. No obligation - just honest advice about your mortgage options.</p>
    </div>
    
    <p>The mortgage market changes daily. Let's make sure you're getting the most current information and best possible rates for your situation.</p>
    
    <p><strong>Ready when you are,</strong><br>
    <strong>Varun Chaudhry</strong><br>
    Licensed Mortgage Broker</p>
  `;
  
  return getBaseTemplate(content, data);
};

// Market update newsletter template
export const marketUpdateTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Here's your monthly mortgage market update with the latest rates, trends, and opportunities in the Canadian mortgage market.</p>
    
    <div style="background: linear-gradient(135deg, #e8f4fd, #d4edda); padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-bottom: 15px; text-align: center;">📈 This Month's Market Highlights</h3>
        <div style="text-align: center;">
            <div style="display: inline-block; margin: 10px 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #D4AF37;">5.25%</div>
                <div style="font-size: 14px; color: #5d6d7e;">5-Year Fixed</div>
            </div>
            <div style="display: inline-block; margin: 10px 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #D4AF37;">4.95%</div>
                <div style="font-size: 14px; color: #5d6d7e;">5-Year Variable</div>
            </div>
        </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">🔍 Market Insights</h4>
        <ul style="color: #5d6d7e; margin-left: 20px;">
            <li>Bank of Canada maintained the overnight rate at current levels</li>
            <li>Fixed rates have stabilized after recent volatility</li>
            <li>Variable rates remain competitive for qualified borrowers</li>
            <li>New mortgage rule changes effective this month</li>
        </ul>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #D4AF37;">
        <h4 style="color: #856404; margin-bottom: 10px;">💡 What This Means for You</h4>
        <p style="color: #856404;">If you're considering a mortgage renewal or new purchase, now is a great time to review your options. Rate holds are available for 120 days, giving you time to shop for properties.</p>
    </div>
    
    <p><strong>Thinking about your mortgage?</strong> Whether you're buying, renewing, or refinancing, I can help you navigate these market conditions and secure the best rate and terms for your situation.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Get Your Rate Quote</a>
    </div>
    
    <p><strong>Questions about how these rates affect you?</strong> Reply to this email or give me a call. I'm here to help!</p>
  `;
  
  return getBaseTemplate(content, data);
};

// Renewal reminder email
export const renewalReminderTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Your mortgage renewal is coming up, and I want to make sure you get the best possible rate and terms for your next term.</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-bottom: 15px;">⏰ Don't Auto-Renew!</h3>
        <p style="color: #856404; margin-bottom: 10px;"><strong>Why shopping around matters:</strong></p>
        <ul style="color: #856404; margin-left: 20px;">
            <li>Banks often offer renewal rates higher than their best rates</li>
            <li>You could save thousands over your term</li>
            <li>Better terms and features may be available</li>
            <li>It's free to explore your options</li>
        </ul>
    </div>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="color: #155724; margin-bottom: 15px;">🔄 Renewal Process Made Easy</h4>
        <ol style="color: #155724; margin-left: 20px;">
            <li>I'll review your current mortgage and needs</li>
            <li>Shop 50+ lenders for your best options</li>
            <li>Present you with rate and term comparisons</li>
            <li>Handle all the paperwork if you switch</li>
        </ol>
    </div>
    
    <p><strong>Best part?</strong> If you stay with your current lender but at a better rate I negotiated, there's no cost to you. If you switch to a better deal elsewhere, the new lender covers all costs.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/varun-kraftmortgages" class="cta-button">Start Your Renewal Review</a>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="color: #2c3e50; margin-bottom: 10px;">⏳ Timeline</h4>
        <p style="color: #5d6d7e;">Start this process 4-6 months before your renewal date for the best selection of options and plenty of time to make the right decision.</p>
    </div>
    
    <p>Let's make sure you're getting the best deal for your next mortgage term. I'm here to help!</p>
  `;
  
  return getBaseTemplate(content, data);
};

// Export template functions
export const emailTemplates = {
  welcome: welcomeEmailTemplate,
  calculatorReport: calculatorReportTemplate,
  appointmentConfirmation: appointmentConfirmationTemplate,
  followUp: followUpEmailTemplate,
  marketUpdate: marketUpdateTemplate,
  renewalReminder: renewalReminderTemplate,
};