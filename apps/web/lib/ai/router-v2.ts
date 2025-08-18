import { FallbackHandler } from "./providers/fallback-handler";
import { QueryContext, modelSelector } from "./providers/model-selector";

export interface ChatRequestV2 {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  leadScore?: number;
  userIntent?: string;
  province?: string;
  language?: string;
  tools?: boolean;
  sessionId?: string;
  forceModel?: string;
}

export interface ChatResponseV2 {
  content: string | ReadableStream<Uint8Array>;
  metadata: {
    modelUsed: string;
    provider: string;
    isFree: boolean;
    cost: number;
    responseTime: number;
    wasSuccessful: boolean;
    attempts: number;
  };
  suggestions?: string[];
  toolCalls?: any[];
}

export class AIRouterV2 {
  private fallbackHandler: FallbackHandler;
  private static instance: AIRouterV2;

  private constructor() {
    this.fallbackHandler = new FallbackHandler({
      maxRetries: 3,
      timeoutMs: 30000,
      enableFallback: true,
      logErrors: process.env.NODE_ENV === "development",
    });
  }

  static getInstance(): AIRouterV2 {
    if (!AIRouterV2.instance) {
      AIRouterV2.instance = new AIRouterV2();
    }
    return AIRouterV2.instance;
  }

  async chat(request: ChatRequestV2): Promise<ChatResponseV2> {
    const startTime = Date.now();
    
    const context: QueryContext = {
      message: request.message,
      conversationHistory: request.conversationHistory,
      leadScore: request.leadScore,
      userIntent: request.userIntent,
      province: request.province || "BC",
      language: request.language || "en",
      forceModel: request.forceModel,
    };

    try {
      const result = await this.fallbackHandler.executeWithFallback(
        context,
        "chat"
      );

      const responseTime = Date.now() - startTime;

      return {
        content: result.response as string,
        metadata: {
          modelUsed: result.metadata.finalModel.model,
          provider: result.metadata.finalModel.provider,
          isFree: result.metadata.finalModel.isFree,
          cost: result.metadata.totalCost,
          responseTime,
          wasSuccessful: result.metadata.wasSuccessful,
          attempts: result.metadata.attempts.length,
        },
        suggestions: this.generateSuggestions(request.message, context),
      };
    } catch (error) {
      console.error("AI Router V2 error:", error);
      
      return {
        content: "I apologize, but I'm having trouble responding right now. Please contact us directly at 604-593-1550 for immediate assistance.",
        metadata: {
          modelUsed: "error",
          provider: "none",
          isFree: true,
          cost: 0,
          responseTime: Date.now() - startTime,
          wasSuccessful: false,
          attempts: 0,
        },
      };
    }
  }

  async streamChat(request: ChatRequestV2): Promise<ChatResponseV2> {
    const startTime = Date.now();
    
    const context: QueryContext = {
      message: request.message,
      conversationHistory: request.conversationHistory,
      leadScore: request.leadScore,
      userIntent: request.userIntent,
      province: request.province || "BC",
      language: request.language || "en",
      forceModel: request.forceModel,
    };

    try {
      const result = await this.fallbackHandler.executeWithFallback(
        context,
        "streamChat"
      );

      const responseTime = Date.now() - startTime;

      return {
        content: result.response as ReadableStream<Uint8Array>,
        metadata: {
          modelUsed: result.metadata.finalModel.model,
          provider: result.metadata.finalModel.provider,
          isFree: result.metadata.finalModel.isFree,
          cost: result.metadata.totalCost,
          responseTime,
          wasSuccessful: result.metadata.wasSuccessful,
          attempts: result.metadata.attempts.length,
        },
        suggestions: this.generateSuggestions(request.message, context),
      };
    } catch (error) {
      console.error("AI Router V2 stream error:", error);
      
      // Return error as stream
      const errorMessage = "I apologize, but I'm having trouble responding right now. Please contact us directly at 604-593-1550 for immediate assistance.";
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      });
      
      return {
        content: stream,
        metadata: {
          modelUsed: "error",
          provider: "none",
          isFree: true,
          cost: 0,
          responseTime: Date.now() - startTime,
          wasSuccessful: false,
          attempts: 0,
        },
      };
    }
  }

  private generateSuggestions(message: string, context: QueryContext): string[] {
    const messageLower = message.toLowerCase();
    const suggestions: string[] = [];

    // Mortgage calculation suggestions
    if (messageLower.includes("afford") || messageLower.includes("qualify")) {
      suggestions.push("Calculate my affordability");
      suggestions.push("Check required documents");
    }

    // Rate-related suggestions
    if (messageLower.includes("rate") || messageLower.includes("interest")) {
      suggestions.push("Compare current rates");
      suggestions.push("Calculate payments");
    }

    // Application process suggestions
    if (messageLower.includes("apply") || messageLower.includes("process")) {
      suggestions.push("Start application");
      suggestions.push("Book consultation");
      suggestions.push("Upload documents");
    }

    // First-time buyer suggestions
    if (messageLower.includes("first time") || messageLower.includes("first home")) {
      suggestions.push("First-time buyer incentives");
      suggestions.push("Check down payment requirements");
    }

    // Investment property suggestions
    if (messageLower.includes("investment") || messageLower.includes("rental")) {
      suggestions.push("Calculate rental income");
      suggestions.push("Investment property rates");
    }

    // MLI Select suggestions
    if (messageLower.includes("multi") || messageLower.includes("apartment")) {
      suggestions.push("Check MLI Select eligibility");
      suggestions.push("Multi-unit financing options");
    }

    // Default suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push("Calculate affordability");
      suggestions.push("Compare rates");
      suggestions.push("Book consultation");
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  // Public method to get model selection without executing
  selectModel(request: ChatRequestV2) {
    const context: QueryContext = {
      message: request.message,
      conversationHistory: request.conversationHistory,
      leadScore: request.leadScore,
      userIntent: request.userIntent,
      province: request.province || "BC",
      language: request.language || "en",
      forceModel: request.forceModel,
    };

    return modelSelector.selectModel(context);
  }

  // Public method to get analytics
  getAnalytics() {
    return this.fallbackHandler.getCostAnalytics();
  }

  // Method to test different models
  async testModel(
    message: string,
    modelName: string,
    province?: string
  ): Promise<ChatResponseV2> {
    return this.chat({
      message,
      forceModel: modelName,
      province: province || "BC",
    });
  }
}

// Export singleton instance
export const aiRouterV2 = AIRouterV2.getInstance();

// Legacy compatibility - update existing aiRoute to use V2
export const aiRoute = {
  async chat(opts: { system?: string; prompt: string }) {
    const response = await aiRouterV2.chat({
      message: opts.prompt,
    });
    return response.content as string;
  },
  
  async streamChat(opts: { system?: string; prompt: string }) {
    const response = await aiRouterV2.streamChat({
      message: opts.prompt,
    });
    return response.content as ReadableStream<Uint8Array>;
  }
};