# Communications verification - 2026-10-20

Website implementation ready for authorized release. Staged source tree c175956774c3c27fb7048e73cd6ac587e0287e98 exported to an isolated folder with committed data baseline and dependency junctions, no secret environment files. Typecheck passed; lint 0 errors/warnings; 125/125 tests; production build 126/126 pages. Built-app browser suite 12/12 passed, including keyboard help/voice consent, three tools, PDFs and desktop/390/320px accessibility/layout; no browser errors. Non-GET requests blocked in this regression suite. Published-domain integrations and exact production SHA will be recorded after deployment.

Phone: controlled business-line call CAdbc03cfbafde2274133e3154f97e3e01 completed 45s; Twenty 92ae4fd6-0c43-47fd-a712-d3963f2933f6 saved 632-character transcript. Owner WhatsApp SM17a7213f4c4df1ed1bbc4387ecbc5cd8 delivered. See full communications audit for limits.


## First production deployment and actual integrations

Implementation 869edd799ca704b146107444eaea163e0e8b54cf: Vercel dpl_GSjng8c42PKRezX92H9mcsm3Hmm5 READY, www.kraftmortgages.ca alias, no aliasError. CRM helper commit 4863cf17a95626ef0d43fce02a8f9a533d41e935 pushed; owner mirror hunk remains separate.

Live /api/contact and /api/lead returned HTTP200 success/crmRecorded:true; contact teamNotified:true/callDispatched:false. Business funding returned success. Independently read all three linked notes from Twenty (HTTP200), each containing TEST ONLY and consentToCall:false: 99095219-0ce4-44ce-ad22-f433335229db, 52598c68-3eb1-463a-a84a-d09a82db9b32, dfc42d36-94cc-45a7-a027-9912f2cc2965. Same person reused across inquiries. Full response metadata in live-lead-receipts.json.

Live voice initially still returned403: Vercel NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY overrode corrected source with the retired embed. Updated the existing public env setting to the new agent identifier across its existing environments, cleared the unverified Hindi key (no verified Hindi agent). Direct browser-origin request to corrected config returned200. A fresh deployment is required because NEXT_PUBLIC values are compiled. Final published controls check follows after that deployment.

Signed voicemail fallback HTTP200 contains Record and no Dial. Signed SMS audit processed; SMTP accepted test email to info@ (mailbox arrival unverified). Restricted temporary credential file confirmed absent.

Final follow-up source: shared province store and business-funding sink receipt fields. Isolated build again passed 126/126 pages, lint clean, tests125/125; browser help regression now checks navigation-to-chat and chat-to-navigation province synchronization. No unrelated data changes included.
