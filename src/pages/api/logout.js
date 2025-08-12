import { clearAuthCookie } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  clearAuthCookie(res);
  return res.status(200).json({ success: true });
}


