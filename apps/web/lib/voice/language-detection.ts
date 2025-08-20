// Language Detection Service for Mid-Conversation Switching
// Detects language changes and provides appropriate voice settings

export interface LanguageInfo {
  code: string;
  name: string;
  confidence: number;
  script?: string;
}

export interface VoicePreferences {
  provider: 'elevenlabs' | 'azure' | 'google';
  voiceId: string;
  settings: any;
}

export class LanguageDetectionService {
  // Language patterns for quick detection
  private languagePatterns = {
    'hi-IN': {
      patterns: [
        /[\u0900-\u097F]/,  // Devanagari script
        /\b(हैलो|नमस्कार|धन्यवाद|कैसे|क्या|मैं|हूं|है|हैं|के|की|से|में|को|का|पर|और|या|लेकिन|अगर|तो|यह|वह)\b/g,
        /\b(main|hai|hoon|kya|kaise|aur|lekin|agar|toh|yeh|voh)\b/gi  // Hinglish
      ],
      keywords: ['hai', 'hoon', 'kya', 'kaise', 'main', 'aur', 'namaskaar', 'dhanyawad']
    },
    'pa-IN': {
      patterns: [
        /[\u0A00-\u0A7F]/,  // Gurmukhi script
        /\b(Sat Sri Akal|ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ki|hai|tuhada|main|vich|ton|de|da|di|nu|naal)\b/gi
      ],
      keywords: ['sat sri akal', 'ki', 'hai', 'tuhada', 'vich', 'ton', 'punjabi']
    },
    'en-CA': {
      patterns: [
        /\b(hello|hi|hey|good|morning|afternoon|evening|how|what|where|when|why|yes|no|thank|please|sorry|help|can|could|would|should)\b/gi
      ],
      keywords: ['hello', 'good', 'how', 'what', 'thank', 'please', 'help', 'mortgage', 'rate']
    },
    'zh-CN': {
      patterns: [
        /[\u4e00-\u9fff]/,  // Chinese characters
        /\b(你好|您好|谢谢|请问|怎么|什么|哪里|为什么|是的|不是|帮助|可以)\b/g
      ],
      keywords: ['你好', '您好', '谢谢', '请问', '怎么', '什么']
    },
    'es-ES': {
      patterns: [
        /\b(hola|buenos|días|tardes|noches|cómo|qué|dónde|cuándo|por qué|sí|no|gracias|por favor|ayuda|puedo|mortgage|hipoteca)\b/gi
      ],
      keywords: ['hola', 'buenos', 'gracias', 'por favor', 'ayuda', 'hipoteca']
    },
    'fr-CA': {
      patterns: [
        /\b(bonjour|bonsoir|comment|quoi|où|quand|pourquoi|oui|non|merci|s'il vous plaît|aide|puis|hypothèque|taux)\b/gi
      ],
      keywords: ['bonjour', 'merci', 'aide', 'hypothèque', 'taux', 'comment']
    }
  };

  // Voice provider preferences by language (based on testing)
  private voicePreferences: Record<string, VoicePreferences> = {
    'hi-IN': {
      provider: 'elevenlabs',
      voiceId: 'indian', // Dorothy voice works well for Indian languages
      settings: { stability: 0.65, similarityBoost: 0.8, style: 0.6 }
    },
    'pa-IN': {
      provider: 'elevenlabs',
      voiceId: 'indian', // Same as Hindi for consistency
      settings: { stability: 0.65, similarityBoost: 0.8, style: 0.6 }
    },
    'en-CA': {
      provider: 'elevenlabs',
      voiceId: 'casual', // Rachel for conversational English
      settings: { stability: 0.5, similarityBoost: 0.8, style: 0.6 }
    },
    'zh-CN': {
      provider: 'elevenlabs',
      voiceId: 'casual', // ElevenLabs multilingual handles Chinese well
      settings: { stability: 0.6, similarityBoost: 0.75, style: 0.5 }
    },
    'es-ES': {
      provider: 'elevenlabs',
      voiceId: 'casual',
      settings: { stability: 0.6, similarityBoost: 0.75, style: 0.6 }
    },
    'fr-CA': {
      provider: 'elevenlabs',
      voiceId: 'casual',
      settings: { stability: 0.7, similarityBoost: 0.75, style: 0.5 }
    }
  };

  detectLanguage(text: string, previousLanguage?: string): LanguageInfo {
    const scores: Record<string, number> = {};
    
    // Initialize all languages with base score
    Object.keys(this.languagePatterns).forEach(lang => {
      scores[lang] = 0;
    });

    // Give slight preference to previous language for consistency
    if (previousLanguage && scores[previousLanguage] !== undefined) {
      scores[previousLanguage] += 0.1;
    }

    // Score based on script detection (highest weight)
    Object.entries(this.languagePatterns).forEach(([lang, patterns]) => {
      patterns.patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          // Script patterns get highest score
          if (pattern.source.includes('\\u')) {
            scores[lang] += matches.length * 2.0;
          } else {
            scores[lang] += matches.length * 0.5;
          }
        }
      });

      // Score based on keyword frequency
      patterns.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          scores[lang] += matches.length * 1.0;
        }
      });
    });

    // Special handling for Hinglish (mix of Hindi and English)
    if (scores['hi-IN'] > 0 && scores['en-CA'] > 0) {
      scores['hi-IN'] += 0.5; // Prefer Hindi for Hinglish
    }

    // Find the highest scoring language
    const detectedLang = Object.entries(scores).reduce((prev, current) => 
      scores[current[0]] > scores[prev[0]] ? current : prev
    )[0];

    const confidence = Math.min(scores[detectedLang] / Math.max(text.length * 0.1, 1), 1);

    return {
      code: detectedLang,
      name: this.getLanguageName(detectedLang),
      confidence: confidence,
      script: this.getScript(detectedLang)
    };
  }

  getVoicePreferences(languageCode: string): VoicePreferences {
    return this.voicePreferences[languageCode] || this.voicePreferences['en-CA'];
  }

  // Check if language switch is needed
  shouldSwitchLanguage(
    currentLanguage: string, 
    detectedLanguage: string, 
    confidence: number,
    threshold: number = 0.3
  ): boolean {
    return detectedLanguage !== currentLanguage && confidence > threshold;
  }

  // Get language-specific optimizations for voice synthesis
  getLanguageOptimizations(languageCode: string): any {
    const optimizations: Record<string, any> = {
      'hi-IN': {
        // ElevenLabs handles Hinglish naturally
        textPreprocessing: (text: string) => {
          // Ensure proper spacing around English words in Hindi text
          return text.replace(/([a-zA-Z]+)([ा-ौ])/g, '$1 $2');
        },
        pronunciationFixes: {
          'Kraft': 'Kraft',
          'mortgage': 'mortgage',
          'rate': 'rate'
        }
      },
      'pa-IN': {
        textPreprocessing: (text: string) => {
          // Romanized Punjabi works better with ElevenLabs
          return text
            .replace(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/g, 'Sat Sri Akal')
            .replace(/ਸਵਾਗਤ/g, 'Swagat');
        },
        pronunciationFixes: {
          'Kraft': 'Kraft',
          'ji': 'jee'
        }
      },
      'en-CA': {
        textPreprocessing: (text: string) => text,
        pronunciationFixes: {
          'Kraft': 'Kraft'
        }
      },
      'zh-CN': {
        textPreprocessing: (text: string) => text,
        pronunciationFixes: {}
      }
    };

    return optimizations[languageCode] || optimizations['en-CA'];
  }

  private getLanguageName(code: string): string {
    const names: Record<string, string> = {
      'hi-IN': 'Hindi',
      'pa-IN': 'Punjabi', 
      'en-CA': 'English',
      'zh-CN': 'Chinese',
      'es-ES': 'Spanish',
      'fr-CA': 'French'
    };
    return names[code] || 'Unknown';
  }

  private getScript(code: string): string {
    const scripts: Record<string, string> = {
      'hi-IN': 'Devanagari',
      'pa-IN': 'Gurmukhi',
      'en-CA': 'Latin',
      'zh-CN': 'Simplified Chinese',
      'es-ES': 'Latin',
      'fr-CA': 'Latin'
    };
    return scripts[code] || 'Unknown';
  }
}