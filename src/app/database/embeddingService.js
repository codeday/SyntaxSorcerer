import { openai } from '../config/openAIConfig';

// Function to generate embeddings using OpenAI's API
export async function generateEmbeddings(text) {
    /* // Initialize OpenAI client
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
    }); */

    try {
        // Flatten the tokens into a format suitable for OpenAI
        // const text = tokens.map(token => JSON.stringify(token)).join('\n');
        
        // Request embeddings
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002', // Use an appropriate embedding model
            input: text,
            encoding_format: 'float'
        });

        /* console.log('Embedding Dimension: ', response.data[0].embedding.length);
        console.log('OpenAI embeddings response:', response.data); */
        // return response.data
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

    // console.log('Updated dictionary with embeddings:', JSON.stringify(dict, null, 2))
    // console.log(dict);

    return dict;
}