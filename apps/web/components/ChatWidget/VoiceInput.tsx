"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Browser doesn't support speech recognition, fall back to media recorder
    }
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Try to use Web Speech API first
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsRecording(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            onTranscript(transcript);
            setIsRecording(false);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError('Speech recognition failed. Please try again.');
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        recognition.start();
        
      } else {
        // Fallback to media recorder
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          setIsProcessing(true);
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // In a real app, you would send this to a speech-to-text API
          // For now, we'll just simulate it
          setTimeout(() => {
            onTranscript("Voice input received (speech-to-text API needed for transcription)");
            setIsProcessing(false);
            setIsRecording(false);
          }, 1000);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Stop Web Speech API if it's being used
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (disabled || isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`p-2 rounded-lg transition-all ${
          isRecording 
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        } ${(disabled || isProcessing) ? "opacity-50 cursor-not-allowed" : ""}`}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>
      
      {isRecording && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"
        />
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}