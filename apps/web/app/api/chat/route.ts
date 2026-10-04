import { NextRequest, NextResponse } from "next/server";
import {
  resolveLenderFromQuery,
  resolveGeographicUnderwritingQuery,
  generateLenderUnderwritingDossier,
  getChannelRentalPolicy,
  getChannelGdsTdsLimits,
} from "@/lib/ai/lenderIntelligence";
import { CANADIAN_LENDERS } from "@/data/canadianLendersData";

export const dynamic = "force-dynamic";

const OPENROUTER_API_KEY = (
  process.env.OPENROUTER_API_KEY ||
  process.env.OPEN_ROUTER_API_KEY ||
  ""
).trim();
const GOOGLE_API_KEY = (process.env.GOOGLE_API_KEY || "").trim();
const NVIDIA_API_KEY = (process.env.NVIDIA_API_KEY || "").trim();
const MODEL = "deepseek/deepseek-v4.1-flash";
const FALLBACK_MODEL = "deepseek/deepseek-chat";
const NVIDIA_MODEL = "meta/llama-3.2-11b-vision-instruct";
const TWENTY_WEBHOOK_URL =
  process.env.TWENTY_WEBHOOK_URL ||
  "https://webhook.srv848694.hstgr.cloud/webhook/contact-form";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_LEAD_WEBHOOK_URL || "";

// In-memory rotating training and underwriting interaction log buffer
interface UnderwritingChatLog {
  id: string;
  timestamp: string;
  query: string;
  province?: string;
  matchedLender?: string;
  modelUsed: string;
  replyLength: number;
  thinkingStripped: boolean;
}
const trainingLogsBuffer: UnderwritingChatLog[] = [];
const MAX_LOGS = 100;

function logChatInteraction(log: UnderwritingChatLog) {
  trainingLogsBuffer.push(log);
  if (trainingLogsBuffer.length > MAX_LOGS) {
    trainingLogsBuffer.shift();
  }
}

/**
 * Strips all internal reasoning tokens, <think> tags, and scratchpad traces
 * to ensure clients receive only pure, polished answers.
 */
function stripThinkingAndReasoning(text: string): string {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "");
  cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "");
  cleaned = cleaned.replace(/^[\s\S]*?<\/think>/i, "");
  cleaned = cleaned.replace(/\[THINK\][\s\S]*?\[\/THINK\]/gi, "");
  return cleaned.trim();
}

