import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const cookieStore = cookies();
    const hasSeed = cookieStore.has("seed");
    if (hasSeed) {
        return NextResponse.json({ message: "Using existing seed" });
    }

    // Set the user seed if it has not been set
    const seed = uuidv4();
    cookies().set({
        name: 'seed',
        value: seed,
        path: '/',
        secure: true
    });

    return NextResponse.json({ message: "Seed set" });
}