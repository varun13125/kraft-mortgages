'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';
import { SimpleVoiceSystem } from '@/lib/voice/simple-voice-system';

interface CleanVoiceControlsProps {
  onVoiceMessage?: (text: string) => void;
  onAIResponse?: (response: string) => void;
  province?: string;
}

export const CleanVoiceControls: React.FC<CleanVoiceControlsProps> = ({ 
  onVoiceMessage,
  onAIResponse,
  province = 'BC'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en-CA');
  
  const voiceSystem = useRef<SimpleVoiceSystem | null>(null);
  // Parent passes new inline callbacks on every render. Keep the latest ones in refs so the
  // speech-recognition instance is created once per mount (previously it was destroyed and
  // re-created on every parent re-render, cutting off listening mid-sentence).
  const onVoiceMessageRef = useRef(onVoiceMessage);
  const onAIResponseRef = useRef(onAIResponse);
  const provinceRef = useRef(province);
  onVoiceMessageRef.current = onVoiceMessage;
  onAIResponseRef.current = onAIResponse;
  provinceRef.current = province;

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
        
        if (isFinal && text && text.trim()) {
          // Detect language
          const detectedLang = voiceSystem.current?.detectLanguage(text) || 'en-CA';
          setCurrentLanguage(detectedLang);
          
          // Send to chat
          onVoiceMessageRef.current?.(text);
          
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processWithAI = async (text: string, language: string) => {
    // Validate input
    if (!text || !text.trim()) {
      console.error('Cannot process empty text');
      return;
    }

    try {
      // Send to AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text.trim(),
          language: language.split('-')[0],
          province: provinceRef.current
        })
      });

      // /api/chat responds with JSON ({ reply, message, ... }); it previously got spoken and
      // displayed as raw JSON because the body was read with response.text().
      const data = await response.json().catch(() => null);
      const aiResponse: string | undefined =
        data && typeof data.reply === 'string' ? data.reply : data && typeof data.message === 'string' ? data.message : undefined;

      if (!aiResponse) {
        throw new Error(`AI API error: ${response.status}`);
      }

      onAIResponseRef.current?.(aiResponse);

      // Speak the response
      setIsSpeaking(true);
      const success = await voiceSystem.current?.speak(aiResponse, language);
      setIsSpeaking(false);
      
      if (!success) {
        console.error('Failed to speak AI response');
      }
    } catch (error) {
      console.error('AI processing error:', error);
      
      // Provide fallback response
      const fallbackResponse = "I apologize, but I'm having trouble processing that right now. Could you please try again or contact us directly at 604-593-1550?";
      
      onAIResponseRef.current?.(fallbackResponse);
      
      // Try to speak the fallback
      try {
        setIsSpeaking(true);
        await voiceSystem.current?.speak(fallbackResponse, language);
      } catch (speakError) {
        console.error('Failed to speak fallback response:', speakError);
      } finally {
        setIsSpeaking(false);
      }
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
          aria-label={isSpeaking ? 'Assistant is speaking' : isListening ? 'Stop listening' : 'Start voice conversation'}
          aria-pressed={isListening}
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
              <span className="text-sm text-white">Assistant speaking...</span>
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
          <span className="italic">&quot;{transcript}&quot;</span>
        </div>
      )}
    </div>
  );
};