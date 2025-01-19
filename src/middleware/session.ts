import session from 'express-session';
import { SessionOptions } from 'express-session';

const sessionOptions: SessionOptions = {
  secret: 'f4z4gs$Gcg',
  cookie: { maxAge: 300000000, secure: true, sameSite: 'none' },
  saveUninitialized: false,
  resave: false,
   // Add your store configuration
};

export default session(sessionOptions);
