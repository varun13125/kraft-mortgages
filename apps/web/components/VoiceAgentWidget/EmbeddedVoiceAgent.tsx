'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Headphones, X, ExternalLink, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmbeddedVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [agentWindow, setAgentWindow] = useState<Window | null>(null);

  // SalesCloser URL - Since iframe is blocked, we'll use popup
  const widgetId = '6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3';
  const salesCloserUrl = `https://app.salescloser.ai/${widgetId}`;

  // Monitor popup window
  useEffect(() => {
    if (agentWindow) {
      const checkInterval = setInterval(() => {
        if (agentWindow.closed) {
          setIsAgentActive(false);
          setAgentWindow(null);
          clearInterval(checkInterval);
        }
      }, 1000);

      return () => clearInterval(checkInterval);
    }
  }, [agentWindow]);

  // Launch voice agent in popup
  const launchVoiceAgent = () => {
    // If window already exists, focus it
    if (agentWindow && !agentWindow.closed) {
      agentWindow.focus();
      return;
    }

    // Open in a centered popup window
    const width = 500;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=yes',
      'status=no',
      'toolbar=no',
      'menubar=no',
      'location=no'
    ].join(',');

    const popup = window.open(salesCloserUrl, 'salescloser_voice_agent', features);

    if (popup) {
      setAgentWindow(popup);
      setIsAgentActive(true);
      popup.focus();
    } else {
      // Popup blocked, open in new tab
      window.open(salesCloserUrl, '_blank');
    }
  };

  // Close the agent window
  const closeVoiceAgent = () => {
    if (agentWindow && !agentWindow.closed) {
      agentWindow.close();
    }
    setIsAgentActive(false);
    setAgentWindow(null);
  };

  return (
    <>
      {/* Floating Voice Consultation Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        title="Start AI Voice Consultation"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <PhoneOff className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Phone className="w-6 h-6" />
              {/* Pulse animation for attention */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip on hover */}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isOpen ? 'End Voice Consultation' : 'Start AI Voice Consultation'}
        </span>
      </motion.button>

      {/* Voice Agent Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Voice Agent Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-auto md:left-6 md:bottom-24 md:w-[400px] md:h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI Voice Consultation</h3>
                      <p className="text-sm opacity-90">Speak with our mortgage expert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area - Voice Agent Controls */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                {!isAgentActive ? (
                  <>
                    {/* Initial state - Ready to start */}
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                          <Mic className="w-12 h-12 text-white" />
                        </div>
                        <span className="absolute top-0 right-0 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        AI Voice Consultation
                      </h3>
                      
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Connect with our intelligent mortgage advisor for personalized guidance through voice conversation.
                      </p>

                      <button
                        onClick={launchVoiceAgent}
                        className="w-full max-w-xs mx-auto bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        Start Voice Consultation
                      </button>

                      <div className="mt-8 space-y-3 text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Agent Available 24/7</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-700 mb-2">🌐 Multilingual Support</p>
                          <p className="text-xs">English • Hindi • Punjabi • Spanish • French • Chinese</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Active state - Voice consultation in progress */}
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <Phone className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Voice Consultation Active
                      </h3>
                      
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Your AI mortgage advisor is ready in the popup window. The consultation will continue there.
                      </p>

                      <div className="space-y-3 w-full max-w-xs mx-auto">
                        <button
                          onClick={() => agentWindow?.focus()}
                          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Return to Consultation
                        </button>

                        <button
                          onClick={closeVoiceAgent}
                          className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-all"
                        >
                          End Consultation
                        </button>
                      </div>

                      <div className="mt-8 bg-blue-50 rounded-lg p-3 text-sm">
                        <p className="text-blue-700">
                          💡 <strong>Tip:</strong> Keep this window open to easily return to your consultation
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white border-t p-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Agent Available
                  </span>
                  <span>Powered by SalesCloser AI</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}