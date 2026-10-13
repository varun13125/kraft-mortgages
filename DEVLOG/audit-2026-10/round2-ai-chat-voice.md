# Round 2: AI chat, lender intelligence, voice (ai-voice area)

Date: 2026-10-13/14 · Agent: Claude Code (Opus 5.5), ai-voice area · Branch `audit/2026-10-fixes` · **uncommitted**
Paths are relative to `apps/web/`. Line numbers refer to the files after these changes.
`data/*` was only read, never modified. FINDINGS/STATUS/SESSIONS were **not** edited, to avoid clashing with the
4 parallel agents. The orchestrator should apply the status changes suggested at the end.

Verification for the whole round:
- `./node_modules/.bin/tsc --noEmit --incremental false -p .` → **0 errors** (full project, run twice, last run after all edits).
- `next lint --file …` over all 17 touched files → **0 errors, 0 warnings**. The `EmbeddedVoiceAgent` BUG-052 warning is gone.
- Throwaway Node harnesses in the session scratchpad (`scratchpad/rt/*.js`, `scratchpad/lt/*.js`). They use a TS require
  hook with the `@/` alias and mocked `fetch`; no live provider calls were made. Results are quoted per task below.

---

## Task 1 · BUG-042 · `/api/chat` timeouts, max_tokens, Gemini key header, JSON-only

Files: `app/api/chat/route.ts:14-47, 205, 289-450, 482-487, 600-655`; `lib/ai/request-guards.ts:73-84` (new `requireJsonContentType`).

**Changes**
- `export const maxDuration = 60` (:17). The provider chain runs under a deadline: `CHAIN_BUDGET_MS = 50_000` (:33).
  Each call gets `min(own timeout, time left)` and is skipped if under 4 s remain (:605-655).
- Per-provider `AbortSignal.timeout`:

  | Provider | Timeout |
  | --- | --- |
  | OpenRouter primary | 20 s |
  | OpenRouter fallback model | 15 s |
  | Gemini | 15 s |
  | NVIDIA | 15 s (was 8 s via `setTimeout`) |
  | Rate feed (existing) | 2.5 s |

  The timeout also covers reading the response body.
- After a primary **timeout**, the chain skips the second OpenRouter model and moves straight to Gemini. A fast HTTP error or an
  empty answer still retries on `deepseek/deepseek-chat`.
- **max_tokens.** I checked OpenRouter's live `/api/v1/models` entry for `deepseek/deepseek-v4.1-flash` on 2026-10-13:
  `reasoning.default_enabled: true`, `default_effort: "high"`, supported efforts `max/high/low`, `mandatory: false`.
  OpenRouter's reasoning docs say reasoning tokens count toward `max_tokens` and an exhausted budget returns
  `finish_reason:"length"` with empty content. The old `include_reasoning:false` only hides reasoning; the model still thinks at high effort.
  The new settings:
  - Primary sends `max_tokens: 3000` + `reasoning: {effort:"low", exclude:true}`. Low effort is about 20% of the budget, which leaves about 2,400 tokens for the answer.
  - `deepseek-chat` (no reasoning): 1500.
  - Gemini: `maxOutputTokens: 2048` with `thinkingConfig.thinkingBudget: 0`. The old 800 cap was shared with 2.5-Flash thinking tokens, so answers could come back empty.
  - NVIDIA: 1200 (was 800).

  An empty answer or `finish_reason:"length"` is logged and treated as a failure (:332-337).
- Gemini key moved from `?key=` to the `x-goog-api-key` header (:380). Gemini now joins all non-`thought` text parts.
- `Content-Type` must start with `application/json`, otherwise **415** with a friendly `reply` (:486). No Origin check (as instructed).
  The same guard was added to the other paid-credit public POSTs: `/api/voice/generate` (ElevenLabs; also a 30 s upstream timeout), `/api/voice/minimax`, `/api/chat/v2`.
  All in-repo callers already send JSON: `ChatWidget`, `CleanVoiceControls`, `multilingual-voice`, `simple-voice-system`, `voice-conversation`, and the new `ChatAlex`.
