"use client";

import { useEffect, useRef, useState } from "react";
import { X, Mic, PhoneCall, AlertCircle } from "lucide-react";
import { useAdvisorHelp } from "@/components/AdvisorHelp";
import { WHATSAPP_LINK } from "@/components/icons/WhatsAppIcon";
import { THINKRR_SCRIPT_URL, DEFAULT_ENGLISH_WIDGET_KEY, getWidgetMount, parkWidgetMount, stopThinkrrCall, endAllThinkrrSessions } from "@/lib/voice/thinkrr-widget";

type VoiceWindow = Window & { widgetLib?: { scanWidgets: () => void } };
let sdkPromise: Promise<void> | null = null;
function loadSdk(): Promise<void> {
  if ((window as VoiceWindow).widgetLib?.scanWidgets) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${THINKRR_SCRIPT_URL}"]`);
    const script = existing || document.createElement("script");
    const fail = (message: string) => { script.remove(); reject(new Error(message)); };
    const timeout = window.setTimeout(() => fail("Voice controls took too long to load."), 12000);
    script.addEventListener("load", () => { window.clearTimeout(timeout); resolve(); }, { once: true });
    script.addEventListener("error", () => { window.clearTimeout(timeout); fail("Voice controls could not load."); }, { once: true });
    if (!existing) { script.src = THINKRR_SCRIPT_URL; script.async = true; document.body.appendChild(script); }
  }).catch(error => { sdkPromise = null; throw error; });
  return sdkPromise;
}

