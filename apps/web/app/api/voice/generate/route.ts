import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json();
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Voice configurations
    const voiceConfigs: Record<string, any> = {
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

    const config = voiceConfigs[language] || voiceConfigs['en-CA'];

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
      console.error('ElevenLabs API Error:', errorText);
      return NextResponse.json(
        { error: `Voice generation failed: ${response.status}` },
        { status: response.status }
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
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Voice generation failed' },
      { status: 500 }
    );
  }
}