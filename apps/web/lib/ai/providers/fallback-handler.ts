import { ChatProvider } from "../providers";
import { ModelSelection, QueryContext, modelSelector } from "./model-selector";
import { anthropicProvider } from "./anthropic";
import { openRouterProvider, FREE_MODELS } from "./openrouter";

export interface FallbackConfig {
  maxRetries: number;
  timeoutMs: number;
  enableFallback: boolean;
  logErrors: boolean;
}

export interface AttemptResult {
  success: boolean;
  response?: string;
  error?: string;
  provider: string;
  model: string;
  durationMs: number;
  cost: number;
}

export class FallbackHandler {
  private config: FallbackConfig;
  private attempts: Map<string, AttemptResult[]> = new Map();

  constructor(config: Partial<FallbackConfig> = {}) {
    this.config = {
      maxRetries: 3,
      timeoutMs: 30000,
      enableFallback: true,
      logErrors: true,
      ...config,
    };
  }

  async executeWithFallback(
    context: QueryContext,
    operation: "chat" | "streamChat" = "streamChat"
  ): Promise<{
    response: string | ReadableStream<Uint8Array>;
    metadata: {
      finalModel: ModelSelection;
      attempts: AttemptResult[];
      totalCost: number;
      wasSuccessful: boolean;
    };
  }> {
    const sessionId = this.generateSessionId(context);
    const attempts: AttemptResult[] = [];
    let totalCost = 0;
    
    // Start with initial model selection
    let modelSelection = modelSelector.selectModel(context);
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      const startTime = Date.now();
      
      try {
        const provider = this.getProvider(modelSelection);
        const result = await this.executeWithTimeout(
          provider,
          context,
          operation,
          this.config.timeoutMs
        );

        const duration = Date.now() - startTime;
        const attemptResult: AttemptResult = {
          success: true,
          response: typeof result === "string" ? result : "[Stream]",
          provider: modelSelection.provider,
          model: modelSelection.model,
          durationMs: duration,
          cost: modelSelection.estimatedCost,
        };

        attempts.push(attemptResult);
        totalCost += modelSelection.estimatedCost;
        
        // Success! Store attempts and return
        this.attempts.set(sessionId, attempts);
        
        return {
          response: result,
          metadata: {
            finalModel: modelSelection,
            attempts,
            totalCost,
            wasSuccessful: true,
          },
        };

      } catch (error) {
        const duration = Date.now() - startTime;
        const attemptResult: AttemptResult = {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          provider: modelSelection.provider,
          model: modelSelection.model,
          durationMs: duration,
          cost: 0, // No cost for failed attempts
        };

        attempts.push(attemptResult);
        
        if (this.config.logErrors) {
          console.error(`Attempt ${attempt} failed:`, {
            model: modelSelection.model,
            provider: modelSelection.provider,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            attemptError: attemptResult.error,
            duration,
          });
        }

        // If this isn't the last attempt, select a fallback model
        if (attempt < this.config.maxRetries && this.config.enableFallback) {
          modelSelection = this.selectFallbackModel(modelSelection, attempts, context);
        }
      }
    }

    // All attempts failed - return error response
    this.attempts.set(sessionId, attempts);
    
    return {
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact us directly at 604-593-1550.",
      metadata: {
        finalModel: modelSelection,
        attempts,
        totalCost,
        wasSuccessful: false,
      },
    };
  }

  private async executeWithTimeout(
    provider: ChatProvider,
    context: QueryContext,
    operation: "chat" | "streamChat",
    timeoutMs: number
  ): Promise<string | ReadableStream<Uint8Array>> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const execute = async () => {
        try {
          let result;
          if (operation === "chat") {
            result = await provider.chat({
              system: this.getSystemPrompt(context),
              prompt: context.message,
            });
          } else {
            result = await provider.streamChat({
              system: this.getSystemPrompt(context),
              prompt: context.message,
            });
          }
          
          clearTimeout(timeout);
          resolve(result);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };

      execute();
    });
  }

  private selectFallbackModel(
    failedModel: ModelSelection,
    previousAttempts: AttemptResult[],
    context: QueryContext
  ): ModelSelection {
    // If free model failed, try Claude
    if (failedModel.isFree) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: `Fallback from failed ${failedModel.model}`,
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // If Claude failed, try a different free model
    if (failedModel.provider === "anthropic") {
      // Try different free model based on context
      const newContext = { ...context, previousAttempts: previousAttempts.length };
      return modelSelector.selectModel(newContext);
    }

    // If OpenRouter model failed, try a different one
    if (failedModel.provider === "openrouter") {
      const usedModels = previousAttempts.map(a => a.model);
      const availableModels = Object.values(FREE_MODELS).filter(
        model => !usedModels.includes(model)
      );
      
      if (availableModels.length > 0) {
        return {
          provider: "openrouter",
          model: availableModels[0],
          reason: "Alternative free model",
          estimatedCost: 0,
          isFree: true,
        };
      }
    }

    // Final fallback to Claude
    return {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      reason: "Final fallback",
      estimatedCost: 0.003,
      isFree: false,
    };
  }

  private getProvider(selection: ModelSelection): ChatProvider {
    switch (selection.provider) {
      case "anthropic":
        return anthropicProvider(selection.model);
      case "openrouter":
        return openRouterProvider(selection.model);
      default:
        throw new Error(`Unsupported provider: ${selection.provider}`);
    }
  }

  private getSystemPrompt(context: QueryContext): string {
    const basePrompt = `You are Alex, a professional, friendly Canadian mortgage advisor working for Kraft Mortgages. 
You serve BC, AB, and ON and follow provincial compliance requirements.
Do not provide legal or tax advice - refer clients to appropriate professionals for those matters.`;

    const locationPrompt = context.province 
      ? `\nUser preferred province: ${context.province}` 
      : "\nUser preferred province: BC (default)";
    
    const languagePrompt = context.language && context.language !== "en"
      ? `\nUser language: ${context.language}. Keep responses concise and friendly.`
      : "";

    return basePrompt + locationPrompt + languagePrompt;
  }

  private generateSessionId(context: QueryContext): string {
    // Generate a simple session ID for tracking attempts
    const content = context.message.slice(0, 50);
    const timestamp = Date.now();
    return `${content.replace(/\W/g, "")}_${timestamp}`;
  }

  // Public method to get attempt history for debugging
  getAttemptHistory(sessionId: string): AttemptResult[] | undefined {
    return this.attempts.get(sessionId);
  }

  // Public method to get cost analytics
  getCostAnalytics(): {
    totalCost: number;
    freeModelUsage: number;
    paidModelUsage: number;
    averageCostPerQuery: number;
    failureRate: number;
  } {
    let totalCost = 0;
    let freeQueries = 0;
    let paidQueries = 0;
    let failedQueries = 0;
    let totalQueries = 0;

    for (const attempts of this.attempts.values()) {
      totalQueries++;
      const lastAttempt = attempts[attempts.length - 1];
      
      if (lastAttempt.success) {
        totalCost += attempts.reduce((sum, attempt) => sum + attempt.cost, 0);
        if (lastAttempt.cost === 0) {
          freeQueries++;
        } else {
          paidQueries++;
        }
      } else {
        failedQueries++;
      }
    }

    return {
      totalCost,
      freeModelUsage: totalQueries > 0 ? freeQueries / totalQueries : 0,
      paidModelUsage: totalQueries > 0 ? paidQueries / totalQueries : 0,
      averageCostPerQuery: totalQueries > 0 ? totalCost / totalQueries : 0,
      failureRate: totalQueries > 0 ? failedQueries / totalQueries : 0,
    };
  }
}