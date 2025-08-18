import { NextRequest } from "next/server";
import { aiRouterV2 } from "@/lib/ai/router-v2";
import { FREE_MODELS, PREMIUM_MODELS } from "@/lib/ai/providers/openrouter";

export async function GET(req: NextRequest) {
  try {
    const analytics = aiRouterV2.getAnalytics();
    
    return new Response(
      JSON.stringify({
        availableModels: {
          free: FREE_MODELS,
          premium: {
            CLAUDE_35: "claude-3-5-sonnet-20241022",
            ...PREMIUM_MODELS,
          },
        },
        analytics,
        costSavings: {
          estimatedMonthlyCost: `$${(analytics.averageCostPerQuery * 1000).toFixed(2)} for 1000 queries`,
          freeModelUsage: `${(analytics.freeModelUsage * 100).toFixed(1)}%`,
          paidModelUsage: `${(analytics.paidModelUsage * 100).toFixed(1)}%`,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get model information" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, model, province } = await req.json();
    
    if (!message || !model) {
      return new Response(
        JSON.stringify({ error: "Message and model are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Test specific model
    const response = await aiRouterV2.testModel(message, model, province);
    
    return new Response(
      JSON.stringify({
        content: response.content,
        metadata: response.metadata,
        testInfo: {
          requestedModel: model,
          actualModel: response.metadata.modelUsed,
          wasForced: model === response.metadata.modelUsed,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Model testing error:", error);
    
    return new Response(
      JSON.stringify({
        error: "Model test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}