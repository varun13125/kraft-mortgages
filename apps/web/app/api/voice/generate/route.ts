import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, tooManyRequests } from '@/lib/ai/request-guards';

// Public text-to-speech proxy for the chat widget. ElevenLabs bills per character,
// so text length and request rate are bounded.
const MAX_TTS_CHARS = 2500;

// Voice configurations
const voiceConfigs: Record<string, { voiceId: string; settings: { stability: number; similarity_boost: number; style: number } }> = {
  'hi-IN': {
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - Indian languages
    settings: { stability: 0.65, similarity_boost: 0.8, style: 0.6 }
  },
  'pa-IN': {
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Same voice for consistency
    settings: { stability: 0.65, similarity_boost: 0.8, style: 0.6 }
  },
  'en-CA': {
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - conversational
    settings: { stability: 0.5, similarity_boost: 0.8, style: 0.6 }
  },
  'zh-CN': {
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    settings: { stability: 0.6, similarity_boost: 0.75, style: 0.5 }
  },
  'es-ES': {
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    settings: { stability: 0.6, similarity_boost: 0.75, style: 0.6 }
  },
  'fr-CA': {
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    settings: { stability: 0.7, similarity_boost: 0.75, style: 0.5 }
  }
};

/** Trim to the character budget, preferring to cut at a sentence boundary. */
function clampText(text: string): string {
  if (text.length <= MAX_TTS_CHARS) return text;
  const slice = text.slice(0, MAX_TTS_CHARS);
  const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '), slice.lastIndexOf('\n'));
  return lastStop > MAX_TTS_CHARS * 0.6 ? slice.slice(0, lastStop + 1) : slice;
}

export async function POST(request: NextRequest) {
  const perMinute = rateLimit(request, 'tts-min', 10, 60_000);
  if (!perMinute.ok) return tooManyRequests(perMinute.retryAfterSec);
  const perHour = rateLimit(request, 'tts-hour', 60, 60 * 60_000);
  if (!perHour.ok) return tooManyRequests(perHour.retryAfterSec);

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const rawText = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!rawText) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const text = clampText(rawText);
    // Only known language codes are accepted (the value is echoed in a response header).
    const language = typeof body?.language === 'string' && voiceConfigs[body.language] ? body.language : 'en-CA';

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      );
    }

    const config = voiceConfigs[language];

    // Generate speech with ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: config.settings.stability,
          similarity_boost: config.settings.similarity_boost,
          style: config.settings.style,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText.slice(0, 300));
      // Pass through 429 so the client can back off; mask other upstream statuses.
      const status = response.status === 429 ? 429 : 502;
      return NextResponse.json(
        { error: `Voice generation failed (${response.status})` },
        { status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Voice-Language': language,
        'X-Voice-Provider': 'elevenlabs'
      }
    });

  } catch (error) {
    console.error('Voice generation error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Voice generation failed' },
      { status: 500 }
    );
  }
}