const SYSTEM_PROMPT = `You are the Senior Mortgage Associate at Kraft Mortgages Canada Inc., a licensed Canadian mortgage brokerage serving British Columbia (BCFSA #SR220230 / Brokerage #12918), Alberta (RECA #LIC-00655428), and Ontario (FSRA #12918). Principal Broker: Varun Chaudhry.
Your role is to consult with website visitors with deep mortgage underwriting knowledge, consultative warmth, and precision across BC, Alberta, and Ontario.

## VERIFIED LIVE BENCHMARK RATES:
- Bank of Canada Prime Rate: 4.45%
- 5-Year Fixed: From 4.44% - 4.49% (High-Ratio Insured <20% down); 4.64% - 4.79% (Conventional insurable)
- 3-Year Fixed: Promo from 4.14% - 4.34%
- 5-Year Variable: Prime - 1.00% (currently ~3.45%)
- HELOC / 1st Position Line of Credit: Prime + 0.50% (4.95%)
- Alternative B-Lenders (Self-Employed BFS): 5.99% - 6.74%
- Private 2nd Mortgages: 7.99% - 10.99% (interest-only, equity-based)

## CANADIAN RENTAL INCOME UNDERWRITING GROUND TRUTH:
In Canadian mortgage underwriting, there is a strict institutional distinction between subject property rental income and non-subject portfolio rental income:

1. SUBJECT PROPERTY RENTAL INCOME (Owner-Occupied Secondary Suite / 2–4 Units):
   - Standard Institutional Practice (Monolines, Big-6 Banks, Schedule II Banks like CTBC): 50% Rental Add-Back to borrower's gross qualifying income.
   - PITH Treatment: Subject property PITH (Principal, Interest, Taxes, Heating) remains 100% carried as a liability in GDS/TDS calculations (NO subject PITH offset).
   - Insured Mortgages (>80% LTV CMHC/Sagen/Canada Guaranty): Strictly enforce the 50% rental add-back. Subject PITH offset is prohibited under insurer rules.
   - Requirement: Signed residential tenancy agreement or appraisal Market Rent Schedule (Form 214 / Schedule A).

2. NON-SUBJECT RENTAL PROPERTIES (Existing Rental Portfolio / Other Properties Owned):
   - Prime Monolines & Big-6 Banks: 50% Rental Property Worksheet (Surplus / Deficit Approach):
     Formula: (Gross Rent × 50%) - Existing Property PITH = Net Surplus or Deficit.
     Net Surplus is added to gross qualifying income; Net Deficit is added directly to monthly TDS liabilities.
   - Alternative B Lenders (Home Trust, Equitable Bank, Haventree, Community Trust):
     Provide an 80% Rental Offset Worksheet:
     Formula: (Gross Rent × 80%) - Existing Property PITH = Net Surplus or Deficit.
     Alternatively, qualify on Debt Coverage Ratio (DCR / DSCR) basis (1.00x–1.10x), protecting real estate investors from hitting personal TDS ceiling caps.

## MAXIMUM DEBT SERVICE RATIOS (GDS / TDS):
- Prime / Monolines / Schedule II Banks (CTBC, Shinhan, etc.): Standard OSFI B-20 max is 39% GDS / 44% TDS. Exceptional files with 720+ beacon scores and strong liquid reserves may reach 40% GDS / 45%–48% TDS.
- Alternative B (Home Trust, Equitable, etc.): Up to 50% GDS / 50% TDS under BFS Stated Income programs.
- Private / MIC: OSFI B-20 exempt (underwritten on equity, LTV, and exit strategy, no standard personal ratio constraints).

## PROVINCIAL LENDING & JURISDICTION RULES:
- Credit Unions are provincially regulated: Vancity, Coast Capital, Envision lend only in BC; Meridian, DUCA lend only in ON; Servus lends in AB.
- Schedule II Banks (e.g. CTBC Bank Canada) operate urban branch footprints primarily in British Columbia (Vancouver, Richmond, Burnaby) and Ontario (Toronto, Markham).
- High-Ratio Insured (<20% down): 30-year amortization allowed for all First-Time Home Buyers (FTHB) on ANY home, or ANY buyer purchasing newly built construction. Non-FTHB resale max 25 years.
- Conventional (≥20% down): Standard 30 years across Canada.

## BROKERAGE DIRECTIVES:
- Maintain documentation integrity. Do not output internal thinking or reasoning tags.
- Client Financial Protection: Proactively advise: "Please HOLD any irreversible financial actions (paying off loans, closing accounts, moving large funds) until our brokerage team has reviewed your full file."
- Application intake: https://r.mtg-app.com/varun-chaudhry
- Direct WhatsApp line: +1 (604) 359-5993 | Primary Phone: 604-593-1550`;

// Extract email and phone from user text
function extractContact(text: string) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
  };
}

// Background sync to Twenty CRM
async function syncChatLead(data: {
  email?: string | null;
  phone?: string | null;
  name?: string;
  province?: string;
  message: string;
}) {
  if (!data.email && !data.phone) return;

  try {
    // 1. Post to Twenty CRM webhook
    await fetch(TWENTY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email || "",
        phone: data.phone || "",
        firstName: data.name || "Chatbot Lead",
        lastName: "",
        mortgageType: "Website Chatbot Inquiry",
        message: `Province: ${data.province || "Unspecified"} | Initial Chat: ${data.message}`,
        source: "website-ai-chat",
      }),
    });

    // 2. Post to Discord lead alerts
    if (DISCORD_WEBHOOK_URL) {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "💬 New Lead Captured from Website Chatbot",
              color: 0x10b981,
              fields: [
                { name: "Email", value: data.email || "—", inline: true },
                { name: "Phone", value: data.phone || "—", inline: true },
                { name: "Province", value: data.province || "—", inline: true },
                { name: "Latest Message", value: data.message.slice(0, 300) },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    }
  } catch (err) {
    console.error("[Chat API] Failed to sync lead to CRM:", err);
  }
}

