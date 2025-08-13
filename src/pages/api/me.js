import { getTokenFromRequest, verifyAuthToken } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const token = getTokenFromRequest(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload) {
    return res.status(200).json({ success: true, user: null });
  }
  const { id, email, role } = payload;
  return res.status(200).json({ success: true, user: { id, email, role } });
}


