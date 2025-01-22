import express from 'express';
import cors from 'cors';
import sessionMiddleware from './middleware/session'; 
import booksRouter from './routes/books'; 
import authRouter from './routes/auth';
import { validateSession  } from './middleware/sessionValidator'; 
import corsFunction from './middleware/cors';
import isLoggedIn from './middleware/isLoggedIn';

const app = express();

app.set('trust proxy', 1); 
app.use(sessionMiddleware); // Use session middleware
app.use(cors({
  origin: 'https://write-and-visualize-book.netlify.app', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 
app.use(sessionMiddleware); // Use session middleware

app.use('/auth', corsFunction, authRouter); // Use authentication routes
app.use('/api', corsFunction, validateSession, isLoggedIn, booksRouter); 


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
