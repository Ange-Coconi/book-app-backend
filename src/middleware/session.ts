import { SessionOptions } from 'express-session';
import { RedisStore } from "connect-redis";
import session from 'express-session';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// let redisClient = createClient();
// redisClient.connect().catch(console.error);

// // Initialize store.
// let redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "myapp:",
// })

const sessionOptions: SessionOptions = {
  secret: 'eS9JK6&cTPs8jY@8Rw!4',
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: false
  }
}

export default session(sessionOptions);
