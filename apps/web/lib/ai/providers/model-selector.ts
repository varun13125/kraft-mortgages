import { FREE_MODELS, PREMIUM_MODELS } from "./openrouter";

export interface QueryContext {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  leadScore?: number;
  userIntent?: string;
  province?: string;
  language?: string;
  previousAttempts?: number;
  forceModel?: string;
}

export interface ModelSelection {
  provider: "anthropic" | "openrouter" | "openai" | "google";
  model: string;
  reason: string;
  estimatedCost: number;
  isFree: boolean;
}

// Keywords that require premium models for accuracy
const COMPLEX_KEYWORDS = [
  "self-employed",
  "bankruptcy",
  "consumer proposal",
  "private lending",
  "construction",
  "multi-unit",
  "non-resident",
  "new immigrant",
  "stated income",
  "alternative lending",
  "b-lender",
  "bad credit",
  "foreclosure",
  "power of sale",
];

const COMPLIANCE_KEYWORDS = [
  "cmhc",
  "stress test",
  "b-20",
  "osfi",
  "provincial regulation",
  "tax",
  "legal",
  "compliance",
  "qualification rules",
  "mortgage rules",
];

const CALCULATION_KEYWORDS = [
  "calculate",
  "how much",
  "payment",
  "afford",
  "interest",
  "amortization",
  "rate",
  "monthly",
  "bi-weekly",
  "comparison",
  "break-even",
  "penalty",
];

const SIMPLE_INTENTS = [
  "greeting",
  "hours",
  "location",
  "contact",
  "thank you",
  "goodbye",
  "yes",
  "no",
  "okay",
];

export class ModelSelector {
  private static instance: ModelSelector;
  
  private constructor() {}
  
  static getInstance(): ModelSelector {
    if (!ModelSelector.instance) {
      ModelSelector.instance = new ModelSelector();
    }
    return ModelSelector.instance;
  }

  selectModel(context: QueryContext): ModelSelection {
    const message = context.message.toLowerCase();
    
    // Force model if specified (for testing)
    if (context.forceModel) {
      return this.getModelConfig(context.forceModel);
    }

    // High-value lead - use Claude for better conversion
    if (context.leadScore && context.leadScore > 70) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "High-value lead requiring premium experience",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // User explicitly ready to apply
    if (context.userIntent === "ready_to_apply" || message.includes("apply now")) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Application intent detected",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // Complex financial scenarios requiring expertise
    if (this.hasComplexKeywords(message)) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Complex mortgage scenario requiring expertise",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // Compliance and legal questions need accuracy
    if (this.hasComplianceKeywords(message)) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Compliance/legal question requiring accuracy",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // Calculation requests - use free Qwen Coder
    if (this.hasCalculationKeywords(message)) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.CODER,
        reason: "Mathematical calculation request",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Long conversation context - use Kimi
    if (context.conversationHistory && context.conversationHistory.length > 10) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.LONG_CONTEXT,
        reason: "Long conversation requiring context retention",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Simple/quick responses - use Gemma
    if (this.isSimpleQuery(message)) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.QUICK,
        reason: "Simple query with quick response",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Complex reasoning but not financial - use DeepSeek
    if (this.requiresReasoning(message)) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.COMPLEX,
        reason: "Complex reasoning required",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Retry logic - escalate to premium after failures
    if (context.previousAttempts && context.previousAttempts > 1) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Fallback after failed attempts",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // Default to free general model
    return {
      provider: "openrouter",
      model: FREE_MODELS.GENERAL,
      reason: "General conversation",
      estimatedCost: 0,
      isFree: true,
    };
  }

  private hasComplexKeywords(message: string): boolean {
    return COMPLEX_KEYWORDS.some(keyword => message.includes(keyword));
  }

  private hasComplianceKeywords(message: string): boolean {
    return COMPLIANCE_KEYWORDS.some(keyword => message.includes(keyword));
  }

  private hasCalculationKeywords(message: string): boolean {
    return CALCULATION_KEYWORDS.some(keyword => message.includes(keyword));
  }

  private isSimpleQuery(message: string): boolean {
    // Check if it's a simple intent
    if (SIMPLE_INTENTS.some(intent => message.includes(intent))) {
      return true;
    }
    
    // Check message length (short messages are usually simple)
    if (message.split(" ").length < 5) {
      return true;
    }
    
    // Check for question words at start
    const simpleStarts = ["what is your", "where is", "when are", "are you"];
    return simpleStarts.some(start => message.startsWith(start));
  }

  private requiresReasoning(message: string): boolean {
    const reasoningKeywords = [
      "compare",
      "difference between",
      "should i",
      "what if",
      "pros and cons",
      "better",
      "recommend",
      "advice",
      "suggest",
      "help me decide",
    ];
    return reasoningKeywords.some(keyword => message.includes(keyword));
  }

  private getModelConfig(modelName: string): ModelSelection {
    // Helper to return config for forced model selection
    if (modelName.includes("claude")) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Forced model selection",
        estimatedCost: 0.003,
        isFree: false,
      };
    }
    
    // Return appropriate free model
    const freeModelKey = Object.keys(FREE_MODELS).find(
      key => FREE_MODELS[key as keyof typeof FREE_MODELS].includes(modelName)
    );
    
    if (freeModelKey) {
      return {
        provider: "openrouter",
        model: modelName,
        reason: "Forced model selection",
        estimatedCost: 0,
        isFree: true,
      };
    }
    
    // Default
    return {
      provider: "openrouter",
      model: FREE_MODELS.GENERAL,
      reason: "Default fallback",
      estimatedCost: 0,
      isFree: true,
    };
  }

  // Analyze query complexity for logging/metrics
  analyzeComplexity(message: string): {
    score: number;
    factors: string[];
  } {
    let score = 0;
    const factors: string[] = [];

    if (this.hasComplexKeywords(message)) {
      score += 30;
      factors.push("complex_scenario");
    }

    if (this.hasComplianceKeywords(message)) {
      score += 25;
      factors.push("compliance");
    }

    if (this.hasCalculationKeywords(message)) {
      score += 15;
      factors.push("calculation");
    }

    if (message.length > 200) {
      score += 10;
      factors.push("long_query");
    }

    if (message.split(".").length > 2) {
      score += 10;
      factors.push("multi_part");
    }

    return { score, factors };
  }
}

export const modelSelector = ModelSelector.getInstance();