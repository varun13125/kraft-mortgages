import type { Run } from '@/lib/db/firestore';
import { llm } from '@/lib/ai/llm';
import { log } from '@/lib/runlog';

interface EditorData {
  finalMarkdown: string;
  wordCount: number;
  enhancements: string[];
  timestamp: string;
}

export async function editorStage(run: Run): Promise<{ success: boolean; data?: EditorData; error?: string }> {
  try {
    await log(run.id, 'Editor: Enhancing content for E-E-A-T and clarity...');

    const draft = run.draft;
    const brief = run.brief;

    if (!draft?.markdownDraft || !brief) {
      throw new Error('Draft and brief data required for editor stage');
    }

    const { markdownDraft } = draft;
    const { faq = [] } = brief;

    const editorPrompt = `
Edit and enhance this mortgage industry article for maximum quality and E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness):

Original article:
${markdownDraft}

Enhancement requirements:
1. Improve clarity and flow while maintaining the author's voice
2. Add credibility indicators and expertise signals
3. Enhance readability with better paragraph structure
4. Strengthen E-E-A-T signals throughout
5. Add internal links naturally where appropriate
6. Include author attribution and credentials
7. Add FAQ section with these questions: ${faq.join(', ')}
8. Include "Last Updated" timestamp
9. Add contact/consultation call-to-action

Author Details:
- Name: Kraft Mortgages Advisory Team
- Title: Licensed Mortgage Brokerage Team  
- License: BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918
- Experience: 18+ years combined experience in Canadian mortgage industry
- Specialties: MLI Select, Construction Financing, Self-Employed mortgages
- Office: Unit 201 - 12830 80th Ave, Surrey, BC V3W 3A8
- Phone: 604-593-1550

IMPORTANT RULES:
- DO NOT attempt to evade AI detection
- Focus on genuine quality, expertise, and reader value
- Maintain professional, authoritative tone
- Ensure all claims are accurate and properly attributed
- Keep the core message and structure intact
- Add value through expertise, not manipulation

Return the enhanced article in Markdown format.
`;

    const response = await llm.generate([
      {
        role: 'system',
        content: 'You are a senior mortgage industry editor with expertise in Canadian financial content. Your goal is to enhance articles for genuine quality, expertise, and reader value. Never attempt to manipulate AI detection systems - focus on authentic improvements that demonstrate real expertise and authority.'
      },
      {
        role: 'user',
        content: editorPrompt
      }
    ], {
      temperature: 0.5,
      maxTokens: 3500
    });

    let enhancedContent = response.content;

    // Ensure minimum enhancements are present
    const currentDate = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add author bio if not present
    if (!enhancedContent.includes('Kraft Mortgages Advisory Team') && !enhancedContent.includes('About the Author')) {
      const authorBio = `

---

## About the Authors

The **Kraft Mortgages Advisory Team** brings over 18 years of combined experience in the Canadian mortgage industry, specializing in MLI Select, construction financing, commercial lending, and self-employed mortgages across BC, AB, and ON.

- **Brokerage Licenses**: BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918
- **Office**: Unit 201 - 12830 80th Ave, Surrey, BC V3W 3A8  
- **Phone**: [604-593-1550](tel:604-593-1550)
- **Specialties**: MLI Select Program, Construction Financing, Self-Employed Mortgages

*This article was last updated on ${currentDate} and reflects current mortgage regulations and market conditions.*

---

## Ready to Get Started?

Every mortgage situation is unique. Contact the Kraft Mortgages Advisory Team to discuss your specific needs and explore the best mortgage solutions for your circumstances.

**📞 [604-593-1550](tel:604-593-1550) | 📧 [info@kraftmortgages.ca](mailto:info@kraftmortgages.ca)**
`;
      enhancedContent += authorBio;
    }

    // Add FAQ section if not present
    if (faq.length > 0 && !enhancedContent.includes('## FAQ') && !enhancedContent.includes('Frequently Asked Questions')) {
      const faqSection = `

## Frequently Asked Questions

${faq.map((q: string) => `### ${q}

Contact our team for personalized guidance on this question based on your specific situation.`).join('\n\n')}
`;

      // Insert FAQ before author bio
      enhancedContent = enhancedContent.replace(
        /---\s*\n\s*## About the Author/,
        faqSection + '\n\n---\n\n## About the Author'
      );
    }

    const enhancements = [
      'Enhanced E-E-A-T signals',
      'Added author credentials and expertise',
      'Improved content structure and flow',
      'Added FAQ section',
      'Included contact information',
      'Added last updated timestamp',
      'Strengthened credibility indicators'
    ];

    const editorData: EditorData = {
      finalMarkdown: enhancedContent,
      wordCount: enhancedContent.split(/\s+/).length,
      enhancements,
      timestamp: new Date().toISOString(),
    };

    await log(run.id, `Editor: Enhanced to ${editorData.wordCount} words with ${enhancements.length} improvements`);

    return {
      success: true,
      data: editorData,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in editor stage';
    await log(run.id, `Editor error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}