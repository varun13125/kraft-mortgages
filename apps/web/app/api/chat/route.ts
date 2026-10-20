import { NextRequest, NextResponse } from "next/server";
import { benchmarkRateAnswer } from "@/lib/ai/chat/rateAnswers";
import { chatSystemPrompt } from "@/lib/ai/chat/policy";
import {
  resolveLenderFromQuery,
  resolveGeographicUnderwritingQuery,
  generateAuthoritativeUnderwritingAnswer,
  getChannelRentalPolicy,
  getChannelGdsTdsLimits,
  LENDERS,
} from "@/lib/ai/lenderIntelligence";
import { loadCurrentRates } from "@/lib/ratesSource";
import type { RatesApiResponse } from "@/types/rates";
import { rateLimit, tooManyRequests, requireAdmin, redactPII, requireJsonContentType } from "@/lib/ai/request-guards";

export const dynamic = "force-dynamic";
// The whole provider chain (OpenRouter -> Gemini -> NVIDIA -> deterministic fallback) is bounded by
// CHAIN_BUDGET_MS below so it always finishes inside this function limit.
export const maxDuration = 60;

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
const GEMINI_MODEL = "gemini-2.5-flash";

// Time budget (BUG-042). Per-provider timeouts are additionally clamped to what is left of
// CHAIN_BUDGET_MS, so the worst case (every provider hanging) still answers before maxDuration.
const CHAIN_BUDGET_MS = 50_000;
const OPENROUTER_TIMEOUT_MS = 20_000;
const OPENROUTER_FALLBACK_TIMEOUT_MS = 15_000;
const GEMINI_TIMEOUT_MS = 15_000;
const NVIDIA_TIMEOUT_MS = 15_000;
const MIN_PROVIDER_BUDGET_MS = 4_000; // not worth starting a provider call with less than this left

// Output budgets. deepseek-v4.1-flash reasons by default ("high" effort) and on OpenRouter reasoning
// tokens count toward max_tokens, so the primary call caps reasoning at "low" effort (~20% of
// max_tokens) and keeps ~2,400 tokens for the visible answer. The other models do not reason here.
const PRIMARY_MAX_TOKENS = 3000;
const PRIMARY_REASONING = { effort: "low", exclude: true } as const;
const FALLBACK_MAX_TOKENS = 1500;
const GEMINI_MAX_OUTPUT_TOKENS = 2048;
const NVIDIA_MAX_TOKENS = 1200;
// Request limits (public, unauthenticated endpoint that spends LLM credits)
const MAX_INPUT_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_CHARS = 4000;
const ALLOWED_PROVINCES = new Set(["BC", "AB", "ON"]);

const BROKERAGE_FALLBACK_REPLY =
  "Thank you for contacting Kraft Mortgages! We are licensed across BC, Alberta, and Ontario. For follow-up, leave a message for Varun on WhatsApp at +1 (604) 359-5993 or through our contact page.";

