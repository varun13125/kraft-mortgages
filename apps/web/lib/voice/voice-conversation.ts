// Real-time Voice Conversation System
// Combines speech recognition, AI processing, and voice synthesis

import { SpeechRecognitionService } from './speech-recognition';
import { MultilingualVoiceService } from './multilingual-voice';

interface ConversationState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  currentLanguage: string;
  mode: 'push-to-talk' | 'always-on' | 'voice-activated';
  transcript: string;
  interimTranscript: string;
}

interface VoiceProvider {
  name: 'elevenlabs' | 'minimax';
  priority: number;
}

export class VoiceConversationManager {
  private recognition: SpeechRecognitionService;
  private voiceService: MultilingualVoiceService;
  private state: ConversationState;
  private audioContext?: AudioContext;
  private currentAudio?: HTMLAudioElement;
  
  // Callbacks
  private onStateChange?: (state: ConversationState) => void;
  private onTranscript?: (transcript: string, isFinal: boolean) => void;
  private onAIResponse?: (response: string) => void;
  
  // Voice providers with fallback
  private voiceProviders: VoiceProvider[] = [
    { name: 'minimax', priority: 1 },  // Try MiniMax first for quality
    { name: 'elevenlabs', priority: 2 } // Fallback to ElevenLabs
  ];
  
  // Silence detection for voice activity
  private silenceTimeout?: NodeJS.Timeout;
  private silenceThreshold = 2000; // 2 seconds of silence

  constructor() {
    this.recognition = new SpeechRecognitionService();
    this.voiceService = new MultilingualVoiceService();
    
    this.state = {
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      currentLanguage: 'en-CA',
      mode: 'push-to-talk',
      transcript: '',
      interimTranscript: ''
    };

    this.setupRecognition();
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private setupRecognition() {
    this.recognition.setCallbacks({
      onResult: (result) => {
        if (result.isFinal) {
          // Final transcript ready
          this.state.transcript = result.transcript;
          this.state.interimTranscript = '';
          
          // Update language if detected
          if (result.language) {
            this.state.currentLanguage = result.language;
          }
          
          // Notify transcript callback
          if (this.onTranscript) {
            this.onTranscript(result.transcript, true);
          }
          
          // Process with AI if in conversation mode
          if (this.state.mode === 'always-on' || this.state.mode === 'voice-activated') {
            this.processWithAI(result.transcript);
          }
          
          // Reset silence timer
          this.resetSilenceTimer();
        } else {
          // Interim results for real-time feedback
          this.state.interimTranscript = result.transcript;
          
          if (this.onTranscript) {
            this.onTranscript(result.transcript, false);
          }
        }
        
        this.updateState();
      },
      
      onError: (error) => {
        console.error('Recognition error:', error);
        this.state.isListening = false;
        this.updateState();
      },
      
      onEnd: () => {
        this.state.isListening = false;
        this.updateState();
        
        // Auto-restart in always-on mode
        if (this.state.mode === 'always-on' && !this.state.isSpeaking) {
          setTimeout(() => this.startListening(), 500);
        }
      },
      
      onStart: () => {
        this.state.isListening = true;
        this.updateState();
      }
    });
  }

  // Start listening for voice input
  async startListening() {
    if (this.state.isSpeaking) {
      console.log('Cannot listen while speaking');
      return;
    }

    // Request microphone permission if needed
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return;
    }

    this.recognition.start({
      continuous: this.state.mode !== 'push-to-talk',
      interimResults: true,
      language: this.state.currentLanguage
    });
  }

  // Stop listening
  stopListening() {
    this.recognition.stop();
    this.clearSilenceTimer();
  }

