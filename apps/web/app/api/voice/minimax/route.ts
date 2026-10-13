// MiniMax Voice API Route
// Server-side handler for MiniMax's advanced voice synthesis

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, tooManyRequests } from '@/lib/ai/request-guards';

// NOTE: only referenced by lib/voice/voice-conversation.ts, which is itself only used by the
// unmounted components/ChatWidget/VoiceControls.tsx. Still publicly reachable, so inputs are bounded.
const MAX_TTS_CHARS = 2500;
const ALLOWED_LANGUAGES = new Set(['hi-IN', 'pa-IN', 'en-CA', 'zh-CN', 'es-ES', 'fr-CA']);

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 'minimax-min', 10, 60_000);
  if (!limited.ok) return tooManyRequests(limited.retryAfterSec);

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const text = typeof body?.text === 'string' ? body.text.trim().slice(0, MAX_TTS_CHARS) : '';
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const language = typeof body?.language === 'string' && ALLOWED_LANGUAGES.has(body.language) ? body.language : 'en-CA';
    const speedNum = Number(body?.speed);
    const speed = Number.isFinite(speedNum) ? Math.min(2, Math.max(0.5, speedNum)) : 1.0;

    const apiKey = process.env.MINIMAX_API_KEY || process.env.MINIMAX_JWT_TOKEN;
    if (!apiKey) {
      // Fallback to ElevenLabs if MiniMax not configured
      return NextResponse.json(
        { error: 'MiniMax not configured, use fallback' },
        { status: 503 }
      );
    }

    // Language to voice mapping for MiniMax - updated voice IDs
    const voiceMap: Record<string, any> = {
      'hi-IN': {
        voice_id: 'male-qn-qingse',
        language: 'hi-IN'
      },
      'pa-IN': {
        voice_id: 'male-qn-qingse', 
        language: 'hi-IN' // Use Hindi voice for Punjabi
      },
      'en-CA': {
        voice_id: 'female-shaonv',
        language: 'en-US'
      },
      'zh-CN': {
        voice_id: 'female-yujie',
        language: 'zh-CN'
      },
      'es-ES': {
        voice_id: 'female-shaonv',
        language: 'es-ES'
      },
      'fr-CA': {
        voice_id: 'female-shaonv',
        language: 'fr-FR'
      }
    };

    const voiceConfig = voiceMap[language] || voiceMap['en-CA'];

    // MiniMax API endpoint - using correct endpoint
    const apiUrl = 'https://api.minimax.chat/v1/t2a_v2';
    
    const requestBody = {
      model: 'speech-01-240228',  // Correct model name
      text: optimizeTextForMiniMax(text, language),
      voice_setting: {
        voice_id: voiceConfig.voice_id,
        speed: speed,
        vol: 1.0,
        pitch: 0
      },
      audio_setting: {
        sample_rate: 24000,
        bitrate: 128000,
        format: 'mp3'
      },
      pronunciation_dict: {
        'Kraft': 'kraft'
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API Error:', response.status, errorText.slice(0, 300));
      
      // Return error to trigger fallback
      return NextResponse.json(
        { error: 'MiniMax synthesis failed', fallback: true },
        { status: 503 }
      );
    }

    // Check if response is audio or JSON
    const contentType = response.headers.get('content-type');
    
    // Parse the response
    const data = await response.json();
    
    if (data.base_resp?.status_code !== 0) {
      throw new Error(`MiniMax API error: ${data.base_resp?.status_msg || 'Unknown error'}`);
    }
    
    if (data.audio_file) {
      // Base64 encoded audio
      const audioBuffer = Buffer.from(data.audio_file, 'base64');
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Voice-Provider': 'minimax',
          'X-Voice-Language': language
        }
      });
    } else if (typeof data.audio_url === 'string' && /^https:\/\//i.test(data.audio_url)) {
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
    } else {
      throw new Error('No audio data in MiniMax response');
    }

  } catch (error) {
    console.error('MiniMax route error:', error instanceof Error ? error.message : error);
    
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