- System prompt gains one "Answer style" line (:205): keep chat replies concise (about 300 words) unless the visitor asks for detail. This keeps generations inside the timeouts and suits the small widget.
- `matchedLender` count in the admin GET uses the corrected `LENDERS` (see task 7).

**Verified** with `rt/chat_test.js`. The harness scales `AbortSignal.timeout` and `Date.now` by 1/100.
1. A `text/plain` body returns 415 with 0 provider calls.
2. When the primary hangs, there is exactly **1** OpenRouter call (`max_tokens 3000`, `reasoning {"effort":"low","exclude":true}`, no `include_reasoning`), then Gemini answers. The Gemini URL has no `key=` and the `x-goog-api-key` header is set. Timeouts requested: 2500, 20000, 15000.
3. When the primary returns 502, the chain falls back to `deepseek-chat` with `max_tokens 1500`.
4. When the primary returns empty content with `finish_reason:length`, the fallback answers.
5. When every provider hangs, the run takes about 52 s simulated, with timeouts of 20000, 15000, 11100 (the last clamped by the budget). It returns the deterministic dossier, so it stays inside `maxDuration` 60.

## Task 2 · BUG-026 (part) · Clear chat + 30-day history TTL

File: `components/ChatWidget/ChatWidget.tsx:45-49, 63-93, 140-155, 205-228, 529-539`.
- Header "Clear chat" icon button (`Trash2`, `aria-label="Clear chat history"`, `title`, `type="button"`, disabled while a reply is loading).
  It asks for confirmation, then calls `clearChat()`. `clearChat()` now also pauses voice playback and tolerates `localStorage` exceptions.
- Storage format v2: `{ v: 2, savedAt, messages }`, where `savedAt` is the timestamp of the **newest message**. Reopening the page therefore doesn't extend the TTL.
  `loadStoredMessages()` drops and deletes history older than 30 days. It also drops legacy bare arrays (aged by their newest timestamp), corrupt JSON and entries without timestamps.
  Messages are shape-checked on load. Blob audio URLs are still stripped before saving.
- **Verified** with `rt/ttl_test.js`:
  - v2 data from 2 days ago is kept; v2 data from 31 days ago is dropped and deleted.
  - Legacy data from 10 days ago is kept; legacy data from 45 days ago is dropped.
  - Entries with no timestamps, corrupt JSON and an empty store all return null.
- Remaining BUG-026 scope: consented in-chat lead form (FEAT-001) and the over-broad phone regex. Both still need consent wording (BUG-005).

## Task 3 · BUG-029 · Thinkrr widget

File: `components/ThinkrrVoiceWidget.tsx:30-92, 99-142, 150-200, ~255, ~297`.
- **Keys.** English uses `NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY`, falling back to the registered Julia key (unchanged, now a named constant, :32).
  The Hindi agent only appears when `NEXT_PUBLIC_THINKRR_HINDI_WIDGET_KEY` is set **and differs** from the English key. Before, it silently connected Hindi callers to Julia.
  The pill and modal subtitle show "English & Hindi" only when Hindi is available.
- Removed the hard-coded "लाइव ब्याज दरें (Prime 4.45%)". It now reads "वर्तमान ब्याज दरें और योग्यता" ("current interest rates and eligibility", no number).
- **Teardown research.** I read the loaded script `https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js` on 2026-10-13. Web search found no public Thinkrr docs. Findings:
  - `window.widgetLib` exposes **only `scanWidgets()`**. There is no stop, destroy or disconnect API.
  - The internal click handler on `.wcw-widget-container` calls `callInstance.stop()` when a call is in progress. While a call is still connecting, a click is ignored.
  - The MutationObserver only rescans. **Removing the DOM node does not end the call**, so the old `innerHTML = ""` "End Call" / close / Escape left WebRTC calls running.
  - `Wo()` only renders keys **not already in its internal map**. After the first close, reopening an agent produced a fresh `[data-widget-key]` div that was never rendered (an empty widget on the second use). That bug was not logged before.
