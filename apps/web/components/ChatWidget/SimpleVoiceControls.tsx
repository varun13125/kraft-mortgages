'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Phone, PhoneOff } from 'lucide-react';

interface SimpleVoiceControlsProps {
  onVoiceMessage?: (text: string) => void;
}

export const SimpleVoiceControls: React.FC<SimpleVoiceControlsProps> = ({ 
  onVoiceMessage 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      // Initialize speech recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-CA';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result.transcript;
        
        setTranscript(transcriptText);
        
        if (result.isFinal && onVoiceMessage) {
          onVoiceMessage(transcriptText);
          setTranscript('');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceMessage]);

  const startListening = async () => {
    if (!recognitionRef.current || isListening) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone permission denied:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="p-2 text-xs text-gray-400">
        Voice not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>
      
      {transcript && (
        <div className="flex-1 text-xs text-gray-600 italic">
          "{transcript}"
        </div>
      )}
      
      {isListening && (
        <div className="text-xs text-red-500">
          Listening...
        </div>
      )}
    </div>
  );
};