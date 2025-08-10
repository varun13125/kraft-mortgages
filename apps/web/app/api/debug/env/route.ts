import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    firebase: {
      hasJSON: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      hasProj: !!process.env.FIREBASE_PROJECT_ID,
      hasClient: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasKey: !!process.env.FIREBASE_PRIVATE_KEY
    },
    ai: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
      hasGoogle: !!process.env.GOOGLE_API_KEY,
      hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
    },
    other: {
      hasTavily: !!process.env.TAVILY_API_KEY,
      aiMode: process.env.AI_MODE || "unset",
      hasWordPress: !!process.env.WORDPRESS_BASE_URL,
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    }
  });
}