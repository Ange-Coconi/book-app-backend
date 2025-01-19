// src/middleware/sessionValidator.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Define runtime schema that matches your TypeScript types
const SessionSchema = z.object({
  username: z.string().optional(),
  authenticated: z.boolean().optional(),
  userId: z.number().optional(),
});

export function validateSession (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.session) {
      throw new Error('Session not initialized');
    }
    
    // Validate session data against schema
    SessionSchema.parse(req.session);
    next();
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ msg: 'Invalid session state' });
    return;
  }
}