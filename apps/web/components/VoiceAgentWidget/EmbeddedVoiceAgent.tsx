'use client';

import React, { useState, useRef } from 'react';
import { Phone, PhoneOff, Headphones, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmbeddedVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // SalesCloser URLs - Try multiple formats to find the working one
  const widgetId = '6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3';
  
  // Array of possible URL formats to try
  const possibleUrls = [
    `https://app.salescloser.ai/public/book/${widgetId}`, // Public booking URL
    `https://app.salescloser.ai/embed/${widgetId}`, // Embed format
    `https://app.salescloser.ai/widget/${widgetId}`, // Widget format
    `https://app.salescloser.ai/share/${widgetId}`, // Share format
    `https://app.salescloser.ai/${widgetId}`, // Direct ID format
    `https://app.salescloser.ai/demo/${widgetId}`, // Demo format
  ];

  const salesCloserUrl = possibleUrls[currentUrlIndex];

  // Handle iframe load errors - try next URL
  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    
    // Try to detect if iframe loaded but is blocked
    setTimeout(() => {
      if (iframeRef.current) {
        try {
          // This will throw if cross-origin
          const doc = iframeRef.current.contentDocument;
          if (!doc || !doc.body || doc.body.innerHTML === '') {
            tryNextUrl();
          }
        } catch (e) {
          // Cross-origin, but that's expected - iframe is likely working
          console.log(`SalesCloser iframe loaded with URL format #${currentUrlIndex + 1}: ${salesCloserUrl}`);
          setIframeError(false);
        }
      }
    }, 1000);
  };

  const tryNextUrl = () => {
    if (currentUrlIndex < possibleUrls.length - 1) {
      console.log(`Trying next URL format: ${possibleUrls[currentUrlIndex + 1]}`);
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsIframeLoaded(false);
      setIframeError(false);
    } else {
      console.log('All URL formats attempted, showing fallback');
      setIframeError(true);
    }
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

              {/* Content Area - Embedded iframe */}
              <div className="flex-1 relative bg-gray-50">
                {!isIframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading AI Voice Agent...</p>
                      <p className="text-sm text-gray-500 mt-2">Trying connection method {currentUrlIndex + 1} of {possibleUrls.length}</p>
                      <p className="text-xs text-gray-400 mt-1">Please wait while we connect you</p>
                    </div>
                  </div>
                )}
                
                {/* Embedded iframe */}
                <iframe
                  key={currentUrlIndex} // Force re-render when URL changes
                  ref={iframeRef}
                  src={salesCloserUrl}
                  className="w-full h-full border-0"
                  title="AI Voice Consultation"
                  allow="microphone *; camera *; autoplay *; fullscreen *"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-presentation"
                  onLoad={handleIframeLoad}
                  onError={tryNextUrl}
                  style={{
                    minHeight: '450px',
                    backgroundColor: 'white'
                  }}
                />
                
                {/* Error or fallback message */}
                {(iframeError || isIframeLoaded) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-3">
                    <div className="text-center">
                      {iframeError ? (
                        <div>
                          <p className="text-sm text-red-600 font-semibold mb-2">
                            Unable to load embedded agent
                          </p>
                          <a 
                            href={salesCloserUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                          >
                            Open Voice Agent
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Having issues? 
                          <a 
                            href={salesCloserUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-gold-600 hover:text-gold-700 font-semibold"
                          >
                            Open in new tab
                          </a>
                        </p>
                      )}
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