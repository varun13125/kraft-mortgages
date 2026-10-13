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
  const [isProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  // Stop any active recognition session when the component unmounts (e.g. chat closed).
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  // Auto-hide error bubbles.
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const startRecording = async () => {
    setError(null);

    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      // Previously this path recorded audio and then sent a fake placeholder transcript to the
      // AI as if the user had said it. There is no server-side speech-to-text endpoint, so say so.
      setError("Voice input isn't supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-CA";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");

        const last = event.results[event.results.length - 1];
        if (last?.isFinal) {
          onTranscriptRef.current(transcript);
          setIsRecording(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(
          event.error === "not-allowed" || event.error === "service-not-allowed"
            ? "Microphone access was blocked. Please check your browser permissions."
            : "Speech recognition failed. Please try again."
        );
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (recognitionRef.current === recognition) recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setError("Could not access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    // Actually stop the recognizer (previously only the UI state was reset while the
    // browser kept listening).
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsRecording(false);
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
        type="button"
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
        aria-label={isRecording ? "Stop voice input" : "Start voice input"}
        aria-pressed={isRecording}
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
          role="alert"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 right-0 w-56 bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
