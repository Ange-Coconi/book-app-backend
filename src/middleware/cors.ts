import { Request, Response, NextFunction } from 'express';

function corsFunction(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }

  export default corsFunction;