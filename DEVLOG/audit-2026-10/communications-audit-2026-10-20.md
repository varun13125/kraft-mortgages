# Communications audit - 20 October 2026

Supplement to [calculator/premium audit](calculator-premium-audit-2026-10-20.md). Owner authorized repairs, controlled tests, commits and live release. Synthetic tests used the existing business line and info@kraftmortgages.ca; no client was called.

## Confirmed architecture and policy

Twenty CRM on the VPS is the brokerage CRM. The website receiver is the Node kraft-finmo-webhook service on port 8081, not n8n. Retired GoHighLevel paths must not be reconnected. Julia takes messages for Varun only: no live office transfer, round-robin routing or autonomous booking. Existing notifications go to owner WhatsApp and Discord #whatsapp-alerts, not Telegram. Manpreet Dhaliwal is Principal Broker; Varun remains president/owner. Public contact email: info@kraftmortgages.ca.

Website forms -> API -> VPS receiver -> Twenty person/opportunity/linked note/consent. Phone/web voice -> Thinkrr Julia agent 21437 -> /thinkrr-hook -> Twenty conversation log -> owner WhatsApp/Discord. WhatsApp -> signed Twilio webhook -> durable inbox -> Twenty, customer AI response and existing owner notification path.

## Defects and repairs

| Item | Finding and change |
| --- | --- |
| BUG-073 WhatsApp | Owner-number inquiries were incorrectly treated as operator commands. Console now requires explicit @number or /console; normal queries use customer flow. Durable SQLite enqueue precedes fast XML acknowledgement, SID dedupe survives restart, retries handle processing failures. Threaded HTTP server avoids slow AI blocking inbound requests. |
| WhatsApp AI | VPS OpenRouter key returns 401. Added fallback through the maintained first-party website chat chain. Broken key still needs rotation. No invented rate fallback. |
| BUG-074 chat | Safe Markdown now renders bold, paragraphs and lists. Ordinary answers target 40-90 words and one useful follow-up. Simple rate questions bypass the model with dated feed values, freshness/future guards, product class and known provincial coverage. Fixed-rate sales pitches no longer accompany a basic variable query. Banks set prime; BoC sets policy rate. Variable payment structure varies. |
| Rate source | Rates page and chat share the same loader, timeout and cache. Unknown lender geography cannot be advertised as locally eligible. Aggregate feed minima are not personalized quotes. /apply existed as an external application redirect, not a 404; chat now uses explicit maintained contact/qualification links. |
| BUG-075 voice | Old public embed was rejected. Created/configured Julia inbound agent 21437, replaced embed, added bounded preflight/SDK/render timeouts, truthful readiness/error/retry states and explicit start. Preserved stop-and-park lifecycle because removing vendor DOM does not hang up. Localhost is not an approved production embed origin; its finite unavailable state is expected. |
| Phone routing | Imported existing Twilio number into Thinkrr, assigned Julia. Provisioning updated the old Vapi endpoint asynchronously; a later API read confirmed Thinkrr inbound routing. Added signed voicemail-only fallback, containing no Dial/office forwarding. No new number purchased. |
| BUG-076 lead pipeline | Existing-email conflicts and outdated note writes broke repeat inquiries. Receiver reuses person/opportunity, writes modern linked notes and consent, returns success only after required writes. Deterministic note/target IDs support retries. Phone-only leads no longer require invented email. Website sender checks JSON receipt, not HTTP200 alone. |
| Lead destinations | Calculator leads now reach Twenty. Business funding uses Twenty instead of GHL. Firestore/Discord fallback receipts are explicit; all destinations failing produces an error. This is not a complete durable cross-channel outbox. |
| BUG-077 business facts | Manpreet Principal Broker; info@ public contact and Thinkrr email notifications. Varun biography retained as president/owner. |
| BUG-078 retired CRM | Replaced /varun GHL iframe with native consented contact form; removed active GHL forwarding/defaults/origins. Thinkrr disconnected-GHL banner is stale configuration, not a reason to reconnect. |
| BUG-079 message-only | Transfer/booking actions disabled, Julia trained to take a message. Public-form/Facebook automated callbacks disabled. Removed immediate-call/rate-reservation/booking promises. Varun controls follow-up. |
| SMS | Restored old Vapi SMS route to existing signed VPS owner-notification endpoint. Durable enqueue/dedupe, no raw SMS-body logging. This is notification intake; linked Twenty SMS history remains a follow-up. |

