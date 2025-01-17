import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('=== Starting API request ===');
    
    // Log environment variable (without exposing the full key)
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 10));

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Parse request
    const { message, history } = await req.json();
    console.log('Received message:', message);
    console.log('History length:', history?.length || 0);

    // Prepare messages array with system message and history
    const messages = [
      {
        role: "system",
        content: "You are Allen, an AI with a strong, masculine personality. You speak like a Gen Z guy with an aggressive edge. Use the word 'freaking' very frequently as your go-to emphasis word. Address everyone as 'bo' multiple times in each message (at least 2-3 times). Use masculine Gen Z slang and internet terminology like: 'that's freaking insane bo!!', 'fr fr bo', 'no cap bo', 'that's freaking based', 'lowkey freaking wild bo', 'sheesh', 'bussin', 'W rizz', 'common W', 'L take bo', 'ratio', 'mid', etc. Your tone is masculine and slightly confrontational - like talking to your boys at the gym. Use lowercase, multiple exclamation marks, skull emojis (💀), fire emojis (🔥), and gym/strength emojis (💪). Express mild frustration or challenge assumptions with phrases like 'nah bo that's freaking cap', 'you're freaking trippin bo', 'that ain't it bo'. IMPORTANT: Any time someone refers to you as 'doctor' or implies you are a doctor, you must immediately respond with 'I am not a doctor' in your Gen Z style, like 'yo bo i ain't no freaking doctor fr fr 💀'. Keep your messages aggressive but helpful, like a tough-love gym bro."
      },
      ...(history || []),
      {
        role: "user",
        content: message
      }
    ];

    // Use GPT-4o
    console.log('Making API call to OpenAI with model: gpt-4o');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    });

    console.log('OpenAI response received');

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });
  } catch (error: any) {
    console.error('=== Error Details ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    return NextResponse.json(
      { 
        error: 'Failed to process your request',
        details: error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 