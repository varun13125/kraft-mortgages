import type { Run } from '@/lib/db/firestore';
import { llm } from '@/lib/ai/llm';
import { log } from '@/lib/runlog';

interface BriefData {
  title: string;
  slug: string;
  outline: string[];
  keywords: string[];
  faq: string[];
  metaDescription: string;
  internalLinks: string[];
  timestamp: string;
}

export async function briefStage(run: Run): Promise<{ success: boolean; data?: BriefData; error?: string }> {
  try {
    await log(run.id, 'Brief: Creating content strategy and outline...');

    const scout = run.scout;
    if (!scout) {
      throw new Error('Scout data not found - brief stage requires scout completion');
    }

    const { topic, keywords = [], sources = [] } = scout;
    const { targetProvinces = ['BC', 'AB', 'ON'] } = run;

    const briefPrompt = `
Create a comprehensive content brief for this mortgage industry topic:

Topic: ${topic}
Target Provinces: ${targetProvinces.join(', ')}
Keywords to include: ${keywords.join(', ')}

Create a brief that includes:
1. SEO-optimized title (under 60 characters)
2. URL slug (lowercase, hyphens, under 80 chars)
3. Detailed article outline with H2/H3 structure (6-8 sections)
4. 5-7 FAQ questions readers would ask
5. Meta description (under 155 characters)
6. Internal linking opportunities (mention mortgage calculators, MLI Select, etc.)

Focus on E-E-A-T principles and mortgage industry expertise.
Make it actionable and valuable for homebuyers and property investors.

Return JSON format:
{
  "title": "SEO title",
  "slug": "url-slug",
  "outline": ["Section 1", "Section 2", ...],
  "faq": ["Question 1?", "Question 2?", ...],
  "metaDescription": "Meta description",
  "internalLinks": ["/calculators/payment", "/mli-select", "/about"]
}`;

    const response = await llm.generate([
      { role: 'system', content: 'You are a senior content strategist specializing in mortgage industry SEO content. Create detailed, actionable content briefs that convert readers.' },
      { role: 'user', content: briefPrompt }
    ], { temperature: 0.3 });

    let briefData: any;
    try {
      briefData = JSON.parse(response.content);
    } catch (parseError) {
      await log(run.id, 'Brief: Failed to parse LLM response, using fallback');
      
      // Fallback brief structure
      const title = `${topic} - ${new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}`;
      briefData = {
        title: title.slice(0, 60),
        slug: title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80),
        outline: [
          'Introduction',
          'What\'s Changed This Month',
          'Impact on Homebuyers',
          'Province-Specific Updates',
          'Expert Recommendations', 
          'Next Steps'
        ],
        faq: [
          'How do recent rate changes affect my mortgage payment?',
          'What\'s the best mortgage option for first-time buyers?',
          'Should I lock in my rate now or wait?',
          'How does the stress test work in 2024?',
          'What documents do I need for mortgage approval?'
        ],
        metaDescription: `Latest mortgage insights for ${targetProvinces.join(', ')}. Expert analysis on rates, policies, and market trends.`,
        internalLinks: ['/calculators/payment', '/mli-select', '/about']
      };
    }

    const finalBrief: BriefData = {
      title: briefData.title || 'Mortgage Market Update',
      slug: briefData.slug || 'mortgage-market-update',
      outline: Array.isArray(briefData.outline) ? briefData.outline : [
        'Introduction',
        'Market Analysis', 
        'Recommendations'
      ],
      keywords: [...(keywords || []), ...(briefData.keywords || [])].slice(0, 10),
      faq: Array.isArray(briefData.faq) ? briefData.faq : [],
      metaDescription: briefData.metaDescription || `Expert mortgage insights for ${targetProvinces.join(', ')}.`,
      internalLinks: Array.isArray(briefData.internalLinks) ? briefData.internalLinks : [
        '/calculators/payment',
        '/mli-select',
        '/about'
      ],
      timestamp: new Date().toISOString(),
    };

    await log(run.id, `Brief: Created content plan - "${finalBrief.title}"`);

    return {
      success: true,
      data: finalBrief,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in brief stage';
    await log(run.id, `Brief error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}