## Evidence and limits

- Website: 125/125 tests; lint zero warnings/errors. Final build, staged-tree and production receipts: [verification](communications-evidence/verification.md). Six new tests cover dates, regional eligibility, product/term distinctions, receipt validation and message-only policy.
- VPS: 3 queue + 3 receiver tests pass, Python/Node syntax checked; thinkrr-hook, kraft-finmo-webhook and kraft-discord-inbox active after deployment.
- Signed synthetic WhatsApp test SMd04bdb984f4242ce97030280af3281ef acknowledged in 28ms; repeated SID deduped (11ms). Real response SMd4f137b142c27df00b82ba8940bd49bc delivered at 07:55 UTC. This verifies signed intake/provider response, not a fresh external carrier-originated inbound message or traffic capacity.
- Phone after provisioning: CAdbc03cfbafde2274133e3154f97e3e01 completed, 45 seconds, 14:28:52-14:29:37 UTC. Both ends used the owned business line with generated speech. Thinkrr Call History shows Craft Audit / Julia - Kraft Website / Completed. Julia disclosed AI/recording, took and repeated the message for Varun, offered no transfer/booking.
- Twenty voice record 92ae4fd6-0c43-47fd-a712-d3963f2933f6, CALL/ANSWERED, 632 transcript characters, created 14:29:42 UTC. Provider summary visible in Thinkrr; current receiver saved transcript but no separate summary.
- Owner notification SM17a7213f4c4df1ed1bbc4387ecbc5cd8 delivered 14:29:45 UTC. Receiver also accepted Discord bridge notification; bridge awaits Discord send before success. Human reading is not claimed.
- Signed synthetic SMS SM18ccb7df82394f88ba1da90c0eddfe0b returned 200. External carrier SMS delivery/registration and two-way texting are not certified.
- Existing SMTP transport accepted a labelled message to info@kraftmortgages.ca. Inbox arrival and Thinkrr notification-email delivery remain unverified.
- Local browser verified concise formatted Ontario benchmark, one help dock, correct Julia/WhatsApp links, voice disclosures and finite error on disallowed localhost. Published-domain voice checks are recorded separately in the release receipt.

## Remaining work and risk

1. BUG-080: rotate Twilio Auth Token. Thinkrr's import form exposed it as plaintext in a diagnostic snapshot. Never repeat it. Update Thinkrr number connection, VPS token file, Vercel TWILIO_AUTH_TOKEN and other active validators together. Restricted temporary credential bridge was deleted. Existing leaked-key tasks remain; removing Vapi source fallbacks is not rotation.
2. Rotate rejected VPS OpenRouter key. Website fallback restores replies but depends on shared rate limits/provider availability.
3. FEAT-002: durable event/outbox service with per-destination retries/dead-letter visibility. Current queue is at-least-once; crash-after-send can duplicate an effect. Some mirror helpers swallow failures and need stronger receipts/recovery.
4. BUG-083 (actual VPS receiver; old website BUG-009 is separate): authenticate/dedupe Thinkrr completion events in coordination with provider. Add structured timestamps and receipts without message bodies/secrets. Map separate summary/caller identity; unmatched phone callers can remain unlinked.
5. SMS needs consistent Twenty history. Facebook route reviewed/callbacks disabled, but no real new Lead Ad generated. No real external mortgage application submitted.
6. Calculator-report email remains deliberately disabled (emailed:false). Prefer instant PDFs; activate a verified provider with bounce/delivery handling before offering report email delivery. Legal/consent/retention and personalized underwriting still need brokerage review.

