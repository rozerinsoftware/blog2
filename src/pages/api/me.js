import { getTokenFromRequest, verifyAuthToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    console.log("API /me - Environment check:", {
      JWT_SECRET: process.env.JWT_SECRET ? "SET" : "NOT SET",
      JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME,
      NODE_ENV: process.env.NODE_ENV
    });
    
    const token = getTokenFromRequest(req);
    console.log("API /me - Token:", token ? "EXISTS" : "NOT FOUND");
    
    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = verifyAuthToken(token);
    console.log("API /me - Decoded:", decoded ? "SUCCESS" : "FAILED");
    
    if (!decoded) {
      return res.status(200).json({ user: null });
    }

    res.status(200).json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("API /me error:", error);
    res.status(200).json({ user: null });
  }
}