- **Fix.** I used the widget's own UI instead of an API:
  - Each key gets one persistent mount node (module-level map). It is moved into the modal by an effect when a call view opens, then `scanWidgets()` runs.
  - On End Call, X, Escape or unmount, `endAllThinkrrSessions()` (:86) clicks the widget's toggle while its idle icon (`.wcw-quiet`) is hidden. Hidden means a call is live or connecting. It retries each second for up to 20 s, which also covers a call that was still connecting.
  - The node is then parked in a hidden host so it survives React unmounting the modal.
- **Limitation.** This relies on Thinkrr's internal class names (`.wcw-widget-container`, `.wcw-quiet`). If Thinkrr changes its markup, stopping degrades to the old behaviour (the call isn't ended), with no errors.
  - Not browser-tested: no live Thinkrr session in this environment, and a real call uses the microphone and prepaid minutes.
  - **Do a manual test before deploy:** start a call, press End Call, and confirm the mic indicator goes off. Then reopen the same agent and confirm the widget renders.
  - Ask Thinkrr support for an official `stop`/`destroy` API.

## Task 4 · BUG-030 · Twilio voicemail lead province and score

File: `app/api/voice/twilio/recording/route.ts:20-51, 53-80, 95-124`.
- `provinceFromPhone(From)` maps the NANP area code to BC/AB/ON, or null otherwise.
  - Codes: BC 236 250 257 604 672 778; AB 368 403 587 780 825; ON 226 249 289 343 365 382 416 437 519 548 613 647 683 705 742 753 807 905 942.
  - I cross-checked the CRTC/overlay history (257 May 2025, 368 Apr 2022, 942 Apr 2025, 753/683 2022, 382 2023, 742 2021) against Wikipedia's NANP list and news reports of the CRTC decisions. The CNA pages only publish maps as images.
  - Reserved, unassigned relief codes (e.g. AB 568, ON 387/460/487/537/871) are deliberately left out.
- No invented score:
  - **Firestore** (the live store): `province: <inferred|null>`, `score: null`.
  - **Prisma**: `Lead.province` is a required `BC|AB|ON` enum and `score` defaults to 0. Score is omitted (0 = unscored). An unknown province is stored as `BC` and labelled `details.provinceSource: "unknown-defaulted-to-BC"`.
  - Both stores record `details.areaCode`, `provinceSource` and `scoreStatus: "unscored"`.
- Also fixed:
  - The recording fetch and the Whisper call now have timeouts (5 s / 8 s). Twilio waits only about 15 s for this TwiML.
  - A DB error no longer turns into a 500 (the caller would have heard an application error). It is logged with a masked phone and the TwiML is still returned.
- **Verified** with `rt/rec_test.js`:
  - BC: +1604, 250, 257 and 672 all map to BC.
  - AB: 403, 368 and 780 map to AB.
  - ON: 416, 942, 753, 683, 807 and a bare `6135551234` map to ON.
  - 204 (MB), 212 (NY), a UK number, "anonymous" and an empty string all return null.
  - Code counts: ON 19, BC 6, AB 5.

## Task 5 · BUG-049 · `embedText()` never fabricates vectors

File: `lib/ai/tools.ts:85-195` (+ Tavily timeouts :28, :65).
- New `tryEmbedText(texts): Promise<number[][] | null>` returns **null** when no provider is configured or all fail.
- `embedText(texts): Promise<number[][]>` keeps its **signature**. It now **throws** instead of returning random vectors.
  The caller `lib/pipeline/stages/gate.ts:33-38` already wraps it in try/catch and logs "Embedding generation failed, skipping duplicate check".
  That caller does **not** tolerate null: it assigns to `number[][]` and reads `.length` at :44. So a null-returning signature would have broken it.