async function requestOpenRouter(messages: any[], model: string, apiKey: string) {
  return await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.kraftmortgages.ca",
      "X-Title": "Kraft Mortgages Web Chatbot",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      include_reasoning: false,
    }),
  });
}

async function requestGemini(
  history: Array<{ role: string; content: string }>,
  currentPrompt: string,
  systemPrompt: string,
  apiKey: string
): Promise<string | null> {
  try {
    const contents = [
      ...history
        .filter((m) => m.content && (m.role === "user" || m.role === "assistant"))
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      {
        role: "user",
        parts: [{ text: currentPrompt }],
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Chat API] Gemini error:", res.status, errText);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("[Chat API] Gemini fetch exception:", err);
    return null;
  }
}

async function requestNvidia(
  messages: any[],
  apiKey: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.warn("[Chat API] NVIDIA error:", res.status, errText);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("[Chat API] NVIDIA fetch exception:", err);
    return null;
  }
}

/**
 * GET Handler: Training Log Inspector for Internal Admin Auditing
 * Usage: GET /api/chat?admin=true
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin training monitoring access required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: "ok",
    totalLogged: trainingLogsBuffer.length,
    totalInstitutionalLenders: CANADIAN_LENDERS.length,
    activeBenchmarking: {
      primeRate: "4.45%",
      fiveYearFixedInsured: "4.44% - 4.49%",
      stressTestFloor: "5.25%",
    },
    logs: [...trainingLogsBuffer].reverse(),
  });
}

/**
 * POST Handler: Real-time Mortgage Underwriting & Advisory Chat
 */
