import { Request, Response, NextFunction } from 'express';

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    console.log('user ID:', req.session.userId);
    console.log('authenticated:', req.session.authenticated);
    // Complete the if statement below:
    if (req.session.authenticated) {
      return next();
    } else {
      req.session.userId = 1;
      return next();
    }
  }

  export default isLoggedIn;