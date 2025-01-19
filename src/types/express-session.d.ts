import 'express-session';

declare module 'express-session' {
  interface SessionData {
    views: number,
    authenticated: boolean;
    userId: number;
    user: {
      username: string;
      password: string;
    };
  }
}
