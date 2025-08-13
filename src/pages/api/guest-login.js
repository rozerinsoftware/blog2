import { setAuthCookie, signAuthToken } from "../../lib/auth";
import cookie from "cookie";

const GUEST_ID_COOKIE = "guest_id";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Var ise mevcut misafir id çerezini kullan, yoksa üret
  const header = req.headers?.cookie || "";
  const parsed = cookie.parse(header);
  const existing = parsed[GUEST_ID_COOKIE] ? Number(parsed[GUEST_ID_COOKIE]) : null;
  const guestId = existing && existing >= 1 && existing <= 4 ? existing : Math.floor(Math.random() * 4) + 1;
  if (!existing) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(GUEST_ID_COOKIE, String(guestId), {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  }
  const payload = { id: guestId, email: null, role: "guest" };
  const token = signAuthToken(payload);
  setAuthCookie(res, token);

  return res.status(200).json({ success: true, user: payload });
}


