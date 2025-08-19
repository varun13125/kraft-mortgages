import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

class LLMRouter {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private google?: GoogleGenerativeAI;
  private openrouter?: OpenAI;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    if (process.env.GOOGLE_API_KEY) {
      this.google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }
    if (process.env.OPEN_ROUTER_API_KEY) {
      this.openrouter = new OpenAI({
        apiKey: process.env.OPEN_ROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      });
    }
  }

  async generate(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<LLMResponse> {
    const { temperature = 0.7, maxTokens = 2000 } = options || {};

    // Try OpenAI first (best quality for content generation)
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: messages as any,
          temperature,
          max_tokens: maxTokens,
        });

        return {
          content: response.choices[0]?.message?.content || '',
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          } : undefined,
        };
      } catch (error) {
        console.warn('OpenAI failed, trying next provider:', error);
      }
    }

    // Try Anthropic
    if (this.anthropic) {
      try {
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const response = await this.anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: maxTokens,
          temperature,
          system: systemMessage?.content,
          messages: userMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        });

        const content = response.content
          .filter(c => c.type === 'text')
          .map(c => c.type === 'text' ? c.text : '')
          .join('');

        return {
          content,
          usage: response.usage ? {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
          } : undefined,
        };
      } catch (error) {
        console.warn('Anthropic failed, trying next provider:', error);
      }
    }

    // Try Google Gemini
    if (this.google) {
      try {
        const model = this.google.getGenerativeModel({ model: 'gemini-1.5-pro' });
        
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return {
          content: response.text(),
        };
      } catch (error) {
        console.warn('Google failed, trying next provider:', error);
      }
    }

    // Try OpenRouter as fallback
    if (this.openrouter) {
      try {
        const response = await this.openrouter.chat.completions.create({
          model: 'openai/gpt-4-turbo-preview',
          messages: messages as any,
          temperature,
          max_tokens: maxTokens,
        });

        return {
          content: response.choices[0]?.message?.content || '',
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          } : undefined,
        };
      } catch (error) {
        console.warn('OpenRouter failed:', error);
      }
    }

    throw new Error('No LLM provider available. Please configure at least one API key.');
  }

  isAvailable(): boolean {
    return !!(this.openai || this.anthropic || this.google || this.openrouter);
  }
}

export const llm = new LLMRouter();