- Responses are validated: count and finite numbers. OpenAI results are re-sorted by `index`.
- Google moved to **`gemini-embedding-001`** with `outputDimensionality: 768`, `taskType: SEMANTIC_SIMILARITY`, and the key in `x-goog-api-key`.
  `embedding-001` no longer appears on Google's model list; `gemini-embedding-001` is listed as stable. OpenAI stays `text-embedding-3-small` at 384 dimensions.
  The dimensions differ deliberately, so `cosineSimilarity` returns 0 across providers and never compares unrelated embedding spaces.
- 20 s timeouts on embeddings; 20 s / 30 s on Tavily search/extract.
- **Verified** with `rt/embed_test.js`:
  - With no provider, `tryEmbedText` returns null and `embedText` throws "No embedding provider available".
  - OpenAI results arriving out of order are re-sorted.
  - An OpenAI 500 falls back to Gemini, with no `key=` in the URL, the header set, the model `gemini-embedding-001` and 768 dimensions.
  - Comparing vectors from different providers returns 0.

## Task 6 · BUG-013 · `lib/ai/llm.ts` rewritten on plain fetch

File: `lib/ai/llm.ts` (whole file, 289 lines). Exports are identical: `LLMMessage`, `LLMResponse`, `llm` with `generate(messages, {temperature?, maxTokens?})` and `isAvailable()`.

The provider order is unchanged: OpenAI → Anthropic → Gemini → OpenRouter. The first non-empty answer wins.

| Provider | Default model (env override) | Verified against | Request notes |
| --- | --- | --- | --- |
| OpenAI Chat Completions | `gpt-6.1-sol` (`LLM_OPENAI_MODEL`) | developers.openai.com/api/docs/models/gpt-6.1-sol: "Chat Completions is supported without tool calling", efforts low…max | `max_completion_tokens`, `reasoning_effort:"low"`, no temperature |
| Anthropic Messages | `claude-sonnet-5-5` (`LLM_ANTHROPIC_MODEL`) | platform.claude.com models overview + Sonnet 5.5 page | `anthropic-version: 2023-06-01`, top-level `system`, `output_config.effort:"medium"`. **No temperature**: Sonnet 5.5 returns 400 for non-default temperature/top_p/top_k. Only `text` blocks are read; thinking blocks are skipped. |
| Gemini generateContent | `gemini-3.8-flash` (`LLM_GEMINI_MODEL`) | ai.google.dev/gemini-api/docs/models (stable) | `x-goog-api-key` header, `systemInstruction`, `thinkingConfig.thinkingLevel:"low"`, temperature left at the default |
| OpenRouter | `openai/gpt-6.1-sol` (`LLM_OPENROUTER_MODEL`) | live `openrouter.ai/api/v1/models` | `reasoning:{effort:"low",exclude:true}`; temperature is passed through (OpenRouter drops it where unsupported) |

The old IDs are all gone or retired: `gpt-4-turbo-preview`, `claude-3-opus-20240229`, `gemini-1.5-pro`, `openai/gpt-4-turbo-preview`.

All four current models think, and every provider counts those tokens toward the output cap. Each request therefore asks for **`maxTokens + 4096`** (`REASONING_HEADROOM_TOKENS`), so callers' `maxTokens` still means room for the visible answer.

Timeouts: 90 s per provider, inside a 240 s chain budget (the pipeline routes run at `maxDuration = 300`). Leading assistant turns are dropped for Anthropic and Gemini.

Errors:
- No key configured: the error message is unchanged.
- Keys configured but every provider failed: `All configured LLM providers failed (OpenAI: …; Anthropic: …)`.

