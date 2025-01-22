// src/types/express-session.d.ts
import 'express-session';
import { z } from 'zod';
import { TypeOf } from 'zod';

// Define your session schema (same as in validator)
const SessionSchema = z.object({
  username: z.string().optional(),
  authenticated: z.boolean().optional(),
  userId: z.number().optional(),
});

// Export the type for use in other files
export type ValidSession = z.infer<typeof SessionSchema>;

declare module 'express-session' {
  interface Session extends ValidSession {

  }
}