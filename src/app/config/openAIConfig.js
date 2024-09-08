import OpenAI from 'openai';

// Initialize OpenAI with the API key
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});