## Design and product recommendations

Keep approved ink/ivory/muted gold and a single guidance launcher. Use compact message-intake voice controls, short chat answers, retained form drafts and honest saved/error states. Avoid competing help buttons, fake progress and provider implementation details in visitor copy.

Next priorities: private owner inbox showing unreviewed messages and failed delivery, source attribution, explicit response expectations, callback preferences without autonomous booking, consented renewal reminders, secure document checklist/handoff, and saved renewal/MLI scenarios. Prioritize reliability before adding another AI channel. Full calculator/design roadmap, including released renewal comparison and MLI deal sizer, is in the original audit.

## Deployment/handoff

Four owner data updates excluded from website release. VPS backups: /opt/kraft-finmo-webhook/server.mjs.before-communications-20261020T074446Z; /root/kraft-ops/thinkrr-hook.py.before-communications-20261020; /root/kraft-ops/ai_whatsapp.py.before-communications-20261020. Root-only Twilio routing checkpoint: /root/kraft-ops/twilio-routing.before-communications-20261020.json. Do not restore old office forwarding blindly. Source/helpers in Kraft Deal Tracker deploy/. Existing owner mirror edits preserved separately.

Provider reference: [Thinkrr phone management](https://docs.thinkrr.ai/guides/usage/phone-numbers/Management-and-Assignment). Runtime receipts establish live delivery; dashboard Active labels alone do not.

Release follow-up: Vercel retained the retired public embed in NEXT_PUBLIC settings; corrected English and cleared unverified Hindi. Browser-origin config now200, environment rebuild required. BUG-082: chat initially copied province only once; now directly shares navigation/city store, with browser regression in both directions. All three live inquiry types read back from Twenty with TEST ONLY/no-call consent; see verification receipt.


## Final browser voice and fresh WhatsApp proof

Production override corrected and rebuilt in 5e3eebe / dpl_5dhf6rFadkLwjchBb4H8db2zeLET (READY, www alias). Browser controls rendered. Generated 42-second test audio substituted temporarily for getUserMedia, so no ambient microphone audio was captured. Web-call API200, call_81d2c3ab0012456f9c2dd5b2086; Twenty conversation 38edf8f4-8ec6-429c-a599-d3b6f9b5bbd5 saved 601-character synthetic transcript. Julia took the message for Varun and asked the caller's name, offered no transfer/booking. Owner notification SMa759dec79234faf4ec0485ac66c03ae4 delivered14:59:20 UTC. Test ended and reload removed the audio substitution. This verifies WebRTC/agent/completion/CRM/provider notification; it does not certify every visitor's microphone permissions/device.

Fresh WhatsApp response SM93f7242263bb8ca57bae84b1461c2928 delivered14:56:08 UTC:50 words, feed date present, no raw double-star Markdown or console help. All three live website test inquiries were read back from Twenty with consentToCall:false; person reused across inquiries. Browser dictation/read-aloud, new real Facebook ads, mailbox receipt and external carrier SMS remain outside the proven receipts.

BUG-084 found in live SDK: microphone was a clickable div without keyboard semantics, with bright pink/purple glow. Final wrapper adds role/button label/tab stop/Enter/Space and muted-gold/no-glow styling. Mock SDK regression verifies keyboard start and Escape stops/parks the session, with all external mutations blocked.

Security follow-up BUG-085: enforce shared-secret/rate limiting at the VPS contact receiver, not only in public Next handlers. Optional website headers alone do not protect direct receiver access. Coordinate legitimate senders before enforcement. Final production keyboard/muted-gold/no-glow control verified on db6624b; source specificity follow-up ensures dark icon contrast. See verification for exact deployment receipts.
