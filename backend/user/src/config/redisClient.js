import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.REDIS_URI;

if(!url) throw new Error("Redis url not defined!");

export const redisClient = createClient({
    url:url
})
