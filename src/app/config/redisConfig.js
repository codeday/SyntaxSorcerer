import { createClient } from 'redis';

export const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-19829.c258.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19829
    }
});

export async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
    return client;
}