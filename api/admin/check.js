import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookieHeader = req.headers.cookie || '';
  const token = cookieHeader
    .split('; ')
    .find(row => row.startsWith('admin_token='))
    ?.split('=')[1];

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'fallback-secret');
    return res.status(200).json({ authenticated: decoded.isAdmin === true });
  } catch (err) {
    return res.status(200).json({ authenticated: false });
  }
}