import { NextRequest } from "next/server";
import { aiRouterV2 } from "@/lib/ai/router-v2";
import { rateLimit, tooManyRequests, requireAdmin } from "@/lib/ai/request-guards";

// Legacy endpoint (used only by components/ChatAlex.tsx on /old-design). The live site
// widget uses /api/chat. Public + unauthenticated, so inputs are bounded and clients can
// no longer escalate to paid models via `forceModel` / `leadScore`.
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_CHARS = 4000;

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "chat-v2-min", 20, 60_000);
  if (!limited.ok) return tooManyRequests(limited.retryAfterSec);

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      message,
      conversationHistory,
      userIntent,
      province,
      language,
      tools,
      sessionId,
      stream = true
    } = body ?? {};

    // Validate required fields
    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return new Response(
        JSON.stringify({ error: `Message too long (max ${MAX_MESSAGE_CHARS} characters)` }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-MAX_HISTORY_MESSAGES)
          .filter((m: any) => m && typeof m.content === "string")
          .map((m: any) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content.slice(0, MAX_HISTORY_MESSAGE_CHARS),
          }))
      : undefined;

    // Create chat request. `forceModel` and `leadScore` are intentionally NOT taken from the
    // public request body: both route to paid Claude models. Admins can test models via
    // POST /api/ai/models instead.
    const chatRequest = {
      message,
      conversationHistory: safeHistory,
      userIntent: typeof userIntent === "string" ? userIntent.slice(0, 100) : undefined,
      province: typeof province === "string" && ["BC", "AB", "ON"].includes(province) ? province : undefined,
      language: typeof language === "string" ? language.slice(0, 10) : undefined,
      tools: Boolean(tools),
      sessionId: typeof sessionId === "string" ? sessionId.slice(0, 100) : undefined,
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
    console.error("Chat API V2 error:", error instanceof Error ? error.message : error);

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

// Cost / usage analytics: admin only.
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
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
