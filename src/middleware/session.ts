import session from 'express-session';
import { SessionOptions } from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const sessionOptions: SessionOptions = {
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}

export default session(sessionOptions);
