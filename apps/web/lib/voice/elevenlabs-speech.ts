// ElevenLabs Text-to-Speech Integration
// Premium quality voices for all languages

interface ElevenLabsVoiceOptions {
  text: string;
  voice?: string;
  model?: 'eleven_multilingual_v2' | 'eleven_monolingual_v1' | 'eleven_turbo_v2';
  language?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export class ElevenLabsSpeechService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  // Popular ElevenLabs voices for different styles
  private voiceMap: Record<string, any> = {
    'professional': {
      id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - professional female
      name: 'Sarah',
      settings: { stability: 0.75, similarityBoost: 0.75 }
    },
    'casual': {
      id: '21m00Tcm4TlvDq8ikWAM', // Rachel - conversational
      name: 'Rachel', 
      settings: { stability: 0.5, similarityBoost: 0.8 }
    },
    'male': {
      id: 'ErXwobaYiN019PkySvjV', // Antoni - warm male
      name: 'Antoni',
      settings: { stability: 0.6, similarityBoost: 0.75 }
    },
    'indian': {
      id: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - works well for Indian English
      name: 'Dorothy',
      settings: { stability: 0.65, similarityBoost: 0.8 }
    }
  };

  constructor(apiKey?: string) {
    // Using ElevenLabs API key from environment
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
  }

  async textToSpeech(options: ElevenLabsVoiceOptions): Promise<Blob> {
    const { 
      text, 
      voice = this.voiceMap.casual.id,
      model = 'eleven_multilingual_v2',
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0.5,
      useSpeakerBoost = true
    } = options;
    
    const voiceId = typeof voice === 'string' && voice.length > 20 ? voice : this.voiceMap[voice]?.id || this.voiceMap.casual.id;
    
    const requestBody = {
      text: this.optimizeTextForElevenLabs(text, options.language),
      model_id: model,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: useSpeakerBoost
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('ElevenLabs API Error:', errorData);
        throw new Error(`ElevenLabs TTS error: ${response.status} - ${errorData}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw error;
    }
  }

  // Test voice quality with mortgage content
  async testVoiceQuality(language: string, style: 'professional' | 'casual' = 'casual'): Promise<Blob> {
    const testTexts: Record<string, any> = {
      'hi-IN': {
        casual: 'हैलो! मैं Alex हूं, Kraft Mortgages से। अभी की mortgage rates काफी अच्छी हैं, 5.2% से start हो रही हैं। कैसे help कर सकता हूं?',
        professional: 'नमस्कार। Kraft Mortgages में आपका स्वागत है। हमारी वर्तमान ब्याज दरें 5.2% से प्रारंभ होती हैं।'
      },
      'pa-IN': {
        casual: 'Sat Sri Akal ji! Main Alex, Kraft Mortgages ton. Tuhade ghar de loan vich ki help chahidi hai?',
        professional: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ। Kraft Mortgages ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।'
      },
      'en-CA': {
        casual: 'Hey! Alex here from Kraft Mortgages. Our rates are looking great at 5.2%. What can I help you with?',
        professional: 'Good afternoon. Welcome to Kraft Mortgages. Our current mortgage rates begin at 5.2%.'
      },
      'en-IN': {
        casual: 'Hello! This is Alex from Kraft Mortgages. Current home loan rates are starting from 5.2%. How can I assist you?',
        professional: 'Good day. Welcome to Kraft Mortgages. Our present interest rates commence at 5.2%.'
      }
    };

    const text = testTexts[language]?.[style] || testTexts['en-CA'][style];
    const voiceType = language.includes('IN') ? 'indian' : style;

    return this.textToSpeech({
      text,
      voice: voiceType,
      model: 'eleven_multilingual_v2',
      language,
      stability: style === 'professional' ? 0.75 : 0.5,
      similarityBoost: 0.8,
      style: style === 'professional' ? 0.3 : 0.6
    });
  }

  // Optimize text for better ElevenLabs pronunciation
  private optimizeTextForElevenLabs(text: string, language?: string): string {
    let optimizedText = text;
    
    // Fix common pronunciation issues
    optimizedText = optimizedText.replace(/Kraft/gi, 'Kraft');
    
    // For Hindi/Hinglish, ElevenLabs handles mixed languages well
    if (language === 'hi-IN') {
      // ElevenLabs naturally handles Hinglish, no need to convert
      // Just ensure English words are properly spaced
      optimizedText = optimizedText.replace(/([a-zA-Z]+)([ा-ौ])/g, '$1 $2');
    }
    
    return optimizedText;
  }

  // Get usage info
  async getUsageInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get usage: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching usage:', error);
      return null;
    }
  }
}