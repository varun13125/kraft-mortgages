import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Only allow in development or with a secret key
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.NODE_ENV === "production" && secret !== "debug-kraft-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check which API keys are configured
  const envStatus = {
    environment: process.env.NODE_ENV,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
    hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
    hasOpenRouterAlt: !!process.env.OPEN_ROUTER_API_KEY,
    hasGoogleAI: !!process.env.GOOGLE_API_KEY,
    hasHubSpot: !!process.env.HUBSPOT_API_KEY,
    aiMode: process.env.AI_MODE || "not set",
    aiPrimaryModel: process.env.AI_PRIMARY_MODEL || "not set",
    // List all env vars starting with certain prefixes (without values)
    envKeys: Object.keys(process.env)
      .filter(key => 
        key.includes("AI") || 
        key.includes("OPENAI") || 
        key.includes("ANTHROPIC") || 
        key.includes("OPENROUTER") ||
        key.includes("OPEN_ROUTER") ||
        key.includes("GOOGLE")
      )
      .sort(),
  };

  return NextResponse.json(envStatus, { 
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    }
  });
}