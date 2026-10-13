/**
 * Server-side LLM router for the content pipeline (lib/pipeline/stages/*) and /api/strategy/weekly.
 *
 * Plain `fetch` REST calls, no provider SDKs. Providers are tried in order:
 *   OpenAI (Chat Completions) -> Anthropic (Messages API) -> Google Gemini (generateContent) -> OpenRouter
 * and the first non-empty answer wins.
 *
 * Model IDs were checked against each provider's official model list on 2026-10-13
 * (developers.openai.com/api/docs/models, platform.claude.com/docs/en/about-claude/models/overview,
 * ai.google.dev/gemini-api/docs/models, openrouter.ai/api/v1/models). Each can be overridden with an
 * env var (LLM_OPENAI_MODEL, LLM_ANTHROPIC_MODEL, LLM_GEMINI_MODEL, LLM_OPENROUTER_MODEL) so a
 * retirement doesn't need a code change.
 *
 * All current default models think/reason before answering, and every provider counts those tokens
 * toward the output limit. Callers pass `maxTokens` meaning "room for the visible answer", so each
 * request adds REASONING_HEADROOM_TOKENS on top and asks for low reasoning effort.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface GenerateOptions {
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
}

const DEFAULT_MODELS = {
  openai: 'gpt-6.1-sol',
  anthropic: 'claude-sonnet-5-5',
  gemini: 'gemini-3.8-flash',
  openrouter: 'openai/gpt-6.1-sol',
} as const;

/** Extra output tokens reserved for reasoning/thinking, on top of the caller's maxTokens. */
const REASONING_HEADROOM_TOKENS = 4096;
/** Per-provider request timeout (long-form article generation can take a while). */
const PROVIDER_TIMEOUT_MS = 90_000;
/** Whole fallback chain budget. The pipeline routes run with maxDuration = 300 s. */
const CHAIN_BUDGET_MS = 240_000;
/** Don't start a provider call with less time than this left. */
const MIN_PROVIDER_BUDGET_MS = 10_000;

function env(name: string): string {
  return (process.env[name] || '').trim();
}

function openRouterKey(): string {
  // Accept both spellings: .env.example and /api/chat use OPENROUTER_API_KEY.
  return env('OPENROUTER_API_KEY') || env('OPEN_ROUTER_API_KEY');
}

function describeError(err: unknown): string {
  const name = (err as { name?: string } | null)?.name;
  if (name === 'TimeoutError' || name === 'AbortError') return 'timed out';
  return err instanceof Error ? err.message : String(err);
}

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  return `HTTP ${res.status}${body ? `: ${body.slice(0, 300)}` : ''}`;
}

function splitSystem(messages: LLMMessage[]): { system: string; turns: LLMMessage[] } {
  const system = messages
    .filter((m) => m.role === 'system' && m.content)
    .map((m) => m.content)
    .join('\n\n');
  const turns = messages.filter((m) => m.role !== 'system' && m.content);
  // Anthropic and Gemini conversations must open with a user turn.
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (turns.length === 0 && system) {
    return { system: '', turns: [{ role: 'user', content: system }] };
  }
  return { system, turns };
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

async function callOpenAI(messages: LLMMessage[], opts: GenerateOptions): Promise<LLMResponse> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env('LLM_OPENAI_MODEL') || DEFAULT_MODELS.openai,
      messages,
      // GPT-6 models are reasoning models: they take max_completion_tokens (reasoning included)
      // and reasoning_effort; non-default sampling parameters such as temperature are not sent.
      max_completion_tokens: opts.maxTokens + REASONING_HEADROOM_TOKENS,
      reasoning_effort: 'low',
    }),
    signal: AbortSignal.timeout(opts.timeoutMs),
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return {
    content: typeof content === 'string' ? content : '',
    usage: data?.usage
      ? {
          promptTokens: data.usage.prompt_tokens ?? 0,
          completionTokens: data.usage.completion_tokens ?? 0,
          totalTokens: data.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

async function callAnthropic(messages: LLMMessage[], opts: GenerateOptions): Promise<LLMResponse> {
  const { system, turns } = splitSystem(messages);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: env('LLM_ANTHROPIC_MODEL') || DEFAULT_MODELS.anthropic,
      // Adaptive thinking is on by default and counts toward max_tokens.
      max_tokens: opts.maxTokens + REASONING_HEADROOM_TOKENS,
      ...(system ? { system } : {}),
      messages: turns.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      // claude-sonnet-5-5 rejects non-default temperature/top_p/top_k with a 400, so effort is the
      // only tuning knob sent.
      output_config: { effort: 'medium' },
    }),
    signal: AbortSignal.timeout(opts.timeoutMs),
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  const blocks: Array<{ type?: string; text?: unknown }> = Array.isArray(data?.content) ? data.content : [];
  const content = blocks
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text as string)
    .join('');
  const input = data?.usage?.input_tokens ?? 0;
  const output = data?.usage?.output_tokens ?? 0;
  return {
    content,
    usage: data?.usage ? { promptTokens: input, completionTokens: output, totalTokens: input + output } : undefined,
  };
}

