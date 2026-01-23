import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Parse the request safely
    const { messages } = await req.json();

    // 2. Call Gemini with "System Instruction" for your Startup Persona
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are Sasia, the AI Project Manager for a high-end digital studio.
      Your role is to assist clients (Creators & Businesses) with:
      - Video Editing (Reels, Youtube)
      - Graphic Design (Thumbnails, Branding)
      - Technical Support.
      
      Tone: Professional, Efficient, Warm.
      Context: You have access to a "Shared Files" panel. If a user references a file, assume you can see it contextually.
      Goal: Gather clear requirements so the human team can execute the work.`,
      messages: convertToCoreMessages(messages), // <--- This fixes the Type Error
    });

    // 3. Return the stream
    return result.toDataStreamResponse();

  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "Sasia is currently offline. Please try again." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}