// In-memory rotating training and underwriting interaction log buffer (per server instance).
interface UnderwritingChatLog {
  id: string;
  timestamp: string;
  query: string; // PII-redacted
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
  // Unterminated reasoning block (e.g. output truncated mid-thought): drop everything after the opener.
  cleaned = cleaned.replace(/<(think|thought|reasoning)>[\s\S]*$/i, "");
  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Benchmark rates: pulled from the same rate feed as /api/rates (cached 5 min),
// instead of numbers hard-coded into the prompt and labelled "live".
// ---------------------------------------------------------------------------
const STATIC_RATES_SECTION = "Rate feed unavailable. Do not quote numeric rates or imply current pricing; direct visitors to /rates or /contact.";

const loadRates = loadCurrentRates;

function buildRatesSection(r: RatesApiResponse | null): string {
  if (!r?.benchmarks || !r.success || !Number.isFinite(Date.parse(r.last_synced_utc)) || Date.now() - Date.parse(r.last_synced_utc) > 7 * 864e5 || Date.parse(r.last_synced_utc) > Date.now() + 864e5) return STATIC_RATES_SECTION;
  try {
    const b = r.benchmarks;
    const fmt = (n?: number) => (typeof n === "number" && Number.isFinite(n) ? `${n.toFixed(2)}%` : "n/a");
    const synced = r.last_synced_utc ? new Date(r.last_synced_utc) : null;
    const asOf = synced && !Number.isNaN(synced.getTime()) ? synced.toISOString().slice(0, 10) : "recent";
    const altBfs = b.alt_bfs?.lowest_rate;
    return `## REFERENCE BENCHMARK RATES (Kraft Mortgages rate feed, as of ${asOf}):
- Lender prime benchmark: ${fmt(r.prime_rate)}
- 5-Year Fixed: from ${fmt(b.fixed_5yr?.insured?.lowest_rate)} (insured, <20% down); from ${fmt(b.fixed_5yr?.insurable?.lowest_rate)} (insurable); from ${fmt(b.fixed_5yr?.conventional?.lowest_rate)} (conventional)
- 3-Year Fixed: from ${fmt(b.fixed_3yr?.lowest)}
- 5-Year Variable: from ${fmt(b.variable_5yr?.lowest)}${b.variable_5yr?.insured?.lowest_spread ? ` (${b.variable_5yr.insured.lowest_spread})` : ""}
- HELOC / 1st Position Line of Credit: from ${fmt(b.heloc?.lowest_rate)}
- Alternative B-Lenders (Self-Employed BFS): ${altBfs ? `from ${fmt(altBfs)}` : "unavailable; do not quote"}
- Private 2nd Mortgages: from ${fmt(b.private_second?.lowest_rate)} (interest-only, equity-based)
These are "from" benchmarks for well-qualified borrowers, on approved credit (O.A.C.). They change frequently - present them as indicative, never as a quote or guarantee.`;
  } catch {
    return STATIC_RATES_SECTION;
  }
}

const buildSystemPrompt = chatSystemPrompt;


type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

interface ProviderResult {
  text: string | null;
  /** HTTP status (0 when the request never completed). */
  status: number;
  timedOut: boolean;
}

function isTimeoutError(err: unknown): boolean {
  const name = (err as { name?: string } | null)?.name;
  return name === "TimeoutError" || name === "AbortError";
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function requestOpenRouter(
  messages: ChatTurn[],
  model: string,
  apiKey: string,
  opts: { maxTokens: number; timeoutMs: number; reasoning?: Record<string, unknown> }
): Promise<ProviderResult> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
        max_tokens: opts.maxTokens,
        ...(opts.reasoning ? { reasoning: opts.reasoning } : {}),
      }),
      // Covers the whole exchange, including reading the response body.
      signal: AbortSignal.timeout(opts.timeoutMs),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[Chat API] OpenRouter ${model} error:`, res.status, errText.slice(0, 500));
      return { text: null, status: res.status, timedOut: false };
    }
    const data = await res.json();
    const choice = data?.choices?.[0];
    const content = typeof choice?.message?.content === "string" ? choice.message.content : "";
    if (choice?.finish_reason === "length") {
      // Reasoning + answer hit max_tokens. An empty answer is treated as a failure so the chain moves on.
      console.warn(`[Chat API] OpenRouter ${model} stopped at max_tokens (${opts.maxTokens}); answer length ${content.length}`);
    }
    return { text: content.trim() ? content : null, status: res.status, timedOut: false };
  } catch (err) {
    const timedOut = isTimeoutError(err);
    console.warn(`[Chat API] OpenRouter ${model} ${timedOut ? `timed out after ${opts.timeoutMs}ms` : "exception"}:`, errMessage(err));
    return { text: null, status: 0, timedOut };
  }
}

async function requestGemini(
  history: Array<{ role: string; content: string }>,
  currentPrompt: string,
  systemPrompt: string,
  apiKey: string,
  timeoutMs: number
): Promise<string | null> {
  try {
    const turns = history
      .filter((m) => m.content && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
    // Gemini multi-turn requests must start with a user turn (the widget's welcome message is a model turn).
    while (turns.length && turns[0].role !== "user") turns.shift();

    const contents = [
      ...turns,
      {
        role: "user",
        parts: [{ text: currentPrompt }],
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        // Key in a header, not in the URL (URLs end up in proxy/CDN logs and traces).
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
            // gemini-2.5-flash thinks by default and thinking tokens count toward maxOutputTokens
            // (the old 800-token cap could leave no room for the answer). This is a fast fallback.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
        signal: AbortSignal.timeout(timeoutMs),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[Chat API] Gemini error:", res.status, errText.slice(0, 500));
      return null;
    }

    const data = await res.json();
    const parts: Array<{ text?: unknown; thought?: unknown }> = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
      .filter((p) => typeof p.text === "string" && !p.thought)
      .map((p) => p.text as string)
      .join("");
    return text.trim() ? text : null;
  } catch (err) {
    console.error(`[Chat API] Gemini ${isTimeoutError(err) ? `timed out after ${timeoutMs}ms` : "fetch exception"}:`, errMessage(err));
    return null;
  }
}

async function requestNvidia(
  messages: ChatTurn[],
  apiKey: string,
  timeoutMs: number
): Promise<string | null> {
  try {
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
        max_tokens: NVIDIA_MAX_TOKENS,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[Chat API] NVIDIA error:", res.status, errText.slice(0, 500));
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content : null;
  } catch (err) {
    console.warn(`[Chat API] NVIDIA ${isTimeoutError(err) ? `timed out after ${timeoutMs}ms` : "fetch exception"}:`, errMessage(err));
    return null;
  }
}

/**
 * GET Handler: Training Log Inspector for Internal Admin Auditing
 * Usage: GET /api/chat  with  Authorization: Bearer <Firebase ID token of an admin>
 * (The old `?admin=true` query flag granted access to anyone and is no longer sufficient.)
 */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const rates = await loadRates();
  return NextResponse.json({
    status: "ok",
    totalLogged: trainingLogsBuffer.length,
    totalInstitutionalLenders: LENDERS.length,
    activeBenchmarking: rates
      ? {
          source: rates.source,
          lastSyncedUtc: rates.last_synced_utc,
          primeRate: rates.prime_rate,
          fiveYearFixedInsured: rates.benchmarks?.fixed_5yr?.insured?.lowest_rate,
        }
      : null,
    logs: [...trainingLogsBuffer].reverse(),
  });
}

/**
 * POST Handler: Real-time Mortgage Underwriting & Advisory Chat
 */
export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  // Only JSON bodies. Browsers can send text/plain cross-site without a CORS preflight, and
  // req.json() would happily parse it, so a third-party page could spend LLM credits (BUG-042).
  const notJson = requireJsonContentType(req, { reply: "Sorry, that request format isn't supported." });
  if (notJson) return notJson;

  // Best-effort abuse protection for a public endpoint that spends LLM credits.
  const perMinute = rateLimit(req, "chat-min", 20, 60_000);
  if (!perMinute.ok) {
    return tooManyRequests(perMinute.retryAfterSec, {
      reply: "You're sending messages very quickly. Please wait a moment, or reach our team on WhatsApp at +1 (604) 359-5993.",
    });
  }
  const perHour = rateLimit(req, "chat-hour", 150, 60 * 60_000);
  if (!perHour.ok) {
    return tooManyRequests(perHour.retryAfterSec, {
      reply: "You've reached the chat limit for now. Please call 604-593-1550 or WhatsApp +1 (604) 359-5993 and our team will help directly.",
    });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const input = typeof body?.input === "string" ? body.input.trim() : "";
    const rawMessages: any[] = Array.isArray(body?.messages) ? body.messages : [];
    const provinceRaw = typeof body?.province === "string" ? body.province.trim().toUpperCase() : "";
    const province = ALLOWED_PROVINCES.has(provinceRaw) ? provinceRaw : undefined;

    const lastMessageContent =
      typeof rawMessages[rawMessages.length - 1]?.content === "string"
        ? rawMessages[rawMessages.length - 1].content.trim()
        : "";
    const currentInput = input || lastMessageContent;

    if (!currentInput) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }
    if (currentInput.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        {
          error: "Message too long",
          reply: `Your message is too long for the chat (max ${MAX_INPUT_CHARS} characters). Please shorten it, or send the details to our team on WhatsApp at +1 (604) 359-5993.`,
        },
        { status: 413 }
      );
    }

    // Team follow-up uses the explicit consent form at /contact; ordinary chat is not a lead submission.

    // 2. Lender resolution across the Canadian lender database
    const matchedLender = resolveLenderFromQuery(currentInput);
    const geographicAnswer = resolveGeographicUnderwritingQuery(currentInput);

    const rates = await loadRates();
    const benchmarkReply = benchmarkRateAnswer(currentInput, rates, province, LENDERS);
    if (benchmarkReply) {
      return NextResponse.json({ reply: benchmarkReply, message: benchmarkReply, modelUsed: "dated-rate-benchmark" });
    }
    let enrichedSystemPrompt = buildSystemPrompt(buildRatesSection(rates));
    let fallbackUnderwritingDossier: string | null = null;

    if (matchedLender) {
      fallbackUnderwritingDossier = generateAuthoritativeUnderwritingAnswer(matchedLender, currentInput);
      const rental = getChannelRentalPolicy(matchedLender.channel, matchedLender.name);
      const ratios = getChannelGdsTdsLimits(matchedLender.channel, matchedLender.name);
      enrichedSystemPrompt += `\n\n## UNDERWRITING DOSSIER FOR ${matchedLender.name.toUpperCase()} (from the Kraft Mortgages lender database):
