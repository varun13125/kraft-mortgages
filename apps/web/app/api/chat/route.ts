import { NextRequest } from "next/server";
import { rateToolsInstance } from "@/lib/ai/tools/rate-tools";
import { PageContext, generatePageContextPrompt } from "@/lib/ai/page-context";

// Free models to try first (via OpenRouter)
const FREE_MODELS = [
  "moonshotai/kimi-k2:free",           // Primary: Kimi K2 (Long context, high quality)
  "tngtech/deepseek-r1t2-chimera:free", // Fallback 1: DeepSeek Chimera (Reasoning)
  "qwen/qwen3-coder:free",              // Fallback 2: Qwen Coder
  "mistralai/devstral-2512:free",       // Fallback 3: Devstral
];

// Paid models for final fallback (direct API)
const PAID_MODELS = {
  openai: "gpt-5.2",      // ChatGPT 5.2 via OPENAI_API_KEY
  google: "gemini-3", // Gemini 3 via GOOGLE_API_KEY
};

async function callOpenRouter(model: string, systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://kraftmortgages.ca",
      "X-Title": "Kraft Mortgages AI Assistant",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 4096,
      temperature: 0.3,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter ${model} error: ${response.status} - ${error}`);
  }

  return response;
}

async function callOpenAI(systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: PAID_MODELS.openai,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 4096,
      temperature: 0.3,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${error}`);
  }

  return response;
}

async function callGoogleAI(systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${PAID_MODELS.google}:streamGenerateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google AI error: ${response.status} - ${error}`);
  }

  return response;
}

// Transform OpenRouter/OpenAI SSE stream to plain text
function createSSETransformStream() {
  return new TransformStream({
    transform(chunk, controller) {
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
          // Skip invalid JSON
        }
      }
    }
  });
}

// Transform Google AI stream to plain text
function createGoogleTransformStream() {
  return new TransformStream({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      try {
        // Google returns JSON array chunks
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (line.startsWith('[')) continue; // Skip array start
          if (line === ']') continue; // Skip array end
          const cleaned = line.replace(/^,/, '').trim();
          if (!cleaned) continue;

          const json = JSON.parse(cleaned);
          const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } catch (e) {
        // Skip parse errors
      }
    }
  });
}

export async function POST(req: NextRequest) {
  const openRouterKey = process.env.OPEN_ROUTER_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const googleKey = process.env.GOOGLE_API_KEY;

  try {
    const { input, province, language, currentPage, pageContext } = await req.json();

    if (!input) {
      return new Response('Input is required', { status: 400 });
    }

    // Generate page-specific context
    const pageContextPrompt = pageContext ? generatePageContextPrompt(pageContext as PageContext) : '';

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
- Maximum purchase price for insured mortgages: $1.5 million (increased from $1M in Dec 2024)
- CMHC/Sagen/Canada Guaranty insurance required for less than 20% down

User preferred province: ${province || "BC"}; language: ${language || "en"}.
${pageContextPrompt}`;

    // Build user prompt with rate data if applicable
    let userPrompt = input;
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
          userPrompt = `User asked: ${input}\n\nHere are the ACTUAL current mortgage rates from our database:\n${ratesInfo}\n\nPlease use these EXACT rates in your response.`;
        }
      } catch (e) {
        console.error("Rate tool error:", e);
      }
    }

    userPrompt += "\n\nREMINDER: Never say '5.25%' for stress test - use 'current benchmark rate'. Max insured mortgage is $1.5M not $1M.";

    // === FALLBACK CHAIN ===
    const errors: string[] = [];

    // TIER 1: Try all free models via OpenRouter
    if (openRouterKey) {
      for (const model of FREE_MODELS) {
        try {
          console.log(`[Chat API] Trying free model: ${model}`);
          const response = await callOpenRouter(model, systemPrompt, userPrompt, openRouterKey);

          return new Response(response.body?.pipeThrough(createSSETransformStream()), {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "X-Model-Used": model,
              "X-Provider": "openrouter",
              "X-Is-Free": "true",
            }
          });
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          console.error(`[Chat API] Free model ${model} failed:`, errorMsg);
          errors.push(`${model}: ${errorMsg}`);
          // Continue to next free model
        }
      }
    }

    // TIER 2: Try OpenAI (ChatGPT)
    if (openAIKey) {
      try {
        console.log(`[Chat API] Falling back to OpenAI: ${PAID_MODELS.openai}`);
        const response = await callOpenAI(systemPrompt, userPrompt, openAIKey);

        return new Response(response.body?.pipeThrough(createSSETransformStream()), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "X-Model-Used": PAID_MODELS.openai,
            "X-Provider": "openai",
            "X-Is-Free": "false",
          }
        });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error(`[Chat API] OpenAI failed:`, errorMsg);
        errors.push(`openai: ${errorMsg}`);
      }
    }

    // TIER 3: Try Google AI (Gemini)
    if (googleKey) {
      try {
        console.log(`[Chat API] Falling back to Google AI: ${PAID_MODELS.google}`);
        const response = await callGoogleAI(systemPrompt, userPrompt, googleKey);

        return new Response(response.body?.pipeThrough(createGoogleTransformStream()), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "X-Model-Used": PAID_MODELS.google,
            "X-Provider": "google",
            "X-Is-Free": "false",
          }
        });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error(`[Chat API] Google AI failed:`, errorMsg);
        errors.push(`google: ${errorMsg}`);
      }
    }

    // All models failed
    console.error("[Chat API] All models failed:", errors);
    return new Response(
      JSON.stringify({
        error: "All AI models failed",
        details: errors,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
