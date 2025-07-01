import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URI, 
});



redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
