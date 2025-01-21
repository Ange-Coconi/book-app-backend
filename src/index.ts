import express from 'express';
import cors from 'cors';
import sessionMiddleware from './middleware/session'; 
import booksRouter from './routes/books'; 
import authRouter from './routes/auth';
import { validateSession  } from './middleware/sessionValidator'; 
import corsFunction from './middleware/cors';


const app = express();

app.set('trust proxy', 1); 
app.use(cors()); app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 
app.use(sessionMiddleware); // Use session middleware
app.use(validateSession); 
app.use(corsFunction);

app.use('/auth', authRouter); // Use authentication routes
app.use('/api', booksRouter); 


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
