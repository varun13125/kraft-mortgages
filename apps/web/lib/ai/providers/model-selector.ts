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
  currentPage?: string;
  pageContext?: {
    pageType?: string;
    pageName?: string;
    calculatorType?: string;
  };
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

  private constructor() { }

  static getInstance(): ModelSelector {
    if (!ModelSelector.instance) {
      ModelSelector.instance = new ModelSelector();
    }
    return ModelSelector.instance;
  }

  selectModel(context: QueryContext): ModelSelection {
    const message = context.message.toLowerCase();
    const attempts = context.previousAttempts || 0;

    // Force model if specified
    if (context.forceModel) {
      return this.getModelConfig(context.forceModel);
    }

    // --- TIER 3: PREMIUM FALLBACK (Attempts > 1) ---
    if (attempts > 1) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "Fallback to premium after multiple failures",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // --- TIER 2: ALTERNATE FREE MODELS (Attempt == 1) ---
    // If first attempt failed, try a different high-quality free model
    if (attempts === 1) {
      // If we used a reasoning model properly, fallback to Gemini
      return {
        provider: "openrouter",
        model: FREE_MODELS.GENERAL, // Gemini 2.0 Flash is very stable
        reason: "First retry: Switching to Gemini 2.0 Flash (Stable)",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // --- TIER 1: CONTEXT-AWARE FREE MODELS (Attempt == 0) ---

    // High-value lead - try Premium immediately
    if (context.leadScore && context.leadScore > 70) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "High-value lead requiring premium experience",
        estimatedCost: 0.003,
        isFree: false,
      };
    }

    // Calculator/Deep Research Context
    if (
      (context.pageContext?.pageType === "calculator" ||
        context.currentPage?.includes("/calculators") ||
        this.isResearchQuery(message))
    ) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.DEEPRESEARCH,
        reason: "Deep research/calculation context",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Complex Reasoning / Logic
    if (this.requiresReasoning(message) || this.hasComplexKeywords(message)) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.CHIMERA, // TNG Chimera (R1 + Llama) is excellent for logic
        reason: "Complex reasoning required",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Coding / Calculation specific
    if (this.hasCalculationKeywords(message)) {
      return {
        provider: "openrouter",
        model: FREE_MODELS.CODER, // Qwen Coder
        reason: "Calculation/technical query",
        estimatedCost: 0,
        isFree: true,
      };
    }

    // Default: Gemini 2.0 Flash (Best all-rounder)
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

  private isResearchQuery(message: string): boolean {
    const researchKeywords = [
      "research",
      "analyze",
      "analysis",
      "in-depth",
      "deep dive",
      "explain in detail",
      "market trends",
      "historical",
      "comprehensive",
      "thorough",
      "study",
      "investigate",
    ];
    return researchKeywords.some(keyword => message.includes(keyword));
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