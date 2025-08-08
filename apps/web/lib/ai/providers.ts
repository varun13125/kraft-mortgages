export interface ChatProvider {
  name: string;
  chat(opts: { system?: string; prompt: string; maxTokens?: number; temperature?: number }): Promise<string>;
  streamChat(opts: { system?: string; prompt: string; }): Promise<ReadableStream<Uint8Array>>;
}

function streamFromString(s: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode(s));
      controller.close();
    }
  });
}

export function echoProvider(): ChatProvider {
  return {
    name: "echo",
    async chat({ prompt }) { return `Alex: ${prompt}`; },
    async streamChat({ prompt }) { return streamFromString(`Alex: ${prompt}`); }
  };
}

export function openAIProvider(model: string): ChatProvider {
  async function *sse(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();
    let buf = "";
    for(;;){
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split(/\n/);
      buf = lines.pop() || "";
      for (const line of lines) {
        const l = line.trim();
        if (!l.startsWith("data:")) continue;
        const data = l.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.text ?? "";
          if (delta) yield delta as string;
        } catch {}
      }
    }
  }

  return {
    name: "openai",
    async chat({ system, prompt, maxTokens = 512, temperature = 0.2 }) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model, temperature, max_tokens: maxTokens, messages: [ system ? { role: "system", content: system } : null, { role: "user", content: prompt } ].filter(Boolean) })
      });
      const json = await res.json();
      return json.choices?.[0]?.message?.content || "";
    },
    async streamChat({ system, prompt }) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model, stream: true, messages: [ system ? { role: "system", content: system } : null, { role: "user", content: prompt } ].filter(Boolean) })
      });
      const reader = res.body!.getReader();
      const enc = new TextEncoder();
      return new ReadableStream<Uint8Array>({
        async pull(controller) {
          for await (const chunk of sse(reader)) {
            controller.enqueue(enc.encode(chunk));
            return;
          }
          controller.close();
        }
      });
    }
  };
}

// Optional aliases to match earlier router structure
export const anthropicProvider = openAIProvider as any; // replace with real impl
export const googleProvider = openAIProvider as any; // replace with real impl
export const openRouterProvider = openAIProvider as any; // replace with real impl
