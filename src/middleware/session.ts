import { SessionOptions } from 'express-session';
import { RedisStore } from "connect-redis";
import session from 'express-session';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();


let redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
  }
});

// Add event listeners for Redis connection
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

redisClient.connect().catch((err) => {
  console.error('Redis Connection Error:', err);
});
// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

const sessionOptions: SessionOptions = {
  secret: 'eS9JK6&cTPs8jY@8Rw!4',
  resave: false,
  saveUninitialized: false,
  store: redisStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}

export default session(sessionOptions);
