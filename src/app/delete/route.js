import { NextResponse } from 'next/server';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import pinecone from '../config/pinecone/pineconeInit'
import { cookies } from 'next/headers';

export async function GET(request) {
    const codebasePath = path.join(
        path.resolve(__dirname, "../../"),
        `codebase${cookies().get("seed")}`
    );
    
    if (!fs.existsSync(codebasePath)) {
        return NextResponse.json({ error: "No codebase currently cached" }, { status: 400 });
    }
    
    try {
        await fsp.rm(codebasePath, { recursive: true, force: true });
    
        // Delete everything from the Pinecone namespace
        await pinecone.deleteVectorsFromNamespace();
        NextResponse.json({ message: "Codebase deleted" });

    } catch (error) {
        console.error("Error processing codebase directory:", error);
        NextResponse.json({ error: `Error processing codebase directory: ${error}` }, { status: 500 });
    }
}
