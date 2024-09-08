import { Pinecone } from "@pinecone-database/pinecone";
import { cookies } from "next/headers";

/**
 * PineconeManager is a class that encapsulates all operations related to managing
 * a Pinecone index, including initialization, upserting embeddings, checking index
 * stats, performing similarity searches, and clearing the index.
 */
export class PineconeManager {
    /**
     * Constructs a new instance of PineconeManager.
     * 
     * @param {string} apiKey - The API key for Pinecone.
     * @param {string} indexName - The name of the Pinecone index to manage.
     * @param {number} [dimension=1536] - The dimensionality of the vectors.
     * @param {string} [metric="cosine"] - The similarity metric to use (e.g., "cosine").
     * @param {string} [cloud="aws"] - The cloud provider where the index is hosted.
     * @param {string} [region="us-east-1"] - The region where the index is hosted.
     */
    constructor(apiKey, indexName, dimension = 1536, metric = "cosine", cloud = "aws", region = "us-east-1") {
        this.pc = new Pinecone({ apiKey });
        this.indexName = indexName;
        this.dimension = dimension;
        this.metric = metric;
        this.cloud = cloud;
        this.region = region;
        this.index = this.pc.index(indexName);
    }

    /**
     * Creates a delay for a specified amount of time.
     * 
     * @param {number} ms - The delay time in milliseconds.
     * @returns {Promise} A promise that resolves after the specified time.
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initializes the Pinecone index with the specified configuration.
     * Creates the index on the Pinecone server if it does not already exist.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves once the index is initialized.
     */
    async initPinecone() {
        await this.pc.createIndex({
            name: this.indexName,
            dimension: this.dimension,
            metric: this.metric,
            spec: {
                serverless: {
                    cloud: this.cloud,
                    region: this.region,
                },
            },
        });
        
        this.index = this.pc.index(this.indexName);  // Reinitialize the index after creation
        await this.delay(3000); // 3 second delay 
    }

    /**
     * Upserts embeddings into the specified namespace of the Pinecone index.
     * 
     * @async
     * @param {Object} data - The dictionary of functions and classes with embeddings.
     * @param {string} [namespace=`codebase${cookies().get("seed").value}`] - The namespace in the index to upsert to.
     * @returns {Promise<void>} A promise that resolves once the embeddings are upserted.
     */
    async upsertEmbeddings(data, namespace = `codebase${cookies().get("seed").value}`) {
        // Prepare the upsert request payload
        const upsertPayload = [];

        // Handle functions
        data.functions.forEach((func) => {
            if (func.embedding && Array.isArray(func.embedding)) {
                upsertPayload.push({
                    id: func.function_name,
                    values: func.embedding,
                    metadata: { filepath: func.filepath, type: 'function' }
                });
            }
        });

        // Handle classes
        data.classes.forEach((cls) => {
            if (cls.embedding && Array.isArray(cls.embedding)) {
                upsertPayload.push({
                    id: cls.class_name,
                    values: cls.embedding,
                    metadata: { filepath: cls.filepath, type: 'class' }
                });
            }
        });

        // Upsert the data into Pinecone
        await this.index.namespace(namespace).upsert(upsertPayload);
        await this.delay(3000); // 3 second delay 
        console.log('Embeddings upserted successfully.');
    }

    /**
     * Queries the Pinecone index using the provided embedding.
     * 
     * @async
     * @param {Array<number>} embedding - The embedding vector to query with.
     * @param {string} [namespace=`codebase${cookies().get("seed").value}`] - The namespace to query.
     * @param {number} [topK=5] - The number of top results to return.
     * @returns {Promise<Object[]>} A promise that resolves to the query results.
     */
    async similaritySearch(embedding, namespace = `codebase${cookies().get("seed").value}`, topK = 3) {
        const queryResponse = await this.index.namespace(namespace).query({
            vector: embedding,
            topK: topK,  // Number of top results to return
            includeValues: true,
            includeMetadata: true  // Include metadata in the response
        });

        console.log(queryResponse.matches);
        
        return queryResponse;
    }

    /**
     * Deletes the Pinecone index.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves once the index is deleted.
     */
    async clearIndex() {
        await this.pc.deleteIndex(this.indexName);
    }

     /**
     * Deletes the vectors in a specified namespace.
     * 
     * @async
     * @param {string} [namespace=`codebase${cookies().get("seed").value}`] - The namespace in the index to search within.
     * @returns {Promise<void>} A promise that resolves once all vectors in a namespace are deleted.
     */
     async deleteVectorsFromNamespace(namespace=`codebase${cookies().get("seed").value}`) {
        await this.index.namespace(namespace).deleteAll();
    }
}

