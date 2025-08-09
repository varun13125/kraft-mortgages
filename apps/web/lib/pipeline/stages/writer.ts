import type { Run } from '@/lib/db/firestore';
import { llm } from '@/lib/ai/llm';
import { log } from '@/lib/runlog';

interface WriterData {
  markdownDraft: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  wordCount: number;
  timestamp: string;
}

export async function writerStage(run: Run): Promise<{ success: boolean; data?: WriterData; error?: string }> {
  try {
    await log(run.id, 'Writer: Drafting article content...');

    const scout = run.scout;
    const brief = run.brief;
    
    if (!scout || !brief) {
      throw new Error('Scout and brief data required for writer stage');
    }

    const { sources = [] } = scout;
    const { title, outline, keywords = [], internalLinks = [] } = brief;
    const { targetProvinces = ['BC', 'AB', 'ON'] } = run;

    // Build comprehensive writing prompt
    const writerPrompt = `
Write a comprehensive, authoritative article about Canadian mortgage industry:

Title: ${title}
Outline: ${outline.join(' → ')}
Target Provinces: ${targetProvinces.join(', ')}
Keywords to include naturally: ${keywords.join(', ')}

Requirements:
1. Write in Markdown format
2. Use [n] citation markers for sources (e.g., "according to Bank of Canada [1]")
3. 1500-2000 words minimum
4. Include specific data, statistics, and examples from sources
5. Address each target province with specific insights
6. Natural keyword integration (2-3% density)
7. Include internal links: ${internalLinks.join(', ')}
8. Professional, authoritative tone
9. Actionable advice for readers
10. Current market context and trends

Sources to reference and cite:
${sources.slice(0, 8).map((source, i) => 
  `[${i + 1}] ${source.title}\n    ${source.snippet}\n    URL: ${source.url}`
).join('\n\n')}

Structure:
# ${title}

*Last updated: ${new Date().toLocaleDateString()}*

[Introduction paragraph with hook and overview]

## [First H2 from outline]
[Content with citations and province-specific insights]

[Continue with remaining outline sections...]

## Frequently Asked Questions

[Address common reader questions]

## Next Steps

[Clear action items for readers]

Write with authority and expertise. Use specific examples and current data from the sources.
`;

    const response = await llm.generate([
      {
        role: 'system',
        content: `You are a senior mortgage industry writer with 15+ years experience. Write comprehensive, accurate, and engaging content that helps Canadian homebuyers make informed decisions. Always cite sources with [n] markers and include specific, actionable advice.`
      },
      {
        role: 'user',
        content: writerPrompt
      }
    ], { 
      temperature: 0.7,
      maxTokens: 3000 
    });

    let markdownContent = response.content;

    // Ensure article has minimum structure
    if (!markdownContent.includes('#') || markdownContent.length < 800) {
      await log(run.id, 'Writer: Generated content too short, enhancing...');
      
      // Fallback content structure
      markdownContent = `# ${title}

*Last updated: ${new Date().toLocaleDateString()}*

${targetProvinces.join(', ')} homeowners and buyers face evolving mortgage market conditions that require expert guidance and current insights.

## Current Market Overview

The Canadian mortgage landscape continues to evolve with new policies, rate adjustments, and regulatory changes affecting borrowers across provinces [1].

## Provincial Impact Analysis

### British Columbia
BC homeowners face unique market pressures with elevated property values and specific regulatory considerations [2].

### Alberta  
Alberta's mortgage market reflects broader economic conditions with opportunities for both first-time and investor buyers [3].

### Ontario
Ontario borrowers navigate complex market dynamics with the largest mortgage volumes in Canada [4].

## Expert Recommendations

Based on current conditions, homeowners should consider:

1. **Rate Strategy**: Review your renewal options early
2. **Documentation**: Ensure all paperwork is current
3. **Professional Guidance**: Consult licensed mortgage professionals

## Next Steps

Contact a licensed mortgage broker to discuss your specific situation and explore available options.

---

*This analysis is provided by Varun Chaudhry, Licensed Mortgage Broker (BCFSA #M08001935), with 23+ years of Canadian mortgage experience.*`;
    }

    // Add sources section
    const sourcesSection = '\n\n## Sources\n\n' + 
      sources.slice(0, 8).map((source, i) => 
        `[${i + 1}] [${source.title}](${source.url})`
      ).join('\n');

    markdownContent += sourcesSection;

    const writerData: WriterData = {
      markdownDraft: markdownContent,
      sources: sources.slice(0, 8),
      wordCount: markdownContent.split(/\s+/).length,
      timestamp: new Date().toISOString(),
    };

    await log(run.id, `Writer: Completed ${writerData.wordCount} word article`);

    return {
      success: true,
      data: writerData,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in writer stage';
    await log(run.id, `Writer error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}