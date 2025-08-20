'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Settings } from 'lucide-react';
import { VoiceConversationManager } from '@/lib/voice/voice-conversation';

interface VoiceControlsProps {
  onTranscript?: (text: string) => void;
  onAIResponse?: (response: string) => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  onTranscript, 
  onAIResponse 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'push-to-talk' | 'always-on' | 'voice-activated'>('push-to-talk');
  const [currentLanguage, setCurrentLanguage] = useState('en-CA');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const conversationManager = useRef<VoiceConversationManager | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Initialize voice conversation manager
    if (typeof window !== 'undefined') {
      conversationManager.current = new VoiceConversationManager();
      
      // Check if supported
      if (!conversationManager.current.isSupported()) {
        setIsSupported(false);
        return;
      }

      // Set up callbacks
      conversationManager.current.setCallbacks({
        onStateChange: (state) => {
          setIsListening(state.isListening);
          setIsSpeaking(state.isSpeaking);
          setIsProcessing(state.isProcessing);
          setCurrentLanguage(state.currentLanguage);
          setTranscript(state.transcript);
          setInterimTranscript(state.interimTranscript);
        },
        onTranscript: (text, isFinal) => {
          if (isFinal && onTranscript) {
            onTranscript(text);
          }
        },
        onAIResponse: (response) => {
          if (onAIResponse) {
            onAIResponse(response);
          }
        }
      });
    }

    return () => {
      if (conversationManager.current) {
        conversationManager.current.destroy();
      }
    };
  }, [onTranscript, onAIResponse]);

  const toggleConversation = () => {
    if (!conversationManager.current) return;
    
    if (isActive) {
      // Stop conversation
      conversationManager.current.stopListening();
      setIsActive(false);
    } else {
      // Start conversation
      setIsActive(true);
      if (mode === 'push-to-talk') {
        // Will be controlled by mic button
      } else {
        conversationManager.current.startListening();
      }
    }
  };

  const handleMicPress = (event: React.MouseEvent | React.TouchEvent) => {
    if (!conversationManager.current || !isActive) return;
    
    // Prevent double-triggering from touch and mouse events
    event.preventDefault();
    
    if (mode === 'push-to-talk') {
      if (event.type === 'mousedown' || event.type === 'touchstart') {
        conversationManager.current.startListening();
      } else if (event.type === 'mouseup' || event.type === 'touchend') {
        conversationManager.current.stopListening();
      }
    }
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    if (conversationManager.current) {
      conversationManager.current.setMode(newMode);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    if (conversationManager.current) {
      conversationManager.current.switchLanguage(lang);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          Voice conversation is not supported in your browser. 
          Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Voice Controls */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        {/* Conversation Toggle */}
        <button
          onClick={toggleConversation}
          className={`p-3 rounded-full transition-all ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          title={isActive ? 'End conversation' : 'Start conversation'}
        >
          {isActive ? <PhoneOff size={24} /> : <Phone size={24} />}
        </button>

        {/* Mic Control (for push-to-talk) */}
        {isActive && mode === 'push-to-talk' && (
          <button
            onMouseDown={handleMicPress}
            onMouseUp={handleMicPress}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicPress}
            className={`p-3 rounded-full transition-all ${
              isListening 
                ? 'bg-blue-500 text-white animate-pulse' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="Hold to speak"
          >
            {isListening ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
        )}

        {/* Status Indicators */}
        <div className="flex-1 flex items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Listening...</span>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-blue-500 animate-pulse" />
              <span className="text-sm text-gray-600">Speaking...</span>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>

        {/* Language Display */}
        <div className="px-3 py-1 bg-blue-50 rounded-full">
          <span className="text-sm font-medium text-blue-700">
            {currentLanguage.split('-')[0].toUpperCase()}
          </span>
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Live Transcript */}
      {isActive && (interimTranscript || transcript) && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {interimTranscript || transcript}
            {interimTranscript && <span className="animate-pulse">...</span>}
          </p>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full mt-2 right-0 w-80 p-4 bg-white rounded-lg shadow-lg z-50">
          <h3 className="font-semibold mb-3">Voice Settings</h3>
          
          {/* Mode Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Conversation Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="push-to-talk"
                  checked={mode === 'push-to-talk'}
                  onChange={(e) => handleModeChange(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">Push to Talk</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="voice-activated"
                  checked={mode === 'voice-activated'}
                  onChange={(e) => handleModeChange(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">Voice Activated</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="always-on"
                  checked={mode === 'always-on'}
                  onChange={(e) => handleModeChange(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">Always Listening</span>
              </label>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Primary Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="en-CA">English (Canada)</option>
              <option value="hi-IN">हिंदी (Hindi)</option>
              <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="zh-CN">中文 (Chinese)</option>
              <option value="es-ES">Español (Spanish)</option>
              <option value="fr-CA">Français (French)</option>
            </select>
          </div>

          {/* Auto Language Detection */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="mr-2"
              />
              <span className="text-sm">Auto-detect language</span>
            </label>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};