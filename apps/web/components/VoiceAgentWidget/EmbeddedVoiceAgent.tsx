'use client';

import React, { useState, useRef } from 'react';
import { Phone, PhoneOff, Headphones, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmbeddedVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  // Use the hosted form URL from SalesCloser (better for iframe embedding)
  const salesCloserUrl = 'https://app.salescloser.ai/form/6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3';

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
                    {/* Toggle iframe mode */}
                    <button
                      onClick={() => setUseIframe(!useIframe)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      title={useIframe ? 'Switch to embed mode' : 'Switch to iframe mode'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {useIframe ? (
                  /* Iframe Mode - Guaranteed to stay embedded */
                  <iframe
                    src={salesCloserUrl}
                    className="w-full h-full border-0 bg-white"
                    title="SalesCloser Voice Agent"
                    allow="microphone; camera; autoplay; encrypted-media; fullscreen; geolocation"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-orientation-lock allow-pointer-lock allow-presentation"
                    loading="lazy"
                  />
                ) : (
                  /* Direct embed mode with fallback */
                  <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                    <Phone className="w-16 h-16 text-gold-500 mb-4" />
                    <h4 className="font-semibold text-lg mb-2">Voice Consultation</h4>
                    <p className="text-gray-600 mb-6 max-w-sm">
                      Start a professional voice consultation with our AI mortgage expert. Available in multiple languages.
                    </p>
                    
                    <div className="space-y-3 w-full max-w-sm">
                      <button
                        onClick={() => setUseIframe(true)}
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Start Voice Call
                      </button>
                      
                      <a
                        href={salesCloserUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        Open in New Tab
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="mt-6 text-xs text-gray-500">
                      <p>Languages: English • Hindi • Punjabi</p>
                      <p>Spanish • French • Chinese</p>
                    </div>
                  </div>
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