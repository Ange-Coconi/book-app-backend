import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../db/index';
import { prepopulate } from '../helper/prepopulate';
import corsFunction from '../middleware/cors';
import nodemailer from 'nodemailer';

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

router.post('/login', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
      return res.status(400).json({ message: 'Invalid input' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  try {
    // Validate input
    const { username, password, email } = loginSchema2.parse(req.body);
    

    const existingUser = await prisma.user.findUnique({
      where: {username: username }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {email: email }
    });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
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
      return res.status(400).json({ message: 'Invalid input' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
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

router.post('/active-session', async (req: Request,res: Response,next: NextFunction): Promise<any> => {
  const userId = req.session.userId;

  if (userId === 1 || userId === undefined || userId === null) {
    return res.status(200).json(null);

  } 

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
       username: true,
        email: true,
      }
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error('Error session :', error);
    res.status(200).json({ message: 'Error session' });
    return;
  }
  
});

router.post('/contact', async (req: Request,res: Response,next: NextFunction): Promise<any> => {

  if (!req.body) { 
    return res.status(400).json({ message: 'Request body is empty' }) 
  };

  console.log(req.body)

  const { firstname, lastname, email, reason, message } = req.body;

  if (!email || !message || !firstname || !lastname || !reason) {
    return res.status(400).json({ message: 'Missing required fields' })
}

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587, // Use 465 for SSL, 587 for TLS
    secure: false, // Use true for port 465
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_TO,
    subject: `New Contact Message - ${reason}`,
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
    return

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(200).json({ message: 'Error sending email' });
    return 
  }
});

export default router;





  

