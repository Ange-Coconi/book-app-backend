import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '@/db/index';

const router = Router();

// Input validation schema
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

router.post('/login', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { name: username },
      select: {
        id: true,
        name: true,
        password: true
      }
    });

    if (!user) {
      // Use same message to prevent username enumeration
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Set session data (avoid storing sensitive info)
    req.session.authenticated = true;
    req.session.userId = user.id;  // Only store the ID
    
    return res.redirect('/dashboard');

  } catch (err) {
    // Don't expose error details to client
    console.error('Login error:', err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ msg: 'Invalid input' });
    }
    
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/signin', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { name: username }
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Hash password before storing
    const saltRounds = 10; // recommended value
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword
      },
    });
    
    return res.redirect('/login');

  } catch (err) {
    // Don't expose error details to client
    console.error('Signin error:', err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ msg: 'Invalid input' });
    }
    
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

export default router;