${fallbackUnderwritingDossier}

INSTRUCTIONS FOR THIS QUERY:
The user is asking about ${matchedLender.name} (${matchedLender.channel}). Ground your answer in the dossier above:
1. Rental Income Calculation: subject owner-occupied treatment is "${rental.subjectOwnerOccupied.replace(/\*\*/g, "")}"; non-subject portfolio worksheet is ${rental.formulaWorksheet}.
2. Maximum GDS/TDS: ${ratios.standardGds} GDS / ${ratios.standardTds} TDS. Stress test: ${ratios.stressTestRule}
3. Provincial Jurisdiction: ${matchedLender.provinces?.join(", ") || "see dossier"}.
4. State ${matchedLender.name}'s guidelines directly. Do not invent guidelines that are not in the dossier; if it does not cover the question, say so and offer the Kraft Mortgages team. Remind the user that lender policies and pricing change and are confirmed at application.`;
    } else if (geographicAnswer) {
      enrichedSystemPrompt += `\n\n## PROVINCIAL LENDING RESOLUTION (from the Kraft Mortgages lender database):
${geographicAnswer}
Answer the geographic jurisdiction question accurately based on the institutional data above.`;
    }

    // 3. Format conversation history (bounded; only user/assistant roles are ever forwarded)
    const historySource = input ? rawMessages : rawMessages.slice(0, -1);
    const formattedHistory: ChatTurn[] = historySource
      .slice(-MAX_HISTORY_MESSAGES)
      .filter((m: any) => m && typeof m.content === "string" && m.content.trim())
      .map((m: any): ChatTurn => ({
        role: m.sender === "user" || m.role === "user" ? "user" : "assistant",
        content: m.content.slice(0, MAX_HISTORY_MESSAGE_CHARS),
      }));

    const userPrompt = province ? `[User Province: ${province}] ${currentInput}` : currentInput;

    const conversation: ChatTurn[] = [
      { role: "system", content: enrichedSystemPrompt },
      ...formattedHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    let reply: string | null = null;
    let modelUsed = "none";

    // Each provider gets min(its own timeout, what is left of the chain budget).
    const deadline = startedAt + CHAIN_BUDGET_MS;
    const budget = (providerTimeoutMs: number) => Math.min(providerTimeoutMs, deadline - Date.now());

    // 4. Attempt primary model via OpenRouter
    if (OPENROUTER_API_KEY && budget(OPENROUTER_TIMEOUT_MS) >= MIN_PROVIDER_BUDGET_MS) {
      const primary = await requestOpenRouter(conversation, MODEL, OPENROUTER_API_KEY, {
        maxTokens: PRIMARY_MAX_TOKENS,
        reasoning: PRIMARY_REASONING,
        timeoutMs: budget(OPENROUTER_TIMEOUT_MS),
      });
      if (primary.text) {
        reply = primary.text;
        modelUsed = "openrouter-deepseek-v4.1-flash";
      } else if (!primary.timedOut && budget(OPENROUTER_FALLBACK_TIMEOUT_MS) >= MIN_PROVIDER_BUDGET_MS) {
        // A fast failure (HTTP error / empty answer) is worth one retry on the older model.
        // After a timeout OpenRouter is likely degraded, so go straight to the next provider.
        console.warn(`[Chat API] Primary OpenRouter model ${MODEL} failed (status ${primary.status}). Attempting ${FALLBACK_MODEL}...`);
        const fallback = await requestOpenRouter(conversation, FALLBACK_MODEL, OPENROUTER_API_KEY, {
          maxTokens: FALLBACK_MAX_TOKENS,
          timeoutMs: budget(OPENROUTER_FALLBACK_TIMEOUT_MS),
        });
        if (fallback.text) {
          reply = fallback.text;
          modelUsed = "openrouter-deepseek-chat";
        }
      }
    }

    // 5. Fallback A: Google Gemini 2.5 Flash
    if (!reply && GOOGLE_API_KEY && budget(GEMINI_TIMEOUT_MS) >= MIN_PROVIDER_BUDGET_MS) {
      console.log("[Chat API] Engaging Google Gemini provider");
      reply = await requestGemini(formattedHistory, userPrompt, enrichedSystemPrompt, GOOGLE_API_KEY, budget(GEMINI_TIMEOUT_MS));
      if (reply) modelUsed = GEMINI_MODEL;
    }

    // 6. Fallback B: NVIDIA NIM (Meta Llama 3.2 11B Vision)
    if (!reply && NVIDIA_API_KEY && budget(NVIDIA_TIMEOUT_MS) >= MIN_PROVIDER_BUDGET_MS) {
      console.log("[Chat API] Engaging NVIDIA NIM provider");
      reply = await requestNvidia(conversation, NVIDIA_API_KEY, budget(NVIDIA_TIMEOUT_MS));
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
      reply = BROKERAGE_FALLBACK_REPLY;
      modelUsed = "brokerage-fallback";
    }

    // 9. Strip any <think> tokens or internal reasoning
    const rawLength = reply.length;
    reply = stripThinkingAndReasoning(reply);
    const thinkingStripped = rawLength !== reply.length;
    if (!reply) {
      reply = fallbackUnderwritingDossier || geographicAnswer || BROKERAGE_FALLBACK_REPLY;
      modelUsed = `${modelUsed}+empty-after-strip`;
    }

    // 10. Audit Logging for Training & Underwriting Monitoring (PII redacted)
    logChatInteraction({
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      query: redactPII(currentInput).slice(0, 500),
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
    console.error("[Chat API] Server error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        reply:
          "Thank you for reaching out to Kraft Mortgages! Please connect with us directly on WhatsApp at +1 (604) 359-5993 or call our office at 604-593-1550.",
      },
      { status: 200 }
    );
  }
}
