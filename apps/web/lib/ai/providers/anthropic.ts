import { ChatProvider } from "../providers";

interface AnthropicMessage {
  role: "user" | "assistant" | "system";
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
  
  console.log("Anthropic Debug:", {
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    model,
  });
  
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
      const messages: AnthropicMessage[] = [];
      
      if (system) {
        messages.push({ role: "system", content: system });
      }
      messages.push({ role: "user", content: prompt });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${error}`);
      }

      const data: AnthropicResponse = await response.json();
      return data.content[0]?.text || "";
    },

    async streamChat({ system, prompt }) {
      const messages: AnthropicMessage[] = [];
      
      if (system) {
        messages.push({ role: "system", content: system });
      }
      messages.push({ role: "user", content: prompt });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${error}`);
      }

      const reader = response.body!.getReader();
      const encoder = new TextEncoder();
      
      return new ReadableStream<Uint8Array>({
        async pull(controller) {
          for await (const chunk of streamAnthropicResponse(reader)) {
            controller.enqueue(encoder.encode(chunk));
            return;
          }
          controller.close();
        },
      });
    },
  };
}

// Export specific model configurations
export const claude35Sonnet = () => anthropicProvider("claude-3-5-sonnet-20241022");
export const claude3Opus = () => anthropicProvider("claude-3-opus-20240229");
export const claude3Haiku = () => anthropicProvider("claude-3-haiku-20240307");