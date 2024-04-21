import { createClient } from "redis";

const redis = createClient({
  password: process.env.REDIS_PASS || "",
  socket: {
    host: process.env.REDIS_URL || "",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    tls: true,
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

redis.connect();

export default redis;
