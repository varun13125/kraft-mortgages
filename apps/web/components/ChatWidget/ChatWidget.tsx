"use client";
import { useState, useEffect, useRef } from "react";
import { useAdvisorHelp } from "@/components/AdvisorHelp";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calculator, TrendingUp, DollarSign, Volume2, Languages, Globe, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { VoiceInput } from "./VoiceInput";
import { CleanVoiceControls } from "./CleanVoiceControls";
import { ToolResults } from "./ToolResults";
import { MultilingualVoiceService } from "@/lib/voice/multilingual-voice";
import { getPageContext } from "@/lib/ai/page-context";
import { evaluate as evaluateCompliance } from "@/lib/compliance/rules";
import { WhatsAppIcon, WHATSAPP_LINK, WHATSAPP_PHONE_DISPLAY } from "@/components/icons/WhatsAppIcon";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  metadata?: {
    modelUsed?: string;
    cost?: number;
    isFree?: boolean;
    toolResult?: {
      toolName: string;
      result: any;
      displayType?: "table" | "card" | "list" | "text" | "chart";
    };
    voice?: {
      language: string;
      provider: string;
      switchedLanguage: boolean;
      audioUrl?: string;
    };
  };
}

interface QuickAction {
  label: string;
  message: string;
  icon: React.ReactNode;
}

const STORAGE_KEY = "kraft-chat-messages";
const MAX_MESSAGES = 50; // Increased from default to 50
// Saved conversations can contain contact details; on shared devices they must not live forever.
const HISTORY_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days since the last message
const STORAGE_VERSION = 2;
const MAX_INPUT_CHARS = 2000; // keep in sync with /api/chat
// No hard-coded rates here: this text is persisted in localStorage and would go stale.
const WELCOME_CONTENT =
  "Hi! I'm the Kraft Mortgages AI assistant. I can walk you through today's benchmark rates, 30-year amortization rules, and qualification basics across BC, Alberta, and Ontario. Which city or province are you exploring?";

// Blob URLs only live as long as the page, so never persist them.
function toStorable(messages: Message[]) {
  return messages.map((m) =>
    m.metadata?.voice?.audioUrl
      ? { ...m, metadata: { ...m.metadata, voice: { ...m.metadata.voice, audioUrl: undefined } } }
      : m
  );
}

/**
 * Reads saved history. Format v2 is { v, savedAt, messages }; the legacy format was a bare array,
 * aged by its newest message timestamp. Returns null (and deletes the entry) when it is missing,
 * unreadable, or older than HISTORY_TTL_MS.
 */
function loadStoredMessages(): Message[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  const list: any[] | null = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.messages) ? parsed.messages : null;
  if (!list || list.length === 0) return null;

  let savedAt = typeof parsed?.savedAt === "number" ? parsed.savedAt : NaN;
  if (!Number.isFinite(savedAt)) {
    savedAt = Math.max(...list.map((m) => new Date(m?.timestamp).getTime()).filter((t) => Number.isFinite(t)));
  }
  if (!Number.isFinite(savedAt) || Date.now() - savedAt > HISTORY_TTL_MS) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return list
    .filter((m) => m && typeof m.content === "string" && (m.sender === "user" || m.sender === "assistant"))
    .map((m) => ({ ...m, id: String(m.id), timestamp: new Date(m.timestamp) }));
}

