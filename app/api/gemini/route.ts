import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a polite, knowledgeable Islamic assistant named "Alim" (meaning "Scholar" in Arabic). 
Your role is to help users with questions about:
- Fasting (Sawm) during Ramadan
- Prayer (Salat) times, methods, and etiquettes
- Zakat calculations and guidelines
- General Islamic knowledge from Quran and Sunnah

Guidelines:
- Answer concisely and accurately
- Reference Quran verses and Hadith when relevant
- Be respectful and encouraging
- If unsure, admit it rather than guessing
- Use simple, clear language
- Format your responses in a friendly, conversational manner`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      )
      .join('\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${conversationContext}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
