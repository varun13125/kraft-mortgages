"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, Mic, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/seo/business-config";
import { WHATSAPP_LINK } from "@/components/icons/WhatsAppIcon";

type Panel = "menu" | "chat" | "voice" | null;
const HelpContext = createContext<{ panel: Panel; setPanel: (panel: Panel) => void }>({ panel: null, setPanel: () => {} });
export const useAdvisorHelp = () => useContext(HelpContext);

export function AdvisorHelpProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  useEffect(() => {
    if (panel !== "chat" && panel !== "voice") return;
    const label = panel === "chat" ? "Kraft Mortgages AI chat assistant" : "Kraft Mortgages voice AI assistant";
    const dialog = () => document.querySelector<HTMLElement>(`[role="dialog"][aria-label="${label}"]`);
    const timer = window.setTimeout(() => dialog()?.querySelector<HTMLElement>(panel === "chat" ? 'input[aria-label="Type your message"]' : 'button[aria-label="Close voice assistant"]')?.focus(), 200);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel === "chat") setPanel(null);
      if (e.key !== "Tab" || panel !== "voice") return;
      const nodes = [...dialog()?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]') ?? []].filter(el => el.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (!first) return;
      if (e.shiftKey && (document.activeElement === first || !dialog()?.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !dialog()?.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { window.clearTimeout(timer); document.removeEventListener("keydown", key); };
  }, [panel]);
  return <HelpContext.Provider value={{ panel, setPanel }}>{children}</HelpContext.Provider>;
}

/** One entry point; selecting voice opens its disclosure/consent screen, never a call. */
export function AdvisorHelpDock() {
  const { panel, setPanel } = useAdvisorHelp();
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previous = useRef<Panel>(null);
  useEffect(() => {
    if (previous.current && !panel) trigger.current?.focus();
    previous.current = panel;
    if (panel !== "menu") return;
    dock.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel(null); };
    const outside = (e: PointerEvent) => { if (!dock.current?.contains(e.target as Node)) setPanel(null); };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [panel, setPanel]);
  if (panel === "chat" || panel === "voice") return null;
  return <div ref={dock} className="advisor-help">
    {panel === "menu" && <div id="advisor-help-options" className="advisor-help-menu" aria-label="Ways to get help">
      <p>How can we help?</p>
      <a href={`tel:${BUSINESS.secondaryPhone}`}><Phone size={18} /><span>Leave a phone message<small>{BUSINESS.secondaryPhoneDisplay}</small></span></a>
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /><span>WhatsApp<small>Message the Kraft team</small></span></a>
      <button onClick={() => setPanel("chat")}><MessageCircle size={18} /><span>Ask the AI assistant<small>General guidance, available anytime</small></span></button>
      <button onClick={() => setPanel("voice")}><Mic size={18} /><span>Leave a message with Julia<small>AI message intake; no live transfer</small></span></button>
    </div>}
    <button ref={trigger} className="advisor-help-trigger" aria-expanded={panel === "menu"} aria-controls="advisor-help-options" onClick={() => setPanel(panel ? null : "menu")}>
      {panel ? <X size={18} /> : <MessageCircle size={18} />}<span>{panel ? "Close help" : "Get guidance"}</span>
    </button>
  </div>;
}
