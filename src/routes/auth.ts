import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../db/index';
import { prepopulate } from '../helper/prepopulate';
import corsFunction from '../middleware/cors';

const router = Router();

// Input validation schema
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const loginSchema2 = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password must be at least 1 characters"),
  email: z.string().email("Invalid email address")
});

router.post('/login', corsFunction, async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {username: username },
      select: {
        id: true,
       username: true,
        password: true,
        email: true,
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
    
    res.status(200).json({id: user.id, username: user.username, email: user.email})
    return

  } catch (err) {
    // Don't expose error details to client
    console.error('Login error:', err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ msg: 'Invalid input' });
    }
    
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/signin', corsFunction, async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  try {
    // Validate input
    const { username, password, email } = loginSchema2.parse(req.body);
    

    const existingUser = await prisma.user.findUnique({
      where: {username: username }
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {email: email }
    });

    if (existingEmail) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    // Hash password before storing
    const saltRounds = 10; // recommended value
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    // Create new user with hashed password
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email
      },
    });

    await prepopulate(newUser.id)

    res.status(200).json()

  } catch (err) {
    // Don't expose error details to client
    console.error('Signin error:', err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ msg: 'Invalid input' });
    }
    
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/logout', corsFunction, async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Could not log out.');
    }
    // Optionally, clear the cookie on the client side
    res.clearCookie('connect.sid'); // Default cookie name for express-session
    res.status(200).json(); // Redirect to the login page or another route
  });
});

export default router;