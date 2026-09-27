import { NextRequest, NextResponse } from "next/server";

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

## UNDERWRITING & QUALIFICATION GROUND TRUTH:
1. Down Payment Requirements (Federal):
   - 5% on first $500k, 10% on remainder up to $1.5M. 20% minimum for purchases over $1.5M.
2. 30-Year Amortization Rules:
   - High-Ratio Insured (<20% down): 30-year amortization allowed for all First-Time Home Buyers (FTHB) on ANY home, or ANY buyer purchasing newly built construction. Non-FTHB resale max 25 years.
   - Conventional (≥20% down): Standard 30 years across Canada.
3. Provincial Land Transfer Taxes:
   - British Columbia (BC): BC Property Transfer Tax applies (1% on first $200k, 2% up to $2M). Full First-Time Home Buyer exemption up to $835,000.
   - Alberta (AB): ZERO provincial land transfer tax (0%). Only modest Land Titles registration fees apply.
   - Ontario (ON): Ontario Land Transfer Tax applies (plus Toronto Municipal MLTT inside Toronto).
   - NEVER assume the client is in Surrey or BC unless they say so! Always ask which city and province they are looking to buy or refinance in.
4. Client Financial Protection Rule:
   - Proactively advise: "Please HOLD any irreversible financial actions (paying off loans, closing accounts, moving large funds) until our brokerage team has reviewed your full file."
5. Next Steps / Formal Application:
   - Secure Finmo intake portal: https://r.mtg-app.com/varun-chaudhry
   - Direct WhatsApp line: +1 (604) 359-5993
   - Primary Phone: 604-593-1550

## LEAD CAPTURE DIRECTIVE:
When answering questions, naturally ask for their Name, Email, Target City & Province, and Price point so we can send a custom rate sheet or formal pre-approval. Keep responses concise, well-structured with bullet points, and under 800 characters for easy reading on mobile.`;

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
    }),
  });
}

async function requestGemini(
  history: Array<{ role: string; content: string }>,
  currentPrompt: string,
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
            parts: [{ text: SYSTEM_PROMPT }],
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

export async function POST(req: NextRequest) {
  try {
    const { input, messages = [], province, contactInfo } = await req.json();

    if (!input && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const currentInput = input || messages[messages.length - 1]?.content || "";

    // Check for contact details shared in conversation
    const extracted = extractContact(currentInput);
    if (extracted.email || extracted.phone || contactInfo) {
      // Fire-and-forget sync to Twenty CRM
      syncChatLead({
        email: contactInfo?.email || extracted.email,
        phone: contactInfo?.phone || extracted.phone,
        name: contactInfo?.name || undefined,
        province,
        message: currentInput,
      }).catch(console.error);
    }

    // Format conversation history
    const formattedHistory = messages
      .slice(-6)
      .map((m: any) => ({
        role: m.sender === "user" || m.role === "user" ? "user" : "assistant",
        content: m.content || "",
      }));

    const userPrompt = province ? `[User Province: ${province}] ${currentInput}` : currentInput;

    const conversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...formattedHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    let reply: string | null = null;

    // 1. Attempt primary model: deepseek/deepseek-v4.1-flash via OpenRouter if key is present
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
        } else {
          const errText = await response.text();
          console.warn("[Chat API] OpenRouter error:", response.status, errText);
        }
      } catch (err) {
        console.warn("[Chat API] OpenRouter call exception:", err);
      }
    }

    // 2. High-speed, robust fallback A: Google Gemini 2.5 Flash
    if (!reply && GOOGLE_API_KEY) {
      console.log("[Chat API] Engaging Google Gemini 2.5 Flash provider");
      reply = await requestGemini(formattedHistory, userPrompt, GOOGLE_API_KEY);
    }

    // 3. Fallback B: NVIDIA NIM (Meta Llama 3.2 11B Vision)
    if (!reply && NVIDIA_API_KEY) {
      console.log("[Chat API] Engaging NVIDIA NIM provider");
      reply = await requestNvidia(conversation, NVIDIA_API_KEY);
    }

    // 4. Courteous brokerage contact fallback if all AI providers are unavailable
    if (!reply) {
      reply =
        "Thank you for contacting Kraft Mortgages! We are licensed across BC, Alberta, and Ontario. For immediate rate quotes, pre-approvals, and underwriting assistance, chat directly with our team on WhatsApp at +1 (604) 359-5993 or call 604-593-1550.";
      return NextResponse.json({ reply, message: reply, fallback: true });
    }

    return NextResponse.json({ reply, message: reply });
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