  // Toggle listening (for push-to-talk)
  toggleListening() {
    if (this.state.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  // Process transcript with AI
  private async processWithAI(transcript: string) {
    if (!transcript.trim()) return;
    
    this.state.isProcessing = true;
    this.updateState();

    try {
      // Send to AI for processing
      const response = await this.sendToAI(transcript);
      
      if (this.onAIResponse) {
        this.onAIResponse(response);
      }
      
      // Speak the response
      await this.speak(response);
    } catch (error) {
      console.error('AI processing error:', error);
    } finally {
      this.state.isProcessing = false;
      this.updateState();
    }
  }

  // Send transcript to AI
  private async sendToAI(transcript: string): Promise<string> {
    // This will be connected to your existing chat API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: transcript,
        language: this.state.currentLanguage,
        conversationId: 'voice-session'
      })
    });

    const data = await response.json();
    return data.message || 'I understand. How else can I help you?';
  }

  // Speak response with voice synthesis
  async speak(text: string, forceProvider?: 'elevenlabs' | 'minimax') {
    this.state.isSpeaking = true;
    this.updateState();
    
    // Stop listening while speaking
    if (this.state.isListening) {
      this.stopListening();
    }

    try {
      // Try MiniMax first if available
      let audioBlob: Blob | null = null;
      
      if (!forceProvider || forceProvider === 'minimax') {
        audioBlob = await this.speakWithMiniMax(text).catch(() => null);
      }
      
      // Fallback to ElevenLabs
      if (!audioBlob) {
        const response = await this.voiceService.speak(text, this.state.currentLanguage);
        audioBlob = response.audioBlob;
      }

      // Play audio
      await this.playAudio(audioBlob);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      this.state.isSpeaking = false;
      this.updateState();
      
      // Resume listening in always-on mode
      if (this.state.mode === 'always-on') {
        setTimeout(() => this.startListening(), 500);
      }
    }
  }

  // Speak with MiniMax (advanced voice)
  private async speakWithMiniMax(text: string): Promise<Blob> {
    const response = await fetch('/api/voice/minimax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language: this.state.currentLanguage,
        emotion: 'friendly',
        speed: 1.0
      })
    });

    if (!response.ok) {
      throw new Error('MiniMax synthesis failed');
    }

    return await response.blob();
  }

  // Play audio blob
  private async playAudio(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(blob);
      
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      }
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      this.currentAudio.onerror = reject;
      
      this.currentAudio.play().catch(reject);
    });
  }

  // Set conversation mode
  setMode(mode: 'push-to-talk' | 'always-on' | 'voice-activated') {
    this.state.mode = mode;
    
    // Handle mode changes
    if (mode === 'always-on') {
      this.startListening();
    } else if (mode === 'push-to-talk') {
      this.stopListening();
    }
    
    this.updateState();
  }

  // Switch language
  switchLanguage(language: string) {
    this.state.currentLanguage = language;
    this.recognition.switchLanguage(language);
    this.voiceService.setLanguage(language);
    this.updateState();
  }

  // Silence detection timer
  private resetSilenceTimer() {
    this.clearSilenceTimer();
    
    if (this.state.mode === 'voice-activated') {
      this.silenceTimeout = setTimeout(() => {
        if (this.state.transcript) {
          this.processWithAI(this.state.transcript);
          this.state.transcript = '';
        }
      }, this.silenceThreshold);
    }
  }

  private clearSilenceTimer() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = undefined;
    }
  }

  // Update state and notify
  private updateState() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  // Set callbacks
  setCallbacks(callbacks: {
    onStateChange?: (state: ConversationState) => void;
    onTranscript?: (transcript: string, isFinal: boolean) => void;
    onAIResponse?: (response: string) => void;
  }) {
    if (callbacks.onStateChange) this.onStateChange = callbacks.onStateChange;
    if (callbacks.onTranscript) this.onTranscript = callbacks.onTranscript;
    if (callbacks.onAIResponse) this.onAIResponse = callbacks.onAIResponse;
  }

  // Get current state
  getState(): ConversationState {
    return { ...this.state };
  }

  // Check if supported
  isSupported(): boolean {
    return this.recognition.isSupported();
  }

  // Cleanup
  destroy() {
    this.stopListening();
    this.clearSilenceTimer();
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}