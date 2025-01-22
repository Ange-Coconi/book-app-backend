import express from 'express';
import cors from 'cors';
import sessionMiddleware from './src/middleware/session'; 
import booksRouter from './src/routes/books'; 
import authRouter from './src/routes/auth';
import { validateSession  } from './src/middleware/sessionValidator'; 
import { corsOptions } from './src/middleware/cors';
import isLoggedIn from './src/middleware/isLoggedIn';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.set('trust proxy', 1); 

app.use(cors(corsOptions)); 
app.use(sessionMiddleware); // Use session middleware

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 
app.use(sessionMiddleware); // Use session middleware

app.use('/auth', authRouter); // Use authentication routes
app.use('/api', validateSession, isLoggedIn, booksRouter); 


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
