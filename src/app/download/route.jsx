import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';
// add import for pinecone stuff

export async function POST(request) {
    return request.json()
        .then((data) => {
            const { url } = data;

            const codebasePath = path.join(
                path.resolve(__dirname, "../../"),
                'codebases'
            );

            if (fs.existsSync(codebasePath)) {
                return Promise.reject({ error: "Codebase already cached; please delete it if you want to upload a new one", status: 400 });
            }

            if (!url || url === "") {
                return Promise.reject({ error: "URL is required", status: 400 });
            }

            return axios({
                url,
                method: "GET",
                responseType: "arraybuffer",
            });
        })
        .then((response) => {
            const zip = new AdmZip(response.data);
            const extractPath = path.join(
                path.resolve(__dirname, "../../"),
                'codebases',
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
        })
        .catch((error) => {
            console.error("Error downloading codebase:", error);

            const errorMessage = error.error || "Failed to download codebase";
            const status = error.status || 500;

            return NextResponse.json({ error: errorMessage }, { status });
        });
}
