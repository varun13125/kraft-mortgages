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

export async function embedText(texts: string[]): Promise<number[][]> {
  // Try OpenAI embeddings first
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: texts,
          dimensions: 384,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI embeddings error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.map((item: any) => item.embedding);
    } catch (error) {
      console.warn('OpenAI embeddings failed, using fallback:', error);
    }
  }

  // Try Google embeddings
  if (process.env.GOOGLE_API_KEY) {
    try {
      const embeddings: number[][] = [];
      
      for (const text of texts) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'models/embedding-001',
              content: {
                parts: [{ text }],
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Google embeddings error: ${response.statusText}`);
        }

        const data = await response.json();
        embeddings.push(data.embedding.values);
      }
      
      return embeddings;
    } catch (error) {
      console.warn('Google embeddings failed:', error);
    }
  }

  // Fallback: return dummy embeddings
  console.warn('No embedding provider available, using dummy embeddings');
  return texts.map(() => Array(384).fill(0).map(() => Math.random() * 0.1));
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