export function ChatWidget() {
  const { panel, setPanel } = useAdvisorHelp();
  const isOpen = panel === "chat";
  const setIsOpen = (open: boolean) => setPanel(open ? "chat" : null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState<string | null>(null);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const { province, language } = useAppStore();
  const [selectedProvince, setSelectedProvince] = useState(province || "BC");
  const pathname = usePathname();
  const pageContext = getPageContext(pathname);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const voiceService = useRef(new MultilingualVoiceService());
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const objectUrlsRef = useRef<string[]>([]);
  const [primeRate, setPrimeRate] = useState<number | null>(null);
  const ratesRequestedRef = useRef(false);
  const complianceNotes = evaluateCompliance(selectedProvince as "BC" | "AB" | "ON", "CHATBOT").disclaimers;

  // Load messages from localStorage on mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: WELCOME_CONTENT,
      sender: "assistant",
      timestamp: new Date(),
    };
    try {
      const saved = loadStoredMessages();
      if (saved && saved.length > 0) {
        setMessages(saved);
      } else {
        // Initialize with welcome message if no saved messages
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      // Fallback to welcome message
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // savedAt = time of the newest message, so merely reopening the page doesn't extend the TTL.
        const times = messages.map((m) => new Date(m.timestamp).getTime()).filter((t) => Number.isFinite(t));
        const savedAt = times.length ? Math.max(...times) : Date.now();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ v: STORAGE_VERSION, savedAt, messages: toStorable(messages) })
        );
      } catch (error) {
        console.error("Error saving chat messages:", error);
      }
    }
  }, [messages]);

  // Release audio elements and blob URLs when the widget unmounts.
  useEffect(() => {
    const audios = audioRefs.current;
    const urls = objectUrlsRef.current;
    return () => {
      Object.values(audios).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Fetch the live prime rate the first time the chat is opened (instead of a hard-coded value).
  useEffect(() => {
    if (!isOpen || ratesRequestedRef.current) return;
    ratesRequestedRef.current = true;
    fetch("/api/rates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.prime_rate === "number") setPrimeRate(data.prime_rate);
      })
      .catch(() => {});
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions: QuickAction[] = [
    {
      label: "Calculate Affordability",
      message: "I want to calculate how much home I can afford",
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      label: "Monthly Payment",
      message: "Calculate my monthly mortgage payment",
      icon: <Calculator className="w-4 h-4" />
    },
    {
      label: "Current Rates",
      message: "What are the current mortgage rates?",
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  // Clear chat history (on screen and on this device)
  const clearChat = () => {
    const welcomeMessage = {
      id: "welcome",
      content: WELCOME_CONTENT,
      sender: "assistant" as const,
      timestamp: new Date(),
    };
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    setIsPlayingVoice(null);
    setMessages([welcomeMessage]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable (private mode); nothing persisted to remove
    }
  };

  const handleClearChat = () => {
    if (isLoading) return;
    if (messages.length <= 1 && messages[0]?.id === "welcome") return;
    if (window.confirm("Clear this conversation? It will be deleted from this device.")) clearChat();
  };

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Keep only the latest MAX_MESSAGES
      return newMessages.slice(-MAX_MESSAGES);
    });
    setIsLoading(true);

    try {
      // Get AI response
      const response = await handleMessage(content);

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: "assistant",
        timestamp: new Date(),
        metadata: response.metadata
      };
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        // Keep only the latest MAX_MESSAGES
        return newMessages.slice(-MAX_MESSAGES);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error. Please try again or contact us directly at 604-593-1550.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        // Keep only the latest MAX_MESSAGES
        return newMessages.slice(-MAX_MESSAGES);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = async (content: string): Promise<{
    content: string;
    metadata?: any;
  }> => {
    try {
      console.log("[ChatWidget] Sending message");
      setIsTyping(true);

      // Call the AI API endpoint with selected province and conversation history  
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: content,
          province: selectedProvince,
          messages: messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
          language,
          currentPage: pathname,
          pageContext: pageContext,
        }),
      });

      if (!response.ok) {
        console.error("[ChatWidget] Response not OK:", response.status);
        // The API returns a user-facing `reply` for rate limits (429) and over-long input (413).
        const errorData = await response.json().catch(() => null);
        if (errorData && typeof errorData.reply === "string") {
          setIsTyping(false);
          return { content: errorData.reply };
        }
        throw new Error("Failed to get response");
      }

      let fullContent = "";
      let metadata: any = {};

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        fullContent = data.reply || data.message || "I am here to help with your mortgage inquiry. Please feel free to reach our team at +1 (604) 359-5993.";
      } else if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }
      }

      setIsTyping(false);

        // Generate voice for assistant response if voice is enabled
        if (voiceEnabled && fullContent) {
          try {
            console.log("[Voice] Generating voice for response...");
            const voiceResponse = await voiceService.current.speak(fullContent);

            const audioUrl = URL.createObjectURL(voiceResponse.audioBlob);
            objectUrlsRef.current.push(audioUrl);

            metadata.voice = {
              language: voiceResponse.language,
              provider: voiceResponse.provider,
              switchedLanguage: voiceResponse.switchedLanguage,
              audioUrl
            };

            console.log('[Voice] Generated:', {
              language: voiceResponse.language,
              switched: voiceResponse.switchedLanguage,
              provider: voiceResponse.provider
            });
          } catch (voiceError) {
            console.warn('[Voice] Generation failed:', voiceError);
          }
        }

        return {
          content: fullContent || "I received your message but couldn't generate a proper response.",
          metadata
        };
      } catch (error) {
      console.error("Chat API error:", error);
      setIsTyping(false);
      // Fallback to a helpful error message
      return {
        content: "I apologize, but I'm having trouble connecting to the AI service. Please try again in a moment, or contact us directly at 604-593-1550 for immediate assistance."
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.message);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
    // Optionally auto-send the message
    if (transcript.trim()) {
      sendMessage(transcript.trim());
    }
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      // Check if API key is configured
      console.log('[Voice] Voice mode enabled. Checking API configuration...');
    }
  };

  // Play voice message
  const playVoiceMessage = (messageId: string, audioUrl: string) => {
    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });

    if (!audioRefs.current[messageId]) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingVoice(null);
      audioRefs.current[messageId] = audio;
    }

    const audio = audioRefs.current[messageId];
    if (isPlayingVoice === messageId) {
      audio.pause();
      setIsPlayingVoice(null);
    } else {
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlayingVoice(null));
      setIsPlayingVoice(messageId);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Kraft Mortgages AI chat assistant"
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[min(600px,calc(100dvh-7.5rem))] bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-700"
          >
            {/* Header */}
            <div className="relative bg-[#18212b] border-b border-white/15 p-4 text-white">
              <button type="button" aria-label="Close AI chat" onClick={() => setIsOpen(false)} className="absolute top-2 right-2 min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-white/10"><X size={18} /></button>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pr-8">
                <div>
                  <h3 className="font-semibold text-base leading-tight">Kraft AI assistant</h3>
                  <p className="text-xs text-gray-300">Mortgage guidance · 24/7</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Direct WhatsApp Handoff */}
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] bg-[#25D366] hover:bg-[#20ba59] text-gray-950 font-bold px-2.5 py-1 rounded-full transition-colors shadow-sm"
                    title={`Switch to WhatsApp (${WHATSAPP_PHONE_DISPLAY})`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Clear conversation (also removes the copy saved on this device) */}
                  <button
                    type="button"
                    onClick={handleClearChat}
                    disabled={isLoading}
                    className="min-w-11 min-h-11 flex items-center justify-center p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear chat"
                    aria-label="Clear chat history"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  {/* Voice Toggle */}
                  <button
                    onClick={() => setShowVoiceControls(!showVoiceControls)}
                    className={`min-w-11 min-h-11 flex items-center justify-center p-1.5 rounded-lg transition-colors ${showVoiceControls
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                      }`}
                    title={showVoiceControls ? 'Hide voice controls' : 'Show voice controls'}
                    aria-label={showVoiceControls ? 'Hide voice controls' : 'Show voice controls'}
                    aria-pressed={showVoiceControls}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Language Indicator */}
                  {voiceEnabled && (
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-xs">
                      <Languages className="w-3 h-3" />
                      <span>{voiceService.current.getCurrentLanguage().split('-')[0].toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Province Selector & Live Prime Benchmark */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 opacity-80" />
                  <span className="text-[11px] opacity-90 font-medium">Province:</span>
                  <div className="inline-flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md text-[11px] font-mono">
                    {(["BC", "AB", "ON"] as const).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setSelectedProvince(prov)}
                        aria-pressed={selectedProvince === prov}
                        aria-label={`Province ${prov}`}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${
                          selectedProvince === prov
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-white/80 hover:text-white"
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                {primeRate !== null && (
                  <div className="text-[11px] font-mono opacity-90 font-medium">
                    Prime: <span className="font-bold text-white">{primeRate.toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Controls Panel */}
            {showVoiceControls && (
              <CleanVoiceControls
                province={selectedProvince}
                onVoiceMessage={(text) => {
                  // Add user message from voice
                  const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    content: text,
                    sender: 'user',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, newMessage]);
                }}
                onAIResponse={(response) => {
                  // Add AI response message
                  const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    content: response,
                    sender: 'assistant',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, newMessage]);
                }}
              />
            )}

            {/* Messages */}
            <div
              ref={chatContainerRef}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/50"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === "user"
                      ? "bg-gold-500/20 text-gray-100 border border-gold-500/30"
                      : "bg-gray-700/50 text-gray-200 border border-gray-600/50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm whitespace-pre-wrap flex-1">{message.content}</div>

                      {/* Voice Controls for Assistant Messages */}
                      {message.sender === "assistant" && message.metadata?.voice?.audioUrl && (
                        <div className="flex items-center gap-1 ml-2">
                          {message.metadata.voice.switchedLanguage && (
                            <div className="flex items-center gap-1 bg-blue-500/20 px-1 py-0.5 rounded text-xs text-blue-300" title="Language switched">
                              <Globe className="w-3 h-3" />
                              {message.metadata.voice.language.split('-')[0].toUpperCase()}
                            </div>
                          )}
                          <button
                            onClick={() => playVoiceMessage(message.id, message.metadata?.voice?.audioUrl!)}
                            className={`p-1 rounded transition-colors ${isPlayingVoice === message.id
                              ? 'bg-gold-500/30 text-gold-300'
                              : 'bg-gray-600/50 text-gray-400 hover:bg-gray-500/50 hover:text-gray-300'
                              }`}
                            title={isPlayingVoice === message.id ? 'Stop' : 'Play voice'}
                            aria-label={isPlayingVoice === message.id ? 'Stop voice playback' : 'Play voice'}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {message.metadata?.toolResult && (
                      <div className="mt-3">
                        <ToolResults
                          toolName={message.metadata.toolResult.toolName}
                          result={message.metadata.toolResult.result}
                          displayType={message.metadata.toolResult.displayType}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {(isLoading || isTyping) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      {isTyping && (
                        <span className="text-xs text-gray-400 ml-2">AI is typing...</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-400 mb-2">Quick actions:</div>
                <div className="flex gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      aria-label={action.label}
                      title={action.label}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded text-xs text-gray-300 transition-colors border border-gray-600/50"
                    >
                      {action.icon}
                      <span className="hidden sm:inline">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Mobile Continuation Strip */}
            <div className="px-4 py-2.5 bg-emerald-950/60 border-t border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-current shrink-0" />
                <span className="text-xs text-emerald-200 font-medium">
                  Prefer WhatsApp? <strong>{WHATSAPP_PHONE_DISPLAY}</strong>
                </span>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] bg-[#25D366] hover:bg-[#20ba59] text-gray-950 font-bold px-3 py-1 rounded-full transition-colors shadow-md"
              >
                <span>Message Us ↗</span>
              </a>
            </div>

            {/* AI / privacy disclosure (provincial disclaimer text comes from lib/compliance/rules) */}
            <div className="px-4 pt-2 text-[10px] leading-snug text-gray-400 border-t border-gray-700">
              AI assistant: general information only, not financial advice or a mortgage approval. Rates are indicative, O.A.C.
              {complianceNotes[0] ? ` ${complianceNotes[0]}` : ""} Please don&apos;t share your SIN or banking details here. If you share contact
              details, our team may follow up about your inquiry.{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
                Privacy
              </a>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  aria-label="Type your message"
                  maxLength={MAX_INPUT_CHARS}
                  className="flex-1 min-w-0 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-gray-400"
                  disabled={isLoading}
                />
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-950 rounded-lg hover:from-gold-400 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
