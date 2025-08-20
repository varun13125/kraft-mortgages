// Conversation-Aware Voice Service
// Handles language switching mid-conversation with context awareness

import { ElevenLabsSpeechService } from './elevenlabs-speech';
import { LanguageDetectionService, type LanguageInfo } from './language-detection';

interface ConversationContext {
  previousLanguage?: string;
  languageHistory: string[];
  userPreferences: {
    primaryLanguage?: string;
    fallbackLanguage: string;
    preferredProvider: 'elevenlabs' | 'azure' | 'google' | 'auto';
  };
  conversationId: string;
}

interface VoiceResponse {
  audioBlob: Blob;
  language: string;
  provider: string;
  switchedLanguage: boolean;
  confidence: number;
}

export class ConversationVoiceService {
  private elevenLabsService: ElevenLabsSpeechService;
  private languageDetection: LanguageDetectionService;
  
  private conversationContexts: Map<string, ConversationContext> = new Map();

  constructor() {
    this.elevenLabsService = new ElevenLabsSpeechService();
    this.languageDetection = new LanguageDetectionService();
  }

  // Initialize or get conversation context
  getConversationContext(conversationId: string): ConversationContext {
    if (!this.conversationContexts.has(conversationId)) {
      this.conversationContexts.set(conversationId, {
        languageHistory: [],
        userPreferences: {
          fallbackLanguage: 'en-CA',
          preferredProvider: 'elevenlabs' // Based on quality testing
        },
        conversationId
      });
    }
    return this.conversationContexts.get(conversationId)!;
  }

  // Main method for conversation-aware TTS
  async speakWithLanguageDetection(
    text: string, 
    conversationId: string,
    options: {
      forceLanguage?: string;
      style?: 'casual' | 'professional';
      debugMode?: boolean;
    } = {}
  ): Promise<VoiceResponse> {
    const context = this.getConversationContext(conversationId);
    const { forceLanguage, style = 'casual', debugMode = false } = options;

    // Detect language or use forced language
    let detectedLanguage: LanguageInfo;
    if (forceLanguage) {
      detectedLanguage = {
        code: forceLanguage,
        name: this.getLanguageName(forceLanguage),
        confidence: 1.0
      };
    } else {
      detectedLanguage = this.languageDetection.detectLanguage(
        text, 
        context.previousLanguage
      );
    }

    // Determine if we need to switch language
    const shouldSwitch = !context.previousLanguage || 
      this.languageDetection.shouldSwitchLanguage(
        context.previousLanguage,
        detectedLanguage.code,
        detectedLanguage.confidence
      );

    if (debugMode) {
      console.log('🎯 Language Detection:', {
        text: text.substring(0, 50) + '...',
        detected: detectedLanguage,
        previous: context.previousLanguage,
        shouldSwitch,
        context: {
          history: context.languageHistory.slice(-3),
          preferences: context.userPreferences
        }
      });
    }

    // Get voice preferences for the detected language
    const voicePrefs = this.languageDetection.getVoicePreferences(detectedLanguage.code);
    const optimizations = this.languageDetection.getLanguageOptimizations(detectedLanguage.code);

    // Preprocess text for better pronunciation
    let processedText = text;
    if (optimizations.textPreprocessing) {
      processedText = optimizations.textPreprocessing(text);
    }

    // Apply pronunciation fixes
    Object.entries(optimizations.pronunciationFixes).forEach(([from, to]) => {
      const regex = new RegExp(from, 'gi');
      processedText = processedText.replace(regex, to as string);
    });

    // Generate speech using ElevenLabs (best quality provider)
    const audioBlob = await this.elevenLabsService.textToSpeech({
      text: processedText,
      voice: voicePrefs.voiceId,
      model: 'eleven_multilingual_v2',
      language: detectedLanguage.code,
      stability: voicePrefs.settings.stability,
      similarityBoost: voicePrefs.settings.similarityBoost,
      style: voicePrefs.settings.style,
      useSpeakerBoost: true
    });

    // Update conversation context
    context.previousLanguage = detectedLanguage.code;
    context.languageHistory.push(detectedLanguage.code);
    
    // Keep history manageable
    if (context.languageHistory.length > 10) {
      context.languageHistory = context.languageHistory.slice(-10);
    }

    return {
      audioBlob,
      language: detectedLanguage.code,
      provider: 'elevenlabs',
      switchedLanguage: shouldSwitch,
      confidence: detectedLanguage.confidence
    };
  }

  // Set user language preferences
  setUserPreferences(
    conversationId: string,
    preferences: {
      primaryLanguage?: string;
      fallbackLanguage?: string;
      preferredProvider?: 'elevenlabs' | 'azure' | 'google' | 'auto';
    }
  ): void {
    const context = this.getConversationContext(conversationId);
    context.userPreferences = {
      ...context.userPreferences,
      ...preferences
    };
  }

  private getLanguageName(code: string): string {
    const names = {
      'hi-IN': 'Hindi',
      'pa-IN': 'Punjabi', 
      'en-CA': 'English',
      'zh-CN': 'Chinese',
      'es-ES': 'Spanish',
      'fr-CA': 'French'
    };
    return names[code] || 'Unknown';
  }

  // Clean up old conversations
  cleanupConversations(olderThanHours: number = 24): void {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    // Note: In a real implementation, you'd track conversation timestamps
    // For now, we'll just clear all contexts
    if (this.conversationContexts.size > 100) {
      this.conversationContexts.clear();
      console.log('Cleaned up conversation contexts');
    }
  }
}