import { NextRequest } from "next/server";
import { aiRouterV2 } from "@/lib/ai/router-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      message,
      conversationHistory,
      leadScore,
      userIntent,
      province,
      language,
      tools,
      sessionId,
      forceModel,
      stream = true
    } = body;

    // Validate required fields
    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create chat request
    const chatRequest = {
      message,
      conversationHistory,
      leadScore,
      userIntent,
      province,
      language,
      tools,
      sessionId,
      forceModel,
    };

    if (stream) {
      // Return streaming response
      const response = await aiRouterV2.streamChat(chatRequest);
      
      // Add metadata as headers
      const headers = new Headers({
        "Content-Type": "text/plain; charset=utf-8",
        "X-Model-Used": response.metadata.modelUsed,
        "X-Provider": response.metadata.provider,
        "X-Is-Free": response.metadata.isFree.toString(),
        "X-Cost": response.metadata.cost.toString(),
        "X-Response-Time": response.metadata.responseTime.toString(),
        "X-Attempts": response.metadata.attempts.toString(),
      });

      return new Response(response.content as ReadableStream<Uint8Array>, { headers });
    } else {
      // Return JSON response
      const response = await aiRouterV2.chat(chatRequest);
      
      return new Response(
        JSON.stringify({
          content: response.content,
          metadata: response.metadata,
          suggestions: response.suggestions,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

  } catch (error) {
    console.error("Chat API V2 error:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Unable to process your request. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get analytics endpoint
    const analytics = aiRouterV2.getAnalytics();
    
    return new Response(
      JSON.stringify({
        analytics,
        status: "healthy",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get analytics" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}