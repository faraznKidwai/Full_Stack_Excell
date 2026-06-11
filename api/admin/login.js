import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD_HASH = "$2b$10$0gRpJQow6s3WlGlHPUWWfO4Z1UIYBAyiSPoYY9d7tb9ojAdg/KeZy";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Generate JWT token replacing express-session
    const token = jwt.sign(
      { isAdmin: true }, 
      process.env.SESSION_SECRET || 'fallback-secret', 
      { expiresIn: '1d' }
    );

    // Explicitly write a secure HTTP-Only cookie natively onto the Vercel request domain header
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);

    return res.status(200).json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
}