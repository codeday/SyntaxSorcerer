import { NextResponse } from 'next/server';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { pinecone } from '../config/pinecone/pineconeInit'
import { cookies } from 'next/headers';

export async function GET(request) {

    const codebasePath = path.join(
       `${process.env.NEXT_PUBLIC_CODEBASE_DIR}`,
        `codebase${cookies().get("seed").value}`
    );
    
    if (!fs.existsSync(codebasePath)) {
        return NextResponse.json({ error: "No codebase currently uploaded" }, { status: 400 });
    }
    
    try {
        await fsp.rm(codebasePath, { recursive: true, force: true });
    
        // Delete everything from the Pinecone namespace
        await pinecone.deleteVectorsFromNamespace();
        return NextResponse.json({ message: "Codebase deleted" });

    } catch (error) {
        console.error("Failed to delete codebase:", error);
        return NextResponse.json({ error: `Failed to delete codebase` }, { status: 500 });
    }
}