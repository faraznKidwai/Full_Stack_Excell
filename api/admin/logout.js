export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Wipe out the cookie by setting Max-Age to 0 instantly
  res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}