import { extractCodeElements } from './extractCodeBlocks';
import { processAndUpdateDictionary } from './embeddingService';
import { pinecone } from '../config/pinecone/pineconeInit';

// Main function to process the file and generate tokens
export async function processFile(filePath) {
  try {
    console.log(filePath);

    // Extract code blocks
    const codeBlocks = extractCodeElements(filePath);

    // Generate embeddings
    const embeddedCodeBlocks = await processAndUpdateDictionary(codeBlocks);
    console.log(embeddedCodeBlocks);
    // writeToCsv(codeBlocks, './output.csv');

    // Upsert the embeddings into Pinecone
    await pinecone.upsertEmbeddings(embeddedCodeBlocks);
    console.log('Embeddings upserted to Pinecone.');

    // Optionally check the index stats
    // await pinecone.checkIndex();

  } catch (error) {
    console.error('Error processing file:', error);
  }
}