# Team intake: October21 verification

Owner requested generic Kraft Mortgages team follow-up rather than Varun personally. BUG-086 completed; earlier Varun-only instructions superseded. No new recipients, transfer, booking, automatic assignment or public-form outbound calls. Keep internal staffing/location/time-zone details private.

## Saved and live

- Thinkrr21437, Julia—Kraft Website: representing Kraft Mortgages team/Mortgage advisory team. Greeting, introduction, goal, facts and guidelines saved/reloaded. Booking and Call Transfer OFF.
- Greeting: “Hi, I'm Julia, the AI message assistant for Kraft Mortgages. This call may be recorded and transcribed. I can take a message, and a member of our team will get back to you. How can we help?”
- Website source d9b2a4e6aa60187a4d73a13b03792606aa6169eb; deployment dpl_GYBodhzXhdYNnqjC9GhTVwwBsw3f READY/www.kraftmortgages.ca/no alias error. Live qualification intro and guidance→Julia panel show team copy; no microphone or call started. Screenshots julia-team-intake-saved-2026-10-21.png and julia-team-intake-live-2026-10-21.png.
- CRM18e1683e5da81a43e6fb04e8742fe35e97a16230 pushed: WhatsApp reply policy and voicemail greeting/closing generic, deployed/service active. Owner34-line mirror remains unstaged/present/deployed.
- Staff callback suggestion: “Hello, this is [first name] calling from Kraft Mortgages about the message you left with us.” Human delegation, no automatic dispatch.

## Controlled receipts

- Own business-line self-call CAfda4cb5f626b87a35fa044695b514f8a,09:00:44–09:01:27UTC,43s, completed. Labelled Kraft communications audit; no callback/booking requested.
- Twenty8f51fef2-fdac-45dc-8a72-a8eab4a0a875 created09:01:41UTC. Readback contains exact greeting/test message; no named personal follow-up promised.
- Owner screenshot confirms Thinkrr email summary arrived at info@kraftmortgages.ca,13:01Dubai. Actual inbox arrival for this provider alert; does not certify unrelated contact-form email.
- Signed voicemail fallback200: Record/noDial, generic team response.
- Owner WhatsApp SM73d2b0dc3b7b090e230eb84b6c86b5ae **undelivered63016**. No fresh Discord history readback. Prior delivered WhatsApp tests do not prove out-of-window reliability.

## BUG-087: partly fixed, Meta approval pending

[Twilio63016](https://www.twilio.com/docs/api/errors/63016) requires an approved template outside the session window. Existing approved template says “New WhatsApp message”; it was not repurposed for calls.

Submitted **kraft_voice_message_alert_v1**, **HX4b427c4b28693efa556ace4ad1501d8d**, UTILITY, **pending Meta approval** at last check. Static body links to Twenty for the voice message, without caller details. Root-only VPS voice-template-sid.txt holds its identifier.

Deployed voice_alerts.py/hook branch outside owner mirror selects ContentSid automatically after approval, checks actual delivery state, and never calls queued/failed delivery success. While approval is pending/unavailable, legacy free-form alerts remain window-limited. No approved-template live delivery claimed. Next: verify approval and controlled existing-owner alert. Durable retries/outbox/auth remain BUG-083; no exactly-once claim.

Working/deployed SHA256:

- hook18ea0baed02db08bdcc25417e2c8849d1fd747778e742558240e395cad662d1c
- voice_alerts07917bc49abc21c85a3f5c7542cbb163bc0f1b4f936c399192577250d937502e
- whatsapp_ratesd0ea77cf3d47152dbc71548c0ddda6fe87ca97127ea1566e8a5b1320a3abd611

Deploy helper with hook and preserve owner mirror. Backups *.before-team-intake-20261021 and hook.before-voice-template-20261021.

## Validation

Website isolated staged application tree2fb473c0d4e2cdb8f3a0977c822a9cd2aabb5741 on committed data: type0/lint0,125tests,126-page build. React review: text only, no hook/layout/control changes. Four owner data edits untouched/excluded.

CRM Python syntax,3existing queue/3receiver tests,4new template tests: approval gating, no Body/caller data, delivered versus queued/failed state, and no duplicate after ambiguous submission. Unrelated Balikbayan Box folder untouched. Prior credential, SMS/carrier, Facebook and physical microphone limits remain in the main report.

Follow-up wording check caught chat reciting internal assignment/timing limits. Policies now apply these silently and answer ordinary handoff questions in one or two short team-based sentences. WhatsApp updated policy deployed with current hash above. CRM template-sender75eead70d02e1a02020263d027ef16b1d1b2c870 and concise-policy1424f25 pushed; Meta approval still pending. Final isolated follow-up validation: lint0,125tests,126-page production build including type validity. Website follow-up release receipt follows.
