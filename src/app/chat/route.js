import { NextResponse } from 'next/server';
import { openai } from '../config/openAIConfig';

// Send a request to the ChatGPT API
export async function POST(request) {
    const res = await request.json();
    const userInput = res.prompt;

    if (!userInput) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [{ role: "user", content: userInput }],
        max_tokens: 1000,
      });
  
      const data = response.choices;
      if (data && data.length > 0) {
        return NextResponse.json({ text: data[0].message.content.trim() });
      } else {
        return NextResponse.json({ error: "Invalid response from API" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
};