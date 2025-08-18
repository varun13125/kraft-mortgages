"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  metadata?: {
    modelUsed?: string;
    cost?: number;
    isFree?: boolean;
  };
}

interface QuickAction {
  label: string;
  message: string;
  icon: React.ReactNode;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { province, language } = useAppStore();

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: "Hi! I'm Alex, your mortgage advisor. I can help you with calculations, current rates, and answer any mortgage questions you have in BC, AB, and ON. What would you like to know?",
        sender: "assistant",
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

  const quickActions: QuickAction[] = [
    {
      label: "Calculate Affordability",
      message: "I want to calculate how much home I can afford",
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      label: "Current Rates",
      message: "What are the current mortgage rates?",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: "Payment Calculator",
      message: "Help me calculate monthly payments",
      icon: <Calculator className="w-4 h-4" />
    }
  ];

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if message is asking for a specific calculation
      const response = await handleMessage(content);
      
      const assistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        content: response.content,
        sender: "assistant",
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        content: "I apologize, but I'm having trouble responding right now. Please contact us directly at 604-593-1550 for immediate assistance.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = async (content: string): Promise<{
    content: string;
    metadata?: any;
  }> => {
    const lowerContent = content.toLowerCase();

    // Handle tool-related requests
    if (lowerContent.includes("afford") || lowerContent.includes("qualify")) {
      return {
        content: "I can help you calculate your affordability! To give you an accurate assessment, I'll need some information:\n\n• Annual household income\n• Monthly debt payments\n• Down payment amount\n• Current interest rate (I can also look up current rates)\n\nWould you like me to use some example numbers to show you how the calculation works, or do you have specific amounts in mind?",
        metadata: { suggestedTool: "affordability" }
      };
    }

    if (lowerContent.includes("rate") || lowerContent.includes("interest")) {
      return {
        content: `I can help you with current mortgage rates! Here's what I can do:\n\n• Show current best rates in ${province}\n• Compare payment amounts across different rates\n• Explain rate trends\n• Set up rate alerts\n\nCurrent rates vary by term and lender. Would you like me to look up the latest rates for a specific term (like 5-year fixed), or would you prefer a general overview of what's available?`,
        metadata: { suggestedTool: "rates" }
      };
    }

    if (lowerContent.includes("payment") || lowerContent.includes("calculate payment")) {
      return {
        content: "I can calculate your mortgage payments! For an accurate calculation, I'll need:\n\n• Loan amount (purchase price minus down payment)\n• Interest rate\n• Amortization period (usually 25 or 30 years)\n\nI can also show you how much you could save with bi-weekly payments versus monthly payments. Do you have these numbers, or would you like me to use example amounts?",
        metadata: { suggestedTool: "payment" }
      };
    }

    if (lowerContent.includes("investment") || lowerContent.includes("rental")) {
      return {
        content: "Great! I can help analyze investment properties. For a complete cash flow analysis, I'll need:\n\n• Property purchase price\n• Down payment amount\n• Expected monthly rent\n• Estimated monthly expenses\n• Interest rate\n\nI'll calculate the cash flow, cap rate, and debt service coverage ratio to help you evaluate the investment. Have you found a specific property, or are you exploring different scenarios?",
        metadata: { suggestedTool: "investment" }
      };
    }

    // Handle general questions
    if (lowerContent.includes("hello") || lowerContent.includes("hi")) {
      return {
        content: `Hello! Welcome to Kraft Mortgages. I'm here to help with all your mortgage needs in ${province}. I can assist with:\n\n• Mortgage calculations and affordability\n• Current rates and comparisons\n• Investment property analysis\n• First-time buyer guidance\n• Refinancing options\n\nWhat would you like to explore today?`
      };
    }

    if (lowerContent.includes("first time") || lowerContent.includes("first home")) {
      return {
        content: `Congratulations on considering your first home purchase! As a first-time buyer in ${province}, you have several advantages:\n\n🏡 **Available Programs:**\n• First-Time Home Buyer Incentive\n• Provincial programs (varies by province)\n• RRSP Home Buyers' Plan\n\n💰 **Down Payment:**\n• As low as 5% for homes under $500k\n• CMHC insurance required under 20% down\n\n📊 **Next Steps:**\n• Calculate your affordability\n• Get pre-approved\n• Find a realtor\n• Start shopping!\n\nWould you like me to calculate your affordability or explain any of these programs in detail?`
      };
    }

    // Default response
    return {
      content: "Thanks for your question! I'm here to help with mortgage-related questions including calculations, rates, and guidance. Some things I can help with:\n\n• Mortgage affordability calculations\n• Current rate comparisons\n• Payment calculations\n• Investment property analysis\n• First-time buyer guidance\n\nCould you tell me more specifically what you'd like help with? Or feel free to contact us directly at 604-593-1550 to speak with our team!"
    };
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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl flex flex-col z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                  <span className="text-sm font-bold text-gold-400">Alex</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">Mortgage Advisor</h3>
                  <p className="text-xs text-gray-400">Kraft Mortgages • {province}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-gold-500/20 text-gray-100 border border-gold-500/30"
                        : "bg-gray-700/50 text-gray-200 border border-gray-600/50"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.metadata?.modelUsed && (
                      <div className="text-xs text-gray-400 mt-1">
                        {message.metadata.isFree ? "💰 Free" : "⭐ Premium"} • {message.metadata.modelUsed}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
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

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about mortgages..."
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-gold-500/20 border border-gold-500/30 rounded-lg text-gold-400 hover:bg-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • For information only
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}