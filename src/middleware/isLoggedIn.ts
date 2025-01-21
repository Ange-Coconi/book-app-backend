import { Request, Response, NextFunction } from 'express';

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    console.log(req.session.authenticated)
    console.log(req.session.userId)
    // Complete the if statement below:
    if (req.session.authenticated) {
      return next();
    } else {
      req.session.userId = 1;
      return next();
    }
  }

  export default isLoggedIn;