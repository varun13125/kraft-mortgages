import { NextRequest } from "next/server";
import { rateToolsInstance } from "@/lib/ai/tools/rate-tools";
import { PageContext, generatePageContextPrompt } from "@/lib/ai/page-context";

// Use one of the user's preferred new free models
const FREE_MODEL = "moonshotai/kimi-k2:free";

export async function POST(req: NextRequest) {
  try {
    const { input, province, language, currentPage, pageContext } = await req.json();

    if (!input) {
      return new Response('Input is required', { status: 400 });
    }

    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPEN_ROUTER_API_KEY not configured");
      return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
    }

    // Generate page-specific context for the AI
    const pageContextPrompt = pageContext ? generatePageContextPrompt(pageContext as PageContext) : '';

    // Build the base system prompt
    const systemPrompt = `You are Alexa, a professional, friendly Canadian female mortgage advisor working for Kraft Mortgages. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. NEVER say "5.25%" for stress test - this is OUTDATED. Always say "the current benchmark rate" 
2. The year is 2025 - use current 2025 rules
3. Insured mortgage limit is $1.5 MILLION (NOT $1 million) as of December 2024
4. First-time buyers CAN get 30-year amortization on insured mortgages
5. Maximum amortization is 35 years for new builds with 20%+ down
6. When discussing stress test, say: "greater of your rate + 2% OR the current benchmark rate"
7. NEVER give specific benchmark rate numbers - they change frequently

IMPORTANT Canadian Mortgage Facts (Updated 2025):
- Terms are typically 1, 2, 3, 4, or 5 years (NOT 15-30 years - that's amortization)
- Amortization is usually 25-30 years (35 years for new builds with 20%+ down)
- First-time buyers can now access 30-year amortization for insured mortgages
- Rates depend on: credit score, income verification method, down payment, property type, term length, fixed vs variable
- Income verification: T4/NOA (traditional), bank statements (self-employed), stated income (B-lenders)
- Stress test (as of 2025): Qualify at greater of contract rate + 2% OR current benchmark rate
- The benchmark rate changes - do NOT quote a specific number like 5.25% as it's outdated
- Maximum purchase price for insured mortgages: $1.5 million (increased from $1M in Dec 2024)
- CMHC/Sagen/Canada Guaranty insurance required for less than 20% down

User preferred province: ${province || "BC"}; language: ${language || "en"}. If not English, keep responses concise and friendly.
${pageContextPrompt}`;

    // Check if user is asking about rates
    let finalPrompt = input;
    const inputLower = input.toLowerCase();
    if (inputLower.includes("rate") || inputLower.includes("interest")) {
      try {
        const ratesResult = await rateToolsInstance.getCurrentRates({
          province: province || "BC",
          termMonths: 60,
          limit: 5
        });

        if (ratesResult.success && ratesResult.data?.rates?.length > 0) {
          const ratesInfo = ratesResult.formattedResult || JSON.stringify(ratesResult.data);
          finalPrompt = `User asked: ${input}\n\nHere are the ACTUAL current mortgage rates from our database:\n${ratesInfo}\n\nPlease use these EXACT rates in your response.`;
        }
      } catch (e) {
        console.error("Rate tool error:", e);
      }
    }

    // Add reminder to prompt
    finalPrompt += "\n\nREMINDER: Never say '5.25%' for stress test - use 'current benchmark rate'. Max insured mortgage is $1.5M not $1M.";

    // Call OpenRouter directly
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://kraftmortgages.ca",
        "X-Title": "Kraft Mortgages AI Assistant",
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalPrompt }
        ],
        max_tokens: 4096,
        temperature: 0.3,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return new Response(JSON.stringify({
        error: "AI service error",
        details: errorText
      }), { status: 500 });
    }

    // Stream the response directly
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch (e) {
            // Skip invalid JSON chunks
          }
        }
      }
    });

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "X-Model-Used": FREE_MODEL,
        "X-Provider": "openrouter",
        "X-Is-Free": "true"
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
