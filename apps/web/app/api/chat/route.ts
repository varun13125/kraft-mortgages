import { NextRequest } from "next/server";
import { openRouterProvider } from "@/lib/ai/providers/openrouter";
import { rateToolsInstance } from "@/lib/ai/tools/rate-tools";
import { PageContext, generatePageContextPrompt } from "@/lib/ai/page-context";
import { modelSelector } from "@/lib/ai/providers/model-selector";

export async function POST(req: NextRequest) {
  let currentModel = "";
  let providerName = "";
  let isFreeModel = true;

  try {
    const { input, province, language, currentPage, pageContext } = await req.json();

    if (!input) {
      return new Response('Input is required', { status: 400 });
    }

    // Generate page-specific context for the AI
    const pageContextPrompt = pageContext ? generatePageContextPrompt(pageContext as PageContext) : '';

    // Build the base system prompt
    const buildSystemPrompt = () => `You are Alexa, a professional, friendly Canadian female mortgage advisor working for Kraft Mortgages. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.

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

    const systemPrompt = buildSystemPrompt();

    // Select initial model
    let selection = modelSelector.selectModel({
      message: input,
      province,
      language,
      currentPage,
      pageContext,
      previousAttempts: 0
    });

    // Retry loop for fallback strategy
    let attempts = 0;
    const maxAttempts = 2; // Try up to 2 times (Initial -> Fallback)

    while (attempts < maxAttempts) {
      try {
        currentModel = selection.model;
        providerName = selection.provider;
        isFreeModel = selection.isFree;

        const provider = openRouterProvider(selection.model);

        // Check for rate queries first (only on first attempt to avoid doubleDB hits)
        if (attempts === 0) {
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
                const enhancedPrompt = `User asked: ${input}\n\nHere are the ACTUAL current mortgage rates from our database:\n${ratesInfo}\n\nPlease use these EXACT rates in your response.`;

                const stream = await provider.streamChat({
                  system: systemPrompt,
                  prompt: enhancedPrompt,
                });

                return new Response(stream, {
                  headers: {
                    "content-type": "text/plain; charset=utf-8",
                    "X-Model-Used": currentModel,
                    "X-Provider": providerName,
                    "X-Is-Free": String(isFreeModel),
                    "X-Tool-Used": "getCurrentRates"
                  }
                });
              }
            } catch (e) {
              console.error("Rate tool error:", e);
              // Continue to normal chat if tool fails
            }
          }
        }

        // Standard Chat Request
        const enhancedInput = input + "\n\nREMINDER: Never say '5.25%' for stress test - use 'current benchmark rate'. Max insured mortgage is $1.5M not $1M.";

        const stream = await provider.streamChat({
          system: systemPrompt,
          prompt: enhancedInput,
        });

        return new Response(stream, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "X-Model-Used": currentModel,
            "X-Provider": providerName,
            "X-Is-Free": String(isFreeModel)
          }
        });

      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed with model ${currentModel}:`, error);
        attempts++;

        if (attempts < maxAttempts) {
          // Select fallback model
          selection = modelSelector.selectModel({
            message: input,
            province,
            language,
            currentPage,
            pageContext,
            previousAttempts: attempts
          });
          console.log(`Falling back to model: ${selection.model}`);
        } else {
          throw error; // Rethrow if we've run out of retries
        }
      }
    }

  } catch (error) {
    console.error('Chat API Fatal Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
        lastModel: currentModel
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  return new Response(JSON.stringify({ error: "Unexpected end of function" }), { status: 500 });
}