**Verified** with `rt/llm_test.js`:
- With no keys, `isAvailable()` is false and the original error is thrown.
- OpenAI 503 → Anthropic answers. The Anthropic request body has `system`, roles `["user"]`, `max_tokens 7596` (3500+4096), `output_config` and no temperature, with the correct headers.
- OpenAI empty + Anthropic 400 → Gemini answers. The thought part is excluded; the URL is `/v1beta/models/gemini-3.8-flash:generateContent`; the key is in the header.
- Gemini 429 → OpenRouter answers.
- All four fail → an aggregated error naming each provider.

**ChatAlex** (`components/ChatAlex.tsx`, rewritten, 88 lines):
- Posts JSON `{input, province, messages}` to **`/api/chat`** and renders `{reply}`. Non-OK replies (429/413) are shown too.
- Proper `<form>`, `maxLength` 2000, disabled while sending, `role="log"`. The header now reads "Kraft Mortgages AI Assistant" instead of "Alex — Senior Mortgage Advisor", consistent with the AI-disclosure persona.
- `/api/chat/v2` is left in place. **Nothing in the repo calls it now** (grep: only ChatAlex did). `/api/ai/models` (admin-only) still uses `router-v2`.

**Other SDK usage in my files.** `lib/ai/providers.ts` and `lib/ai/tools.ts` already used `fetch`. `lib/ai/tools/web-search-tools.ts:38-45`: the Google Custom Search key moved from `?key=` to the `x-goog-api-key` header, with a 10 s timeout.

## Task 7 · BUG-027 · CTBC channel correction (code-side)

File: `lib/ai/lenderIntelligence.ts:1-66` (new), plus every internal read switched to `LENDERS`. Consumers switched: `app/api/chat/route.ts`, `app/api/lenders/route.ts`, `lib/ai/tools/rate-tools.ts:449-455`.
- `CHANNEL_CORRECTIONS` is matched by id `lender_sp_ctbc_bank`, or by the exact names `ctbc bank`, `ctbc bank corp. (canada)`, `ctbc bank canada`.
  It applies **only while the record still says `Alternative (B)`**, so an upstream data fix wins.
