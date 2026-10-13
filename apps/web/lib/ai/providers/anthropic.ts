import { ChatProvider } from "../providers";

// NOTE (audit 2026-10): every model ID referenced in this file and in model-selector.ts /
// fallback-handler.ts (claude-3-5-sonnet-20241022, claude-3-opus-20240229,
// claude-3-haiku-20240307) has been retired by Anthropic, so these calls currently fail.
// Choosing a replacement model is a cost decision for the owner - see
// DEVLOG/audit-2026-10/ai-chat-voice.md.

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export function anthropicProvider(model: string = "claude-3-5-sonnet-20241022"): ChatProvider {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured - check environment variables");
  }

  async function* streamAnthropicResponse(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;

          try {
            const json = JSON.parse(data);
            if (json.type === "content_block_delta" && json.delta?.text) {
              yield json.delta.text;
            } else if (json.type === "message_delta" && json.delta?.text) {
              yield json.delta.text;
            } else if (json.type === "message_stop") {
              return;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  return {
    name: `anthropic-${model}`,

    async chat({ system, prompt, maxTokens = 1024, temperature = 0.3 }) {
      // The Messages API takes the system prompt as a top-level `system` field;
      // a { role: "system" } entry inside `messages` is rejected with a 400.
      const messages: AnthropicMessage[] = [{ role: "user", content: prompt }];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          ...(system ? { system } : {}),
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${error.slice(0, 300)}`);
      }

      const data: AnthropicResponse = await response.json();
      return data.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");
    },

    async streamChat({ system, prompt }) {
      const messages: AnthropicMessage[] = [{ role: "user", content: prompt }];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          ...(system ? { system } : {}),
          messages,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${error.slice(0, 300)}`);
      }

      const reader = response.body!.getReader();
      const encoder = new TextEncoder();
      // Create the SSE iterator ONCE. Re-creating it on every pull() and returning out of
      // for-await closed the generator and discarded other events buffered from the same read.
      const chunks = streamAnthropicResponse(reader);

      return new ReadableStream<Uint8Array>({
        async pull(controller) {
          try {
            const { value, done } = await chunks.next();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(encoder.encode(value));
            }
          } catch (err) {
            controller.error(err);
          }
        },
        async cancel() {
          await reader.cancel().catch(() => {});
        },
      });
    },
  };
}

// Export specific model configurations (all three IDs are retired - see note at top of file)
export const claude35Sonnet = () => anthropicProvider("claude-3-5-sonnet-20241022");
export const claude3Opus = () => anthropicProvider("claude-3-opus-20240229");
export const claude3Haiku = () => anthropicProvider("claude-3-haiku-20240307");
