import type { Run } from '@/lib/db/firestore';
import { tavilySearch } from '@/lib/ai/tools';
import { llm } from '@/lib/ai/llm';
import { log } from '@/lib/runlog';

interface ScoutData {
  topic: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  keywords: string[];
  provinceAngles: Record<string, string>;
  timestamp: string;
}

export async function scoutStage(run: Run): Promise<{ success: boolean; data?: ScoutData; error?: string }> {
  try {
    await log(run.id, 'Scout: Discovering topics and gathering sources...');

    const { mode, manualQuery, targetProvinces = ['BC', 'AB', 'ON'] } = run;
    let topic: string;
    let searchQuery: string;

    // Determine topic and search strategy
    if (mode === 'manual-topic' && manualQuery) {
      topic = manualQuery;
      searchQuery = `${manualQuery} Canada mortgage ${targetProvinces.join(' ')}`;
    } else if (mode === 'manual-idea' && manualQuery) {
      topic = manualQuery;
      searchQuery = `${manualQuery} Canadian mortgage industry`;
    } else {
      // Auto mode - find trending topics
      topic = `Latest mortgage updates for ${targetProvinces.join(', ')}: rates, policies & market insights`;
      searchQuery = 'Canada mortgage news rates policy changes site:gov OR site:cmhc-schl.gc.ca OR site:bankofcanada.ca last 7 days';
    }

    await log(run.id, `Scout: Searching for: "${searchQuery}"`);

    // Search for sources
    const sources = await tavilySearch(searchQuery, 10);
    
    if (sources.length === 0) {
      await log(run.id, 'Scout: No sources found, falling back to general search');
      const fallbackSources = await tavilySearch('Canada mortgage industry news', 5);
      sources.push(...fallbackSources);
    }

    await log(run.id, `Scout: Found ${sources.length} sources`);

    // Use LLM to analyze sources and extract insights
    const analysisPrompt = `
Analyze these mortgage industry sources and extract:
1. Main topic focus (be specific to mortgage industry)
2. Key SEO keywords (5-8 terms)
3. Province-specific angles for ${targetProvinces.join(', ')}
4. Current news hooks and timely angles

Sources:
${sources.slice(0, 5).map((s: any, i: number) => `${i + 1}. ${s.title}\n   ${s.snippet}\n   URL: ${s.url}`).join('\n\n')}

Return JSON format:
{
  "topic": "specific topic description",
  "keywords": ["keyword1", "keyword2", ...],
  "provinceAngles": {
    "BC": "BC-specific angle",
    "AB": "AB-specific angle", 
    "ON": "ON-specific angle"
  }
}`;

    let analysis: any;
    try {
      const response = await llm.generate([
        { role: 'system', content: 'You are a mortgage industry analyst. Extract insights from sources and return valid JSON.' },
        { role: 'user', content: analysisPrompt }
      ]);

      analysis = JSON.parse(response.content);
    } catch (parseError) {
      await log(run.id, 'Scout: LLM analysis failed, using fallback data');
      analysis = {
        topic: topic,
        keywords: ['mortgage rates', 'home loans', 'first time buyer', 'refinancing', 'mortgage broker'],
        provinceAngles: targetProvinces.reduce((acc, province) => ({
          ...acc,
          [province]: `Latest mortgage developments for ${province} residents`
        }), {})
      };
    }

    const scoutData: ScoutData = {
      topic: analysis.topic || topic,
      sources: sources.slice(0, 8), // Keep top 8 sources
      keywords: analysis.keywords || [],
      provinceAngles: analysis.provinceAngles || {},
      timestamp: new Date().toISOString(),
    };

    await log(run.id, `Scout: Completed. Topic: "${scoutData.topic}"`);

    return {
      success: true,
      data: scoutData,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in scout stage';
    await log(run.id, `Scout error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}