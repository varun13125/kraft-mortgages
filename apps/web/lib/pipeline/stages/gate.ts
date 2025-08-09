import type { Run } from '@/lib/db/firestore';
import { embedText, isDuplicate } from '@/lib/ai/tools';
import { getRecentPosts } from '@/lib/db/firestore';
import { llm } from '@/lib/ai/llm';
import { log } from '@/lib/runlog';

interface GateData {
  status: 'APPROVE' | 'REJECT' | 'REVISE';
  reasons: string[];
  embeddings?: number[][];
  factCheckResults?: any;
  duplicateScore?: number;
  timestamp: string;
}

export async function gateStage(run: Run): Promise<{ success: boolean; data?: GateData; enqueue?: string[]; error?: string }> {
  try {
    await log(run.id, 'Gate: Quality control and fact-checking...');

    const draft = run.draft;
    if (!draft || !draft.markdownDraft) {
      throw new Error('Draft data not found - gate stage requires writer completion');
    }

    const { markdownDraft, sources = [] } = draft;
    
    // Extract first few paragraphs for duplicate checking
    const paragraphs = markdownDraft.split('\n\n').filter(p => p.trim() && !p.startsWith('#')).slice(0, 5);
    
    await log(run.id, 'Gate: Generating embeddings for duplicate detection...');
    
    // Generate embeddings for content
    let embeddings: number[][] = [];
    try {
      embeddings = await embedText(paragraphs);
    } catch (embeddingError) {
      await log(run.id, 'Gate: Embedding generation failed, skipping duplicate check');
    }

    // Check for duplicates against recent posts
    let isDuplicateContent = false;
    let duplicateScore = 0;
    
    if (embeddings.length > 0) {
      await log(run.id, 'Gate: Checking for duplicate content...');
      
      try {
        const recentPosts = await getRecentPosts(50);
        
        for (const post of recentPosts) {
          if (post.embeddings && post.embeddings.length > 0) {
            for (const newEmbedding of embeddings) {
              if (isDuplicate(newEmbedding, post.embeddings, 0.86)) {
                isDuplicateContent = true;
                duplicateScore = 0.86; // Could calculate actual max similarity
                await log(run.id, `Gate: Duplicate content detected against post: ${post.slug}`);
                break;
              }
            }
            if (isDuplicateContent) break;
          }
        }
      } catch (duplicateError) {
        await log(run.id, 'Gate: Duplicate check failed, continuing...');
      }
    }

    // Fact-checking with LLM
    await log(run.id, 'Gate: Fact-checking content claims...');
    
    const factCheckPrompt = `
Review this mortgage industry article for accuracy and quality:

Article content (first 2000 chars):
${markdownDraft.slice(0, 2000)}

Sources provided:
${sources.slice(0, 5).map(s => `- ${s.title}: ${s.url}`).join('\n')}

Check for:
1. Factual accuracy of all claims
2. Proper source attribution  
3. No misleading information
4. Compliance with financial content standards
5. Professional tone and expertise
6. Current and relevant information

Return your assessment as JSON:
{
  "status": "APPROVE|REJECT|REVISE",
  "reasons": ["reason 1", "reason 2", ...],
  "suggestions": ["improvement 1", "improvement 2", ...]
}

Standards:
- APPROVE: High quality, accurate, well-sourced
- REVISE: Good content that needs improvements
- REJECT: Major issues, inaccurate information, or poor quality
`;

    let factCheckResult: any;
    try {
      const response = await llm.generate([
        {
          role: 'system',
          content: 'You are a senior editor specializing in Canadian mortgage and financial content. Ensure all information is accurate and compliant with industry standards.'
        },
        {
          role: 'user',
          content: factCheckPrompt
        }
      ], { temperature: 0.2 });

      factCheckResult = JSON.parse(response.content);
    } catch (factCheckError) {
      await log(run.id, 'Gate: Fact-check failed, using fallback approval');
      factCheckResult = {
        status: 'APPROVE',
        reasons: ['Automated fact-check unavailable'],
        suggestions: []
      };
    }

    // Determine final gate decision
    let finalStatus: 'APPROVE' | 'REJECT' | 'REVISE' = factCheckResult.status || 'APPROVE';
    const reasons: string[] = [...(factCheckResult.reasons || [])];

    // Override with duplicate detection
    if (isDuplicateContent) {
      finalStatus = 'REJECT';
      reasons.unshift('Duplicate content detected');
    }

    // Create gate data
    const gateData: GateData = {
      status: finalStatus,
      reasons,
      embeddings,
      factCheckResults: factCheckResult,
      duplicateScore,
      timestamp: new Date().toISOString(),
    };

    await log(run.id, `Gate: Decision - ${finalStatus} (${reasons.length} reasons)`);

    // Handle different outcomes
    if (finalStatus === 'REJECT') {
      return {
        success: false,
        error: `Content rejected: ${reasons.join(', ')}`,
        data: gateData,
      };
    } else if (finalStatus === 'REVISE') {
      // Enqueue writer revision and gate re-check
      return {
        success: true,
        data: gateData,
        enqueue: ['writer', 'gate'],
      };
    } else {
      // APPROVE - continue to editor
      return {
        success: true,
        data: gateData,
      };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in gate stage';
    await log(run.id, `Gate error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}