export async function POST(req: NextRequest) {
  try {
    const { input, messages = [], province, contactInfo } = await req.json();

    if (!input && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const currentInput = input || messages[messages.length - 1]?.content || "";

    // 1. Check for contact details shared in conversation & sync to CRM
    const extracted = extractContact(currentInput);
    if (extracted.email || extracted.phone || contactInfo) {
      syncChatLead({
        email: contactInfo?.email || extracted.email,
        phone: contactInfo?.phone || extracted.phone,
        name: contactInfo?.name || undefined,
        province,
        message: currentInput,
      }).catch(console.error);
    }

    // 2. Intelligent Institutional Lender Resolution across 125 Canadian Lenders
    const matchedLender = resolveLenderFromQuery(currentInput);
    const geographicAnswer = resolveGeographicUnderwritingQuery(currentInput);

    let enrichedSystemPrompt = SYSTEM_PROMPT;
    let fallbackUnderwritingDossier: string | null = null;

    if (matchedLender) {
      fallbackUnderwritingDossier = generateLenderUnderwritingDossier(matchedLender, currentInput);
      enrichedSystemPrompt += `\n\n## VERIFIED UNDERWRITING DOSSIER FOR ${matchedLender.name.toUpperCase()}:
${fallbackUnderwritingDossier}

MANDATORY INSTRUCTIONS FOR THIS QUERY:
The user is specifically inquiring about ${matchedLender.name}. You MUST ground your answer completely in this verified dossier:
1. Rental Income Calculation: State their exact treatment. For subject owner-occupied: 50% Rental Add-Back (PITH in liabilities). For non-subject portfolio: ${matchedLender.channel === 'Alternative (B)' ? '80% Offset Worksheet ((Gross Rent × 80%) - PITH) or DSCR 1.00x–1.10x' : '50% Worksheet ((Gross Rent × 50%) - PITH)'}.
2. Maximum GDS/TDS: State their exact ratio caps (${matchedLender.channel === 'Alternative (B)' ? 'Up to 50% GDS / 50% TDS under Alt-B BFS Stated Income' : 'Standard 39% GDS / 44% TDS under OSFI B-20'}).
3. Provincial Jurisdiction: State their exact operating provinces (${matchedLender.provinces?.join(', ')}).
4. Do NOT provide generic answers. State ${matchedLender.name}'s exact guidelines directly.`;
    } else if (geographicAnswer) {
      enrichedSystemPrompt += `\n\n## VERIFIED PROVINCIAL LENDING RESOLUTION:
${geographicAnswer}
MANDATORY: Answer the geographic jurisdiction question accurately based on the verified institutional data above.`;
    }

    // 3. Format conversation history
    const formattedHistory = messages
      .slice(-6)
      .map((m: any) => ({
        role: m.sender === "user" || m.role === "user" ? "user" : "assistant",
        content: m.content || "",
      }));

    const userPrompt = province ? `[User Province: ${province}] ${currentInput}` : currentInput;

    const conversation = [
      { role: "system", content: enrichedSystemPrompt },
      ...formattedHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    let reply: string | null = null;
    let modelUsed = "none";

    // 4. Attempt primary model: deepseek/deepseek-v4.1-flash via OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        let response = await requestOpenRouter(conversation, MODEL, OPENROUTER_API_KEY);
        if (!response.ok) {
          console.warn(`[Chat API] Primary OpenRouter model ${MODEL} failed with ${response.status}. Attempting fallback...`);
          response = await requestOpenRouter(conversation, FALLBACK_MODEL, OPENROUTER_API_KEY);
        }
        if (response.ok) {
          const data = await response.json();
          reply = data.choices?.[0]?.message?.content || null;
          modelUsed = "openrouter-deepseek";
        } else {
          const errText = await response.text();
          console.warn("[Chat API] OpenRouter error:", response.status, errText);
        }
      } catch (err) {
        console.warn("[Chat API] OpenRouter call exception:", err);
      }
    }

    // 5. High-speed Fallback A: Google Gemini 2.5 Flash
    if (!reply && GOOGLE_API_KEY) {
      console.log("[Chat API] Engaging Google Gemini 2.5 Flash provider");
      reply = await requestGemini(formattedHistory, userPrompt, enrichedSystemPrompt, GOOGLE_API_KEY);
      if (reply) modelUsed = "gemini-2.5-flash";
    }

    // 6. Fallback B: NVIDIA NIM (Meta Llama 3.2 11B Vision)
    if (!reply && NVIDIA_API_KEY) {
      console.log("[Chat API] Engaging NVIDIA NIM provider");
      reply = await requestNvidia(conversation, NVIDIA_API_KEY);
      if (reply) modelUsed = "nvidia-llama-3.2";
    }

    // 7. Deterministic Underwriting Fallback if LLM APIs are offline
    if (!reply && fallbackUnderwritingDossier) {
      reply = fallbackUnderwritingDossier;
      modelUsed = "lender-intelligence-engine";
    } else if (!reply && geographicAnswer) {
      reply = geographicAnswer;
      modelUsed = "geographic-intelligence-engine";
    }

    // 8. General Brokerage Contact Fallback
    if (!reply) {
      reply =
        "Thank you for contacting Kraft Mortgages! We are licensed across BC, Alberta, and Ontario. For immediate rate quotes, pre-approvals, and underwriting assistance, chat directly with our team on WhatsApp at +1 (604) 359-5993 or call 604-593-1550.";
      modelUsed = "brokerage-fallback";
    }

    // 9. Thoroughly strip any <think> tokens or internal reasoning
    const rawLength = reply.length;
    reply = stripThinkingAndReasoning(reply);
    const thinkingStripped = rawLength !== reply.length;

    // 10. Audit Logging for Training & Underwriting Monitoring
    logChatInteraction({
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      query: currentInput,
      province,
      matchedLender: matchedLender?.name,
      modelUsed,
      replyLength: reply.length,
      thinkingStripped,
    });

    return NextResponse.json({
      reply,
      message: reply,
      matchedLender: matchedLender ? {
        name: matchedLender.name,
        channel: matchedLender.channel,
        provinces: matchedLender.provinces,
        lowestRate: matchedLender.lowestRate,
      } : undefined,
    });
  } catch (error: any) {
    console.error("[Chat API] Server error:", error);
    return NextResponse.json(
      {
        reply:
          "Thank you for reaching out to Kraft Mortgages! Please connect with us directly on WhatsApp at +1 (604) 359-5993 or call our office at 604-593-1550.",
        error: error.message,
      },
      { status: 200 }
    );
  }
}
