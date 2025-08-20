// MiniMax Voice API Route
// Server-side handler for MiniMax's advanced voice synthesis

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, language, emotion = 'friendly', speed = 1.0 } = await request.json();
    
    const jwtToken = process.env.MINIMAX_JWT_TOKEN;
    if (!jwtToken) {
      // Fallback to ElevenLabs if MiniMax not configured
      return NextResponse.json(
        { error: 'MiniMax not configured, use fallback' },
        { status: 503 }
      );
    }

    // Language to voice mapping for MiniMax
    const voiceMap: Record<string, any> = {
      'hi-IN': {
        voice_id: 'female-shaonv-jingpin',
        language: 'hi-IN',
        emotion: 'friendly'
      },
      'pa-IN': {
        voice_id: 'female-shaonv-jingpin', 
        language: 'hi-IN', // Use Hindi voice for Punjabi
        emotion: 'friendly'
      },
      'en-CA': {
        voice_id: 'female-emily',
        language: 'en-US',
        emotion: emotion || 'friendly'
      },
      'zh-CN': {
        voice_id: 'female-xiaoxiao',
        language: 'zh-CN',
        emotion: 'friendly'
      },
      'es-ES': {
        voice_id: 'female-isabella',
        language: 'es-ES',
        emotion: 'friendly'
      },
      'fr-CA': {
        voice_id: 'female-denise',
        language: 'fr-FR',
        emotion: 'friendly'
      }
    };

    const voiceConfig = voiceMap[language] || voiceMap['en-CA'];

    // MiniMax API endpoint - using latest model
    const apiUrl = 'https://api.minimax.chat/v1/text_to_speech';
    
    const requestBody = {
      model: 'speech-02',  // Latest stable model
      text: optimizeTextForMiniMax(text, language),
      voice_setting: {
        voice_id: voiceConfig.voice_id,
        speed: speed,
        vol: 1.0,
        pitch: 0,
        emotion: voiceConfig.emotion,
        language: voiceConfig.language
      },
      format: 'mp3',
      sample_rate: 24000
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API Error:', errorText);
      
      // Return error to trigger fallback
      return NextResponse.json(
        { error: 'MiniMax synthesis failed', fallback: true },
        { status: 503 }
      );
    }

    // Check if response is audio or JSON
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('audio')) {
      // Direct audio response
      const audioBuffer = await response.arrayBuffer();
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Voice-Provider': 'minimax',
          'X-Voice-Language': language
        }
      });
    } else {
      // JSON response with audio URL or base64
      const data = await response.json();
      
      if (data.audio_url) {
        // Fetch audio from URL
        const audioResponse = await fetch(data.audio_url);
        const audioBuffer = await audioResponse.arrayBuffer();
        
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'X-Voice-Provider': 'minimax',
            'X-Voice-Language': language
          }
        });
      } else if (data.audio_base64) {
        // Decode base64 audio
        const audioBuffer = Buffer.from(data.audio_base64, 'base64');
        
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'X-Voice-Provider': 'minimax',
            'X-Voice-Language': language
          }
        });
      } else {
        throw new Error('No audio data in MiniMax response');
      }
    }

  } catch (error) {
    console.error('MiniMax route error:', error);
    
    // Return error to trigger fallback to ElevenLabs
    return NextResponse.json(
      { error: 'MiniMax unavailable', fallback: true },
      { status: 503 }
    );
  }
}

// Optimize text for MiniMax pronunciation
function optimizeTextForMiniMax(text: string, language: string): string {
  let optimized = text;
  
  // Fix common pronunciation issues
  optimized = optimized.replace(/Kraft/gi, 'Kraft');
  
  // Language-specific optimizations
  if (language === 'hi-IN') {
    // Ensure proper spacing for Hinglish
    optimized = optimized.replace(/([a-zA-Z]+)([ा-ौ])/g, '$1 $2');
  } else if (language === 'pa-IN') {
    // Romanize Punjabi for better synthesis
    optimized = optimized
      .replace(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/g, 'Sat Sri Akal')
      .replace(/ਸਵਾਗਤ/g, 'Swagat');
  }
  
  // Add emotion markers for MiniMax
  if (text.includes('!')) {
    optimized = `<excited>${optimized}</excited>`;
  } else if (text.includes('?')) {
    optimized = `<questioning>${optimized}</questioning>`;
  }
  
  return optimized;
}