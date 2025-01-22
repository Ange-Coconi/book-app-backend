import { Request, Response, NextFunction } from 'express';

function corsFunction(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', 'https://write-and-visualize-book.netlify.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }


export const corsOptions = {
    origin: 'https://write-and-visualize-book.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Explicitly allow headers
  };


export default corsFunction;