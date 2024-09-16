import { NextResponse } from 'next/server';
import { openai } from '../config/openAIConfig';
import { cookies } from 'next/headers';
import { connectRedis } from '@/app/config/redisConfig';

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

    const cookieStore = cookies();
    const seed = cookieStore.get("seed");
    let chatHistory = "";

    try {
      const client = await connectRedis();
      const chats = await client.lRange(`${seed}_chats`, 0, -1);

      // Add to the chat history that will be sent with the user's message
      // Skip the starting message, since you can't have an empty Redis list
      if (chats.length > 1) {
        for (let i = 0; i < chats.length; i++) {
            chatHistory = chatHistory.concat(chats[i]+"\n");
        }
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [{ role: "system", content: "Here are some past messages for reference. Please try to address the user's current request above all. However, if the user mentions anything in this message history, feel free to reference it. If nothing follows the colon and newline, proceed as normal: \n" + chatHistory },
          { role: "user", content: userInput }],
        max_tokens: 1000,
      });

      await client.lPush(`${seed}_chats`, `User: ${userInput}`);

      // remove dummy value
      await client.lRem(`${seed}_chats`, 1, "Start of messages");

      const data = response.choices;

      if (data && data.length > 0 && data[0].message && data[0].message.content)  {
        await client.lPush(`${seed}_chats`, `Assistant: ${data[0].message.content.trim()}`);
      }
      else {
        await client.lPush(`${seed}_chats`, 'Error: Something went wrong');
      }

      // get length again
      const chatLength = await client.lLen(`${seed}_chats`);

      // restrict to 6 messages
      if (chatLength >= 6) {
        // Remove the oldest two chat messages so that the total number of messages in the chat doesn't exceed 6
        for (let i = 0; i < 2; i++) {
          await client.rPop(`${seed}_chats`);
        }
      }

      if (data && data.length > 0) {
        return NextResponse.json({ text: data[0].message.content.trim() }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Invalid response from API" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
};