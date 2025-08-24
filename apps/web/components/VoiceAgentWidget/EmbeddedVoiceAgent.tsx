'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Headphones, X, ExternalLink, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmbeddedVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Load SalesCloser embed script when modal opens
  useEffect(() => {
    if (isOpen && !isScriptLoaded) {
      // Add custom styles for the widget
      const style = document.createElement('style');
      style.innerHTML = `
        .wshpnd-scloser-meeting-form {
          width: 100% !important;
          height: 100% !important;
          min-height: 450px !important;
        }
        .wshpnd-scloser-meeting-form iframe {
          width: 100% !important;
          height: 100% !important;
          min-height: 450px !important;
          border: none !important;
        }
        /* Fix for text visibility in form fields */
        .wshpnd-scloser-meeting-form input,
        .wshpnd-scloser-meeting-form textarea,
        .wshpnd-scloser-meeting-form select {
          color: #1f2937 !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
      `;
      document.head.appendChild(style);

      // Create the widget div
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'wshpnd-scloser-meeting-form';
      widgetDiv.setAttribute('data-wishpond-id', '6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3');
      widgetDiv.setAttribute('data-wishpond-domain', 'https://app.salescloser.ai');
      
      // Append to our container
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = ''; // Clear any existing content
        widgetContainerRef.current.appendChild(widgetDiv);
      }

      // Load the SalesCloser script
      const script = document.createElement('script');
      script.src = 'https://app.salescloser.ai/js/embed_demo_form.js';
      script.type = 'text/javascript';
      script.defer = true;
      
      script.onload = () => {
        setIsScriptLoaded(true);
        console.log('SalesCloser widget loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load SalesCloser widget');
      };
      
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        // Remove script when component unmounts or modal closes
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        setIsScriptLoaded(false);
      };
    }
  }, [isOpen, isScriptLoaded]);

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

              {/* Content Area - Embedded SalesCloser Widget */}
              <div className="flex-1 relative overflow-hidden">
                {!isScriptLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading AI Voice Agent...</p>
                      <p className="text-sm text-gray-500 mt-2">Please wait while we connect you</p>
                    </div>
                  </div>
                )}
                
                {/* SalesCloser Widget Container */}
                <div 
                  ref={widgetContainerRef}
                  className="w-full h-full bg-white"
                  style={{ minHeight: '450px' }}
                />
                
                {/* If widget doesn't load properly, show fallback */}
                {isScriptLoaded && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent p-3">
                    <p className="text-xs text-gray-500 text-center">
                      Having issues? Try refreshing or contact support.
                    </p>
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