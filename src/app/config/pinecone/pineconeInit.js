import { PineconeManager } from "./pineconeManager";

export const pinecone = new PineconeManager(process.env.PINECONE_API_KEY, "syntaxsorcerer");
