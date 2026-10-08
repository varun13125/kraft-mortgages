"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  X, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  Sparkles, 
  Globe, 
  Check, 
  AlertCircle,
  Radio,
  ArrowRight
} from "lucide-react";

interface AgentConfig {
  id: "en" | "hi";
  name: string;
  nativeTitle: string;
  flag: string;
  accent: string;
  description: string;
  capabilities: string[];
  widgetKey: string;
}

const THINKRR_SCRIPT_URL = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js";

export function ThinkrrVoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve environment-configured keys with fallback to registered Thinkrr key
  const englishKey = process.env.NEXT_PUBLIC_THINKRR_ENGLISH_WIDGET_KEY || "56a39d47-f865-4cfc-805a-c746dbdb2672";
  const hindiKey = process.env.NEXT_PUBLIC_THINKRR_HINDI_WIDGET_KEY || "56a39d47-f865-4cfc-805a-c746dbdb2672";

  const agents: AgentConfig[] = [
    {
      id: "en",
      name: "Julia",
      nativeTitle: "Senior Mortgage Copilot (English)",
      flag: "🇬🇧",
      accent: "from-blue-600 to-indigo-700",
      description: "Instant qualification calculations, prime rate benchmarks, 30-year amortizations, and Alternative B equity structuring.",
      capabilities: [
        "Live BC, AB, ON Rate Benchmarks",
        "OSFI B-20 Stress Test & TDS Limits",
        "Self-Employed (BFS) Stated Income",
        "MLI Select Multi-Unit Financing"
      ],
      widgetKey: englishKey
    },
    {
      id: "hi",
      name: "Aarav",
      nativeTitle: "वरिष्ठ मॉर्गेज सलाहकार (Hindi)",
      flag: "🇮🇳",
      accent: "from-amber-600 to-orange-700",
      description: "कनाडा में मॉर्गेज पात्रता, वर्तमान ब्याज दरें, अल्टरनेटिव बी लेंडिंग, और डाउन पेमेंट पर सीधे हिंदी में बात करें।",
      capabilities: [
        "लाइव ब्याज दरें (Prime 4.45%)",
        "कमर्शियल और कंस्ट्रक्शन लोन",
        "प्राइवेट लेंडिंग और इक्विटी लोन",
        "पहली बार घर खरीदने वालों के नियम"
      ],
      widgetKey: hindiKey
    }
  ];

  // Dynamic script loader for Thinkrr WebRTC widget
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector(`script[src="${THINKRR_SCRIPT_URL}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = THINKRR_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        if (typeof (window as any).widgetLib?.scanWidgets === "function") {
          try {
            (window as any).widgetLib.scanWidgets();
          } catch (e) {
            console.log("[ThinkrrVoiceWidget] Script scan on load:", e);
          }
        }
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Timer counter for active voice calls
  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCalling]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  const handleStartCall = (agent: AgentConfig) => {
    setActiveAgent(agent);
    setIsCalling(true);

    // If widget container is present, inject the data-widget-key child element
    // and re-trigger Thinkrr widgetLib.scanWidgets()
    setTimeout(() => {
      if (widgetContainerRef.current) {
        const key = agent.widgetKey || "56a39d47-f865-4cfc-805a-c746dbdb2672";
        widgetContainerRef.current.innerHTML = `<div data-widget-key="${key}" class="w-full flex justify-center"></div>`;
        
        const win = window as any;
        if (typeof win.widgetLib?.scanWidgets === "function") {
          try {
            win.widgetLib.scanWidgets();
          } catch (e) {
            console.log("[ThinkrrVoiceWidget] scanWidgets error:", e);
          }
        }
      }
    }, 100);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setActiveAgent(null);
    if (widgetContainerRef.current) {
      widgetContainerRef.current.innerHTML = "";
    }
  };

  return (
    <>
      {/* FLOATING ACTION PILL TRIGGER (Placed beside chat trigger) */}
      <div className="fixed bottom-6 right-24 z-40 hidden sm:block">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/95 hover:bg-slate-900 border border-gold-500/40 hover:border-gold-500 shadow-xl shadow-black/40 backdrop-blur-md transition-all text-white font-sans"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 opacity-20 group-hover:opacity-40 blur-sm transition-opacity" />

          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-gold-500 to-amber-500 text-slate-950 font-bold shadow-sm">
            <Mic className="w-3.5 h-3.5" />
          </div>

          <div className="relative flex flex-col text-left">
            <span className="text-xs font-bold tracking-wide text-gray-100 flex items-center gap-1.5">
              Talk to Voice AI
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-400 font-mono border border-gold-500/30">
                Live
              </span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              English 🇬🇧 &nbsp;•&nbsp; हिंदी 🇮🇳
            </span>
          </div>
        </motion.button>
      </div>

      {/* MOBILE FLOATING TRIGGER BUTTON */}
      <div className="fixed bottom-20 right-6 z-40 sm:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-slate-900 border border-gold-500/50 flex items-center justify-center text-gold-400 shadow-xl"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* DUAL-AGENT LANGUAGE SELECTION & LIVE WEBRTC CALL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-slate-950 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden text-gray-100"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight flex items-center gap-2">
                      Kraft Mortgages Voice AI Deal Desk
                    </h3>
                    <p className="text-xs text-gray-400">
                      Enterprise Voice AI • Powered by Thinkrr LiveKit WebRTC
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleEndCall();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Call Mode vs Language Picker */}
              <div className="p-6 space-y-5">
                {isCalling && activeAgent ? (
                  /* ACTIVE LIVE CALLING VIEW */
                  <div className="text-center py-6 space-y-4">
                    <div className="relative inline-flex items-center justify-center">
                      <span className="absolute w-24 h-24 rounded-full bg-gold-500/20 animate-ping" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl text-3xl">
                        {activeAgent.flag}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-white">
                        Voice Session with {activeAgent.name}
                      </h4>
                      <p className="text-xs text-gold-400 font-mono mt-0.5">
                        {activeAgent.nativeTitle}
                      </p>
                    </div>

                    {/* Thinkrr WebRTC Audio Widget Mount Container */}
                    <div
                      ref={widgetContainerRef}
                      id="thinkrr-voice-container"
                      className="my-3 flex justify-center min-h-[48px] w-full"
                    />

                    {/* Thinkrr WebRTC Connection Status Notice */}
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 text-left max-w-md mx-auto space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-400">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
                        <span>Thinkrr WebRTC Stream Initializing</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        If browser microphone permission does not appear or voice is not streaming, your Thinkrr Dashboard requires whitelisting <code className="bg-black/50 px-1 py-0.5 rounded font-mono text-[10px] text-amber-300">kraftmortgages.ca</code> under <strong>Julia &rarr; Web Agent tab</strong>.
                      </p>
                    </div>

                    {/* Direct Underwriting Desk Backup */}
                    <div className="mt-3 p-3 bg-slate-900/90 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex flex-col gap-2 text-left max-w-md mx-auto">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gold-400 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5" />
                          Direct Underwriting Desk
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Live • Licensed BC AB ON</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        If microphone access is restricted or audio is delayed, reach our deal team directly on the phone or WhatsApp:
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href="tel:+16043595993"
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-center text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <PhoneCall className="w-3 h-3" />
                          Call +1 (604) 359-5993
                        </a>
                        <a
                          href="https://wa.me/16043595993?text=Hi%20Julia,%20I%20would%20like%20to%20speak%20about%20my%20mortgage%20qualification."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-center text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Radio className="w-3 h-3" />
                          WhatsApp Julia
                        </a>
                      </div>
                    </div>

                    {/* Call Actions */}
                    <div className="pt-4 flex items-center justify-center gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleEndCall}
                        className="rounded-xl px-5 text-xs font-bold bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
                      >
                        <PhoneOff className="w-4 h-4" />
                        End Call
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleEndCall}
                        className="rounded-xl px-4 text-xs font-semibold border-gray-700 hover:bg-gray-800"
                      >
                        Switch Language
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* DUAL-AGENT LANGUAGE SELECTION VIEW */
                  <div className="space-y-4">
                    <div className="text-center space-y-1 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Dedicated Dual-Agent Voice Pipeline
                      </span>
                      <h4 className="text-base font-bold text-white">
                        Select Your Preferred Spoken Language
                      </h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        Connect directly with specialized voice models trained on Canadian underwriting rules and live rate benchmarks.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agents.map((agent) => (
                        <div
                          key={agent.id}
                          className="bg-slate-900/90 rounded-xl border border-gray-800 hover:border-gold-500/50 p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-gold-500/5 group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl p-1.5 bg-gray-800/80 rounded-lg">
                                {agent.flag}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                                {agent.id === 'en' ? 'English Deal Desk' : 'हिंदी सहायता'}
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">
                              {agent.name} — {agent.nativeTitle}
                            </h5>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {agent.description}
                            </p>

                            <div className="mt-3 space-y-1 pt-2 border-t border-gray-800/60">
                              {agent.capabilities.map((cap, cIdx) => (
                                <div key={cIdx} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-gold-500 shrink-0" />
                                  <span className="truncate">{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 mt-3">
                            <button
                              onClick={() => handleStartCall(agent)}
                              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-md transition-all"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              {agent.id === 'en' ? 'Connect in English' : 'हिंदी में बात करें'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-gray-900/70 rounded-xl border border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                      <span>Twilio Inbound &amp; Twilio SIP Trunk Verified</span>
                      <span className="text-gold-400 font-mono">BC • AB • ON Licensed</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Basic Button Component for internal modal usage
function Button({
  children,
  onClick,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
}) {
  const base = "px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center";
  const variants = {
    default: "bg-gold-500 hover:bg-gold-400 text-slate-950",
    outline: "border border-gray-700 hover:border-gray-600 text-gray-200",
    destructive: "bg-rose-600 hover:bg-rose-700 text-white"
  }[variant];

  return (
    <button onClick={onClick} className={`${base} ${variants} ${className}`}>
      {children}
    </button>
  );
}
