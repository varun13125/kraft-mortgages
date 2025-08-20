// Speech Recognition Service for Real-time Voice Input
// Handles browser-based speech-to-text with multilingual support

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  language?: string;
}

interface RecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  maxAlternatives: number;
}

// Browser Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: any;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-CA';
  
  // Callbacks
  private onResult?: (result: SpeechRecognitionResult) => void;
  private onError?: (error: string) => void;
  private onEnd?: () => void;
  private onStart?: () => void;
  
  // Language mappings for speech recognition
  private languageCodes: Record<string, string> = {
    'en-CA': 'en-CA',
    'hi-IN': 'hi-IN',
    'pa-IN': 'pa-IN',
    'zh-CN': 'zh-CN',
    'es-ES': 'es-ES',
    'fr-CA': 'fr-CA',
    'en-US': 'en-US'
  };

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.language = this.currentLanguage;

    // Handle results
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.9;
      
      // Detect language from transcript
      const detectedLanguage = this.detectLanguageFromTranscript(transcript);
      
      // Auto-switch recognition language if needed
      if (detectedLanguage !== this.currentLanguage && result.isFinal) {
        this.switchLanguage(detectedLanguage);
      }

      if (this.onResult) {
        this.onResult({
          transcript,
          confidence,
          isFinal: result.isFinal,
          language: detectedLanguage
        });
      }
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (this.onError) {
        this.onError(event.error);
      }
      
      // Auto-restart on certain errors
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        setTimeout(() => {
          if (this.isListening) {
            this.restart();
          }
        }, 1000);
      }
    };

    // Handle end
    this.recognition.onend = () => {
      const wasListening = this.isListening;
      this.isListening = false;
      
      if (this.onEnd) {
        this.onEnd();
      }
      
      // Don't auto-restart - let the conversation manager handle it
    };

    // Handle start
    this.recognition.onstart = () => {
      this.isListening = true;
      
      if (this.onStart) {
        this.onStart();
      }
    };
  }

  // Start listening
  start(config?: Partial<RecognitionConfig>) {
    if (!this.recognition) {
      console.error('Speech Recognition not available');
      return;
    }

    // If already listening, stop first
    if (this.isListening) {
      console.log('Recognition already running, restarting...');
      this.restart();
      return;
    }

    if (config) {
      if (config.language) {
        this.currentLanguage = config.language;
        this.recognition.language = this.languageCodes[config.language] || config.language;
      }
      if (config.continuous !== undefined) {
        this.recognition.continuous = config.continuous;
      }
      if (config.interimResults !== undefined) {
        this.recognition.interimResults = config.interimResults;
      }
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error: any) {
      if (error.name === 'InvalidStateError') {
        // Already started, just update the flag
        this.isListening = true;
        console.log('Recognition was already started');
      } else {
        console.error('Failed to start recognition:', error);
      }
    }
  }

  // Stop listening
  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  // Restart recognition
  restart() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    setTimeout(() => {
      if (this.recognition) {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (error) {
          console.error('Failed to restart recognition:', error);
        }
      }
    }, 200);
  }

  // Switch language
  switchLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.language = this.languageCodes[language] || language;
      if (this.isListening) {
        this.restart();
      }
    }
  }

  // Detect language from transcript
  private detectLanguageFromTranscript(transcript: string): string {
    const patterns = {
      'hi-IN': /[\u0900-\u097F]|(main|hai|hoon|kya|kaise|aur)/gi,
      'pa-IN': /[\u0A00-\u0A7F]|(sat sri akal|ki|hai|tuhada)/gi,
      'zh-CN': /[\u4e00-\u9fff]/g,
      'es-ES': /(hola|gracias|por favor|cómo|qué)/gi,
      'fr-CA': /(bonjour|merci|comment|s'il vous plaît)/gi
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(transcript)) {
        return lang;
      }
    }

    return 'en-CA';
  }

  // Set callbacks
  setCallbacks(callbacks: {
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
    onStart?: () => void;
  }) {
    if (callbacks.onResult) this.onResult = callbacks.onResult;
    if (callbacks.onError) this.onError = callbacks.onError;
    if (callbacks.onEnd) this.onEnd = callbacks.onEnd;
    if (callbacks.onStart) this.onStart = callbacks.onStart;
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Check if supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           (window.SpeechRecognition || window.webkitSpeechRecognition) !== undefined;
  }
}