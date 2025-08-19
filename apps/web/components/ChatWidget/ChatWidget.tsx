"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calculator, TrendingUp, DollarSign, Volume2, Languages } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { VoiceInput } from "./VoiceInput";
import { ToolResults } from "./ToolResults";
import { MultilingualVoiceService } from "@/lib/voice/multilingual-voice";

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
  };
}

interface QuickAction {
  label: string;
  message: string;
  icon: React.ReactNode;
}

const STORAGE_KEY = "kraft-chat-messages";
const MAX_MESSAGES = 50; // Increased from default to 50

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { province, language } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const voiceService = useRef(new MultilingualVoiceService());

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } else {
        // Initialize with welcome message if no saved messages
        const welcomeMessage = {
          id: "welcome",
          content: "Hi! I'm Alex, your mortgage advisor. I can help you with calculations, current rates, and answer any mortgage questions you have in BC, AB, and ON. What would you like to know?",
          sender: "assistant" as const,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      // Fallback to welcome message
      const welcomeMessage = {
        id: "welcome",
        content: "Hi! I'm Alex, your mortgage advisor. I can help you with calculations, current rates, and answer any mortgage questions you have in BC, AB, and ON. What would you like to know?",
        sender: "assistant" as const,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat messages:", error);
      }
    }
  }, [messages]);

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

  // Clear chat history
  const clearChat = () => {
    const welcomeMessage = {
      id: "welcome",
      content: "Hi! I'm Alex, your mortgage advisor. I can help you with calculations, current rates, and answer any mortgage questions you have in BC, AB, and ON. What would you like to know?",
      sender: "assistant" as const,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem(STORAGE_KEY);
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
      console.log("[ChatWidget] Sending message:", content);
      setIsTyping(true);
      
      // Call the AI API endpoint with streaming support  
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: content,
          province,
          language
        }),
      });

      if (!response.ok) {
        console.error("[ChatWidget] Response not OK:", response.status);
        throw new Error("Failed to get response");
      }
      
      // Get model info from headers
      const modelUsed = response.headers.get("X-Model-Used");
      const provider = response.headers.get("X-Provider");
      const isFree = response.headers.get("X-Is-Free");
      
      console.log("[ChatWidget] Got response, starting to stream...");
      console.log("[ChatWidget] Model:", modelUsed, "| Provider:", provider, "| Free:", isFree);

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let metadata: any = {};
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullContent += chunk;
        }
        
        setIsTyping(false);
        console.log("[ChatWidget] Received response:", fullContent.substring(0, 100) + "...");
        return {
          content: fullContent || "I received your message but couldn't generate a proper response.",
          metadata
        };
      }
      
      // Fallback to non-streaming
      const data = await response.json();
      setIsTyping(false);
      return {
        content: data.content,
        metadata: data.metadata
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
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-gold-400 hover:to-gold-500 transition-all z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Kraft Mortgages Assistant</h3>
                  <p className="text-sm opacity-90">Powered by AI • Available 24/7</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Voice Toggle */}
                  <button
                    onClick={toggleVoiceMode}
                    className={`p-2 rounded-lg transition-colors ${
                      voiceEnabled 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                    title={voiceEnabled ? 'Voice mode on' : 'Enable voice mode'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  
                  {/* Language Indicator */}
                  {voiceEnabled && (
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                      <Languages className="w-3 h-3" />
                      <span>{voiceService.current.getCurrentLanguage().split('-')[0].toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
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
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gold-500/20 text-gray-100 border border-gold-500/30"
                        : "bg-gray-700/50 text-gray-200 border border-gray-600/50"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
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
                      className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded text-xs text-gray-300 transition-colors border border-gray-600/50"
                    >
                      {action.icon}
                      <span className="hidden sm:inline">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-gray-400"
                  disabled={isLoading}
                />
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-400 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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