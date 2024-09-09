import { openai } from '../config/openAIConfig';

// Function to generate embeddings using OpenAI's API
export async function generateEmbeddings(text) {
    try {
        // Request embeddings
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002', // Use an appropriate embedding model
            input: text,
            encoding_format: 'float'
        });

        return response.data[0].embedding;        

    } catch (error) {
        console.error('Error generating embeddings with OpenAI:', error);
    }
}

// Main function to process and update the dictionary
export async function processAndUpdateDictionary(dict) {
    for (const func of dict.functions) {
      const embedding = await generateEmbeddings(func.code);
      if (embedding) {
        func.embedding = embedding;
      }
    }
  
    for (const cls of dict.classes) {
      const embedding = await generateEmbeddings(cls.code);
      if (embedding) {
        cls.embedding = embedding;
      }
    }
    
    return dict;
}