'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Headphones, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceAgentWidget.css';

// Get voice agent configuration from environment variables
const WIDGET_ID = process.env.NEXT_PUBLIC_VOICE_AGENT_WIDGET_ID || '6b40ce6f-71ba-47c0-bd48-a0f0ccaa55f3';
const AGENT_DOMAIN = process.env.NEXT_PUBLIC_VOICE_AGENT_DOMAIN || 'https://app.voiceagent.kraftmortgages.com';
const SCRIPT_URL = process.env.NEXT_PUBLIC_VOICE_AGENT_SCRIPT_URL || 'https://app.voiceagent.kraftmortgages.com/js/embed_demo_form.js';

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Load voice agent script when widget opens
  useEffect(() => {
    if (isOpen && !scriptLoaded) {
      setIsLoading(true);
      
      // Create and append the widget div if it doesn't exist
      if (!document.querySelector('.wshpnd-scloser-meeting-form')) {
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'wshpnd-scloser-meeting-form';
        widgetDiv.setAttribute('data-wishpond-id', WIDGET_ID);
        widgetDiv.setAttribute('data-wishpond-domain', AGENT_DOMAIN);
        // Try to force embedded mode
        widgetDiv.setAttribute('data-embed-mode', 'true');
        widgetDiv.setAttribute('data-target', '_self');
        widgetDiv.style.width = '100%';
        widgetDiv.style.height = '100%';
        
        if (widgetContainerRef.current) {
          widgetContainerRef.current.appendChild(widgetDiv);
        }
      }
      
      // Add global styles to fix text visibility and hide branding
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .wshpnd-scloser-meeting-form input,
        .wshpnd-scloser-meeting-form textarea,
        .wshpnd-scloser-meeting-form select,
        .wshpnd-scloser-meeting-form [contenteditable="true"] {
          color: #1f2937 !important;
          -webkit-text-fill-color: #1f2937 !important;
          opacity: 1 !important;
        }
        .wshpnd-scloser-meeting-form ::placeholder {
          color: #6b7280 !important;
          -webkit-text-fill-color: #6b7280 !important;
          opacity: 0.7 !important;
        }
        .wshpnd-scloser-meeting-form label {
          color: #374151 !important;
        }
      `;
      document.head.appendChild(styleEl);

      // Load the voice agent script
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.type = 'text/javascript';
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
        setIsLoading(false);
        console.log('Voice agent loaded');
        
        // Try to intercept form submissions and external links
        setTimeout(() => {
          const forms = document.querySelectorAll('.wshpnd-scloser-meeting-form form');
          const links = document.querySelectorAll('.wshpnd-scloser-meeting-form a');
          
          // Prevent forms from opening new windows
          forms.forEach(form => {
            form.setAttribute('target', '_self');
            form.addEventListener('submit', (e) => {
              console.log('Form submission intercepted');
              // You could handle the form data here instead of redirecting
            });
          });
          
          // Prevent links from opening new windows
          links.forEach(link => {
            if (link.getAttribute('href')?.includes(AGENT_DOMAIN.replace('https://', '').replace('http://', ''))) {
              link.setAttribute('target', '_self');
              link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('External navigation prevented');
                // You could show an iframe or handle this differently
              });
            }
          });
        }, 2000);
      };
      
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load voice agent');
      };
      
      document.body.appendChild(script);
      
      // Cleanup
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [isOpen, scriptLoaded]);

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

      {/* Voice Agent Modal/Panel */}
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
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Voice Agent Widget Container */}
              <div className="flex-1 bg-gray-50 p-4 relative overflow-hidden voice-agent-container">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading voice agent...</p>
                    </div>
                  </div>
                ) : (
                  <div ref={widgetContainerRef} className="h-full">
                    {/* Voice agent widget will be injected here */}
                    {!scriptLoaded && (
                      <div className="bg-white rounded-lg p-6 text-center">
                        <Phone className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                        <h4 className="font-semibold mb-2">Voice Consultation Ready</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Click the button below to start your voice consultation with our AI mortgage expert.
                        </p>
                        <p className="text-xs text-gray-500">
                          Available in English, Hindi, Punjabi, Spanish, French, and Chinese
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Overlay to hide SalesCloser branding */}
                {scriptLoaded && !isLoading && (
                  <div 
                    className="absolute bottom-0 left-4 right-4 bg-gray-50 z-20" 
                    style={{ 
                      height: '50px',
                      marginBottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTop: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <div className="flex items-center justify-between w-full px-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Agent Available
                      </span>
                      <span>Powered by Kraft AI Voice Assistant</span>
                    </div>
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