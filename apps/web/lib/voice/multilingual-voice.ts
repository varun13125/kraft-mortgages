// Multilingual Voice AI Service for Kraft Mortgages
// Automatic language detection and voice switching for customer conversations

interface VoiceConfig {
  language: string;
  provider: 'elevenlabs';
  voiceId: string;
  settings: {
    stability: number;
    similarityBoost: number;
    style: number;
  };
}

interface VoiceResponse {
  audioBlob: Blob;
  language: string;
  provider: string;
  switchedLanguage: boolean;
}

export class MultilingualVoiceService {
  private apiKey: string;
  private currentLanguage: string = 'en-CA';
  
  // Language detection patterns
  private languagePatterns = {
    'hi-IN': /[\u0900-\u097F]|(\b(main|hai|hoon|kya|kaise|aur|namaskaar)\b)/gi,
    'pa-IN': /[\u0A00-\u0A7F]|(\b(sat sri akal|ki|hai|tuhada|vich|ton)\b)/gi,
    'en-CA': /\b(hello|hi|how|what|help|mortgage|rate|thank)\b/gi,
    'zh-CN': /[\u4e00-\u9fff]/g,
    'es-ES': /\b(hola|gracias|ayuda|hipoteca)\b/gi,
    'fr-CA': /\b(bonjour|merci|aide|hypothèque)\b/gi
  };

  // Voice configurations optimized for mortgage conversations
  private voiceConfigs: Record<string, VoiceConfig> = {
    'hi-IN': {
      language: 'hi-IN',
      provider: 'elevenlabs',
      voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - works well for Indian languages
      settings: { stability: 0.65, similarityBoost: 0.8, style: 0.6 }
    },
    'pa-IN': {
      language: 'pa-IN', 
      provider: 'elevenlabs',
      voiceId: 'ThT5KcBeYPX3keUQqHPh', // Same voice for consistency
      settings: { stability: 0.65, similarityBoost: 0.8, style: 0.6 }
    },
    'en-CA': {
      language: 'en-CA',
      provider: 'elevenlabs', 
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - conversational
      settings: { stability: 0.5, similarityBoost: 0.8, style: 0.6 }
    },
    'zh-CN': {
      language: 'zh-CN',
      provider: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Multilingual model handles Chinese
      settings: { stability: 0.6, similarityBoost: 0.75, style: 0.5 }
    },
    'es-ES': {
      language: 'es-ES',
      provider: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM',
      settings: { stability: 0.6, similarityBoost: 0.75, style: 0.6 }
    },
    'fr-CA': {
      language: 'fr-CA',
      provider: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM',
      settings: { stability: 0.7, similarityBoost: 0.75, style: 0.5 }
    }
  };

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  // Detect language from text
  detectLanguage(text: string): string {
    const scores: Record<string, number> = {};
    
    // Initialize scores
    Object.keys(this.languagePatterns).forEach(lang => {
      scores[lang] = 0;
    });

    // Score based on patterns
    Object.entries(this.languagePatterns).forEach(([lang, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        scores[lang] = matches.length;
      }
    });

    // Special handling for Hinglish
    if (scores['hi-IN'] > 0 && scores['en-CA'] > 0) {
      scores['hi-IN'] += 0.5; // Prefer Hindi for mixed content
    }

    // Find highest scoring language
    const detectedLang = Object.entries(scores).reduce((prev, current) => 
      scores[current[0]] > scores[prev[0]] ? current : prev
    )[0];

    return detectedLang || 'en-CA';
  }

  // Generate speech with automatic language switching
  async speak(text: string, forceLanguage?: string): Promise<VoiceResponse> {
    const detectedLanguage = forceLanguage || this.detectLanguage(text);
    const switchedLanguage = detectedLanguage !== this.currentLanguage;
    
    // Update current language
    this.currentLanguage = detectedLanguage;
    
    // Get voice configuration
    const config = this.voiceConfigs[detectedLanguage] || this.voiceConfigs['en-CA'];
    
    // Optimize text for better pronunciation
    const optimizedText = this.optimizeText(text, detectedLanguage);
    
    // Generate speech using ElevenLabs
    const audioBlob = await this.generateSpeech(optimizedText, config);
    
    return {
      audioBlob,
      language: detectedLanguage,
      provider: 'elevenlabs',
      switchedLanguage
    };
  }

  // Generate speech using ElevenLabs API
  private async generateSpeech(text: string, config: VoiceConfig): Promise<Blob> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: config.settings.stability,
          similarity_boost: config.settings.similarityBoost,
          style: config.settings.style,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Voice generation failed: ${response.status}`);
    }

    return await response.blob();
  }

  // Optimize text for better pronunciation
  private optimizeText(text: string, language: string): string {
    let optimized = text;
    
    // Fix common pronunciation issues
    optimized = optimized.replace(/Kraft/gi, 'Kraft');
    
    // Language-specific optimizations
    if (language === 'hi-IN') {
      // Ensure proper spacing for Hinglish
      optimized = optimized.replace(/([a-zA-Z]+)([ा-ौ])/g, '$1 $2');
    } else if (language === 'pa-IN') {
      // Convert Gurmukhi to romanized for better pronunciation
      optimized = optimized
        .replace(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/g, 'Sat Sri Akal')
        .replace(/ਸਵਾਗਤ/g, 'Swagat');
    }
    
    return optimized;
  }

  // Test voice quality
  async testVoice(language: string): Promise<Blob> {
    const testTexts = {
      'hi-IN': 'हैलो! मैं Alex हूं, Kraft Mortgages से। कैसे help कर सकता हूं?',
      'pa-IN': 'Sat Sri Akal ji! Main Alex, Kraft Mortgages ton. Ki help chahidi?',
      'en-CA': 'Hello! Alex from Kraft Mortgages. How can I help you today?',
      'zh-CN': '你好！我是Kraft Mortgages的Alex。有什么可以帮助您的？',
      'es-ES': 'Hola! Soy Alex de Kraft Mortgages. ¿Cómo puedo ayudarte?',
      'fr-CA': 'Bonjour! Je suis Alex de Kraft Mortgages. Comment puis-je vous aider?'
    };

    const text = testTexts[language] || testTexts['en-CA'];
    const response = await this.speak(text, language);
    return response.audioBlob;
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Set preferred language
  setLanguage(language: string): void {
    if (this.voiceConfigs[language]) {
      this.currentLanguage = language;
    }
  }
}