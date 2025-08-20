'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';
import { SimpleVoiceSystem } from '@/lib/voice/simple-voice-system';

interface CleanVoiceControlsProps {
  onVoiceMessage?: (text: string) => void;
  onAIResponse?: (response: string) => void;
}

export const CleanVoiceControls: React.FC<CleanVoiceControlsProps> = ({ 
  onVoiceMessage,
  onAIResponse 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en-CA');
  
  const voiceSystem = useRef<SimpleVoiceSystem | null>(null);

  useEffect(() => {
    // Initialize voice system
    voiceSystem.current = new SimpleVoiceSystem();
    
    if (!voiceSystem.current.getIsSupported()) {
      setIsSupported(false);
      return;
    }

    // Set up callbacks
    voiceSystem.current.setCallbacks({
      onTranscript: (text, isFinal) => {
        setTranscript(text);
        
        if (isFinal) {
          // Detect language
          const detectedLang = voiceSystem.current?.detectLanguage(text) || 'en-CA';
          setCurrentLanguage(detectedLang);
          
          // Send to chat
          if (onVoiceMessage) {
            onVoiceMessage(text);
          }
          
          // Process with AI
          processWithAI(text, detectedLang);
          setTranscript('');
        }
      },
      onStartListening: () => setIsListening(true),
      onStopListening: () => setIsListening(false),
      onError: (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      }
    });

    return () => {
      if (voiceSystem.current) {
        voiceSystem.current.destroy();
      }
    };
  }, [onVoiceMessage]);

  const processWithAI = async (text: string, language: string) => {
    try {
      // Send to AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text,
          language: language.split('-')[0],
          province: 'BC'
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const aiResponse = await response.text();
      
      if (onAIResponse) {
        onAIResponse(aiResponse);
      }

      // Speak the response
      setIsSpeaking(true);
      const success = await voiceSystem.current?.speak(aiResponse, language);
      setIsSpeaking(false);
      
      if (!success) {
        console.error('Failed to speak AI response');
      }
    } catch (error) {
      console.error('AI processing error:', error);
      setIsSpeaking(false);
    }
  };

  const toggleListening = async () => {
    if (!voiceSystem.current) return;
    
    if (isSpeaking) {
      console.log('Cannot listen while speaking');
      return;
    }

    await voiceSystem.current.toggleListening();
  };

  if (!isSupported) {
    return (
      <div className="p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          Voice features require Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-700 bg-gray-800/50 p-3">
      <div className="flex items-center gap-3">
        {/* Mic Button */}
        <button
          onClick={toggleListening}
          disabled={isSpeaking}
          className={`p-3 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : isSpeaking
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={
            isSpeaking 
              ? 'AI is speaking...' 
              : isListening 
              ? 'Stop listening' 
              : 'Start voice input'
          }
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Status */}
        <div className="flex-1">
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-white">Listening...</span>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-blue-400 animate-pulse" />
              <span className="text-sm text-white">Alexa speaking...</span>
            </div>
          )}
          
          {!isListening && !isSpeaking && (
            <span className="text-sm text-gray-400">Click mic to start voice conversation</span>
          )}
        </div>

        {/* Language Indicator */}
        {currentLanguage !== 'en-CA' && (
          <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded text-xs text-blue-300">
            <Languages size={12} />
            <span>{currentLanguage.split('-')[0].toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="mt-2 p-2 bg-gray-700/50 rounded text-sm text-gray-300">
          <span className="italic">"{transcript}"</span>
        </div>
      )}
    </div>
  );
};