async function callGemini(messages: LLMMessage[], opts: GenerateOptions): Promise<LLMResponse> {
  const { system, turns } = splitSystem(messages);
  const model = env('LLM_GEMINI_MODEL') || DEFAULT_MODELS.gemini;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      // Key in a header, never in the URL (URLs end up in logs and traces).
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env('GOOGLE_API_KEY') },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents: turns.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          // Thought tokens count toward maxOutputTokens on Gemini 3.x. Temperature is left at the
          // model default, which Google recommends for Gemini 3 models.
          maxOutputTokens: opts.maxTokens + REASONING_HEADROOM_TOKENS,
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
      signal: AbortSignal.timeout(opts.timeoutMs),
    }
  );
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  const parts: Array<{ text?: unknown; thought?: unknown }> = data?.candidates?.[0]?.content?.parts || [];
  const content = parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text as string)
    .join('');
  const usage = data?.usageMetadata;
  return {
    content,
    usage: usage
      ? {
          promptTokens: usage.promptTokenCount ?? 0,
          completionTokens: (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
          totalTokens: usage.totalTokenCount ?? 0,
        }
      : undefined,
  };
}

async function callOpenRouter(messages: LLMMessage[], opts: GenerateOptions): Promise<LLMResponse> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://www.kraftmortgages.ca',
      'X-Title': 'Kraft Mortgages Content Pipeline',
    },
    body: JSON.stringify({
      model: env('LLM_OPENROUTER_MODEL') || DEFAULT_MODELS.openrouter,
      messages,
      // OpenRouter drops parameters a model doesn't support (e.g. temperature on GPT-6).
      temperature: opts.temperature,
      max_tokens: opts.maxTokens + REASONING_HEADROOM_TOKENS,
      reasoning: { effort: 'low', exclude: true },
    }),
    signal: AbortSignal.timeout(opts.timeoutMs),
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return {
    content: typeof content === 'string' ? content : '',
    usage: data?.usage
      ? {
          promptTokens: data.usage.prompt_tokens ?? 0,
          completionTokens: data.usage.completion_tokens ?? 0,
          totalTokens: data.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

const PROVIDERS: Array<{
  name: string;
  configured: () => boolean;
  call: (messages: LLMMessage[], opts: GenerateOptions) => Promise<LLMResponse>;
}> = [
  { name: 'OpenAI', configured: () => !!env('OPENAI_API_KEY'), call: callOpenAI },
  { name: 'Anthropic', configured: () => !!env('ANTHROPIC_API_KEY'), call: callAnthropic },
  { name: 'Google', configured: () => !!env('GOOGLE_API_KEY'), call: callGemini },
  { name: 'OpenRouter', configured: () => !!openRouterKey(), call: callOpenRouter },
];

class LLMRouter {
  async generate(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<LLMResponse> {
    const { temperature = 0.7, maxTokens = 2000 } = options || {};
    const deadline = Date.now() + CHAIN_BUDGET_MS;
    const failures: string[] = [];
    let attempted = 0;

    for (const provider of PROVIDERS) {
      if (!provider.configured()) continue;
      const timeoutMs = Math.min(PROVIDER_TIMEOUT_MS, deadline - Date.now());
      if (timeoutMs < MIN_PROVIDER_BUDGET_MS) {
        failures.push(`${provider.name}: skipped (time budget exhausted)`);
        continue;
      }
      attempted++;
      try {
        const response = await provider.call(messages, { temperature, maxTokens, timeoutMs });
        if (response.content.trim()) return response;
        failures.push(`${provider.name}: empty response`);
        console.warn(`[llm] ${provider.name} returned an empty response, trying next provider`);
      } catch (error) {
        const reason = describeError(error);
        failures.push(`${provider.name}: ${reason}`);
        console.warn(`[llm] ${provider.name} failed, trying next provider:`, reason);
      }
    }

    if (attempted === 0 && failures.length === 0) {
      throw new Error('No LLM provider available. Please configure at least one API key.');
    }
    throw new Error(`All configured LLM providers failed (${failures.join('; ')})`);
  }

  isAvailable(): boolean {
    return PROVIDERS.some((p) => p.configured());
  }
}

export const llm = new LLMRouter();
