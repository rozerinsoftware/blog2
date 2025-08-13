import { setAuthCookie, signAuthToken } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Basit bir örnek: 1-4 arasında rastgele misafir id'si
  const guestId = Math.floor(Math.random() * 4) + 1;
  const payload = { id: guestId, email: null, role: "guest" };
  const token = signAuthToken(payload);
  setAuthCookie(res, token);

  return res.status(200).json({ success: true, user: payload });
}


