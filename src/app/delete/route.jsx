import { NextResponse } from 'next/server';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import pinecone from '../config/pineconeConfig/pineconeInit.js';
import seed from '../config/seedConfig.js';

export async function GET(request) {
    return request.json()
        .then(async () => {
            const codebasePath = path.join(
                path.resolve(__dirname, "../../"),
                `codebases${seed}`
            );
            
            if (!fs.existsSync(codebasePath)) {
                return NextResponse.json({ error: "No codebase currently cached" }, { status: 400 });
            }
            
            return fsp.rm(codebasePath, { recursive: true, force: true })
            .then(() => pinecone.deleteVectorsFromNamespace())
            .then(() => NextResponse.json({ message: "Codebase deleted" }))
            .catch((error) => {
                    console.error("Error deleting codebase:", error);
                    return NextResponse.json({ error: `Error deleting codebase: ${error}` }, { status: 500 });
            });
        })
        .catch((error) => {
            console.error("Error processing codebase directory:", error);
            return NextResponse.json({ error: `Error processing codebase directory: ${error}` }, { status: 500 });
        });
}
