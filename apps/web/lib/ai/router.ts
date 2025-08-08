import { ChatProvider, openAIProvider, echoProvider } from "./providers";

const mode = process.env.AI_MODE || "echo"; // echo | openai
const base: ChatProvider = mode === "openai" ? openAIProvider(process.env.AI_PRIMARY_MODEL || "gpt-4o") : echoProvider();

export const aiRoute = {
  async chat(opts: { system?: string; prompt: string }) { return base.chat(opts); },
  async streamChat(opts: { system?: string; prompt: string }) { return base.streamChat(opts); }
};
