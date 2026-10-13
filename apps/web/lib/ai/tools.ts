interface TavilySearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export async function tavilySearch(query: string, maxResults: number = 6): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is required');
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        search_depth: 'basic',
        include_answer: false,
        include_images: false,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.results || []).map((result: any) => ({
      title: result.title || '',
      url: result.url || '',
      snippet: result.content ? result.content.slice(0, 240) : '',
      content: result.content || '',
    }));
  } catch (error) {
    console.error('Tavily search failed:', error);
    return [];
  }
}

export async function tavilyExtract(url: string): Promise<{ content: string; title: string }> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is required');
  }

  try {
    const response = await fetch('https://api.tavily.com/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        urls: [url],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(`Tavily extract error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.results?.[0];
    
    return {
      content: result?.raw_content || '',
      title: result?.title || '',
    };
  } catch (error) {
    console.error('Tavily extract failed:', error);
    return { content: '', title: '' };
  }
}

const EMBEDDING_TIMEOUT_MS = 20_000;
// Dimensions per provider. They are deliberately different: cosineSimilarity() returns 0 for
// vectors of different lengths, so OpenAI and Gemini vectors (different embedding spaces) are
// never compared with each other.
const OPENAI_EMBEDDING_DIMENSIONS = 384;
const GEMINI_EMBEDDING_DIMENSIONS = 768;

/**
 * Embeds each text with the first configured provider (OpenAI text-embedding-3-small, then
 * Google gemini-embedding-001). Returns null when no provider is configured or every provider
 * failed. It never fabricates vectors: the old random-vector fallback made duplicate detection
 * meaningless (BUG-049).
 */
export async function tryEmbedText(texts: string[]): Promise<number[][] | null> {
  if (texts.length === 0) return [];

  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: texts,
          dimensions: OPENAI_EMBEDDING_DIMENSIONS,
        }),
        signal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`OpenAI embeddings error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const vectors: unknown = (data?.data || [])
        .slice()
        .sort((a: any, b: any) => (a?.index ?? 0) - (b?.index ?? 0))
        .map((item: any) => item?.embedding);
      if (isVectorList(vectors, texts.length)) return vectors;
      throw new Error('OpenAI embeddings: unexpected response shape');
    } catch (error) {
      console.warn('OpenAI embeddings failed, trying next provider:', error instanceof Error ? error.message : error);
    }
  }

  const googleKey = process.env.GOOGLE_API_KEY;
  if (googleKey) {
    try {
      const embeddings: number[][] = [];
      for (const text of texts) {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent',
          {
            method: 'POST',
            // Key in a header, not the URL (URLs end up in logs and traces).
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': googleKey },
            body: JSON.stringify({
              model: 'models/gemini-embedding-001',
              content: { parts: [{ text }] },
              taskType: 'SEMANTIC_SIMILARITY',
              outputDimensionality: GEMINI_EMBEDDING_DIMENSIONS,
            }),
            signal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
          }
        );

        if (!response.ok) {
          throw new Error(`Google embeddings error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const values = data?.embedding?.values ?? data?.embeddings?.[0]?.values;
        if (!isVectorList([values], 1)) throw new Error('Google embeddings: unexpected response shape');
        embeddings.push(values);
      }
      return embeddings;
    } catch (error) {
      console.warn('Google embeddings failed:', error instanceof Error ? error.message : error);
    }
  }

  console.warn('No embedding provider available (OPENAI_API_KEY / GOOGLE_API_KEY unset or failing); skipping embeddings');
  return null;
}

/**
 * Backward-compatible wrapper used by the content pipeline (lib/pipeline/stages/gate.ts), which
 * expects number[][] and already treats a thrown error as "skip the duplicate check".
 * Throws instead of returning fabricated vectors when no provider is available.
 */
export async function embedText(texts: string[]): Promise<number[][]> {
  const vectors = await tryEmbedText(texts);
  if (!vectors) {
    throw new Error('No embedding provider available');
  }
  return vectors;
}

function isVectorList(value: unknown, expectedLength: number): value is number[][] {
  return (
    Array.isArray(value) &&
    value.length === expectedLength &&
    value.every((v) => Array.isArray(v) && v.length > 0 && v.every((n) => typeof n === 'number' && Number.isFinite(n)))
  );
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const norm = Math.sqrt(normA) * Math.sqrt(normB);
  return norm === 0 ? 0 : dotProduct / norm;
}

export function isDuplicate(newEmbedding: number[], existingEmbeddings: number[][], threshold: number = 0.86): boolean {
  return existingEmbeddings.some(existing => 
    cosineSimilarity(newEmbedding, existing) >= threshold
  );
}