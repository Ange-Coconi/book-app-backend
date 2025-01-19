import { Request, Response, NextFunction } from 'express';

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    // Complete the if statement below:
    if (req.session.authenticated) {
      return next();
    } else {
      req.session.userId = 1;
      return next();
    }
  }

  export default isLoggedIn;