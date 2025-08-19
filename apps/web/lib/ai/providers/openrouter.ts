import { ChatProvider } from "../providers";

// Free models available on OpenRouter
export const FREE_MODELS = {
  GENERAL: "z-ai/glm-4.5-air:free",
  CODER: "qwen/qwen3-coder:free", 
  LONG_CONTEXT: "moonshotai/kimi-k2:free",
  QUICK: "google/gemma-3n-e2b-it:free",
  COMPLEX: "tngtech/deepseek-r1t2-chimera:free",
} as const;

// Premium models for fallback
export const PREMIUM_MODELS = {
  CLAUDE_35: "anthropic/claude-3.5-sonnet",
  GPT_4O: "openai/gpt-4o",
  GEMINI_PRO: "google/gemini-2.0-flash-exp:free", // Actually free!
} as const;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message?: {
      role: string;
      content: string;
    };
    delta?: {
      content?: string;
    };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function openRouterProvider(model: string, referer?: string): ChatProvider {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  async function* streamOpenRouterResponse(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();
    let buffer = "";
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;
        
        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return {
    name: `openrouter-${model}`,
    
    async chat({ system, prompt, maxTokens = 512, temperature = 0.3 }) {
      const messages: OpenRouterMessage[] = [];
      
      if (system) {
        messages.push({ role: "system", content: system });
      }
      messages.push({ role: "user", content: prompt });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": referer || process.env.NEXT_PUBLIC_SITE_URL || "https://kraftmortgages.ca",
          "X-Title": "Kraft Mortgages AI Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || "";
    },

    async streamChat({ system, prompt }) {
      const messages: OpenRouterMessage[] = [];
      
      if (system) {
        messages.push({ role: "system", content: system });
      }
      messages.push({ role: "user", content: prompt });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": referer || process.env.NEXT_PUBLIC_SITE_URL || "https://kraftmortgages.ca",
          "X-Title": "Kraft Mortgages AI Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.3,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const reader = response.body!.getReader();
      const encoder = new TextEncoder();
      
      return new ReadableStream<Uint8Array>({
        async pull(controller) {
          for await (const chunk of streamOpenRouterResponse(reader)) {
            controller.enqueue(encoder.encode(chunk));
            return;
          }
          controller.close();
        },
      });
    },
  };
}

// Export convenience functions for free models
export const generalProvider = () => openRouterProvider(FREE_MODELS.GENERAL);
export const coderProvider = () => openRouterProvider(FREE_MODELS.CODER);
export const longContextProvider = () => openRouterProvider(FREE_MODELS.LONG_CONTEXT);
export const quickProvider = () => openRouterProvider(FREE_MODELS.QUICK);
export const complexProvider = () => openRouterProvider(FREE_MODELS.COMPLEX);

// Export premium model providers
export const claude35Provider = () => openRouterProvider(PREMIUM_MODELS.CLAUDE_35);
export const gpt4oProvider = () => openRouterProvider(PREMIUM_MODELS.GPT_4O);
export const geminiProProvider = () => openRouterProvider(PREMIUM_MODELS.GEMINI_PRO);