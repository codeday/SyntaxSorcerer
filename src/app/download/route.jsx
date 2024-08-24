import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';

export async function POST(request) {
    return request.json().then(async (data) => {
        // Print an error message if the codebase already exists
        const { url } = data;

        const codebasePath = path.join(
            path.resolve(__dirname, "../../"),
            `codebases`
        );

        if (fs.existsSync(codebasePath)) {
            return NextResponse.json({ error: "Codebase already cached; please delete it if you want to upload a new one" }, { status: 400 });
        }

        if (!url || url === "") {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        try {
            const response = await axios({
                url,
                method: "GET",
                responseType: "arraybuffer",
            });

            const zip = new AdmZip(response.data);
            const extractPath = path.join(
                path.resolve(__dirname, "../../"),  // Navigate to the root directory and add the codebases directory
                `codebases`,
                path.basename(url, ".zip")
            );
            zip.extractAllTo(extractPath, true);

            // Upsert embeddings from the codebase!
            const traverseDirectory = (directoryPath) => {
                fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
                    if (err) {
                        console.error(`Failed to read codebase directory: ${err}`);
                        return;
                    }

                    files.forEach(file => {
                        const filePath = path.join(directoryPath, file.name);

                        if (file.isDirectory()) {
                            // Recursively traverse the directory
                            traverseDirectory(filePath);
                        } else if (file.isFile()) {
                            // Process the file
                            processFile(filePath);
                        }
                    });
                });
            };

            traverseDirectory(codebasePath);

            return NextResponse.json({
                message: "Codebase downloaded and extracted",
                path: extractPath,
            });
        } catch (error) {
            console.error("Error downloading codebase:", error);
            return NextResponse.json({ error: "Failed to download codebase" }, { status: 500 });
        }
    }).catch((error) => {
        console.error("Error parsing request JSON:", error);
        return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    });
}