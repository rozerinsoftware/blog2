import { getTokenFromRequest, verifyAuthToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = verifyAuthToken(token);
    
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
