import { ChatProvider, openAIProvider, echoProvider } from "./providers";
import { openRouterProvider } from "./providers/openrouter";

// Use OpenRouter free model as default
const MODEL_NAME = "z-ai/glm-4.5-air:free";
const base: ChatProvider = openRouterProvider(MODEL_NAME);

export const aiRoute = {
  async chat(opts: { system?: string; prompt: string }) { return base.chat(opts); },
  async streamChat(opts: { system?: string; prompt: string }) { return base.streamChat(opts); }
};
