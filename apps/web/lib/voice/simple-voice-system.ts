// Simple, reliable voice system for Kraft Mortgages
// Speech-to-text + ElevenLabs text-to-speech

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceSystemCallbacks {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onError?: (error: string) => void;
}

export class SimpleVoiceSystem {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSupported: boolean = false;
  private callbacks: VoiceSystemCallbacks = {};

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-CA';

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result.transcript;
      const isFinal = result.isFinal;

      if (this.callbacks.onTranscript) {
        this.callbacks.onTranscript(transcript, isFinal);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStartListening) {
        this.callbacks.onStartListening();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onStopListening) {
        this.callbacks.onStopListening();
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(event.error);
      }
    };
  }

  // Set callbacks
  setCallbacks(callbacks: VoiceSystemCallbacks) {
    this.callbacks = callbacks;
  }

  // Start listening
  async startListening(): Promise<boolean> {
    if (!this.isSupported || !this.recognition) {
      console.error('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening');
      return true;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Toggle listening
  async toggleListening(): Promise<boolean> {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return await this.startListening();
    }
  }

  // Speak text using ElevenLabs
  async speak(text: string, language: string = 'en-CA'): Promise<boolean> {
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: language
        })
      });

      if (!response.ok) {
        console.error('Voice API error:', response.status);
        return false;
      }

      const audioBlob = await response.blob();
      
      // Play the audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(false);
        };
        audio.play();
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      return false;
    }
  }

  // Detect language from text
  detectLanguage(text: string): string {
    const patterns = {
      'hi-IN': /[\u0900-\u097F]|(main|hai|hoon|kya|kaise|aur)/gi,
      'pa-IN': /[\u0A00-\u0A7F]|(sat sri akal|ki|hai|tuhada)/gi,
      'zh-CN': /[\u4e00-\u9fff]/g,
      'es-ES': /(hola|gracias|por favor|cómo)/gi,
      'fr-CA': /(bonjour|merci|comment|s'il vous plaît)/gi
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en-CA';
  }

  // Check if supported
  getIsSupported(): boolean {
    return this.isSupported;
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Cleanup
  destroy() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.callbacks = {};
  }
}