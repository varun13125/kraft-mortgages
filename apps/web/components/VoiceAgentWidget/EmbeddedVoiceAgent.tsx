'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Headphones, X, ExternalLink, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Get voice agent configuration from environment variables
const WIDGET_ID = process.env.NEXT_PUBLIC_VOICE_AGENT_WIDGET_ID || '6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3';
const AGENT_DOMAIN = process.env.NEXT_PUBLIC_VOICE_AGENT_DOMAIN || 'https://app.voiceagent.kraftmortgages.com';
const SCRIPT_URL = process.env.NEXT_PUBLIC_VOICE_AGENT_SCRIPT_URL || 'https://app.voiceagent.kraftmortgages.com/js/embed_demo_form.js';

export function EmbeddedVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Load voice agent embed script when modal opens
  useEffect(() => {
    if (isOpen && !scriptRef.current) {
      setIsLoading(true);

      // Add custom styles for the widget if not already added
      if (!styleRef.current) {
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
        styleRef.current = style;
      }

      // Create the widget div
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'wshpnd-scloser-meeting-form';
      widgetDiv.setAttribute('data-wishpond-id', WIDGET_ID);
      widgetDiv.setAttribute('data-wishpond-domain', AGENT_DOMAIN);
      
      // Append to our container
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = ''; // Clear any existing content
        widgetContainerRef.current.appendChild(widgetDiv);
      }

      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
      if (existingScript) {
        setIsLoading(false);
        return;
      }

      // Load the voice agent script
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        setIsLoading(false);
        console.log('Voice agent widget script loaded');
      };
      
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load voice agent widget');
      };
      
      document.body.appendChild(script);
      scriptRef.current = script;
    }

    // Cleanup function
    return () => {
      if (!isOpen && scriptRef.current) {
        // Remove script and widget when modal closes
        if (scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
        scriptRef.current = null;
        
        // Clear the widget container
        if (widgetContainerRef.current) {
          widgetContainerRef.current.innerHTML = '';
        }
      }
    };
  }, [isOpen]);

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

              {/* Content Area - Embedded Voice Agent Widget */}
              <div className="flex-1 relative overflow-hidden bg-white">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading AI Voice Agent...</p>
                      <p className="text-sm text-gray-500 mt-2">Please wait while we connect you</p>
                    </div>
                  </div>
                )}
                
                {/* Voice Agent Widget Container */}
                <div 
                  ref={widgetContainerRef}
                  className="w-full h-full"
                  style={{ minHeight: '450px' }}
                />
                
                {/* Overlay to hide SalesCloser branding */}
                {!isLoading && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-white z-20" 
                    style={{ 
                      height: '45px',
                      borderTop: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Agent Available
                    </span>
                    <span>Powered by Kraft AI Voice Assistant</span>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}