import { NextRequest } from "next/server";
import { aiRoute } from "@/lib/ai/router";

export async function POST(req: NextRequest) {
  const { input, province, language } = await req.json();
  const stream = await aiRoute.streamChat({
    system: `You are Alex, a professional, friendly Canadian mortgage advisor. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.\nUser preferred province: ${province || "BC"}; language: ${language || "en"}. If not English, keep responses concise and friendly.`,
    prompt: input,
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