- The patch sets:
  - `channel: 'Prime (A)'`, an existing label (the data's channels are Prime (A), Monoline, Alternative (B), Credit Union, Private / MIC, Commercial / Land).
  - `categoryRaw: 'Chartered Bank / Schedule II'`.
  - Drops `'Alternative B'` from `programs`.
  - Replaces the Alt-B `bestFor` and `fitRationale` text ("Self-employed, stated income…", "Leading … Alternative (B) provider").
  - Product-level `rates[].program: "Alternative B"` is untouched. The data owner should fix the generator.
- Exported `LENDERS`, `applyLenderCorrections()` and `scrubContactDetails()`.
- **Extra fixes found by the harness:**
  1. Dossiers printed `bestFor`/`underwritingNotes`/`fitRationale` raw. **9 dossier variants contained e-mail addresses**, including named BDMs ("Saverio Spadavecchia (…@onestopmortgage.ca)", "Martina East (…@cambridgemic.com)"). These are now scrubbed. Result: 0 dossiers with an e-mail address.
  2. 11 lenders with no `bestFor` showed **"Best Suited For: undefined"**. They now show a neutral line.
  3. The Alt-B name fallback (`includes('equitable')`) gave **Equitable Reverse Mortgages** (Monoline) the Alt-B 80% worksheet and 50/50 ratios. Reverse-mortgage names are now excluded (:291, :337).
- **Verified** with `lt/test.js`: before is HEAD's `lenderIntelligence.ts`, after is the new one; both run on the same current data.
  - The only channel or category correction is `CTBC Bank: Alternative (B) -> Prime (A) (Chartered Bank / Schedule II)`.
  - CTBC ratios went from `Up to 50% / Up to 50%` to `39% / 44%`.
  - CTBC's worksheet went from `(Gross Rent × 80%)` to `(Gross Rent × 50%)`.
  - The stress test went from "contract + 2% (or un-stressed…)" to "greater of contract + 2.00% or 5.25%".
  - "CTBC income calculation for self employed" no longer gets the "How Income is Calculated on the B-Side" template.
  - TD, Equitable Bank, Home Trust and Shinhan dossiers are byte-identical before and after.
  - Every other changed line is one of three intended fixes. A line-by-line diff over all 147 lenders confirmed this:
    - an e-mail scrub;
    - one of the 11 `Best Suited For: undefined` lines (Manulife, MCAP, CMLS, Merix, RMG, Radius, Meridian, DUCA, Desjardins, Servus, Peoples Trust);
    - one of 8 Equitable Reverse Mortgages lines, which moved from Alt-B text to standard Monoline text.
  - Live `/api/chat` harness case 5 returns `matchedLender.channel: "Prime (A)"` for CTBC.

## Task 8 · BUG-008 · `/api/lenders` redaction

Files: `app/api/lenders/route.ts` (rewritten, same query parameters and response shape), `lib/ai/request-guards.ts:15-25` (new `safeEqualSecret`: sha256 of both values + `crypto.timingSafeEqual`).
- **Public** (no key, wrong key, or `LENDERS_API_KEY` unset):
  - `bdm` is set to `""`. The key is kept so consumers reading it don't crash.
  - Personal-contact parentheticals and e-mails in `bestFor` are scrubbed. This is two records with named BDM e-mails, plus one functional address.
  - The response gains `redacted_fields: ["bdm","personal contact details in bestFor"]`.
  - `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` is unchanged, plus **`Vary: x-api-key`**. Vercel's CDN honours `Vary` request headers in its cache key (vercel.com changelog "Vary support" / CDN cache docs).
- **Full** (`x-api-key` matches `LENDERS_API_KEY`, timing-safe): records are unchanged, with `Cache-Control: private, no-store` and `Vary: x-api-key`, so they are never CDN-cached.
- The full lists `bdm`, `bestFor`, `guidelines`, `appraisalPolicy`, `legalPolicy`, `rates` and others are otherwise unchanged. Guideline descriptions still contain functional lender department addresses (broker@…, mortgages@…). Those are public lender contact points, not personal ones, and were left alone.
- `/api/criteria`: the local matrix contains **0 e-mail addresses**. Its keys are criteria/policy/value/not_accepted, with no contact fields. No redaction is needed.
- **Verified** with `rt/lenders_test.js`:
  - Env unset, with or without a key: 0 of 147 have `bdm` set, 0 `bestFor` e-mails, public cache.
  - Env set, no key or wrong key: same as above.
  - Env set, correct key: 140 `bdm` populated, `private, no-store`.
  - `?id=lender_sp_ctbc_bank`: `Prime (A)`, `programs ["Uninsured"]`.
  - `?channel=alternative`: 33 results, no CTBC.

## Task 9 · BUG-052 · `/api/criteria` dynamic + EmbeddedVoiceAgent lint + machine paths

- `app/api/criteria/route.ts`:
  - `export const dynamic = "force-dynamic"` replaces `revalidate = 3600`, and it reads `req.nextUrl.searchParams`. That removes the DYNAMIC_SERVER_USAGE build log.
  - CDN caching is kept through an explicit `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on success responses.
  - The remote matrix fetch keeps `next:{revalidate:3600}`. I checked Next 14.2.35 `patch-fetch.js`: force-dynamic does not override an explicit fetch `revalidate`.
  - The fetch uses `AbortSignal.timeout(3500)`.
  - **Removed** the candidate paths `../Hermes Agent/data/…` and `c:\Users\User\Documents\…\Hermes Agent\…`. Only the repo-relative `apps/web/data/…` and `data/…` remain.
- `components/VoiceAgentWidget/EmbeddedVoiceAgent.tsx:20-110`: the effect copies `widgetContainerRef.current` to a local. The cleanup condition was inverted (`!isOpen` inside the run where `isOpen` was true, so it never ran). It is now `isOpen`, so closing actually removes the script and widget. The component is still unmounted (dead code).
- `next build` was not run (forbidden). Run it to confirm `/api/criteria` no longer logs DYNAMIC_SERVER_USAGE.

## Task 10 · Other fixes in my files

| What | Where |
| --- | --- |
| JSON-only guard on ElevenLabs/MiniMax/v2 paid endpoints; 30 s ElevenLabs timeout | `app/api/voice/generate/route.ts`, `voice/minimax/route.ts`, `chat/v2/route.ts` |
| Thinkrr re-open rendered an empty widget (see task 3) | `ThinkrrVoiceWidget.tsx` |
| Dossier e-mail leak, "Best Suited For: undefined", Equitable Reverse Mortgages mis-tiering (see task 7) | `lenderIntelligence.ts` |
| Voicemail DB error turned into a 500 / Twilio application error; no timeouts on Whisper/recording fetch | `voice/twilio/recording/route.ts` |
| Google Custom Search key in URL, no timeout | `lib/ai/tools/web-search-tools.ts` |
| Tavily search/extract had no timeouts | `lib/ai/tools.ts` |

---

## New env vars

| Name | Required? | Purpose |
| --- | --- | --- |
| `LENDERS_API_KEY` | Optional (server-only secret) | When set, `GET /api/lenders` with header `x-api-key: <value>` returns full records including `bdm`. When unset, every response is redacted. Give it to the external consumer (Hermes agent?) if it needs BDM contacts. |
| `LLM_OPENAI_MODEL`, `LLM_ANTHROPIC_MODEL`, `LLM_GEMINI_MODEL`, `LLM_OPENROUTER_MODEL` | Optional | Override the pipeline model IDs in `lib/ai/llm.ts` without a code change. |

Existing, behaviour changed: `NEXT_PUBLIC_THINKRR_HINDI_WIDGET_KEY` must now be set (and differ from the English key) for the Hindi agent to appear.

## needs-owner

- **platform**:
  - Add the new vars above to `apps/web/.env.example` and the root mirror.
  - Fix the stale comment at `apps/web/.env.example:54` ("lib/ai/llm.ts and lib/ai/providers/openrouter.ts read ONLY OPEN_ROUTER_API_KEY"). Both spellings have been accepted since round 1.
  - Set `LENDERS_API_KEY` in Vercel if any consumer needs BDM data.
- **backend**:
  - `lib/rates.ts:145-148` still lists developer-machine and `Hermes Agent` paths (`'c:\\Users\\User\\Documents\\App development\\Hermes Agent\\data\\current_rates.json'`, `../Hermes Agent/…`, `../../Hermes Agent/…`, `../../../Hermes Agent/…`). Keep only repo-relative paths.
  - `lib/googleSheets.ts:66` sends a Google API key as `?key=`. Use the `x-goog-api-key` header.
  - `lib/pipeline/stages/gate.ts:33-38`: optionally switch to `tryEmbedText()` and log "no embedding provider" explicitly. The current code works; it logs "Embedding generation failed, skipping duplicate check".
  - `lib/pipeline/stages/{brief,gate,scout}.ts` `JSON.parse(response.content)`: current models sometimes wrap JSON in ```json fences. Strip fences before parsing, or ask for JSON-only output. Not changed here because `llm.ts` must not alter the content contract.
  - `app/api/orchestrate/route.ts` and `app/api/strategy/weekly/route.ts` call `llm.generate` without `export const maxDuration`. `llm.generate` can take up to about 240 s in the worst case (typical 20–60 s).
- **user/data**:
  - Fix CTBC upstream in the lender data generator: channel, category, programs, bestFor, fitRationale, and the product-level `program: "Alternative B"`. The code correction then becomes a no-op.
  - Reverse-mortgage lenders (`HomeEquity Bank` is tagged Alternative (B), `Equitable Reverse Mortgages` Monoline) get GDS/TDS text that doesn't apply to reverse mortgages. This is a data/model decision.
- **user (product)**:
  - The pipeline LLM chain is now live paid spend whenever `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` are set (gpt-6.1-sol $2/$10 per MTok; Sonnet 5.5 $2/$10). Pipeline runs are cron/admin-only, a few calls a day. Lower with the `LLM_*_MODEL` overrides (e.g. `gpt-6-luna`, `claude-haiku-5-5`) if wanted.
  - **Thinkrr**: ask Thinkrr for an official `stop`/`destroy` widget API (see task 3), and do the manual call test before deploy.
- **ai-voice (next round)**: `/api/chat`'s Gemini fallback stays on `gemini-2.5-flash`. Google's models page says 2.5 access is limited to projects that have used it before. It isn't deprecated, but if the key's project never used it, move to `gemini-3.5-flash-lite` (thinking config differs: `thinkingLevel`).

## Packages now unused (orchestrator may remove)

Grep over `apps/web` and `packages` (excluding `node_modules`/`.next`) for `from|require|import()` of each package, plus `next.config.mjs`/`scripts`. There are **0 imports** of:
- `@anthropic-ai/sdk` (`apps/web/package.json:14`)
- `@google/generative-ai` (`apps/web/package.json:15`)
- `openai` (`apps/web/package.json:34`)

Re-run `tsc` after removing them.

## Notes for next agent

- **Model/time budgets live in one place per file.** For `/api/chat`, the constants are at the top of `app/api/chat/route.ts`. For the pipeline, they are `DEFAULT_MODELS` / `REASONING_HEADROOM_TOKENS` / timeouts in `lib/ai/llm.ts`.
  When changing the deepseek primary, re-check `reasoning.default_enabled` / `supported_efforts` on `openrouter.ai/api/v1/models`. Reasoning tokens count toward `max_tokens`.
- **Always read lenders through `LENDERS`** from `lib/ai/lenderIntelligence.ts`, never `CANADIAN_LENDERS` directly. Add data corrections to `CHANNEL_CORRECTIONS` (guarded by the known-wrong value).
  Free-text lender fields shown publicly must go through `scrubContactDetails()`.
- **Harnesses** (scratchpad, not in the repo):
  - `rt/hook.js` is a TS require hook with the `@/` alias. It lets you `require()` route files directly in Node with a mocked `global.fetch`. Keep the event loop alive with a `setInterval`, because `AbortSignal.timeout` timers are unref'd.
  - `lt/build.js` + `lt/test.js` do the before/after dossier comparison (FEAT-010 material).
- **Thinkrr**: the lifecycle notes are in the header comment of `ThinkrrVoiceWidget.tsx`. Don't go back to `innerHTML = ""`: it neither ends calls nor allows re-rendering a used key.
- Suggested FINDINGS updates:
  - BUG-042 → fixed (r2).
  - BUG-049 → fixed (r2; gate.ts follow-up optional).
  - BUG-013 → fixed for `llm.ts` and ChatAlex. The `/api/chat/v2` stack (`router-v2`, `providers/*`) still has retired IDs and is unused, pending the BUG-047 deletion decision.
  - BUG-027 → mitigated in code (data fix still owed).
  - BUG-008 → fixed (`LENDERS_API_KEY`).
  - BUG-029 → fixed with the documented limitation; manual test pending.
  - BUG-030 → fixed.
  - BUG-052 → fixed for `/api/criteria` + EmbeddedVoiceAgent. The `first-time-home-buyer` warning is the calc area's.
  - BUG-026 → partially fixed (Clear chat + TTL; consent form still open).
  - New items worth logging:
    - the Thinkrr re-render bug (fixed);
    - the dossier e-mail leak and `undefined` bestFor (fixed);
    - Equitable Reverse Mortgages mis-tiering (fixed in code);
    - pipeline JSON-fence parsing risk (backend).
