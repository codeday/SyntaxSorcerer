import { NextResponse } from 'next/server';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import pinecone from '../config/pineconeConfig/pineconeInit.js';
import seed from '../config/seedConfig.js';

export async function GET(request) {

    return request.json().then(async () => {
        const codebasePath = path.join(
            path.resolve(__dirname, "../../"),
            `codebases${seed}`
        );
        
        if (!fs.existsSync(codebasePath)) {
            return res.status(400).json({ error: "No codebase currently cached" });
        }
        
        try {
            await fsp.rm(codebasePath, { recursive: true, force: true });
        
            // Delete everything from the Pinecone namespace
            await pinecone.deleteVectorsFromNamespace();        
            res.json({ message: "Codebase deleted" });
        }
        catch (error) {
            console.error("Error processing codebase directory:", error);
            res.status(500).json({ error: `Error processing codebase directory: ${error}` });
        }

    }).catch((error) => {
        console.error("Error parsing request JSON:", error);
        return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    });
    
}