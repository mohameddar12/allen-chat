import { NextResponse } from 'next/server';

// Voice options from ElevenLabs
const VOICE_IDS = {
  rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel - Warm and engaging
  josh: "TxGEqnHWrfWFTfGW9XjX",   // Josh - Deep and resonant
  sam: "yoZ06aMxZJJ28mfd3POQ",    // Sam - Energetic and enthusiastic
  antoni: "ErXwobaYiN019PkySvjV"   // Antoni - Friendly and approachable
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = VOICE_IDS.josh; // Using Josh's deeper voice for Allen

    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    if (!text) {
      throw new Error('No text provided for speech generation');
    }

    console.log('Generating speech for text:', text.substring(0, 100) + '...');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,           // Lower for more expressiveness
            similarity_boost: 0.85,    // Higher for more consistent masculine tone
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Speech generation failed: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error('No audio data received');
    }

    console.log('Successfully generated speech, size:', audioBuffer.byteLength, 'bytes');

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error.message,
      },
      { status: 500 }
    );
  }
} 