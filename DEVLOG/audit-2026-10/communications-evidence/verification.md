# Communications verification - 2026-10-20

**October21 follow-up:** [generic Kraft team intake, live phone/CRM/email receipts and pending WhatsApp-template remediation](team-intake-2026-10-21.md). This supersedes Varun-only wording and qualifies earlier owner WhatsApp delivery claims: the new out-of-window test failed63016; a voice-specific template is pending Meta approval.

Website implementation ready for authorized release. Staged source tree c175956774c3c27fb7048e73cd6ac587e0287e98 exported to an isolated folder with committed data baseline and dependency junctions, no secret environment files. Typecheck passed; lint 0 errors/warnings; 125/125 tests; production build 126/126 pages. Built-app browser suite 12/12 passed, including keyboard help/voice consent, three tools, PDFs and desktop/390/320px accessibility/layout; no browser errors. Non-GET requests blocked in this regression suite. Published-domain integrations and exact production SHA will be recorded after deployment.

Phone: controlled business-line call CAdbc03cfbafde2274133e3154f97e3e01 completed 45s; Twenty 92ae4fd6-0c43-47fd-a712-d3963f2933f6 saved 632-character transcript. Owner WhatsApp SM17a7213f4c4df1ed1bbc4387ecbc5cd8 delivered. See full communications audit for limits.


## First production deployment and actual integrations

Implementation 869edd799ca704b146107444eaea163e0e8b54cf: Vercel dpl_GSjng8c42PKRezX92H9mcsm3Hmm5 READY, www.kraftmortgages.ca alias, no aliasError. CRM helper commit 4863cf17a95626ef0d43fce02a8f9a533d41e935 pushed; owner mirror hunk remains separate.

Live /api/contact and /api/lead returned HTTP200 success/crmRecorded:true; contact teamNotified:true/callDispatched:false. Business funding returned success. Independently read all three linked notes from Twenty (HTTP200), each containing TEST ONLY and consentToCall:false: 99095219-0ce4-44ce-ad22-f433335229db, 52598c68-3eb1-463a-a84a-d09a82db9b32, dfc42d36-94cc-45a7-a027-9912f2cc2965. Same person reused across inquiries. Full response metadata in live-lead-receipts.json.

Live voice initially still returned403: Vercel NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY overrode corrected source with the retired embed. Updated the existing public env setting to the new agent identifier across its existing environments, cleared the unverified Hindi key (no verified Hindi agent). Direct browser-origin request to corrected config returned200. A fresh deployment is required because NEXT_PUBLIC values are compiled. Final published controls check follows after that deployment.

Signed voicemail fallback HTTP200 contains Record and no Dial. Signed SMS audit processed; SMTP accepted test email to info@ (mailbox arrival unverified). Restricted temporary credential file confirmed absent.

Final follow-up source: shared province store and business-funding sink receipt fields. Isolated build again passed 126/126 pages, lint clean, tests125/125; browser help regression now checks navigation-to-chat and chat-to-navigation province synchronization. No unrelated data changes included.


## Browser voice verified after environment rebuild

Deployment dpl_5dhf6rFadkLwjchBb4H8db2zeLET READY for 5e3eebed2b4e5fa5829dcb863ca94b99fa82b9c5, owns www alias, no alias error. Live controls rendered. Controlled browser test used generated 42-second audio through a temporary getUserMedia substitution, never physical microphone. Thinkrr web-call API200, call_81d2c3ab0012456f9c2dd5b2086. Message-only transcript saved in Twenty 38edf8f4-8ec6-429c-a599-d3b6f9b5bbd5 (601 chars) at14:59:19 UTC. Owner WhatsApp SMa759dec79234faf4ec0485ac66c03ae4 delivered14:59:20. Session ended, page reloaded to remove substitution. No real microphone permission granted. Screenshot voice-controls-live.png records that session.

Fresh WhatsApp test after website release: signed inbound SMa7687555a75c4c9ba7a7c093ca54a2f6, actual reply SM93f7242263bb8ca57bae84b1461c2928 delivered14:56:08; 50 words, dated, no raw double-star formatting or operator-console text.

Final minor polish verified locally: keyboard semantics for vendor clickable div and scoped muted-gold/no-glow presentation (BUG-084). New mocked browser regression verifies keyboard activation/close without any real call.

Final polish: isolated126-page production build and clean lint/type validation. Browser suite13/13 pass, including vendor-stub keyboard activation and closing stopping a session; no actual paid calls in regression harness. Source/data baseline preserved. Final production polish deployment receipt follows.


## Final production polish receipt

Commit db6624bf2fd0c9a941a3dc7285ed567c0509d32a, deployment dpl_4RrAQrRdiMEeg1mXsXxjwdF8xcpR READY, www.kraftmortgages.ca alias/no alias error. Live control rendered with button role, tabIndex0 and keyboard focus. Computed shadow:none and state background rgb(195,164,119). Screenshot voice-controls-premium-live.png. Provider uses an important white-icon filter; final CSS specificity follow-up forces a dark microphone for gold-surface contrast. No additional real call needed; voice flow unchanged.

VPS deployed thinkrr-hook.py, whatsapp_inbox.py, whatsapp_rates.py and website-leads.mjs hashes exactly match local deployment working tree. CRM commits4863cf1/8b4dede pushed. Owner mirror remains uncommitted but present/deployed. Four unrelated website data files remain modified and excluded.

Icon-contrast specificity follow-up: final isolated production build again passed126/126 pages with type validation; no calculator/model behavior changed. All functional flow receipts above remain applicable.


## Release complete

Final functional implementation **f6ac58276322d94d8f3279905b8f5f0847f743e3**, Vercel **dpl_1x8Z3ngXjVk8NndYQqghoyTQVYVT READY**, www.kraftmortgages.ca assigned/no alias error. Live source rendered the corrected keyboard control and dark microphone (computed brightness(0)); gold background/no glow retained. Final proof voice-controls-premium-live.png; machine receipt production-release.json. No call running and no test audio substitution retained. Public compliance/privacy/profile/rates routes200, Manpreet/info@ correct and native form present. Receipt-only documentation follow-up contains identical application code; latest Git SHA can be inspected normally.

All requested functional repairs and controlled verification are complete within the documented scope. Open credential/security/notification retry and untested carrier/inbox/physical-device items remain explicitly listed; this receipt does not certify those.
