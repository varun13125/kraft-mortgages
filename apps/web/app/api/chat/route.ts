import { NextRequest } from "next/server";
import { aiRoute } from "@/lib/ai/router";
import { rateToolsInstance } from "@/lib/ai/tools/rate-tools";

// Current model being used (free OpenRouter model)
const CURRENT_MODEL = "z-ai/glm-4.5-air:free";
const PROVIDER = "openrouter";

export async function POST(req: NextRequest) {
  try {
    const { input, province, language } = await req.json();
    
    if (!input) {
      return new Response('Input is required', { status: 400 });
    }
  
  // Check if user is asking about rates
  const inputLower = input.toLowerCase();
  if (inputLower.includes("rate") || inputLower.includes("interest")) {
    try {
      // Get actual rates from database
      const ratesResult = await rateToolsInstance.getCurrentRates({
        province: province || "BC",
        termMonths: 60, // Default to 5-year
        limit: 5
      });
      
      if (ratesResult.success && ratesResult.data && ratesResult.data.rates && ratesResult.data.rates.length > 0) {
        // We have actual rates - use them
        const ratesInfo = ratesResult.formattedResult || JSON.stringify(ratesResult.data);
        const enhancedPrompt = `User asked: ${input}
        
Here are the ACTUAL current mortgage rates from our database:
${ratesInfo}

Please use these EXACT rates in your response. Do not make up or estimate rates.`;
        
        const stream = await aiRoute.streamChat({
          system: `You are Alexa, a professional, friendly Canadian female mortgage advisor working for Kraft Mortgages. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.

IMPORTANT Canadian Mortgage Facts:
- Terms are typically 1, 2, 3, 4, or 5 years (NOT 15-30 years - that's amortization)
- Amortization is usually 25-30 years (the total time to pay off the mortgage)
- Rates depend on: credit score, income verification method (declared vs bank statements), down payment, property type, term length, fixed vs variable
- Income verification methods: T4/NOA (traditional), bank statements (for self-employed), stated income (B-lenders)
- Stress test applies at greater of contract rate + 2% or 5.25%

User preferred province: ${province || "BC"}; language: ${language || "en"}. If not English, keep responses concise and friendly.`,
          prompt: enhancedPrompt,
        });
        
        return new Response(stream, { 
          headers: { 
            "content-type": "text/plain; charset=utf-8",
            "X-Model-Used": CURRENT_MODEL,
            "X-Provider": PROVIDER,
            "X-Is-Free": "true",
            "X-Tool-Used": "getCurrentRates"
          } 
        });
      } else {
        // No rates available - be transparent and helpful
        const noRatesPrompt = `User asked: ${input}

IMPORTANT: We don't have current rate data available in our system right now.

Please respond professionally by:
1. Acknowledging their interest in rates
2. Explaining that rates change frequently and vary by lender
3. Offering to connect them directly with our team for personalized, up-to-date rates
4. Mention they can call 604-593-1550 or book a consultation
5. Ask if there's anything else about mortgages you can help with

DO NOT make up or estimate specific rate numbers. Be helpful but honest.`;
        
        const stream = await aiRoute.streamChat({
          system: `You are Alexa, a professional, friendly Canadian female mortgage advisor working for Kraft Mortgages. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.

IMPORTANT Canadian Mortgage Facts:
- Terms are typically 1, 2, 3, 4, or 5 years (NOT 15-30 years - that's amortization)
- Amortization is usually 25-30 years (the total time to pay off the mortgage)
- Rates depend on: credit score, income verification method (declared vs bank statements), down payment, property type, term length, fixed vs variable
- Income verification methods: T4/NOA (traditional), bank statements (for self-employed), stated income (B-lenders)
- Stress test applies at greater of contract rate + 2% or 5.25%

User preferred province: ${province || "BC"}; language: ${language || "en"}. If not English, keep responses concise and friendly.`,
          prompt: noRatesPrompt,
        });
        
        return new Response(stream, { 
          headers: { 
            "content-type": "text/plain; charset=utf-8",
            "X-Model-Used": CURRENT_MODEL,
            "X-Provider": PROVIDER,
            "X-Is-Free": "true",
            "X-Tool-Used": "getCurrentRates-no-data"
          } 
        });
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  }
  
  // Regular chat without tools
  const stream = await aiRoute.streamChat({
    system: `You are Alexa, a professional, friendly Canadian female mortgage advisor working for Kraft Mortgages. Serve BC/AB/ON and follow provincial compliance. Do not provide legal or tax advice.

IMPORTANT Canadian Mortgage Facts:
- Terms are typically 1, 2, 3, 4, or 5 years (NOT 15-30 years - that's amortization)
- Amortization is usually 25-30 years (the total time to pay off the mortgage)
- Rates depend on: credit score, income verification method (declared vs bank statements), down payment, property type, term length, fixed vs variable
- Income verification methods: T4/NOA (traditional), bank statements (for self-employed), stated income (B-lenders)
- Stress test applies at greater of contract rate + 2% or 5.25%

User preferred province: ${province || "BC"}; language: ${language || "en"}. If not English, keep responses concise and friendly.`,
    prompt: input,
  });
  
  return new Response(stream, { 
    headers: { 
      "content-type": "text/plain; charset=utf-8",
      "X-Model-Used": CURRENT_MODEL,
      "X-Provider": PROVIDER,
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
