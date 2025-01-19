import express from 'express';
import cors from 'cors';
import sessionMiddleware from './middleware/session'; 
import booksRouter from './routes/books'; 
import authRouter from './routes/auth';
import { validateSession  } from './middleware/sessionValidator'; 


const app = express();

app.set('trust proxy', 1); 
app.use(cors()); app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 
app.use(sessionMiddleware); // Use session middleware
app.use(validateSession); 

app.use('/auth', authRouter); // Use authentication routes
app.use('/api', booksRouter); 


// app.get('/', (req, res) => { 
//   if (req.session.views) { 
//     req.session.views++; 
//     res.send(`<p>Number of views: ${req.session.views}</p>`); 
//   } else { 
//     req.session.views = 1; 
//     res.send('Welcome! Refresh the page to start counting your visits.'); 
//   } 
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