export function ThinkrrVoiceWidget() {
  const { panel, setPanel } = useAdvisorHelp();
  const isOpen = panel === "voice";
  const englishKey = process.env.NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY?.trim() || DEFAULT_ENGLISH_WIDGET_KEY;
  const hindiKey = process.env.NEXT_PUBLIC_THINKRR_HINDI_WIDGET_KEY?.trim();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) { endAllThinkrrSessions(); setSelectedKey(null); return; }
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
      if (event.key === "Tab") {
        const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]') || []).filter(e => e.offsetParent !== null);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); endAllThinkrrSessions(); previous?.focus(); };
  }, [isOpen, setPanel]);

  useEffect(() => {
    if (!isOpen || !selectedKey) return;
    const controller = new AbortController();
    let observer: MutationObserver | null = null;
    let renderTimeout: ReturnType<typeof setTimeout> | null = null;
    let mounted: HTMLDivElement | null = null;
    let accessibleToggle: HTMLElement | null = null;
    setStatus("loading"); setError("");
    const prepare = async () => {
      try {
        // Match the shipped SDK contract. Never scan/cache a rejected key.
        const response = await fetch("https://live-api.thinkrr.ai/voice-agents/v1/widget/config", {
          headers: { Authorization: `Bearer ${selectedKey}`, "Content-Type": "application/json", "X-Data-Source": "live", "X-Branch": "v1" },
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
        });
        if (!response.ok) throw new Error("Voice service is unavailable. Please try again or contact our team below.");
        await loadSdk();
        if (controller.signal.aborted || !container.current) return;
        mounted = getWidgetMount(selectedKey);
        container.current.appendChild(mounted);
        const check = () => {
          const toggle = mounted?.querySelector<HTMLElement>(".wcw-widget-container");
          if (toggle) {
            if (accessibleToggle !== toggle) {
              accessibleToggle = toggle;
              toggle.setAttribute("role", "button");
              toggle.setAttribute("aria-label", "Start or end Julia voice call");
              toggle.tabIndex = 0;
              toggle.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle.click(); }
              }, { signal: controller.signal });
            }
            setStatus("ready"); if (renderTimeout) clearTimeout(renderTimeout); observer?.disconnect();
          }
        };
        observer = new MutationObserver(check);
        observer.observe(mounted, { childList: true, subtree: true });
        renderTimeout = setTimeout(() => { setStatus("error"); setError("Voice controls did not become available. Please reload this page or contact our team."); observer?.disconnect(); }, 12000);
        (window as VoiceWindow).widgetLib?.scanWidgets();
        check();
      } catch (cause) {
        if (controller.signal.aborted) return;
        setStatus("error"); setError(cause instanceof Error ? cause.message : "Voice service is unavailable.");
      }
    };
    void prepare();
    return () => { controller.abort(); observer?.disconnect(); if (renderTimeout) clearTimeout(renderTimeout); if (mounted) { stopThinkrrCall(mounted); parkWidgetMount(mounted); } };
  }, [isOpen, selectedKey, attempt]);

  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <style jsx global>{`
      #kraft-voice-controls .wcw-widget-container { box-shadow: none !important; transition: none !important; }
      #kraft-voice-controls .wcw-widget-container:focus-visible { outline: 2px solid #c3a477; outline-offset: 5px; }
      #kraft-voice-controls .wcw-state-container,
      #kraft-voice-controls .wcw-agent-talking,
      #kraft-voice-controls .wcw-user-talking { background-color: #c3a477 !important; }
      #kraft-voice-controls .ripple-container { display: none !important; }
      #kraft-voice-controls .wave-bar { background-color: #111820 !important; }
      #kraft-voice-controls .wcw-quiet { filter: brightness(0) !important; }
    `}</style>
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Kraft Mortgages voice AI assistant" aria-labelledby="voice-heading" tabIndex={-1} className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[#c3a477]/30 bg-[#111820] text-[#eff1f3] shadow-2xl outline-none">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div><p className="text-xs uppercase tracking-widest text-[#c3a477]">Kraft Mortgages</p><h2 id="voice-heading" className="mt-1 font-serif text-2xl">Leave a message with Julia</h2></div>
        <button aria-label="Close voice assistant" onClick={() => setPanel(null)} className="rounded-lg p-3 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#c3a477]"><X size={20}/></button>
      </div>
      <div className="space-y-5 p-5">
        <p className="text-sm leading-relaxed text-[#bac3ce]">Julia is an AI assistant who takes messages for Varun. Leave your question and preferred contact details; Varun will review and decide the next step.</p>
        {!selectedKey ? <>
          <p className="text-xs leading-relaxed text-[#bac3ce]">Calls may be recorded and transcribed for follow-up. No live office transfer, appointment booking, mortgage approval or guaranteed rate. See our <a href="/privacy" className="underline">Privacy Policy</a>. Your microphone is used only when you start the voice controls.</p>
          <button onClick={() => setSelectedKey(englishKey)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c3a477] px-4 py-3 font-medium text-[#111820]"><Mic size={18}/>Open English voice controls</button>
          {hindiKey && hindiKey !== englishKey && <button onClick={() => setSelectedKey(hindiKey)} className="min-h-11 w-full rounded-lg border border-white/20 p-3">हिंदी में बात करें</button>}
        </> : <>
          <div role="status" aria-live="polite" className="text-sm text-[#bac3ce]">
            {status === "loading" && "Loading voice controls…"}
            {status === "ready" && "Voice controls ready. Select the microphone below to start; allow microphone access when asked."}
          </div>
          {status === "error" && <div role="alert" className="rounded-lg border border-amber-300/30 bg-amber-300/5 p-4 text-sm"><AlertCircle className="mb-2 text-[#c3a477]" size={20}/>{error}<button onClick={() => error.startsWith("Voice controls did not") ? window.location.reload() : setAttempt(n => n + 1)} className="mt-3 block min-h-11 rounded-lg border border-white/20 px-4">{error.startsWith("Voice controls did not") ? "Reload page" : "Try again"}</button></div>}
          <div id="kraft-voice-controls" ref={container} className={status === "error" ? "hidden" : "flex min-h-16 justify-center"}/>
          <button onClick={() => { endAllThinkrrSessions(); setSelectedKey(null); }} className="min-h-11 w-full rounded-lg border border-white/20 p-3">End voice session / back</button>
        </>}
        <div className="border-t border-white/10 pt-4"><p className="mb-3 text-xs text-[#bac3ce]">You can also reach Kraft directly.</p><div className="flex flex-col gap-2 sm:flex-row">
          <a href="tel:+16043595993" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-3 text-sm"><PhoneCall size={16}/>+1 (604) 359-5993</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-white/20 px-3 text-sm">WhatsApp Kraft</a>
        </div></div>
      </div>
    </div>
  </div>;
}
