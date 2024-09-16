import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectRedis } from '@/app/config/redisConfig';

export async function GET(request) {
    try {
        const client = await connectRedis();
        const cookieStore = cookies();
        const seed = cookieStore.get("seed");
    
        let chatExists = await client.exists(`${seed}_chats`);

        // Create a list of messages for this user session if not created already
        if (!chatExists) {
            await client.lPush(`${seed}_chats`, "Start of messages");
            return NextResponse.json({ message: "Chatbot memory initialized" });
        }
        else {
            return NextResponse.json({ message: "Chatbot memory present" });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to initialize memory' }, { status: 500 });
    }
}

